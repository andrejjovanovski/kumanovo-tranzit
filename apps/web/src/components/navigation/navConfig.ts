import type { LucideIcon } from "lucide-react";
import { CalendarClock, Home, Map, MapPin, Route } from "lucide-react";
import type { Strings } from "@kt/shared";

export interface NavDef {
  key: string;
  to: string;
  icon: LucideIcon;
  label: (T: Strings) => string;
  /** Extra path prefixes that should mark this tab active. */
  matches: string[];
  /** Rendered as the raised center FAB in the mobile bar. */
  fab?: boolean;
}

export const NAV: NavDef[] = [
  { key: "home", to: "/", icon: Home, label: (T) => T.navHome, matches: [] },
  { key: "lines", to: "/lines", icon: Route, label: (T) => T.navLines, matches: ["/lines"] },
  { key: "schedule", to: "/schedule", icon: CalendarClock, label: (T) => T.navSchedule, matches: ["/schedule", "/planner"], fab: true },
  { key: "stops", to: "/stops", icon: MapPin, label: (T) => T.navStops, matches: ["/stops"] },
  { key: "map", to: "/map", icon: Map, label: (T) => T.navMap, matches: ["/map"] },
];

export function isNavActive(def: NavDef, pathname: string): boolean {
  if (def.to === "/") return pathname === "/";
  return def.matches.some((m) => pathname === m || pathname.startsWith(m + "/"));
}
