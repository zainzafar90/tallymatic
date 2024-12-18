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
  const organizationId = req.user.organizationId;
  const category = await categoryService.createCategory(req.body, organizationId);
  res.status(httpStatus.CREATED).send(category);
});

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'categories');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list categories');
  }

  const filter = pick(req.query, ['name', 'status']);
  const options: IOptions = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'offset', 'projectBy', 'includeDeleted']);
  const organizationId = req.user.organizationId;

  const result = await categoryService.queryCategories(filter, options, organizationId);
  res.send(result);
});

export const getCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const includeDeleted = req.query.includeDeleted === 'true';
    const organizationId = req.user.organizationId;
    const category = await categoryService.getCategoryById(req.params['categoryId'], includeDeleted, organizationId);
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
    const organizationId = req.user.organizationId;
    const category = await categoryService.updateCategoryById(req.params['categoryId'], req.body, organizationId);
    res.send(category);
  }
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'categories');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete category');
    }
    const organizationId = req.user.organizationId;
    await categoryService.deleteCategoryById(req.params['categoryId'], organizationId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const bulkDeteteCategories = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'categories');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete categories');
  }

  const categoryIds = req.body.categoryIds;

  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    return res.status(400).json({ message: 'Invalid input: categoryIds must be a non-empty array' });
  }
  const organizationId = req.user.organizationId;
  await categoryService.bulkDeleteCategories(categoryIds, organizationId);
  res.status(httpStatus.OK).send({});
});
