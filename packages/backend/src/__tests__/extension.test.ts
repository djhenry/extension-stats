// packages/backend/src/__tests__/extension.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@podman-desktop/api');

import { activate, deactivate } from '../extension';
import { window } from '@podman-desktop/api';

describe('Extension lifecycle', () => {
  let mockContext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      subscriptions: [],
      storagePath: '/tmp/test',
    };
  });

  it('should activate without errors', async () => {
    await expect(activate(mockContext)).resolves.not.toThrow();
  });

  it('should create a webview panel', async () => {
    await activate(mockContext);
    expect(window.createWebviewPanel).toHaveBeenCalledWith(
      'container-stats',
      'Container Stats',
      expect.any(Object),
    );
  });

  it('should push disposables to subscriptions', async () => {
    await activate(mockContext);
    expect(mockContext.subscriptions.length).toBeGreaterThan(0);
  });

  it('should deactivate without errors', async () => {
    await activate(mockContext);
    await expect(deactivate()).resolves.not.toThrow();
  });

  it('should handle deactivate without prior activate', async () => {
    await expect(deactivate()).resolves.not.toThrow();
  });
});
