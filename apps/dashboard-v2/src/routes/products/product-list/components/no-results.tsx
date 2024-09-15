import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const NoResults = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex items-center gap-2 py-4">
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm max-h-screen h-96">
        <div className="flex flex-col items-center gap-1 text-center p-1.5">
          <h3 className="text-2xl font-bold tracking-tight">No results found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button className="mt-4" onClick={() => navigate('/products')}>
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
};
