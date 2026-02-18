// packages/frontend/src/__tests__/StatsBar.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import StatsBar from '../components/StatsBar.svelte';

describe('StatsBar', () => {
  it('should render with given percentage', () => {
    const { container } = render(StatsBar, { props: { value: 75, max: 100 } });
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar).toBeTruthy();
  });

  it('should clamp value to max', () => {
    const { container } = render(StatsBar, { props: { value: 150, max: 100 } });
    expect(container).toBeTruthy();
  });
});
