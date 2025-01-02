import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';
import { RouterProvider } from '@/providers/router';
import { ThemeProvider } from '@/providers/theme';

import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './providers/auth/auth-context';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider storageKey="ui-theme" defaultTheme="light">
          <TooltipProvider>
            <RouterProvider />
          </TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
