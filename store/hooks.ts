import { useEffect } from 'react';

import { matchState } from '@/lib/match';

import { useStore } from './store';

/**
 * Loads the tournament data on mount and exposes the request lifecycle.
 * Replaces the `useEffect(load)` + loading/error/refresh boilerplate that was
 * duplicated across every screen.
 */
export function useTournament() {
  const load = useStore((s) => s.load);
  const loading = useStore((s) => s.loading);
  const refreshing = useStore((s) => s.refreshing);
  const error = useStore((s) => s.error);
  const refresh = useStore((s) => s.refresh);

  useEffect(() => {
    load();
  }, [load]);

  return { loading, refreshing, error, refresh, retry: load };
}

export const useLang = () => useStore((s) => s.lang);

export const useTeam = (id?: string) =>
  useStore((s) => (id ? s.teams.find((t) => t.id === id) : undefined));

export const useStadium = (id?: string) =>
  useStore((s) => (id ? s.stadiums.find((x) => x.id === id) : undefined));

/** Number of matches currently in play — drives the Matches header + Live tab. */
export const useLiveCount = () =>
  useStore((s) => s.games.filter((g) => matchState(g) === 'live').length);
