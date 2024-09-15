/**
 * Temporary types for API payloads until we export them from `@medusajs/types`
 */

import {
  CreateProductDTO,
  CreateProductOptionDTO,
  CreateProductTypeDTO,
  CreateProductVariantDTO,
  CreateStoreDTO,
  CreateUserDTO,
  UpdateProductDTO,
  UpdateProductOptionDTO,
  UpdateProductTypeDTO,
  UpdateProductVariantDTO,
  UpdateStoreDTO,
  UpdateUserDTO,
} from '@medusajs/types';

// Auth
export type EmailPassReq = { email: string; password: string };

// Users
export type UpdateUserReq = UpdateUserDTO;
export type CreateUserReq = CreateUserDTO;

// Product
export type UpdateProductReq = UpdateProductDTO;
export type CreateProductReq = CreateProductDTO;

// Product Type
export type UpdateProductTypeReq = UpdateProductTypeDTO;
export type CreateProductTypeReq = CreateProductTypeDTO;

// Product Option
export type UpdateProductOptionReq = UpdateProductOptionDTO;
export type CreateProductOptionReq = CreateProductOptionDTO;

// Product Variant
export type CreateProductVariantReq = CreateProductVariantDTO;
export type UpdateProductVariantReq = UpdateProductVariantDTO;
export type UpdateProductVariantBatchReq = UpdateProductVariantReq & { id: string }[];

// Stores
export type UpdateStoreReq = UpdateStoreDTO;
export type CreateStoreReq = CreateStoreDTO;
