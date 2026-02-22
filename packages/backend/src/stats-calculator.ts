// packages/backend/src/stats-calculator.ts
import type { ContainerInfo, ContainerStatsInfo } from '@podman-desktop/api';
import type { ProcessedContainerStats } from '@extension-stats/shared';

export function computeCpuPercent(
  stats: ContainerStatsInfo,
): number {
  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage -
    stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;

  if (systemDelta === 0 || cpuDelta < 0) return 0;

  const onlineCpus = stats.cpu_stats.online_cpus || 1;
  return (cpuDelta / systemDelta) * onlineCpus * 100;
}

export function computeMemoryUsage(
  stats: ContainerStatsInfo,
): { used: number; limit: number; percent: number } {
  const used = stats.memory_stats.usage ?? 0;
  const limit = stats.memory_stats.limit ?? 0;

  if (limit === 0) {
    return { used, limit: 0, percent: 0 };
  }

  const percent = (used / limit) * 100;
  return { used, limit, percent };
}

export function computeNetworkIO(
  stats: ContainerStatsInfo,
): { rx: number; tx: number } {
  let rx = 0;
  let tx = 0;

  if (stats.networks) {
    for (const iface of Object.values(stats.networks)) {
      const netIface = iface as { rx_bytes?: number; tx_bytes?: number };
      rx += netIface.rx_bytes ?? 0;
      tx += netIface.tx_bytes ?? 0;
    }
  }

  return { rx, tx };
}

export function computeBlockIO(
  stats: ContainerStatsInfo,
): { read: number; write: number } {
  let read = 0;
  let write = 0;

  const blkio = stats.blkio_stats;
  if (!blkio?.io_service_bytes_recursive) {
    return { read, write };
  }

  for (const entry of blkio.io_service_bytes_recursive) {
    const op = (entry.op ?? '').toLowerCase();
    if (op === 'read') {
      read += entry.value ?? 0;
    } else if (op === 'write') {
      write += entry.value ?? 0;
    }
  }

  return { read, write };
}

export function computeContainerStats(
  container: ContainerInfo,
  stats: ContainerStatsInfo,
  _previous: ProcessedContainerStats | undefined,
): ProcessedContainerStats {
  const cpuUsagePercent = computeCpuPercent(stats);
  const memory = computeMemoryUsage(stats);
  const network = computeNetworkIO(stats);
  const blockIO = computeBlockIO(stats);

  return {
    id: container.Id,
    name: container.Names?.[0] ?? container.Id.substring(0, 12),
    image: container.Image ?? 'unknown',
    state: container.State ?? 'running',
    engineId: container.engineId,
    cpuUsagePercent,
    memoryUsed: memory.used,
    memoryLimit: memory.limit,
    memoryUsagePercent: memory.percent,
    networkRx: network.rx,
    networkTx: network.tx,
    blockRead: blockIO.read,
    blockWrite: blockIO.write,
    pids: stats.pids_stats?.current ?? 0,
    timestamp: Date.now(),
  };
}
