import httpStatus from 'http-status';
import { CreateCustomerReq, ICustomer, IOptions, ListResponse, UpdateCustomerReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';

import { paginate } from '../paginate/paginate';
import { Customer } from './customer.model';

export const createCustomer = async (customerBody: CreateCustomerReq): Promise<ICustomer> => {
  const customer = await Customer.create(customerBody);
  return customer.toJSON();
};

export const queryCustomers = async (filter: Record<string, any>, options: IOptions): Promise<ListResponse<Customer>> => {
  const result = await paginate(Customer, filter, options);
  return result;
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
