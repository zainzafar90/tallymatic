import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@shared';

import { catchAsync } from '@/utils/catchAsync';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/ApiError';

import { permissionService } from '../permissions/permission.service';
import * as productOptionService from './product-option.service';

export const createProductOption = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'product-options');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create product options');
  }
  const option = await productOptionService.createProductOption(productId, req.body);
  res.status(httpStatus.CREATED).send(option);
});

export const getProductOptions = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const filter = pick(req.query, ['name', 'status']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'product-options');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list product options');
  }
  const result = await productOptionService.queryProductOptions(productId, filter, options);
  res.send(result);
});

export const getProductOption = catchAsync(async (req: Request, res: Response) => {
  const { productId, optionId } = req.params;
  const option = await productOptionService.getProductOptionById(productId, optionId);
  if (!option) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product option not found');
  }
  res.send(option);
});

export const updateProductOption = catchAsync(async (req: Request, res: Response) => {
  const { productId, optionId } = req.params;
  const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'product-options');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update product option');
  }
  const option = await productOptionService.updateProductOptionById(productId, optionId, req.body);
  res.send(option);
});

export const deleteProductOption = catchAsync(async (req: Request, res: Response) => {
  const { productId, optionId } = req.params;
  const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'product-options');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete product option');
  }
  await productOptionService.deleteProductOptionById(productId, optionId);
  res.status(httpStatus.NO_CONTENT).send();
});
