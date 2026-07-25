import type { TokenPayload } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface User extends TokenPayload {
      id?: string;
    }
  }
}

export {};
