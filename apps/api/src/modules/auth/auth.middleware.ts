import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';

import ApiError from '../errors/ApiError';
import { Role } from '../permissions/permission.interface';
import { permissionService } from '../permissions/permission.service';
import { IUserDoc } from '../user/user.interfaces';

const verifyCallback =
  (req: Request, resolve: () => void, reject: (error: Error) => void) =>
  async (err: Error, user: IUserDoc, info: string) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.user = user;

    const resourceKind = 'users';
    const action = 'list';

    if (!resourceKind || !action) {
      return resolve();
    }

    const hasPermission = permissionService.checkPermissions(user.role as Role, action, resourceKind);
    if (!hasPermission) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }

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
