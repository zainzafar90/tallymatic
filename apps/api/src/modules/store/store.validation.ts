import Joi from 'joi';
import { CreateStoreReq, Status } from '@repo/shared';

import { uuid } from '@/common/validate/custom.validation';

const createStoreBody: Record<keyof CreateStoreReq, any> = {
  name: Joi.string().required(),
  address: Joi.string().optional(),
  organizationId: Joi.string().custom(uuid),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).required(),
};

export const createStore = {
  body: Joi.object().keys(createStoreBody),
};

export const getStores = {
  query: Joi.object().keys({
    name: Joi.string(),
    location: Joi.string(),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getStore = {
  params: Joi.object().keys({
    storeId: Joi.string().custom(uuid),
  }),
};

export const updateStore = {
  params: Joi.object().keys({
    storeId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      location: Joi.string(),
    })
    .min(1),
};

export const deleteStore = {
  params: Joi.object().keys({
    storeId: Joi.string().custom(uuid),
  }),
};
