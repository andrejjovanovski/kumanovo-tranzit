import { useState } from "react";
import { Footprints, Navigation } from "lucide-react";
import { localizedLine, localizedStopName, minUnit, toMin, toStr } from "@kt/shared";
import type { Line, RawStop } from "@kt/data";
import { useT } from "@/i18n/useT";
import { useLines, useStops } from "@/hooks/useTransitData";
import { BackLink } from "@/components/ui/BackLink";
import { LineBadge } from "@/components/ui/LineBadge";

interface PlannerResult {
  fromName: string;
  toName: string;
  duration: string;
  walk: string;
  line: Line;
  lineNum: string;
  departTime: string;
  arriveTime: string;
}

export function PlannerPage() {
  const { T, lang } = useT();
  const { data: stops } = useStops();
  const { data: lines } = useLines();

  const [from, setFrom] = useState("livade");
  const [to, setTo] = useState("fzc");
  const [time, setTime] = useState("14:00");
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [noRoute, setNoRoute] = useState(false);

  if (!stops || !lines) return null;

  const findRoute = () => {
    const fromStop = stops.find((s) => s.id === from) as RawStop;
    const toStop = stops.find((s) => s.id === to) as RawStop;
    const sharedLine = lines.find((l) => fromStop.lines.includes(l.id) && toStop.lines.includes(l.id));

    if (sharedLine && fromStop.id !== toStop.id) {
      const depMin = toMin(time);
      const sched = sharedLine.schedules.weekday;
      const dep = sched.find((t) => t >= depMin) ?? sched[0];
      const legMin = Math.max(8, Math.floor(Math.abs(fromStop.distanceM - toStop.distanceM) / 40)) + 7;
      const u = minUnit(lang);
      const nm = localizedLine(sharedLine, lang);
      setResult({
        fromName: localizedStopName(fromStop, lang),
        toName: localizedStopName(toStop, lang),
        duration: `${legMin + 3} ${u}`,
        walk: `3 ${u}`,
        line: sharedLine,
        lineNum: sharedLine.num,
        departTime: toStr(dep),
        arriveTime: toStr(dep + legMin),
      });
      setNoRoute(false);
      void nm;
    } else {
      setResult(null);
      setNoRoute(true);
    }
  };

  const stopOptions = [...stops].sort((a, b) => localizedStopName(a, lang).localeCompare(localizedStopName(b, lang)));

  const reset = () => {
    setResult(null);
    setNoRoute(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 560 }}>
      <BackLink to="/" />
      <h2 style={{ margin: 0 }}>{T.findRoute}</h2>
      <div className="hr" style={{ margin: 0 }} />

      <div className="field">
        <label>{T.from}</label>
        <select className="input" value={from} onChange={(e) => { setFrom(e.target.value); reset(); }}>
          {stopOptions.map((s) => (
            <option key={s.id} value={s.id}>{localizedStopName(s, lang)}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>{T.to}</label>
        <select className="input" value={to} onChange={(e) => { setTo(e.target.value); reset(); }}>
          {stopOptions.map((s) => (
            <option key={s.id} value={s.id}>{localizedStopName(s, lang)}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>{T.departure}</label>
        <input className="input" type="time" value={time} onChange={(e) => { setTime(e.target.value); reset(); }} />
      </div>

      <button className="btn btn-primary" onClick={findRoute}>
        <Navigation size={15} />
        {T.findRoute}
      </button>

      {result && (
        <div className="card elev-md">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="card-title">{result.fromName} → {result.toName}</div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18 }}>{result.duration}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, opacity: 0.75 }}>
            <Footprints size={14} />
            {T.walk} {result.walk}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LineBadge num={result.lineNum} badge={result.line.badge} size={30} fontSize={14} />
            <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 13 }}>
              <span>{result.fromName} — {result.departTime}</span>
              <span style={{ opacity: 0.5 }}>↓</span>
              <span>{result.toName} — {result.arriveTime}</span>
            </div>
          </div>
        </div>
      )}

      {noRoute && (
        <div className="card" style={{ alignItems: "center", textAlign: "center", padding: "var(--space-6)" }}>{T.noRoute}</div>
      )}
    </div>
  );
}
