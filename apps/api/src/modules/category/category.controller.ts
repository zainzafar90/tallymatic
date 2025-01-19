import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@repo/shared';

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

  const storeId = req.store.id;
  const category = await categoryService.createCategory(req.body, req.user.organizationId, storeId);
  res.status(httpStatus.CREATED).send(category);
});

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'categories');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list categories');
  }

  const storeId = req.store.id;
  const filter = pick(req.query, ['name', 'status']);
  const options: IOptions = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'offset', 'projectBy']);
  const result = await categoryService.queryCategories(filter, options, req.user.organizationId, storeId);
  res.send(result);
});

export const getCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const storeId = req.store.id;
    const category = await categoryService.getCategoryById(req.params['categoryId'], req.user.organizationId, storeId);
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
    const storeId = req.store.id;
    const category = await categoryService.updateCategoryById(
      req.params['categoryId'],
      req.body,
      req.user.organizationId,
      storeId
    );
    res.send(category);
  }
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'categories');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete category');
    }
    const storeId = req.store.id;
    await categoryService.deleteCategoryById(req.params['categoryId'], req.user.organizationId, storeId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const bulkDeleteCategories = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'categories');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete categories');
  }

  const categoryIds = req.body.categoryIds;
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid input: categoryIds must be a non-empty array');
  }

  const storeId = req.store.id;
  await categoryService.bulkDeleteCategories(categoryIds, req.user.organizationId, storeId);
  res.status(httpStatus.NO_CONTENT).send();
});
