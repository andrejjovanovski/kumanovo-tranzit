import type { RawLine, TripInfoMap } from "./schemas";
import { buildSched, toMin, toStr } from "./time";

export type DayKey = "weekday" | "weekend" | "sunday";
export type DaySchedules = Record<DayKey, number[]>;

/** A line with computed timetables attached. This is the domain shape the
 *  app consumes; the JSON stores only raw fields. */
export interface Line extends RawLine {
  schedules: DaySchedules;
  schedulesRev: DaySchedules;
  tripInfoRev: TripInfoMap;
}

/** Expand raw line fields into weekday/weekend/sunday timetables for both
 *  directions. Mirrors the reference prototype exactly. */
export function deriveLine(raw: RawLine): Line {
  let schedules: DaySchedules;
  if (raw.times && raw.times.length) {
    const mins = raw.times.map(toMin).sort((a, b) => a - b);
    schedules = { weekday: mins, weekend: mins, sunday: [] };
  } else {
    schedules = {
      weekday: buildSched(raw.first, raw.last, raw.freq),
      weekend: buildSched(toStr(toMin(raw.first) + 60), toStr(toMin(raw.last) - 90), raw.freq + 10),
      sunday: buildSched(toStr(toMin(raw.first) + 90), toStr(toMin(raw.last) - 120), raw.freq + 20),
    };
  }

  let schedulesRev: DaySchedules;
  if (raw.timesRev && raw.timesRev.length) {
    const minsRev = raw.timesRev.map(toMin).sort((a, b) => a - b);
    schedulesRev = { weekday: minsRev, weekend: minsRev, sunday: [] };
  } else {
    schedulesRev = schedules;
  }

  return {
    ...raw,
    tripInfo: raw.tripInfo ?? {},
    schedules,
    schedulesRev,
    tripInfoRev: raw.tripInfoRev ?? raw.tripInfo ?? {},
  };
}
