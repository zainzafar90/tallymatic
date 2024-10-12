import { CreateOrderReq, IOptions, IOrder, ListResponse, UpdateOrderReq } from '@shared';

import { ApiError } from '@/common/errors/api-error';
import { getDatabaseInstance } from '@/database/db';

import { paginate } from '../paginate/paginate';
import { OrderItem } from './order-item.model';
import { Order } from './order.model';

export const createOrder = async (orderData: CreateOrderReq): Promise<IOrder> => {
  const transaction = await getDatabaseInstance().transaction();

  try {
    const order = await Order.create(
      {
        ...orderData,
        storeId: '00000000-0000-4000-8000-000000000001',
        subtotal: orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        total: orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0) - orderData.totalDiscount,
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
  const result = await paginate(Order, filter, options);
  return result;
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
