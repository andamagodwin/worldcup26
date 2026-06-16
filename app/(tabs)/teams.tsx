import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { ErrorView, Loading, Screen, ScreenHeader } from '@/components/Screen';
import { TeamChip } from '@/features/teams/TeamChip';
import { useTeamGroups } from '@/features/teams/useTeamGroups';
import { useTournament } from '@/store/hooks';
import { useStore } from '@/store/store';
import { COLORS } from '@/theme/colors';

export default function TeamsScreen() {
  const { loading, refreshing, error, refresh, retry } = useTournament();
  const teamCount = useStore((s) => s.teams.length);
  const { groups, favTeams } = useTeamGroups();

  if (loading) return <Loading />;
  if (error && teamCount === 0) return <ErrorView message={error} onRetry={retry} />;

  return (
    <Screen>
      <ScreenHeader title="Teams" subtitle="48 nations · tap ★ to follow" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={COLORS.brand} />
        }>
        {favTeams.length > 0 && (
          <View className="mb-2">
            <Text className="mb-2 mt-1 text-[13px] font-p-extrabold uppercase tracking-wide text-gold">
              ★ Following
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {favTeams.map((t) => (
                <TeamChip key={`fav-${t.id}`} team={t} />
              ))}
            </View>
          </View>
        )}

        {groups.map(([letter, list]) => (
          <View key={letter} className="mb-2">
            <Text className="mb-2 mt-1 text-[13px] font-p-extrabold uppercase tracking-wide text-white">
              Group {letter}
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {list.map((t) => (
                <TeamChip key={t.id} team={t} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
