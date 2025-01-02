import { IOrganization, IStore, IUser } from '../interfaces/resources';

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
