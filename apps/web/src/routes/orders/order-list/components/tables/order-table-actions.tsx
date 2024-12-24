import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { IOrder } from "@repo/shared";

import { ActionMenu } from "@/components/common/action-menu";
import { useDeleteOrder } from "@/hooks/api/order.hooks";
import { useToggleState } from "@/hooks/use-toggle-state";
import { EditOrderDialog } from "../dialogs/edit-order.dialog";
import { Modal } from "@/components/common/ConfirmDelModal";

const DeleteConfirmationModal = ({
  order,
  onDelete,
  onClose,
}: {
  order: IOrder;
  onDelete: () => void;
  onClose: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleDelete = () => {
    if (inputValue === order.orderNumber) {
      onDelete();
    } else {
      toast.error("Order number does not match. Deletion canceled.");
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <p className="mt-2">
        Please Enter the Order Number to Delete{" "}
        <strong>{order.orderNumber}</strong>
      </p>
      <input
  type="text"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  placeholder={`Type ${order.orderNumber} to confirm`}
  className="mt-6 p-2 bg-[rgba(36,36,39)] border rounded w-full focus:outline-none focus:ring-0 focus:border-blue-500"
/>
      <div className="mt-4 flex justify-between">
      <button
  type="button"
  onClick={onClose}
  className="bg-transparent text-white  hover:bg-[rgba(36,36,39)] py-2 px-4 rounded"
>
  Cancel
</button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={inputValue !== order.orderNumber}
          className="px-4 py-2 bg-red-600 cursor-pointer rounded"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export const OrderActions: React.FC<{ order: IOrder }> = ({ order }) => {
  const { mutateAsync: deleteOrder } = useDeleteOrder(order.id!);
  const [editOpen, showEditModal, closeEditModal] = useToggleState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteOrder();
      toast.success(`Order ${order.orderNumber} deleted successfully.`);
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete order.");
    }
  };

  return (
    <>
      <ActionMenu
        actions={[
          { icon: <Pencil className="w-4 h-4" />, label: "Edit", onClick: showEditModal },
          {
            icon: <Trash className="w-4 h-4" />,
            label: "Delete",
            onClick: () => setDialogOpen(true),
          },
        ]}
      />
      <EditOrderDialog order={order} isOpen={editOpen} onClose={closeEditModal} />
      {dialogOpen && (
        <DeleteConfirmationModal
          order={order}
          onDelete={handleDelete}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
};
