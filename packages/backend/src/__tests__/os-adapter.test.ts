// packages/backend/src/__tests__/os-adapter.test.ts
import { describe, it, expect } from 'vitest';
import { NodeOsAdapter } from '../adapters/os-adapter';

describe('NodeOsAdapter', () => {
  const adapter = new NodeOsAdapter();

  it('should return CPU info array', () => {
    const cpus = adapter.cpus();
    expect(Array.isArray(cpus)).toBe(true);
    expect(cpus.length).toBeGreaterThan(0);
    expect(cpus[0]).toHaveProperty('times');
  });

  it('should return total memory > 0', () => {
    expect(adapter.totalmem()).toBeGreaterThan(0);
  });

  it('should return free memory > 0', () => {
    expect(adapter.freemem()).toBeGreaterThan(0);
  });

  it('should return uptime > 0', () => {
    expect(adapter.uptime()).toBeGreaterThan(0);
  });

  it('should return a valid platform string', () => {
    const platform = adapter.platform();
    expect(['linux', 'darwin', 'win32', 'freebsd']).toContain(platform);
  });

  it('should return a non-empty hostname', () => {
    expect(adapter.hostname().length).toBeGreaterThan(0);
  });
});
