import { and, asc, count, desc, eq, ilike, inArray, isNull, ne } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreateCustomerReq, IOptions, UpdateCustomerReq } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { Customer, customers } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof customers)['_']['columns'];

interface OrderParams {
  field: OrderField;
  direction: OrderDirection;
}

const customerDTO = (customer: Customer) => {
  return customer;
};

export const createCustomer = async (customerBody: CreateCustomerReq, organizationId: string, storeId: string) => {
  const existingCustomer = await db.query.customers.findFirst({
    where: and(
      eq(customers.email, customerBody.email),
      eq(customers.organizationId, organizationId),
      eq(customers.storeId, storeId)
    ),
  });

  if (existingCustomer) {
    throw new ApiError(httpStatus.CONFLICT, 'Customer with this email already exists');
  }

  const [customer] = await db
    .insert(customers)
    .values({
      ...customerBody,
      organizationId,
      storeId,
    })
    .returning();

  return customerDTO(customer);
};

export const queryCustomers = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string,
  storeId: string,
  wildcardFields: string[] = []
) => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(customers.organizationId, organizationId), eq(customers.storeId, storeId)];

  if (!options.includeDeleted) {
    conditions.push(isNull(customers.deletedAt));
  }

  if (filter.name) {
    conditions.push(
      wildcardFields.includes('name') ? ilike(customers.name, `%${filter.name}%`) : eq(customers.name, filter.name)
    );
  }

  if (filter.email) {
    conditions.push(eq(customers.email, filter.email));
  }

  const whereClause = and(...conditions);

  const orderParams: OrderParams = {
    field: (options.sortBy as OrderField) || 'createdAt',
    direction: (options.sortOrder as OrderDirection) || 'desc',
  };

  const orderFn = orderParams.direction === 'asc' ? asc : desc;
  const orderByClause = orderFn(customers[orderParams.field as keyof (typeof customers)['_']['columns']]);

  const [customersCount] = await db
    .select({ count: count(customers.id) })
    .from(customers)
    .where(whereClause);

  const results = await db.query.customers.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: orderByClause,
  });

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(customersCount.count / limit),
    count: customersCount.count,
  };
};

export const getCustomerById = async (id: string, organizationId: string, storeId: string) => {
  const customer = await db.query.customers.findFirst({
    where: and(
      eq(customers.id, id),
      eq(customers.organizationId, organizationId),
      eq(customers.storeId, storeId),
      isNull(customers.deletedAt)
    ),
  });

  if (!customer) return null;

  return customerDTO(customer);
};

export const updateCustomerById = async (
  customerId: string,
  updateBody: UpdateCustomerReq,
  organizationId: string,
  storeId: string
) => {
  const existingCustomer = await db.query.customers.findFirst({
    where: and(
      eq(customers.email, updateBody.email),
      eq(customers.organizationId, organizationId),
      eq(customers.storeId, storeId),
      ne(customers.id, customerId)
    ),
  });

  if (existingCustomer) {
    throw new ApiError(httpStatus.CONFLICT, 'Customer with this email already exists');
  }

  const [customer] = await db
    .update(customers)
    .set({
      ...updateBody,
    })
    .where(
      and(
        eq(customers.id, customerId),
        eq(customers.organizationId, organizationId),
        eq(customers.storeId, storeId),
        isNull(customers.deletedAt)
      )
    )
    .returning();

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer could not be updated');
  }

  return customerDTO(customer);
};

export const deleteCustomerById = async (customerId: string, organizationId: string, storeId: string) => {
  const [deletedCustomer] = await db
    .delete(customers)
    .where(and(eq(customers.id, customerId), eq(customers.organizationId, organizationId), eq(customers.storeId, storeId)))
    .returning();

  return customerDTO(deletedCustomer);
};

export const bulkDeleteCustomers = async (customerIds: string[], organizationId: string, storeId: string) => {
  const [deletedCustomers] = await db
    .delete(customers)
    .where(
      and(inArray(customers.id, customerIds), eq(customers.organizationId, organizationId), eq(customers.storeId, storeId))
    )
    .returning();

  return deletedCustomers;
};
