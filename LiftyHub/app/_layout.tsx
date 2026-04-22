import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { LanguageProvider } from '@/src/context/LanguageContext';
import { SubscriptionProvider } from '@/src/context/SubscriptionContext';
import { UnitsProvider } from '@/src/context/UnitsContext';
import { WorkoutProvider } from '@/src/context/WorkoutContext';
import { syncPendingWorkouts } from '@/src/utils/pendingSync';
import * as Storage from '@/src/utils/storage';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const prevConnected = useRef<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await Storage.getItem('token');
      if (!token) {
        router.replace('/auth/login');
      }
    };

    checkToken();
  }, []);

  // Auto-sync pending workouts when connectivity is restored
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isNowConnected = state.isConnected ?? false;
      if (isNowConnected && prevConnected.current === false) {
        const token = await Storage.getItem('token');
        if (token) syncPendingWorkouts(token);
      }
      prevConnected.current = isNowConnected;
    });
    return unsubscribe;
  }, []);

  return (
    <LanguageProvider>
    <UnitsProvider>
    <SubscriptionProvider>
    <WorkoutProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="settings/index" options={{ headerShown: false }} />
        <Stack.Screen name="settings/about" options={{ headerShown: false }} />
        <Stack.Screen name="settings/privacy" options={{ headerShown: false }} />
        <Stack.Screen name="settings/plans" options={{ headerShown: false }} />
        <Stack.Screen name="settings/permissions" options={{ headerShown: false }} />
        <Stack.Screen name="nutritionist-profile" options={{ headerShown: false }} />
        <Stack.Screen name="exercise/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="routines/new" options={{ headerShown: false }} />
        <Stack.Screen name="routines/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="routines/session" options={{ headerShown: false }} />
        <Stack.Screen name="routines/edit/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="diet/nutritionists" options={{ headerShown: false }} />
        <Stack.Screen name="diet/plan" options={{ headerShown: false }} />
        <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="friends" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
    </WorkoutProvider>
    </SubscriptionProvider>
    </UnitsProvider>
    </LanguageProvider>
  );
}
