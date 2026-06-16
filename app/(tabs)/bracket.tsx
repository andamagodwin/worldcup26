import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { ErrorView, Loading, Screen, ScreenHeader } from '@/components/Screen';
import { MatchCard } from '@/features/matches/MatchCard';
import { useBracketRounds } from '@/features/bracket/useBracketRounds';
import { stageLabel } from '@/lib/match';
import { useTournament } from '@/store/hooks';
import { COLORS } from '@/theme/colors';

export default function BracketScreen() {
  const { loading, refreshing, error, refresh, retry } = useTournament();
  const rounds = useBracketRounds();

  if (loading) return <Loading />;
  if (error && rounds.length === 0) return <ErrorView message={error} onRetry={retry} />;

  return (
    <Screen>
      <ScreenHeader title="Knockout Bracket" subtitle="Round of 32 → Final · July 19, MetLife" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={COLORS.brand} />
        }>
        {rounds.map(({ round, matches }) => {
          const isFinal = round === 'final';
          return (
            <View key={round} className="mb-5">
              <View className="mb-2 flex-row items-center justify-between pt-1">
                <Text
                  className={`text-[13px] font-p-extrabold uppercase tracking-wide ${isFinal ? 'text-gold' : 'text-white'}`}>
                  {isFinal ? '🏆 ' : ''}
                  {stageLabel(round)}
                </Text>
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
