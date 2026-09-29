import { useState, type FormEvent } from 'react';
import { ApiError, login } from '../api';
import { getSession, saveToken, type Session } from '../session';

interface LoginViewProps {
  onLogin: (session: Session) => void;
  /** Informational message, e.g. when the previous session expired. */
  notice?: string;
}

function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Invalid username or password';
    if (error.code === 'NETWORK_ERROR') return 'Cannot reach the server';
  }
  return 'Something went wrong, please try again';
}

export function LoginView({ onLogin, notice }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      saveToken(await login(username, password));
      const session = getSession();
      if (session) onLogin(session);
    } catch (err) {
      setError(loginErrorMessage(err));
      setPassword('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={(event) => void handleSubmit(event)}>
      <h2>Sign in</h2>
      {notice && <p className="notice">{notice}</p>}

      <label>
        Username
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
