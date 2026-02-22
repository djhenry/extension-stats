// packages/frontend/src/__tests__/Dashboard.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import Dashboard from '../Dashboard.svelte';
import { statsSnapshot } from '../stores/stats-store';
import type { StatsSnapshot } from '@extension-stats/shared';

function createMockSnapshot(overrides?: Partial<StatsSnapshot>): StatsSnapshot {
  return {
    timestamp: Date.now(),
    containers: [],
    host: {
      cpuUsagePercent: 25.5,
      cpuCount: 4,
      memoryTotal: 8589934592,
      memoryUsed: 4294967296,
      memoryFree: 4294967296,
      memoryUsagePercent: 50.0,
      uptime: 86400,
      platform: 'linux',
      hostname: 'test-host',
    },
    ...overrides,
  };
}

describe('Dashboard', () => {
  beforeEach(() => {
    cleanup();
    statsSnapshot.set(undefined);
  });

  it('should show "Loading stats..." when no data is available', () => {
    render(Dashboard);
    expect(screen.getByText('Loading stats...')).toBeTruthy();
  });

  it('should not show HostOverview when no data is available', () => {
    render(Dashboard);
    expect(screen.queryByText('Host System Overview')).toBeNull();
  });

  it('should not show ContainerTable when no data is available', () => {
    render(Dashboard);
    expect(screen.queryByText('Container Stats')).toBeNull();
  });

  it('should render HostOverview when stats snapshot arrives', async () => {
    const snapshot = createMockSnapshot();
    statsSnapshot.set(snapshot);

    render(Dashboard);
    expect(screen.getByText('Host System Overview')).toBeTruthy();
  });

  it('should render ContainerTable when stats snapshot arrives', async () => {
    const snapshot = createMockSnapshot();
    statsSnapshot.set(snapshot);

    render(Dashboard);
    expect(screen.getByText('Container Stats')).toBeTruthy();
  });

  it('should display host CPU usage', async () => {
    const snapshot = createMockSnapshot({
      host: {
        cpuUsagePercent: 72.3,
        cpuCount: 8,
        memoryTotal: 17179869184,
        memoryUsed: 8589934592,
        memoryFree: 8589934592,
        memoryUsagePercent: 50,
        uptime: 172800,
        platform: 'linux',
        hostname: 'test',
      },
    });
    statsSnapshot.set(snapshot);

    render(Dashboard);
    expect(screen.getByText(/72\.3%/)).toBeTruthy();
  });

  it('should display containers when present in snapshot', async () => {
    const snapshot = createMockSnapshot({
      containers: [
        {
          id: 'abc123',
          name: 'my-nginx',
          image: 'nginx:latest',
          state: 'running',
          engineId: 'podman',
          cpuUsagePercent: 5.2,
          memoryUsed: 134217728,
          memoryLimit: 268435456,
          memoryUsagePercent: 50,
          networkRx: 1024,
          networkTx: 2048,
          blockRead: 4096,
          blockWrite: 8192,
          pids: 10,
          timestamp: Date.now(),
        },
      ],
    });
    statsSnapshot.set(snapshot);

    render(Dashboard);
    expect(screen.getByText('my-nginx')).toBeTruthy();
    expect(screen.getByText(/5\.2%/)).toBeTruthy();
  });

  it('should show "No running containers" when containers array is empty', async () => {
    const snapshot = createMockSnapshot({ containers: [] });
    statsSnapshot.set(snapshot);

    render(Dashboard);
    expect(screen.getByText(/no running containers/i)).toBeTruthy();
  });

  it('should hide Loading text when data arrives', async () => {
    const snapshot = createMockSnapshot();
    statsSnapshot.set(snapshot);

    render(Dashboard);
    expect(screen.queryByText('Loading stats...')).toBeNull();
  });
});
