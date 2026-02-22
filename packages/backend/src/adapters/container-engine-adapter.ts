// packages/backend/src/adapters/container-engine-adapter.ts
import type { ContainerInfo, ContainerStatsInfo, Disposable } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';

export interface ContainerEnginePort {
  listContainers(): Promise<ContainerInfo[]>;
  statsContainer(
    engineId: string,
    containerId: string,
    callback: (stats: ContainerStatsInfo) => void,
  ): Promise<Disposable>;
}

export class PodmanDesktopContainerEngine implements ContainerEnginePort {
  async listContainers(): Promise<ContainerInfo[]> {
    return extensionApi.containerEngine.listContainers();
  }

  async statsContainer(
    engineId: string,
    containerId: string,
    callback: (stats: ContainerStatsInfo) => void,
  ): Promise<Disposable> {
    return extensionApi.containerEngine.statsContainer(
      engineId,
      containerId,
      callback,
    );
  }
}
