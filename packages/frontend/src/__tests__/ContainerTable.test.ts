// packages/frontend/src/__tests__/ContainerTable.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ContainerTable from '../components/ContainerTable.svelte';

describe('ContainerTable', () => {
  it('should show empty state when no containers', () => {
    render(ContainerTable, { props: { containers: [] } });
    expect(screen.getByText(/no running containers/i)).toBeTruthy();
  });

  it('should render rows for each container', () => {
    const containers = [
      {
        id: 'c1', name: 'web-app', image: 'nginx', state: 'running',
        engineId: 'podman', cpuUsagePercent: 12.5, memoryUsed: 268435456,
        memoryLimit: 536870912, memoryUsagePercent: 50, networkRx: 1024,
        networkTx: 2048, blockRead: 4096, blockWrite: 8192, pids: 42,
        timestamp: Date.now(),
      },
    ];
    render(ContainerTable, { props: { containers } });
    expect(screen.getByText('web-app')).toBeTruthy();
  });
});
