import { StyleSheet, Text } from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';

type MapEvent = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const INITIAL_REGION: Region = {
  latitude: 47.95,
  longitude: 11.57,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const mapEvents: MapEvent[] = [
  {
    id: '1',
    name: 'Sunset im Olympiapark',
    latitude: 48.1743,
    longitude: 11.5482,
  },
  {
    id: '2',
    name: 'Konzert an der Isar',
    latitude: 48.0998,
    longitude: 11.5792,
  },
  {
    id: '3',
    name: 'Afterwork in Bad Toelz',
    latitude: 47.7602,
    longitude: 11.5588,
  },
];

export default function MapScreen() {
  return (
    <MapView style={styles.map} initialRegion={INITIAL_REGION}>
      {mapEvents.map((event) => (
        <Marker
          key={event.id}
          coordinate={{ latitude: event.latitude, longitude: event.longitude }}
          pinColor="#7c3aed">
          <Callout>
            <Text style={styles.calloutTitle}>{event.name}</Text>
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
