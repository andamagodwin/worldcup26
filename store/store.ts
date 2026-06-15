import { create } from 'zustand';

import { api } from '@/lib/api';
import type { Game, Group, Stadium, Team } from '@/lib/types';

interface WorldCupState {
  teams: Team[];
  games: Game[];
  groups: Group[];
  stadiums: Stadium[];

  loading: boolean; // first load only
  refreshing: boolean; // pull-to-refresh / poll
  error: string | null;
  lastUpdated: number | null;

  favorites: Set<string>; // team ids (in-memory)

  load: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleFavorite: (teamId: string) => void;

  // derived lookups
  teamById: (id: string) => Team | undefined;
  stadiumById: (id: string) => Stadium | undefined;
}

async function fetchAll() {
  const [teams, games, groups, stadiums] = await Promise.all([
    api.teams(),
    api.games(),
    api.groups(),
    api.stadiums(),
  ]);
  return { teams, games, groups, stadiums };
}

export const useStore = create<WorldCupState>((set, get) => ({
  teams: [],
  games: [],
  groups: [],
  stadiums: [],
  loading: false,
  refreshing: false,
  error: null,
  lastUpdated: null,
  favorites: new Set<string>(),

  load: async () => {
    if (get().teams.length > 0) return; // already loaded
    set({ loading: true, error: null });
    try {
      const data = await fetchAll();
      set({ ...data, loading: false, lastUpdated: Date.now() });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Failed to load' });
    }
  },

  refresh: async () => {
    set({ refreshing: true });
    try {
      const data = await fetchAll();
      set({ ...data, refreshing: false, error: null, lastUpdated: Date.now() });
    } catch (e) {
      set({ refreshing: false, error: e instanceof Error ? e.message : 'Failed to refresh' });
    }
  },

  toggleFavorite: (teamId) =>
    set((s) => {
      const next = new Set(s.favorites);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      return { favorites: next };
    }),

  teamById: (id) => get().teams.find((t) => t.id === id),
  stadiumById: (id) => get().stadiums.find((s) => s.id === id),
}));
