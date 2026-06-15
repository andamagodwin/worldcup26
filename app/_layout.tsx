import '../global.css';

import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0A0E17',
    card: '#0A0E17',
    text: '#FFFFFF',
    border: '#26304A',
    primary: '#FF7A1A',
  },
};

const headerStyle = {
  headerStyle: { backgroundColor: '#0A0E17' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700' as const },
  headerShadowVisible: false,
};

export default function RootLayout() {
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
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
