import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getApiErrorMessage, getVentyClient, resetVentyClient } from '@/lib/api';
import type { UserMe } from '@/lib/api-client';

export type UserRole = 'private' | 'organizer';

type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  displayName: string;
};

type AuthContextValue = {
  isLoggedIn: boolean;
  isLoading: boolean;
  role: UserRole;
  user: UserMe | null;
  error: string | null;
  login: (emailOrRole: string | UserRole, password?: string) => Promise<void>;
  registerWithRole: (nextRole: UserRole, payload?: RegisterPayload) => Promise<void>;
  upgradeToOrganizer: () => Promise<void>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<UserRole>('private');
  const [user, setUser] = useState<UserMe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const client = await getVentyClient();
        if (!client.isLoggedIn) {
          if (!cancelled) {
            setIsLoggedIn(false);
            setRole('private');
            setUser(null);
          }
          return;
        }

        const me = await client.getMe();
        if (!cancelled) {
          setUser(me);
          setRole(me.veranstalterId ? 'organizer' : 'private');
          setIsLoggedIn(true);
        }
      } catch (err) {
        if (!cancelled) {
          await resetVentyClient();
          setIsLoggedIn(false);
          setRole('private');
          setUser(null);
          setError(getApiErrorMessage(err));
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

  const setAuthenticatedUser = useCallback((me: UserMe, nextRole: UserRole) => {
    setUser(me);
    setRole(nextRole);
    setIsLoggedIn(true);
    setError(null);
  }, []);

  const login = useCallback(
    async (emailOrRole: string | UserRole, password?: string) => {
      if (typeof emailOrRole === 'string' && (emailOrRole === 'private' || emailOrRole === 'organizer') && password === undefined) {
        setRole(emailOrRole);
        setIsLoggedIn(true);
        setError(null);
        return;
      }

      if (!password) {
        setError('Bitte gib dein Passwort ein.');
        return;
      }

      setError(null);
      try {
        const client = await getVentyClient();
        const me = await client.login({ email: emailOrRole, password });
        setAuthenticatedUser(me, me.veranstalterId ? 'organizer' : 'private');
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
        setError(getApiErrorMessage(err));
        throw err;
      }
    },
    [setAuthenticatedUser]
  );

  const registerWithRole = useCallback(
    async (nextRole: UserRole, payload?: RegisterPayload) => {
      if (!payload) {
        setError('Bitte fülle das Formular vollständig aus.');
        return;
      }

      setError(null);
      try {
        const client = await getVentyClient();
        const me = await client.register({
          email: payload.email,
          username: payload.username,
          password: payload.password,
          displayName: payload.displayName,
        });

        if (nextRole === 'organizer') {
          await client.createVeranstalter({
            name: payload.displayName || payload.username,
            beschreibung: null,
          });
        }

        setAuthenticatedUser(me, nextRole);
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
        setError(getApiErrorMessage(err));
        throw err;
      }
    },
    [setAuthenticatedUser]
  );

  const upgradeToOrganizer = useCallback(async () => {
    setError(null);
    try {
      const client = await getVentyClient();
      const profile = await client.createVeranstalter({
        name: user?.displayName || user?.username || 'Venty Veranstalter',
        beschreibung: null,
      });
      setUser((prev) => (prev ? { ...prev, veranstalterId: profile.id } : prev));
      setRole('organizer');
      setIsLoggedIn(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
      throw err;
    }
  }, [user?.displayName, user?.username]);

  const refreshSession = useCallback(async () => {
    try {
      const client = await getVentyClient();
      const me = await client.getMe();
      setAuthenticatedUser(me, me.veranstalterId ? 'organizer' : 'private');
    } catch (err) {
      await logout();
      setError(getApiErrorMessage(err));
      throw err;
    }
  }, [setAuthenticatedUser]);

  const logout = useCallback(async () => {
    try {
      const client = await getVentyClient();
      await client.logout().catch(() => undefined);
    } finally {
      await resetVentyClient();
      setUser(null);
      setIsLoggedIn(false);
      setRole('private');
      setError(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      isLoading,
      role,
      user,
      error,
      login,
      registerWithRole,
      upgradeToOrganizer,
      refreshSession,
      logout,
      clearError,
    }),
    [clearError, error, isLoading, isLoggedIn, login, logout, registerWithRole, refreshSession, role, upgradeToOrganizer, user]
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
