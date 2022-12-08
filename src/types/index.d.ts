import { User } from '../../repo/userRepo';

export {};

declare global {
  namespace e {
    export interface Request {
      user?: User;
    }
  }
}
