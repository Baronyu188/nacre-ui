import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-lib',
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: 'src/ui/index.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'nacre',
    },
    rollupOptions: {
      external: ['@internationalized/date', 'motion/react', 'react', 'react-dom', 'react/jsx-runtime', 'react-aria-components'],
    },
  },
});
