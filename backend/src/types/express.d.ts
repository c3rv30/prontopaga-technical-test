import type { TokenPayload } from '../modules/auth/token.service.js';

declare global {
  namespace Express {
    interface Request {
      /** Set by the authenticate middleware from a verified JWT. */
      user?: TokenPayload;
    }
  }
}

export {};
