import { LineBadge } from "@/components/ui/LineBadge";
import type { LineBadgeData } from "@/lib/badges";

/** A row of small circular line badges for a stop. */
export function StopBadges({ badges, size = 22 }: { badges: LineBadgeData[]; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {badges.map((b) => (
        <LineBadge key={b.id} num={b.num} badge={b.badge} size={size} fontSize={Math.round(size * 0.5)} />
      ))}
    </div>
  );
}
