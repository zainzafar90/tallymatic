import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import { IUser } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { logger } from '@/common/logger';

const verifyCallback =
  (req: Request, resolve: () => void, reject: (error: Error) => void) => async (err: Error, user: IUser, info: string) => {
    logger.debug('Auth middleware - Request details', {
      headers: req.headers,
      path: req.path,
      method: req.method,
    });

    logger.debug(
      'Auth middleware - Verification attempt',
      JSON.stringify({
        userId: user?.id,
        hasError: !!err,
        errorMessage: err?.message,
        info,
        token: req.headers.authorization,
      })
    );

    if (err || info || !user) {
      logger.error('Auth middleware - Authentication failed', {
        error: err?.message,
        info,
        path: req.path,
        headers: {
          authorization: req.headers.authorization ? 'present' : 'missing',
        },
      });
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.user = user;
    logger.info('Auth middleware - Authentication successful', {
      userId: user.id,
      path: req.path,
    });

    resolve();
  };

const authMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise<void>((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => {
      logger.error('Auth middleware - Error', {
        error: err.message,
        stack: err.stack,
        path: req.path,
      });
      next(err);
    });
};

export default authMiddleware;
