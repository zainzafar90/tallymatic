import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@shared';

import { catchAsync } from '@/utils/catch-async';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import * as organizationService from './organization.service';

export const createOrganization = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'organizations');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create organizations');
  }

  const organization = await organizationService.createOrganization(req.body);
  res.status(httpStatus.CREATED).send(organization);
});

export const getOrganizations = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'status']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'organizations');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list organizations');
  }

  const result = await organizationService.queryOrganizations(filter, options);
  res.send(result);
});

export const getOrganization = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['organizationId'] === 'string') {
    const organization = await organizationService.getOrganizationById(req.params['organizationId']);
    if (!organization) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
    }
    res.send(organization);
  }
});

export const updateOrganization = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['organizationId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'organizations');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update organization');
    }

    const organization = await organizationService.updateOrganizationById(req.params['organizationId'], req.body);
    res.send(organization);
  }
});

/** TODO: THIS OPERATION SHOULDN"T BE PERMISSIBLE TO ANYONE admin or otherwise if it deletes then it should be soft delete */
export const deleteOrganization = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['organizationId'] === 'string') {
    const isAllowed = permissionService.checkPermissions(req.user.role, 'delete', 'organizations');
    if (!isAllowed) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete organization');
    }

    await organizationService.deleteOrganizationById(req.params['organizationId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
