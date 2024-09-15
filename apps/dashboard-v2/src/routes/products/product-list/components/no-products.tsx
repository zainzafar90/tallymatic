import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

export const NoProducts = () => {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <Heading>Products</Heading>
      </div>
      <div className="w-full flex items-center gap-2 py-4">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm max-h-screen h-96">
          <div className="flex flex-col items-center gap-1 text-center p-1.5">
            <h3 className="text-2xl font-bold tracking-tight">You have no products</h3>
            <p className="text-sm text-muted-foreground">You can start selling as soon as you add a product.</p>
            <Button className="mt-4">Add Product</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
