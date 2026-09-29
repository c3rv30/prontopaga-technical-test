import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../../domain/errors.js';
import type { Role, User } from './user.repository.js';

export interface TokenPayload {
  sub: string;
  role: Role;
  rut?: string;
}

const payloadSchema = z.object({
  sub: z.string(),
  role: z.enum(['admin', 'user']),
  rut: z.string().optional(),
});

const ALGORITHM = 'HS256';
const TOKEN_TTL = '1h';

export class TokenService {
  constructor(private readonly secret: string) {}

  sign(user: User): string {
    const claims =
      user.role === 'user'
        ? { role: user.role, rut: user.rut }
        : { role: user.role };
    return jwt.sign(claims, this.secret, {
      algorithm: ALGORITHM,
      expiresIn: TOKEN_TTL,
      subject: user.id,
    });
  }

  /** Verifies signature, expiration and payload shape; throws UNAUTHORIZED otherwise. */
  verify(token: string): TokenPayload {
    let decoded: unknown;
    try {
      decoded = jwt.verify(token, this.secret, { algorithms: [ALGORITHM] });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('UNAUTHORIZED', 'Token expired');
      }
      throw new AppError('UNAUTHORIZED', 'Invalid token');
    }

    const payload = payloadSchema.safeParse(decoded);
    if (!payload.success) {
      throw new AppError('UNAUTHORIZED', 'Invalid token');
    }
    return payload.data;
  }
}
