import { useMemo } from 'react';

import type { Team } from '@/lib/types';
import { useStore } from '@/store/store';

/** Splits the 48 teams into the followed set and per-group (A–L) buckets. */
export function useTeamGroups() {
  const teams = useStore((s) => s.teams);
  const favorites = useStore((s) => s.favorites);

  const groups = useMemo(() => {
    const map = new Map<string, Team[]>();
    for (const t of [...teams].sort((a, b) => a.name_en.localeCompare(b.name_en))) {
      (map.get(t.groups) ?? map.set(t.groups, []).get(t.groups)!).push(t);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [teams]);

  const favTeams = useMemo(() => teams.filter((t) => favorites.has(t.id)), [teams, favorites]);

  return { groups, favTeams };
}
