import type { RequestHandler } from 'express';
import { AppError } from '../domain/errors.js';
import { parseRut } from '../domain/rut.js';

/**
 * Admins may query any RUT; users only the RUT in their token. Must run
 * after `authenticate`. Invalid RUTs pass through so the route answers 400.
 */
export const authorizeRutAccess: RequestHandler<{ rut: string }> = (
  req,
  _res,
  next,
) => {
  if (!req.user) {
    throw new AppError('UNAUTHORIZED', 'Authentication required');
  }
  if (req.user.role === 'admin') {
    next();
    return;
  }

  const requestedRut = parseRut(req.params.rut);
  if (requestedRut && requestedRut !== req.user.rut) {
    throw new AppError('FORBIDDEN', 'You can only query your own RUT');
  }
  next();
};
