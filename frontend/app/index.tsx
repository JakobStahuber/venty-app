import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isLoggedIn } = useAuth();

  // Falls der Login-Status im Hintergrund noch geprüft wird, zeige kurz den Spinner
  if (isLoggedIn === undefined || isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f7ff' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  // Die smarte Weiche: Eingeloggt -> Tabs, Ausgeloggt -> Auth
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth" />;
}