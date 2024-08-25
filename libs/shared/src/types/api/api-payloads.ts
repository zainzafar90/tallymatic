import {
  ICategory,
  IOrganization,
  IProduct,
  IProductCategory,
  IProductOption,
  IProductVariant,
  IStore,
  IUser,
} from '../interfaces/resources';

// Auth
export type EmailPassReq = {
  email: string;
  password: string;
};

// Users
export type CreateUserReq = Omit<IUser, 'id' | 'isEmailVerified'>;
export type UpdateUserReq = Partial<Omit<IUser, 'id'>>;
export type RegisterUserReq = Omit<IUser, 'id' | 'role' | 'isEmailVerified'>;

// Organization
export type CreateOrganizationReq = Omit<IOrganization, 'id'>;
export type UpdateOrganizationReq = Partial<Omit<IOrganization, 'id'>>;

// Store
export type CreateStoreReq = Omit<IStore, 'id'>;
export type UpdateStoreReq = Partial<Omit<IStore, 'id'>>;

// Product
export type CreateProductReq = Omit<IProduct, 'id'>;
export type UpdateProductReq = Partial<Omit<IProduct, 'id'>>;

// Category
export type CreateCategoryReq = Omit<ICategory, 'id'>;
export type UpdateCategoryReq = Partial<Omit<ICategory, 'id'>>;

// ProductCategory
export type CreateProductCategoryReq = Omit<IProductCategory, 'id'>;
export type UpdateProductCategoryReq = Partial<Omit<IProductCategory, 'id'>>;

// ProductOption
export type CreateProductOptionReq = Omit<IProductOption, 'id'>;
export type UpdateProductOptionReq = Partial<Omit<IProductOption, 'id'>>;

// ProductVariant
export type CreateProductVariantReq = Omit<IProductVariant, 'id'>;
export type UpdateProductVariantReq = Partial<Omit<IProductVariant, 'id'>>;
export type UpdateProductVariantBatchReq = (UpdateProductVariantReq & { id: string })[];
