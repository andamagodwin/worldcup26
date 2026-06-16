import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LangToggle } from '@/components/LangToggle';
import { COLORS } from '@/theme/colors';

/** Full-bleed dark screen wrapper that respects the notch. */
export function Screen({
  children,
  edges = ['top'],
}: {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-ink">
      {children}
    </SafeAreaView>
  );
}

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="flex-row items-start justify-between px-4 pb-2 pt-1">
      <View className="flex-1 pr-3">
        <Text className="text-[28px] font-p-extrabold tracking-tight text-white">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-[13px] text-muted">{subtitle}</Text> : null}
      </View>
      <View className="pt-2">
        <LangToggle />
      </View>
    </View>
  );
}

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-ink">
      <ActivityIndicator color={COLORS.brand} />
      <Text className="mt-3 text-[13px] text-muted">Loading tournament…</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-ink px-8">
      <Text className="text-center text-[15px] text-muted">{message}</Text>
      <Pressable onPress={onRetry} className="rounded-full bg-brand px-5 py-2 active:opacity-80">
        <Text className="font-p-bold text-ink">Try again</Text>
      </Pressable>
    </View>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <View className="items-center justify-center py-16">
      <Text className="text-[14px] text-faint">{text}</Text>
    </View>
  );
}
