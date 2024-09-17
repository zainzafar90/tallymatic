import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@shared';

import { catchAsync } from '@/utils/catch-async';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import * as categoryService from './category.service';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'categories');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create categories');
  }
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'categories');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list categories');
  }

  const filter = pick(req.query, ['name', 'parentCategoryId', 'status']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const wildcardFields = ['name'];
  const result = await categoryService.queryCategories(filter, options, wildcardFields);
  res.send(result);
});

export const getCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const category = await categoryService.getCategoryById(req.params['categoryId']);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    res.send(category);
  }
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'categories');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update category');
    }
    const category = await categoryService.updateCategoryById(req.params['categoryId'], req.body);
    res.send(category);
  }
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'categories');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete category');
    }
    await categoryService.deleteCategoryById(req.params['categoryId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
