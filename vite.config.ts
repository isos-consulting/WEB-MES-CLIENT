import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
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
      'antd/lib': 'antd/es',
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
  build: {
    outDir: 'build',
  },
});
