import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'backend',
      include: ['packages/backend/src/**/*.test.ts', 'packages/shared/src/**/*.test.ts'],
      environment: 'node',
    },
  },
  {
    extends: './packages/frontend/vite.config.ts',
    test: {
      name: 'frontend',
      include: ['packages/frontend/src/**/*.test.ts'],
      environment: 'jsdom',
    },
  },
]);
