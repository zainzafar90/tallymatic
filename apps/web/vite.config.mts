import path from 'path';

import { defineConfig, UserConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  plugins: [
    react(),
    sentryVitePlugin({
      org: 'tallymatic',
      project: 'javascript-react',
    }),
  ] as UserConfig['plugins'],

  build: {
    sourcemap: true,
  },
});
