/** Minutes since midnight for a Date. */
export const toMinutes = (d: Date): number => d.getHours() * 60 + d.getMinutes();
