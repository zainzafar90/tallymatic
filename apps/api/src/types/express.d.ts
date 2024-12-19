import * as express from 'express';
import { IUser } from '@repo/shared';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
