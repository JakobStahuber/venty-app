import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UserRole, useAuth } from '@/context/auth-context';

const roleCards: { id: UserRole; title: string; description: string }[] = [
  {
    id: 'private',
    title: 'Privater Nutzer',
    description: 'Events entdecken & Tickets buchen',
  },
  {
    id: 'organizer',
    title: 'Veranstalter',
    description: 'Events erstellen & bewerben',
  },
];

export default function RoleSelectionScreen() {
  const { registerWithRole, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSelectRole = async (role: UserRole) => {
    try {
      await registerWithRole(role, {
        email,
        username,
        password,
        displayName,
      });
      router.replace('/(tabs)');
    } catch {
      // Fehler wird im Kontext angezeigt.
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Wie moechtest du Venty nutzen?</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="E-Mail"
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(value) => {
              setEmail(value);
              if (error) clearError();
            }}
          />
          <TextInput style={styles.input} placeholder="Benutzername" value={username} onChangeText={setUsername} />
          <TextInput style={styles.input} placeholder="Anzeigename" value={displayName} onChangeText={setDisplayName} />
          <TextInput
            style={styles.input}
            placeholder="Passwort"
            secureTextEntry
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (error) clearError();
            }}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.cards}>
          {roleCards.map((role) => (
            <Pressable key={role.id} style={styles.card} onPress={() => handleSelectRole(role.id)}>
              <View style={styles.cardInner}>
                <Text style={styles.cardTitle}>{role.title}</Text>
                <Text style={styles.cardDescription}>{role.description}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 22,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.6,
  },
  form: {
    gap: 10,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e7e3f4',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: '#111827',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  cards: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e7e3f4',
    padding: 16,
    minHeight: 140,
    justifyContent: 'center',
    gap: 8,
  },
  cardInner: {
    gap: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5b21b6',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});
