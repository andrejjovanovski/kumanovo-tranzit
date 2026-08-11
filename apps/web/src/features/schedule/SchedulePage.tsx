import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { dayKeyForDate, localizedLine, statusFor, statusVisual, toStr, type DayKey } from "@kt/shared";
import type { Line } from "@kt/data";
import { useT } from "@/i18n/useT";
import { useNow } from "@/hooks/useNow";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useLines, useStops } from "@/hooks/useTransitData";
import { toMinutes } from "@/lib/time";
import { LineBadge } from "@/components/ui/LineBadge";
import { SegmentedButtons } from "@/components/ui/SegmentedButtons";
import { ScheduleRow } from "./ScheduleRow";

type Direction = "fwd" | "rev";

export function SchedulePage() {
  const { T, lang } = useT();
  const { isDesktop } = useBreakpoint();
  const now = useNow();
  const { data: lines } = useLines();
  const { data: stops } = useStops();
  const [params] = useSearchParams();

  const [lineId, setLineId] = useState<string>(params.get("line") ?? "5");
  const [direction, setDirection] = useState<Direction>("fwd");
  const [day, setDay] = useState<DayKey>("weekday");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Follow a ?line= param when arriving from a stop / deep link.
  useEffect(() => {
    const p = params.get("line");
    if (p) setLineId(p);
  }, [params]);

  const line = useMemo<Line | undefined>(
    () => (lines ?? []).find((l) => l.id === lineId) ?? (lines ?? [])[0],
    [lines, lineId],
  );

  if (!line || !lines || !stops) return null;

  const nm = localizedLine(line, lang);
  const today = dayKeyForDate(now);
  const nowMin = toMinutes(now);

  const schedMap = direction === "rev" ? line.schedulesRev : line.schedules;
  const tripMap = direction === "rev" ? line.tripInfoRev : line.tripInfo;
  const times = schedMap[day] ?? [];

  const dayDefs: { key: DayKey; label: string }[] = [
    { key: "weekday", label: T.weekday },
    { key: "weekend", label: T.weekend },
    { key: "sunday", label: T.sunday },
  ];

  // Highlight the first still-to-come departure (only on today's schedule).
  let nextShown = false;

  const selectLine = (id: string) => {
    setLineId(id);
    setExpanded(null);
    setDirection("fwd");
  };

  // One departure row. Shared so the desktop two-column split and the mobile
  // single column render identical rows; `nextShown` is consumed in reading
  // order (column 1 top-to-bottom, then column 2) so the "next" highlight lands
  // on the first upcoming departure.
  const renderRow = (t: number) => {
    const timeStr = toStr(t);
    const status = statusFor(line, t, day === today ? nowMin : -1);
    const v = statusVisual(status, lang, T);
    const isNext = day === today && !nextShown && !!status && status.kind !== "disrupted" && t >= nowMin;
    if (isNext) nextShown = true;
    const trip = tripMap?.[timeStr];
    const skipIds = trip?.skipIds ?? [];
    return (
      <ScheduleRow
        key={timeStr}
        time={timeStr}
        statusLabel={v.label || T.onTime}
        statusBg={v.bg === "transparent" ? "var(--color-neutral-100)" : v.bg}
        statusColor={v.color}
        isNext={isNext}
        skipIds={skipIds}
        stops={stops}
        expanded={expanded === timeStr}
        onToggle={() => setExpanded(expanded === timeStr ? null : timeStr)}
      />
    );
  };

  // On desktop the lines sit in a single strip of exactly two rows.
  const lineCols = Math.ceil(lines.length / 2);
  // On desktop the times are split down the middle into two columns.
  const mid = Math.ceil(times.length / 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: isDesktop ? 1160 : 640 }}>
      <h2 style={{ margin: 0 }}>{T.navSchedule}</h2>
      <div className="hr" style={{ margin: 0 }} />

      {/* Line picker — desktop: a horizontal grid of exactly two rows; mobile:
          a wrapping grid of full-width-ish cards, as before. */}
      <div>
        <label style={{ display: "block", fontSize: 12, marginBottom: 5, color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}>
          {T.navLines}
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? `repeat(${lineCols}, minmax(0, 1fr))` : "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 8,
          }}
        >
          {lines.map((l) => {
            const lnm = localizedLine(l, lang);
            const sel = l.id === line.id;
            return (
              <div
                key={l.id}
                onClick={() => selectLine(l.id)}
                style={{
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  background: sel ? "var(--color-neutral-900)" : "var(--color-surface)",
                  border: sel ? "none" : "1px solid var(--color-divider)",
                }}
              >
                <LineBadge num={l.num} badge={l.badge} size={30} fontSize={13} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2, color: sel ? "#fff" : "var(--color-text)" }}>
                    {lnm.from} → {lnm.to}
                  </div>
                  <div style={{ fontSize: 9, color: sel ? "rgba(255,255,255,0.6)" : "var(--color-neutral-600)" }}>{lnm.company}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters (direction + day) sit directly under the lines. */}
      <SegmentedButtons
        value={direction}
        onChange={(d) => { setDirection(d); setExpanded(null); }}
        segments={[
          { key: "fwd", label: `${nm.from} → ${nm.to}` },
          { key: "rev", label: `${nm.to} → ${nm.from}` },
        ]}
      />

      <SegmentedButtons
        value={day}
        onChange={(d) => { setDay(d); setExpanded(null); }}
        segments={dayDefs.map((d) => ({ key: d.key, label: d.label }))}
      />

      {line.disrupted && (
        <div className="card" style={{ background: "var(--color-accent-100)", flexDirection: "row", gap: 10, alignItems: "center" }}>
          <AlertTriangle size={18} color="var(--color-accent-700)" />
          <div style={{ fontSize: 12, color: "var(--color-accent-800)" }}>{T.disrupted}</div>
        </div>
      )}

      {/* Times — desktop: two columns; mobile: a single column. */}
      {times.length > 0 ? (
        isDesktop ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 var(--space-6)", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>{times.slice(0, mid).map(renderRow)}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>{times.slice(mid).map(renderRow)}</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>{times.map(renderRow)}</div>
        )
      ) : (
        <div className="card" style={{ alignItems: "center", textAlign: "center", padding: "var(--space-6)" }}>{T.noBuses}</div>
      )}
    </div>
  );
}
