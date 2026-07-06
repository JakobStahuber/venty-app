import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { useLocationContext } from '@/context/location-context';
import { VentyEvent, ventyEvents } from '@/data/events';
import { getApiErrorMessage, getVentyClient } from '@/lib/api';
import type { VentyEvent as BackendEvent } from '@/lib/api-client';
import { mapBackendEventToDisplayEvent } from '@/lib/mapper';

type EventInput = {
  title: string;
  startAtIso: string;
  endAtIso: string;
  location: string;
  ticketPriceEur: number;
  description: string;
  imageUri?: string | null;
};

type EventContextValue = {
  events: VentyEvent[];
  isLoading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
  addEvent: (input: EventInput) => Promise<void>;
  bookedEvents: string[];
  bookTicket: (eventId: string) => Promise<void>;
  savedEvents: string[];
  toggleSaveEvent: (eventId: string) => Promise<void>;
  clearError: () => void;
};

const EventContext = createContext<EventContextValue | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<VentyEvent[]>(ventyEvents);
  const [bookedEvents, setBookedEvents] = useState<string[]>([]);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const { userLocation } = useLocationContext();

  const loadEvents = useCallback(
    async (showLoading = true) => {
      if (!isLoggedIn) {
        setEvents([]);
        setBookedEvents([]);
        setSavedEvents([]);
        return;
      }

      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const client = await getVentyClient();
        const [nearbyResponse, bookedResponse, favoriteResponse] = await Promise.all([
          userLocation
            ? client.nearbyEvents({ lat: userLocation.latitude, lng: userLocation.longitude, radiusKm: 25, limit: 40 })
            : client.listEvents({ limit: 20 }),
          client.getMyEvents().catch(() => [] as BackendEvent[]),
          client.getMyFavorites().catch(() => [] as BackendEvent[]),
        ]);

        const mappedEvents = Array.isArray(nearbyResponse)
          ? nearbyResponse.map((event, index) => mapBackendEventToDisplayEvent(event, index, event.distanceM))
          : nearbyResponse.items.map((event, index) => mapBackendEventToDisplayEvent(event, index));

        setEvents(mappedEvents);
        setBookedEvents(bookedResponse.map((event) => event.id));
        setSavedEvents(favoriteResponse.map((event) => event.id));
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoggedIn, userLocation]
  );

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const refreshEvents = useCallback(async () => {
    await loadEvents(true);
  }, [loadEvents]);

  const addEvent = useCallback(
    async (input: EventInput) => {
      setError(null);
      try {
        const client = await getVentyClient();
        const created = await client.createEvent({
          titel: input.title,
          beschreibung: input.description,
          ortName: input.location,
          adresse: input.location,
          latitude: userLocation?.latitude ?? 48.1351,
          longitude: userLocation?.longitude ?? 11.582,
          startetAm: input.startAtIso,
          endetAm: input.endAtIso,
          maxTeilnehmer: 100,
        });
        await client.publishEvent(created.id);
        await loadEvents(true);
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
        throw new Error(message);
      }
    },
    [loadEvents, userLocation?.latitude, userLocation?.longitude]
  );

  const bookTicket = useCallback(
    async (eventId: string) => {
      setError(null);
      try {
        const client = await getVentyClient();
        await client.joinEvent(eventId);
        setBookedEvents((prev) => (prev.includes(eventId) ? prev : [...prev, eventId]));
        await loadEvents(true);
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
        throw new Error(message);
      }
    },
    [loadEvents]
  );

  const toggleSaveEvent = useCallback(
    async (eventId: string) => {
      setError(null);
      try {
        const client = await getVentyClient();
        if (savedEvents.includes(eventId)) {
          await client.unfavoriteEvent(eventId);
          setSavedEvents((prev) => prev.filter((item) => item !== eventId));
        } else {
          await client.favoriteEvent(eventId);
          setSavedEvents((prev) => (prev.includes(eventId) ? prev : [...prev, eventId]));
        }
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
        throw new Error(message);
      }
    },
    [savedEvents]
  );

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<EventContextValue>(
    () => ({
      events,
      isLoading,
      error,
      refreshEvents,
      addEvent,
      bookedEvents,
      bookTicket,
      savedEvents,
      toggleSaveEvent,
      clearError,
    }),
    [addEvent, bookTicket, bookedEvents, clearError, error, events, isLoading, refreshEvents, savedEvents, toggleSaveEvent]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) {
    throw new Error('useEvents must be used within EventProvider');
  }
  return ctx;
}

