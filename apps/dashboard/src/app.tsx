import { Toaster } from '@medusajs/ui';
import { QueryClientProvider } from '@tanstack/react-query';

import { RouterProvider } from './providers/router-provider';
import { ThemeProvider } from './providers/theme-provider';

import { queryClient } from './lib/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
