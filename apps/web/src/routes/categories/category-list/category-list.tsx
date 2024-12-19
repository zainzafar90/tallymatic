import { keepPreviousData } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useCategories } from '@/hooks/api/category.hooks';
import { useToggleState } from '@/hooks/use-toggle-state';

import { CreateCategoryDialog } from './components/dialogs/create-category.dialog';
import { CategoryListTable } from './components/tables/category-list-table';
import { useCategoryTableQuery } from './hooks/use-category-table-query';

export const CategoryList = () => {
  const { searchParams, raw } = useCategoryTableQuery({});
  const [createOpen, showCreateModal, closeCreateModal] = useToggleState();

  const {
    results = [],
    isLoading,
    isError,
    error,
    count = 0,
  } = useCategories(searchParams, {
    placeholderData: keepPreviousData,
  });

  const hasFiltersEnabled = Object.values(raw).some((value) => Boolean(value));

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Categories</Heading>
        <Button color="blue" onClick={() => showCreateModal()}>
          Create Category
        </Button>
      </div>

      <CategoryListTable
        count={count}
        error={error}
        results={results}
        isError={isError}
        isLoading={isLoading}
        hasResults={hasFiltersEnabled}
      />

      <CreateCategoryDialog isOpen={createOpen} onClose={closeCreateModal} />
    </>
  );
};
