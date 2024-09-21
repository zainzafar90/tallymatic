import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { CreateCategoryForm } from '../forms/create-category-form';

export function CreateCategoryDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onClose={onClose} size="2xl">
      <DialogTitle>Create Category</DialogTitle>
      <DialogDescription>Fill in the details below to create a new category.</DialogDescription>
      <DialogBody>
        <CreateCategoryForm onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
