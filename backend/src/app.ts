import express, { type Express } from 'express';
import type { Config } from './config.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { createAuthRouter } from './modules/auth/auth.routes.js';
import { AuthService } from './modules/auth/auth.service.js';
import { TokenService } from './modules/auth/token.service.js';
import { InMemoryUserRepository } from './modules/auth/user.repository.js';

export function createApp(config: Config): Express {
  const tokenService = new TokenService(config.jwtSecret);
  const authService = new AuthService(
    new InMemoryUserRepository(),
    tokenService,
  );

  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use(createAuthRouter(authService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
