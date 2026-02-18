// packages/backend/src/__tests__/container-engine-adapter.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@podman-desktop/api');

import { PodmanDesktopContainerEngine } from '../adapters/container-engine-adapter';
import { containerEngine } from '@podman-desktop/api';

describe('PodmanDesktopContainerEngine', () => {
  let adapter: PodmanDesktopContainerEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new PodmanDesktopContainerEngine();
  });

  it('should delegate listContainers to PD API', async () => {
    const mockContainers = [{ Id: 'abc', Names: ['test'], State: 'running' }];
    vi.mocked(containerEngine.listContainers).mockResolvedValue(mockContainers as any);

    const result = await adapter.listContainers();
    expect(containerEngine.listContainers).toHaveBeenCalledOnce();
    expect(result).toEqual(mockContainers);
  });

  it('should delegate statsContainer to PD API', async () => {
    const mockDisposable = { dispose: vi.fn() };
    vi.mocked(containerEngine.statsContainer).mockResolvedValue(mockDisposable);
    const callback = vi.fn();

    const result = await adapter.statsContainer('engine1', 'container1', callback);
    expect(containerEngine.statsContainer).toHaveBeenCalledWith('engine1', 'container1', callback);
    expect(result).toBe(mockDisposable);
  });
});
