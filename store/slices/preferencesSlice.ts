import type { StateCreator } from 'zustand';

import type { Lang } from '@/lib/i18n';

import type { Store } from '../store';

export interface PreferencesSlice {
  favorites: Set<string>; // followed team ids (in-memory)
  lang: Lang; // 'en' | 'fa'

  toggleFavorite: (teamId: string) => void;
  toggleLang: () => void;
}

export const createPreferencesSlice: StateCreator<Store, [], [], PreferencesSlice> = (set) => ({
  favorites: new Set<string>(),
  lang: 'en',

  toggleFavorite: (teamId) =>
    set((s) => {
      const next = new Set(s.favorites);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      return { favorites: next };
    }),

  toggleLang: () => set((s) => ({ lang: s.lang === 'en' ? 'fa' : 'en' })),
});
