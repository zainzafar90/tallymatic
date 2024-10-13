import { ProductVariantListResponse } from '@shared';

import { getRequest } from './common';

async function listVariants(query?: Record<string, any>) {
  return getRequest<ProductVariantListResponse>(`/v1/variants`, query);
}

export const variants = {
  list: listVariants,
};
