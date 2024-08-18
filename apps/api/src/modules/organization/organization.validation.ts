import Joi from 'joi';

import { uuid } from '@/common/validate/custom.validation';

import { NewCreatedOrganization } from './organization.interfaces';
import { OrganizationStatus } from './organization.model';

const createOrganizationBody: Record<keyof NewCreatedOrganization, any> = {
  name: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(OrganizationStatus))
    .required(),
};

export const createOrganization = {
  body: Joi.object().keys(createOrganizationBody),
};

export const getOrganizations = {
  query: Joi.object().keys({
    name: Joi.string(),
    status: Joi.string().valid(...Object.values(OrganizationStatus)),
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
      status: Joi.string().valid(...Object.values(OrganizationStatus)),
    })
    .min(1),
};

export const deleteOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(uuid),
  }),
};
