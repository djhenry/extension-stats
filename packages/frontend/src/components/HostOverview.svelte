<script lang="ts">
  import type { HostStats } from '@extension-stats/shared';
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
  <h2 class="text-xl font-bold capitalize text-[var(--pd-content-header)]">Host System Overview</h2>

  <div class="grid grid-cols-4 gap-4">
    <!-- CPU Usage -->
    <div class="p-4 bg-[var(--pd-content-card-bg)] rounded-md">
      <div class="text-sm text-[var(--pd-content-card-text)]">CPU</div>
      <div class="text-2xl font-medium text-[var(--pd-content-card-title)]">{stats.cpuUsagePercent.toFixed(1)}%</div>
      <StatsBar value={stats.cpuUsagePercent} max={100} />
    </div>

    <!-- Memory -->
    <div class="p-4 bg-[var(--pd-content-card-bg)] rounded-md">
      <div class="text-sm text-[var(--pd-content-card-text)]">Memory</div>
      <div class="text-lg font-medium text-[var(--pd-content-card-title)]">
        {formatBytes(stats.memoryUsed)} / {formatBytes(stats.memoryTotal)}
      </div>
      <StatsBar value={stats.memoryUsed} max={stats.memoryTotal} />
    </div>

    <!-- CPU Cores -->
    <div class="p-4 bg-[var(--pd-content-card-bg)] rounded-md">
      <div class="text-sm text-[var(--pd-content-card-text)]">Cores</div>
      <div class="text-2xl font-medium text-[var(--pd-content-card-title)]">{stats.cpuCount} cores</div>
    </div>

    <!-- Uptime -->
    <div class="p-4 bg-[var(--pd-content-card-bg)] rounded-md">
      <div class="text-sm text-[var(--pd-content-card-text)]">Uptime</div>
      <div class="text-2xl font-medium text-[var(--pd-content-card-title)]">{formatUptime(stats.uptime)}</div>
    </div>
  </div>
</div>
