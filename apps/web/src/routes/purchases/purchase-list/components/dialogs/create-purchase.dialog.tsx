import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { CreatePurchaseForm } from '../forms/create-purchase-form';

export function CreatePurchaseDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onClose={onClose} size="6xl">
      <DialogTitle>Create Purchase</DialogTitle>
      <DialogDescription>Fill in the details below to create a new purchase.</DialogDescription>
      <DialogBody>
        <CreatePurchaseForm onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
