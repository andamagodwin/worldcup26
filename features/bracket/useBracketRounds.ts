import { useMemo } from 'react';

import { KNOCKOUT_ORDER } from '@/lib/match';
import type { Game, MatchType } from '@/lib/types';
import { num } from '@/lib/utils';
import { useStore } from '@/store/store';

export interface BracketRound {
  round: MatchType;
  matches: Game[];
}

/** Knockout fixtures grouped by round in bracket order (empty rounds dropped). */
export function useBracketRounds(): BracketRound[] {
  const games = useStore((s) => s.games);

  return useMemo(() => {
    const byRound = new Map<MatchType, Game[]>();
    for (const round of KNOCKOUT_ORDER) byRound.set(round, []);
    for (const g of games) byRound.get(g.type as MatchType)?.push(g);

    return KNOCKOUT_ORDER.map((round) => ({
      round,
      matches: (byRound.get(round) ?? []).sort((a, b) => num(a.id) - num(b.id)),
    })).filter((r) => r.matches.length > 0);
  }, [games]);
}
