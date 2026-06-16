import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Empty, ErrorView, Loading, Screen } from '@/components/Screen';
import { MatchCard } from '@/features/matches/MatchCard';
import { parseGameDate } from '@/lib/date';
import { stadiumCity, stadiumCountry, stadiumName } from '@/lib/i18n';
import { useLang, useTournament } from '@/store/hooks';
import { useStore } from '@/store/store';
import { COLORS } from '@/theme/colors';

function Fact({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) {
  return (
    <View className="flex-1 flex-row items-center gap-2.5 rounded-2xl bg-surface p-3">
      <Ionicons name={icon} size={18} color={COLORS.brand} />
      <View>
        <Text className="text-[11px] uppercase text-faint">{label}</Text>
        <Text className="text-[14px] font-p-bold text-white">{value}</Text>
      </View>
    </View>
  );
}

export default function StadiumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, error, retry } = useTournament();
  const lang = useLang();
  const stadiums = useStore((s) => s.stadiums);
  const games = useStore((s) => s.games);

  const stadium = useMemo(() => stadiums.find((s) => s.id === id), [stadiums, id]);

  const matches = useMemo(
    () =>
      games
        .filter((g) => g.stadium_id === id)
        .sort(
          (a, b) =>
            parseGameDate(a.local_date).getTime() - parseGameDate(b.local_date).getTime()
        ),
    [games, id]
  );

  if (loading && stadiums.length === 0) return <Loading />;
  if (error && stadiums.length === 0) return <ErrorView message={error} onRetry={retry} />;
  if (!stadium)
    return (
      <Screen>
        <Empty text="Stadium not found." />
      </Screen>
    );

  return (
    <>
      <Stack.Screen options={{ title: stadium.fifa_name || stadium.name_en }} />
      <Screen edges={['bottom']}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <View className="py-5">
            <Text className="text-[24px] font-p-extrabold text-white">{stadiumName(stadium, lang)}</Text>
            <Text className="mt-1 text-[14px] text-muted">
              {stadiumCity(stadium, lang)}, {stadiumCountry(stadium, lang)}
            </Text>
          </View>

          <View className="mb-5 flex-row gap-2.5">
            <Fact icon="people-outline" label="Capacity" value={stadium.capacity.toLocaleString()} />
            {stadium.region ? (
              <Fact icon="compass-outline" label="Region" value={stadium.region} />
            ) : (
              <Fact icon="football-outline" label="Matches" value={String(matches.length)} />
            )}
          </View>

          <Text className="mb-2 text-[13px] font-p-extrabold uppercase tracking-wide text-white">
            Matches at this venue
          </Text>
          {matches.length === 0 ? (
            <Empty text="No matches scheduled here yet." />
          ) : (
            matches.map((g) => <MatchCard key={g.id} game={g} />)
          )}
        </ScrollView>
      </Screen>
    </>
  );
}
