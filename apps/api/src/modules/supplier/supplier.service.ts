import { and, asc, count, desc, eq, ilike, inArray, isNull, ne } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreateSupplierReq, IOptions, UpdateSupplierReq } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { Supplier, suppliers } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof suppliers)['_']['columns'];

interface OrderParams {
  field: OrderField;
  direction: OrderDirection;
}

const supplierDTO = (supplier: Supplier) => {
  return {
    ...supplier,
    status: supplier.status,
  };
};

export const createSupplier = async (supplierBody: CreateSupplierReq, organizationId: string, storeId: string) => {
  const existingSupplier = await db.query.suppliers.findFirst({
    where: and(
      eq(suppliers.email, supplierBody.email),
      eq(suppliers.organizationId, organizationId),
      eq(suppliers.storeId, storeId)
    ),
  });

  if (existingSupplier) {
    throw new ApiError(httpStatus.CONFLICT, 'Supplier with this email already exists');
  }

  const [supplier] = await db
    .insert(suppliers)
    .values({
      ...supplierBody,
      organizationId,
      storeId,
    })
    .returning();

  return supplierDTO(supplier);
};

export const querySuppliers = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string,
  storeId: string,
  wildcardFields: string[] = []
) => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(suppliers.organizationId, organizationId), eq(suppliers.storeId, storeId)];
  if (filter.companyName && wildcardFields.includes('companyName')) {
    conditions.push(ilike(suppliers.companyName, `%${filter.companyName}%`));
  }
  if (filter.email) {
    conditions.push(eq(suppliers.email, filter.email));
  }

  const whereClause = and(...conditions);

  const orderParams: OrderParams = {
    field: (options.sortBy as OrderField) || 'createdAt',
    direction: (options.sortOrder as OrderDirection) || 'desc',
  };

  const orderFn = orderParams.direction === 'asc' ? asc : desc;
  const orderByClause = orderFn(suppliers[orderParams.field]);

  const [suppliersCount] = await db
    .select({ count: count(suppliers.id) })
    .from(suppliers)
    .where(whereClause);

  const results = await db.query.suppliers.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: orderByClause,
  });

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(suppliersCount.count / limit),
    count: suppliersCount.count,
  };
};

export const getSupplierById = async (id: string, organizationId: string, storeId: string) => {
  const supplier = await db.query.suppliers.findFirst({
    where: and(eq(suppliers.id, id), eq(suppliers.organizationId, organizationId), eq(suppliers.storeId, storeId)),
  });

  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
  }

  return supplierDTO(supplier);
};

export const updateSupplierById = async (
  supplierId: string,
  updateBody: UpdateSupplierReq,
  organizationId: string,
  storeId: string
) => {
  const existingSupplier = await db.query.suppliers.findFirst({
    where: and(
      eq(suppliers.email, updateBody.email),
      eq(suppliers.organizationId, organizationId),
      eq(suppliers.storeId, storeId),
      ne(suppliers.id, supplierId)
    ),
  });

  if (existingSupplier) {
    throw new ApiError(httpStatus.CONFLICT, 'Supplier with this email already exists');
  }

  const [supplier] = await db
    .update(suppliers)
    .set({
      ...updateBody,
    })
    .where(and(eq(suppliers.id, supplierId), eq(suppliers.organizationId, organizationId), eq(suppliers.storeId, storeId)))
    .returning();

  if (!supplier) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update supplier');
  }

  return supplierDTO(supplier);
};

export const deleteSupplierById = async (supplierId: string, organizationId: string, storeId: string) => {
  const [supplier] = await db
    .delete(suppliers)
    .where(and(eq(suppliers.id, supplierId), eq(suppliers.organizationId, organizationId), eq(suppliers.storeId, storeId)))
    .returning();

  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
  }

  return supplierDTO(supplier);
};

export const bulkDeleteSuppliers = async (supplierIds: string[], organizationId: string, storeId: string) => {
  const [deletedSuppliers] = await db
    .delete(suppliers)
    .where(
      and(inArray(suppliers.id, supplierIds), eq(suppliers.organizationId, organizationId), eq(suppliers.storeId, storeId))
    )
    .returning();

  return deletedSuppliers;
};
