import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map as MapIcon, MapPin, Route, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { localizedLine, localizedStopName, tr } from "@kt/shared";
import { useT } from "@/i18n/useT";
import { useLines, useNeighborhoods, useStops } from "@/hooks/useTransitData";

interface Result {
  key: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}

/** Home search box with an inline results dropdown across stops, lines and
 *  neighborhoods. */
export function HomeSearch() {
  const { T, lang } = useT();
  const navigate = useNavigate();
  const { data: stops } = useStops();
  const { data: lines } = useLines();
  const { data: neighborhoods } = useNeighborhoods();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const results: Result[] = [];
  if (q) {
    for (const s of stops ?? []) {
      if (s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q)) {
        results.push({ key: `stop-${s.id}`, icon: MapPin, title: localizedStopName(s, lang), subtitle: T.navStops, onClick: () => navigate(`/stops/${s.id}`) });
      }
    }
    for (const l of lines ?? []) {
      const nm = localizedLine(l, lang);
      if (nm.from.toLowerCase().includes(q) || nm.to.toLowerCase().includes(q) || l.num.includes(q)) {
        results.push({ key: `line-${l.id}`, icon: Route, title: `${T.line} ${l.num} — ${nm.from} → ${nm.to}`, subtitle: T.navLines, onClick: () => navigate(`/lines/${l.id}`) });
      }
    }
    for (const n of neighborhoods ?? []) {
      const nm = tr(lang, n.name, n.nameEn, n.nameSq || n.nameEn);
      if (nm.toLowerCase().includes(q)) {
        results.push({ key: `nb-${nm}`, icon: MapIcon, title: nm, subtitle: T.neighborhood, onClick: () => navigate("/map") });
      }
    }
  }
  const shown = results.slice(0, 6);

  return (
    <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
      <div className="field" style={{ position: "relative", margin: 0 }}>
        <input
          className="input"
          style={{ height: 52, fontSize: 16, paddingLeft: 44, border: "2px solid var(--color-divider)" }}
          placeholder={T.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search size={19} style={{ position: "absolute", left: 14, top: 16, opacity: 0.6 }} />
      </div>
      {q && (
        <div className="card elev-md" style={{ position: "absolute", left: 0, right: 0, top: 56, zIndex: 10, padding: "var(--space-2)", gap: 4 }}>
          {shown.length > 0 ? (
            shown.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.key}
                  onClick={() => { r.onClick(); setQuery(""); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", cursor: "pointer", borderRadius: 8 }}
                >
                  <Icon size={16} style={{ color: "var(--color-accent-600)", flex: "none" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: 11, opacity: 0.65 }}>{r.subtitle}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: 14, fontSize: 13, opacity: 0.7, textAlign: "center" }}>{T.noResults}</div>
          )}
        </div>
      )}
    </div>
  );
}
