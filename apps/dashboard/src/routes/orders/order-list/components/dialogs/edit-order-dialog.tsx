import { IOrder } from '@shared';

import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { EditOrderForm } from '../forms/edit-order-form';

export function EditOrderDialog({ order, isOpen, onClose }: { order: IOrder; isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onClose={onClose} size="4xl">
      <DialogTitle>Edit Order</DialogTitle>
      <DialogDescription>Fill in the details below to edit the order.</DialogDescription>
      <DialogBody>
        <EditOrderForm order={order} onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
