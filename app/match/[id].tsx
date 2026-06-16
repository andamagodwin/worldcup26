import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { Empty, ErrorView, Loading, Screen } from '@/components/Screen';
import { StateBadge } from '@/features/matches/StateBadge';
import { formatDayHeader, formatTime, parseGameDate } from '@/lib/date';
import { stadiumCity, stadiumName, teamName } from '@/lib/i18n';
import { matchState, parseScorers, stageLabel } from '@/lib/match';
import { num } from '@/lib/utils';
import { useLang, useTournament } from '@/store/hooks';
import { useStore } from '@/store/store';
import { COLORS } from '@/theme/colors';

function Side({ flag, name, code }: { flag?: string; name: string; code?: string }) {
  return (
    <View className="flex-1 items-center">
      <Image
        source={flag ? { uri: flag } : require('../../assets/icon.png')}
        style={{ width: 64, height: 45, borderRadius: 6 }}
        className="bg-surface2"
      />
      <Text numberOfLines={2} className="mt-2 text-center text-[15px] font-p-bold text-white">
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
          <Ionicons name="football" size={11} color={COLORS.muted} />
          <Text className="text-[12px] text-muted">{s}</Text>
        </View>
      ))}
    </View>
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
      <Ionicons name={icon} size={18} color={COLORS.muted} />
      <View className="flex-1">
        <Text className="text-[11px] uppercase text-faint">{label}</Text>
        <Text className="text-[14px] font-p-semibold text-white">{value}</Text>
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

export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, error, retry } = useTournament();
  const lang = useLang();
  const game = useStore((s) => s.games.find((g) => g.id === id));
  const teamById = useStore((s) => s.teamById);
  const stadiumById = useStore((s) => s.stadiumById);

  if (loading && !game) return <Loading />;
  if (error && !game) return <ErrorView message={error} onRetry={retry} />;
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
  const played = matchState(game) !== 'upcoming';

  const homeName = teamName(home, lang) ?? game.home_team_name_en ?? game.home_team_label ?? 'TBD';
  const awayName = teamName(away, lang) ?? game.away_team_name_en ?? game.away_team_label ?? 'TBD';

  return (
    <>
      <Stack.Screen options={{ title: stageLabel(game.type) }} />
      <Screen edges={['bottom']}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <View className="items-center pt-4">
            <Text className="text-[12px] font-p-semibold uppercase tracking-wide text-faint">
              {game.type === 'group' ? `Group ${game.group}` : stageLabel(game.type)} ·{' '}
              {formatDayHeader(date)}
            </Text>
          </View>

          <View className="mt-4 flex-row items-center">
            <TeamTap teamId={game.home_team_id}>
              <Side flag={home?.flag} name={homeName} code={home?.fifa_code} />
            </TeamTap>

            <View className="w-28 items-center">
              {played ? (
                <Text className="text-[40px] font-p-extrabold tabular-nums text-white">
                  {num(game.home_score)}–{num(game.away_score)}
                </Text>
              ) : (
                <Text className="text-[22px] font-p-extrabold text-white">{formatTime(date)}</Text>
              )}
              <View className="mt-1">
                <StateBadge game={game} time={formatTime(date)} />
              </View>
            </View>

            <TeamTap teamId={game.away_team_id}>
              <Side flag={away?.flag} name={awayName} code={away?.fifa_code} />
            </TeamTap>
          </View>

          {played && (
            <View className="mt-5 flex-row gap-4 rounded-2xl bg-surface p-4">
              <ScorerColumn scorers={parseScorers(game.home_scorers)} align="left" />
              <Ionicons name="football-outline" size={16} color={COLORS.line} />
              <ScorerColumn scorers={parseScorers(game.away_scorers)} align="right" />
            </View>
          )}

          <View className="mt-5 gap-3 rounded-2xl bg-surface p-4">
            <InfoRow
              icon="calendar-outline"
              label="Kickoff"
              value={`${formatDayHeader(date)} · ${formatTime(date)}`}
            />
            <InfoRow
              icon="location-outline"
              label="Venue"
              value={
                stadium
                  ? `${stadiumName(stadium, lang)}, ${stadiumCity(stadium, lang)}`
                  : `Stadium ${game.stadium_id}`
              }
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
