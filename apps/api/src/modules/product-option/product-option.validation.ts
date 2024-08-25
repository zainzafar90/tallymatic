import Joi from 'joi';

import { uuid } from '@/common/validate/custom.validation';

import { NewCreatedProductOption } from './product-option.interfaces';
import { ProductOptionStatus } from './product-option.model';

const createProductOptionBody: Record<keyof NewCreatedProductOption, any> = {
  productId: Joi.string().custom(uuid).required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  priceModifier: Joi.number().required(),
  status: Joi.string()
    .valid(...Object.values(ProductOptionStatus))
    .required(),
};

export const createProductOption = {
  body: Joi.object().keys(createProductOptionBody),
};

export const getProductOptions = {
  query: Joi.object().keys({
    productId: Joi.string().custom(uuid),
    name: Joi.string(),
    status: Joi.string().valid(...Object.values(ProductOptionStatus)),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getProductOption = {
  params: Joi.object().keys({
    optionId: Joi.string().custom(uuid),
  }),
};

export const updateProductOption = {
  params: Joi.object().keys({
    optionId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      priceModifier: Joi.number(),
      status: Joi.string().valid(...Object.values(ProductOptionStatus)),
    })
    .min(1),
};

export const deleteProductOption = {
  params: Joi.object().keys({
    optionId: Joi.string().custom(uuid),
  }),
};
