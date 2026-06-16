import { Text, View } from 'react-native';

import { liveLabel, matchState } from '@/lib/match';
import type { Game } from '@/lib/types';

/** A small status chip: LIVE 67' (pulsing red), FT (finished), or kickoff time. */
export function StateBadge({ game, time }: { game: Game; time: string }) {
  const state = matchState(game);

  if (state === 'live') {
    return (
      <View className="flex-row items-center gap-1 rounded-full bg-live/15 px-2 py-0.5">
        <View className="h-1.5 w-1.5 rounded-full bg-live" />
        <Text className="text-[11px] font-p-bold text-live">{liveLabel(game) || 'LIVE'}</Text>
      </View>
    );
  }

  if (state === 'finished') {
    return (
      <View className="rounded-full bg-surface2 px-2 py-0.5">
        <Text className="text-[11px] font-p-bold text-muted">FT</Text>
      </View>
    );
  }

  return <Text className="text-[11px] font-p-semibold text-faint">{time}</Text>;
}
