import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { CreateProductForm } from './create-product-form';

export function CreateProductDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onClose={onClose} size="4xl">
      <DialogTitle>Create Product</DialogTitle>
      <DialogDescription>Fill in the details below to create a new product.</DialogDescription>
      <DialogBody>
        <CreateProductForm onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
