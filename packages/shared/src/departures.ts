import type { Line, RawStop, DayKey } from "@kt/data";
import { toMin, toStr } from "@kt/data";
import { statusFor, type Status } from "./status";

export interface Departure {
  lineId: string;
  lineNum: string;
  time: string; // HH:MM
  min: number;
  status: Status;
  /** This specific trip skips one or more stops. */
  notAllStops: boolean;
}

const skipsStops = (line: Line, time: string): boolean =>
  !!(line.tripInfo && line.tripInfo[time] && (line.tripInfo[time].skipIds?.length ?? 0) > 0);

/** Next departure per line serving `stop`, soonest first, up to `count`. */
export function nextDeparturesForStop(
  stop: RawStop,
  lines: Line[],
  day: DayKey,
  nowMin: number,
  count: number,
): Departure[] {
  const items: Departure[] = [];
  for (const lid of stop.lines) {
    const line = lines.find((l) => l.id === lid);
    if (!line) continue;
    const sched = line.schedules[day];
    for (const t of sched) {
      const st = statusFor(line, t, nowMin);
      if (st) {
        const time = toStr(t);
        items.push({ lineId: line.id, lineNum: line.num, time, min: t, status: st, notAllStops: skipsStops(line, time) });
        break;
      }
    }
  }
  items.sort((a, b) => a.min - b.min);
  return items.slice(0, count);
}

/** Next `count` upcoming departures for a single line (forward direction). */
export function upcomingForLine(line: Line, day: DayKey, nowMin: number, count: number): Departure[] {
  const out: Departure[] = [];
  for (const t of line.schedules[day]) {
    const st = statusFor(line, t, nowMin);
    if (!st) continue;
    const time = toStr(t);
    out.push({ lineId: line.id, lineNum: line.num, time, min: t, status: st, notAllStops: skipsStops(line, time) });
    if (out.length >= count) break;
  }
  return out;
}

/** Lines currently in service (between first and last, not disrupted). */
export function activeLinesCount(lines: Line[], nowMin: number): number {
  return lines.filter((l) => nowMin >= toMin(l.first) && nowMin <= toMin(l.last) && !l.disrupted).length;
}

export function disruptedCount(lines: Line[]): number {
  return lines.filter((l) => l.disrupted).length;
}

export const isLineActive = (line: Line, nowMin: number): boolean =>
  nowMin >= toMin(line.first) && nowMin <= toMin(line.last) && !line.disrupted;

/** The current day-of-week bucket used for timetables. */
export function dayKeyForDate(d: Date): DayKey {
  const dow = d.getDay();
  return dow === 0 ? "sunday" : dow === 6 ? "weekend" : "weekday";
}
