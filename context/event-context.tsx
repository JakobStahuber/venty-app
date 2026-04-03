import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { VentyEvent, ventyEvents as initialEvents } from '@/data/events';

type EventInput = {
  title: string;
  date: string;
  time: string;
  location: string;
  ticketPriceEur: number;
  description: string;
};

type EventContextValue = {
  events: VentyEvent[];
  addEvent: (input: EventInput) => void;
  bookedEvents: string[];
  bookTicket: (eventId: string) => void;
};

const EventContext = createContext<EventContextValue | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<VentyEvent[]>(initialEvents);
  const [bookedEvents, setBookedEvents] = useState<string[]>([]);

  const value = useMemo<EventContextValue>(
    () => ({
      events,
      bookedEvents,
      addEvent: (input: EventInput) => {
        const newId = (events.length + 1).toString();
        const palette = ['#c4b5fd', '#ddd6fe', '#ede9fe', '#f3f0ff'];
        const imageColor = palette[events.length % palette.length];

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
          coordinates: {
            latitude: 48.14,
            longitude: 11.58,
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
    [events, bookedEvents]
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

