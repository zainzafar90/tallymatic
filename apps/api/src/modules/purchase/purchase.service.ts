import { and, asc, count, desc, eq, ilike, inArray } from 'drizzle-orm';
import httpStatus from 'http-status';
import { CreatePurchaseReq, IOptions, ListResponse, PurchaseStatus, TransactionType, UpdatePurchaseReq } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { purchaseItems, purchases } from '@/db/schema';

import { adjustStock, recordPurchaseReceived } from '../inventory/inventory.service';
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

export const createPurchase = async (
  purchaseData: CreatePurchaseReq,
  organizationId: string,
  storeId: string,
  userId: string
) => {
  return await db.transaction(async (tx) => {
    const subtotalValue = purchaseData.items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
    const totalValue = subtotalValue;

    const purchaseNumber = await generatePurchaseNumber(organizationId);
    const purchaseNew = {
      ...purchaseData,
      purchaseNumber,
      organizationId,
      storeId,
      status: purchaseData.status,
      totalAmount: totalValue,
      subtotal: subtotalValue,
      taxAmount: 0,
      discountAmount: 0,
      currency: 'PKR',
      paymentMethod: purchaseData.paymentMethod,
      amountPaid: purchaseData.amountPaid || 0,
      lastPaymentDate: purchaseData.amountPaid ? new Date() : null,
    };

    const [purchase] = await tx.insert(purchases).values(purchaseNew).returning();

    if (purchaseData.items?.length > 0) {
      const purchaseItemsNew = purchaseData.items.map((item) => ({
        ...item,
        purchaseId: purchase.id,
        unitCost: item.unitCost.toString(),
      }));
      await tx.insert(purchaseItems).values(purchaseItemsNew);

      for (const item of purchaseData.items) {
        await adjustStock({
          variantId: item.variantId,
          quantity: item.quantity,
          type: TransactionType.RECEIVED,
          organizationId,
          storeId,
          userId,
          referenceId: purchase.id,
          notes: 'Purchase received',
        });
      }
    }

    const createdPurchase = await tx.query.purchases.findFirst({
      where: eq(purchases.id, purchase.id),
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

    return createdPurchase;
  });
};

export const queryPurchases = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string,
  storeId: string
): Promise<ListResponse<typeof purchases.$inferSelect>> => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(purchases.organizationId, organizationId), eq(purchases.storeId, storeId)];
  if (filter.status) {
    conditions.push(eq(purchases.status, filter.status));
  }
  if (filter.supplierId) {
    conditions.push(eq(purchases.supplierId, filter.supplierId));
  }
  if (filter.purchaseNumber) {
    conditions.push(ilike(purchases.purchaseNumber, `%${filter.purchaseNumber}%`));
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

export const getPurchaseById = async (id: string, organizationId: string, storeId: string) => {
  const purchase = await db.query.purchases.findFirst({
    where: and(eq(purchases.id, id), eq(purchases.organizationId, organizationId), eq(purchases.storeId, storeId)),
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

  if (!purchase) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
  }

  return purchase;
};

export const updatePurchaseById = async (
  purchaseId: string,
  updateBody: UpdatePurchaseReq,
  organizationId: string,
  userId: string,
  storeId: string
) => {
  return await db.transaction(async (tx) => {
    const existingPurchase = await tx.query.purchases.findFirst({
      where: and(eq(purchases.id, purchaseId), eq(purchases.organizationId, organizationId)),
      with: {
        items: true,
      },
    });

    if (!existingPurchase) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
    }

    const oldReceivedQuantity = existingPurchase.receivedQuantity || 0;
    const newReceivedQuantity = updateBody.receivedQuantity || 0;
    const receivedDifference = newReceivedQuantity - oldReceivedQuantity;

    if (receivedDifference > 0) {
      const totalQuantity = existingPurchase.totalQuantity;
      await Promise.all(
        existingPurchase.items.map(async (item) => {
          const itemProportion = item.quantity / totalQuantity;
          const itemReceivedQuantity = Math.round(receivedDifference * itemProportion);

          if (itemReceivedQuantity > 0) {
            await recordPurchaseReceived({
              variantId: item.variantId,
              quantity: itemReceivedQuantity,
              organizationId,
              storeId,
              userId,
              purchaseId,
              notes: 'Purchase items received',
            });
          }
        })
      );
    }

    const subtotalValue = updateBody.items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
    const totalValue = subtotalValue;

    const updateBodyNew = {
      ...updateBody,
      totalAmount: totalValue,
      subtotal: subtotalValue,
      taxAmount: 0,
      discountAmount: 0,
      organizationId,
    };

    const [updatedPurchase] = await tx
      .update(purchases)
      .set(updateBodyNew)
      .where(and(eq(purchases.id, purchaseId), eq(purchases.organizationId, organizationId), eq(purchases.storeId, storeId)))
      .returning();

    if (updateBody.items) {
      await tx.delete(purchaseItems).where(eq(purchaseItems.purchaseId, purchaseId));
      await tx
        .insert(purchaseItems)
        .values(updateBody.items.map((item) => ({ ...item, purchaseId, unitCost: item.unitCost.toString() })));
    }

    const result = await tx.query.purchases.findFirst({
      where: eq(purchases.id, updatedPurchase.id),
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

    return result;
  });
};

export const deletePurchaseById = async (purchaseId: string, organizationId: string, storeId: string) => {
  const [purchase] = await db
    .delete(purchases)
    .where(and(eq(purchases.id, purchaseId), eq(purchases.organizationId, organizationId), eq(purchases.storeId, storeId)))
    .returning();

  if (!purchase) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase not found');
  }

  return purchase;
};

export const bulkDeletePurchases = async (purchaseIds: string[], organizationId: string, storeId: string) => {
  const [deletedPurchases] = await db
    .delete(purchases)
    .where(
      and(inArray(purchases.id, purchaseIds), eq(purchases.organizationId, organizationId), eq(purchases.storeId, storeId))
    )
    .returning();

  return deletedPurchases;
};
