import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEvents } from '@/context/event-context';

export default function HomeScreen() {
  const { events } = useEvents();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Venty</Text>
        <Text style={styles.title}>Events in deiner Naehe</Text>
      </View>

      <ScrollView contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
        {events.map((event) => (
          <Pressable
            key={event.id}
            style={styles.card}
            onPress={() => router.push(`/event/${event.id}`)}>
            <View style={[styles.imagePlaceholder, { backgroundColor: event.imageColor }]}>
              <Text style={styles.imageLabel}>Event Bild</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.distance}>{event.distanceKm.toFixed(1)} km entfernt</Text>

              <View style={styles.avatarRow}>
                {event.attendingFriends.map((friend, index) => (
                  <View
                    key={`${event.id}-${friend}`}
                    style={[styles.avatar, { marginLeft: index === 0 ? 0 : -10 }]}>
                    <Text style={styles.avatarText}>{friend}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        ))}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  kicker: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1f1f26',
    letterSpacing: -0.6,
  },
  feedContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ede9fe',
  },
  imagePlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLabel: {
    color: '#5b21b6',
    fontWeight: '600',
    fontSize: 13,
  },
  cardContent: {
    padding: 14,
    gap: 6,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f1f26',
  },
  distance: {
    fontSize: 13,
    color: '#6b7280',
  },
  avatarRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingLeft: 2,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#7c3aed',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
});
