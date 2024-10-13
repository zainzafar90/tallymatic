import { useState } from 'react';

import { CheckCircleIcon } from '@heroicons/react/16/solid';
import { IProductVariant } from '@shared';
import { keepPreviousData } from '@tanstack/react-query';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useVariants } from '@/hooks/api/variant.hooks';

interface ChooseProductVariantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVariant: (variant: IProductVariant) => void;
  selectedVariantId?: string;
}

export function ChooseProductVariantDialog({
  isOpen,
  onClose,
  onSelectVariant,
  selectedVariantId,
}: ChooseProductVariantDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { results: variants, isLoading } = useVariants(
    { productName: searchTerm ? searchTerm : undefined },
    { enabled: isOpen, placeholderData: keepPreviousData }
  );

  return (
    <Dialog open={isOpen} onClose={onClose} size="2xl">
      <DialogTitle>Select Product Variant</DialogTitle>
      <DialogBody>
        <Input
          type="text"
          placeholder="Search variants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          autoFocus
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bleed>
            <TableHead>
              <TableRow>
                <TableHeader>Product</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader className="text-center">Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {variants?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No variants found
                  </TableCell>
                </TableRow>
              )}

              {variants?.map((variant) => (
                <TableRow key={variant.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex gap-4">
                      <Avatar className="size-12 bg-blue-600 text-white" initials={variant.product?.name?.charAt(0)} />
                      <div className="flex flex-col">
                        <div className="font-medium">{variant.product?.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">{variant.name}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{variant.price}</TableCell>
                  <TableCell className="text-center">
                    {variant.id === selectedVariantId ? (
                      <div className="flex justify-center w-full">
                        <CheckCircleIcon className="size-8 text-green-400" />
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          onSelectVariant(variant);
                          onClose();
                        }}
                        color="zinc"
                      >
                        Select
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogBody>
    </Dialog>
  );
}
