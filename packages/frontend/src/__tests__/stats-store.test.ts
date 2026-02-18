// packages/frontend/src/__tests__/stats-store.test.ts
import { describe, it, expect } from 'vitest';
import { statsSnapshot, initStatsListener } from '../stores/stats-store';
import { get } from 'svelte/store';

describe('statsSnapshot store', () => {
  it('should initialize as undefined', () => {
    expect(get(statsSnapshot)).toBeUndefined();
  });

  it('should update when stats-update message received', () => {
    initStatsListener();

    const mockSnapshot = {
      timestamp: 1000,
      containers: [],
      host: {
        cpuUsagePercent: 10,
        cpuCount: 2,
        memoryTotal: 8000,
        memoryUsed: 4000,
        memoryFree: 4000,
        memoryUsagePercent: 50,
        uptime: 100,
        platform: 'linux',
        hostname: 'test',
      },
    };

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'stats-update', payload: mockSnapshot },
      }),
    );

    expect(get(statsSnapshot)).toEqual(mockSnapshot);
  });

  it('should ignore non-stats-update messages', () => {
    initStatsListener();
    statsSnapshot.set(undefined);

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'other-message', payload: {} },
      }),
    );

    expect(get(statsSnapshot)).toBeUndefined();
  });
});
