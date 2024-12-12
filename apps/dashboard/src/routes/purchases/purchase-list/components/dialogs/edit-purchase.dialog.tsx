import { IPurchase } from '@shared';

import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { EditPurchaseForm } from '../forms/edit-purchase-form';

export function EditPurchaseDialog({
  purchase,
  isOpen,
  onClose,
}: {
  purchase: IPurchase;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} size="4xl">
      <DialogTitle>Edit Purchase</DialogTitle>
      <DialogDescription>Fill in the details below to edit the purchase.</DialogDescription>
      <DialogBody>
        <EditPurchaseForm purchase={purchase} onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
