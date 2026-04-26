import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { VentyEvent, ventyEvents as initialEvents } from '@/data/events';

type EventInput = {
  title: string;
  date: string;
  time: string;
  location: string;
  ticketPriceEur: number;
  description: string;
  imageUri?: string | null;
};

type EventContextValue = {
  events: VentyEvent[];
  addEvent: (input: EventInput) => void;
  bookedEvents: string[];
  bookTicket: (eventId: string) => void;
  savedEvents: string[];
  toggleSaveEvent: (eventId: string) => void;
};

const EventContext = createContext<EventContextValue | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<VentyEvent[]>(initialEvents);
  const [bookedEvents, setBookedEvents] = useState<string[]>([]);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);

  const toggleSaveEvent = useCallback((eventId: string) => {
    setSavedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  }, []);

  const value = useMemo<EventContextValue>(
    () => ({
      events,
      bookedEvents,
      savedEvents,
      toggleSaveEvent,
      addEvent: (input: EventInput) => {
        const newId = (events.length + 1).toString();
        const palette = ['#c4b5fd', '#ddd6fe', '#ede9fe', '#f3f0ff'];
        const imageColor = palette[events.length % palette.length];
        const n = events.length;
        // Leicht versetzte Positionen rund um München, damit Marker sich nicht übereinander stapeln
        const baseLat = 48.1351;
        const baseLon = 11.582;
        const offsetLat = ((n % 5) - 2) * 0.012;
        const offsetLon = (((n * 3) % 7) - 3) * 0.012;

        const newEvent: VentyEvent = {
          id: newId,
          title: input.title,
          date: input.date,
          time: input.time,
          location: input.location,
          distanceKm: 3.2,
          ticketPriceEur: input.ticketPriceEur,
          description: input.description,
          imageColor,
          ...(input.imageUri ? { imageUri: input.imageUri } : {}),
          coordinates: {
            latitude: baseLat + offsetLat,
            longitude: baseLon + offsetLon,
          },
          attendingFriends: [],
          attendingSummary: 'Noch keine Freunde zugesagt',
        };

        setEvents((prev) => [newEvent, ...prev]);
      },
      bookTicket: (eventId: string) => {
        setBookedEvents((prev) =>
          prev.includes(eventId) ? prev : [...prev, eventId]
        );
      },
    }),
    [events, bookedEvents, savedEvents, toggleSaveEvent]
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

