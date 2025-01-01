import React, { useCallback, useState, memo } from 'react';
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


const DeleteDialogContent = memo(({
  options,
  onConfirm,
  onCancel,
}: {
  options: DeleteDialogOptions;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationText(e.target.value);
    setShowError(false);
  };

  const handleConfirmClick = () => {
    if (
      options.requireDeleteConfirm &&
      confirmationText !== options.deleteConfirmationText
    ) {
      setShowError(true);
      return;
    }
    onConfirm();
  };

  return (
    <>
      <AlertTitle>{options.title}</AlertTitle>
      <AlertDescription>{options.description}</AlertDescription>
      {options.requireDeleteConfirm && (
        <div className="mt-4">
          <AlertDescription className="mb-2">
            Type <span className="font-medium">{options.deleteConfirmationText}</span> to confirm
          </AlertDescription>
          <Input
            value={confirmationText}
            onChange={handleInputChange}
            placeholder="Type confirmation text"
            className="w-full"
          />
        </div>
      )}
      {showError && (
        <AlertDescription className="mt-2 text-sm text-red-400">
          Please enter the correct confirmation text.
        </AlertDescription>
      )}
      <AlertActions>
        <Button plain onClick={onCancel}>
          {options.cancelText || 'Cancel'}
        </Button>
        <Button
          data-confirm-button
          onClick={handleConfirmClick}
          color={options.destructive ? 'rose' : 'zinc'}
        >
          {options.confirmText || 'Confirm'}
        </Button>
      </AlertActions>
    </>
  );
});

DeleteDialogContent.displayName = 'DeleteDialogContent';

export function useDeleteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DeleteDialogOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const openDeleteDialog = useCallback((dialogOptions: DeleteDialogOptions): Promise<boolean> => {
    setOptions(dialogOptions);
    setIsOpen(true);
    return new Promise((resolve) => setResolvePromise(() => resolve));
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolvePromise?.(true);
    setOptions(null);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolvePromise?.(false);
    setOptions(null);
  }, [resolvePromise]);

  const DeleteDialog = useCallback(() => {
    if (!options) return null;

    return (
      <Alert open={isOpen} onClose={handleCancel}>
        <DeleteDialogContent
          options={options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </Alert>
    );
  }, [isOpen, options, handleCancel, handleConfirm]);

  return { openDeleteDialog, DeleteDialog };
}