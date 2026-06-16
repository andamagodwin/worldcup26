import { useMemo } from 'react';

import type { Stadium } from '@/lib/types';
import { useStore } from '@/store/store';

const COUNTRY_FLAG: Record<string, string> = {
  'United States': '🇺🇸',
  Mexico: '🇲🇽',
  Canada: '🇨🇦',
};

// Host order: USA (11), Mexico (3), Canada (2).
const COUNTRY_ORDER = ['United States', 'Mexico', 'Canada'];

export interface StadiumSection {
  country: string;
  flag: string;
  data: Stadium[];
}

/** Stadiums grouped by host country, plus a lookup of matches hosted per venue. */
export function useStadiumSections(): {
  sections: StadiumSection[];
  matchCount: (stadiumId: string) => number;
} {
  const stadiums = useStore((s) => s.stadiums);
  const games = useStore((s) => s.games);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const g of games) m.set(g.stadium_id, (m.get(g.stadium_id) ?? 0) + 1);
    return m;
  }, [games]);

  const sections = useMemo(() => {
    const byCountry = new Map<string, Stadium[]>();
    for (const s of stadiums) {
      (byCountry.get(s.country_en) ?? byCountry.set(s.country_en, []).get(s.country_en)!).push(s);
    }
    return [...byCountry.entries()]
      .sort(([a], [b]) => COUNTRY_ORDER.indexOf(a) - COUNTRY_ORDER.indexOf(b))
      .map(([country, list]) => ({
        country,
        flag: COUNTRY_FLAG[country] ?? '🏟️',
        data: list.sort((a, b) => b.capacity - a.capacity),
      }));
  }, [stadiums]);

  return { sections, matchCount: (id) => counts.get(id) ?? 0 };
}
