import Joi from 'joi';
import { CreateProductOptionReq, Status } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const createProductOptionBody: Record<keyof CreateProductOptionReq, any> = {
  name: Joi.string().required(),
  description: Joi.string().optional(),
  priceModifier: Joi.number().required(),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).required(),
};

export const createProductOption = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
  }),
  body: Joi.object().keys(createProductOptionBody),
};

export const getProductOptions = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getProductOption = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
    optionId: Joi.string().custom(uuid).required(),
  }),
};

export const updateProductOption = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
    optionId: Joi.string().custom(uuid).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      priceModifier: Joi.number(),
      status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    })
    .min(1),
};

export const deleteProductOption = {
  params: Joi.object().keys({
    productId: Joi.string().custom(uuid).required(),
    optionId: Joi.string().custom(uuid).required(),
  }),
};
