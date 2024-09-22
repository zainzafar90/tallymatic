import { ICustomer } from '@shared';

import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { EditCustomerForm } from '../forms/edit-customer-form';

export function EditCustomerDialog({
  customer,
  isOpen,
  onClose,
}: {
  customer: ICustomer;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Customer</DialogTitle>
      <DialogDescription>Fill in the details below to edit the customer.</DialogDescription>
      <DialogBody>
        <EditCustomerForm customer={customer} onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
