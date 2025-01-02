import { ResourceListResponse } from '../api/api-operations';
import { Status } from '../enums.types';

type BaseSupplier = {
  id: string;
  organizationId: string;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: Status;
};

/* ----------------------------
 * LIST VIEW RESPONSE TYPES
 * ---------------------------- */
export interface ISupplier extends BaseSupplier {
  // totalPurchases: number;
  // lastPurchaseDate?: Date;
  // totalSpent: number;
  createdAt: Date;
}

export type SupplierListResponse = ResourceListResponse<ISupplier>;
export type SupplierResponse = BaseSupplier;

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
