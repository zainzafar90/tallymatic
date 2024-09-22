import httpStatus from 'http-status';
import { CreateCustomerReq, ICustomer, IOptions, ListResponse, UpdateCustomerReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { getDatabaseInstance } from '@/database/db';

import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { Customer } from './customer.model';

export const createCustomer = async (customerBody: CreateCustomerReq): Promise<ICustomer> => {
  const customer = await Customer.create(customerBody);
  return customer.toJSON();
};

export const queryCustomers = async (
  filter: Record<string, any>,
  options: IOptions,
  wildcardFields: string[] = []
): Promise<ListResponse<Customer>> => {
  const paginationOptions = buildPaginationOptions(filter, options, wildcardFields);
  const result = await Customer.findAndCountAll({
    ...paginationOptions,
    paranoid: !options.includeDeleted,
  });

  return transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
};

export const getCustomerById = async (id: string): Promise<ICustomer | null> => {
  const customer = await Customer.findByPk(id);
  return customer ? customer.toJSON() : null;
};

export const updateCustomerById = async (customerId: string, updateBody: UpdateCustomerReq): Promise<ICustomer | null> => {
  const customer = await Customer.findByPk(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  Object.assign(customer, updateBody);
  await customer.save();
  return customer.toJSON();
};

export const deleteCustomerById = async (customerId: string): Promise<ICustomer | null> => {
  const customer = await Customer.findByPk(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  await customer.destroy();
  return customer.toJSON();
};

export const bulkDeleteCustomers = async (customerIds: string[]): Promise<ICustomer[]> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const customers = await Customer.findAll({
      where: { id: customerIds },
      transaction,
    });

    if (customers.length !== customerIds.length) {
      throw new Error('One or more customer IDs are invalid');
    }

    await Customer.destroy({
      where: { id: customerIds },
      transaction,
    });

    await transaction.commit();

    return customers.map((customer) => customer.toJSON());
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error in bulkDeleteCustomers:', error);
    throw error;
  }
};
