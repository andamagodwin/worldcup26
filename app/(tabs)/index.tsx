import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, RefreshControl, SectionList, Text, View } from 'react-native';

import { MatchCard } from '@/components/MatchCard';
import { Empty, ErrorView, Loading, Screen, ScreenHeader } from '@/components/Screen';
import {
  dayKey,
  formatDayHeader,
  matchState,
  parseGameDate,
} from '@/lib/format';
import type { Game } from '@/lib/types';
import { useStore } from '@/store/store';

type Filter = 'all' | 'live' | 'today';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'live', label: 'Live' },
];

const TODAY = dayKey(new Date());

export default function MatchesScreen() {
  const { games, loading, refreshing, error, load, refresh } = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  const listRef = useRef<SectionList<Game>>(null);

  useEffect(() => {
    load();
    const id = setInterval(() => useStore.getState().refresh(), 30_000); // live polling
    return () => clearInterval(id);
  }, [load]);

  const liveCount = useMemo(
    () => games.filter((g) => matchState(g) === 'live').length,
    [games]
  );

  const sections = useMemo(() => {
    let pool = games;
    if (filter === 'live') pool = games.filter((g) => matchState(g) === 'live');
    if (filter === 'today')
      pool = games.filter((g) => dayKey(parseGameDate(g.local_date)) === TODAY);

    const byDay = new Map<string, Game[]>();
    for (const g of pool) {
      const k = dayKey(parseGameDate(g.local_date));
      (byDay.get(k) ?? byDay.set(k, []).get(k)!).push(g);
    }
    return [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({
        key,
        title: formatDayHeader(parseGameDate(data[0].local_date)),
        isToday: key === TODAY,
        data: data.sort(
          (a, b) =>
            parseGameDate(a.local_date).getTime() - parseGameDate(b.local_date).getTime()
        ),
      }));
  }, [games, filter]);

  // Jump to today's section on first successful load.
  const jumped = useRef(false);
  useEffect(() => {
    if (jumped.current || sections.length === 0 || filter !== 'all') return;
    const idx = sections.findIndex((s) => s.key >= TODAY);
    if (idx > 0) {
      setTimeout(() => {
        listRef.current?.scrollToLocation({
          sectionIndex: idx,
          itemIndex: 0,
          viewPosition: 0,
          animated: false,
        });
      }, 250);
    }
    jumped.current = true;
  }, [sections, filter]);

  if (loading) return <Loading />;
  if (error && games.length === 0) return <ErrorView message={error} onRetry={load} />;

  return (
    <Screen>
      <ScreenHeader
        title="MUNDIAL '26"
        subtitle={liveCount > 0 ? `${liveCount} match${liveCount > 1 ? 'es' : ''} live now` : 'USA · Mexico · Canada'}
      />

      <View className="flex-row gap-2 px-4 pb-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              className={`flex-row items-center gap-1.5 rounded-full px-4 py-1.5 ${active ? 'bg-brand' : 'bg-surface'}`}>
              {f.key === 'live' && (
                <View className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-ink' : 'bg-live'}`} />
              )}
              <Text className={`text-[13px] font-bold ${active ? 'text-ink' : 'text-muted'}`}>
                {f.label}
                {f.key === 'live' && liveCount > 0 ? ` ${liveCount}` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        stickySectionHeadersEnabled={false}
        onScrollToIndexFailed={() => {}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FF7A1A" />
        }
        renderSectionHeader={({ section }) => (
          <View className="flex-row items-center gap-2 bg-ink pb-2 pt-3">
            <Text
              className={`text-[13px] font-bold uppercase tracking-wide ${section.isToday ? 'text-brand' : 'text-muted'}`}>
              {section.isToday ? 'Today' : section.title}
            </Text>
            <View className="h-px flex-1 bg-line" />
            <Text className="text-[12px] text-faint">{section.data.length}</Text>
          </View>
        )}
        renderItem={({ item }) => <MatchCard game={item} />}
        ListEmptyComponent={
          <Empty
            text={
              filter === 'live'
                ? 'No matches are live right now.'
                : 'No matches scheduled.'
            }
          />
        }
      />
    </Screen>
  );
}
