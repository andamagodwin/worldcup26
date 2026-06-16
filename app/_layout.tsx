import '../global.css';

import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { applyPoppinsDefault, poppins } from '@/lib/fonts';
import { COLORS } from '@/theme/colors';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Make Poppins the default font for every Text before anything renders.
applyPoppinsDefault();
SplashScreen.preventAutoHideAsync();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.ink,
    card: COLORS.ink,
    text: COLORS.white,
    border: COLORS.line,
    primary: COLORS.brand,
  },
};

const headerStyle = {
  headerStyle: { backgroundColor: COLORS.ink },
  headerTintColor: COLORS.white,
  headerTitleStyle: { fontFamily: 'Poppins_700Bold' },
  headerShadowVisible: false,
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(poppins);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navTheme}>
        <StatusBar style="light" />
        <Stack screenOptions={headerStyle}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="match/[id]"
            options={{ title: 'Match', presentation: 'card' }}
          />
          <Stack.Screen name="team/[id]" options={{ title: 'Team' }} />
          <Stack.Screen name="stadium/[id]" options={{ title: 'Stadium' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
