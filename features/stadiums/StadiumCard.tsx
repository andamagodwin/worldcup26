import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { stadiumCity, stadiumName } from '@/lib/i18n';
import type { Stadium } from '@/lib/types';
import { useLang } from '@/store/hooks';
import { COLORS } from '@/theme/colors';

export function StadiumCard({ stadium, matchCount }: { stadium: Stadium; matchCount: number }) {
  const lang = useLang();

  return (
    <Link href={`/stadium/${stadium.id}`} asChild>
      <Pressable className="mb-2 rounded-2xl bg-surface p-3.5 active:opacity-70">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-[16px] font-p-bold text-white">{stadiumName(stadium, lang)}</Text>
            <Text className="mt-0.5 text-[12px] text-muted">{stadiumCity(stadium, lang)}</Text>
            {stadium.fifa_name && stadium.fifa_name !== stadium.name_en ? (
              <Text className="mt-0.5 text-[11px] text-faint">FIFA: {stadium.fifa_name}</Text>
            ) : null}
          </View>
          <View className="items-end">
            <View className="flex-row items-center gap-1">
              <Ionicons name="people-outline" size={13} color={COLORS.muted} />
              <Text className="text-[13px] font-p-semibold text-white/90">
                {stadium.capacity.toLocaleString()}
              </Text>
            </View>
            <View className="mt-1.5 flex-row items-center gap-1 rounded-full bg-surface2 px-2 py-0.5">
              <Ionicons name="football-outline" size={11} color={COLORS.brand} />
              <Text className="text-[11px] font-p-semibold text-muted">{matchCount}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
