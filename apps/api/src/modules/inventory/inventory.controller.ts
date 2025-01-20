import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions, TransactionType } from '@repo/shared';

import { catchAsync } from '@/utils/catch-async';
import { ApiError } from '@/common/errors/api-error';
import { pick } from '@/utils';

import { permissionService } from '../permissions/permission.service';
import * as inventoryService from './inventory.service';

export const adjustStock = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'inventory');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to adjust stock');
  }

  const { variantId, quantity, type, notes } = req.body;
  const transaction = await inventoryService.adjustStock(
    variantId,
    quantity,
    type as TransactionType,
    req.user.organizationId,
    req.store.id,
    notes
  );
  res.status(httpStatus.OK).send(transaction);
});

export const getAllInventoryLevels = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'view', 'inventory');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view inventory levels');
  }

  const filter = pick(req.query, ['name']);
  const options: IOptions = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'offset', 'projectBy']);
  const wildcardFields = ['name'];

  const levels = await inventoryService.getAllInventoryLevels(filter, options, req.user.organizationId, wildcardFields);
  res.status(httpStatus.OK).send(levels);
});
