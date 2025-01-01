import Joi from 'joi';
import { CreateCustomerPayload, Status, UpdateCustomerPayload } from '@repo/shared';

import { uuid } from '@/common/validate/custom.validation';

const createCustomerBody: Record<keyof CreateCustomerPayload, any> = {
  name: Joi.string().required(),
  email: Joi.string().email().allow('', null).optional(),
  phone: Joi.string().allow('', null).optional(),
  address: Joi.string().allow('', null).optional(),
};

export const createCustomer = {
  body: Joi.object().keys(createCustomerBody),
};

export const getCustomers = {
  query: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    sortBy: Joi.string(),
    sortOrder: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(uuid),
  }),
};

const updateCustomerBody: Record<keyof UpdateCustomerPayload, any> = {
  name: Joi.string(),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).optional(),
};

export const updateCustomer = {
  params: Joi.object().keys({
    customerId: Joi.required().custom(uuid),
  }),
  body: Joi.object().keys(updateCustomerBody),
};

export const deleteCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(uuid),
  }),
};

export const bulkDeleteCustomers = {
  body: Joi.object().keys({
    customerIds: Joi.array().items(Joi.string().custom(uuid)).min(1).required(),
  }),
};
