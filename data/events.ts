export type VentyEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  distanceKm: number;
  ticketPriceEur: number;
  description: string;
  imageColor: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  attendingFriends: string[];
  attendingSummary: string;
};

export const ventyEvents: VentyEvent[] = [
  {
    id: '1',
    title: 'Sunset Rooftop Session',
    date: '07.06.2026',
    time: '20:00 Uhr',
    location: 'Olympiapark, Muenchen',
    distanceKm: 1.4,
    ticketPriceEur: 15,
    description:
      'Geniesse einen entspannten Sommerabend mit DJ-Set, Drinks und Blick ueber die Stadt. Perfekt fuer alle, die elektronische Musik und gute Vibes lieben.',
    imageColor: '#c4b5fd',
    coordinates: {
      latitude: 48.1743,
      longitude: 11.5482,
    },
    attendingFriends: ['TO', 'LE', 'MI', 'NO'],
    attendingSummary: 'Tobias und 3 weitere Freunde sind dabei',
  },
  {
    id: '2',
    title: 'Indie Night am Hafen',
    date: '12.06.2026',
    time: '21:30 Uhr',
    location: 'Kulturhalle Isar, Muenchen',
    distanceKm: 2.8,
    ticketPriceEur: 20,
    description:
      'Live-Acts aus der Indie-Szene, Streetfood und ein kleines Open-Air-Areal direkt am Wasser. Das Event verbindet Konzert und Community in lockerer Atmosphaere.',
    imageColor: '#ddd6fe',
    coordinates: {
      latitude: 48.0998,
      longitude: 11.5792,
    },
    attendingFriends: ['SA', 'PW'],
    attendingSummary: 'Sara und 1 weiterer Freund sind dabei',
  },
  {
    id: '3',
    title: 'Tech and Tacos Meetup',
    date: '18.06.2026',
    time: '19:00 Uhr',
    location: 'Werkhalle Bad Toelz',
    distanceKm: 4.2,
    ticketPriceEur: 10,
    description:
      'Networking fuer Gruender und Developer mit kurzen Talks, offenen Q and A Sessions und Taco-Bar. Ideal, um neue Leute aus Tech und Product kennenzulernen.',
    imageColor: '#ede9fe',
    coordinates: {
      latitude: 47.7602,
      longitude: 11.5588,
    },
    attendingFriends: ['EB', 'CN', 'VH', 'FK'],
    attendingSummary: 'Emilia und 3 weitere Freunde sind dabei',
  },
  {
    id: '4',
    title: 'Open Air Kino',
    date: '24.06.2026',
    time: '21:00 Uhr',
    location: 'Flaucherwiese, Muenchen',
    distanceKm: 5.9,
    ticketPriceEur: 12,
    description:
      'Filmklassiker unter freiem Himmel mit Decken, Snacks und Lounge-Bereich. Ein ruhiger Sommerabend fuer Freunde und Paare in entspannter Umgebung.',
    imageColor: '#f3f0ff',
    coordinates: {
      latitude: 48.1026,
      longitude: 11.5476,
    },
    attendingFriends: ['AM', 'RH'],
    attendingSummary: 'Anna und 1 weiterer Freund sind dabei',
  },
];
