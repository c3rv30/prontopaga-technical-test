import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { loadConfig } from './config.js';

const app = createApp(loadConfig({ NODE_ENV: 'test' }));

describe('GET /health', () => {
  it('responds 200 with status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('CORS', () => {
  it('allows only the configured SPA origin', async () => {
    const allowed = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:5173');
    const other = await request(app)
      .get('/health')
      .set('Origin', 'https://evil.example');

    expect(allowed.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173',
    );
    expect(other.headers['access-control-allow-origin']).not.toBe(
      'https://evil.example',
    );
  });
});
