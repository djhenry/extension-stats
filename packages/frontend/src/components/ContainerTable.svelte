<script lang="ts">
  import type { ContainerStats } from '@extension-stats/shared';

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
  <h2 class="text-xl font-bold capitalize text-[var(--pd-content-header)]">Container Stats</h2>

  {#if containers.length === 0}
    <div class="text-center text-[var(--pd-content-card-text)] py-8">
      No running containers
    </div>
  {:else}
    <div class="overflow-x-auto" role="table" aria-label="container stats">
      <!-- Header row -->
      <div class="flex items-center h-7 uppercase text-sm font-semibold text-[var(--pd-table-header-text)] mb-1 px-4" role="row">
        <div class="flex-[2] min-w-0" role="columnheader">Name</div>
        <div class="flex-1 min-w-0 text-right" role="columnheader">CPU %</div>
        <div class="flex-[2] min-w-0 text-right" role="columnheader">Memory</div>
        <div class="flex-1 min-w-0 text-right" role="columnheader">Mem %</div>
        <div class="flex-1 min-w-0 text-right" role="columnheader">Net RX</div>
        <div class="flex-1 min-w-0 text-right" role="columnheader">Net TX</div>
        <div class="flex-1 min-w-0 text-right" role="columnheader">Block R</div>
        <div class="flex-1 min-w-0 text-right" role="columnheader">Block W</div>
        <div class="flex-1 min-w-0 text-right" role="columnheader">PIDs</div>
      </div>

      <!-- Body rows -->
      {#each containers as container}
        <div class="flex items-center min-h-[48px] bg-[var(--pd-content-card-bg)] rounded-lg mb-2 border border-[var(--pd-content-table-border)] hover:bg-[var(--pd-content-card-hover-bg)] px-4 py-1.5" role="row">
          <div class="flex-[2] min-w-0 whitespace-nowrap overflow-hidden text-ellipsis text-base text-[var(--pd-table-body-text-highlight)]" role="cell">{container.name}</div>
          <div class="flex-1 min-w-0 text-right whitespace-nowrap text-base text-[var(--pd-table-body-text)]" role="cell">{container.cpuUsagePercent.toFixed(1)}%</div>
          <div class="flex-[2] min-w-0 text-right whitespace-nowrap text-base text-[var(--pd-table-body-text)]" role="cell">
            {formatBytes(container.memoryUsed)} / {formatBytes(container.memoryLimit)}
          </div>
          <div class="flex-1 min-w-0 text-right whitespace-nowrap text-base text-[var(--pd-table-body-text)]" role="cell">{container.memoryUsagePercent.toFixed(1)}%</div>
          <div class="flex-1 min-w-0 text-right whitespace-nowrap text-base text-[var(--pd-table-body-text)]" role="cell">{formatBytes(container.networkRx)}</div>
          <div class="flex-1 min-w-0 text-right whitespace-nowrap text-base text-[var(--pd-table-body-text)]" role="cell">{formatBytes(container.networkTx)}</div>
          <div class="flex-1 min-w-0 text-right whitespace-nowrap text-base text-[var(--pd-table-body-text)]" role="cell">{formatBytes(container.blockRead)}</div>
          <div class="flex-1 min-w-0 text-right whitespace-nowrap text-base text-[var(--pd-table-body-text)]" role="cell">{formatBytes(container.blockWrite)}</div>
          <div class="flex-1 min-w-0 text-right whitespace-nowrap text-base text-[var(--pd-table-body-text)]" role="cell">{container.pids}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>
