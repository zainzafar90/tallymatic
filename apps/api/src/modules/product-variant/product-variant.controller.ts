import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync } from '@/utils/catchAsync';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/ApiError';

import { IOptions } from '../paginate/paginate.types';
import { permissionService } from '../permissions/permission.service';
import * as productVariantService from './product-variant.service';

export const createProductVariant = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'product-variants');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create product variants');
  }
  const variant = await productVariantService.createProductVariant(req.body);
  res.status(httpStatus.CREATED).send(variant);
});

export const getProductVariants = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['productId', 'name', 'sku', 'status']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'product-variants');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list product variants');
  }
  const result = await productVariantService.queryProductVariants(filter, options);
  res.send(result);
});

export const getProductVariant = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['variantId'] === 'string') {
    const variant = await productVariantService.getProductVariantById(req.params['variantId']);
    if (!variant) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
    }
    res.send(variant);
  }
});

export const updateProductVariant = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['variantId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'product-variants');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update product variant');
    }
    const variant = await productVariantService.updateProductVariantById(req.params['variantId'], req.body);
    res.send(variant);
  }
});

export const deleteProductVariant = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['variantId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'product-variants');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete product variant');
    }
    await productVariantService.deleteProductVariantById(req.params['variantId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
