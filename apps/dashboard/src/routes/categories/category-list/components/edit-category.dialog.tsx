import { ICategory } from '@shared';

import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { EditCategoryForm } from './edit-category-form';

export function EditCategoryDialog({
  category,
  isOpen,
  onClose,
}: {
  category: ICategory;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Category</DialogTitle>
      <DialogDescription>Update the details of the category.</DialogDescription>
      <DialogBody>
        <EditCategoryForm category={category} onClose={onClose} />
      </DialogBody>
    </Dialog>
  );
}
