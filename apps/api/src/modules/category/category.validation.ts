import Joi from 'joi';
import { CreateCategoryReq, Status, UpdateCategoryReq } from '@repo/shared';

import { uuid } from '@/common/validate/custom.validation';

const createCategoryBody: Record<keyof CreateCategoryReq, any> = {
  name: Joi.string().required(),
  description: Joi.string().optional(),
};

export const createCategory = {
  body: Joi.object().keys(createCategoryBody),
};

export const getCategories = {
  query: Joi.object().keys({
    name: Joi.string(),
    status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
    includeDeleted: Joi.boolean(),
  }),
};

export const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(uuid),
  }),
  query: Joi.object().keys({
    includeDeleted: Joi.boolean(),
  }),
};

const updateCategoryBody: Record<keyof UpdateCategoryReq, any> = {
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).optional(),
};

export const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(uuid),
  }),
  body: Joi.object().keys(updateCategoryBody).min(1),
};

export const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(uuid),
  }),
};

export const bulkDeleteCategories = {
  body: Joi.object().keys({
    categoryIds: Joi.array().items(Joi.string().custom(uuid)).min(1).required(),
  }),
};
