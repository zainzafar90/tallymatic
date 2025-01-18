import { ResourceListResponse } from '../api/api-operations';
import { OrderStatus, PaymentMethod, PaymentType } from '../enums.types';

type BaseOrder = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  closedAt?: Date;
  currency: string;
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  paymentMethod?: PaymentMethod;
  paymentType?: PaymentType;
  amountPaid: number;
  lastPaymentDate?: Date;
};

type BaseOrderItem = {
  id: string;
  orderId?: string;
  variantId: string;
  quantity: number;
  price: number;
  totalDiscount: number;
};

export interface ICustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface IOrder extends BaseOrder {
  items: BaseOrderItem[];
  createdAt: Date;
  customer?: ICustomer;
}

export interface IOrderItem extends BaseOrderItem {
  createdAt: Date;
}

export type OrderListResponse = ResourceListResponse<IOrder>;
export type OrderResponse = IOrder;

export interface CreateOrderReq {
  customerId: string;
  status: OrderStatus;
  taxAmount: number;
  discountAmount: number;
  items: BaseOrderItem[];
  paymentMethod?: PaymentMethod;
  paymentType?: PaymentType;
  amountPaid?: number;
}

export interface UpdateOrderReq extends Partial<CreateOrderReq> {
  closedAt?: Date; // Optionally close the order with a date
}
