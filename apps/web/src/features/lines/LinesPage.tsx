import { useState } from "react";
import { BusFront } from "lucide-react";
import { isLineActive } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { useNow } from "@/hooks/useNow";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useLines } from "@/hooks/useTransitData";
import { toMinutes } from "@/lib/time";
import { LineCard } from "@/components/transit/LineCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

type Filter = "all" | "active" | "weekday" | "weekend";

export function LinesPage() {
  const { T } = useT();
  const { isMobile, isTablet } = useBreakpoint();
  const now = useNow();
  const { data: lines, isLoading } = useLines();
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: T.allLines },
    { key: "active", label: T.activeNow },
    { key: "weekday", label: T.weekday },
    { key: "weekend", label: T.weekend },
  ];

  // Only the "active now" filter narrows the list (matches the prototype).
  const shown = (lines ?? []).filter((l) => (filter === "active" ? isLineActive(l, toMinutes(now)) : true));
  const cols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h1 className="sr-only">Автобуски линии во Куманово — јавен превоз</h1>
      <h2 style={{ margin: 0 }}>{T.navLines}</h2>
      <div className="hr" style={{ margin: 0 }} />

      <div className="seg">
        {filters.map((f) => (
          <label key={f.key} className="seg-opt">
            <input type="radio" name="lfilter" checked={filter === f.key} onChange={() => setFilter(f.key)} />
            {f.label}
          </label>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: "var(--space-3)" }}>
          <Skeleton height={150} />
          <Skeleton height={150} />
        </div>
      ) : shown.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: "var(--space-3)" }}>
          {shown.map((l) => (
            <LineCard key={l.id} line={l} />
          ))}
        </div>
      ) : (
        <EmptyState icon={BusFront} message={T.noResults} />
      )}
    </div>
  );
}
