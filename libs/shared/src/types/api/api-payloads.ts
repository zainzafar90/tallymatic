import {
  ICategory,
  ICustomer,
  IOrder,
  IOrganization,
  IProduct,
  IProductVariant,
  IStore,
  ISupplier,
  IUser,
} from '../interfaces/resources';

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

// Product
export type CreateProductReq = Omit<IProduct, 'id'>;
export type UpdateProductReq = Partial<IProduct>;

// ProductVariant
export type CreateProductVariantReq = Omit<IProductVariant, 'id'>;
export type UpdateProductVariantReq = Partial<IProductVariant>;
export type UpdateProductVariantBatchReq = UpdateProductVariantReq[];

// Category
export type CreateCategoryReq = Omit<ICategory, 'id'>;
export type UpdateCategoryReq = Partial<ICategory>;

// Inventory
export type AdjustStockReq = {
  productId: string;
  variantId: string;
  quantity: number;
};

// Customer
export type CreateCustomerReq = Omit<ICustomer, 'id'>;
export type UpdateCustomerReq = Partial<ICustomer>;

// Supplier
export type CreateSupplierReq = Omit<ISupplier, 'id'>;
export type UpdateSupplierReq = Partial<ISupplier>;

// Order
export type CreateOrderReq = Omit<
  IOrder,
  'id' | 'orderNumber' | 'closedAt' | 'createdAt' | 'updatedAt' | 'totalAmount' | 'subtotal'
>;
export type UpdateOrderReq = Partial<IOrder>;
