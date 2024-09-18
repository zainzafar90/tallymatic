import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync } from '@/utils/catch-async';
import { ApiError } from '@/common/errors/api-error';

import { claimService } from '.';
import { permissionService } from '../permissions/permission.service';

export const createClaim = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'create', 'claims');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to create claims');
  }
  const { claim, items } = req.body;
  const newClaim = await claimService.createClaim(claim, items);
  res.status(httpStatus.CREATED).send(newClaim);
});

export const updateClaimStatus = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'claims');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update claim status');
  }
  const { claimId } = req.params;
  const { status } = req.body;
  const updatedClaim = await claimService.updateClaimStatus(claimId, status);
  res.status(httpStatus.OK).send(updatedClaim);
});

export const assignClaim = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'claims');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to assign claims');
  }
  const { claimId } = req.params;
  const { userId } = req.body;
  const updatedClaim = await claimService.assignClaim(claimId, userId);
  res.status(httpStatus.OK).send(updatedClaim);
});

export const resolveClaim = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'update', 'claims');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to resolve claims');
  }
  const { claimId } = req.params;
  const { resolution } = req.body;
  const resolvedClaim = await claimService.resolveClaim(claimId, resolution);
  res.status(httpStatus.OK).send(resolvedClaim);
});

export const getClaimsByVariant = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'view', 'claims');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view claims');
  }
  const { variantId } = req.params;
  const claims = await claimService.getClaimsByVariant(variantId);
  res.status(httpStatus.OK).send(claims);
});

export const getClaimsByDateRange = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'view', 'claims');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to view claims');
  }
  const { startDate, endDate } = req.query;
  const claims = await claimService.getClaimsByDateRange(new Date(startDate as string), new Date(endDate as string));
  res.status(httpStatus.OK).send(claims);
});
