// packages/backend/src/__tests__/stats-calculator.test.ts
import { describe, it, expect } from 'vitest';
import {
  computeCpuPercent,
  computeMemoryUsage,
  computeNetworkIO,
  computeBlockIO,
  computeContainerStats,
} from '../stats-calculator';
import { createMockStatsInfo, createMockContainerInfo } from './fixtures';

describe('computeCpuPercent', () => {
  it('should compute CPU percentage from deltas', () => {
    const stats = createMockStatsInfo({
      cpu_stats: {
        cpu_usage: { total_usage: 200_000_000 },
        system_cpu_usage: 1_000_000_000,
        online_cpus: 4,
      },
      precpu_stats: {
        cpu_usage: { total_usage: 100_000_000 },
        system_cpu_usage: 500_000_000,
        online_cpus: 4,
      },
    });
    // cpuDelta = 100M, sysDelta = 500M, (100M/500M)*4*100 = 80%
    expect(computeCpuPercent(stats)).toBeCloseTo(80.0);
  });

  it('should return 0 when system delta is 0 (first sample)', () => {
    const stats = createMockStatsInfo({
      cpu_stats: {
        cpu_usage: { total_usage: 100 },
        system_cpu_usage: 500,
        online_cpus: 1,
      },
      precpu_stats: {
        cpu_usage: { total_usage: 100 },
        system_cpu_usage: 500,
        online_cpus: 1,
      },
    });
    expect(computeCpuPercent(stats)).toBe(0);
  });

  it('should return 0 when cpu delta is negative (container restart)', () => {
    const stats = createMockStatsInfo({
      cpu_stats: {
        cpu_usage: { total_usage: 50 },
        system_cpu_usage: 1000,
        online_cpus: 1,
      },
      precpu_stats: {
        cpu_usage: { total_usage: 100 },
        system_cpu_usage: 500,
        online_cpus: 1,
      },
    });
    expect(computeCpuPercent(stats)).toBe(0);
  });

  it('should handle single CPU', () => {
    const stats = createMockStatsInfo({
      cpu_stats: {
        cpu_usage: { total_usage: 200 },
        system_cpu_usage: 1000,
        online_cpus: 1,
      },
      precpu_stats: {
        cpu_usage: { total_usage: 100 },
        system_cpu_usage: 500,
        online_cpus: 1,
      },
    });
    // (100/500)*1*100 = 20%
    expect(computeCpuPercent(stats)).toBeCloseTo(20.0);
  });

  it('should allow values > 100% for multi-core', () => {
    const stats = createMockStatsInfo({
      cpu_stats: {
        cpu_usage: { total_usage: 800 },
        system_cpu_usage: 1000,
        online_cpus: 8,
      },
      precpu_stats: {
        cpu_usage: { total_usage: 0 },
        system_cpu_usage: 0,
        online_cpus: 8,
      },
    });
    // (800/1000)*8*100 = 640%
    expect(computeCpuPercent(stats)).toBeCloseTo(640.0);
  });

  it('should default online_cpus to 1 when 0', () => {
    const stats = createMockStatsInfo({
      cpu_stats: {
        cpu_usage: { total_usage: 200 },
        system_cpu_usage: 1000,
        online_cpus: 0,
      },
      precpu_stats: {
        cpu_usage: { total_usage: 100 },
        system_cpu_usage: 500,
        online_cpus: 0,
      },
    });
    // (100/500)*1*100 = 20%
    expect(computeCpuPercent(stats)).toBeCloseTo(20.0);
  });
});

describe('computeMemoryUsage', () => {
  it('should compute memory usage percentage', () => {
    const stats = createMockStatsInfo({
      memory_stats: { usage: 268435456, limit: 536870912 },
    });
    const result = computeMemoryUsage(stats);
    expect(result.used).toBe(268435456);
    expect(result.limit).toBe(536870912);
    expect(result.percent).toBeCloseTo(50.0);
  });

  it('should return 0% when limit is 0 (unlimited)', () => {
    const stats = createMockStatsInfo({
      memory_stats: { usage: 268435456, limit: 0 },
    });
    const result = computeMemoryUsage(stats);
    expect(result.used).toBe(268435456);
    expect(result.limit).toBe(0);
    expect(result.percent).toBe(0);
  });

  it('should handle zero usage', () => {
    const stats = createMockStatsInfo({
      memory_stats: { usage: 0, limit: 536870912 },
    });
    const result = computeMemoryUsage(stats);
    expect(result.percent).toBe(0);
  });

  it('should handle undefined values as 0', () => {
    const stats = createMockStatsInfo({
      memory_stats: { usage: undefined as unknown as number, limit: undefined as unknown as number },
    });
    const result = computeMemoryUsage(stats);
    expect(result.used).toBe(0);
    expect(result.limit).toBe(0);
    expect(result.percent).toBe(0);
  });
});

describe('computeNetworkIO', () => {
  it('should sum rx and tx across interfaces', () => {
    const stats = createMockStatsInfo({
      networks: {
        eth0: { rx_bytes: 1000, tx_bytes: 2000 },
        eth1: { rx_bytes: 500, tx_bytes: 300 },
      },
    });
    const result = computeNetworkIO(stats);
    expect(result.rx).toBe(1500);
    expect(result.tx).toBe(2300);
  });

  it('should return 0 when networks is undefined', () => {
    const stats = createMockStatsInfo({ networks: undefined });
    const result = computeNetworkIO(stats);
    expect(result.rx).toBe(0);
    expect(result.tx).toBe(0);
  });

  it('should handle empty networks object', () => {
    const stats = createMockStatsInfo({ networks: {} });
    const result = computeNetworkIO(stats);
    expect(result.rx).toBe(0);
    expect(result.tx).toBe(0);
  });

  it('should handle missing rx_bytes or tx_bytes', () => {
    const stats = createMockStatsInfo({
      networks: {
        eth0: { rx_bytes: 100 } as { rx_bytes?: number; tx_bytes?: number },
      },
    });
    const result = computeNetworkIO(stats);
    expect(result.rx).toBe(100);
    expect(result.tx).toBe(0);
  });
});

describe('computeBlockIO', () => {
  it('should sum read and write operations', () => {
    const stats = createMockStatsInfo({
      blkio_stats: {
        io_service_bytes_recursive: [
          { op: 'read', value: 1000 },
          { op: 'write', value: 2000 },
          { op: 'read', value: 500 },
          { op: 'write', value: 300 },
        ],
      },
    });
    const result = computeBlockIO(stats);
    expect(result.read).toBe(1500);
    expect(result.write).toBe(2300);
  });

  it('should handle case-insensitive op names', () => {
    const stats = createMockStatsInfo({
      blkio_stats: {
        io_service_bytes_recursive: [
          { op: 'Read', value: 100 },
          { op: 'WRITE', value: 200 },
        ],
      },
    });
    const result = computeBlockIO(stats);
    expect(result.read).toBe(100);
    expect(result.write).toBe(200);
  });

  it('should return 0 when blkio_stats is undefined', () => {
    const stats = createMockStatsInfo({ blkio_stats: undefined });
    const result = computeBlockIO(stats);
    expect(result.read).toBe(0);
    expect(result.write).toBe(0);
  });

  it('should return 0 when io_service_bytes_recursive is undefined', () => {
    const stats = createMockStatsInfo({
      blkio_stats: { io_service_bytes_recursive: undefined },
    });
    const result = computeBlockIO(stats);
    expect(result.read).toBe(0);
    expect(result.write).toBe(0);
  });

  it('should ignore non-read/write ops', () => {
    const stats = createMockStatsInfo({
      blkio_stats: {
        io_service_bytes_recursive: [
          { op: 'read', value: 100 },
          { op: 'sync', value: 50 },
          { op: 'async', value: 25 },
          { op: 'write', value: 200 },
        ],
      },
    });
    const result = computeBlockIO(stats);
    expect(result.read).toBe(100);
    expect(result.write).toBe(200);
  });
});

describe('computeContainerStats', () => {
  it('should assemble all stats into ProcessedContainerStats', () => {
    const container = createMockContainerInfo();
    const stats = createMockStatsInfo();

    const result = computeContainerStats(container as any, stats as any, undefined);

    expect(result.id).toBe('abc123def456');
    expect(result.name).toBe('my-container');
    expect(result.image).toBe('nginx:latest');
    expect(result.state).toBe('running');
    expect(result.engineId).toBe('podman');
    expect(result.cpuUsagePercent).toBeCloseTo(80.0);
    expect(result.memoryUsed).toBe(268435456);
    expect(result.memoryLimit).toBe(536870912);
    expect(result.memoryUsagePercent).toBeCloseTo(50.0);
    expect(result.networkRx).toBe(1024);
    expect(result.networkTx).toBe(2048);
    expect(result.blockRead).toBe(4096);
    expect(result.blockWrite).toBe(8192);
    expect(result.pids).toBe(12);
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it('should use truncated ID when Names is empty', () => {
    const container = createMockContainerInfo({ Names: [] });
    const stats = createMockStatsInfo();
    const result = computeContainerStats(container as any, stats as any, undefined);
    expect(result.name).toBe('abc123def456'.substring(0, 12));
  });

  it('should default pids to 0 when pids_stats missing', () => {
    const container = createMockContainerInfo();
    const stats = createMockStatsInfo({ pids_stats: undefined });
    const result = computeContainerStats(container as any, stats as any, undefined);
    expect(result.pids).toBe(0);
  });
});
