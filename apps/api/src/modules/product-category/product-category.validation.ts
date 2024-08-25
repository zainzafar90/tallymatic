import Joi from 'joi';
import { CreateProductCategoryReq } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const createProductCategoryBody: Record<keyof CreateProductCategoryReq, any> = {
  productId: Joi.string().custom(uuid).required(),
  categoryId: Joi.string().custom(uuid).required(),
};

export const createProductCategory = {
  body: Joi.object().keys(createProductCategoryBody),
};

export const getProductCategories = {
  query: Joi.object().keys({
    productId: Joi.string().custom(uuid),
    categoryId: Joi.string().custom(uuid),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getProductCategory = {
  params: Joi.object().keys({
    productCategoryId: Joi.string().custom(uuid),
  }),
};

export const deleteProductCategory = {
  params: Joi.object().keys({
    productCategoryId: Joi.string().custom(uuid),
  }),
};
