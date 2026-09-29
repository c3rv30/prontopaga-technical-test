import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../domain/errors.js';
import type { AuthService } from './auth.service.js';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export function createAuthRouter(authService: AuthService): Router {
  const router = Router();

  router.post('/login', async (req, res) => {
    const body = loginSchema.safeParse(req.body);
    if (!body.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        'username and password are required',
      );
    }

    const token = await authService.login(
      body.data.username,
      body.data.password,
    );
    res.json({ token });
  });

  return router;
}
