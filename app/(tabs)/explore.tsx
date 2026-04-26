import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useEvents } from '@/context/event-context';
import { useLocation } from '@/context/location-context';
import type { VentyEvent } from '@/data/events';

function hasEventCoordinates(event: VentyEvent): boolean {
  const c = event.coordinates;
  return (
    c != null &&
    typeof c.latitude === 'number' &&
    typeof c.longitude === 'number' &&
    Number.isFinite(c.latitude) &&
    Number.isFinite(c.longitude)
  );
}

export default function ExploreScreen() {
  const { events, savedEvents, toggleSaveEvent } = useEvents();
  const { calculateDistance } = useLocation();
  const { height, width } = useWindowDimensions();

  const renderItem = useCallback(
    ({ item }: { item: VentyEvent }) => (
      <ReelSlide
        event={item}
        height={height}
        width={width}
        isSaved={savedEvents.includes(item.id)}
        onToggleSave={() => toggleSaveEvent(item.id)}
        distanceLabel={
          hasEventCoordinates(item)
            ? calculateDistance(item.coordinates.latitude, item.coordinates.longitude)
            : null
        }
      />
    ),
    [height, width, savedEvents, toggleSaveEvent, calculateDistance]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: height,
      offset: height * index,
      index,
    }),
    [height]
  );

  if (events.length === 0) {
    return <View style={[styles.empty, { width, height }]} />;
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        getItemLayout={getItemLayout}
      />
    </View>
  );
}

function ReelSlide({
  event,
  height,
  width,
  isSaved,
  onToggleSave,
  distanceLabel,
}: {
  event: VentyEvent;
  height: number;
  width: number;
  isSaved: boolean;
  onToggleSave: () => void;
  distanceLabel: string | null;
}) {
  const showDistanceBadge = distanceLabel != null && distanceLabel.length > 0;

  return (
    <View style={{ height, width }}>
      {event.imageUri ? (
        <Image
          source={{ uri: event.imageUri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: event.imageColor }]} />
      )}

      <Pressable
        style={[styles.heartWrap, { top: height * 0.34 }]}
        onPress={onToggleSave}
        accessibilityRole="button"
        accessibilityLabel={isSaved ? 'Von Merkliste entfernen' : 'Event merken'}>
        <Ionicons
          name={isSaved ? 'heart' : 'heart-outline'}
          size={36}
          color={isSaved ? 'red' : 'white'}
          style={styles.heartIcon}
        />
      </Pressable>

      <View style={[styles.bottomPanel, { width }]}>
        <Text style={styles.title} numberOfLines={3}>
          {event.title}
        </Text>
        <View style={styles.titleMetaRow}>
          <Text style={styles.dateLine}>
            {event.date} · {event.time}
          </Text>
          {showDistanceBadge ? (
            <View style={styles.distanceBadge}>
              <MaterialIcons name="place" size={16} color="#ffffff" style={styles.distanceIcon} />
              <Text style={styles.distanceText}>{distanceLabel}</Text>
            </View>
          ) : null}
        </View>
        <Pressable
          style={styles.detailsBtn}
          onPress={() => router.push(`/event/${event.id}`)}
          accessibilityRole="button"
          accessibilityLabel="Details">
          <Text style={styles.detailsBtnText}>Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  empty: {
    backgroundColor: '#000000',
  },
  heartWrap: {
    position: 'absolute',
    right: 16,
    zIndex: 2,
    padding: 8,
  },
  heartIcon: {
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bottomPanel: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  titleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  dateLine: {
    flex: 1,
    minWidth: 120,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.88)',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  distanceIcon: {
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  detailsBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  detailsBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});
