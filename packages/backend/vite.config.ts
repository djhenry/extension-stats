import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/extension.ts'),
      formats: ['cjs'],
      fileName: () => 'extension.js',
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['@podman-desktop/api', /^node:.*/],
    },
    sourcemap: true,
  },
});
