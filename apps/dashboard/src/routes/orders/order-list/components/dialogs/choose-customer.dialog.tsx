import React, { useState } from 'react';

import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomers } from '@/hooks/api/customer.hooks';

interface ChooseCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customerId: string) => void;
}

export function ChooseCustomerDialog({ isOpen, onClose, onSelectCustomer }: ChooseCustomerDialogProps) {
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
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        if (!customer.id) return;

                        onSelectCustomer(customer.id);
                        onClose();
                      }}
                    >
                      Select
                    </Button>
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
