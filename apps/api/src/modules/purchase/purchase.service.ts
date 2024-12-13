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

    const { items, ...purchaseData } = updateBody;
    const totalAmount = items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const newReceivedQty = updateBody.receivedQuantity ?? purchase.receivedQuantity;

    // Validate status change
    if (purchaseData.status === PurchaseStatus.CLOSED) {
      // Check if all items are received before allowing closure
      if (newReceivedQty !== totalQuantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot close purchase order until all items are received');
      }
    }

    // If already closed, prevent any changes except notes
    if (purchase.status === PurchaseStatus.CLOSED && purchaseData.status !== PurchaseStatus.CLOSED) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot modify a closed purchase order');
    }

    const previousReceivedQty = purchase.receivedQuantity || 0;
    const receivedDifference = newReceivedQty - previousReceivedQty;

    // If there's a change in received quantity, update inventory
    if (receivedDifference !== 0) {
      // For each item, calculate its received quantity based on the total received
      const currentItems = updateBody.items || purchase.items;

      // If receiving items
      if (receivedDifference > 0) {
        for (const item of currentItems) {
          // Calculate what portion of the new received quantity should go to this item
          const itemReceived = Math.floor((item.quantity / totalQuantity) * receivedDifference);

          if (itemReceived > 0) {
            await adjustStock(
              item.variantId,
              itemReceived,
              TransactionType.RECEIVED,
              `Purchase ${purchase.orderNumber} - Received ${itemReceived} units`
            );
          }
        }
      } else {
        // If reducing received quantity (e.g., correcting a mistake)
        for (const item of currentItems) {
          const itemReduction = Math.floor((item.quantity / totalQuantity) * Math.abs(receivedDifference));

          if (itemReduction > 0) {
            await adjustStock(
              item.variantId,
              -itemReduction,
              TransactionType.ADJUSTED,
              `Purchase ${purchase.orderNumber} - Adjusted received quantity by -${itemReduction} units`
            );
          }
        }
      }
    }

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

    // Determine status based on received quantity (if not explicitly set to CLOSED)
    let status = purchaseData.status;
    if (!status || status !== PurchaseStatus.CLOSED) {
      if (newReceivedQty === 0) {
        status = PurchaseStatus.ORDERED;
      } else if (newReceivedQty === totalQuantity) {
        status = PurchaseStatus.RECEIVED;
      } else if (newReceivedQty > 0 && newReceivedQty < totalQuantity) {
        status = PurchaseStatus.PARTIAL;
      }
    }

    Object.assign(purchase, {
      ...purchaseData,
      status,
      totalAmount,
      totalQuantity,
      receivedQuantity: newReceivedQty,
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
