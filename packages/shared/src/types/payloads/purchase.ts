import { ResourceListResponse } from '../api/api-operations';
import { PaymentMethod, PaymentType, PurchaseStatus } from '../enums.types';

type BasePurchase = {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  status: PurchaseStatus;
  totalAmount?: number;
  notes?: string;
  orderNumber?: string;
  totalQuantity?: number;
  receivedQuantity?: number;
  expectedArrivalDate?: Date;
  paymentMethod?: PaymentMethod;
  paymentType?: PaymentType;
  amountPaid: number;
  lastPaymentDate?: Date;
};

type BasePurchaseItem = {
  id: string;
  purchaseId: string;
  variantId: string;
  quantity: number;
  unitCost: number;
};

export interface IPurchase extends BasePurchase {
  items: BasePurchaseItem[];
}

export type PurchaseListResponse = ResourceListResponse<IPurchase>;
export type PurchaseResponse = IPurchase;

export interface CreatePurchaseReq {
  supplierId: string;
  status: PurchaseStatus;
  notes?: string;
  expectedArrivalDate?: Date;
  receivedQuantity?: number;
  totalQuantity?: number;
  items: BasePurchaseItem[];
  paymentMethod?: PaymentMethod;
  paymentType?: PaymentType;
  amountPaid?: number;
}

export interface UpdatePurchaseReq extends Partial<CreatePurchaseReq> {}
