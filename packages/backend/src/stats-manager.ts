// packages/backend/src/stats-manager.ts
import type { StatsSnapshot } from '@podman-desktop-stats/shared';
import type { ConfigManager } from './config-manager';
import type { ContainerStatsCollector } from './container-stats-collector';
import type { HostStatsCollector } from './host-stats-collector';

export interface StatsListener {
  onStatsUpdate(snapshot: StatsSnapshot): void;
}

export class StatsManager {
  private listener: StatsListener | undefined;
  private intervalHandle: ReturnType<typeof setInterval> | undefined;
  private running: boolean = false;

  constructor(
    private configManager: ConfigManager,
    private containerCollector: ContainerStatsCollector,
    private hostCollector: HostStatsCollector,
  ) {}

  setListener(listener: StatsListener): void {
    this.listener = listener;
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;
    await this.containerCollector.startStreams();
    this.schedulePolling();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.containerCollector.stopStreams();
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = undefined;
    }
  }

  private schedulePolling(): void {
    const intervalMs = this.configManager.getRefreshIntervalMs();
    this.intervalHandle = setInterval(() => {
      this.emitSnapshot();
    }, intervalMs);
    // Emit immediately on start
    this.emitSnapshot();
  }

  emitSnapshot(): void {
    const snapshot: StatsSnapshot = {
      timestamp: Date.now(),
      containers: this.containerCollector.getLatestStats(),
      host: this.hostCollector.collect(),
    };
    this.listener?.onStatsUpdate(snapshot);
  }
}
