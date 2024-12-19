import { IUser } from '@repo/shared';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUser;
  }
}
