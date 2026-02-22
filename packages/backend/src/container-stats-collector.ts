// packages/backend/src/container-stats-collector.ts
import type { ContainerInfo, ContainerStatsInfo, Disposable } from '@podman-desktop/api';
import type { ProcessedContainerStats } from '@podman-desktop-stats/shared';
import { computeContainerStats } from './stats-calculator';
import type { ContainerEnginePort } from './adapters/container-engine-adapter';

export class ContainerStatsCollector {
  private statsMap: Map<string, ProcessedContainerStats> = new Map();
  private disposables: Map<string, Disposable> = new Map();

  constructor(private engine: ContainerEnginePort) {}

  async startStreams(): Promise<void> {
    const containers = await this.engine.listContainers();
    const running = containers.filter(c => c.State === 'running');

    for (const container of running) {
      await this.subscribeToContainer(container);
    }
  }

  private async subscribeToContainer(
    container: ContainerInfo,
  ): Promise<void> {
    const key = container.Id;
    if (this.disposables.has(key)) return;

    try {
      const disposable = await this.engine.statsContainer(
        container.engineId,
        container.Id,
        (stats: ContainerStatsInfo) => {
          const processed = computeContainerStats(
            container,
            stats,
            this.statsMap.get(key),
          );
          this.statsMap.set(key, processed);
        },
      );
      this.disposables.set(key, disposable);
    } catch {
      // Container may have stopped between list and subscribe — ignore
    }
  }

  stopStreams(): void {
    for (const disposable of this.disposables.values()) {
      disposable.dispose();
    }
    this.disposables.clear();
    this.statsMap.clear();
  }

  getLatestStats(): ProcessedContainerStats[] {
    return Array.from(this.statsMap.values());
  }

  async refreshContainerList(): Promise<void> {
    const containers = await this.engine.listContainers();
    const running = containers.filter(c => c.State === 'running');
    const runningIds = new Set(running.map(c => c.Id));

    // Remove streams for stopped containers
    for (const [id, disposable] of this.disposables) {
      if (!runningIds.has(id)) {
        disposable.dispose();
        this.disposables.delete(id);
        this.statsMap.delete(id);
      }
    }

    // Add streams for new containers
    for (const container of running) {
      if (!this.disposables.has(container.Id)) {
        await this.subscribeToContainer(container);
      }
    }
  }
}
