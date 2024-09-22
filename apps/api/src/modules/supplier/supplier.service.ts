import httpStatus from 'http-status';
import { CreateSupplierReq, IOptions, ISupplier, ListResponse, UpdateSupplierReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { getDatabaseInstance } from '@/database/db';

import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { Supplier } from './supplier.model';

export const createSupplier = async (supplierBody: CreateSupplierReq): Promise<ISupplier> => {
  const supplier = await Supplier.create(supplierBody);
  return supplier.toJSON();
};

export const querySuppliers = async (
  filter: Record<string, any>,
  options: IOptions,
  wildcardFields: string[] = []
): Promise<ListResponse<Supplier>> => {
  const paginationOptions = buildPaginationOptions(filter, options, wildcardFields);
  const result = await Supplier.findAndCountAll({
    ...paginationOptions,
    paranoid: !options.includeDeleted,
  });

  return transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
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

export const bulkDeleteSuppliers = async (supplierIds: string[]): Promise<ISupplier[]> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const suppliers = await Supplier.findAll({
      where: { id: supplierIds },
      transaction,
    });

    if (suppliers.length !== supplierIds.length) {
      throw new Error('One or more supplier IDs are invalid');
    }

    await Supplier.destroy({
      where: { id: supplierIds },
      transaction,
    });

    await transaction.commit();

    return suppliers.map((supplier) => supplier.toJSON());
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error in bulkDeleteSuppliers:', error);
    throw error;
  }
};
