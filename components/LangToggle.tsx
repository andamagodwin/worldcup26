import { Pressable, Text, View } from 'react-native';

import { useStore } from '@/store/store';

/** EN / فا pill that flips the app language. */
export function LangToggle() {
  const lang = useStore((s) => s.lang);
  const toggleLang = useStore((s) => s.toggleLang);

  return (
    <Pressable
      onPress={toggleLang}
      className="flex-row overflow-hidden rounded-full bg-surface active:opacity-70">
      <View className={`px-2.5 py-1 ${lang === 'en' ? 'bg-brand' : ''}`}>
        <Text className={`text-[12px] font-p-bold ${lang === 'en' ? 'text-ink' : 'text-muted'}`}>EN</Text>
      </View>
      <View className={`px-2.5 py-1 ${lang === 'fa' ? 'bg-brand' : ''}`}>
        <Text className={`text-[12px] font-p-bold ${lang === 'fa' ? 'text-ink' : 'text-muted'}`}>فا</Text>
      </View>
    </Pressable>
  );
}
