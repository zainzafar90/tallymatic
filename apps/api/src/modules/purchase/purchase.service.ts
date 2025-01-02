import { and, asc, count, desc, eq } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreatePurchaseReq, IOptions, ListResponse, PurchaseStatus, TransactionType } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { purchaseItems, purchases } from '@/db/schema';

import { adjustStock } from '../inventory/inventory.service';
import { getPaginationConfig } from '../paginate/pagination';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof purchases)['_']['columns'];

interface OrderParams {
  field: OrderField;
  direction: OrderDirection;
}

const generatePurchaseNumber = async (organizationId: string) => {
  const purchaseCount = await db
    .select({ count: count() })
    .from(purchases)
    .where(eq(purchases.organizationId, organizationId));
  const paddedPurchaseNumber = (purchaseCount[0].count + 1).toString().padStart(4, '0');
  return `PO-${paddedPurchaseNumber}`;
};

export const createPurchase = async (purchaseData: CreatePurchaseReq, organizationId: string) => {
  return await db.transaction(async (tx) => {
    const { items, ...purchaseBody } = purchaseData;
    const totalAmount = items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const purchaseNumber = await generatePurchaseNumber(organizationId);
    const purchaseNew = {
      ...purchaseBody,
      purchaseNumber,
      organizationId,
      totalAmount: totalAmount.toString(),
      totalQuantity,
      receivedQuantity: 0,
      status: PurchaseStatus.ORDERED,
      paymentMethod: purchaseData.paymentMethod,
      amountPaid: purchaseData.amountPaid || 0,
      lastPaymentDate: purchaseData.amountPaid ? new Date() : null,
    };

    const [purchase] = await tx.insert(purchases).values(purchaseNew).returning();

    if (items?.length > 0) {
      const purchaseItemsNew = items.map((item) => ({
        ...item,
        purchaseId: purchase.id,
        organizationId,
        unitCost: item.unitCost.toString(),
      }));
      await tx.insert(purchaseItems).values(purchaseItemsNew);
    }

    const createdPurchase = await tx.query.purchases.findFirst({
      where: eq(purchases.id, purchase.id),
      with: {
        items: true,
        supplier: true,
      },
    });

    return createdPurchase;
  });
};

export const queryPurchases = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string
): Promise<ListResponse<typeof purchases.$inferSelect>> => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(purchases.organizationId, organizationId)];
  if (filter.status) {
    conditions.push(eq(purchases.status, filter.status));
  }
  if (filter.supplierId) {
    conditions.push(eq(purchases.supplierId, filter.supplierId));
  }

  const whereClause = and(...conditions);

  const orderParams: OrderParams = {
    field: (options.sortBy as OrderField) || 'createdAt',
    direction: (options.sortOrder as OrderDirection) || 'desc',
  };

  const orderFn = orderParams.direction === 'asc' ? asc : desc;
  const orderByClause = orderFn(purchases[orderParams.field as keyof (typeof purchases)['_']['columns']]);

  const [purchasesCount] = await db.select({ count: count() }).from(purchases).where(whereClause);

  const results = await db.query.purchases.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: orderByClause,
    with: {
      items: {
        with: {
          variant: {
            with: {
              product: true,
            },
          },
        },
      },
      supplier: true,
    },
  });

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(purchasesCount.count / limit),
    count: purchasesCount.count,
  };
};

export const getPurchaseById = async (id: string, organizationId: string) => {
  const purchase = await db.query.purchases.findFirst({
    where: and(eq(purchases.id, id), eq(purchases.organizationId, organizationId)),
    with: {
      items: true,
      supplier: true,
    },
  });
  return purchase;
};

export const updatePurchaseById = async (purchaseId: string, updateBody: any, organizationId: string) => {
  return await db.transaction(async (tx) => {
    const purchase = await tx.query.purchases.findFirst({
      where: and(eq(purchases.id, purchaseId), eq(purchases.organizationId, organizationId)),
      with: {
        items: true,
      },
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
          `Purchase ${purchase.purchaseNumber} - ${receivedDifference > 0 ? 'Received' : 'Adjusted'} ${Math.abs(
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
    await tx.delete(purchaseItems).where(eq(purchaseItems.purchaseId, purchaseId));

    const purchaseItemsNew = items.map((item) => ({
      ...item,
      purchaseId,
      organizationId,
      unitCost: item.unitCost.toString(),
    }));
    await tx.insert(purchaseItems).values(purchaseItemsNew);

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

    const purchaseUpdate = {
      ...updateBody,
      status,
      totalAmount: totalAmount.toString(),
      totalQuantity,
      receivedQuantity: newTotalReceivedQty,
    };

    const [updatedPurchase] = await tx
      .update(purchases)
      .set(purchaseUpdate)
      .where(and(eq(purchases.id, purchaseId), eq(purchases.organizationId, organizationId)))
      .returning();

    const result = await tx.query.purchases.findFirst({
      where: eq(purchases.id, updatedPurchase.id),
      with: {
        items: true,
        supplier: true,
      },
    });

    return result;
  });
};

export const deletePurchaseById = async (purchaseId: string, organizationId: string) => {
  const purchase = await getPurchaseById(purchaseId, organizationId);
  if (!purchase) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
  }

  const [deletedPurchase] = await db
    .delete(purchases)
    .where(and(eq(purchases.id, purchaseId), eq(purchases.organizationId, organizationId)))
    .returning();

  return deletedPurchase;
};
