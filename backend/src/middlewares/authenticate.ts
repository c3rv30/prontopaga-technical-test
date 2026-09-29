import type { RequestHandler } from 'express';
import { AppError } from '../domain/errors.js';
import type { TokenService } from '../modules/auth/token.service.js';

export function createAuthenticate(tokens: TokenService): RequestHandler {
  return (req, _res, next) => {
    const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) {
      throw new AppError('UNAUTHORIZED', 'Missing bearer token');
    }

    req.user = tokens.verify(token);
    next();
  };
}
