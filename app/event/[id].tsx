import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEvents } from '@/context/event-context';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { events, bookTicket } = useEvents();
  const insets = useSafeAreaInsets();
  const event = events.find((item) => item.id === id);

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Event nicht gefunden</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Zurueck</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleBook = () => {
    Alert.alert(
      'Apple Pay',
      `Ticket fuer "${event.title}" kaufen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Kaufen',
          style: 'default',
          onPress: () => {
            if (id) {
              bookTicket(String(id));
            }
            Alert.alert('Erfolg', 'Dein Ticket wurde gebucht.');
            router.replace('/(tabs)');
          },
        },
      ],
      { userInterfaceStyle: 'light' }
    );
  };

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
        <View style={styles.ctaPriceBlock}>
          <Text style={styles.ctaPriceLabel}>Ab</Text>
          <Text style={styles.ctaPriceValue}>{event.ticketPriceEur} EUR</Text>
        </View>
        <Pressable style={styles.ctaButton} onPress={handleBook}>
          <Text style={styles.ctaText}>Ticket buchen</Text>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.backIconWrapper,
          {
            top: insets.top + 10,
          },
        ]}
        onPress={() => router.back()}>
        <Text style={styles.backIconText}>{'‹'}</Text>
      </Pressable>
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
  ctaPriceBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 12,
  },
  ctaPriceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  ctaPriceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  ctaButton: {
    flex: 1,
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
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  backIconWrapper: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIconText: {
    fontSize: 20,
    color: '#111827',
  },
});
