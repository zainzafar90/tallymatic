import { TransactionType } from './inventory.model';

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

export interface InventoryLevelRes {
  id: string;
  name: string;
  currentStock: number;
  lowStockThreshold: number;
  reorderPoint: number;
  reorderQuantity: number;
}
