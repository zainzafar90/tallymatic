import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@shared';

import { catchAsync } from '@/utils/catch-async';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import * as productCategoryService from './product-category.service';

export const createProductCategory = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'product-categories');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create product category associations');
  }
  const productCategory = await productCategoryService.createProductCategory(req.body);
  res.status(httpStatus.CREATED).send(productCategory);
});

export const getProductCategories = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['productId', 'categoryId']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'product-categories');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list product category associations');
  }
  const result = await productCategoryService.queryProductCategories(filter, options);
  res.send(result);
});

export const getProductCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productCategoryId'] === 'string') {
    const productCategory = await productCategoryService.getProductCategoryById(req.params['productCategoryId']);
    if (!productCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product category association not found');
    }
    res.send(productCategory);
  }
});

export const deleteProductCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productCategoryId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'product-categories');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete product category associations');
    }
    await productCategoryService.deleteProductCategoryById(req.params['productCategoryId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
