// packages/frontend/src/__tests__/webview-integration.test.ts
//
// Integration test that simulates the full webview message flow:
// Backend postMessage → window message event → stats store → Svelte re-render
//
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/svelte';
import { get } from 'svelte/store';
import App from '../App.svelte';
import { statsSnapshot, initStatsListener } from '../stores/stats-store';
import type { StatsSnapshot, RpcMessage } from '@extension-stats/shared';

function createMockSnapshot(): StatsSnapshot {
  return {
    timestamp: Date.now(),
    containers: [
      {
        id: 'container-1',
        name: 'test-nginx',
        image: 'nginx:latest',
        state: 'running',
        engineId: 'podman',
        cpuUsagePercent: 12.5,
        memoryUsed: 268435456,
        memoryLimit: 536870912,
        memoryUsagePercent: 50.0,
        networkRx: 102400,
        networkTx: 51200,
        blockRead: 2048,
        blockWrite: 4096,
        pids: 8,
        timestamp: Date.now(),
      },
      {
        id: 'container-2',
        name: 'test-redis',
        image: 'redis:7',
        state: 'running',
        engineId: 'podman',
        cpuUsagePercent: 3.1,
        memoryUsed: 67108864,
        memoryLimit: 134217728,
        memoryUsagePercent: 50.0,
        networkRx: 10240,
        networkTx: 5120,
        blockRead: 1024,
        blockWrite: 512,
        pids: 4,
        timestamp: Date.now(),
      },
    ],
    host: {
      cpuUsagePercent: 35.7,
      cpuCount: 8,
      memoryTotal: 17179869184,
      memoryUsed: 10737418240,
      memoryFree: 6442450944,
      memoryUsagePercent: 62.5,
      uptime: 259200,
      platform: 'linux',
      hostname: 'dev-workstation',
    },
  };
}

function simulateBackendMessage(snapshot: StatsSnapshot): void {
  const message: RpcMessage = {
    type: 'stats-update',
    payload: snapshot,
  };
  window.dispatchEvent(
    new MessageEvent('message', { data: message }),
  );
}

describe('Webview Integration', () => {
  beforeEach(() => {
    cleanup();
    statsSnapshot.set(undefined);
  });

  it('should initialize with Loading state', () => {
    render(App);
    expect(screen.getByText('Loading stats...')).toBeTruthy();
    expect(get(statsSnapshot)).toBeUndefined();
  });

  it('should update store when backend sends stats-update message', () => {
    initStatsListener();
    const snapshot = createMockSnapshot();
    simulateBackendMessage(snapshot);
    expect(get(statsSnapshot)).toEqual(snapshot);
  });

  it('should render host stats after receiving backend message', async () => {
    initStatsListener();
    render(App);

    // Initially shows loading
    expect(screen.getByText('Loading stats...')).toBeTruthy();

    // Simulate backend message
    const snapshot = createMockSnapshot();
    simulateBackendMessage(snapshot);

    // Should now show host stats
    await waitFor(() => {
      expect(screen.getByText('Host System Overview')).toBeTruthy();
    });
    expect(screen.getByText(/35\.7%/)).toBeTruthy();
    expect(screen.getByText(/8 cores/)).toBeTruthy();
  });

  it('should render container rows after receiving backend message', async () => {
    initStatsListener();
    render(App);

    const snapshot = createMockSnapshot();
    simulateBackendMessage(snapshot);

    await waitFor(() => {
      expect(screen.getByText('test-nginx')).toBeTruthy();
    });
    expect(screen.getByText('test-redis')).toBeTruthy();
  });

  it('should display multiple containers with correct stats', async () => {
    initStatsListener();
    render(App);

    const snapshot = createMockSnapshot();
    simulateBackendMessage(snapshot);

    await waitFor(() => {
      expect(screen.getByText('test-nginx')).toBeTruthy();
      expect(screen.getByText('test-redis')).toBeTruthy();
      // CPU percentages
      expect(screen.getByText('12.5%')).toBeTruthy();
      expect(screen.getByText('3.1%')).toBeTruthy();
    });
  });

  it('should update display when new stats arrive', async () => {
    initStatsListener();
    render(App);

    // First message
    const snapshot1 = createMockSnapshot();
    simulateBackendMessage(snapshot1);

    await waitFor(() => {
      expect(screen.getByText(/35\.7%/)).toBeTruthy();
    });

    // Second message with updated CPU
    const snapshot2 = createMockSnapshot();
    snapshot2.host.cpuUsagePercent = 85.2;
    simulateBackendMessage(snapshot2);

    await waitFor(() => {
      expect(screen.getByText(/85\.2%/)).toBeTruthy();
    });
  });

  it('should ignore non-stats-update messages', async () => {
    initStatsListener();
    render(App);

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'unknown-message', payload: {} },
      }),
    );

    // Should still show loading
    expect(screen.getByText('Loading stats...')).toBeTruthy();
    expect(get(statsSnapshot)).toBeUndefined();
  });

  it('should handle snapshot with no containers', async () => {
    initStatsListener();
    render(App);

    const snapshot = createMockSnapshot();
    snapshot.containers = [];
    simulateBackendMessage(snapshot);

    await waitFor(() => {
      expect(screen.getByText('Host System Overview')).toBeTruthy();
      expect(screen.getByText(/no running containers/i)).toBeTruthy();
    });
  });

  it('should render uptime correctly', async () => {
    initStatsListener();
    render(App);

    const snapshot = createMockSnapshot();
    snapshot.host.uptime = 259200; // 3 days
    simulateBackendMessage(snapshot);

    await waitFor(() => {
      expect(screen.getByText('3d 0h')).toBeTruthy();
    });
  });

  it('should render memory in human-readable format', async () => {
    initStatsListener();
    render(App);

    const snapshot = createMockSnapshot();
    simulateBackendMessage(snapshot);

    await waitFor(() => {
      // Host memory: 10 GB used / 16 GB total (formatBytes uses integer when whole)
      expect(screen.getByText(/10 GB \/ 16 GB/)).toBeTruthy();
    });
  });

  it('should render progress bars for host stats', async () => {
    initStatsListener();
    render(App);

    const snapshot = createMockSnapshot();
    simulateBackendMessage(snapshot);

    await waitFor(() => {
      const progressBars = document.querySelectorAll('[role="progressbar"]');
      // CPU bar + Memory bar = 2 progress bars minimum
      expect(progressBars.length).toBeGreaterThanOrEqual(2);
    });
  });
});
