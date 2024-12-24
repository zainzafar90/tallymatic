import React, { useState } from 'react';

import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IPurchase } from '@repo/shared';

import { ActionMenu } from '@/components/common/action-menu';
import { useDeletePurchase } from '@/hooks/api/purchase.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditPurchaseDialog } from '../dialogs/edit-purchase.dialog';
import { Modal } from '@/components/common/ConfirmDelModal';

const DeleteConfirmationModal = ({
  purchase,
  onDelete,
  onClose,
}: {
  purchase: IPurchase;
  onDelete: () => void;
  onClose: () => void;
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleDelete = () => {
    if (inputValue === purchase.purchaseNumber) {
      onDelete();
    } else {
      toast.error('Purchase number does not match. Deletion canceled.');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <p className="mt-2">
        Please Enter the Purchase Number to Delete{' '}
        <strong>{purchase.purchaseNumber}</strong>
      </p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={`Type ${purchase.purchaseNumber} to confirm`}
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
          disabled={inputValue !== purchase.purchaseNumber}
          className="px-4 py-2 bg-red-600 cursor-pointer rounded"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export const PurchaseActions: React.FC<{ purchase: IPurchase }> = ({ purchase }) => {
  const { mutateAsync: deletePurchase } = useDeletePurchase(purchase.id!);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deletePurchase();
      toast.success(`Purchase ${purchase.purchaseNumber} deleted successfully.`);
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete purchase.');
    }
  };

  return (
    <>
      <ActionMenu
        actions={[
          { icon: <Pencil className="w-4 h-4" />, label: 'Edit', onClick: showEditModal },
          {
            icon: <Trash className="w-4 h-4" />,
            label: 'Delete',
            onClick: () => setDialogOpen(true),
          },
        ]}
      />
      <EditPurchaseDialog purchase={purchase} isOpen={editOpen} onClose={closeEditModal} />
      {dialogOpen && (
        <DeleteConfirmationModal
          purchase={purchase}
          onDelete={handleDelete}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
};
