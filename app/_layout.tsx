import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { EventProvider } from '@/context/event-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  
  // Hilfs-State, um sicherzustellen, dass das Layout 100% geladen ist
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (!navigationState?.key) return;
    setIsNavigationReady(true);
  }, [navigationState?.key]);

  useEffect(() => {
    if (!isNavigationReady) return;

    // setTimeout verhindert die Race-Condition beim allerersten App-Start
    const routingTimer = setTimeout(() => {
      const firstSegment = segments[0];
      const isAuthRoute = firstSegment === 'auth' || firstSegment === 'role-selection';

      if (!isLoggedIn && !isAuthRoute) {
        router.replace('/auth');
      } else if (isLoggedIn && isAuthRoute) {
        router.replace('/(tabs)');
      }
    }, 1);

    return () => clearTimeout(routingTimer);
  }, [isLoggedIn, segments, isNavigationReady, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen
        name="role-selection"
        options={{
          headerShown: false,
          title: 'Rolle',
          animation: 'slide_from_right',
          headerBackTitle: 'Zurueck',
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="event/[id]"
        options={{
          headerShown: false,
          title: 'Event',
          animation: 'slide_from_right',
          headerBackTitle: 'Zurueck',
        }}
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false, title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <EventProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootNavigator />
          <StatusBar style="auto" />
        </ThemeProvider>
      </EventProvider>
    </AuthProvider>
  );
}