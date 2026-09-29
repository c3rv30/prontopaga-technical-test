import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';
import { loadConfig } from '../../config.js';

const app = createApp(loadConfig({ NODE_ENV: 'test' }));

async function loginAs(username: string, password: string): Promise<string> {
  const response = await request(app)
    .post('/login')
    .send({ username, password });
  return (response.body as { token: string }).token;
}

async function getScore(rut: string, token: string) {
  const response = await request(app)
    .get(`/score/${rut}`)
    .auth(token, { type: 'bearer' });
  return {
    status: response.status,
    body: response.body as Record<string, unknown>,
  };
}

describe('GET /score/:rut', () => {
  it('returns rut, score and fecha, regardless of RUT notation', async () => {
    const token = await loginAs('admin', 'admin123');
    const dotted = await getScore('12.345.678-5', token);
    const plain = await getScore('123456785', token);

    expect(dotted.status).toBe(200);
    expect(dotted.body.rut).toBe('12.345.678-5');
    expect(typeof dotted.body.score).toBe('number');
    expect(dotted.body.fecha).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(plain.body).toMatchObject({
      rut: dotted.body.rut,
      score: dotted.body.score,
    });
  });

  it('responds 400 for an invalid RUT', async () => {
    const token = await loginAs('admin', 'admin123');

    expect((await getScore('12.345.678-9', token)).status).toBe(400);
  });

  it('lets a user query their own RUT in any notation', async () => {
    const token = await loginAs('user', 'user123');

    expect((await getScore('123456785', token)).status).toBe(200);
  });

  it('responds 403 when a user queries another RUT', async () => {
    const token = await loginAs('user', 'user123');
    const response = await getScore('10.000.013-K', token);

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({ error: { code: 'FORBIDDEN' } });
  });

  it('responds 401 without a token', async () => {
    const response = await request(app).get('/score/12.345.678-5');

    expect(response.status).toBe(401);
  });
});
