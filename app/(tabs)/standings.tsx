import { useMemo } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { ErrorView, Loading, Screen, ScreenHeader } from '@/components/Screen';
import { GroupTable } from '@/features/standings/GroupTable';
import { useTournament } from '@/store/hooks';
import { useStore } from '@/store/store';
import { COLORS } from '@/theme/colors';

export default function StandingsScreen() {
  const { loading, refreshing, error, refresh, retry } = useTournament();
  const groups = useStore((s) => s.groups);

  const ordered = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups]
  );

  if (loading) return <Loading />;
  if (error && groups.length === 0) return <ErrorView message={error} onRetry={retry} />;

  return (
    <Screen>
      <ScreenHeader title="Standings" subtitle="12 groups · top 2 advance + 8 best 3rds" />
      <FlatList
        data={ordered}
        keyExtractor={(g) => g._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={COLORS.brand} />
        }
        renderItem={({ item }) => <GroupTable group={item} />}
      />
    </Screen>
  );
}
