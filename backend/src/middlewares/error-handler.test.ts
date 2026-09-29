import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

describe('error handling', () => {
  it('responds 404 with the error shape for unknown routes', async () => {
    const response = await request(createApp()).get('/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { code: 'NOT_FOUND', message: 'Route GET /unknown not found' },
    });
  });

  it('responds 400 for a malformed JSON body', async () => {
    const response = await request(createApp())
      .post('/health')
      .set('Content-Type', 'application/json')
      .send('{bad json');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: { code: 'VALIDATION_ERROR' },
    });
  });
});
