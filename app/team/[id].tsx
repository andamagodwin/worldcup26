import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { Empty, ErrorView, Loading, Screen } from '@/components/Screen';
import { MatchCard } from '@/features/matches/MatchCard';
import { parseGameDate } from '@/lib/date';
import { teamName } from '@/lib/i18n';
import { sortGroupRows } from '@/lib/standings';
import { num } from '@/lib/utils';
import { useLang, useTournament } from '@/store/hooks';
import { useStore } from '@/store/store';
import { COLORS } from '@/theme/colors';

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-[20px] font-p-extrabold text-white">{value}</Text>
      <Text className="mt-0.5 text-[11px] uppercase text-faint">{label}</Text>
    </View>
  );
}

function ordinal(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, error, retry } = useTournament();
  const lang = useLang();
  const teams = useStore((s) => s.teams);
  const games = useStore((s) => s.games);
  const groups = useStore((s) => s.groups);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const team = useMemo(() => teams.find((t) => t.id === id), [teams, id]);

  const standing = useMemo(() => {
    const group = groups.find((g) => g.name === team?.groups);
    if (!group) return null;
    const sorted = sortGroupRows(group.teams);
    const idx = sorted.findIndex((r) => r.team_id === id);
    return idx < 0 ? null : { row: sorted[idx], rank: idx + 1, size: sorted.length };
  }, [groups, team, id]);

  const fixtures = useMemo(
    () =>
      games
        .filter((g) => g.home_team_id === id || g.away_team_id === id)
        .sort(
          (a, b) =>
            parseGameDate(a.local_date).getTime() - parseGameDate(b.local_date).getTime()
        ),
    [games, id]
  );

  if (loading && teams.length === 0) return <Loading />;
  if (error && teams.length === 0) return <ErrorView message={error} onRetry={retry} />;
  if (!team)
    return (
      <Screen>
        <Empty text="Team not found." />
      </Screen>
    );

  const fav = favorites.has(team.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: team.fifa_code,
          headerRight: () => (
            <Pressable hitSlop={10} onPress={() => toggleFavorite(team.id)}>
              <Ionicons
                name={fav ? 'star' : 'star-outline'}
                size={22}
                color={fav ? COLORS.gold : COLORS.white}
              />
            </Pressable>
          ),
        }}
      />
      <Screen edges={['bottom']}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <View className="items-center py-5">
            <Image
              source={{ uri: team.flag }}
              style={{ width: 96, height: 67, borderRadius: 8 }}
              className="bg-surface2"
            />
            <Text className="mt-3 text-[24px] font-p-extrabold text-white">{teamName(team, lang)}</Text>
            <Text className="mt-1 text-[13px] text-muted">
              Group {team.groups}
              {standing ? ` · ${standing.rank}${ordinal(standing.rank)} place` : ''}
            </Text>
          </View>

          {standing && (
            <View className="mb-5 flex-row rounded-2xl bg-surface py-4">
              <Stat label="Played" value={num(standing.row.mp)} />
              <Stat label="Won" value={num(standing.row.w)} />
              <Stat label="Drawn" value={num(standing.row.d)} />
              <Stat label="Lost" value={num(standing.row.l)} />
              <Stat label="Pts" value={num(standing.row.pts)} />
            </View>
          )}

          <Text className="mb-2 text-[13px] font-p-extrabold uppercase tracking-wide text-white">
            Fixtures &amp; Results
          </Text>
          {fixtures.length === 0 ? (
            <Empty text="No fixtures scheduled yet." />
          ) : (
            fixtures.map((g) => <MatchCard key={g.id} game={g} />)
          )}
        </ScrollView>
      </Screen>
    </>
  );
}
