import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import MapView, { Callout, Marker, Region } from 'react-native-maps';

import { ventyEvents } from '@/data/events';

const INITIAL_REGION: Region = {
  latitude: 47.95,
  longitude: 11.57,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function MapScreen() {
  return (
    <MapView style={styles.map} initialRegion={INITIAL_REGION}>
      {ventyEvents.slice(0, 3).map((event) => (
        <Marker
          key={event.id}
          coordinate={event.coordinates}
          pinColor="#7c3aed">
          <Callout onPress={() => router.push(`/event/${event.id}`)}>
            <Text style={styles.calloutTitle}>{event.title}</Text>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f1f26',
    paddingVertical: 2,
  },
});
