import { Link } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

import { Flag } from '@/components/Flag';
import { ErrorView, Loading, Screen, ScreenHeader } from '@/components/Screen';
import { num } from '@/lib/format';
import type { Group, GroupRow } from '@/lib/types';
import { useStore } from '@/store/store';

function sortRows(rows: GroupRow[]): GroupRow[] {
  return [...rows].sort(
    (a, b) =>
      num(b.pts) - num(a.pts) ||
      num(b.gd) - num(a.gd) ||
      num(b.gf) - num(a.gf)
  );
}

// Top 2 qualify directly; 3rd place is in contention for the 8 best-third spots.
function posColor(i: number): string {
  if (i < 2) return 'bg-brand';
  if (i === 2) return 'bg-gold';
  return 'bg-line';
}

function HeaderCell({ children, w }: { children: string; w: number }) {
  return (
    <Text style={{ width: w }} className="text-center text-[10px] font-bold uppercase text-faint">
      {children}
    </Text>
  );
}

function StatCell({ children, w, strong }: { children: number | string; w: number; strong?: boolean }) {
  return (
    <Text
      style={{ width: w }}
      className={`text-center text-[13px] tabular-nums ${strong ? 'font-extrabold text-white' : 'text-muted'}`}>
      {children}
    </Text>
  );
}

function GroupTable({ group }: { group: Group }) {
  const teamById = useStore((s) => s.teamById);
  const rows = sortRows(group.teams);

  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-surface">
      <View className="flex-row items-center justify-between px-3 pb-1 pt-2.5">
        <Text className="text-[15px] font-extrabold text-white">Group {group.name}</Text>
        <View className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full bg-brand" />
          <Text className="text-[10px] text-faint">Qualify</Text>
          <View className="ml-2 h-2 w-2 rounded-full bg-gold" />
          <Text className="text-[10px] text-faint">Playoff</Text>
        </View>
      </View>

      <View className="flex-row items-center px-3 py-1.5">
        <View className="w-6" />
        <Text className="flex-1 text-[10px] font-bold uppercase text-faint">Team</Text>
        <HeaderCell w={26}>P</HeaderCell>
        <HeaderCell w={26}>W</HeaderCell>
        <HeaderCell w={26}>D</HeaderCell>
        <HeaderCell w={26}>L</HeaderCell>
        <HeaderCell w={32}>GD</HeaderCell>
        <HeaderCell w={32}>Pts</HeaderCell>
      </View>

      {rows.map((r, i) => {
        const team = teamById(r.team_id);
        return (
          <Link key={r.team_id} href={`/team/${r.team_id}`} asChild>
            <Pressable className="flex-row items-center border-t border-line/60 px-3 py-2.5 active:bg-surface2">
              <View className="w-6 flex-row items-center">
                <View className={`h-5 w-1 rounded-full ${posColor(i)}`} />
                <Text className="ml-1 text-[12px] font-bold text-faint">{i + 1}</Text>
              </View>
              <View className="flex-1 flex-row items-center gap-2 pr-1">
                <Flag uri={team?.flag} size={22} />
                <Text numberOfLines={1} className="flex-1 text-[13px] font-semibold text-white">
                  {team?.name_en ?? `Team ${r.team_id}`}
                </Text>
              </View>
              <StatCell w={26}>{num(r.mp)}</StatCell>
              <StatCell w={26}>{num(r.w)}</StatCell>
              <StatCell w={26}>{num(r.d)}</StatCell>
              <StatCell w={26}>{num(r.l)}</StatCell>
              <StatCell w={32}>{num(r.gd) > 0 ? `+${num(r.gd)}` : num(r.gd)}</StatCell>
              <StatCell w={32} strong>{num(r.pts)}</StatCell>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

export default function StandingsScreen() {
  const { groups, loading, refreshing, error, load, refresh } = useStore();

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading />;
  if (error && groups.length === 0) return <ErrorView message={error} onRetry={load} />;

  const ordered = [...groups].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Screen>
      <ScreenHeader title="Standings" subtitle="12 groups · top 2 advance + 8 best 3rds" />
      <FlatList
        data={ordered}
        keyExtractor={(g) => g._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FF7A1A" />
        }
        renderItem={({ item }) => <GroupTable group={item} />}
      />
    </Screen>
  );
}
