/**
 * Data access seam.
 *
 * TODAY: transit data ships as JSON, imported at build time so it is bundled
 * and minified into the app's JS chunks (never served as a raw, guessable
 * `/data.json`). Every read is validated with Zod, so malformed hand-entered
 * data fails loudly during development.
 *
 * LATER: to move the data behind a real backend (e.g. a Vercel Edge Function
 * or the future `apps/api`), swap the bodies of the functions below for
 * `fetch('/api/lines')` etc. Nothing else in the app changes — pages and
 * hooks only ever call this module.
 */
import linesJson from "./lines.json";
import stopsJson from "./stops.json";
import neighborhoodsJson from "./neighborhoods.json";
import { linesSchema, stopsSchema, neighborhoodsSchema } from "./schemas";
import type { RawStop, Neighborhood } from "./schemas";
import { deriveLine, type Line } from "./derive";

// Validate + derive once at module load (data is static for the bundled case).
const stops: RawStop[] = stopsSchema.parse(stopsJson);
const lines: Line[] = linesSchema.parse(linesJson).map(deriveLine);
const neighborhoods: Neighborhood[] = neighborhoodsSchema.parse(neighborhoodsJson);

// Async signatures on purpose: the API-backed implementation will be async,
// so callers are already written against a Promise-returning contract.
export async function getLines(): Promise<Line[]> {
  return lines;
}

export async function getLineById(id: string): Promise<Line | undefined> {
  return lines.find((l) => l.id === id);
}

export async function getStops(): Promise<RawStop[]> {
  return stops;
}

export async function getStopById(id: string): Promise<RawStop | undefined> {
  return stops.find((s) => s.id === id);
}

export async function getNeighborhoods(): Promise<Neighborhood[]> {
  return neighborhoods;
}
