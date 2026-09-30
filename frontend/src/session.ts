const TOKEN_KEY = 'token';

export interface Session {
  token: string;
  role: 'admin' | 'user';
  rut?: string;
}

export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Reads the stored token and decodes its payload for display purposes only.
 * The signature is not verified here: the API remains the authority.
 */
export function getSession(): Session | null {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64)) as Omit<Session, 'token'>;
    return { token, role: payload.role, rut: payload.rut };
  } catch {
    clearToken();
    return null;
  }
}
