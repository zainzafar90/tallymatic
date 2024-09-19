import { ICategory, IOrganization, IProduct, IProductVariant, IStore, IUser } from '../interfaces/resources';

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

// Category
export type CreateCategoryReq = Omit<ICategory, 'id'>;
export type UpdateCategoryReq = Partial<ICategory>;

// ProductVariant
export type CreateProductVariantReq = Omit<IProductVariant, 'id'>;
export type UpdateProductVariantReq = Partial<IProductVariant>;
export type UpdateProductVariantBatchReq = UpdateProductVariantReq[];

// Inventory
export type AdjustStockReq = {
  productId: string;
  variantId: string;
  quantity: number;
};
