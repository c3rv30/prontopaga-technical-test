import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';
import { loadConfig } from '../../config.js';

const app = createApp(loadConfig({ NODE_ENV: 'test' }));

async function login(username: string, password: string) {
  return request(app).post('/login').send({ username, password });
}

function decodeToken(body: unknown) {
  const { token } = body as { token: string };
  return jwt.decode(token);
}

describe('POST /login', () => {
  it('returns a token with sub, role and rut for a user', async () => {
    const response = await login('user', 'user123');

    expect(response.status).toBe(200);
    const payload = decodeToken(response.body);
    expect(payload).toMatchObject({
      sub: '2',
      role: 'user',
      rut: '12.345.678-5',
    });
    expect(payload).toHaveProperty('exp');
  });

  it('returns a token without rut for an admin', async () => {
    const response = await login('admin', 'admin123');

    expect(response.status).toBe(200);
    const payload = decodeToken(response.body);
    expect(payload).toMatchObject({ sub: '1', role: 'admin' });
    expect(payload).not.toHaveProperty('rut');
  });

  it('responds 401 for invalid credentials', async () => {
    const response = await login('user', 'wrong');

    expect(response.status).toBe(401);
  });

  it('responds 400 when the body is incomplete', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'user' });

    expect(response.status).toBe(400);
  });
});
