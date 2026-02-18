// packages/backend/src/__tests__/stats-manager.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StatsManager, StatsListener } from '../stats-manager';

// Create mock dependencies
function createMockDeps() {
  const mockContainerCollector = {
    startStreams: vi.fn().mockResolvedValue(undefined),
    stopStreams: vi.fn(),
    getLatestStats: vi.fn().mockReturnValue([]),
    refreshContainerList: vi.fn().mockResolvedValue(undefined),
  };
  const mockHostCollector = {
    collect: vi.fn().mockReturnValue({
      cpuUsagePercent: 25,
      cpuCount: 4,
      memoryTotal: 16000,
      memoryUsed: 8000,
      memoryFree: 8000,
      memoryUsagePercent: 50,
      uptime: 1000,
      platform: 'linux',
      hostname: 'test',
    }),
  };
  const mockConfigManager = {
    getRefreshIntervalMs: vi.fn().mockReturnValue(1000),
    getRefreshIntervalSeconds: vi.fn().mockReturnValue(1),
    onDidChangeConfiguration: vi.fn().mockReturnValue({ dispose: vi.fn() }),
  };
  const mockListener: StatsListener = {
    onStatsUpdate: vi.fn(),
  };

  return { mockContainerCollector, mockHostCollector, mockConfigManager, mockListener };
}

describe('StatsManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start collection and emit snapshot immediately', async () => {
    const deps = createMockDeps();
    const manager = new StatsManager(
      deps.mockConfigManager as any,
      deps.mockContainerCollector as any,
      deps.mockHostCollector as any,
    );
    manager.setListener(deps.mockListener);

    await manager.start();

    expect(deps.mockContainerCollector.startStreams).toHaveBeenCalledOnce();
    expect(deps.mockListener.onStatsUpdate).toHaveBeenCalledOnce();
    const snapshot = vi.mocked(deps.mockListener.onStatsUpdate).mock.calls[0][0];
    expect(snapshot.timestamp).toBeGreaterThan(0);
    expect(snapshot.containers).toEqual([]);
    expect(snapshot.host.cpuUsagePercent).toBe(25);

    manager.stop();
  });

  it('should emit snapshots on interval', async () => {
    const deps = createMockDeps();
    const manager = new StatsManager(
      deps.mockConfigManager as any,
      deps.mockContainerCollector as any,
      deps.mockHostCollector as any,
    );
    manager.setListener(deps.mockListener);

    await manager.start();
    expect(deps.mockListener.onStatsUpdate).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(deps.mockListener.onStatsUpdate).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(1000);
    expect(deps.mockListener.onStatsUpdate).toHaveBeenCalledTimes(3);

    manager.stop();
  });

  it('should stop collection and clear interval', async () => {
    const deps = createMockDeps();
    const manager = new StatsManager(
      deps.mockConfigManager as any,
      deps.mockContainerCollector as any,
      deps.mockHostCollector as any,
    );
    manager.setListener(deps.mockListener);

    await manager.start();
    manager.stop();

    expect(deps.mockContainerCollector.stopStreams).toHaveBeenCalledOnce();

    // Advancing time should NOT trigger more emissions
    const callCount = vi.mocked(deps.mockListener.onStatsUpdate).mock.calls.length;
    vi.advanceTimersByTime(5000);
    expect(deps.mockListener.onStatsUpdate).toHaveBeenCalledTimes(callCount);
  });

  it('should not double-start', async () => {
    const deps = createMockDeps();
    const manager = new StatsManager(
      deps.mockConfigManager as any,
      deps.mockContainerCollector as any,
      deps.mockHostCollector as any,
    );

    await manager.start();
    await manager.start(); // second call should be no-op

    expect(deps.mockContainerCollector.startStreams).toHaveBeenCalledTimes(1);

    manager.stop();
  });

  it('should not double-stop', () => {
    const deps = createMockDeps();
    const manager = new StatsManager(
      deps.mockConfigManager as any,
      deps.mockContainerCollector as any,
      deps.mockHostCollector as any,
    );

    manager.stop(); // not started yet — no-op
    expect(deps.mockContainerCollector.stopStreams).not.toHaveBeenCalled();
  });
});
