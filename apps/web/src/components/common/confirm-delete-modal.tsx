import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="p-6 rounded-lg shadow-md w-auto bg-white dark:bg-[rgba(24,24,27,1)]" 
      >
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold">Confirm Deletion</h3>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
