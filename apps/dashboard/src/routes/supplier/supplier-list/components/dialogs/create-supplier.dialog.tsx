import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { CreateSupplierForm } from '../forms/create-supplier-form';

export function CreateSupplierDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create Supplier</DialogTitle>
      <DialogDescription>Fill in the details below to create a new supplier.</DialogDescription>
      <DialogBody>
        <CreateSupplierForm onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
