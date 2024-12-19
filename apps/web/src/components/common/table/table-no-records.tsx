import React from 'react';

interface NoRecordsProps {
  title?: string;
  description?: string;
}

export const NoRecords: React.FC<NoRecordsProps> = ({
  title = 'No records found',
  description = 'There are no items to display at the moment.',
}) => {
  return (
    <div className="w-full flex items-center gap-2 py-4">
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm max-h-screen h-96">
        <div className="flex flex-col items-center gap-1 text-center p-1.5">
          <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
