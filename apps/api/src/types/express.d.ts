import * as express from 'express';
import { IStore, IUser } from '@repo/shared';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      store: IStore;
    }
  }
}
