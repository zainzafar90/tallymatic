import { CreateOrderReq, IOptions, IOrder, ListResponse, UpdateOrderReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { getDatabaseInstance } from '@/database/db';

import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { OrderItem } from './order-item.model';
import { Order } from './order.model';

export const createOrder = async (orderData: CreateOrderReq): Promise<IOrder> => {
  const transaction = await getDatabaseInstance().transaction();

  try {
    const subtotalValue = orderData.items.reduce((sum, item) => sum + item.price * item.quantity - item.totalDiscount, 0);
    const totalValue = subtotalValue + (orderData.taxAmount || 0) - (orderData.discountAmount || 0);

    const order = await Order.create(
      {
        ...orderData,
        storeId: '00000000-0000-4000-8000-000000000001',
        subtotal: subtotalValue,
        total: totalValue,
      },
      { transaction }
    );

    if (orderData.items && orderData.items.length > 0) {
      await OrderItem.bulkCreate(
        orderData.items.map((item) => ({ ...item, orderId: order.id })),
        { transaction }
      );
    }

    await transaction.commit();
    return order.toJSON();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const queryOrders = async (filter: Record<string, any>, options: IOptions): Promise<ListResponse<Order>> => {
  const paginationOptions = buildPaginationOptions(filter, options, ['orderNumber']);

  const result = await Order.findAndCountAll({
    ...paginationOptions,
    include: [
      {
        model: OrderItem,
        as: 'items',
      },
    ],
  });

  return transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
};

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  const order = await Order.findByPk(id, {
    include: [{ model: OrderItem, as: 'items' }],
  });
  return order ? order.toJSON() : null;
};

export const updateOrderById = async (orderId: string, updateBody: UpdateOrderReq): Promise<IOrder | null> => {
  const transaction = await getDatabaseInstance().transaction();

  try {
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    Object.assign(order, updateBody);
    await order.save({ transaction });

    if (updateBody.items) {
      await OrderItem.destroy({ where: { orderId: orderId }, transaction });
      await OrderItem.bulkCreate(
        updateBody.items.map((item) => ({ ...item, orderId: orderId })),
        { transaction }
      );
    }

    await transaction.commit();

    const orderById = await getOrderById(orderId);
    return orderById;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteOrderById = async (orderId: string): Promise<void> => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  await order.destroy();
};
