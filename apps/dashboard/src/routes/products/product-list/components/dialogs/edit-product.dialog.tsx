import { IProduct } from '@shared';

import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { EditProductForm } from '../forms/edit-product-form';

export function EditProductDialog({
  product,
  isOpen,
  onClose,
}: {
  product: IProduct;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} size="4xl">
      <DialogTitle>Edit Product</DialogTitle>
      <DialogDescription>Fill in the details below to edit the product.</DialogDescription>
      <DialogBody>
        <EditProductForm product={product} onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
