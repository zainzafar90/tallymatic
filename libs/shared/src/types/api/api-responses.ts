import {
  IAccessAndRefreshTokens,
  ICategory,
  ICustomer,
  IOrganization,
  IProduct,
  IProductVariant,
  IStore,
  ISupplier,
  IUser,
} from '../interfaces/resources';
import { DeleteResponse, ResourceListResponse, ResourceResponse } from './api-operations';

// Auth
export type AuthResponse = ResourceResponse<IAccessAndRefreshTokens>;
export type UserAuthResponse = ResourceResponse<{ tokens: IAccessAndRefreshTokens } & { user: IUser }>;

// Profile
export type UserProfileResponse = ResourceResponse<IUser & { organization: IOrganization }>;

// Users
export type UserResponse = ResourceResponse<IUser>;
export type UserListResponse = ResourceListResponse<IUser>;
export type UserDeleteResponse = DeleteResponse;

// Organization
export type OrganizationResponse = ResourceResponse<IOrganization>;
export type OrganizationListResponse = ResourceListResponse<IOrganization>;
export type OrganizationDeleteResponse = DeleteResponse;

// Store
export type StoreResponse = ResourceResponse<IStore>;
export type StoreListResponse = ResourceListResponse<IStore>;
export type StoreDeleteResponse = DeleteResponse;

// Product
export type ProductResponse = ResourceResponse<IProduct>;
export type ProductListResponse = ResourceListResponse<IProduct & { category: ICategory }>;
export type ProductDeleteResponse = DeleteResponse;

// ProductVariant
export type ProductVariantResponse = ResourceResponse<IProductVariant>;
export type ProductVariantListResponse = ResourceListResponse<IProductVariant>;
export type ProductVariantDeleteResponse = DeleteResponse;

// Category
export type CategoryResponse = ResourceResponse<ICategory>;
export type CategoryListResponse = ResourceListResponse<ICategory>;
export type CategoryDeleteResponse = DeleteResponse;

// Inventory
export type InventoryLevelsResponse = ResourceListResponse<IProductVariant>;
export type LowStockAlertsResponse = ResourceListResponse<IProductVariant>;

// Customers
export type CustomerResponse = ResourceResponse<ICustomer>;
export type CustomerListResponse = ResourceListResponse<ICustomer>;
export type CustomerDeleteResponse = DeleteResponse;

// Supplier
export type SupplierResponse = ResourceResponse<ISupplier>;
export type SupplierListResponse = ResourceListResponse<ISupplier>;
export type SupplierDeleteResponse = DeleteResponse;
