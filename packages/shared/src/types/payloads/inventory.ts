export enum InventoryAdjustmentType {
  CORRECTION = 'correction',
  RETURN_RESTOCK = 'return_restock',
  PURCHASE = 'purchase',
  DAMAGE = 'damage',
  THEFT_LOST = 'theft_lost',
  SALE = 'sale',
  MANUAL_ADJUSTMENT = 'manual_adjustment',
}

export type InventoryAdjustment = {
  productId: string;
  variantId: string;
  quantity: number;
  type: InventoryAdjustmentType;
  notes?: string;
  referenceId?: string;
};

export type AdjustStockReq = {
  productId: string;
  variantId: string;
  quantity: number;
};
