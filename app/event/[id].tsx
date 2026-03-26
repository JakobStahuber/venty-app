import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ventyEvents } from '@/data/events';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const event = ventyEvents.find((item) => item.id === id);

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Event nicht gefunden</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroImage, { backgroundColor: event.imageColor }]}>
          <Text style={styles.heroLabel}>Hero Image</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>
            {event.date}  {event.time}
          </Text>
          <Text style={styles.location}>{event.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Layer</Text>
          <View style={styles.avatarRow}>
            {event.attendingFriends.map((friend, index) => (
              <View key={`${event.id}-${friend}`} style={[styles.avatar, { marginLeft: index === 0 ? 0 : -9 }]}>
                <Text style={styles.avatarText}>{friend}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.socialText}>{event.attendingSummary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beschreibung</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preis</Text>
          <Text style={styles.price}>Standard-Ticket: {event.ticketPriceEur} EUR</Text>
        </View>
      </ScrollView>

      <View style={styles.ctaBar}>
        <Pressable style={styles.ctaButton} onPress={() => router.back()}>
          <Text style={styles.ctaText}>Ticket buchen</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  content: {
    paddingBottom: 112,
  },
  heroImage: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5b21b6',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ece8f8',
    gap: 6,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.4,
  },
  meta: {
    fontSize: 14,
    color: '#5b21b6',
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  avatarRow: {
    flexDirection: 'row',
    paddingLeft: 2,
    marginTop: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  socialText: {
    fontSize: 14,
    color: '#4b5563',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#374151',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5b21b6',
  },
  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  ctaButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});
