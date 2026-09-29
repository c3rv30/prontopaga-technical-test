import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, type ErrorCode } from '../domain/errors.js';

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

function isMalformedJson(err: unknown): boolean {
  return (
    err instanceof SyntaxError &&
    'type' in err &&
    err.type === 'entity.parse.failed'
  );
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError('NOT_FOUND', `Route ${req.method} ${req.path} not found`));
};

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  // Express recognizes error handlers by their four-argument signature.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next,
) => {
  if (err instanceof AppError) {
    res
      .status(STATUS_BY_CODE[err.code])
      .json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (isMalformedJson(err)) {
    res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Malformed JSON body' },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  });
};
