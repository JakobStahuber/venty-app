import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

import { ApiError, AuthTokens, VentyClient } from '@/lib/api-client';

const TOKEN_KEY = 'venty.tokens';
const DEFAULT_BASE_URL = 'http://localhost:3000';

function getBaseUrl() {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  return extra?.apiBaseUrl ?? DEFAULT_BASE_URL;
}

async function loadStoredTokens(): Promise<AuthTokens | null> {
  try {
    const raw = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}

async function persistTokens(tokens: AuthTokens | null) {
  try {
    if (tokens) {
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch {
    // ignore storage errors in this app shell
  }
}

let clientInstance: VentyClient | null = null;

export async function getVentyClient(): Promise<VentyClient> {
  if (clientInstance) {
    return clientInstance;
  }

  const tokens = await loadStoredTokens();
  clientInstance = new VentyClient({
    baseUrl: getBaseUrl(),
    tokens,
    onTokensChanged: (nextTokens) => {
      void persistTokens(nextTokens);
    },
  });
  return clientInstance;
}

export async function resetVentyClient() {
  clientInstance = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'EVENT_FULL':
        return 'Dieses Event ist bereits vollständig ausgebucht.';
      case 'INVALID_CREDENTIALS':
      case 'INVALID_LOGIN':
        return 'Die E-Mail oder das Passwort ist ungültig.';
      case 'EMAIL_ALREADY_EXISTS':
        return 'Diese E-Mail ist bereits registriert.';
      case 'UNAUTHORIZED':
        return 'Bitte melde dich erneut an.';
      default:
        return error.message || 'Etwas ist schiefgelaufen.';
    }
  }

  return 'Etwas ist schiefgelaufen. Bitte versuche es erneut.';
}

export function getApiBaseUrl(): string {
  return getBaseUrl();
}
