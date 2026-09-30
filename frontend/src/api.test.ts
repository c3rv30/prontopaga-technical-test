import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, getScore } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api client', () => {
  it('turns an API error body into an ApiError', async () => {
    const body = {
      error: { code: 'FORBIDDEN', message: 'You can only query your own RUT' },
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json(body, { status: 403 })),
    );

    await expect(getScore('10.000.013-K', 'token')).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
      message: 'You can only query your own RUT',
    });
  });

  it('reports network failures as NETWORK_ERROR', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    );

    const error: unknown = await getScore('12.345.678-5', 'token').catch(
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 0, code: 'NETWORK_ERROR' });
  });
});
