import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const USER_ROLE_KEY = 'user_role';

export type UserRole = 'private' | 'organizer';

type AuthContextValue = {
  isLoggedIn: boolean;
  isLoading: boolean;
  role: UserRole;
  login: (role?: UserRole) => Promise<void>;
  registerWithRole: (nextRole: UserRole) => Promise<void>;
  upgradeToOrganizer: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function parseStoredRole(value: string | null): UserRole | null {
  if (value === 'private' || value === 'organizer') {
    return value;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<UserRole>('private');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_ROLE_KEY);
        const parsed = parseStoredRole(stored);
        if (!cancelled && parsed !== null) {
          setRole(parsed);
          setIsLoggedIn(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (nextRole: UserRole = 'private') => {
    await AsyncStorage.setItem(USER_ROLE_KEY, nextRole);
    setRole(nextRole);
    setIsLoggedIn(true);
  }, []);

  const registerWithRole = useCallback(async (nextRole: UserRole) => {
    await AsyncStorage.setItem(USER_ROLE_KEY, nextRole);
    setRole(nextRole);
    setIsLoggedIn(true);
  }, []);

  const upgradeToOrganizer = useCallback(async () => {
    await AsyncStorage.setItem(USER_ROLE_KEY, 'organizer');
    setRole('organizer');
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(USER_ROLE_KEY);
    setIsLoggedIn(false);
    setRole('private');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      isLoading,
      role,
      login,
      registerWithRole,
      upgradeToOrganizer,
      logout,
    }),
    [isLoggedIn, isLoading, role, login, registerWithRole, upgradeToOrganizer, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
