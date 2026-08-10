import { statusVisual, WARN_BG, WARN_COLOR, type Departure, type Lang, type Strings } from "@kt/shared";

export interface DepartureVisual {
  label: string;
  bg: string;
  color: string;
  /** True when the trip skips stops — shown as an amber warning icon. */
  warning: boolean;
}

/** Resolve a departure's status into pill label + colors, giving the
 *  "skips some stops" warning precedence over the normal status label. */
export function departureVisual(dep: Departure, lang: Lang, T: Strings): DepartureVisual {
  if (dep.notAllStops) {
    return { label: T.notAllStops, bg: WARN_BG, color: WARN_COLOR, warning: true };
  }
  const v = statusVisual(dep.status, lang, T);
  return { label: v.label, bg: v.bg, color: v.color, warning: false };
}
