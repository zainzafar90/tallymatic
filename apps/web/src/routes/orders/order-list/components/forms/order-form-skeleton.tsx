import { Skeleton } from '@/components/ui/skeleton';

export const OrderFormSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Customer Section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </div>

      {/* Order Items Section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-1/4" />
      </div>
    </div>
  );
};
