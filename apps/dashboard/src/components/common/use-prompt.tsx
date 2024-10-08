import { useCallback, useState } from 'react';

import { Alert, AlertActions, AlertDescription, AlertTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface PromptOptions {
  title: string;
  description: string;
  warning?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export function usePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PromptOptions | null>(null);
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null);

  const prompt = useCallback((options: PromptOptions): Promise<boolean> => {
    setOptions(options);
    setIsOpen(true);
    return new Promise((res) => setResolve(() => res));
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolve?.(true);
  }, [resolve]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolve?.(false);
  }, [resolve]);

  const PromptDialog = useCallback(() => {
    if (!options) return null;

    return (
      <Alert open={isOpen} onClose={handleCancel}>
        <AlertTitle>{options.title}</AlertTitle>
        <AlertDescription>{options.description}</AlertDescription>
        {options.warning && (
          <AlertDescription>
            <span className="text-sm text-red-400">{options.warning}</span>
          </AlertDescription>
        )}
        <AlertActions>
          <Button plain onClick={handleCancel}>
            {options.cancelText || 'Cancel'}
          </Button>
          <Button onClick={handleConfirm} color={options.destructive ? 'red' : 'zinc'}>
            {options.confirmText || 'Confirm'}
          </Button>
        </AlertActions>
      </Alert>
    );
  }, [isOpen, options, handleCancel, handleConfirm]);

  return { prompt, PromptDialog };
}
