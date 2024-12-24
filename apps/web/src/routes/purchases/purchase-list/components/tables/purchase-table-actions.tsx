import React, { useState } from 'react';

import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { IPurchase } from '@repo/shared';

import { ActionMenu } from '@/components/common/action-menu';
import { useDeletePurchase } from '@/hooks/api/purchase.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { EditPurchaseDialog } from '../dialogs/edit-purchase.dialog';
import { Modal } from '@/components/common/confirm-delete-modal';

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
      <p className="mt-2 mb-4 text-gray-800 dark:text-gray-300">
        Please enter the purchase number to delete{' '}
        <strong className="font-semibold">{purchase.purchaseNumber}</strong>
      </p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={`Type ${purchase.purchaseNumber} to confirm`}
        className="mt-6 p-2 bg-gray-100 dark:bg-[rgba(36,36,39)] text-gray-800 dark:text-gray-200 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 dark:bg-transparent text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-[rgba(36,36,39)] rounded"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={inputValue !== purchase.purchaseNumber}
          className={`px-4 py-2 rounded ${
            inputValue === purchase.purchaseNumber
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-red-600 text-white cursor-not-allowed'
          }`}
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
    <div className="text-right">
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
    </div>
  );
};
