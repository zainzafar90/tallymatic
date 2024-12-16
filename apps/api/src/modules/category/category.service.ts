import { and, eq, inArray, sql } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreateCategoryReq, ICategory, IOptions, ListResponse, UpdateCategoryReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { categories, Category } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

export const createCategory = async (categoryBody: CreateCategoryReq, organizationId: string): Promise<ICategory> => {
  const [category] = await db
    .insert(categories)
    .values({
      name: categoryBody.name,
      organizationId,
    })
    .returning();

  return category;
};

export const queryCategories = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string
): Promise<ListResponse<Category>> => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(categories.organizationId, organizationId)];
  if (filter.name) {
    conditions.push(eq(categories.name, filter.name));
  }

  const whereClause = and(...conditions);

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(categories)
    .where(whereClause);

  const results = await db
    .select()
    .from(categories)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(categories.createdAt);

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(countResult.count / limit),
    count: countResult.count,
  };
};

export const getCategoryById = async (
  id: string,
  includeDeleted = false,
  organizationId: string
): Promise<ICategory | null> => {
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.organizationId, organizationId)))
    .limit(1);

  return category;
};

export const updateCategoryById = async (
  categoryId: string,
  updateBody: UpdateCategoryReq,
  organizationId: string
): Promise<ICategory | null> => {
  return await db.transaction(async (tx) => {
    const category = await getCategoryById(categoryId, false, organizationId);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }

    const updatedBody = {
      ...updateBody,
      updatedAt: new Date(),
    };

    const [updatedCategory] = await tx
      .update(categories)
      .set(updatedBody)
      .where(and(eq(categories.id, categoryId), eq(categories.organizationId, organizationId)))
      .returning();

    return updatedCategory;
  });
};

export const deleteCategoryById = async (categoryId: string, organizationId: string): Promise<ICategory | null> => {
  const category = await getCategoryById(categoryId, false, organizationId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  await db.delete(categories).where(and(eq(categories.id, categoryId), eq(categories.organizationId, organizationId)));
  return category;
};

export const bulkDeleteCategories = async (categoryIds: string[], organizationId: string): Promise<ICategory[]> => {
  await db.transaction(async (tx) => {
    const existingCategories = await tx
      .select()
      .from(categories)
      .where(and(inArray(categories.id, categoryIds), eq(categories.organizationId, organizationId)));

    if (existingCategories.length !== categoryIds.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'One or more categories not found');
    }

    await tx
      .delete(categories)
      .where(and(inArray(categories.id, categoryIds), eq(categories.organizationId, organizationId)));
    return existingCategories;
  });

  return [];
};
