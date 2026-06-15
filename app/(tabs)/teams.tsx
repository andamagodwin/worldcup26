import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { Flag } from '@/components/Flag';
import { ErrorView, Loading, Screen, ScreenHeader } from '@/components/Screen';
import type { Team } from '@/lib/types';
import { useStore } from '@/store/store';

function TeamChip({ team }: { team: Team }) {
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const fav = favorites.has(team.id);

  return (
    <View className="mb-2.5 w-[48%]">
      <Link href={`/team/${team.id}`} asChild>
        <Pressable className="flex-row items-center gap-2.5 rounded-2xl bg-surface p-3 active:opacity-70">
          <Flag uri={team.flag} size={30} />
          <View className="flex-1">
            <Text numberOfLines={1} className="text-[14px] font-bold text-white">
              {team.name_en}
            </Text>
            <Text className="text-[11px] font-semibold text-faint">{team.fifa_code}</Text>
          </View>
          <Pressable hitSlop={8} onPress={() => toggleFavorite(team.id)}>
            <Ionicons
              name={fav ? 'star' : 'star-outline'}
              size={18}
              color={fav ? '#F5C242' : '#5A627A'}
            />
          </Pressable>
        </Pressable>
      </Link>
    </View>
  );
}

export default function TeamsScreen() {
  const { teams, favorites, loading, refreshing, error, load, refresh } = useStore();

  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(() => {
    const map = new Map<string, Team[]>();
    for (const t of [...teams].sort((a, b) => a.name_en.localeCompare(b.name_en))) {
      (map.get(t.groups) ?? map.set(t.groups, []).get(t.groups)!).push(t);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [teams]);

  const favTeams = useMemo(
    () => teams.filter((t) => favorites.has(t.id)),
    [teams, favorites]
  );

  if (loading) return <Loading />;
  if (error && teams.length === 0) return <ErrorView message={error} onRetry={load} />;

  return (
    <Screen>
      <ScreenHeader title="Teams" subtitle="48 nations · tap ★ to follow" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FF7A1A" />
        }>
        {favTeams.length > 0 && (
          <View className="mb-2">
            <Text className="mb-2 mt-1 text-[13px] font-extrabold uppercase tracking-wide text-gold">
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
            <Text className="mb-2 mt-1 text-[13px] font-extrabold uppercase tracking-wide text-white">
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
