import { useMemo, useState } from "react";
import { MapPinX } from "lucide-react";
import { localizedStopName } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useLines, useStops } from "@/hooks/useTransitData";
import { StopListCard } from "@/components/transit/StopListCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export function StopsPage() {
  const { T, lang } = useT();
  const { isMobile, isTablet } = useBreakpoint();
  const { data: stops, isLoading } = useStops();
  const { data: lines } = useLines();

  const [search, setSearch] = useState("");
  const [lineFilter, setLineFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (stops ?? [])
      .filter((s) => {
        const matchesFilter = lineFilter === "all" || s.lines.includes(lineFilter);
        const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => localizedStopName(a, lang).localeCompare(localizedStopName(b, lang)));
  }, [stops, search, lineFilter, lang]);

  const chips = [{ id: "all", label: T.allLines }, ...(lines ?? []).map((l) => ({ id: l.id, label: l.num }))];
  const cols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h1 className="sr-only">Автобуски постојки во Куманово — јавен превоз</h1>
      <h2 style={{ margin: 0 }}>{T.navStops}</h2>
      <div className="hr" style={{ margin: 0 }} />

      <div className="field" style={{ maxWidth: 420 }}>
        <input className="input" placeholder={T.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {chips.map((c) => {
          const active = lineFilter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setLineFilter(c.id)}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 30, height: 30,
                padding: "0 8px", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 12, cursor: "pointer",
                background: active ? "var(--color-text)" : "var(--color-neutral-100)",
                color: active ? "#fff" : "var(--color-text)",
                border: active ? "none" : "1px solid var(--color-divider)",
                borderRadius: 999,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: "var(--space-3)" }}>
          <Skeleton height={90} />
          <Skeleton height={90} />
          <Skeleton height={90} />
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: "var(--space-3)" }}>
          {filtered.map((s) => (
            <StopListCard key={s.id} stop={s} lines={lines ?? []} />
          ))}
        </div>
      ) : (
        <EmptyState icon={MapPinX} message={T.noResults} />
      )}
    </div>
  );
}
