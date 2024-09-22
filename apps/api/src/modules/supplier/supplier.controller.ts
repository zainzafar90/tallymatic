import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@shared';

import { catchAsync } from '@/utils/catch-async';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import * as supplierService from './supplier.service';

export const createSupplier = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'suppliers');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create suppliers');
  }
  const supplier = await supplierService.createSupplier(req.body);
  res.status(httpStatus.CREATED).send(supplier);
});

export const getSuppliers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['companyName', 'contactName', 'email']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'suppliers');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list suppliers');
  }
  const result = await supplierService.querySuppliers(filter, options);
  res.send(result);
});

export const getSupplier = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['supplierId'] === 'string') {
    const supplier = await supplierService.getSupplierById(req.params['supplierId']);
    if (!supplier) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
    }
    res.send(supplier);
  }
});

export const updateSupplier = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['supplierId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'suppliers');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update supplier');
    }
    const supplier = await supplierService.updateSupplierById(req.params['supplierId'], req.body);
    res.send(supplier);
  }
});

export const deleteSupplier = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['supplierId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'suppliers');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete supplier');
    }
    await supplierService.deleteSupplierById(req.params['supplierId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
