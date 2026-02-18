// packages/backend/src/__tests__/logger.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { log, warn, error } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should log with [container-stats] prefix', () => {
    log('test message');
    expect(console.log).toHaveBeenCalledWith('[container-stats] test message');
  });

  it('should warn with [container-stats] prefix', () => {
    warn('warning message');
    expect(console.warn).toHaveBeenCalledWith('[container-stats] warning message');
  });

  it('should error with [container-stats] prefix', () => {
    error('error message');
    expect(console.error).toHaveBeenCalledWith('[container-stats] error message');
  });

  it('should pass additional args', () => {
    log('test', 'arg1', 42);
    expect(console.log).toHaveBeenCalledWith('[container-stats] test', 'arg1', 42);
  });
});
