import type { GroupRow } from './types';
import { num } from './utils';

/** Sort a group's rows by points, then goal difference, then goals for. */
export function sortGroupRows(rows: GroupRow[]): GroupRow[] {
  return [...rows].sort(
    (a, b) =>
      num(b.pts) - num(a.pts) ||
      num(b.gd) - num(a.gd) ||
      num(b.gf) - num(a.gf)
  );
}

export type QualificationTone = 'qualify' | 'playoff' | 'out';

/**
 * In the 48-team format the top 2 of each group advance directly and the
 * best 8 third-placed teams also progress — so 3rd is "in contention".
 */
export function qualificationTone(position: number): QualificationTone {
  if (position < 2) return 'qualify';
  if (position === 2) return 'playoff';
  return 'out';
}
