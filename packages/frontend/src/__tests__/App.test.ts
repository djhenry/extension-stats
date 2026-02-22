// packages/frontend/src/__tests__/App.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import App from '../App.svelte';
import { statsSnapshot } from '../stores/stats-store';

describe('App', () => {
  beforeEach(() => {
    cleanup();
    statsSnapshot.set(undefined);
  });

  it('should mount and render a main element', () => {
    const { container } = render(App);
    const main = container.querySelector('main');
    expect(main).toBeTruthy();
  });

  it('should render Dashboard within main', () => {
    render(App);
    // Dashboard shows "Loading stats..." when no data
    expect(screen.getByText('Loading stats...')).toBeTruthy();
  });

  it('should render dashboard content when stats are available', () => {
    statsSnapshot.set({
      timestamp: Date.now(),
      containers: [],
      host: {
        cpuUsagePercent: 15.0,
        cpuCount: 4,
        memoryTotal: 8589934592,
        memoryUsed: 4294967296,
        memoryFree: 4294967296,
        memoryUsagePercent: 50.0,
        uptime: 3600,
        platform: 'linux',
        hostname: 'testhost',
      },
    });

    render(App);
    expect(screen.getByText('Host System Overview')).toBeTruthy();
    expect(screen.getByText('Container Stats')).toBeTruthy();
  });
});
