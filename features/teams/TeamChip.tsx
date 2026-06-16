import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Flag } from '@/components/Flag';
import { teamName } from '@/lib/i18n';
import type { Team } from '@/lib/types';
import { useLang } from '@/store/hooks';
import { useStore } from '@/store/store';
import { COLORS } from '@/theme/colors';

export function TeamChip({ team }: { team: Team }) {
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const lang = useLang();
  const fav = favorites.has(team.id);

  return (
    <View className="mb-2.5 w-[48%]">
      <Link href={`/team/${team.id}`} asChild>
        <Pressable className="flex-row items-center gap-2.5 rounded-2xl bg-surface p-3 active:opacity-70">
          <Flag uri={team.flag} size={30} />
          <View className="flex-1">
            <Text numberOfLines={1} className="text-[14px] font-p-bold text-white">
              {teamName(team, lang)}
            </Text>
            <Text className="text-[11px] font-p-semibold text-faint">{team.fifa_code}</Text>
          </View>
          <Pressable hitSlop={8} onPress={() => toggleFavorite(team.id)}>
            <Ionicons
              name={fav ? 'star' : 'star-outline'}
              size={18}
              color={fav ? COLORS.gold : COLORS.faint}
            />
          </Pressable>
        </Pressable>
      </Link>
    </View>
  );
}
