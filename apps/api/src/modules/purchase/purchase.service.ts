import httpStatus from 'http-status';
import { CreatePurchaseReq, IOptions, ListResponse } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { getDatabaseInstance } from '@/database/db';

import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { Supplier } from '../supplier/supplier.model';
import { PurchaseItem } from './purchase-item.model';
import { Purchase } from './purchase.model';

export const createPurchase = async (purchaseData: CreatePurchaseReq): Promise<Purchase> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const { items, ...purchaseBody } = purchaseData;
    const totalAmount = items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
    const purchase = await Purchase.create(
      {
        ...purchaseBody,
        totalAmount,
      },
      { transaction }
    );

    if (items && items.length > 0) {
      const purchaseItems = items.map((item: any) => ({
        ...item,
        purchaseId: purchase.id,
      }));
      await PurchaseItem.bulkCreate(purchaseItems, { transaction });
    }

    await transaction.commit();
    return purchase;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const queryPurchases = async (filter: Record<string, any>, options: IOptions): Promise<ListResponse<Purchase>> => {
  const paginationOptions = buildPaginationOptions(filter, options);
  const result = await Purchase.findAndCountAll({
    ...paginationOptions,
    include: [PurchaseItem, Supplier],
  });
  return transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
};

export const getPurchaseById = async (id: string): Promise<Purchase | null> => {
  return Purchase.findByPk(id, {
    include: [PurchaseItem],
  });
};

export const updatePurchaseById = async (purchaseId: string, updateBody: any): Promise<Purchase | null> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const purchase = await Purchase.findByPk(purchaseId, { transaction });
    if (!purchase) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
    }

    const { items, ...purchaseData } = updateBody;
    const totalAmount = items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);

    if (items) {
      await PurchaseItem.destroy({
        where: { purchaseId },
        transaction,
      });

      const purchaseItems = items.map((item: any) => ({
        ...item,
        purchaseId,
      }));
      await PurchaseItem.bulkCreate(purchaseItems, { transaction });
    }

    Object.assign(purchase, {
      ...purchaseData,
      totalAmount,
    });
    await purchase.save({ transaction });
    await transaction.commit();

    return purchase;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deletePurchaseById = async (purchaseId: string): Promise<void> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const purchase = await Purchase.findByPk(purchaseId, { transaction });
    if (!purchase) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
    }
    await purchase.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
