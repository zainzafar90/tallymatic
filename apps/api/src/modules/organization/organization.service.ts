import { and, count, eq } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreateOrganizationReq, IOptions, ListResponse, UpdateOrganizationReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { organizations } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

export const createOrganization = async (organizationBody: CreateOrganizationReq) => {
  const [organization] = await db.insert(organizations).values(organizationBody).returning();
  return organization;
};

export const queryOrganizations = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<ListResponse<typeof organizations.$inferSelect>> => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [];
  if (filter.name) {
    conditions.push(eq(organizations.name, filter.name));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [organizationsCount] = await db.select({ count: count() }).from(organizations).where(whereClause);

  const results = await db.query.organizations.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: organizations.createdAt,
  });

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(organizationsCount.count / limit),
    count: organizationsCount.count,
  };
};

export const getOrganizationById = async (id: string) => {
  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.id, id),
  });
  return organization;
};

export const updateOrganizationById = async (organizationId: string, updateBody: UpdateOrganizationReq) => {
  const organization = await getOrganizationById(organizationId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }

  const [updatedOrganization] = await db
    .update(organizations)
    .set(updateBody)
    .where(eq(organizations.id, organizationId))
    .returning();

  return updatedOrganization;
};

export const deleteOrganizationById = async (organizationId: string) => {
  const organization = await getOrganizationById(organizationId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }

  const [deletedOrganization] = await db.delete(organizations).where(eq(organizations.id, organizationId)).returning();

  return deletedOrganization;
};
