import { IOrganization, IPurchase, IPurchaseItem, IStore, IUser } from '../interfaces/resources';

// Auth
export type EmailPassReq = { email: string; password: string };

// Users
export type CreateUserReq = Omit<IUser, 'id' | 'isEmailVerified'>;
export type UpdateUserReq = Partial<IUser>;
export type RegisterUserReq = Omit<IUser, 'id' | 'role' | 'isEmailVerified'>;

// Organization
export type CreateOrganizationReq = Omit<IOrganization, 'id'>;
export type UpdateOrganizationReq = Partial<IOrganization>;

// Store
export type CreateStoreReq = Omit<IStore, 'id'>;
export type UpdateStoreReq = Partial<IStore>;

// Inventory
export type AdjustStockReq = {
  productId: string;
  variantId: string;
  quantity: number;
};

// Order
// export type CreateOrderReq = Omit<
//   IOrder,
//   'id' | 'orderNumber' | 'closedAt' | 'createdAt' | 'updatedAt' | 'totalAmount' | 'subtotal'
// >;
// export type UpdateOrderReq = Partial<IOrder>;

// Purchase
export type CreatePurchaseReq = Omit<IPurchase, 'id' | 'purchaseNumber'> & {
  items: Omit<IPurchaseItem, 'id' | 'purchaseId'>[];
};
export type UpdatePurchaseReq = Partial<IPurchase> & {
  items?: Omit<IPurchaseItem, 'id' | 'purchaseId'>[];
};
