// packages/backend/src/adapters/container-engine-adapter.ts
import * as podmanDesktopAPI from '@podman-desktop/api';

export interface ContainerEnginePort {
  listContainers(): Promise<podmanDesktopAPI.ContainerInfo[]>;
  statsContainer(
    engineId: string,
    containerId: string,
    callback: (stats: podmanDesktopAPI.ContainerStatsInfo) => void,
  ): Promise<podmanDesktopAPI.Disposable>;
}

export class PodmanDesktopContainerEngine implements ContainerEnginePort {
  async listContainers(): Promise<podmanDesktopAPI.ContainerInfo[]> {
    return podmanDesktopAPI.containerEngine.listContainers();
  }

  async statsContainer(
    engineId: string,
    containerId: string,
    callback: (stats: podmanDesktopAPI.ContainerStatsInfo) => void,
  ): Promise<podmanDesktopAPI.Disposable> {
    return podmanDesktopAPI.containerEngine.statsContainer(
      engineId,
      containerId,
      callback,
    );
  }
}
