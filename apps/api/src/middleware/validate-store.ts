import { and, eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { stores } from '@/db/schema';

export const validateStore = async (req: Request, res: Response, next: NextFunction) => {
  const storeId = req.headers['x-store-id'] || req.body.storeId || req.query.storeId;

  if (!storeId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Store ID is required');
  }

  const store = await db.query.stores.findFirst({
    where: and(eq(stores.id, storeId as string), eq(stores.organizationId, req.user.organizationId)),
  });

  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found or access denied');
  }

  req.store = store;
  next();
};
