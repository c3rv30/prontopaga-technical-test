const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface ScoreResult {
  rut: string;
  score: number;
  fecha: string;
}

/** Error returned by the API (or a network failure, with status 0). */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface ErrorBody {
  error?: { code?: string; message?: string };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server');
  }

  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const { error } = body as ErrorBody;
    throw new ApiError(
      response.status,
      error?.code ?? 'UNKNOWN_ERROR',
      error?.message ?? 'Unexpected error',
    );
  }
  return body as T;
}

export async function login(
  username: string,
  password: string,
): Promise<string> {
  const { token } = await request<{ token: string }>('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return token;
}

export function getScore(rut: string, token: string): Promise<ScoreResult> {
  return request<ScoreResult>(`/score/${encodeURIComponent(rut)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
