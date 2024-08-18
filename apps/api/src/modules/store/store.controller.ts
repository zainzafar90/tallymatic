import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync } from '@/utils/catchAsync';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/ApiError';

import { IOptions } from '../paginate/paginate.types';
import { permissionService } from '../permissions/permission.service';
import * as storeService from './store.service';

export const createStore = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'stores');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create stores');
  }

  const store = await storeService.createStore(req.body);
  res.status(httpStatus.CREATED).send(store);
});

export const getStores = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'location']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'stores');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list stores');
  }

  const result = await storeService.queryStores(filter, options);
  res.send(result);
});

export const getStore = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['storeId'] === 'string') {
    const store = await storeService.getStoreById(req.params['storeId']);
    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
    }
    res.send(store);
  }
});

export const updateStore = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['storeId'] === 'string') {
    const store = await storeService.updateStoreById(req.params['storeId'], req.body);
    res.send(store);
  }
});

export const deleteStore = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['storeId'] === 'string') {
    await storeService.deleteStoreById(req.params['storeId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
