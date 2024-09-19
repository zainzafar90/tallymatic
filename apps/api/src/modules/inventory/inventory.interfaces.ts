import { TransactionType } from '@shared';

export interface AdjustStockReq {
  variantId: string;
  quantity: number;
  type: TransactionType;
  notes?: string;
}

export interface InventoryRes {
  id: string;
  variantId: string;
  type: TransactionType;
  quantity: number;
  date: Date;
  notes?: string;
}
