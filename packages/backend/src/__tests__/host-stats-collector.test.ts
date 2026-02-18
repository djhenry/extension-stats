// packages/backend/src/__tests__/host-stats-collector.test.ts
import { describe, it, expect, vi } from 'vitest';
import { HostStatsCollector } from '../host-stats-collector';
import type { OsPort } from '../adapters/os-adapter';

function createMockOsAdapter(overrides: Partial<OsPort> = {}): OsPort {
  return {
    cpus: vi.fn().mockReturnValue([
      { model: 'cpu', speed: 2400, times: { user: 100, nice: 0, sys: 50, idle: 800, irq: 50 } },
      { model: 'cpu', speed: 2400, times: { user: 100, nice: 0, sys: 50, idle: 800, irq: 50 } },
    ]),
    totalmem: vi.fn().mockReturnValue(17179869184),
    freemem: vi.fn().mockReturnValue(8589934592),
    uptime: vi.fn().mockReturnValue(86400),
    platform: vi.fn().mockReturnValue('linux' as NodeJS.Platform),
    hostname: vi.fn().mockReturnValue('test-host'),
    ...overrides,
  };
}

describe('HostStatsCollector', () => {
  it('should return host stats on first collect (CPU = 0 on first call)', () => {
    const osAdapter = createMockOsAdapter();
    const collector = new HostStatsCollector(osAdapter);

    const stats = collector.collect();

    expect(stats.cpuUsagePercent).toBe(0); // First sample, no delta
    expect(stats.cpuCount).toBe(2);
    expect(stats.memoryTotal).toBe(17179869184);
    expect(stats.memoryUsed).toBe(17179869184 - 8589934592);
    expect(stats.memoryFree).toBe(8589934592);
    expect(stats.memoryUsagePercent).toBeCloseTo(50.0);
    expect(stats.uptime).toBe(86400);
    expect(stats.platform).toBe('linux');
    expect(stats.hostname).toBe('test-host');
  });

  it('should compute CPU delta on second collect', () => {
    const firstCpus = [
      { model: 'cpu', speed: 2400, times: { user: 100, nice: 0, sys: 50, idle: 800, irq: 50 } },
    ];
    const secondCpus = [
      { model: 'cpu', speed: 2400, times: { user: 200, nice: 0, sys: 100, idle: 900, irq: 50 } },
    ];

    const osAdapter = createMockOsAdapter({
      cpus: vi.fn()
        .mockReturnValueOnce(firstCpus) // first collect
        .mockReturnValueOnce(secondCpus) // second collect
        .mockReturnValueOnce(secondCpus), // cpuCount read
    });

    const collector = new HostStatsCollector(osAdapter);

    collector.collect(); // First call — sets baseline

    const stats = collector.collect(); // Second call — computes delta
    // First: idle=800, total=1000
    // Second: idle=900, total=1250
    // idleDelta=100, totalDelta=250
    // usage = (250-100)/250 * 100 = 60%
    expect(stats.cpuUsagePercent).toBeCloseTo(60.0);
  });

  it('should return 0% CPU when total delta is 0', () => {
    const sameCpus = [
      { model: 'cpu', speed: 2400, times: { user: 100, nice: 0, sys: 50, idle: 800, irq: 50 } },
    ];

    const osAdapter = createMockOsAdapter({
      cpus: vi.fn().mockReturnValue(sameCpus),
    });

    const collector = new HostStatsCollector(osAdapter);
    collector.collect(); // baseline
    const stats = collector.collect(); // same values
    expect(stats.cpuUsagePercent).toBe(0);
  });
});
