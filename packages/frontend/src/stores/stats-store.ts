// packages/frontend/src/stores/stats-store.ts
import { writable } from 'svelte/store';
import type { StatsSnapshot } from '@podman-desktop-stats/shared';

export const statsSnapshot = writable<StatsSnapshot | undefined>(undefined);

export function initStatsListener(): void {
  window.addEventListener('message', (event: MessageEvent) => {
    const message = event.data;
    if (message?.type === 'stats-update') {
      statsSnapshot.set(message.payload);
    }
  });
}
