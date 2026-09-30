import { useState, type FormEvent } from 'react';
import { ApiError, getScore, type ScoreResult } from '../api';
import type { Session } from '../session';

interface ScoreViewProps {
  session: Session;
  onLogout: () => void;
  onSessionExpired: () => void;
}

function scoreErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400)
      return 'Invalid RUT, check the number and verifier digit';
    if (error.status === 403) return 'You can only query your own RUT';
    if (error.code === 'NETWORK_ERROR') return 'Cannot reach the server';
  }
  return 'Something went wrong, please try again';
}

export function ScoreView({
  session,
  onLogout,
  onSessionExpired,
}: ScoreViewProps) {
  const [rut, setRut] = useState(session.rut ?? '');
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      setResult(await getScore(rut.trim(), session.token));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired();
        return;
      }
      setError(scoreErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <header className="session">
        <span>
          Signed in as <strong>{session.role}</strong>
          {session.rut && ` · ${session.rut}`}
        </span>
        <button type="button" className="link" onClick={onLogout}>
          Log out
        </button>
      </header>

      <form onSubmit={(event) => void handleSubmit(event)}>
        <label>
          RUT
          <input
            value={rut}
            onChange={(event) => setRut(event.target.value)}
            placeholder="12.345.678-5"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Checking…' : 'Check score'}
        </button>
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {result && (
        <dl className="result">
          <dt>RUT</dt>
          <dd>{result.rut}</dd>
          <dt>Score</dt>
          <dd className="score">
            {result.score}
            <small> / 100</small>
          </dd>
          <dt>Date</dt>
          <dd>{new Date(result.fecha).toLocaleString()}</dd>
        </dl>
      )}
    </section>
  );
}
