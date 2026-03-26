import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NotificationItem = {
  id: string;
  type: 'friendEvent' | 'network' | 'recommendation';
  text: string;
  timestamp: string;
  unread: boolean;
  avatarLabel: string;
};

const notifications: NotificationItem[] = [
  {
    id: '1',
    type: 'friendEvent',
    text: 'Tobias hat fuer das Event am 07.06. zugesagt',
    timestamp: 'vor 2 Std.',
    unread: true,
    avatarLabel: 'TO',
  },
  {
    id: '2',
    type: 'network',
    text: 'Lena_Myr ist jetzt mit dir befreundet',
    timestamp: 'vor 5 Std.',
    unread: true,
    avatarLabel: 'LE',
  },
  {
    id: '3',
    type: 'recommendation',
    text: 'Neues Event in deiner Naehe, das dir gefallen koennte',
    timestamp: 'gestern',
    unread: false,
    avatarLabel: 'AI',
  },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Benachrichtigungen</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {notifications.map((item) => (
          <View key={item.id} style={[styles.row, item.unread && styles.rowUnread]}>
            <View style={styles.leftSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.avatarLabel}</Text>
              </View>
              <Text style={styles.message}>{item.text}</Text>
            </View>

            <View style={styles.rightSection}>
              {item.unread ? <View style={styles.unreadDot} /> : null}
              <Text style={styles.time}>{item.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.4,
  },
  listContent: {
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  row: {
    minHeight: 74,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eceff3',
    backgroundColor: '#ffffff',
  },
  rowUnread: {
    backgroundColor: '#f7f3ff',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingRight: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5b21b6',
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: '#1f2937',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
    paddingTop: 1,
    minWidth: 62,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7c3aed',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
  },
});
