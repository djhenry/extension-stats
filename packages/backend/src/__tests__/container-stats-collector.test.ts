// packages/backend/src/__tests__/container-stats-collector.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContainerStatsCollector } from '../container-stats-collector';
import type { ContainerEnginePort } from '../adapters/container-engine-adapter';
import { createMockContainerInfo, createMockStatsInfo } from './fixtures';

function createMockEngine(): ContainerEnginePort {
  return {
    listContainers: vi.fn().mockResolvedValue([]),
    statsContainer: vi.fn().mockResolvedValue({ dispose: vi.fn() }),
  };
}

describe('ContainerStatsCollector', () => {
  let engine: ReturnType<typeof createMockEngine>;
  let collector: ContainerStatsCollector;

  beforeEach(() => {
    engine = createMockEngine();
    collector = new ContainerStatsCollector(engine);
  });

  it('should return empty stats when no containers running', async () => {
    await collector.startStreams();
    expect(collector.getLatestStats()).toEqual([]);
  });

  it('should subscribe to running containers', async () => {
    const containers = [
      createMockContainerInfo({ Id: 'c1', State: 'running' }),
      createMockContainerInfo({ Id: 'c2', State: 'running' }),
      createMockContainerInfo({ Id: 'c3', State: 'exited' }),
    ];
    vi.mocked(engine.listContainers).mockResolvedValue(containers as any);

    await collector.startStreams();

    // Should only subscribe to running containers (c1, c2)
    expect(engine.statsContainer).toHaveBeenCalledTimes(2);
  });

  it('should update stats map when callback fires', async () => {
    const container = createMockContainerInfo({ Id: 'c1', State: 'running' });
    vi.mocked(engine.listContainers).mockResolvedValue([container as any]);

    let capturedCallback: ((stats: any) => void) | undefined;
    vi.mocked(engine.statsContainer).mockImplementation(
      async (_engineId, _containerId, callback) => {
        capturedCallback = callback;
        return { dispose: vi.fn() };
      },
    );

    await collector.startStreams();

    // Simulate a stats callback
    const mockStats = createMockStatsInfo();
    capturedCallback!(mockStats);

    const latest = collector.getLatestStats();
    expect(latest).toHaveLength(1);
    expect(latest[0].id).toBe('c1');
  });

  it('should dispose all streams on stopStreams', async () => {
    const container = createMockContainerInfo({ Id: 'c1', State: 'running' });
    vi.mocked(engine.listContainers).mockResolvedValue([container as any]);
    const disposeFn = vi.fn();
    vi.mocked(engine.statsContainer).mockResolvedValue({ dispose: disposeFn });

    await collector.startStreams();
    collector.stopStreams();

    expect(disposeFn).toHaveBeenCalledOnce();
    expect(collector.getLatestStats()).toEqual([]);
  });

  it('should handle statsContainer errors gracefully', async () => {
    const container = createMockContainerInfo({ Id: 'c1', State: 'running' });
    vi.mocked(engine.listContainers).mockResolvedValue([container as any]);
    vi.mocked(engine.statsContainer).mockRejectedValue(new Error('container gone'));

    // Should not throw
    await expect(collector.startStreams()).resolves.not.toThrow();
  });

  it('should refresh container list and clean up removed containers', async () => {
    const c1 = createMockContainerInfo({ Id: 'c1', State: 'running' });
    const c2 = createMockContainerInfo({ Id: 'c2', State: 'running' });
    const disposeFn1 = vi.fn();
    const disposeFn2 = vi.fn();

    vi.mocked(engine.listContainers).mockResolvedValueOnce([c1, c2] as any);
    vi.mocked(engine.statsContainer)
      .mockResolvedValueOnce({ dispose: disposeFn1 })
      .mockResolvedValueOnce({ dispose: disposeFn2 });

    await collector.startStreams();

    // Now c2 is gone
    vi.mocked(engine.listContainers).mockResolvedValueOnce([c1] as any);
    await collector.refreshContainerList();

    expect(disposeFn2).toHaveBeenCalledOnce();
    expect(disposeFn1).not.toHaveBeenCalled();
  });
});
