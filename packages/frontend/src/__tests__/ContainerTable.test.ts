// packages/frontend/src/__tests__/ContainerTable.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ContainerTable from '../components/ContainerTable.svelte';

function makeContainer(overrides: Record<string, unknown> = {}) {
  return {
    id: 'c1',
    name: 'alpha',
    image: 'nginx',
    state: 'running',
    engineId: 'podman',
    cpuUsagePercent: 10,
    memoryUsed: 100_000,
    memoryLimit: 500_000,
    memoryUsagePercent: 20,
    networkRx: 1024,
    networkTx: 2048,
    blockRead: 4096,
    blockWrite: 8192,
    pids: 5,
    timestamp: Date.now(),
    ...overrides,
  };
}

describe('ContainerTable', () => {
  it('should show empty state when no containers', () => {
    render(ContainerTable, { props: { containers: [] } });
    expect(screen.getByText(/no running containers/i)).toBeTruthy();
  });

  it('should render rows for each container', () => {
    const containers = [makeContainer({ name: 'web-app' })];
    render(ContainerTable, { props: { containers } });
    expect(screen.getByText('web-app')).toBeTruthy();
  });

  it('should sort by name ascending by default', () => {
    const containers = [
      makeContainer({ id: 'c1', name: 'charlie' }),
      makeContainer({ id: 'c2', name: 'alpha' }),
      makeContainer({ id: 'c3', name: 'bravo' }),
    ];
    render(ContainerTable, { props: { containers } });

    const rows = screen.getAllByRole('row');
    // First row is header, data rows follow
    const dataRows = rows.slice(1);
    expect(dataRows[0].textContent).toContain('alpha');
    expect(dataRows[1].textContent).toContain('bravo');
    expect(dataRows[2].textContent).toContain('charlie');
  });

  it('should sort by a numeric column when its header is clicked', async () => {
    const containers = [
      makeContainer({ id: 'c1', name: 'low-cpu', cpuUsagePercent: 5 }),
      makeContainer({ id: 'c2', name: 'high-cpu', cpuUsagePercent: 90 }),
      makeContainer({ id: 'c3', name: 'mid-cpu', cpuUsagePercent: 50 }),
    ];
    render(ContainerTable, { props: { containers } });

    const cpuHeader = screen.getByRole('columnheader', { name: /cpu %/i });
    await fireEvent.click(cpuHeader);

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0].textContent).toContain('low-cpu');
    expect(rows[1].textContent).toContain('mid-cpu');
    expect(rows[2].textContent).toContain('high-cpu');
  });

  it('should toggle sort direction when clicking the same header again', async () => {
    const containers = [
      makeContainer({ id: 'c1', name: 'alpha' }),
      makeContainer({ id: 'c2', name: 'charlie' }),
      makeContainer({ id: 'c3', name: 'bravo' }),
    ];
    render(ContainerTable, { props: { containers } });

    const nameHeader = screen.getByRole('columnheader', { name: /name/i });

    // Default is ascending
    let rows = screen.getAllByRole('row').slice(1);
    expect(rows[0].textContent).toContain('alpha');

    // Click to toggle to descending
    await fireEvent.click(nameHeader);
    rows = screen.getAllByRole('row').slice(1);
    expect(rows[0].textContent).toContain('charlie');
    expect(rows[2].textContent).toContain('alpha');
  });

  it('should show sort indicator on active column', () => {
    const containers = [makeContainer()];
    render(ContainerTable, { props: { containers } });

    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    // Default sort is name ascending, so should have ▲
    expect(nameHeader.textContent).toContain('▲');

    // Other columns should have ⇅
    const cpuHeader = screen.getByRole('columnheader', { name: /cpu %/i });
    expect(cpuHeader.textContent).toContain('⇅');
  });

  it('should set aria-sort attribute on sorted column', async () => {
    const containers = [makeContainer()];
    render(ContainerTable, { props: { containers } });

    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');

    await fireEvent.click(nameHeader);
    expect(nameHeader.getAttribute('aria-sort')).toBe('descending');

    const cpuHeader = screen.getByRole('columnheader', { name: /cpu %/i });
    expect(cpuHeader.getAttribute('aria-sort')).toBe('none');
  });
});
