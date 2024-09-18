import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync } from '@/utils/catch-async';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import { TransactionType } from './inventory.model';
import * as inventoryService from './inventory.service';

export const adjustStock = catchAsync(async (req: Request, res: Response) => {
  console.log('adjustStock', req.user);
  const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'inventory');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to adjust stock');
  }
  const { variantId, quantity, type, notes } = req.body;
  const transaction = await inventoryService.adjustStock(variantId, quantity, type as TransactionType, notes);
  res.status(httpStatus.OK).send(transaction);
});

export const getInventoryLevels = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'view', 'inventory');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view inventory levels');
  }
  const { productId } = req.params;
  const levels = await inventoryService.getInventoryLevels(productId);
  res.status(httpStatus.OK).send(levels);
});

export const getLowStockAlerts = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'view', 'inventory');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view low stock alerts');
  }
  const alerts = await inventoryService.checkLowStockAlerts();
  res.status(httpStatus.OK).send(alerts);
});
