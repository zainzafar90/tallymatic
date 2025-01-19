import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@repo/shared';

import { catchAsync } from '@/utils/catch-async';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import * as customerService from './customer.service';

export const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'customers');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create customers');
  }

  const storeId = req.store.id;
  const customer = await customerService.createCustomer(req.body, req.user.organizationId, storeId);
  res.status(httpStatus.CREATED).send(customer);
});

export const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'customers');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list customers');
  }

  const storeId = req.store.id;
  const filter = pick(req.query, ['name', 'email']);
  const options: IOptions = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'offset', 'projectBy']);
  const wildcardFields = ['name'];
  const result = await customerService.queryCustomers(filter, options, req.user.organizationId, storeId, wildcardFields);
  res.send(result);
});

export const getCustomer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['customerId'] === 'string') {
    const storeId = req.store.id;
    const customer = await customerService.getCustomerById(req.params['customerId'], req.user.organizationId, storeId);
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
    }
    res.send(customer);
  }
});

export const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['customerId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'customers');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update customer');
    }
    const storeId = req.store.id;
    const customer = await customerService.updateCustomerById(
      req.params['customerId'],
      req.body,
      req.user.organizationId,
      storeId
    );
    res.send(customer);
  }
});

export const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['customerId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'customers');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete customer');
    }
    const storeId = req.store.id;
    await customerService.deleteCustomerById(req.params['customerId'], req.user.organizationId, storeId);
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const bulkDeleteCustomers = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'customers');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete customers');
  }

  const customerIds = req.body.customerIds;
  if (!Array.isArray(customerIds) || customerIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid input: customerIds must be a non-empty array');
  }

  const storeId = req.store.id;
  await customerService.bulkDeleteCustomers(customerIds, req.user.organizationId, storeId);
  res.status(httpStatus.NO_CONTENT).send();
});
