import { AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react";
import { localizedStopName, WARN_BG, WARN_COLOR } from "@kt/shared";
import type { RawStop } from "@kt/data";
import { useT } from "@/i18n/useT";

/** A single expandable schedule row. Collapsed: time + status. Expanded:
 *  either "stops everywhere" or the list of skipped stops. */
export function ScheduleRow({
  time,
  statusLabel,
  statusBg,
  statusColor,
  isNext,
  skipIds,
  stops,
  expanded,
  onToggle,
}: {
  time: string;
  statusLabel: string;
  statusBg: string;
  statusColor: string;
  isNext: boolean;
  skipIds: string[];
  stops: RawStop[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const { T, lang } = useT();
  const allStops = skipIds.length === 0;
  const warn = !allStops;
  const bg = warn ? WARN_BG : statusBg;
  const color = warn ? WARN_COLOR : statusColor;
  const label = warn ? T.notAllStops : statusLabel;
  const skippedNames = skipIds
    .map((id) => stops.find((s) => s.id === id))
    .filter((s): s is RawStop => !!s)
    .map((s) => localizedStopName(s, lang));

  return (
    <div style={{ borderBottom: "1px solid var(--color-divider)" }}>
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "10px 4px", cursor: "pointer",
          ...(isNext ? { background: "var(--color-accent-100)" } : {}),
        }}
      >
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, minWidth: 56 }}>{time}</span>
        {warn ? (
          <span style={{ display: "inline-flex", alignItems: "center", padding: 4, background: bg, color, borderRadius: 6 }}>
            <AlertTriangle size={13} />
          </span>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", background: bg, color, borderRadius: 999 }}>{label}</span>
        )}
        {expanded ? (
          <ChevronUp size={16} style={{ marginLeft: "auto", opacity: 0.5 }} />
        ) : (
          <ChevronDown size={16} style={{ marginLeft: "auto", opacity: 0.5 }} />
        )}
      </div>

      {expanded && (
        <div style={{ padding: "0 4px 12px 4px", fontSize: 13 }}>
          {allStops ? (
            <div style={{ opacity: 0.75 }}>{T.stopsAllStations}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontWeight: 700, opacity: 0.75 }}>{T.doesNotStopAt}</div>
              {skippedNames.map((nm) => (
                <div key={nm} style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.7 }}>
                  <X size={13} style={{ flex: "none" }} />
                  {nm}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
