import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEvents } from '@/context/event-context';
import { useLocation } from '@/context/location-context';

const INITIAL_REGION: Region = {
  latitude: 48.1351,
  longitude: 11.582,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const ZOOM_DELTA = 0.06;

export default function MapScreen() {
  const { events } = useEvents();
  const { userLocation, refreshUserLocation } = useLocation();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!userLocation) {
      return;
    }
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: ZOOM_DELTA,
        longitudeDelta: ZOOM_DELTA,
      },
      500
    );
  }, [userLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}>
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={event.coordinates}
            pinColor="#7c3aed"
            tracksViewChanges={false}>
            <Callout
              tooltip={true}
              onPress={() => router.push(`/event/${event.id}`)}>
              <View style={styles.calloutBubble}>
                <Text style={styles.calloutTitle} numberOfLines={2}>
                  {event.title}
                </Text>
                <Text style={styles.calloutPrice}>Ab {event.ticketPriceEur} €</Text>
                <Text style={styles.calloutHint}>Tippen für Details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Pressable
        style={[
          styles.fab,
          {
            bottom: insets.bottom + 88,
            right: 16,
          },
        ]}
        onPress={refreshUserLocation}
        accessibilityRole="button"
        accessibilityLabel="Karte auf meinen Standort zentrieren">
        <MaterialIcons name="my-location" size={26} color="#5b21b6" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  calloutBubble: {
    maxWidth: 260,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
  },
  calloutPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7c3aed',
    marginTop: 2,
  },
  calloutHint: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
    fontWeight: '500',
  },
});
