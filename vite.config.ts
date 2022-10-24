import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': '/src',
      '~components': '/src/components',
      '~recoils': '/src/recoils',
      '~functions': '/src/functions',
      '~hooks': '/src/hooks',
      '~styles': '/src/styles',
      '~images': '/src/images',
    },
  },
  css: {
    postcss: {
      plugins: [require('autoprefixer')],
    },
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
});
