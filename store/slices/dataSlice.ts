import type { StateCreator } from 'zustand';

import { api } from '@/lib/api';
import type { Game, Group, Stadium, Team } from '@/lib/types';

import type { Store } from '../store';

export interface DataSlice {
  teams: Team[];
  games: Game[];
  groups: Group[];
  stadiums: Stadium[];

  loading: boolean; // first load only
  refreshing: boolean; // user-initiated pull-to-refresh
  error: string | null;
  lastUpdated: number | null;

  load: () => Promise<void>;
  refresh: () => Promise<void>;
  silentRefresh: () => Promise<void>;

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

export const createDataSlice: StateCreator<Store, [], [], DataSlice> = (set, get) => ({
  teams: [],
  games: [],
  groups: [],
  stadiums: [],
  loading: false,
  refreshing: false,
  error: null,
  lastUpdated: null,

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

  // User-initiated pull-to-refresh: shows the spinner.
  refresh: async () => {
    set({ refreshing: true });
    try {
      const data = await fetchAll();
      set({ ...data, refreshing: false, error: null, lastUpdated: Date.now() });
    } catch (e) {
      set({ refreshing: false, error: e instanceof Error ? e.message : 'Failed to refresh' });
    }
  },

  // Background polling: updates data quietly, never touches the spinner.
  silentRefresh: async () => {
    try {
      const data = await fetchAll();
      set({ ...data, error: null, lastUpdated: Date.now() });
    } catch {
      // Ignore transient poll failures; the next tick will retry.
    }
  },

  teamById: (id) => get().teams.find((t) => t.id === id),
  stadiumById: (id) => get().stadiums.find((s) => s.id === id),
});
