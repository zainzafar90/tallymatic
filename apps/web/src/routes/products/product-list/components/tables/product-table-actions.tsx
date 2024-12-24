import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IProduct } from '@repo/shared';
import { ActionMenu } from '@/components/common/action-menu';
import { useDeleteProduct } from '@/hooks/api/products.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';
import { EditProductDialog } from '../dialogs/edit-product.dialog';
import { Modal } from '@/components/common/ConfirmDelModal';
import { useState } from 'react';

const DeleteConfirmationModal = ({
  product,
  onDelete,
  onClose,
}: {
  product: IProduct;
  onDelete: () => void;
  onClose: () => void;
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleDelete = () => {
    if (inputValue === product.name) {
      onDelete();
    } else {
      toast.error('Product name does not match. Deletion canceled.');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
    <p className="mt-2 mb-4">
      Please Enter the Product Name to Delete{' '}
      <strong>{product.name}</strong>
    </p>
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={`Type ${product.name} to confirm`}
      className="mt-6 p-2 bg-[rgba(36,36,39)] border rounded w-full focus:outline-none focus:ring-0 focus:border-blue-500"
    />
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="bg-transparent text-white hover:bg-[rgba(36,36,39)] py-2 px-4 rounded"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={inputValue !== product.name}
          className="px-4 py-2 bg-red-600 cursor-pointer rounded"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export const ProductActions = ({ product }: { product: IProduct }) => {
  const { mutateAsync: deleteProduct } = useDeleteProduct(product.id);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduct();
      toast.success(`Product ${product.name} deleted successfully.`);
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete product.');
    }
  };

  const handleEdit = () => {
    showEditModal();
  };

  return (
    <div className="text-right">
      <ActionMenu
        actions={[
          {
            icon: <Pencil className="w-4 h-4" />,
            label: 'Edit',
            onClick: handleEdit,
          },
          {
            icon: <Trash className="w-4 h-4" />,
            label: 'Delete',
            onClick: () => setDialogOpen(true),
          },
        ]}
      />
      <EditProductDialog product={product} isOpen={editOpen} onClose={closeEditModal} />
      {dialogOpen && (
        <DeleteConfirmationModal
          product={product}
          onDelete={handleDelete}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};
