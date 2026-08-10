import { useNavigate, useParams } from "react-router-dom";
import { Map as MapIcon } from "lucide-react";
import { dayKeyForDate, formatDistance, formatWalk, localizedLine, localizedStopName, toStr } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { useNow } from "@/hooks/useNow";
import { useLines, useStop } from "@/hooks/useTransitData";
import { toMinutes } from "@/lib/time";
import { badgesForLineIds } from "@/lib/badges";
import { BackLink } from "@/components/ui/BackLink";
import { StopBadges } from "@/components/transit/StopBadges";
import { LineBadge } from "@/components/ui/LineBadge";

export function StopDetailPage() {
  const { id } = useParams();
  const { T, lang } = useT();
  const navigate = useNavigate();
  const now = useNow();
  const { data: stop } = useStop(id);
  const { data: lines } = useLines();

  if (!stop || !lines) return null;

  const nowMin = toMinutes(now);
  const day = dayKeyForDate(now);
  const badges = badgesForLineIds(stop.lines, lines);

  const byLine = stop.lines
    .map((lid) => lines.find((l) => l.id === lid))
    .filter((l): l is NonNullable<typeof l> => !!l)
    .map((line) => {
      const nm = localizedLine(line, lang);
      const times: number[] = [];
      for (const t of line.schedules[day]) {
        if (t >= nowMin - 3) times.push(t);
        if (times.length >= 3) break;
      }
      return { line, nm, times };
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 760 }}>
      <BackLink to="/stops" />
      <div>
        <h2 style={{ margin: 0 }}>{localizedStopName(stop, lang)}</h2>
        <div style={{ fontSize: 12, opacity: 0.65 }}>
          {formatDistance(stop.distanceM, lang)} · {formatWalk(stop.distanceM, lang)}
        </div>
      </div>

      <StopBadges badges={badges} size={26} />

      <button className="btn btn-secondary" style={{ alignSelf: "flex-start" }} onClick={() => navigate("/map")}>
        <MapIcon size={15} />
        {T.viewOnMap}
      </button>

      <div className="hr" style={{ margin: 0 }} />
      <h4 style={{ margin: 0 }}>{T.upcoming}</h4>

      {byLine.map(({ line, nm, times }) => (
        <div key={line.id} className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LineBadge num={line.num} badge={line.badge} size={30} fontSize={14} />
            <div>
              <span style={{ fontWeight: 700, fontSize: 13 }}>
                {nm.from} → {nm.to}
              </span>
              <div style={{ fontSize: 10, opacity: 0.55 }}>{nm.company}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 4 }}>
            {times.map((t, i) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, padding: "2px 6px", borderRadius: 6,
                  ...(i === 0 ? { background: "var(--color-neutral-900)", color: "#fff" } : {}),
                }}
              >
                {toStr(t)}
              </span>
            ))}
          </div>
        </div>
      ))}

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/schedule?line=${stop.lines[0]}`);
        }}
        style={{ fontSize: 13, fontWeight: 600 }}
      >
        {T.fullSchedule} →
      </a>
    </div>
  );
}
