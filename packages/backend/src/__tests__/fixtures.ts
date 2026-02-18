// packages/backend/src/__tests__/fixtures.ts

export interface MockCpuStats {
  cpu_usage: { total_usage: number };
  system_cpu_usage: number;
  online_cpus: number;
  throttling_data?: Record<string, unknown>;
}

export interface MockMemoryStats {
  usage: number;
  limit: number;
  stats?: Record<string, number>;
  max_usage?: number;
  failcnt?: number;
}

export interface MockBlkioEntry {
  op: string;
  value: number;
}

export interface MockStatsInfo {
  cpu_stats: MockCpuStats;
  precpu_stats: MockCpuStats;
  memory_stats: MockMemoryStats;
  networks?: Record<string, { rx_bytes?: number; tx_bytes?: number }>;
  blkio_stats?: {
    io_service_bytes_recursive?: MockBlkioEntry[];
  };
  pids_stats?: { current?: number };
  read?: string;
  preread?: string;
  num_procs?: number;
}

export function createMockStatsInfo(
  overrides: Partial<MockStatsInfo> = {},
): MockStatsInfo {
  return {
    cpu_stats: {
      cpu_usage: { total_usage: 200_000_000 },
      system_cpu_usage: 1_000_000_000,
      online_cpus: 4,
    },
    precpu_stats: {
      cpu_usage: { total_usage: 100_000_000 },
      system_cpu_usage: 500_000_000,
      online_cpus: 4,
    },
    memory_stats: {
      usage: 268435456,
      limit: 536870912,
    },
    networks: {
      eth0: { rx_bytes: 1024, tx_bytes: 2048 },
    },
    blkio_stats: {
      io_service_bytes_recursive: [
        { op: 'read', value: 4096 },
        { op: 'write', value: 8192 },
      ],
    },
    pids_stats: { current: 12 },
    ...overrides,
  };
}

export interface MockContainerInfo {
  Id: string;
  Names: string[];
  Image: string;
  State: string;
  engineId: string;
}

export function createMockContainerInfo(
  overrides: Partial<MockContainerInfo> = {},
): MockContainerInfo {
  return {
    Id: 'abc123def456',
    Names: ['my-container'],
    Image: 'nginx:latest',
    State: 'running',
    engineId: 'podman',
    ...overrides,
  };
}
