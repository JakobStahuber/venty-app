import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type UserRole = 'private' | 'organizer';

type AuthContextValue = {
  isLoggedIn: boolean;
  role: UserRole;
  login: () => void;
  registerWithRole: (nextRole: UserRole) => void;
  upgradeToOrganizer: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>('private');

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      role,
      login: () => setIsLoggedIn(true),
      registerWithRole: (nextRole: UserRole) => {
        setRole(nextRole);
        setIsLoggedIn(true);
      },
      upgradeToOrganizer: () => setRole('organizer'),
      logout: () => {
        setIsLoggedIn(false);
        setRole('private');
      },
    }),
    [isLoggedIn, role]
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
