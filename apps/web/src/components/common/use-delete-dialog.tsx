import React, { useCallback, useRef, useState } from 'react';

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DeleteDialogOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  requireDeleteConfirm?: boolean;
  deleteConfirmationText?: string;
}

export function useDeleteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DeleteDialogOptions | null>(null);
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null);
  const deleteConfirmationRef = useRef<HTMLInputElement>(null);
  const [valid, setValid] = useState(true);

  const openDeleteDialog = useCallback(
    (dialogOptions: DeleteDialogOptions): Promise<boolean> => {
      setOptions(dialogOptions);
      setIsOpen(true);
      return new Promise((res) => setResolve(() => res));
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (
      options?.requireDeleteConfirm &&
      deleteConfirmationRef.current?.value !== options.deleteConfirmationText
    ) {
      setValid(false);
      return;
    }
    setIsOpen(false);
    resolve?.(true);
    setValid(true);
  }, [resolve, options]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolve?.(false);
    setValid(true);
  }, [resolve]);

  const DeleteDialog = useCallback(() => {
    if (!options) return null;

    return (
      <Alert open={isOpen} onClose={handleCancel}>
        <AlertTitle>{options.title}</AlertTitle>
        <AlertDescription>{options.description}</AlertDescription>
        {options.requireDeleteConfirm && (
          <div className="mt-4">
            <AlertDescription className="mb-2">
              Type <span className="font-medium">{options.deleteConfirmationText}</span> to confirm
            </AlertDescription>
            <Input
              ref={deleteConfirmationRef}
              onChange={() => setValid(true)} // Reset error state on input change
              placeholder="Type confirmation text"
              className="w-full"
            />
          </div>
        )}
        {!valid && (
          <AlertDescription className="mt-2 text-sm text-red-400">
            Please enter the correct confirmation text.
          </AlertDescription>
        )}
        <AlertActions>
          <Button plain onClick={handleCancel}>
            {options.cancelText || 'Cancel'}
          </Button>
          <Button
            data-confirm-button
            onClick={handleConfirm}
            color={options.destructive ? 'rose' : 'zinc'}
          >
            {options.confirmText || 'Confirm'}
          </Button>
        </AlertActions>
      </Alert>
    );
  }, [isOpen, options, handleCancel, handleConfirm, valid]);

  return { openDeleteDialog, DeleteDialog };
}
