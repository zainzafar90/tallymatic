import httpStatus from 'http-status';
import { CreatePurchaseReq, IOptions, ListResponse, PurchaseStatus, TransactionType } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { getDatabaseInstance } from '@/database/db';

import { adjustStock } from '../inventory/inventory.service';
import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { Supplier } from '../supplier/supplier.model';
import { PurchaseItem } from './purchase-item.model';
import { Purchase } from './purchase.model';

export const createPurchase = async (purchaseData: CreatePurchaseReq): Promise<Purchase> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const { items, ...purchaseBody } = purchaseData;
    const totalAmount = items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const purchase = await Purchase.create(
      {
        ...purchaseBody,
        totalAmount,
        totalQuantity,
        receivedQuantity: 0,
        storeId: '00000000-0000-4000-8000-000000000001',
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
    const purchase = await Purchase.findByPk(purchaseId, {
      transaction,
      include: [PurchaseItem],
    });
    if (!purchase) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
    }

    const { items } = updateBody;
    const totalAmount = items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    // Map existing items by variantId for comparison
    const existingItemsMap = purchase.items.reduce((acc, item) => {
      acc[item.variantId] = item;
      return acc;
    }, {});

    // Process each item's received quantity changes
    for (const newItem of items) {
      const existingItem = existingItemsMap[newItem.variantId];
      const previousReceivedQty = existingItem?.receivedQuantity || 0;
      const newReceivedQty = newItem.receivedQuantity || 0;
      const receivedDifference = newReceivedQty - previousReceivedQty;

      if (receivedDifference !== 0) {
        await adjustStock(
          newItem.variantId,
          receivedDifference,
          receivedDifference > 0 ? TransactionType.RECEIVED : TransactionType.ADJUSTED,
          `Purchase ${purchase.orderNumber} - ${receivedDifference > 0 ? 'Received' : 'Adjusted'} ${Math.abs(
            receivedDifference
          )} units`
        );
      }
    }

    // Calculate total received quantity
    const newTotalReceivedQty = items.reduce((sum, item) => sum + (item.receivedQuantity || 0), 0);

    // Validate status change
    if (updateBody.status === PurchaseStatus.CLOSED) {
      if (newTotalReceivedQty !== totalQuantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot close purchase order until all items are received');
      }
    }

    // If already closed, prevent any changes except notes
    if (purchase.status === PurchaseStatus.CLOSED && updateBody.status !== PurchaseStatus.CLOSED) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot modify a closed purchase order');
    }

    // Update purchase items
    await PurchaseItem.destroy({
      where: { purchaseId },
      transaction,
    });

    const purchaseItems = items.map((item: any) => ({
      ...item,
      purchaseId,
    }));
    await PurchaseItem.bulkCreate(purchaseItems, { transaction });

    // Determine status based on received quantity
    let status = updateBody.status;
    if (!status || status !== PurchaseStatus.CLOSED) {
      if (newTotalReceivedQty === 0) {
        status = PurchaseStatus.ORDERED;
      } else if (newTotalReceivedQty === totalQuantity) {
        status = PurchaseStatus.RECEIVED;
      } else if (newTotalReceivedQty > 0 && newTotalReceivedQty < totalQuantity) {
        status = PurchaseStatus.PARTIAL;
      }
    }

    Object.assign(purchase, {
      ...updateBody,
      status,
      totalAmount,
      totalQuantity,
      receivedQuantity: newTotalReceivedQty,
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
