import jwt from 'jsonwebtoken';
import type { Role, User } from './user.repository.js';

export interface TokenPayload {
  sub: string;
  role: Role;
  rut?: string;
}

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
}
