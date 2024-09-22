import httpStatus from 'http-status';
import { CreateSupplierReq, IOptions, ISupplier, ListResponse, UpdateSupplierReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';

import { paginate } from '../paginate/paginate';
import { Supplier } from './supplier.model';

export const createSupplier = async (supplierBody: CreateSupplierReq): Promise<ISupplier> => {
  const supplier = await Supplier.create(supplierBody);
  return supplier.toJSON();
};

export const querySuppliers = async (filter: Record<string, any>, options: IOptions): Promise<ListResponse<Supplier>> => {
  const result = await paginate(Supplier, filter, options);
  return result;
};

export const getSupplierById = async (id: string): Promise<ISupplier | null> => {
  const supplier = await Supplier.findByPk(id);
  return supplier ? supplier.toJSON() : null;
};

export const updateSupplierById = async (supplierId: string, updateBody: UpdateSupplierReq): Promise<ISupplier | null> => {
  const supplier = await Supplier.findByPk(supplierId);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
  }
  Object.assign(supplier, updateBody);
  await supplier.save();
  return supplier.toJSON();
};

export const deleteSupplierById = async (supplierId: string): Promise<ISupplier | null> => {
  const supplier = await Supplier.findByPk(supplierId);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
  }
  await supplier.destroy();
  return supplier.toJSON();
};
