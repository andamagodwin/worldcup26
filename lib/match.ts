import type { Game, MatchType } from './types';

/** Match lifecycle, scorers and stage helpers. */

export type MatchState = 'finished' | 'live' | 'upcoming';

export function matchState(g: Game): MatchState {
  if (g.finished === 'TRUE') return 'finished';
  if (g.time_elapsed && g.time_elapsed !== 'notstarted') return 'live';
  return 'upcoming';
}

/** The live minute label, e.g. "67'" or "HT". Falls back to the raw value. */
export function liveLabel(g: Game): string {
  const t = g.time_elapsed;
  if (!t || t === 'notstarted' || t === 'finished') return '';
  if (/^\d+$/.test(t)) return `${t}'`;
  return t.toUpperCase();
}

/**
 * Parse a postgres-style array string like
 *   {"Nestory Irankunda 27'","C. Metcalfe 75'"}
 * into ["Nestory Irankunda 27'", "C. Metcalfe 75'"].
 */
export function parseScorers(raw: string | undefined): string[] {
  if (!raw || raw === 'null' || raw === '{}') return [];
  const inner = raw.trim().replace(/^\{/, '').replace(/\}$/, '');
  if (!inner) return [];
  return inner
    .split(/","|',\s*'/)
    .map((s) => s.replace(/^["']|["']$/g, '').trim())
    .filter(Boolean);
}

const STAGE_LABELS: Record<MatchType, string> = {
  group: 'Group Stage',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-final',
  sf: 'Semi-final',
  third: 'Third Place',
  final: 'Final',
};

export function stageLabel(t: MatchType): string {
  return STAGE_LABELS[t] ?? t;
}

/** Knockout stages in bracket display order. */
export const KNOCKOUT_ORDER: MatchType[] = ['r32', 'r16', 'qf', 'sf', 'final', 'third'];
