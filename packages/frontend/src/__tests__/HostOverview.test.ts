// packages/frontend/src/__tests__/HostOverview.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import HostOverview from '../components/HostOverview.svelte';

describe('HostOverview', () => {
  const mockHostStats = {
    cpuUsagePercent: 45.2,
    cpuCount: 8,
    memoryTotal: 17179869184,
    memoryUsed: 8589934592,
    memoryFree: 8589934592,
    memoryUsagePercent: 50.0,
    uptime: 302400,
    platform: 'linux',
    hostname: 'dev-machine',
  };

  it('should display CPU usage', () => {
    render(HostOverview, { props: { stats: mockHostStats } });
    expect(screen.getByText(/45\.2%/)).toBeTruthy();
  });

  it('should display CPU count', () => {
    render(HostOverview, { props: { stats: mockHostStats } });
    // NOTE: Spec had /8/ but that matches memory "8 GB" too - using more specific regex
    expect(screen.getByText(/8 cores/)).toBeTruthy();
  });

  it('should display uptime', () => {
    render(HostOverview, { props: { stats: mockHostStats } });
    expect(screen.getByText(/3d 12h/)).toBeTruthy();
  });
});
