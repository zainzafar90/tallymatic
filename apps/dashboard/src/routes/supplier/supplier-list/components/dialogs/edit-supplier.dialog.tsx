import { ISupplier } from '@shared';

import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { EditSupplierForm } from '../forms/edit-supplier-form';

export function EditSupplierDialog({
  supplier,
  isOpen,
  onClose,
}: {
  supplier: ISupplier;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Supplier</DialogTitle>
      <DialogDescription>Fill in the details below to edit the supplier.</DialogDescription>
      <DialogBody>
        <EditSupplierForm supplier={supplier} onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
