import Joi from 'joi';
import { CreateOrganizationReq, Status } from '@shared';

import { uuid } from '@/common/validate/custom.validation';

const createOrganizationBody: Record<keyof CreateOrganizationReq, any> = {
  name: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE).required(),
};

export const createOrganization = {
  body: Joi.object().keys(createOrganizationBody),
};

export const getOrganizations = {
  query: Joi.object().keys({
    name: Joi.string(),
    status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
  }),
};

export const getOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(uuid),
  }),
};

export const updateOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.required().custom(uuid),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      status: Joi.string().valid(Status.ACTIVE, Status.INACTIVE),
    })
    .min(1),
};

export const deleteOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(uuid),
  }),
};
