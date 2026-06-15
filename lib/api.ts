import type { Game, Group, Stadium, Team } from './types';

const BASE = 'https://worldcup26.ir';

// The public API is occasionally flaky (intermittent 500s / timeouts from the
// shared host), so every request is wrapped in a small retry-with-backoff.
async function getJSON<T>(path: string, attempts = 4): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
      return (await res.json()) as T;
    } catch (err) {
      lastErr = err;
      // backoff: 0.4s, 0.8s, 1.6s ...
      await new Promise((r) => setTimeout(r, 400 * 2 ** i));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(`Failed to fetch ${path}`);
}

export const api = {
  teams: () => getJSON<{ teams: Team[] }>('/get/teams').then((d) => d.teams),
  games: () => getJSON<{ games: Game[] }>('/get/games').then((d) => d.games),
  groups: () => getJSON<{ groups: Group[] }>('/get/groups').then((d) => d.groups),
  stadiums: () =>
    getJSON<{ stadiums: Stadium[] }>('/get/stadiums').then((d) => d.stadiums),
};
