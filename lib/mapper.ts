import type { VentyEvent as BackendEvent, NearbyEvent } from '@/lib/api-client';

export type DisplayEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  distanceKm: number;
  ticketPriceEur: number;
  description: string;
  imageColor: string;
  imageUri?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  attendingFriends: string[];
  attendingSummary: string;
  category: 'Party' | 'Kultur' | 'Sport' | 'Food';
  externalId?: string;
};

const PALETTE = ['#c4b5fd', '#ddd6fe', '#ede9fe', '#f3f0ff', '#fef3c7', '#bfdbfe'];
const CATEGORIES: DisplayEvent['category'][] = ['Party', 'Kultur', 'Sport', 'Food'];

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function deriveCategory(title: string, fallback: DisplayEvent['category']): DisplayEvent['category'] {
  const haystack = title.toLowerCase();
  if (haystack.includes('party') || haystack.includes('club') || haystack.includes('night')) return 'Party';
  if (haystack.includes('kultur') || haystack.includes('musik') || haystack.includes('kino')) return 'Kultur';
  if (haystack.includes('sport') || haystack.includes('run') || haystack.includes('fitness')) return 'Sport';
  if (haystack.includes('food') || haystack.includes('taco') || haystack.includes('street')) return 'Food';
  return fallback;
}

function deriveImageColor(title: string, index: number): string {
  const normalized = title.toLowerCase();
  if (normalized.includes('sunset') || normalized.includes('roof')) return '#f59e0b';
  if (normalized.includes('tech') || normalized.includes('meetup')) return '#38bdf8';
  if (normalized.includes('kino') || normalized.includes('film')) return '#f472b6';
  return PALETTE[index % PALETTE.length];
}

function derivePrice(id: string, maxTeilnehmer: number | null): number {
  const base = 10 + ((id.length + (maxTeilnehmer ?? 0)) % 6) * 3;
  return Math.min(35, Math.max(8, base));
}

function deriveAttendingFriends(count: number): string[] {
  const initials = ['TO', 'LE', 'MI', 'NO', 'SA', 'AM', 'RH'];
  return initials.slice(0, Math.min(4, Math.max(0, count)));
}

function deriveAttendingSummary(count: number): string {
  if (count <= 0) return 'Noch keine Teilnehmer';
  if (count === 1) return '1 Teilnehmer ist dabei';
  return `${count} Teilnehmer sind dabei`;
}

export function mapBackendEventToDisplayEvent(
  event: BackendEvent | NearbyEvent,
  index = 0,
  distanceM?: number,
): DisplayEvent {
  const distanceKm = typeof distanceM === 'number' ? distanceM / 1000 : 0;
  const category = deriveCategory(event.titel, CATEGORIES[index % CATEGORIES.length]);
  return {
    id: event.id,
    title: event.titel,
    date: formatDate(event.startetAm),
    time: formatTime(event.startetAm),
    location: event.ortName ?? event.adresse ?? 'Ort folgt',
    distanceKm,
    ticketPriceEur: derivePrice(event.id, event.maxTeilnehmer),
    description: event.beschreibung ?? 'Weitere Details folgen in Kürze.',
    imageColor: deriveImageColor(event.titel, index),
    coordinates: {
      latitude: event.latitude,
      longitude: event.longitude,
    },
    attendingFriends: deriveAttendingFriends(event.teilnehmerCount),
    attendingSummary: deriveAttendingSummary(event.teilnehmerCount),
    category,
    externalId: event.id,
  };
}
