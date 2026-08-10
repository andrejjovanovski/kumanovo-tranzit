import { useEffect } from "react";
import { useLines, useStops } from "@/hooks/useTransitData";
import { hideSplash } from "@/lib/splash";

/** Keeps the boot splash up until the core data has loaded and fonts are ready,
 *  so the app never reveals a half-painted / unstyled first frame. Renders
 *  nothing. A hard cap in main.tsx guarantees the splash never hangs. */
export function SplashGate() {
  const lines = useLines();
  const stops = useStops();
  const dataReady = !lines.isLoading && !stops.isLoading;

  useEffect(() => {
    if (!dataReady) return;
    let cancelled = false;
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    // Don't wait forever on fonts — cap it so the splash always lifts.
    Promise.race([fontsReady, new Promise((r) => window.setTimeout(r, 1500))]).then(() => {
      if (!cancelled) hideSplash();
    });
    return () => {
      cancelled = true;
    };
  }, [dataReady]);

  return null;
}
