<script lang="ts">
  import { statsSnapshot } from './stores/stats-store';
  import HostOverview from './components/HostOverview.svelte';
  import ContainerTable from './components/ContainerTable.svelte';
</script>

<div class="p-6 space-y-6">
  {#if $statsSnapshot}
    <HostOverview stats={$statsSnapshot.host} />
    <ContainerTable containers={$statsSnapshot.containers} />
  {:else}
    <div class="text-center text-[var(--pd-content-card-text)] py-8">
      Loading stats...
    </div>
  {/if}
</div>
