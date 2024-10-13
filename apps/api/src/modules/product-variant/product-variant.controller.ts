import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOptions } from '@shared';

import { catchAsync } from '@/utils/catch-async';
import { pick } from '@/utils/pick';
import { ApiError } from '@/common/errors/api-error';

import { permissionService } from '../permissions/permission.service';
import * as productVariantService from './product-variant.service';

export const getProductVariants = catchAsync(async (req: Request, res: Response) => {
  const isAllowed = permissionService.checkPermissions(req.user.role, 'list', 'variants');
  if (!isAllowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to list product variants');
  }

  const filter = pick(req.query, ['name', 'sku', 'status', 'productName']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'offset', 'projectBy']);
  const wildcardFields = ['name', 'productName', 'sku'];

  const result = await productVariantService.queryProductVariants(filter, options, wildcardFields);
  res.send(result);
});
