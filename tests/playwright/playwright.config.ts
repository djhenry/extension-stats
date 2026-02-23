import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  outputDir: './test-results/',
  workers: 1,
  timeout: 120_000,
  expect: {
    timeout: 30_000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './output/html-results/' }],
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
