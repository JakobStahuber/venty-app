import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEvents } from '@/context/event-context';

type Bundle = {
  id: 'starter' | 'pro' | 'premium';
  name: string;
  price: number;
  feature: string;
};

const categories = ['Clubs', 'Konzerte', 'Partys', 'Privat'];

const bundles: Bundle[] = [
  { id: 'starter', name: 'Starter-Paket', price: 20, feature: 'Standard-Hervorhebung' },
  { id: 'pro', name: 'Pro-Paket', price: 50, feature: 'Geo-Targeting' },
  { id: 'premium', name: 'Premium-Paket', price: 100, feature: 'Startseitenwerbung & Max. Impressionen' },
];

export default function PlusScreen() {
  const { addEvent } = useEvents();

  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Partys');
  const [selectedBundleId, setSelectedBundleId] = useState<Bundle['id'] | null>(null);

  const selectedBundle = useMemo(
    () => bundles.find((bundle) => bundle.id === selectedBundleId) ?? null,
    [selectedBundleId]
  );

  const ctaLabel = selectedBundle
    ? `Event veroeffentlichen & Zahlungspflichtig buchen (${selectedBundle.price} EUR)`
    : 'Event kostenlos veroeffentlichen';

  const handleSubmit = () => {
    if (!title.trim() || !dateTime.trim() || !location.trim()) {
      return;
    }

    const [rawDate, rawTime] = dateTime.split(',').map((part) => part?.trim() ?? '');
    const date = rawDate || 'Demnaechst';
    const time = rawTime || '20:00 Uhr';
    const parsedPrice = Number.parseFloat(ticketPrice.replace(',', '.')) || 0;

    addEvent({
      title,
      date,
      time,
      location: `${location} • ${selectedCategory}`,
      ticketPriceEur: parsedPrice,
      description: description || 'Weitere Details folgen in Kuerze.',
    });

    setTitle('');
    setDateTime('');
    setLocation('');
    setTicketPrice('');
    setDescription('');
    setSelectedBundleId(null);

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Event erstellen</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Basis-Infos</Text>

          <InputField
            label="Event-Titel"
            placeholder="z. B. Summer Rooftop Night"
            value={title}
            onChangeText={setTitle}
          />
          <InputField
            label="Datum & Uhrzeit"
            placeholder="z. B. 28.06.2026, 20:00 Uhr"
            value={dateTime}
            onChangeText={setDateTime}
          />
          <InputField
            label="Location"
            placeholder="z. B. Isarforum Muenchen"
            value={location}
            onChangeText={setLocation}
          />
          <InputField
            label="Ticketpreis"
            placeholder="z. B. 15 EUR"
            keyboardType="numeric"
            value={ticketPrice}
            onChangeText={setTicketPrice}
          />
          <InputField
            label="Beschreibung"
            placeholder="Kurzbeschreibung deines Events"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Kategorie</Text>
          <View style={styles.badgeRow}>
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>{category}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Reichweite & Promotion</Text>
          <Text style={styles.subSectionTitle}>Event bewerben (Optional)</Text>

          <View style={styles.bundleList}>
            {bundles.map((bundle) => {
              const isSelected = selectedBundleId === bundle.id;
              return (
                <Pressable
                  key={bundle.id}
                  onPress={() => setSelectedBundleId(isSelected ? null : bundle.id)}
                  style={[styles.bundleCard, isSelected && styles.bundleCardSelected]}>
                  <View style={styles.bundleTopRow}>
                    <Text style={[styles.bundleName, isSelected && styles.bundleNameSelected]}>
                      {bundle.name}
                    </Text>
                    <Text style={[styles.bundlePrice, isSelected && styles.bundlePriceSelected]}>
                      {bundle.price} EUR
                    </Text>
                  </View>
                  <Text style={[styles.bundleFeature, isSelected && styles.bundleFeatureSelected]}>
                    {bundle.feature}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable style={styles.ctaButton} onPress={handleSubmit}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  numberOfLines,
  keyboardType = 'default',
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={[styles.input, multiline && styles.inputMultiline]}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 14,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1f1f26',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e9ddff',
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5b21b6',
    marginBottom: 2,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 2,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: '#111827',
  },
  inputMultiline: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  badgeActive: {
    backgroundColor: '#ede9fe',
    borderColor: '#7c3aed',
  },
  badgeText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  badgeTextActive: {
    color: '#5b21b6',
  },
  bundleList: {
    gap: 10,
    marginTop: 2,
  },
  bundleCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    backgroundColor: '#faf8ff',
    padding: 12,
    gap: 6,
  },
  bundleCardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#f3efff',
  },
  bundleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  bundleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f1f26',
  },
  bundleNameSelected: {
    color: '#4c1d95',
  },
  bundlePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5b21b6',
  },
  bundlePriceSelected: {
    color: '#4c1d95',
  },
  bundleFeature: {
    fontSize: 13,
    color: '#6b7280',
  },
  bundleFeatureSelected: {
    color: '#5b21b6',
  },
  ctaButton: {
    marginTop: 2,
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
