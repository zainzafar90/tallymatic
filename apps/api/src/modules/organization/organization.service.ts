import httpStatus from 'http-status';
import { IOptions, ListResponse } from '@shared';

import { ApiError } from '@/common/errors/ApiError';

import { paginate } from '../paginate/paginate';
import { IOrganization, NewCreatedOrganization, UpdateOrganizationBody } from './organization.interfaces';
import { Organization } from './organization.model';

/**
 * Create an organization
 * @param {NewCreatedOrganization} organizationBody
 * @returns {Promise<IOrganization>}
 */
export const createOrganization = async (organizationBody: NewCreatedOrganization): Promise<IOrganization> => {
  const organization = await Organization.create(organizationBody);
  return organization.toJSON();
};

/**
 * Query for organizations
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @returns {Promise<ListResult>}
 */
export const queryOrganizations = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<ListResponse<Organization>> => {
  const result = await paginate(Organization, filter, options);
  return result;
};

/**
 * Get organization by id
 * @param string id
 * @returns {Promise<IOrganization | null>}
 */
export const getOrganizationById = async (id: string): Promise<IOrganization | null> => {
  const organization = await Organization.findByPk(id);
  return organization ? organization.toJSON() : null;
};

/**
 * Update organization by id
 * @param {string}} organizationId
 * @param {UpdateOrganizationBody} updateBody
 * @returns {Promise<IOrganization | null>}
 */
export const updateOrganizationById = async (
  organizationId: string,
  updateBody: UpdateOrganizationBody
): Promise<IOrganization | null> => {
  const organization = await Organization.findByPk(organizationId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  Object.assign(organization, updateBody);
  await organization.save();
  return organization.toJSON();
};

/**
 * Delete organization by id
 * @param {string} organizationId
 * @returns {Promise<IOrganization | null>}
 */
export const deleteOrganizationById = async (organizationId: string): Promise<IOrganization | null> => {
  const organization = await Organization.findByPk(organizationId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  await organization.destroy();
  return organization.toJSON();
};
