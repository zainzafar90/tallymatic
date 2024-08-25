import Joi from 'joi';
import { CreateCategoryReq, Status } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const createCategoryBody: Record<keyof CreateCategoryReq, any> = {
  name: Joi.string().required(),
  description: Joi.string().optional(),
  parentCategoryId: Joi.string().custom(uuid).optional().allow(null),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).required(),
};

export const createCategory = {
  body: Joi.object().keys(createCategoryBody),
};

export const getCategories = {
  query: Joi.object().keys({
    name: Joi.string(),
    parentCategoryId: Joi.string().custom(uuid),
    status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(uuid),
  }),
};

export const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      parentCategoryId: Joi.string().custom(uuid).allow(null),
      status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    })
    .min(1),
};

export const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(uuid),
  }),
};
