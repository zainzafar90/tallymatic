import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';
import { RouterProvider } from '@/providers/router';
import { ThemeProvider } from '@/providers/theme';

import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="ui-theme" defaultTheme="light">
        <TooltipProvider>
          <RouterProvider />
        </TooltipProvider>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
