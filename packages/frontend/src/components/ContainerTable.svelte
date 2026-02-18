<script lang="ts">
  import type { ContainerStats } from '@podman-desktop-stats/shared';

  interface Props {
    containers: ContainerStats[];
  }

  let { containers }: Props = $props();

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    if (mb < 1024) return mb.toFixed(1) + ' MB';
    const gb = mb / 1024;
    return gb.toFixed(1) + ' GB';
  }
</script>

<div class="space-y-4">
  <h2 class="text-xl font-bold">Container Stats</h2>

  {#if containers.length === 0}
    <div class="text-center text-gray-500 dark:text-gray-400 py-8">
      No running containers
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">CPU %</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Memory</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mem %</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Net RX</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Net TX</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Block R</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Block W</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">PIDs</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {#each containers as container}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{container.name}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{container.cpuUsagePercent.toFixed(1)}%</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {formatBytes(container.memoryUsed)} / {formatBytes(container.memoryLimit)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{container.memoryUsagePercent.toFixed(1)}%</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{formatBytes(container.networkRx)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{formatBytes(container.networkTx)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{formatBytes(container.blockRead)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{formatBytes(container.blockWrite)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{container.pids}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
