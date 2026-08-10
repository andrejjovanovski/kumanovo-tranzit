import { useEffect, useState } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export interface BreakpointInfo {
  vw: number;
  bp: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const compute = (vw: number): Breakpoint =>
  vw < 640 ? "mobile" : vw < 1100 ? "tablet" : "desktop";

/** Track viewport width and derive the app's three breakpoints,
 *  matching the prototype (mobile <640, tablet <1100, desktop ≥1100). */
export function useBreakpoint(): BreakpointInfo {
  const [vw, setVw] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1280));
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const bp = compute(vw);
  return { vw, bp, isMobile: bp === "mobile", isTablet: bp === "tablet", isDesktop: bp === "desktop" };
}
