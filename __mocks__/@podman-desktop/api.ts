// __mocks__/@podman-desktop/api.ts
// Mock implementation of @podman-desktop/api for unit testing

import { vi } from 'vitest';

export const containerEngine = {
  listContainers: vi.fn().mockResolvedValue([]),
  statsContainer: vi.fn().mockResolvedValue({ dispose: vi.fn() }),
  info: vi.fn().mockResolvedValue({}),
};

export const window = {
  createWebviewPanel: vi.fn().mockReturnValue({
    webview: {
      postMessage: vi.fn(),
      onDidReceiveMessage: vi.fn().mockReturnValue({ dispose: vi.fn() }),
    },
    onDidChangeViewState: vi.fn().mockReturnValue({ dispose: vi.fn() }),
    visible: true,
    dispose: vi.fn(),
  }),
  showInformationMessage: vi.fn(),
};

export const configuration = {
  getConfiguration: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue(3),
  }),
  onDidChangeConfiguration: vi.fn().mockReturnValue({ dispose: vi.fn() }),
};

export const StatusBarAlignLeft = 1;

export type Disposable = { dispose(): void };
export type ExtensionContext = {
  subscriptions: Disposable[];
  storagePath: string;
};
