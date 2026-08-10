import type { Lang } from "./i18n/tr";

/** Human distance from metres, matching the reference prototype's style:
 *  "100 м" / "1.4 км" (mk) and "100 m" / "1.4 km" (en/sq). */
export function formatDistance(distanceM: number, lang: Lang): string {
  const isMk = lang === "mk";
  if (distanceM < 1000) return `${distanceM} ${isMk ? "м" : "m"}`;
  return `${(distanceM / 1000).toFixed(1)} ${isMk ? "км" : "km"}`;
}

/** Approx walking time from metres (~5 km/h → ~12 min/km). */
export function formatWalk(distanceM: number, lang: Lang): string {
  const mins = Math.round((distanceM / 1000) * 12);
  return `${mins} ${lang === "mk" ? "мин" : "min"}`;
}

/** Short "minutes" unit for inline labels. */
export const minUnit = (lang: Lang): string => (lang === "mk" ? "мин" : "min");
