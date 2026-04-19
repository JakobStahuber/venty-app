import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEvents } from '@/context/event-context';

const FILTERS = ['Alle', 'Party', 'Kultur', 'Sport', 'Food'] as const;
const EVENT_CATEGORY_ROTATION = ['Party', 'Kultur', 'Sport', 'Food'] as const;

export default function HomeScreen() {
  const { events } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('Alle');

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return events.filter((event) => {
      const assignedCategory =
        EVENT_CATEGORY_ROTATION[Number.parseInt(event.id, 10) % EVENT_CATEGORY_ROTATION.length];

      const matchesFilter = activeFilter === 'Alle' || assignedCategory === activeFilter;
      const matchesQuery =
        query.length === 0 ||
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query);

      return matchesFilter && matchesQuery;
    });
  }, [events, searchQuery, activeFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Venty</Text>
        <Text style={styles.title}>Events in deiner Naehe</Text>

        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={19} color="#6b7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Events suchen"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[styles.chip, isActive && styles.chipActive]}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{filter}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Keine passenden Events gefunden.</Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
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
          ))
        )}
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
    paddingBottom: 10,
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
  searchBar: {
    marginTop: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eef0f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 10,
  },
  chipRow: {
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  chipTextActive: {
    color: '#ffffff',
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
  emptyState: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '600',
  },
});
