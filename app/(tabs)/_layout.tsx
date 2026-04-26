import { Tabs, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { role } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const isOrganizer = role === 'organizer';

  useEffect(() => {
    const leaf = segments[segments.length - 1];
    if (!isOrganizer && leaf === 'plus') {
      router.replace('/(tabs)');
    }
    if (isOrganizer && leaf === 'explore') {
      router.replace('/(tabs)');
    }
  }, [isOrganizer, segments, router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 84,
          paddingTop: 8,
          paddingBottom: 24,
          borderTopWidth: 0,
          backgroundColor: '#ffffff',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Karte',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="plus"
        options={{
          title: 'Plus',
          href: isOrganizer ? undefined : null,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Entdecken',
          headerShown: false,
          href: !isOrganizer ? undefined : null,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="play.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
