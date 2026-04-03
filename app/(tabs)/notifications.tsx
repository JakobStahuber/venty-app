import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { useEvents } from '@/context/event-context';

type NotificationItem = {
  id: string;
  type: 'reminder' | 'social' | 'system';
  text: string;
  timestamp: string;
  unread: boolean;
  eventId?: string;
};

export default function NotificationsScreen() {
  const { events } = useEvents();

  const baseEvent = events[0];
  const secondEvent = events[1] ?? baseEvent;
  const createdEvent = events.find((e) => Number.parseInt(e.id, 10) > 4) ?? baseEvent;

  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'reminder',
      text: baseEvent
        ? `Dein Event "${baseEvent.title}" startet morgen!`
        : 'Dein Event startet morgen!',
      timestamp: 'vor 2 Std.',
      unread: true,
      eventId: baseEvent?.id,
    },
    {
      id: '2',
      type: 'social',
      text: secondEvent
        ? `Anna und 2 weitere Freunde haben Tickets fuer "${secondEvent.title}" gebucht.`
        : 'Anna und 2 weitere Freunde haben Tickets gebucht.',
      timestamp: 'vor 5 Std.',
      unread: true,
      eventId: secondEvent?.id,
    },
    {
      id: '3',
      type: 'system',
      text: createdEvent
        ? `Dein erstelltes Event "${createdEvent.title}" ist nun live.`
        : 'Dein erstelltes Event ist nun live.',
      timestamp: 'gestern',
      unread: false,
      eventId: createdEvent?.id,
    },
  ];

  const resolveIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'reminder':
        return { name: 'event', color: '#2563eb' as const };
      case 'social':
        return { name: 'group', color: '#7c3aed' as const };
      case 'system':
      default:
        return { name: 'notifications', color: '#6b7280' as const };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Benachrichtigungen</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {notifications.map((item) => {
          const icon = resolveIcon(item.type);
          const Wrapper = item.eventId ? Pressable : View;
          const wrapperProps = item.eventId
            ? {
                onPress: () => router.push(`/event/${item.eventId}`),
              }
            : {};

          return (
            <Wrapper
              key={item.id}
              {...wrapperProps}
              style={[styles.row, item.unread && styles.rowUnread]}>
              <View style={styles.leftSection}>
                {item.unread && <View style={styles.unreadDot} />}
                <View style={styles.iconBubble}>
                  <MaterialIcons name={icon.name as any} size={20} color={icon.color} />
                </View>
                <Text style={styles.message}>{item.text}</Text>
              </View>

              <View style={styles.rightSection}>
                <Text style={styles.time}>{item.timestamp}</Text>
              </View>
            </Wrapper>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.4,
  },
  listContent: {
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  row: {
    minHeight: 74,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eceff3',
    backgroundColor: '#ffffff',
  },
  rowUnread: {
    backgroundColor: '#f7f3ff',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingRight: 8,
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: '#1f2937',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
    paddingTop: 1,
    minWidth: 62,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
  },
});
