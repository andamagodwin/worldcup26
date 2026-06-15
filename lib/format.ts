import type { Game, MatchType } from './types';

/** Parse the API's "MM/DD/YYYY HH:mm" local string into a Date. */
export function parseGameDate(local: string): Date {
  const [date, time] = local.split(' ');
  const [mm, dd, yyyy] = date.split('/').map(Number);
  const [h, m] = (time ?? '00:00').split(':').map(Number);
  return new Date(yyyy, mm - 1, dd, h ?? 0, m ?? 0);
}

/** YYYY-MM-DD key (local) used to bucket matches by calendar day. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDayHeader(d: Date): string {
  return `${WEEKDAY[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]}`;
}

export function formatTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}

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

/** Knockout stages in bracket order. */
export const KNOCKOUT_ORDER: MatchType[] = ['r32', 'r16', 'qf', 'sf', 'third', 'final'];

export function num(s: string | number | undefined): number {
  const n = typeof s === 'number' ? s : parseInt(s ?? '0', 10);
  return Number.isFinite(n) ? n : 0;
}
