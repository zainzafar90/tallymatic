import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { CreateProductForm } from './create-product-form';

export function CreateProductDialog({
  amount,
  ...props
}: { amount: string } & React.ComponentPropsWithoutRef<typeof Button>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button className="-my-0.5" color="blue" onClick={() => setIsOpen(true)}>
        {props.children}
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen} size="4xl">
        <DialogTitle>Create Product</DialogTitle>
        <DialogDescription>Fill in the details below to create a new product.</DialogDescription>
        <DialogBody>
          <CreateProductForm onClose={() => setIsOpen(false)} />
        </DialogBody>
      </Dialog>
    </>
  );
}
