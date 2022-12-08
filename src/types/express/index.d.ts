import { User } from '../../repo/userRepo';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
