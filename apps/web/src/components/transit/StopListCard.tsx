import { useNavigate } from "react-router-dom";
import type { Line, RawStop } from "@kt/data";
import { dayKeyForDate, formatDistance, localizedStopName, nextDeparturesForStop } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { useNow } from "@/hooks/useNow";
import { toMinutes } from "@/lib/time";
import { badgesForLineIds } from "@/lib/badges";
import { StopBadges } from "./StopBadges";

/** Stop card used on the Stops list: name, distance, line badges and the next
 *  few departure times. */
export function StopListCard({ stop, lines }: { stop: RawStop; lines: Line[] }) {
  const { lang } = useT();
  const navigate = useNavigate();
  const now = useNow();

  const day = dayKeyForDate(now);
  const deps = nextDeparturesForStop(stop, lines, day, toMinutes(now), 3);
  const badges = badgesForLineIds(stop.lines, lines);

  return (
    <div className="card elev-md" style={{ cursor: "pointer" }} onClick={() => navigate(`/stops/${stop.id}`)}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="card-title">{localizedStopName(stop, lang)}</div>
        <span style={{ fontSize: 11, opacity: 0.6 }}>{formatDistance(stop.distanceM, lang)}</span>
      </div>
      <StopBadges badges={badges} size={20} />
      <div style={{ display: "flex", gap: 10, fontSize: 12, flexWrap: "wrap" }}>
        {deps.map((d) => (
          <span key={d.lineId + d.time} style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>
            {d.time}
          </span>
        ))}
      </div>
    </div>
  );
}
