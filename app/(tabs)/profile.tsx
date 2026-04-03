import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/auth-context';
import { useEvents } from '@/context/event-context';

const friends = [
  { id: 'f1', name: 'Lena', initials: 'LE' },
  { id: 'f2', name: 'Tobias', initials: 'TO' },
  { id: 'f3', name: 'Mila', initials: 'MI' },
  { id: 'f4', name: 'Noah', initials: 'NO' },
  { id: 'f5', name: 'Sara', initials: 'SA' },
];

const settingsItems = ['Datenschutz', 'Benachrichtigungen', 'Hilfe'];

export default function ProfileScreen() {
  const { role, upgradeToOrganizer, logout } = useAuth();
  const { events, bookedEvents } = useEvents();

  const myTickets = events.filter((event) => bookedEvents.includes(event.id));
  const myCreatedEvents = events.filter((event) => Number.parseInt(event.id, 10) > 4);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>JS</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Jakob Stahuber</Text>
            <Text style={styles.profileSubline}>@venty.jakob</Text>
          </View>
        </View>

        {role === 'private' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Meine Tickets</Text>
            <Text style={styles.cardSubtitle}>
              {myTickets.length > 0 ? 'Aktive Buchungen' : 'Noch keine Tickets gebucht'}
            </Text>
            {myTickets.map((event) => (
              <View key={event.id} style={styles.ticketCard}>
                <View style={styles.ticketLeft}>
                  <View style={[styles.ticketStripe, { backgroundColor: event.imageColor }]} />
                  <View style={styles.ticketTextBlock}>
                    <Text style={styles.ticketTitle}>{event.title}</Text>
                    <Text style={styles.ticketMeta}>
                      {event.date} • {event.time}
                    </Text>
                    <Text style={styles.ticketLocation}>{event.location}</Text>
                  </View>
                </View>
                <View style={styles.ticketRight}>
                  <View style={styles.qrMock}>
                    <MaterialIcons name="qr-code-2" size={22} color="#4b5563" />
                  </View>
                  <Text style={styles.ticketPrice}>{event.ticketPriceEur} EUR</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Veranstalter Dashboard</Text>
            <Text style={styles.cardSubtitle}>Uebersicht deiner Events</Text>
            <View style={styles.analyticsRow}>
              <View className="box" style={styles.analyticsBox}>
                <Text style={styles.analyticsLabel}>Tickets verkauft</Text>
                <Text style={styles.analyticsValue}>142</Text>
              </View>
              <View style={styles.analyticsBox}>
                <Text style={styles.analyticsLabel}>Umsatz</Text>
                <Text style={styles.analyticsValue}>2.130 EUR</Text>
              </View>
            </View>
            {myCreatedEvents.map((event) => (
              <View key={event.id} style={styles.eventRow}>
                <View style={styles.eventDot} />
                <View style={styles.eventTextBlock}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>
                    {event.date} • {event.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Persoenliche Freunde</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.friendsRow}>
            {friends.map((friend) => (
              <View key={friend.id} style={styles.friendItem}>
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendInitials}>{friend.initials}</Text>
                </View>
                <Text style={styles.friendName}>{friend.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Veranstalter-Dashboard</Text>
          <Text style={styles.cardSubtitle}>Werbecenter Insights</Text>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsBox}>
              <Text style={styles.analyticsLabel}>Umsatz</Text>
              <Text style={styles.analyticsValue}>150 EUR</Text>
            </View>
            <View style={styles.analyticsBox}>
              <Text style={styles.analyticsLabel}>Teilnehmer</Text>
              <Text style={styles.analyticsValue}>45</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Einstellungen</Text>
          {role === 'private' ? (
            <Pressable style={styles.upgradeButton} onPress={upgradeToOrganizer}>
              <Text style={styles.upgradeButtonText}>Als Veranstalter registrieren</Text>
            </Pressable>
          ) : (
            <View style={styles.organizerBadge}>
              <Text style={styles.organizerBadgeText}>Du bist als Veranstalter registriert</Text>
            </View>
          )}
          <View style={styles.settingsList}>
            {settingsItems.map((item, index) => (
              <View
                key={item}
                style={[styles.settingsRow, index < settingsItems.length - 1 && styles.settingsRowBorder]}>
                <Text style={styles.settingsText}>{item}</Text>
                <IconSymbol name="chevron.right" size={17} color="#9ca3af" />
              </View>
            ))}
          </View>
          <Pressable style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Ausloggen</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 14,
  },
  profileHeader: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ddd6fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5b21b6',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.4,
  },
  profileSubline: {
    marginTop: 2,
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ededf2',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  eventDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#7c3aed',
  },
  eventTextBlock: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  eventDate: {
    marginTop: 1,
    fontSize: 13,
    color: '#6b7280',
  },
  friendsRow: {
    paddingVertical: 2,
    gap: 12,
  },
  friendItem: {
    width: 64,
    alignItems: 'center',
    gap: 6,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  friendInitials: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5b21b6',
  },
  friendName: {
    fontSize: 12,
    color: '#4b5563',
  },
  analyticsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  analyticsBox: {
    flex: 1,
    backgroundColor: '#faf8ff',
    borderWidth: 1,
    borderColor: '#e9ddff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 2,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  analyticsValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5b21b6',
    letterSpacing: -0.3,
  },
  settingsList: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eceef2',
    marginTop: 6,
  },
  settingsRow: {
    backgroundColor: '#ffffff',
    minHeight: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  settingsText: {
    fontSize: 15,
    color: '#111827',
  },
  upgradeButton: {
    marginTop: 4,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  organizerBadge: {
    marginTop: 4,
    borderRadius: 12,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    backgroundColor: '#f5f3ff',
  },
  organizerBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5b21b6',
  },
});
