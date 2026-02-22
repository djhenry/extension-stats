// packages/backend/src/__tests__/extension.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@podman-desktop/api', () => {
  const mockWebview = {
    html: '',
    onDidReceiveMessage: vi.fn().mockReturnValue({ dispose: vi.fn() }),
    postMessage: vi.fn(),
    asWebviewUri: vi.fn().mockImplementation((uri: any) => uri),
  };

  const mockPanel = {
    webview: mockWebview,
    onDidChangeViewState: vi.fn(),
    dispose: vi.fn(),
  };

  return {
    window: {
      createWebviewPanel: vi.fn().mockReturnValue(mockPanel),
    },
    Uri: {
      joinPath: vi.fn().mockImplementation((...parts: any[]) => ({
        fsPath: parts.map((p: any) => (typeof p === 'string' ? p : p.path || '')).join('/'),
        toString: () => parts.map((p: any) => (typeof p === 'string' ? p : p.path || '')).join('/'),
      })),
    },
    configuration: {
      getConfiguration: vi.fn().mockReturnValue({
        get: vi.fn().mockReturnValue(3),
      }),
      onDidChangeConfiguration: vi.fn().mockReturnValue({ dispose: vi.fn() }),
    },
    containerEngine: {
      listContainers: vi.fn().mockResolvedValue([]),
      statsContainer: vi.fn(),
    },
  };
});

vi.mock('node:fs', () => ({
  default: {
    promises: {
      readFile: vi.fn().mockResolvedValue(
        '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
      ),
    },
  },
  promises: {
    readFile: vi.fn().mockResolvedValue(
      '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    ),
  },
}));

import { activate, deactivate } from '../extension';
import * as extensionApi from '@podman-desktop/api';

describe('Extension lifecycle', () => {
  let mockContext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      subscriptions: [],
      extensionUri: { path: '/test/extension', fsPath: '/test/extension' },
      extensionPath: '/test/extension',
      storagePath: '/tmp/test',
    };
  });

  it('should activate without errors', async () => {
    await expect(activate(mockContext)).resolves.not.toThrow();
  });

  it('should create a webview panel', async () => {
    await activate(mockContext);
    expect(extensionApi.window.createWebviewPanel).toHaveBeenCalledWith(
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

  it('should use Uri.joinPath for resource paths', async () => {
    await activate(mockContext);
    expect(extensionApi.Uri.joinPath).toHaveBeenCalled();
  });
});
