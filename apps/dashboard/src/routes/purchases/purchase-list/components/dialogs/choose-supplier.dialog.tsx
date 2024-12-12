import { useState } from 'react';

import { CheckCircleIcon } from '@heroicons/react/16/solid';
import { ISupplier } from '@shared';
import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSuppliers } from '@/hooks/api/supplier.hooks';

interface ChooseSupplierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSupplier: (supplier: ISupplier) => void;
  selectedSupplierId?: string;
}

export function ChooseSupplierDialog({ isOpen, onClose, onSelectSupplier, selectedSupplierId }: ChooseSupplierDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { results: suppliers, isLoading } = useSuppliers(
    { companyName: searchTerm ? searchTerm : undefined },
    { enabled: isOpen, placeholderData: keepPreviousData }
  );

  return (
    <Dialog open={isOpen} onClose={onClose} size="2xl">
      <DialogTitle>Select Supplier</DialogTitle>
      <DialogBody>
        <Input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          autoFocus
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Company Name</TableHeader>
                <TableHeader>Contact Name</TableHeader>
                <TableHeader className="text-center">Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No suppliers found
                  </TableCell>
                </TableRow>
              )}

              {suppliers?.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.companyName}</TableCell>
                  <TableCell>{supplier.contactName}</TableCell>
                  <TableCell className="text-center">
                    {supplier.id === selectedSupplierId && (
                      <div className="flex justify-center w-full">
                        <CheckCircleIcon className="size-8 text-green-400" />
                      </div>
                    )}

                    {supplier.id !== selectedSupplierId && (
                      <Button
                        onClick={() => {
                          if (!supplier.id || supplier.id === selectedSupplierId) return;
                          onSelectSupplier(supplier);
                          onClose();
                        }}
                        disabled={supplier.id === selectedSupplierId}
                        color={supplier.id === selectedSupplierId ? 'green' : 'zinc'}
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
