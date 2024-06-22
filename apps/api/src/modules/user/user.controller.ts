import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { ApiError } from '@/common/errors/ApiError';

import { IOptions } from '../paginate/paginate';
import { permissionService } from '../permissions/permission.service';
import { catchAsync } from '../utils/catchAsync';
import { pick } from '../utils/pick';
import * as userService from './user.service';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'users');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create users');
  }

  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'roles']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'users');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list users');
  }

  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user['id']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getUserById(req.params['userId']);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  }
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.updateUserById(req.params['userId'], req.body);
    res.send(user);
  }
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await userService.deleteUserById(req.params['userId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
