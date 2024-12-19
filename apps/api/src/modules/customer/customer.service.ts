import { and, asc, count, desc, eq, ilike, inArray, isNull } from 'drizzle-orm';
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

export const createCustomer = async (customerBody: CreateCustomerReq, organizationId: string) => {
  const [customer] = await db
    .insert(customers)
    .values({
      ...customerBody,
      organizationId,
    })
    .returning();

  return customerDTO(customer);
};

export const queryCustomers = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string,
  wildcardFields: string[] = []
) => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(customers.organizationId, organizationId)];

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

  const [customersCount] = await db.select({ count: count() }).from(customers).where(whereClause);

  const results = await db.select().from(customers).where(whereClause).limit(limit).offset(offset).orderBy(orderByClause);

  return {
    results: results.map(customerDTO),
    limit,
    offset,
    pages: Math.ceil(customersCount.count / limit),
    count: customersCount.count,
  };
};

export const getCustomerById = async (id: string, organizationId: string) => {
  const customer = await db.query.customers.findFirst({
    where: and(eq(customers.id, id), eq(customers.organizationId, organizationId), isNull(customers.deletedAt)),
  });

  if (!customer) return null;

  return customerDTO(customer);
};

export const updateCustomerById = async (customerId: string, updateBody: UpdateCustomerReq, organizationId: string) => {
  const [customer] = await db
    .update(customers)
    .set({
      ...updateBody,
    })
    .where(and(eq(customers.id, customerId), eq(customers.organizationId, organizationId), isNull(customers.deletedAt)))
    .returning();

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }

  return customerDTO(customer);
};

export const deleteCustomerById = async (customerId: string, organizationId: string) => {
  const [deletedCustomer] = await db
    .delete(customers)
    .where(and(eq(customers.id, customerId), eq(customers.organizationId, organizationId)))
    .returning();

  return customerDTO(deletedCustomer);
};

export const bulkDeleteCustomers = async (customerIds: string[], organizationId: string) => {
  return db.transaction(async (tx) => {
    const existingCustomers = await tx
      .select()
      .from(customers)
      .where(and(inArray(customers.id, customerIds), eq(customers.organizationId, organizationId)));

    if (existingCustomers.length !== customerIds.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'One or more customers not found');
    }

    await tx.delete(customers).where(and(inArray(customers.id, customerIds), eq(customers.organizationId, organizationId)));
    return existingCustomers.map(customerDTO);
  });
};
