<script lang="ts">
  import type { HostStats } from '@podman-desktop-stats/shared';
  import StatsBar from './StatsBar.svelte';

  interface Props {
    stats: HostStats;
  }

  let { stats }: Props = $props();

  function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
  }

  function formatBytes(bytes: number): string {
    const gb = bytes / 1024 / 1024 / 1024;
    // Use integer format when value is whole number
    if (gb === Math.floor(gb)) {
      return Math.floor(gb) + ' GB';
    }
    return gb.toFixed(1) + ' GB';
  }
</script>

<div class="space-y-4">
  <h2 class="text-xl font-bold">Host System Overview</h2>

  <div class="grid grid-cols-4 gap-4">
    <!-- CPU Usage -->
    <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded">
      <div class="text-sm text-gray-600 dark:text-gray-400">CPU</div>
      <div class="text-2xl font-bold">{stats.cpuUsagePercent.toFixed(1)}%</div>
      <StatsBar value={stats.cpuUsagePercent} max={100} />
    </div>

    <!-- Memory -->
    <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded">
      <div class="text-sm text-gray-600 dark:text-gray-400">Memory</div>
      <div class="text-lg font-bold">
        {formatBytes(stats.memoryUsed)} / {formatBytes(stats.memoryTotal)}
      </div>
      <StatsBar value={stats.memoryUsed} max={stats.memoryTotal} />
    </div>

    <!-- CPU Cores -->
    <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded">
      <div class="text-sm text-gray-600 dark:text-gray-400">Cores</div>
      <div class="text-2xl font-bold">{stats.cpuCount} cores</div>
    </div>

    <!-- Uptime -->
    <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded">
      <div class="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
      <div class="text-2xl font-bold">{formatUptime(stats.uptime)}</div>
    </div>
  </div>
</div>
