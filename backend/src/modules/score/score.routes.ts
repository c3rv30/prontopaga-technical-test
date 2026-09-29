import { Router, type Request, type RequestHandler } from 'express';
import { AppError } from '../../domain/errors.js';
import { parseRut } from '../../domain/rut.js';
import type { ScoreService } from './score.service.js';

export function createScoreRouter(
  scoreService: ScoreService,
  authenticate: RequestHandler,
): Router {
  const router = Router();

  router.get(
    '/score/:rut',
    authenticate,
    (req: Request<{ rut: string }>, res) => {
      const rut = parseRut(req.params.rut);
      if (!rut) {
        throw new AppError('VALIDATION_ERROR', 'Invalid RUT');
      }

      res.json(scoreService.getScore(rut));
    },
  );

  return router;
}
