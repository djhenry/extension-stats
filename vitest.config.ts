import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@podman-desktop/api': resolve(__dirname, '__mocks__/@podman-desktop/api.ts'),
    },
  },
  test: {
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/media/**',
      'packages/frontend/**',
      'tests/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'packages/shared/src/**/*.ts',
        'packages/backend/src/**/*.ts',
      ],
      exclude: [
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/index.ts',
      ],
    },
  },
});
