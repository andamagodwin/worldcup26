import { useEffect, useMemo } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { MatchCard } from '@/components/MatchCard';
import { ErrorView, Loading, Screen, ScreenHeader } from '@/components/Screen';
import { num, stageLabel } from '@/lib/format';
import type { Game, MatchType } from '@/lib/types';
import { useStore } from '@/store/store';

// Display order of the knockout rounds.
const ROUNDS: MatchType[] = ['r32', 'r16', 'qf', 'sf', 'final', 'third'];

export default function BracketScreen() {
  const { games, loading, refreshing, error, load, refresh } = useStore();

  useEffect(() => {
    load();
  }, [load]);

  const byRound = useMemo(() => {
    const map = new Map<MatchType, Game[]>();
    for (const t of ROUNDS) map.set(t, []);
    for (const g of games) {
      if (map.has(g.type)) map.get(g.type)!.push(g);
    }
    for (const arr of map.values()) arr.sort((a, b) => num(a.id) - num(b.id));
    return map;
  }, [games]);

  if (loading) return <Loading />;
  if (error && games.length === 0) return <ErrorView message={error} onRetry={load} />;

  return (
    <Screen>
      <ScreenHeader title="Knockout Bracket" subtitle="Round of 32 → Final · July 19, MetLife" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FF7A1A" />
        }>
        {ROUNDS.map((round) => {
          const matches = byRound.get(round) ?? [];
          if (matches.length === 0) return null;
          const isFinal = round === 'final';
          return (
            <View key={round} className="mb-5">
              <View className="mb-2 flex-row items-center gap-2 pt-1">
                <Text
                  className={`text-[13px] font-extrabold uppercase tracking-wide ${isFinal ? 'text-gold' : 'text-white'}`}>
                  {isFinal ? '🏆 ' : ''}
                  {stageLabel(round)}
                </Text>
                <View className="h-px flex-1 bg-line" />
                <Text className="text-[12px] text-faint">{matches.length}</Text>
              </View>
              {matches.map((m) => (
                <MatchCard key={m.id} game={m} showGroup={false} />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
