import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@shared';

import { catchAsync } from '@/utils/catch-async';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import * as purchaseService from './purchase.service';

export const createPurchase = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'purchases');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create purchases');
  }

  const purchase = await purchaseService.createPurchase({
    ...req.body,
    organizationId: req.user.organizationId,
  });
  res.status(httpStatus.CREATED).send(purchase);
});

export const getPurchases = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['status', 'supplierId', 'organizationId']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const result = await purchaseService.queryPurchases(filter, options);
  res.send(result);
});

export const getPurchase = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string') {
    const purchase = await purchaseService.getPurchaseById(req.params['purchaseId']);
    if (!purchase) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
    }
    res.send(purchase);
  }
});

export const updatePurchase = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'purchases');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update purchase');
    }
    const purchase = await purchaseService.updatePurchaseById(req.params['purchaseId'], {
      ...req.body,
      organizationId: req.user.organizationId,
    });
    res.send(purchase);
  }
});

export const deletePurchase = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'purchases');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete purchase');
    }
    await purchaseService.deletePurchaseById(req.params['purchaseId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
