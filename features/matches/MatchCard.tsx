import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Flag } from '@/components/Flag';
import { formatTime, parseGameDate } from '@/lib/date';
import { teamName } from '@/lib/i18n';
import { matchState } from '@/lib/match';
import type { Game } from '@/lib/types';
import { num } from '@/lib/utils';
import { useLang } from '@/store/hooks';
import { useStore } from '@/store/store';

import { StateBadge } from './StateBadge';

function TeamLine({
  flag,
  name,
  score,
  faded,
  winner,
}: {
  flag?: string;
  name: string;
  score?: number;
  faded: boolean;
  winner: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-1 flex-row items-center gap-2.5">
        <Flag uri={flag} />
        <Text
          numberOfLines={1}
          className={`flex-1 text-[15px] ${winner ? 'font-p-bold text-white' : 'font-p-medium text-white/90'} ${faded ? 'text-muted' : ''}`}>
          {name}
        </Text>
      </View>
      {score !== undefined && (
        <Text className={`ml-2 text-[17px] tabular-nums ${winner ? 'font-p-extrabold text-white' : 'font-p-semibold text-white/80'}`}>
          {score}
        </Text>
      )}
    </View>
  );
}

/** A single fixture card used across the Matches, Team, Stadium and Bracket screens. */
export function MatchCard({ game, showGroup = true }: { game: Game; showGroup?: boolean }) {
  const teamById = useStore((s) => s.teamById);
  const lang = useLang();
  const state = matchState(game);
  const played = state !== 'upcoming';

  const home = teamById(game.home_team_id);
  const away = teamById(game.away_team_id);

  const homeName = teamName(home, lang) ?? game.home_team_name_en ?? game.home_team_label ?? 'TBD';
  const awayName = teamName(away, lang) ?? game.away_team_name_en ?? game.away_team_label ?? 'TBD';

  const hs = num(game.home_score);
  const as = num(game.away_score);
  const date = parseGameDate(game.local_date);

  return (
    <Link href={`/match/${game.id}`} asChild>
      <Pressable className="mb-2 rounded-2xl bg-surface p-3 active:opacity-70">
        <View className="mb-1.5 flex-row items-center justify-between">
          {showGroup ? (
            <Text className="text-[11px] font-p-semibold uppercase tracking-wide text-faint">
              {game.type === 'group' ? `Group ${game.group}` : game.group}
            </Text>
          ) : (
            <View />
          )}
          <StateBadge game={game} time={formatTime(date)} />
        </View>
        <TeamLine
          flag={home?.flag}
          name={homeName}
          score={played ? hs : undefined}
          faded={!home}
          winner={played && hs > as}
        />
        <TeamLine
          flag={away?.flag}
          name={awayName}
          score={played ? as : undefined}
          faded={!away}
          winner={played && as > hs}
        />
      </Pressable>
    </Link>
  );
}
