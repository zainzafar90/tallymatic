import { ResourceListResponse } from '../api/api-operations';
import { Status } from '../enums.types';

type BaseCustomer = {
  id: string;
  name: string;
  status: Status;
  email: string;
  phone?: string;
  address?: string;
  organizationId: string;
};

/* ----------------------------
 * LIST VIEW TYPES
 * ---------------------------- */
export interface ICustomer extends BaseCustomer {
  // totalOrders: number;
  // lastOrderDate?: Date;
  // lifetimeValue: number;
  createdAt: Date;
}

/* -----------------------------
 * CREATE/UPDATE OPERATION TYPES
 * ----------------------------- */
export interface CreateCustomerReq {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerReq extends Partial<CreateCustomerReq> {
  status?: Status;
}

/* ----------------------------
 * RESPONSES
 * ---------------------------- */
export type CustomerResponse = BaseCustomer;
export type CustomerListResponse = ResourceListResponse<ICustomer>;

// Analytics and Metrics
// export interface CustomerMetrics {
//   totalOrders: number;
//   averageOrderValue: number;
//   lifetimeValue: number;
//   lastOrderDate?: Date;
//   firstOrderDate?: Date;
//   orderFrequency: number;
// }

/*
 * -----------------------------
 * DETAIL VIEW TYPES
 * -----------------------------
 */
// export interface CustomerOrder {
//   id: string;
//   orderNumber: string;
//   total: number;
//   status: string;
//   createdAt: Date;
// }

// export interface CustomerDetail extends BaseCustomer {
//   orders: CustomerOrder[];
//   notes?: string;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }
