import { create } from 'zustand';

import { createDataSlice, type DataSlice } from './slices/dataSlice';
import { createPreferencesSlice, type PreferencesSlice } from './slices/preferencesSlice';

/** The full store is the composition of its feature slices. */
export type Store = DataSlice & PreferencesSlice;

export const useStore = create<Store>()((...a) => ({
  ...createDataSlice(...a),
  ...createPreferencesSlice(...a),
}));
