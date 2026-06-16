/** Coerce the API's stringly-typed numbers into real numbers. */
export function num(s: string | number | undefined): number {
  const n = typeof s === 'number' ? s : parseInt(s ?? '0', 10);
  return Number.isFinite(n) ? n : 0;
}
