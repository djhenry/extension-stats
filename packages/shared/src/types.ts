// packages/shared/src/types.ts

/** Processed container stats ready for display */
export interface ProcessedContainerStats {
  /** Container ID (from Podman) */
  id: string;
  /** Container name(s) */
  name: string;
  /** Container image name */
  image: string;
  /** Container state (should always be "running" for active stats) */
  state: string;
  /** Engine ID that manages this container */
  engineId: string;
  /** CPU usage as a percentage (0-100+, can exceed 100 on multi-core) */
  cpuUsagePercent: number;
  /** Memory used in bytes */
  memoryUsed: number;
  /** Memory limit in bytes (0 = no limit) */
  memoryLimit: number;
  /** Memory usage as a percentage (0-100) */
  memoryUsagePercent: number;
  /** Network bytes received */
  networkRx: number;
  /** Network bytes transmitted */
  networkTx: number;
  /** Block I/O bytes read */
  blockRead: number;
  /** Block I/O bytes written */
  blockWrite: number;
  /** Number of PIDs in the container */
  pids: number;
  /** Timestamp of this stats reading */
  timestamp: number;
}

/** Host system resource statistics */
export interface HostStats {
  /** CPU usage as a percentage (0-100) */
  cpuUsagePercent: number;
  /** Number of logical CPU cores */
  cpuCount: number;
  /** Total physical memory in bytes */
  memoryTotal: number;
  /** Used memory in bytes */
  memoryUsed: number;
  /** Free memory in bytes */
  memoryFree: number;
  /** Memory usage as a percentage (0-100) */
  memoryUsagePercent: number;
  /** System uptime in seconds */
  uptime: number;
  /** OS platform identifier */
  platform: string;
  /** Hostname */
  hostname: string;
}

/** A complete snapshot of all stats at a point in time */
export interface StatsSnapshot {
  /** Timestamp when snapshot was assembled (ms since epoch) */
  timestamp: number;
  /** Stats for all currently running containers */
  containers: ProcessedContainerStats[];
  /** Host system stats */
  host: HostStats;
}

/** Aggregated CPU times for delta computation */
export interface CpuTimes {
  idle: number;
  total: number;
}
