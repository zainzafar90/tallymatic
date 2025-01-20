import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync } from '@/utils/catch-async';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import * as analyticsService from './analytics.service';

export const getSalesTrend = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'view', 'analytics');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view analytics');
  }

  const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
  const storeId = req.store.id;

  const salesTrend = await analyticsService.getSalesTrend(req.user.organizationId, storeId, days);
  res.status(httpStatus.OK).send(salesTrend);
});

export const getTopSellingProducts = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'view', 'analytics');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view analytics');
  }

  const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const storeId = req.store.id;

  const topProducts = await analyticsService.getTopSellingProducts(req.user.organizationId, storeId, limit, days);
  res.status(httpStatus.OK).send(topProducts);
});

export const getLowStockAlerts = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'view', 'analytics');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view analytics');
  }

  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const storeId = req.store.id;

  const alerts = await analyticsService.getLowStockAlerts(req.user.organizationId, storeId, limit);
  res.status(httpStatus.OK).send(alerts);
});
