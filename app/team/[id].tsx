import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { MatchCard } from '@/components/MatchCard';
import { Empty, ErrorView, Loading, Screen } from '@/components/Screen';
import { num, parseGameDate } from '@/lib/format';
import { useStore } from '@/store/store';

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-[20px] font-extrabold text-white">{value}</Text>
      <Text className="mt-0.5 text-[11px] uppercase text-faint">{label}</Text>
    </View>
  );
}

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { teams, games, groups, favorites, loading, error, load, toggleFavorite } = useStore();

  useEffect(() => {
    load();
  }, [load]);

  const team = useMemo(() => teams.find((t) => t.id === id), [teams, id]);

  const standing = useMemo(() => {
    const group = groups.find((g) => g.name === team?.groups);
    if (!group) return null;
    const sorted = [...group.teams].sort(
      (a, b) => num(b.pts) - num(a.pts) || num(b.gd) - num(a.gd) || num(b.gf) - num(a.gf)
    );
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
  if (error && teams.length === 0) return <ErrorView message={error} onRetry={load} />;
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
                color={fav ? '#F5C242' : '#FFFFFF'}
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
            <Text className="mt-3 text-[24px] font-extrabold text-white">{team.name_en}</Text>
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

          <Text className="mb-2 text-[13px] font-extrabold uppercase tracking-wide text-white">
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

function ordinal(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}
