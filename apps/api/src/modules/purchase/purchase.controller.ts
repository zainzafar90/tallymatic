import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@repo/shared';

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

  const storeId = req.store.id;
  const purchase = await purchaseService.createPurchase(req.body, req.user.organizationId, storeId);
  res.status(httpStatus.CREATED).send(purchase);
});

export const getPurchases = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'purchases');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list purchases');
  }

  const storeId = req.store.id;
  const filter = pick(req.query, ['status', 'supplierId', 'purchaseNumber']);
  const options: IOptions = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'offset', 'projectBy']);
  const result = await purchaseService.queryPurchases(filter, options, req.user.organizationId, storeId);
  res.send(result);
});

export const getPurchase = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'read', 'purchases');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to read purchases');
    }

    const storeId = req.store.id;
    const purchase = await purchaseService.getPurchaseById(req.params['purchaseId'], req.user.organizationId, storeId);
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
    const storeId = req.store.id;
    const purchase = await purchaseService.updatePurchaseById(
      req.params['purchaseId'],
      req.body,
      req.user.organizationId,
      storeId
    );
    res.send(purchase);
  }
});

export const deletePurchase = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['purchaseId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'purchases');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete purchase');
    }
    const storeId = req.store.id;
    await purchaseService.deletePurchaseById(req.params['purchaseId'], req.user.organizationId, storeId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const bulkDeletePurchases = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'purchases');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete purchases');
  }

  const purchaseIds = req.body.purchaseIds;
  if (!Array.isArray(purchaseIds) || purchaseIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid input: purchaseIds must be a non-empty array');
  }

  const storeId = req.store.id;
  await purchaseService.bulkDeletePurchases(purchaseIds, req.user.organizationId, storeId);
  res.status(httpStatus.NO_CONTENT).send();
});
