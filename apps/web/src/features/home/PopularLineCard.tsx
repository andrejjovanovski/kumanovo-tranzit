import { useNavigate } from "react-router-dom";
import type { Line } from "@kt/data";
import { frequencyLabel, localizedLine } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { LineBadge } from "@/components/ui/LineBadge";

/** Compact line card for the Home "popular lines" column. */
export function PopularLineCard({ line }: { line: Line }) {
  const { lang } = useT();
  const navigate = useNavigate();
  const nm = localizedLine(line, lang);

  return (
    <div
      className="card elev-md"
      style={{ cursor: "pointer", flexDirection: "row", alignItems: "center", gap: 12 }}
      onClick={() => navigate(`/lines/${line.id}`)}
    >
      <LineBadge num={line.num} badge={line.badge} size={44} fontSize={20} />
      <div>
        <div style={{ fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: 14 }}>
          {nm.from} → {nm.to}
        </div>
        <div style={{ fontSize: 10, opacity: 0.55 }}>{nm.company}</div>
        <div style={{ fontSize: 11, opacity: 0.65 }}>{frequencyLabel(line.freq, lang)}</div>
      </div>
    </div>
  );
}
