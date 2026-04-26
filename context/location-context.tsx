import * as Location from 'expo-location';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const EARTH_RADIUS_KM = 6371;

export type UserCoords = {
  latitude: number;
  longitude: number;
};

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine-Distanz in Kilometern */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function formatDistanceKm(km: number): string {
  if (km < 1) {
    const m = Math.round(km * 1000);
    return `${m.toLocaleString('de-DE')} m`;
  }
  const rounded = Math.round(km * 10) / 10;
  return `${rounded.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
}

type LocationContextValue = {
  userLocation: UserCoords | null;
  refreshUserLocation: () => Promise<void>;
  calculateDistance: (lat: number, lon: number) => string | null;
};

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserCoords | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) {
        return;
      }
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } catch {
        // Simulator, deaktiviertes GPS, …
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshUserLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    } catch {
      // ignorieren
    }
  }, []);

  const calculateDistance = useCallback(
    (lat: number, lon: number): string | null => {
      if (!userLocation) {
        return null;
      }
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return null;
      }
      const km = haversineKm(userLocation.latitude, userLocation.longitude, lat, lon);
      return formatDistanceKm(km);
    },
    [userLocation]
  );

  const value = useMemo<LocationContextValue>(
    () => ({
      userLocation,
      refreshUserLocation,
      calculateDistance,
    }),
    [userLocation, refreshUserLocation, calculateDistance]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return ctx;
}

/** Kurzform für Screens */
export function useLocation() {
  return useLocationContext();
}
