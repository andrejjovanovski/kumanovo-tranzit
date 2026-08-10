import { Repeat, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Line } from "@kt/data";
import { frequencyLabel, isLineActive, localizedLine } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { useNow } from "@/hooks/useNow";
import { toMinutes } from "@/lib/time";
import { LineBadge } from "@/components/ui/LineBadge";

/** Full line card used on the Lines list: badge, status tag, price, first/last
 *  bus and frequency. */
export function LineCard({ line }: { line: Line }) {
  const { T, lang } = useT();
  const navigate = useNavigate();
  const now = useNow();
  const nowMin = toMinutes(now);

  const nm = localizedLine(line, lang);
  const active = isLineActive(line, nowMin);
  const statusLabel = line.disrupted ? T.disrupted : active ? T.activeNow : T.lastBusToday;
  const statusTagClass = line.disrupted ? "tag-accent" : active ? "tag-outline" : "tag-neutral";

  return (
    <div className="card elev-md" style={{ cursor: "pointer" }} onClick={() => navigate(`/lines/${line.id}`)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <LineBadge num={line.num} badge={line.badge} size={48} fontSize={22} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span className={`tag ${statusTagClass}`}>{statusLabel}</span>
          <span
            style={{
              display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-heading)", fontWeight: 800,
              fontSize: 15, color: "var(--color-accent-700)", background: "var(--color-accent-100)", padding: "3px 10px", borderRadius: 999,
            }}
          >
            <Ticket size={13} />
            {line.price} {T.denar}
          </span>
        </div>
      </div>
      <div className="card-title">
        {nm.from} → {nm.to}
      </div>
      <div style={{ fontSize: 10, opacity: 0.55, marginTop: -4 }}>{nm.company}</div>
      <div style={{ display: "flex", gap: "var(--space-4)", fontSize: 12, opacity: 0.75 }}>
        <span>{T.firstBus}: {line.first}</span>
        <span>{T.lastBus}: {line.last}</span>
      </div>
      <div className="card-meta">
        <Repeat size={12} />
        {frequencyLabel(line.freq, lang)}
      </div>
    </div>
  );
}
