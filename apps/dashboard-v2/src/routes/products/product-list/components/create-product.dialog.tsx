import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxField } from '@/components/ui/checkbox';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Description, Field, FieldGroup, Label } from '@/components/ui/fieldset';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

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
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Create Product</DialogTitle>
        <DialogDescription>Fill in the details below to create a new product.</DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Product Name</Label>
              <Input name="productName" placeholder="Enter product name" autoFocus />
            </Field>
            <Field>
              <Label>Price</Label>
              <Input name="price" placeholder="$0.00" defaultValue={amount} autoFocus />
            </Field>
            <Field>
              <Label>Category</Label>
              <Select name="category" defaultValue="">
                <option value="" disabled>
                  Select a category&hellip;
                </option>
                <option value="electronics">Electronics</option>
                <option value="apparel">Apparel</option>
                <option value="home_goods">Home Goods</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <CheckboxField>
              <Checkbox name="featured" />
              <Label>Featured Product</Label>
              <Description>Mark this product as featured.</Description>
            </CheckboxField>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
