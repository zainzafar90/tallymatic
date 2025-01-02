import Joi from 'joi';
import { CreateSupplierReq, Status, UpdateSupplierReq } from '@repo/shared';

import { uuid } from '@/common/validate/custom.validation';

const createSupplierBody: Record<keyof CreateSupplierReq, any> = {
  companyName: Joi.string().required(),
  contactName: Joi.string().required(),
  email: Joi.string().required().allow('', null).email(),
  phone: Joi.string().optional().allow('', null),
  address: Joi.string().optional().allow('', null),
};

export const createSupplier = {
  body: Joi.object().keys(createSupplierBody),
};

export const getSuppliers = {
  query: Joi.object().keys({
    companyName: Joi.string(),
    contactName: Joi.string(),
    email: Joi.string(),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getSupplier = {
  params: Joi.object().keys({
    supplierId: Joi.string().custom(uuid),
  }),
};

const updateSupplierBody: Record<keyof UpdateSupplierReq, any> = {
  companyName: Joi.string(),
  contactName: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).optional(),
};

export const updateSupplier = {
  params: Joi.object().keys({
    supplierId: Joi.required().custom(uuid),
  }),
  body: Joi.object().keys(updateSupplierBody).min(1),
};

export const deleteSupplier = {
  params: Joi.object().keys({
    supplierId: Joi.string().custom(uuid),
  }),
};

export const bulkDeleteSuppliers = {
  body: Joi.object().keys({
    supplierIds: Joi.array().items(Joi.string().custom(uuid)).required(),
  }),
};
