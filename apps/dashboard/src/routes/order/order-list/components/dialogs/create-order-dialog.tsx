import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { CreateOrderForm } from '../forms/create-order-form';

export function CreateOrderDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create Order</DialogTitle>
      <DialogDescription>Fill in the details below to create a new order.</DialogDescription>
      <DialogBody>
        <CreateOrderForm onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
