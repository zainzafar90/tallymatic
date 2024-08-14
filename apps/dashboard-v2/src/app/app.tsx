import { Toaster } from '@medusajs/ui';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';
import { RouterProvider } from '@/providers/router';
import { ThemeProvider } from '@/providers/theme/theme-provider';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="ui-theme" defaultTheme="system">
        <RouterProvider />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
