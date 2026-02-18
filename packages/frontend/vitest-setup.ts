// Setup file for vitest to configure Svelte testing environment
import { beforeAll } from 'vitest';

beforeAll(() => {
  // Ensure window is available in jsdom environment
  if (typeof window !== 'undefined') {
    // Configure for Svelte 5 client-side rendering in tests
    (window as any).IS_BROWSER = true;
  }
});
