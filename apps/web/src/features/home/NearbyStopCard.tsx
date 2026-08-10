import { useNavigate } from "react-router-dom";
import { Footprints } from "lucide-react";
import type { Line, RawStop } from "@kt/data";
import { dayKeyForDate, formatDistance, formatWalk, localizedStopName, nextDeparturesForStop } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { useNow } from "@/hooks/useNow";
import { toMinutes } from "@/lib/time";
import { badgesForLineIds } from "@/lib/badges";
import { StopBadges } from "@/components/transit/StopBadges";
import { DepartureStatus } from "@/components/ui/DepartureStatus";

/** Home "nearby stop" card: name, distance, badges and per-line next
 *  departures with status. */
export function NearbyStopCard({ stop, lines, showDistance }: { stop: RawStop; lines: Line[]; showDistance: boolean }) {
  const { T, lang } = useT();
  const navigate = useNavigate();
  const now = useNow();

  const day = dayKeyForDate(now);
  const deps = nextDeparturesForStop(stop, lines, day, toMinutes(now), 3);
  const badges = badgesForLineIds(stop.lines, lines);

  return (
    <div className="card elev-md" style={{ cursor: "pointer" }} onClick={() => navigate(`/stops/${stop.id}`)}>
      <div className="card-title">{localizedStopName(stop, lang)}</div>
      <div className="card-meta">
        <Footprints size={12} />
        {showDistance ? formatDistance(stop.distanceM, lang) : "—"} · {formatWalk(stop.distanceM, lang)}
      </div>
      <StopBadges badges={badges} size={22} />
      {deps.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 2 }}>
          {deps.map((d) => (
            <div key={d.lineId + d.time} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
              <span>{T.line} {d.lineNum}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-heading)", fontWeight: 800 }}>
                {d.time}
                <DepartureStatus dep={d} />
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 12, opacity: 0.65 }}>{T.lastBusToday}</div>
      )}
    </div>
  );
}
