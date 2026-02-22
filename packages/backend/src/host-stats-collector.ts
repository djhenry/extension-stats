// packages/backend/src/host-stats-collector.ts
import type { HostStats, CpuTimes } from '@extension-stats/shared';
import type { OsPort } from './adapters/os-adapter';

export class HostStatsCollector {
  private previousCpuTimes: CpuTimes | undefined;

  constructor(private osAdapter: OsPort) {}

  collect(): HostStats {
    const cpus = this.osAdapter.cpus();
    const cpuUsagePercent = this.computeCpuUsage(cpus);
    const totalMemory = this.osAdapter.totalmem();
    const freeMemory = this.osAdapter.freemem();
    const usedMemory = totalMemory - freeMemory;

    return {
      cpuUsagePercent,
      cpuCount: cpus.length,
      memoryTotal: totalMemory,
      memoryUsed: usedMemory,
      memoryFree: freeMemory,
      memoryUsagePercent: (usedMemory / totalMemory) * 100,
      uptime: this.osAdapter.uptime(),
      platform: this.osAdapter.platform(),
      hostname: this.osAdapter.hostname(),
    };
  }

  private computeCpuUsage(cpus: { times: { user: number; nice: number; sys: number; idle: number; irq: number } }[]): number {
    const currentTimes = this.aggregateCpuTimes(cpus);

    if (!this.previousCpuTimes) {
      this.previousCpuTimes = currentTimes;
      return 0;
    }

    const idleDelta = currentTimes.idle - this.previousCpuTimes.idle;
    const totalDelta = currentTimes.total - this.previousCpuTimes.total;

    this.previousCpuTimes = currentTimes;

    if (totalDelta === 0) return 0;
    return ((totalDelta - idleDelta) / totalDelta) * 100;
  }

  private aggregateCpuTimes(cpus: { times: { user: number; nice: number; sys: number; idle: number; irq: number } }[]): CpuTimes {
    let idle = 0;
    let total = 0;
    for (const cpu of cpus) {
      idle += cpu.times.idle;
      total += cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
    }
    return { idle, total };
  }
}
