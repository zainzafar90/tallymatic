import { ResourceListResponse } from '../api/api-operations';
import { Status } from '../enums.types';

export interface BaseSupplier {
  id: string;
  organizationId: string;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/* ----------------------------
 * LIST VIEW TYPES
 * ---------------------------- */
export interface ISupplier extends BaseSupplier {
  totalPurchases: number;
  lastPurchaseDate?: Date;
  totalSpent: number;
}

/* ----------------------------
 * CREATE/UPDATE OPERATION TYPES
 * ---------------------------- */
export interface CreateSupplierReq {
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierReq extends Partial<CreateSupplierReq> {
  status?: Status;
}

/* ----------------------------
 * RESPONSES
 * ---------------------------- */
export type SupplierListResponse = ResourceListResponse<ISupplier>;

// Analytics and Metrics
// export interface SupplierMetrics {
//   totalPurchases: number;
//   averagePurchaseValue: number;
//   totalSpent: number;
//   lastPurchaseDate?: Date;
//   firstPurchaseDate?: Date;
//   purchaseFrequency: number;
// }

/*
 * ----------------------------
 * DETAIL VIEW TYPES
 * ----------------------------
 */
// export interface SupplierPurchase {
//   id: string;
//   purchaseNumber: string;
//   total: number;
//   status: string;
//   createdAt: Date;
// }

// export interface SupplierDetail extends BaseSupplier {
//   purchases: SupplierPurchase[];
//   notes?: string;
//   tags: string[];
// }
