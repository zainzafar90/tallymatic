import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';
import { RouterProvider } from '@/providers/router';
import { ThemeProvider } from '@/providers/theme';

import { Toaster } from './components/ui/sonner';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="ui-theme" defaultTheme="system">
        <RouterProvider />
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
