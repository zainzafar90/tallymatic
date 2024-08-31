import { Heading } from '@/components/ui/heading';

import { CreateProductDialog } from './components/create-product.dialog';
import { ProductListTable } from './components/product-list-table';

export const ProductList = () => {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <Heading>Products</Heading>
        <CreateProductDialog outline amount="80">
          Create Product
        </CreateProductDialog>
      </div>
      <ProductListTable />
    </div>
  );
};
