import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, LocateFixed, MapPinOff, Navigation, Route as RouteIcon } from "lucide-react";
import {
  activeLinesCount, dayKeyForDate, disruptedCount, greetingFor, localizedStopName,
  monthShort, nextDeparturesForStop, nowLabel as nowLabelFn,
} from "@kt/shared";
import { useT } from "@/i18n/useT";
import { useNow } from "@/hooks/useNow";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useLines, useStops } from "@/hooks/useTransitData";
import { useUIStore } from "@/store/uiStore";
import { toMinutes } from "@/lib/time";
import { Skeleton } from "@/components/ui/Skeleton";
import { HomeSearch } from "./HomeSearch";
import { NearbyStopCard } from "./NearbyStopCard";
import { PopularLineCard } from "./PopularLineCard";

export function HomePage() {
  const { T, lang } = useT();
  const { isMobile } = useBreakpoint();
  const now = useNow();
  const navigate = useNavigate();
  const { data: lines } = useLines();
  const { data: stops } = useStops();
  const locationDenied = useUIStore((s) => s.locationDenied);
  const enableLocation = useUIStore((s) => s.enableLocation);

  // Brief skeleton on first paint, matching the prototype.
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(id);
  }, []);

  const nowMin = toMinutes(now);
  const day = dayKeyForDate(now);

  const activeCount = lines ? activeLinesCount(lines, nowMin) : 0;
  const disrupted = lines ? disruptedCount(lines) : 0;

  const nearby = (() => {
    if (!stops) return [];
    const sorted = locationDenied
      ? [...stops].sort((a, b) => localizedStopName(a, lang).localeCompare(localizedStopName(b, lang)))
      : [...stops].sort((a, b) => a.distanceM - b.distanceM);
    return sorted.slice(0, 3);
  })();

  const heroNext = (() => {
    if (locationDenied || !stops || !lines) return null;
    const nearest = [...stops].sort((a, b) => a.distanceM - b.distanceM)[0];
    const dep = nextDeparturesForStop(nearest, lines, day, nowMin, 1)[0];
    if (!dep) return null;
    return { stopName: localizedStopName(nearest, lang), lineNum: dep.lineNum, time: dep.time };
  })();

  const popular = (lines ?? []).slice(0, 5);
  // On desktop, cap each stat card's width so a lone card stays compact instead
  // of stretching to a quarter of the page.
  const dashCols = isMobile ? "repeat(2,1fr)" : "repeat(auto-fit, minmax(180px, 220px))";
  const homeGridCols = isMobile ? "1fr" : "1.1fr 1fr";
  // Popular lines live in the narrower right column — a single column keeps the
  // from→to labels on one line instead of wrapping awkwardly.
  const lineCardCols = "1fr";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Page heading — visually hidden (design leads with the greeting) but a
          real H1 for SEO + screen readers, carrying the primary search term. */}
      <h1 className="sr-only">Јавен превоз во Куманово — линии, возен ред и постојки</h1>
      {/* Greeting header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, flex: "none", border: "2px solid var(--color-divider)", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{now.getDate()}</span>
            <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.6 }}>{monthShort(now, lang)}</span>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26 }}>{greetingFor(now, T)}</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>{nowLabelFn(now, lang)}</div>
          </div>
        </div>

        {/* Dashboard stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: dashCols, gap: "var(--space-3)" }}>
          <div className="card elev-md" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="card-kicker">{T.navLines}</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22 }}>{activeCount}/{lines?.length ?? 0}</div>
            </div>
            <RouteIcon size={20} style={{ opacity: 0.35 }} />
          </div>

          {disrupted > 0 && (
            <div className="card elev-md" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", background: "var(--color-accent-100)" }}>
              <div>
                <div className="card-kicker">{T.disruptions}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "var(--color-accent-800)" }}>{disrupted}</div>
              </div>
              <AlertTriangle size={20} color="var(--color-accent-700)" />
            </div>
          )}

          {heroNext && (
            <div className="card elev-md" style={{ background: "var(--color-neutral-900)", color: "#fff" }}>
              <div className="card-kicker" style={{ color: "var(--color-accent-300)" }}>{heroNext.stopName}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 26 }}>{heroNext.time}</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>{T.line} {heroNext.lineNum}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search + Find route */}
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "flex-start", maxWidth: isMobile ? undefined : 640, width: "100%" }}>
        <HomeSearch />
        <button className="btn btn-secondary" style={{ height: 52, flex: "none" }} onClick={() => navigate("/planner")}>
          <Navigation size={15} />
          {T.findRoute}
        </button>
      </div>

      {/* Two columns: nearby stops + popular lines */}
      <div style={{ display: "grid", gridTemplateColumns: homeGridCols, gap: "var(--space-6)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>{T.nearbyStops}</h3>
            {locationDenied && (
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={enableLocation}>
                <LocateFixed size={14} />
                {T.enableLocation}
              </button>
            )}
          </div>

          {locationDenied && (
            <div className="card" style={{ background: "var(--color-neutral-100)", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <MapPinOff size={18} color="var(--color-accent-700)" style={{ flex: "none" }} />
              <div style={{ fontSize: 12, opacity: 0.8 }}>{T.locationDenied}</div>
            </div>
          )}

          {loading || !stops || !lines ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <>
              {nearby.map((stop) => (
                <NearbyStopCard key={stop.id} stop={stop} lines={lines} showDistance={!locationDenied} />
              ))}
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/stops"); }} style={{ fontSize: 13, fontWeight: 600 }}>
                {T.viewAll} →
              </a>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", borderLeft: isMobile ? "none" : "2px solid var(--color-divider)", paddingLeft: isMobile ? 0 : "var(--space-6)" }}>
          <h3 style={{ margin: 0 }}>{T.popularLines}</h3>
          <div style={{ display: "grid", gridTemplateColumns: lineCardCols, gap: "var(--space-3)" }}>
            {popular.map((l) => (
              <PopularLineCard key={l.id} line={l} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
