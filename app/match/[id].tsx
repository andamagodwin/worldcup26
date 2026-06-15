import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { StateBadge } from '@/components/StateBadge';
import { Empty, ErrorView, Loading, Screen } from '@/components/Screen';
import {
  formatDayHeader,
  formatTime,
  matchState,
  num,
  parseGameDate,
  parseScorers,
  stageLabel,
} from '@/lib/format';
import type { Game } from '@/lib/types';
import { useStore } from '@/store/store';

function Side({
  flag,
  name,
  code,
  align,
}: {
  flag?: string;
  name: string;
  code?: string;
  align: 'left' | 'right';
}) {
  return (
    <View className={`flex-1 items-center`}>
      <Image
        source={flag ? { uri: flag } : require('../../assets/icon.png')}
        style={{ width: 64, height: 45, borderRadius: 6 }}
        className="bg-surface2"
      />
      <Text numberOfLines={2} className="mt-2 text-center text-[15px] font-bold text-white">
        {name}
      </Text>
      {code ? <Text className="text-[11px] text-faint">{code}</Text> : null}
    </View>
  );
}

function ScorerColumn({ scorers, align }: { scorers: string[]; align: 'left' | 'right' }) {
  if (scorers.length === 0) return <View className="flex-1" />;
  return (
    <View className={`flex-1 gap-1 ${align === 'right' ? 'items-end' : 'items-start'}`}>
      {scorers.map((s, i) => (
        <View
          key={i}
          className={`flex-row items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
          <Ionicons name="football" size={11} color="#8A95AD" />
          <Text className="text-[12px] text-muted">{s}</Text>
        </View>
      ))}
    </View>
  );
}

export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { games, loading, error, load, teamById, stadiumById } = useStore();

  useEffect(() => {
    load();
  }, [load]);

  const game: Game | undefined = useMemo(() => games.find((g) => g.id === id), [games, id]);

  if (loading && games.length === 0) return <Loading />;
  if (error && games.length === 0) return <ErrorView message={error} onRetry={load} />;
  if (!game)
    return (
      <Screen>
        <Empty text="Match not found." />
      </Screen>
    );

  const home = teamById(game.home_team_id);
  const away = teamById(game.away_team_id);
  const stadium = stadiumById(game.stadium_id);
  const date = parseGameDate(game.local_date);
  const state = matchState(game);
  const played = state !== 'upcoming';

  const homeName = home?.name_en ?? game.home_team_name_en ?? game.home_team_label ?? 'TBD';
  const awayName = away?.name_en ?? game.away_team_name_en ?? game.away_team_label ?? 'TBD';

  return (
    <>
      <Stack.Screen options={{ title: stageLabel(game.type) }} />
      <Screen edges={['bottom']}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <View className="items-center pt-4">
            <Text className="text-[12px] font-semibold uppercase tracking-wide text-faint">
              {game.type === 'group' ? `Group ${game.group}` : stageLabel(game.type)} ·{' '}
              {formatDayHeader(date)}
            </Text>
          </View>

          <View className="mt-4 flex-row items-center">
            <TeamTap teamId={game.home_team_id}>
              <Side flag={home?.flag} name={homeName} code={home?.fifa_code} align="left" />
            </TeamTap>

            <View className="w-28 items-center">
              {played ? (
                <Text className="text-[40px] font-extrabold tabular-nums text-white">
                  {num(game.home_score)}–{num(game.away_score)}
                </Text>
              ) : (
                <Text className="text-[22px] font-extrabold text-white">
                  {formatTime(date)}
                </Text>
              )}
              <View className="mt-1">
                <StateBadge game={game} time={formatTime(date)} />
              </View>
            </View>

            <TeamTap teamId={game.away_team_id}>
              <Side flag={away?.flag} name={awayName} code={away?.fifa_code} align="right" />
            </TeamTap>
          </View>

          {played && (
            <View className="mt-5 flex-row gap-4 rounded-2xl bg-surface p-4">
              <ScorerColumn scorers={parseScorers(game.home_scorers)} align="left" />
              <Ionicons name="football-outline" size={16} color="#26304A" />
              <ScorerColumn scorers={parseScorers(game.away_scorers)} align="right" />
            </View>
          )}

          <View className="mt-5 gap-3 rounded-2xl bg-surface p-4">
            <InfoRow icon="calendar-outline" label="Kickoff" value={`${formatDayHeader(date)} · ${formatTime(date)}`} />
            <InfoRow
              icon="location-outline"
              label="Venue"
              value={stadium ? `${stadium.name_en}, ${stadium.city_en}` : `Stadium ${game.stadium_id}`}
            />
            <InfoRow
              icon="flag-outline"
              label="Stage"
              value={`${stageLabel(game.type)} · Matchday ${game.matchday}`}
            />
          </View>
        </ScrollView>
      </Screen>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Ionicons name={icon} size={18} color="#8A95AD" />
      <View className="flex-1">
        <Text className="text-[11px] uppercase text-faint">{label}</Text>
        <Text className="text-[14px] font-semibold text-white">{value}</Text>
      </View>
    </View>
  );
}

/** Wraps a team side in a link only when the team is known (not a TBD slot). */
function TeamTap({ teamId, children }: { teamId: string; children: React.ReactNode }) {
  if (!teamId || teamId === '0') return <>{children}</>;
  return (
    <Link href={`/team/${teamId}`} asChild>
      <Pressable className="flex-1 active:opacity-70">{children}</Pressable>
    </Link>
  );
}
