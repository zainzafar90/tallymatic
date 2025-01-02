import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICategory, Status } from '@repo/shared';

import { Button } from '@/components/ui/button';
import { DialogActions } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

import { CategoryFormData, CreateCategorySchema, UpdateCategorySchema } from './category.schema';

interface CategoryFormProps {
  category?: ICategory;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export const CategoryForm = ({ category, isPending, onSubmit, onClose }: CategoryFormProps) => {
  const form = useForm({
    resolver: zodResolver(category ? UpdateCategorySchema : CreateCategorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      ...(category && { status: category.status }),
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    onClose();
    form.reset();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter category name" autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter category description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {category && (
          <FormField
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select {...field}>
                  <option value={Status.ACTIVE}>Active</option>
                  <option value={Status.INACTIVE}>Inactive</option>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <DialogActions>
          <Button plain onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="blue" disabled={isPending}>
            {category ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Form>
  );
};
