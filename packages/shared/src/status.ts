import type { Line } from "@kt/data";
import type { Lang } from "./i18n/tr";
import type { Strings } from "./i18n/strings";
import { minUnit } from "./format";

export type StatusKind = "disrupted" | "delayed" | "arriving" | "onTime";
export interface Status {
  kind: StatusKind;
  mins?: number;
}

export interface StatusVisual {
  label: string;
  bg: string;
  color: string;
}

/** Departure status relative to "now". Returns null for departures that have
 *  already passed (>3 min ago). Deterministic pseudo-variation for delays,
 *  mirroring the reference prototype so screens match. */
export function statusFor(line: Line, timeMin: number, nowMin: number): Status | null {
  if (line.disrupted) return { kind: "disrupted" };
  const diff = timeMin - nowMin;
  if (diff < -3) return null;
  const seed = (timeMin + parseInt(line.num, 10)) % 11;
  if (seed === 0) return { kind: "delayed", mins: 6 };
  if (diff <= 4) return { kind: "arriving", mins: Math.max(diff, 0) };
  return { kind: "onTime" };
}

/** Map a status to its pill label + colors for the given language. */
export function statusVisual(status: Status | null, lang: Lang, T: Strings): StatusVisual {
  if (!status) return { label: "", bg: "transparent", color: "var(--color-text)" };
  const u = minUnit(lang);
  if (status.kind === "disrupted")
    return { label: T.disrupted, bg: "var(--color-accent-100)", color: "var(--color-accent-800)" };
  if (status.kind === "delayed")
    return { label: `${T.delayed} ${status.mins} ${u}`, bg: "var(--color-accent-100)", color: "var(--color-accent-800)" };
  if (status.kind === "arriving")
    return {
      label: status.mins && status.mins > 0 ? `${T.arriving} ${status.mins} ${u}` : T.arriving,
      bg: "var(--color-neutral-900)",
      color: "#fff",
    };
  return { label: T.onTime, bg: "var(--color-neutral-100)", color: "var(--color-neutral-800)" };
}

/** Amber "skips some stops" warning colors, matching the prototype. */
export const WARN_BG = "oklch(0.94 0.06 80)";
export const WARN_COLOR = "oklch(0.45 0.13 70)";
