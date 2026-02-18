// packages/backend/src/__tests__/config-manager.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@podman-desktop/api');

import { ConfigManager } from '../config-manager';
import { configuration } from '@podman-desktop/api';

describe('ConfigManager', () => {
  let configManager: ConfigManager;
  const mockContext = { subscriptions: [], storagePath: '/tmp' } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    configManager = new ConfigManager(mockContext);
  });

  it('should return default interval (3000ms) when not configured', () => {
    vi.mocked(configuration.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValue(undefined),
    } as any);

    expect(configManager.getRefreshIntervalMs()).toBe(3000);
  });

  it('should return configured interval in milliseconds', () => {
    vi.mocked(configuration.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValue(5),
    } as any);

    expect(configManager.getRefreshIntervalMs()).toBe(5000);
  });

  it('should clamp interval to minimum (1s)', () => {
    vi.mocked(configuration.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValue(0),
    } as any);

    expect(configManager.getRefreshIntervalMs()).toBe(1000);
  });

  it('should clamp interval to maximum (30s)', () => {
    vi.mocked(configuration.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValue(60),
    } as any);

    expect(configManager.getRefreshIntervalMs()).toBe(30000);
  });

  it('should return interval in seconds', () => {
    vi.mocked(configuration.getConfiguration).mockReturnValue({
      get: vi.fn().mockReturnValue(5),
    } as any);

    expect(configManager.getRefreshIntervalSeconds()).toBe(5);
  });

  it('should register configuration change listener', () => {
    const callback = vi.fn();
    configManager.onDidChangeConfiguration(callback);
    expect(configuration.onDidChangeConfiguration).toHaveBeenCalledOnce();
  });
});
