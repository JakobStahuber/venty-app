import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';

export default function AuthScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.brandBlock}>
          <Text style={styles.brandName}>Venty</Text>
          <Text style={styles.brandSubtitle}>Deine Events. Deine Stadt.</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="E-Mail"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Passwort"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              login();
              router.replace('/(tabs)');
            }}>
            <Text style={styles.primaryButtonText}>Einloggen</Text>
          </Pressable>

          <Pressable style={styles.linkButton} onPress={() => router.push('/role-selection')}>
            <Text style={styles.linkButtonText}>Neuen Account erstellen</Text>
          </Pressable>
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
    paddingHorizontal: 22,
    justifyContent: 'center',
    gap: 26,
  },
  brandBlock: {
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 44,
    fontWeight: '800',
    color: '#7c3aed',
    letterSpacing: -0.8,
  },
  brandSubtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  form: {
    gap: 12,
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
  actions: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#5b21b6',
    fontSize: 15,
    fontWeight: '600',
  },
});
