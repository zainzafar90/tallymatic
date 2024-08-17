import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

import { ProductListTable } from './components/product-list-table';

export const ProductList = () => {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <Heading>Products</Heading>
        <Button className="-my-0.5" color="blue">
          Create Product
        </Button>
      </div>
      <ProductListTable />
    </div>
  );
};
