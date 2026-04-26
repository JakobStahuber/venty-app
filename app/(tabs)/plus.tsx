import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEvents } from '@/context/event-context';

type Bundle = {
  id: 'starter' | 'pro' | 'premium';
  name: string;
  price: number;
  feature: string;
};

const categories = ['Clubs', 'Konzerte', 'Partys', 'Privat'] as const;

const bundles: Bundle[] = [
  { id: 'starter', name: 'Starter-Paket', price: 20, feature: 'Standard-Hervorhebung' },
  { id: 'pro', name: 'Pro-Paket', price: 50, feature: 'Geo-Targeting' },
  { id: 'premium', name: 'Premium-Paket', price: 100, feature: 'Startseitenwerbung & Max. Impressionen' },
];

function formatDateGerman(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function formatTimeGerman(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${min} Uhr`;
}

export default function PlusScreen() {
  const { addEvent } = useEvents();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventTime, setEventTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number] | null>(null);
  const [selectedBundleId, setSelectedBundleId] = useState<Bundle['id'] | null>(null);

  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    date?: string;
    time?: string;
    category?: string;
  }>({});

  const selectedBundle = useMemo(
    () => bundles.find((bundle) => bundle.id === selectedBundleId) ?? null,
    [selectedBundleId]
  );

  const ctaLabel = selectedBundle
    ? `Event veröffentlichen & zahlungspflichtig buchen (${selectedBundle.price} €)`
    : 'Event kostenlos veröffentlichen';

  const isFormValid =
    title.trim().length > 0 &&
    eventDate !== null &&
    eventTime !== null &&
    selectedCategory !== null;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onDatePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed') {
      if (Platform.OS === 'ios') setShowDatePicker(false);
      return;
    }
    if (date) {
      setEventDate(date);
      setFieldErrors((e) => ({ ...e, date: undefined }));
    }
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  const onTimePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (event.type === 'dismissed') {
      if (Platform.OS === 'ios') setShowTimePicker(false);
      return;
    }
    if (date) {
      setEventTime(date);
      setFieldErrors((e) => ({ ...e, time: undefined }));
    }
    if (Platform.OS === 'ios') {
      setShowTimePicker(false);
    }
  };

  const validateAndSubmit = () => {
    const next: typeof fieldErrors = {};
    if (!title.trim()) next.title = 'Bitte einen Titel eingeben.';
    if (!eventDate) next.date = 'Bitte ein Datum wählen.';
    if (!eventTime) next.time = 'Bitte eine Uhrzeit wählen.';
    if (!selectedCategory) next.category = 'Bitte eine Kategorie wählen.';

    setFieldErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    const dateStr = formatDateGerman(eventDate!);
    const timeStr = formatTimeGerman(eventTime!);
    const parsedPrice = Number.parseFloat(ticketPrice.replace(',', '.')) || 0;

    addEvent({
      title: title.trim(),
      date: dateStr,
      time: timeStr,
      location: `${location.trim() || 'Ort folgt'} • ${selectedCategory!}`,
      ticketPriceEur: parsedPrice,
      description: description.trim() || 'Weitere Details folgen in Kürze.',
      imageUri: imageUri ?? undefined,
    });

    setTitle('');
    setEventDate(null);
    setEventTime(null);
    setLocation('');
    setTicketPrice('');
    setDescription('');
    setImageUri(null);
    setSelectedCategory(null);
    setSelectedBundleId(null);
    setFieldErrors({});

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 8 : 0}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Pressable
            onPress={pickImage}
            style={[styles.imageUploadBox, imageUri ? styles.imageUploadBoxFilled : null]}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} contentFit="cover" />
            ) : (
              <View style={styles.imageUploadPlaceholder}>
                <MaterialIcons name="photo-camera" size={36} color="#7c3aed" />
              </View>
            )}
          </Pressable>
          <Text style={styles.imageUploadCaption}>Titelbild hinzufügen</Text>

          <Text style={styles.pageTitle}>Event erstellen</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Basis-Infos</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event-Titel *</Text>
              <TextInput
                placeholder="z. B. Summer Rooftop Night"
                placeholderTextColor="#9ca3af"
                style={[styles.input, fieldErrors.title && styles.inputError]}
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  if (fieldErrors.title) setFieldErrors((e) => ({ ...e, title: undefined }));
                }}
              />
              {fieldErrors.title ? <Text style={styles.fieldError}>{fieldErrors.title}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Datum *</Text>
              <Pressable
                onPress={() => {
                  setShowTimePicker(false);
                  setShowDatePicker(true);
                }}
                style={[styles.pickerField, fieldErrors.date && styles.inputError]}>
                <MaterialIcons name="calendar-today" size={20} color="#6b7280" />
                <Text style={[styles.pickerFieldText, !eventDate && styles.pickerPlaceholder]}>
                  {eventDate ? formatDateGerman(eventDate) : 'Datum auswählen'}
                </Text>
                <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
              </Pressable>
              {fieldErrors.date ? <Text style={styles.fieldError}>{fieldErrors.date}</Text> : null}
            </View>

            {showDatePicker ? (
              <DateTimePicker
                value={eventDate ?? new Date()}
                mode="date"
                display="default"
                onChange={onDatePickerChange}
                minimumDate={new Date(2020, 0, 1)}
                maximumDate={new Date(2035, 11, 31)}
                locale="de-DE"
              />
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Uhrzeit *</Text>
              <Pressable
                onPress={() => {
                  setShowDatePicker(false);
                  setShowTimePicker(true);
                }}
                style={[styles.pickerField, fieldErrors.time && styles.inputError]}>
                <MaterialIcons name="schedule" size={20} color="#6b7280" />
                <Text style={[styles.pickerFieldText, !eventTime && styles.pickerPlaceholder]}>
                  {eventTime ? formatTimeGerman(eventTime) : 'Uhrzeit auswählen'}
                </Text>
                <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
              </Pressable>
              {fieldErrors.time ? <Text style={styles.fieldError}>{fieldErrors.time}</Text> : null}
            </View>

            {showTimePicker ? (
              <DateTimePicker
                value={eventTime ?? new Date()}
                mode="time"
                display="default"
                onChange={onTimePickerChange}
                locale="de-DE"
                is24Hour
              />
            ) : null}

            <InputField
              label="Location"
              placeholder="z. B. Isarforum München"
              value={location}
              onChangeText={setLocation}
            />
            <InputField
              label="Ticketpreis"
              placeholder="z. B. 15"
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

            <Text style={styles.label}>Kategorie *</Text>
            <View style={[styles.badgeRow, fieldErrors.category && styles.badgeRowError]}>
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <Pressable
                    key={category}
                    onPress={() => {
                      setSelectedCategory(category);
                      if (fieldErrors.category) setFieldErrors((e) => ({ ...e, category: undefined }));
                    }}
                    style={[styles.badge, isActive && styles.badgeActive]}>
                    <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>{category}</Text>
                  </Pressable>
                );
              })}
            </View>
            {fieldErrors.category ? <Text style={styles.fieldError}>{fieldErrors.category}</Text> : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Reichweite & Promotion</Text>
            <Text style={styles.subSectionTitle}>Event bewerben (optional)</Text>

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
                        {bundle.price} €
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

          <Pressable
            style={[styles.ctaButton, !isFormValid && styles.ctaButtonMuted]}
            onPress={validateAndSubmit}>
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 14,
  },
  imageUploadBox: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    backgroundColor: '#f3f4f6',
    minHeight: 168,
    overflow: 'hidden',
  },
  imageUploadBoxFilled: {
    borderStyle: 'solid',
    borderColor: '#e9ddff',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  imageUploadPlaceholder: {
    minHeight: 168,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 190,
  },
  imageUploadCaption: {
    alignSelf: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 4,
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
  inputError: {
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
  },
  fieldError: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
    marginTop: 2,
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  pickerFieldText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  pickerPlaceholder: {
    color: '#9ca3af',
    fontWeight: '400',
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
    padding: 4,
    marginHorizontal: -4,
    borderRadius: 12,
  },
  badgeRowError: {
    borderWidth: 1,
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
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
  ctaButtonMuted: {
    opacity: 0.55,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
