import { CircleAlert } from 'lucide-react';

export const AnalyticsError = ({ error }: { error?: Error }) => {
  return (
    <div className="z-[100] max-w-[400px] rounded-lg border border-border bg-background p-4 shadow-lg shadow-black/5">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <CircleAlert className="mt-0.5 shrink-0 text-red-500" size={16} strokeWidth={2} aria-hidden="true" />
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">We couldn&lsquo;t complete your request!</p>
              <p className="text-sm text-muted-foreground">
                It indicates that an issue has prevented the processing of the request.
              </p>
              {error && <p className="text-sm text-muted-foreground">{error.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
