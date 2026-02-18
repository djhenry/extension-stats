// packages/backend/src/__tests__/integration.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StatsManager } from '../stats-manager';
import { ContainerStatsCollector } from '../container-stats-collector';
import { HostStatsCollector } from '../host-stats-collector';
import { RpcBridge } from '../rpc-bridge';
import { createMockContainerInfo, createMockStatsInfo } from './fixtures';
import type { ContainerEnginePort } from '../adapters/container-engine-adapter';
import type { OsPort } from '../adapters/os-adapter';
import type { StatsSnapshot } from '@podman-desktop-stats/shared';

describe('Integration: Full backend pipeline', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should collect stats from container engine and deliver via RPC', async () => {
    // Setup mock engine with one running container
    const container = createMockContainerInfo({ Id: 'int-c1', Names: ['test-app'], State: 'running' });
    let capturedCallback: ((stats: any) => void) | undefined;

    const mockEngine: ContainerEnginePort = {
      listContainers: vi.fn().mockResolvedValue([container]),
      statsContainer: vi.fn().mockImplementation(async (_e, _c, cb) => {
        capturedCallback = cb;
        return { dispose: vi.fn() };
      }),
    };

    // Setup mock OS adapter
    const mockOs: OsPort = {
      cpus: vi.fn().mockReturnValue([
        { model: 'cpu', speed: 2400, times: { user: 100, nice: 0, sys: 50, idle: 800, irq: 50 } },
      ]),
      totalmem: vi.fn().mockReturnValue(16000000000),
      freemem: vi.fn().mockReturnValue(8000000000),
      uptime: vi.fn().mockReturnValue(3600),
      platform: vi.fn().mockReturnValue('linux' as NodeJS.Platform),
      hostname: vi.fn().mockReturnValue('integration-test'),
    };

    // Setup config
    const mockConfig = {
      getRefreshIntervalMs: vi.fn().mockReturnValue(1000),
      getRefreshIntervalSeconds: vi.fn().mockReturnValue(1),
      onDidChangeConfiguration: vi.fn().mockReturnValue({ dispose: vi.fn() }),
    };

    // Setup webview mock
    const receivedMessages: any[] = [];
    const mockWebview = {
      postMessage: vi.fn().mockImplementation((msg: any) => receivedMessages.push(msg)),
      onDidReceiveMessage: vi.fn().mockReturnValue({ dispose: vi.fn() }),
    };

    // Wire up
    const containerCollector = new ContainerStatsCollector(mockEngine);
    const hostCollector = new HostStatsCollector(mockOs);
    const manager = new StatsManager(mockConfig as any, containerCollector, hostCollector);
    const _bridge = new RpcBridge(mockWebview, manager);

    // Start collection
    await manager.start();

    // Simulate a stats callback from the engine
    const mockStats = createMockStatsInfo();
    capturedCallback!(mockStats);

    // Advance timer to trigger snapshot emission
    vi.advanceTimersByTime(1000);

    // Verify messages received
    expect(receivedMessages.length).toBeGreaterThanOrEqual(1);
    const lastMsg = receivedMessages[receivedMessages.length - 1];
    expect(lastMsg.type).toBe('stats-update');

    const snapshot: StatsSnapshot = lastMsg.payload;
    expect(snapshot.containers.length).toBe(1);
    expect(snapshot.containers[0].name).toBe('test-app');
    expect(snapshot.host.hostname).toBe('integration-test');

    manager.stop();
  });

  it('should handle container disappearing between polls', async () => {
    const container = createMockContainerInfo({ Id: 'gone-c1', State: 'running' });

    const mockEngine: ContainerEnginePort = {
      listContainers: vi.fn()
        .mockResolvedValueOnce([container]) // first list
        .mockResolvedValueOnce([]),          // second list (container gone)
      statsContainer: vi.fn().mockResolvedValue({ dispose: vi.fn() }),
    };

    const mockOs: OsPort = {
      cpus: vi.fn().mockReturnValue([
        { model: 'cpu', speed: 2400, times: { user: 0, nice: 0, sys: 0, idle: 1000, irq: 0 } },
      ]),
      totalmem: vi.fn().mockReturnValue(8000),
      freemem: vi.fn().mockReturnValue(4000),
      uptime: vi.fn().mockReturnValue(100),
      platform: vi.fn().mockReturnValue('linux' as NodeJS.Platform),
      hostname: vi.fn().mockReturnValue('test'),
    };

    const mockConfig = {
      getRefreshIntervalMs: vi.fn().mockReturnValue(1000),
      getRefreshIntervalSeconds: vi.fn().mockReturnValue(1),
      onDidChangeConfiguration: vi.fn().mockReturnValue({ dispose: vi.fn() }),
    };

    const containerCollector = new ContainerStatsCollector(mockEngine);
    const hostCollector = new HostStatsCollector(mockOs);
    const manager = new StatsManager(mockConfig as any, containerCollector, hostCollector);

    await manager.start();
    await containerCollector.refreshContainerList();

    // Should not throw, container cleaned up
    expect(containerCollector.getLatestStats()).toEqual([]);

    manager.stop();
  });
});
