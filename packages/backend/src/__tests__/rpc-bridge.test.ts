// packages/backend/src/__tests__/rpc-bridge.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RpcBridge } from '../rpc-bridge';
import type { StatsSnapshot } from '@extension-stats/shared';

describe('RpcBridge', () => {
  let mockWebview: any;
  let mockStatsManager: any;
  let bridge: RpcBridge;

  beforeEach(() => {
    mockWebview = {
      postMessage: vi.fn(),
      onDidReceiveMessage: vi.fn().mockReturnValue({ dispose: vi.fn() }),
    };
    mockStatsManager = {
      setListener: vi.fn(),
      emitSnapshot: vi.fn(),
    };
    bridge = new RpcBridge(mockWebview, mockStatsManager);
  });

  it('should register itself as listener on StatsManager', () => {
    expect(mockStatsManager.setListener).toHaveBeenCalledWith(bridge);
  });

  it('should post message to webview on stats update', () => {
    const snapshot: StatsSnapshot = {
      timestamp: 1000,
      containers: [],
      host: {
        cpuUsagePercent: 10,
        cpuCount: 2,
        memoryTotal: 8000,
        memoryUsed: 4000,
        memoryFree: 4000,
        memoryUsagePercent: 50,
        uptime: 100,
        platform: 'linux',
        hostname: 'test',
      },
    };

    bridge.onStatsUpdate(snapshot);

    expect(mockWebview.postMessage).toHaveBeenCalledWith({
      type: 'stats-update',
      payload: snapshot,
    });
  });

  it('should register message listener on webview', () => {
    expect(mockWebview.onDidReceiveMessage).toHaveBeenCalledOnce();
  });

  it('should handle request-refresh command', () => {
    // Capture the message handler
    const handler = vi.mocked(mockWebview.onDidReceiveMessage).mock.calls[0][0];
    handler({ type: 'request-refresh' });

    expect(mockStatsManager.emitSnapshot).toHaveBeenCalledOnce();
  });

  it('should dispose webview listener on dispose', () => {
    const mockDispose = vi.fn();
    mockWebview.onDidReceiveMessage.mockReturnValue({ dispose: mockDispose });

    const newBridge = new RpcBridge(mockWebview, mockStatsManager);
    newBridge.dispose();

    expect(mockDispose).toHaveBeenCalledOnce();
  });
});
