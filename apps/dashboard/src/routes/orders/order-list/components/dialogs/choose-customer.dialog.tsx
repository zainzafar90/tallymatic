import { useState } from 'react';

import { CheckCircleIcon } from '@heroicons/react/16/solid';
import { ICustomer } from '@shared';
import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomers } from '@/hooks/api/customer.hooks';

interface ChooseCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: ICustomer) => void;
  selectedCustomerId?: string;
}

export function ChooseCustomerDialog({ isOpen, onClose, onSelectCustomer, selectedCustomerId }: ChooseCustomerDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { results: customers, isLoading } = useCustomers(
    { name: searchTerm ? searchTerm : undefined },
    { enabled: isOpen, placeholderData: keepPreviousData }
  );

  return (
    <Dialog open={isOpen} onClose={onClose} size="2xl">
      <DialogTitle>Select Customer</DialogTitle>
      <DialogBody>
        <Input
          type="text"
          placeholder="Search customers..."
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
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader className="text-center">Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No customers found
                  </TableCell>
                </TableRow>
              )}

              {customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell className="text-center">
                    {customer.id === selectedCustomerId && (
                      <div className="flex justify-center w-full">
                        <CheckCircleIcon className="size-8 text-green-400" />
                      </div>
                    )}

                    {customer.id !== selectedCustomerId && (
                      <Button
                        onClick={() => {
                          if (!customer.id || customer.id === selectedCustomerId) return;

                          onSelectCustomer(customer);
                          onClose();
                        }}
                        disabled={customer.id === selectedCustomerId}
                        color={customer.id === selectedCustomerId ? 'green' : 'zinc'}
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
