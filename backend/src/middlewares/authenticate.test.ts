import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { TokenService } from '../modules/auth/token.service.js';
import { createAuthenticate } from './authenticate.js';
import { errorHandler } from './error-handler.js';

const SECRET = 'test-secret-with-at-least-32-characters';
const tokens = new TokenService(SECRET);

const app = express();
app.get('/protected', createAuthenticate(tokens), (req, res) => {
  res.json(req.user);
});
app.use(errorHandler);

function get(authorization?: string) {
  const req = request(app).get('/protected');
  return authorization ? req.set('Authorization', authorization) : req;
}

describe('authenticate middleware', () => {
  it('responds 401 without a bearer token', async () => {
    expect((await get()).status).toBe(401);
  });

  it('responds 401 for a token signed with another secret', async () => {
    const forged = jwt.sign({ role: 'admin' }, 'another-secret', {
      subject: '1',
    });

    expect((await get(`Bearer ${forged}`)).status).toBe(401);
  });

  it('responds 401 with "Token expired" for an expired token', async () => {
    const expired = jwt.sign({ role: 'user' }, SECRET, {
      subject: '2',
      expiresIn: -10,
    });
    const response = await get(`Bearer ${expired}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      error: { message: 'Token expired' },
    });
  });

  it('exposes the verified payload as req.user', async () => {
    const token = tokens.sign({
      id: '2',
      username: 'user',
      passwordHash: '',
      role: 'user',
      rut: '12.345.678-5',
    });
    const response = await get(`Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      sub: '2',
      role: 'user',
      rut: '12.345.678-5',
    });
  });
});
