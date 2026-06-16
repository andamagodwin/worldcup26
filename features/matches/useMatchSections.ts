import { useMemo } from 'react';

import { dayKey, formatDayHeader, parseGameDate } from '@/lib/date';
import { matchState } from '@/lib/match';
import type { Game } from '@/lib/types';
import { useStore } from '@/store/store';

export type MatchFilter = 'all' | 'today' | 'live';

export interface MatchSection {
  key: string;
  title: string;
  isToday: boolean;
  data: Game[];
}

const todayKey = () => dayKey(new Date());

/** Groups (and filters) the fixture list into date-bucketed sections. */
export function useMatchSections(filter: MatchFilter): { sections: MatchSection[]; today: string } {
  const games = useStore((s) => s.games);
  const today = todayKey();

  const sections = useMemo(() => {
    let pool = games;
    if (filter === 'live') pool = games.filter((g) => matchState(g) === 'live');
    if (filter === 'today') pool = games.filter((g) => dayKey(parseGameDate(g.local_date)) === today);

    const byDay = new Map<string, Game[]>();
    for (const g of pool) {
      const k = dayKey(parseGameDate(g.local_date));
      (byDay.get(k) ?? byDay.set(k, []).get(k)!).push(g);
    }

    return [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({
        key,
        title: formatDayHeader(parseGameDate(data[0].local_date)),
        isToday: key === today,
        data: data.sort(
          (a, b) =>
            parseGameDate(a.local_date).getTime() - parseGameDate(b.local_date).getTime()
        ),
      }));
  }, [games, filter, today]);

  return { sections, today };
}
