import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync } from '@/utils/catchAsync';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/ApiError';

import { IOptions } from '../paginate/paginate.types';
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
    const organization = await organizationService.updateOrganizationById(req.params['organizationId'], req.body);
    res.send(organization);
  }
});

export const deleteOrganization = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['organizationId'] === 'string') {
    await organizationService.deleteOrganizationById(req.params['organizationId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
