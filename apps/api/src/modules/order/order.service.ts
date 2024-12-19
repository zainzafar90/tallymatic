import { and, asc, count, desc, eq } from 'drizzle-orm';
import { CreateOrderReq, IOptions, ListResponse, UpdateOrderReq } from '@repo/shared';

import { ApiError } from '@/common/errors/api-error';
import { db } from '@/db';
import { orderItems, orders } from '@/db/schema';

import { getPaginationConfig } from '../paginate/pagination';

type OrderDirection = 'asc' | 'desc';
type OrderField = keyof (typeof orders)['_']['columns'];

interface OrderParams {
  field: OrderField;
  direction: OrderDirection;
}

const generateOrderNumber = async (organizationId: string) => {
  const orderCount = await db.select({ count: count() }).from(orders).where(eq(orders.organizationId, organizationId));
  const orderNumber = (orderCount[0].count + 1).toString().padStart(4, '0');
  return `ORD-${orderNumber}`;
};

export const createOrder = async (orderData: CreateOrderReq, organizationId: string) => {
  return await db.transaction(async (tx) => {
    const subtotalValue = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity - (item.totalDiscount || 0),
      0
    );
    const totalValue = subtotalValue + (orderData.taxAmount || 0) - (orderData.discountAmount || 0);

    const orderNumber = await generateOrderNumber(organizationId);
    const orderNew = {
      ...orderData,
      orderNumber,
      organizationId,
      status: orderData.status,
      totalAmount: totalValue,
      subtotal: subtotalValue,
      taxAmount: orderData.taxAmount || 0,
      discountAmount: orderData.discountAmount || 0,
      currency: 'PKR',
    };

    const [order] = await tx.insert(orders).values(orderNew).returning();

    if (orderData.items?.length > 0) {
      const orderItemsNew = orderData.items.map((item) => ({
        ...item,
        orderId: order.id,
        price: item.price.toString(),
      }));
      await tx.insert(orderItems).values(orderItemsNew);
    }

    const createdOrder = await tx.query.orders.findFirst({
      where: eq(orders.id, order.id),
      with: {
        items: true,
      },
    });

    return createdOrder;
  });
};

export const queryOrders = async (
  filter: Record<string, any>,
  options: IOptions,
  organizationId: string
): Promise<ListResponse<typeof orders.$inferSelect>> => {
  const { limit, offset } = getPaginationConfig(options);

  const conditions = [eq(orders.organizationId, organizationId)];
  if (filter.orderNumber) {
    conditions.push(eq(orders.orderNumber, filter.orderNumber));
  }
  if (filter.status) {
    conditions.push(eq(orders.status, filter.status));
  }

  const whereClause = and(...conditions);

  const orderParams: OrderParams = {
    field: (options.sortBy as OrderField) || 'createdAt',
    direction: (options.sortOrder as OrderDirection) || 'desc',
  };

  const orderFn = orderParams.direction === 'asc' ? asc : desc;
  const orderByClause = orderFn(orders[orderParams.field as keyof (typeof orders)['_']['columns']]);

  const [ordersCount] = await db.select({ count: count() }).from(orders).where(whereClause);

  const results = await db.query.orders.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: orderByClause,
    with: {
      items: true,
    },
  });

  return {
    results,
    limit,
    offset,
    pages: Math.ceil(ordersCount.count / limit),
    count: ordersCount.count,
  };
};

export const getOrderById = async (id: string, organizationId: string) => {
  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, id), eq(orders.organizationId, organizationId)),
    with: {
      items: true,
    },
  });

  return order;
};

export const updateOrderById = async (orderId: string, updateBody: UpdateOrderReq, organizationId: string) => {
  return await db.transaction(async (tx) => {
    const order = await tx.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.organizationId, organizationId)),
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const [updatedOrder] = await tx
      .update(orders)
      .set(updateBody)
      .where(and(eq(orders.id, orderId), eq(orders.organizationId, organizationId)))
      .returning();

    if (updateBody.items) {
      await tx.delete(orderItems).where(eq(orderItems.orderId, orderId));
      await tx
        .insert(orderItems)
        .values(updateBody.items.map((item) => ({ ...item, orderId, price: item.price.toString() })));
    }

    const result = await tx.query.orders.findFirst({
      where: eq(orders.id, updatedOrder.id),
      with: {
        items: true,
      },
    });

    return result;
  });
};

export const deleteOrderById = async (orderId: string, organizationId: string): Promise<void> => {
  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.organizationId, organizationId)),
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  await db.delete(orders).where(and(eq(orders.id, orderId), eq(orders.organizationId, organizationId)));
};
