import { and, count, eq, ilike } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreateSupplierReq, IOptions, ListResponse, Status, UpdateSupplierReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { suppliers } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

export const createSupplier = async (supplierBody: CreateSupplierReq, organizationId: string) => {
  const supplierNew = {
    ...supplierBody,
    organizationId,
    status: Status.ACTIVE,
  };
  const [supplier] = await db.insert(suppliers).values(supplierNew).returning();
  return supplier;
};

export const querySuppliers = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string,
  wildcardFields: string[] = []
): Promise<ListResponse<typeof suppliers.$inferSelect>> => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(suppliers.organizationId, organizationId)];
  if (filter.companyName && wildcardFields.includes('companyName')) {
    conditions.push(ilike(suppliers.companyName, `%${filter.companyName}%`));
  }
  if (filter.email) {
    conditions.push(eq(suppliers.email, filter.email));
  }

  const whereClause = and(...conditions);

  const [suppliersCount] = await db.select({ count: count() }).from(suppliers).where(whereClause);

  const results = await db.query.suppliers.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: suppliers.createdAt,
  });

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(suppliersCount.count / limit),
    count: suppliersCount.count,
  };
};

export const getSupplierById = async (id: string, organizationId: string) => {
  const supplier = await db.query.suppliers.findFirst({
    where: and(eq(suppliers.id, id), eq(suppliers.organizationId, organizationId)),
  });
  return supplier;
};

export const updateSupplierById = async (supplierId: string, updateBody: UpdateSupplierReq, organizationId: string) => {
  const supplier = await getSupplierById(supplierId, organizationId);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
  }

  const [updatedSupplier] = await db
    .update(suppliers)
    .set(updateBody)
    .where(and(eq(suppliers.id, supplierId), eq(suppliers.organizationId, organizationId)))
    .returning();

  return updatedSupplier;
};

export const deleteSupplierById = async (supplierId: string, organizationId: string) => {
  const supplier = await getSupplierById(supplierId, organizationId);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
  }

  const [deletedSupplier] = await db
    .delete(suppliers)
    .where(and(eq(suppliers.id, supplierId), eq(suppliers.organizationId, organizationId)))
    .returning();

  return deletedSupplier;
};

export const bulkDeleteSuppliers = async (supplierIds: string[], organizationId: string) => {
  return await db.transaction(async (tx) => {
    const existingSuppliers = await tx.query.suppliers.findMany({
      where: and(
        eq(suppliers.organizationId, organizationId),
        // @ts-expect-error: Type inference issue with array of strings
        suppliers.id.in(supplierIds)
      ),
    });

    if (existingSuppliers.length !== supplierIds.length) {
      throw new Error('One or more supplier IDs are invalid');
    }

    const deletedSuppliers = await tx
      .delete(suppliers)
      .where(
        and(
          eq(suppliers.organizationId, organizationId),
          // @ts-expect-error: Type inference issue with array of strings
          suppliers.id.in(supplierIds)
        )
      )
      .returning();

    return deletedSuppliers;
  });
};
