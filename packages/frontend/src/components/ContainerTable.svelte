<script lang="ts">
  import type { ContainerStats } from '@extension-stats/shared';

  interface Props {
    containers: ContainerStats[];
  }

  let { containers }: Props = $props();

  type SortKey = 'name' | 'cpuUsagePercent' | 'memoryUsed' | 'memoryUsagePercent' | 'networkRx' | 'networkTx' | 'blockRead' | 'blockWrite' | 'pids';

  interface Column {
    key: SortKey;
    label: string;
    flex: string;
    align: string;
    comparator: (a: ContainerStats, b: ContainerStats) => number;
  }

  const columns: Column[] = [
    { key: 'name', label: 'Name', flex: 'flex-[2]', align: 'text-left', comparator: (a, b) => a.name.localeCompare(b.name) },
    { key: 'cpuUsagePercent', label: 'CPU %', flex: 'flex-1', align: 'text-right', comparator: (a, b) => a.cpuUsagePercent - b.cpuUsagePercent },
    { key: 'memoryUsed', label: 'Memory', flex: 'flex-[2]', align: 'text-right', comparator: (a, b) => a.memoryUsed - b.memoryUsed },
    { key: 'memoryUsagePercent', label: 'Mem %', flex: 'flex-1', align: 'text-right', comparator: (a, b) => a.memoryUsagePercent - b.memoryUsagePercent },
    { key: 'networkRx', label: 'Net RX', flex: 'flex-1', align: 'text-right', comparator: (a, b) => a.networkRx - b.networkRx },
    { key: 'networkTx', label: 'Net TX', flex: 'flex-1', align: 'text-right', comparator: (a, b) => a.networkTx - b.networkTx },
    { key: 'blockRead', label: 'Block R', flex: 'flex-1', align: 'text-right', comparator: (a, b) => a.blockRead - b.blockRead },
    { key: 'blockWrite', label: 'Block W', flex: 'flex-1', align: 'text-right', comparator: (a, b) => a.blockWrite - b.blockWrite },
    { key: 'pids', label: 'PIDs', flex: 'flex-1', align: 'text-right', comparator: (a, b) => a.pids - b.pids },
  ];

  let sortKey: SortKey = $state('name');
  let sortAscending: boolean = $state(true);

  const sortedContainers = $derived(() => {
    const col = columns.find(c => c.key === sortKey);
    if (!col) return [...containers];
    const sorted = [...containers].sort(col.comparator);
    return sortAscending ? sorted : sorted.reverse();
  });

  function handleSort(key: SortKey): void {
    if (sortKey === key) {
      sortAscending = !sortAscending;
    } else {
      sortKey = key;
      sortAscending = true;
    }
  }

  function sortIndicator(key: SortKey): string {
    if (sortKey !== key) return '⇅';
    return sortAscending ? '▲' : '▼';
  }

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
        {#each columns as col}
          <!-- svelte-ignore a11y_interactive_supports_focus -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div
            class="{col.flex} min-w-0 {col.align} cursor-pointer select-none"
            role="columnheader"
            aria-sort={sortKey === col.key ? (sortAscending ? 'ascending' : 'descending') : 'none'}
            onclick={() => handleSort(col.key)}
          >
            {col.label}
            <span class={sortKey === col.key ? '' : 'text-[var(--pd-table-header-unsorted)]'}>{sortIndicator(col.key)}</span>
          </div>
        {/each}
      </div>

      <!-- Body rows -->
      {#each sortedContainers() as container}
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
