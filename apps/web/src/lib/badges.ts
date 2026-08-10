import type { Line } from "@kt/data";
import type { BadgeStyle } from "@/components/ui/LineBadge";

export interface LineBadgeData {
  id: string;
  num: string;
  badge: BadgeStyle;
}

/** Badge data for a single line. */
export const badgeForLine = (line: Line): LineBadgeData => ({
  id: line.id,
  num: line.num,
  badge: line.badge,
});

/** Badge data for a set of line ids, in the given order. */
export function badgesForLineIds(lineIds: string[], lines: Line[]): LineBadgeData[] {
  return lineIds
    .map((id) => lines.find((l) => l.id === id))
    .filter((l): l is Line => !!l)
    .map(badgeForLine);
}
