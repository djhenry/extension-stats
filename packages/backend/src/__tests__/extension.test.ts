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
import path from 'node:path';

const actualFs = await vi.importActual<typeof import('node:fs')>('node:fs');
const backendRoot = path.resolve(__dirname, '..', '..');

describe('Extension manifest (package.json)', () => {
  const manifest = JSON.parse(
    actualFs.readFileSync(path.join(backendRoot, 'package.json'), 'utf-8'),
  );

  it('should have an icon field', () => {
    expect(manifest.icon).toBeDefined();
  });

  it('should reference icon files that exist on disk', () => {
    const icon = manifest.icon;
    if (typeof icon === 'string') {
      expect(actualFs.existsSync(path.join(backendRoot, icon))).toBe(true);
    } else {
      expect(icon).toHaveProperty('light');
      expect(icon).toHaveProperty('dark');
      expect(actualFs.existsSync(path.join(backendRoot, icon.light))).toBe(true);
      expect(actualFs.existsSync(path.join(backendRoot, icon.dark))).toBe(true);
    }
  });

  it('should have icon files that are valid PNG images', () => {
    const icon = manifest.icon;
    const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const files = typeof icon === 'string' ? [icon] : [icon.light, icon.dark];

    for (const file of files) {
      const buf = actualFs.readFileSync(path.join(backendRoot, file));
      expect(buf.subarray(0, 4).equals(pngMagic)).toBe(true);
    }
  });

  it('should have icon files in 8-bit RGBA color format for Electron compatibility', () => {
    const icon = manifest.icon;
    const files = typeof icon === 'string' ? [icon] : [icon.light, icon.dark];

    for (const file of files) {
      const buf = actualFs.readFileSync(path.join(backendRoot, file));
      // PNG IHDR chunk starts at byte 8, color type is at byte 25, bit depth at byte 24
      const bitDepth = buf[24];
      const colorType = buf[25];
      // colorType 6 = RGBA, bitDepth 8 = standard 8-bit
      expect(bitDepth).toBe(8);
      expect(colorType).toBe(6);
    }
  });
});

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

  it('should set iconPath on the webview panel for sidebar icon', async () => {
    await activate(mockContext);
    const mockPanel = (extensionApi.window.createWebviewPanel as any).mock.results[0].value;
    expect(mockPanel.iconPath).toBeDefined();
    // Must be a single Uri (not { light, dark }) because PD's webview-registry
    // only serializes single Uri icons for the sidebar navigation.
    expect(mockPanel.iconPath).toHaveProperty('fsPath');
    expect(mockPanel.iconPath.fsPath).toContain('icon.png');
  });
});
