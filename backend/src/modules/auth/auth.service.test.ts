import { describe, expect, it } from 'vitest';
import { AuthService } from './auth.service.js';
import { TokenService } from './token.service.js';
import { InMemoryUserRepository } from './user.repository.js';

const authService = new AuthService(
  new InMemoryUserRepository(),
  new TokenService('test-secret-with-at-least-32-characters'),
);

describe('AuthService.verifyCredentials', () => {
  it('returns the user for valid credentials', async () => {
    const user = await authService.verifyCredentials('user', 'user123');

    expect(user).toMatchObject({ id: '2', role: 'user', rut: '12.345.678-5' });
  });

  it('rejects a wrong password', async () => {
    await expect(
      authService.verifyCredentials('user', 'wrong'),
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });

  it('rejects an unknown user with the same error', async () => {
    await expect(
      authService.verifyCredentials('ghost', 'user123'),
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid username or password',
    });
  });
});
