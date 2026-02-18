// packages/shared/src/__tests__/types.test.ts
import { describe, it, expect } from 'vitest';
import type {
  ProcessedContainerStats,
  HostStats,
  StatsSnapshot,
  CpuTimes,
} from '../types';
import type { RpcMessage, RpcCommand } from '../rpc-types';

describe('Type definitions', () => {
  it('should create a valid ProcessedContainerStats object', () => {
    const stats: ProcessedContainerStats = {
      id: 'abc123',
      name: 'my-container',
      image: 'nginx:latest',
      state: 'running',
      engineId: 'podman',
      cpuUsagePercent: 25.5,
      memoryUsed: 268435456,
      memoryLimit: 536870912,
      memoryUsagePercent: 50.0,
      networkRx: 1024,
      networkTx: 2048,
      blockRead: 4096,
      blockWrite: 8192,
      pids: 12,
      timestamp: Date.now(),
    };
    expect(stats.id).toBe('abc123');
    expect(stats.cpuUsagePercent).toBe(25.5);
  });

  it('should create a valid HostStats object', () => {
    const host: HostStats = {
      cpuUsagePercent: 45.2,
      cpuCount: 8,
      memoryTotal: 17179869184,
      memoryUsed: 8589934592,
      memoryFree: 8589934592,
      memoryUsagePercent: 50.0,
      uptime: 86400,
      platform: 'linux',
      hostname: 'dev-machine',
    };
    expect(host.cpuCount).toBe(8);
    expect(host.platform).toBe('linux');
  });

  it('should create a valid StatsSnapshot object', () => {
    const snapshot: StatsSnapshot = {
      timestamp: Date.now(),
      containers: [],
      host: {
        cpuUsagePercent: 0,
        cpuCount: 1,
        memoryTotal: 1024,
        memoryUsed: 512,
        memoryFree: 512,
        memoryUsagePercent: 50,
        uptime: 100,
        platform: 'linux',
        hostname: 'test',
      },
    };
    expect(snapshot.containers).toEqual([]);
    expect(snapshot.host.cpuCount).toBe(1);
  });

  it('should create valid RPC message types', () => {
    const msg: RpcMessage = {
      type: 'stats-update',
      payload: {
        timestamp: Date.now(),
        containers: [],
        host: {
          cpuUsagePercent: 0,
          cpuCount: 1,
          memoryTotal: 1024,
          memoryUsed: 512,
          memoryFree: 512,
          memoryUsagePercent: 50,
          uptime: 100,
          platform: 'linux',
          hostname: 'test',
        },
      },
    };
    expect(msg.type).toBe('stats-update');

    const cmd: RpcCommand = { type: 'request-refresh' };
    expect(cmd.type).toBe('request-refresh');
  });

  it('should create a valid CpuTimes object', () => {
    const times: CpuTimes = { idle: 1000, total: 5000 };
    expect(times.idle).toBe(1000);
    expect(times.total).toBe(5000);
  });
});
