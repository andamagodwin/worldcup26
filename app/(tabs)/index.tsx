import { useEffect, useRef, useState } from 'react';
import { Pressable, RefreshControl, SectionList, Text, View } from 'react-native';

import { Empty, ErrorView, Loading, Screen, ScreenHeader } from '@/components/Screen';
import { MatchCard } from '@/features/matches/MatchCard';
import { useMatchSections, type MatchFilter } from '@/features/matches/useMatchSections';
import type { Game } from '@/lib/types';
import { useLiveCount, useTournament } from '@/store/hooks';
import { useStore } from '@/store/store';
import { COLORS } from '@/theme/colors';

const FILTERS: { key: MatchFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'live', label: 'Live' },
];

export default function MatchesScreen() {
  const { loading, refreshing, error, refresh, retry } = useTournament();
  const liveCount = useLiveCount();
  const [filter, setFilter] = useState<MatchFilter>('all');
  const { sections, today } = useMatchSections(filter);
  const listRef = useRef<SectionList<Game>>(null);

  // Silent live polling every 30s (no spinner).
  useEffect(() => {
    const id = setInterval(() => useStore.getState().silentRefresh(), 30_000);
    return () => clearInterval(id);
  }, []);

  // Jump to today's section on first successful load.
  const jumped = useRef(false);
  useEffect(() => {
    if (jumped.current || sections.length === 0 || filter !== 'all') return;
    const idx = sections.findIndex((s) => s.key >= today);
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
  }, [sections, filter, today]);

  if (loading) return <Loading />;
  if (error && sections.length === 0) return <ErrorView message={error} onRetry={retry} />;

  return (
    <Screen>
      <ScreenHeader
        title="MUNDIAL '26"
        subtitle={
          liveCount > 0
            ? `${liveCount} match${liveCount > 1 ? 'es' : ''} live now`
            : 'USA · Mexico · Canada'
        }
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
              <Text className={`text-[13px] font-p-bold ${active ? 'text-ink' : 'text-muted'}`}>
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
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={COLORS.brand} />
        }
        renderSectionHeader={({ section }) => (
          <View className="flex-row items-center justify-between bg-ink pb-2 pt-3">
            <Text
              className={`text-[13px] font-p-bold uppercase tracking-wide ${section.isToday ? 'text-brand' : 'text-muted'}`}>
              {section.isToday ? 'Today' : section.title}
            </Text>
            <Text className="text-[12px] text-faint">{section.data.length}</Text>
          </View>
        )}
        renderItem={({ item }) => <MatchCard game={item} />}
        ListEmptyComponent={
          <Empty
            text={filter === 'live' ? 'No matches are live right now.' : 'No matches scheduled.'}
          />
        }
      />
    </Screen>
  );
}
