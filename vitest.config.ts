import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
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
