import path from 'path';

import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react()] as UserConfig['plugins'],
});
