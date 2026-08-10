import { z } from "zod";

/** A single trip's per-departure metadata (e.g. stops it skips). */
export const tripInfoEntrySchema = z.object({
  skipIds: z.array(z.string()).default([]),
});

/** Raw stop as authored in stops.json. Presentation strings (distance/walk)
 *  are derived at runtime from `distanceM` — see packages/shared/format. */
export const stopSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string(),
  nameSq: z.string(),
  /** Straight-line distance from the rider's reference point, in metres. */
  distanceM: z.number().nonnegative(),
  /** Line ids that serve this stop. */
  lines: z.array(z.string()),
});

const badgeSchema = z.object({
  bg: z.string(),
  color: z.string(),
  border: z.string(),
});

const hhmm = z.string().regex(/^\d{2}:\d{2}$/, "expected HH:MM");

/** Raw line as authored in lines.json. `schedules`/`schedulesRev` are NOT
 *  stored — they are computed in derive.ts. */
export const lineSchema = z.object({
  id: z.string(),
  num: z.string(),
  from: z.string(),
  to: z.string(),
  fromEn: z.string(),
  toEn: z.string(),
  fromSq: z.string(),
  toSq: z.string(),
  first: hhmm,
  last: hhmm,
  /** Fallback frequency (minutes) when explicit `times` are absent. */
  freq: z.number().positive(),
  company: z.string(),
  companyEn: z.string(),
  price: z.number().nonnegative(),
  disrupted: z.boolean().default(false),
  mapUrl: z.string().url().optional(),
  badge: badgeSchema,
  /** Ordered stop ids, forward direction. */
  stopIds: z.array(z.string()),
  /** Explicit forward departures (HH:MM). Optional — otherwise generated. */
  times: z.array(hhmm).optional(),
  /** Explicit reverse departures (HH:MM). Optional — falls back to forward. */
  timesRev: z.array(hhmm).optional(),
  tripInfo: z.record(z.string(), tripInfoEntrySchema).optional(),
  tripInfoRev: z.record(z.string(), tripInfoEntrySchema).optional(),
});

export const neighborhoodSchema = z.object({
  name: z.string(),
  nameEn: z.string(),
  nameSq: z.string(),
});

export const stopsSchema = z.array(stopSchema);
export const linesSchema = z.array(lineSchema);
export const neighborhoodsSchema = z.array(neighborhoodSchema);

export type RawStop = z.infer<typeof stopSchema>;
export type RawLine = z.infer<typeof lineSchema>;
export type Neighborhood = z.infer<typeof neighborhoodSchema>;
export type TripInfoMap = Record<string, z.infer<typeof tripInfoEntrySchema>>;
