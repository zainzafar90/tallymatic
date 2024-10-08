import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@shared';

import { catchAsync } from '@/utils/catch-async';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import * as productService from './product.service';

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'products');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create products');
  }

  const product = await productService.createProduct({ ...req.body, organizationId: req.user.organizationId });
  res.status(httpStatus.CREATED).send(product);
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'products');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list products');
  }

  const filter = pick({ ...req.query, organizationId: req.user.organizationId }, ['organizationId', 'name', 'status']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const wildcardFields = ['name'];
  const result = await productService.queryProducts(filter, options, wildcardFields);
  res.send(result);
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.getProductById(req.params['productId']);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send(product);
  }
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'products');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update product');
    }
    const product = await productService.updateProductById(req.params['productId'], req.body);
    res.send(product);
  }
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'products');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete product');
    }
    await productService.deleteProductById(req.params['productId']);
    res.status(httpStatus.OK).send({});
  }
});

export const bulkDeleteProducts = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'products');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete products');
  }

  const productIds = req.body.productIds;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: 'Invalid input: productIds must be a non-empty array' });
  }

  await productService.bulkDeleteProducts(productIds);
  res.status(httpStatus.OK).send({});
});
