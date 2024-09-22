import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { CreateCustomerForm } from '../forms/create-customer-form';

export function CreateCustomerDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create Customer</DialogTitle>
      <DialogDescription>Fill in the details below to create a new customer.</DialogDescription>
      <DialogBody>
        <CreateCustomerForm onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
