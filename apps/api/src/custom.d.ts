import { IStore, IUser } from '@repo/shared';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUser;
    store: IStore;
  }
}
