/** Time helpers shared by data derivation and the app.
 *  Minutes are "minutes since midnight" (0–1439). */

export const pad = (n: number): string => (n < 10 ? "0" + n : "" + n);

/** "HH:MM" -> minutes since midnight. */
export const toMin = (s: string): number => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

/** minutes since midnight -> "HH:MM" (wraps across midnight). */
export const toStr = (m: number): string => {
  m = ((m % 1440) + 1440) % 1440;
  return pad(Math.floor(m / 60)) + ":" + pad(m % 60);
};

/** Build an evenly-spaced schedule (minutes) between first/last at `freq`. */
export const buildSched = (first: string, last: string, freq: number): number[] => {
  const a: number[] = [];
  let t = toMin(first);
  const end = toMin(last);
  while (t <= end) {
    a.push(t);
    t += freq;
  }
  return a;
};
