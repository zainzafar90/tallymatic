import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import { IUser } from '@shared';

import { ApiError } from '@/common/errors/ApiError';

const verifyCallback =
  (req: Request, resolve: () => void, reject: (error: Error) => void) => async (err: Error, user: IUser, info: string) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.user = user;

    resolve();
  };

const authMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise<void>((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default authMiddleware;
