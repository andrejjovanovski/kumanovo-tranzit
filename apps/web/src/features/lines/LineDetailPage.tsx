import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarClock, Ticket } from "lucide-react";
import {
  dayKeyForDate, isLineActive, localizedLine, localizedStopName, minUnit, upcomingForLine,
} from "@kt/shared";
import type { Line } from "@kt/data";
import { useT } from "@/i18n/useT";
import { useNow } from "@/hooks/useNow";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useLine, useStops } from "@/hooks/useTransitData";
import { toMinutes } from "@/lib/time";
import { BackLink } from "@/components/ui/BackLink";
import { LineBadge } from "@/components/ui/LineBadge";
import { SegmentedButtons } from "@/components/ui/SegmentedButtons";
import { DepartureStatus } from "@/components/ui/DepartureStatus";

type Direction = "fwd" | "rev";

export function LineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { T, lang } = useT();
  const { isMobile } = useBreakpoint();
  const now = useNow();
  const { data: line } = useLine(id);
  const { data: stops } = useStops();
  const [direction, setDirection] = useState<Direction>("fwd");

  if (!line || !stops) return null;

  const nm = localizedLine(line, lang);
  const nowMin = toMinutes(now);
  const day = dayKeyForDate(now);
  const active = isLineActive(line, nowMin);

  const statusLabel = line.disrupted ? T.disrupted : active ? T.activeNow : T.lastBusToday;
  const statusTagClass = line.disrupted ? "tag-accent" : active ? "tag-outline" : "tag-neutral";

  const orderedIds = direction === "rev" ? [...line.stopIds].reverse() : line.stopIds;
  const upcoming = upcomingForLine(line, day, nowMin, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 760 }}>
      <BackLink to="/lines" />

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <LineBadge num={line.num} badge={line.badge} size={72} fontSize={34} />
        <div>
          <h2 style={{ margin: "0 0 4px" }}>
            {nm.from} → {nm.to}
          </h2>
          <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 6 }}>{nm.company}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span className={`tag ${statusTagClass}`}>{statusLabel}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "#fff", background: "var(--color-accent-600)", padding: "5px 14px", borderRadius: 999 }}>
              <Ticket size={14} />
              {line.price} {T.denar}
            </span>
          </div>
        </div>
      </div>

      <div className="hr" style={{ margin: 0 }} />

      <SegmentedButtons
        value={direction}
        onChange={setDirection}
        fullWidth={false}
        segments={[
          { key: "fwd", label: `${nm.from} → ${nm.to}` },
          { key: "rev", label: `${nm.to} → ${nm.from}` },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: "var(--space-4)" }}>
        <div>
          <h4 style={{ margin: "0 0 var(--space-3)" }}>{T.allStopsOnLine}</h4>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {orderedIds.map((sid, i) => {
              const stop = stops.find((s) => s.id === sid);
              if (!stop) return null;
              const isStart = i === 0;
              const isEnd = i === orderedIds.length - 1;
              const offset = Math.round((i * line.freq) / orderedIds.length);
              const dotBg = isStart || isEnd ? (line.badge.bg === "transparent" ? "var(--color-text)" : line.badge.bg) : "var(--color-neutral-400)";
              return (
                <div key={sid} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 16, flex: "none" }}>
                    <div
                      style={{
                        width: isStart || isEnd ? 14 : 10, height: isStart || isEnd ? 14 : 10, borderRadius: "50%",
                        background: dotBg, border: line.badge.bg === "transparent" ? "2px solid var(--color-text)" : "none", flex: "none",
                      }}
                    />
                    {!isEnd && <div style={{ width: 2, flex: 1, minHeight: 32, background: "var(--color-divider)" }} />}
                  </div>
                  <div style={{ paddingBottom: "var(--space-4)", flex: 1 }}>
                    <div style={{ fontWeight: isStart || isEnd ? 800 : 600, fontSize: 14 }}>{localizedStopName(stop, lang)}</div>
                    <div style={{ fontSize: 11, opacity: 0.6 }}>
                      {isStart ? T.start : isEnd ? T.end : `${T.line} ${line.num}`} · +{offset} {minUnit(lang)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <h4 style={{ margin: 0 }}>{T.upcoming}</h4>
          <div className="card" style={{ gap: "var(--space-2)" }}>
            {upcoming.length > 0 ? (
              upcoming.map((u) => (
                <div key={u.time} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16 }}>
                  <span>{u.time}</span>
                  <DepartureStatus dep={u} />
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, opacity: 0.7 }}>{T.lastBusToday}</div>
            )}
          </div>

          <button
            className="btn btn-primary"
            style={{ justifyContent: "center" }}
            onClick={() => navigate(`/schedule?line=${line.id}`)}
          >
            <CalendarClock size={16} />
            {T.fullSchedule}
          </button>

          <h4 style={{ margin: "var(--space-2) 0 0" }}>{T.routeMap}</h4>
          <RouteMap line={line} />
        </div>
      </div>
    </div>
  );
}

function RouteMap({ line }: { line: Line }) {
  if (line.mapUrl) {
    return (
      <div style={{ width: "100%", height: 280, border: "2px solid var(--color-divider)", overflow: "hidden", borderRadius: "var(--radius-md)" }}>
        <iframe title="Route map" src={line.mapUrl} width="100%" height="100%" style={{ border: 0, display: "block" }} />
      </div>
    );
  }
  return (
    <div
      style={{
        width: "100%", height: 200, border: "2px dashed var(--color-divider)", borderRadius: "var(--radius-md)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "color-mix(in srgb, var(--color-text) 45%, transparent)", fontSize: 13,
      }}
    >
      Route map
    </div>
  );
}
