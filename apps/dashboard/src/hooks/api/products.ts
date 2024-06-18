
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { inventoryItemsQueryKeys } from './inventory';
import { ProductDeleteRes, ProductListRes, ProductOptionDeleteRes, ProductOptionRes, ProductRes, ProductVariantDeleteRes, ProductVariantListRes, ProductVariantRes } from '@/types/api-responses';
import { client } from '@/lib/client';
import { CreateProductOptionReq, CreateProductReq, CreateProductVariantReq, UpdateProductOptionReq, UpdateProductReq, UpdateProductVariantBatchReq } from '@/types/api-payloads';
import { queryClient } from '@/lib/query-client';
import { queryKeysFactory } from '@/lib/query-key-factory';

const PRODUCTS_QUERY_KEY = 'products' as const;
export const productsQueryKeys = queryKeysFactory(PRODUCTS_QUERY_KEY);

const VARIANTS_QUERY_KEY = 'product_variants' as const;
export const variantsQueryKeys = queryKeysFactory(VARIANTS_QUERY_KEY);

const OPTIONS_QUERY_KEY = 'product_options' as const;
export const optionsQueryKeys = queryKeysFactory(OPTIONS_QUERY_KEY);

export const useCreateProductOption = (productId: string, options?: UseMutationOptions<ProductOptionRes, Error, CreateProductOptionReq>) => {
  return useMutation({
    mutationFn: (payload: CreateProductOptionReq) => client.products.createOption(productId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: optionsQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.detail(productId),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateProductOption = (
  productId: string,
  optionId: string,
  options?: UseMutationOptions<ProductOptionRes, Error, UpdateProductOptionReq>
) => {
  return useMutation({
    mutationFn: (payload: UpdateProductOptionReq) => client.products.updateOption(productId, optionId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: optionsQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: optionsQueryKeys.detail(optionId),
      });
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.detail(productId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteProductOption = (
  productId: string,
  optionId: string,
  options?: UseMutationOptions<ProductOptionDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.products.deleteOption(productId, optionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: optionsQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: optionsQueryKeys.detail(optionId),
      });
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.detail(productId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useProductVariant = (
  productId: string,
  variantId: string,
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<{ product_variant: ProductVariantRes }, Error, { product_variant: ProductVariantRes }, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.productVariants.retrieve(productId, variantId, query),
    queryKey: variantsQueryKeys.detail(variantId),
    ...options,
  });

  return { ...data, ...rest };
};

export const useProductVariants = (
  productId: string,
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<{ product_variants: ProductVariantListRes }, Error, { product_variants: ProductVariantListRes }, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.productVariants.list(productId, query),
    queryKey: variantsQueryKeys.list({ productId, ...query }),
    ...options,
  });

  return { ...data, ...rest };
};

export const useCreateProductVariant = (productId: string, options?: UseMutationOptions<ProductVariantRes, Error, CreateProductVariantReq>) => {
  return useMutation({
    mutationFn: (payload: CreateProductVariantReq) => client.products.createVariant(productId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: variantsQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.detail(productId),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateProductVariant = (
  productId: string,
  variantId: string,
  options?: UseMutationOptions<ProductVariantRes, Error, UpdateProductOptionReq>
) => {
  return useMutation({
    mutationFn: (payload: UpdateProductOptionReq) => client.products.updateVariant(productId, variantId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: variantsQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: variantsQueryKeys.detail(variantId),
      });
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.detail(productId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateProductVariantsBatch = (productId: string, options?: UseMutationOptions<ProductVariantListRes, Error, UpdateProductVariantBatchReq>) => {
  return useMutation({
    mutationFn: (payload: UpdateProductVariantBatchReq) => client.products.updateVariantBatch(productId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: variantsQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.detail(productId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteVariant = (productId: string, variantId: string, options?: UseMutationOptions<ProductVariantDeleteRes, Error, void>) => {
  return useMutation({
    mutationFn: () => client.products.deleteVariant(productId, variantId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: variantsQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: variantsQueryKeys.detail(variantId),
      });
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.detail(productId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useProduct = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<ProductRes, Error, ProductRes, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.products.retrieve(id, query),
    queryKey: productsQueryKeys.detail(id),
    ...options,
  });

  return { ...data, ...rest };
};

export const useProducts = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<ProductListRes, Error, ProductListRes, QueryKey>,
    'queryFn' | 'queryKey'
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.products.list(query),
    queryKey: productsQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useCreateProduct = (
  options?: UseMutationOptions<ProductRes, Error, CreateProductReq>
) => {
  return useMutation({
    mutationFn: (payload: CreateProductReq) => client.products.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
      // if `manage_inventory` is true on created variants that will create inventory items automatically
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.lists(),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateProduct = (id: string, options?: UseMutationOptions<ProductRes, Error, UpdateProductReq>) => {
  return useMutation({
    mutationFn: (payload: UpdateProductReq) => client.products.update(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteProduct = (
  id: string,
  options?: UseMutationOptions<ProductDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.products.delete(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
