import { RefreshControl, SectionList, Text, View } from 'react-native';

import { ErrorView, Loading, Screen, ScreenHeader } from '@/components/Screen';
import { StadiumCard } from '@/features/stadiums/StadiumCard';
import { useStadiumSections } from '@/features/stadiums/useStadiumSections';
import { t } from '@/lib/i18n';
import { useLang, useTournament } from '@/store/hooks';
import { COLORS } from '@/theme/colors';

export default function StadiumsScreen() {
  const { loading, refreshing, error, refresh, retry } = useTournament();
  const lang = useLang();
  const { sections, matchCount } = useStadiumSections();

  if (loading) return <Loading />;
  if (error && sections.length === 0) return <ErrorView message={error} onRetry={retry} />;

  return (
    <Screen>
      <ScreenHeader title="Stadiums" subtitle={t('venues', lang)} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={COLORS.brand} />
        }
        renderSectionHeader={({ section }) => (
          <View className="flex-row items-center justify-between bg-ink pb-2 pt-3">
            <Text className="text-[13px] font-p-bold uppercase tracking-wide text-white">
              {section.flag} {section.country}
            </Text>
            <Text className="text-[12px] text-faint">{section.data.length}</Text>
          </View>
        )}
        renderItem={({ item }) => <StadiumCard stadium={item} matchCount={matchCount(item.id)} />}
      />
    </Screen>
  );
}
