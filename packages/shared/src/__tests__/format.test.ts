// packages/shared/src/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatBytes, formatPercent, formatUptime } from '../format';

describe('formatBytes', () => {
  it('should format 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('should format bytes (< 1 KB)', () => {
    expect(formatBytes(500)).toBe('500.0 B');
  });

  it('should format kilobytes', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });

  it('should format megabytes', () => {
    expect(formatBytes(1048576)).toBe('1.0 MB');
    expect(formatBytes(268435456)).toBe('256.0 MB');
  });

  it('should format gigabytes', () => {
    expect(formatBytes(1073741824)).toBe('1.0 GB');
    expect(formatBytes(17179869184)).toBe('16.0 GB');
  });

  it('should format terabytes', () => {
    expect(formatBytes(1099511627776)).toBe('1.0 TB');
  });

  it('should handle negative values', () => {
    expect(formatBytes(-1024)).toBe('-1.0 KB');
  });

  it('should respect decimals parameter', () => {
    expect(formatBytes(1536, 2)).toBe('1.50 KB');
    expect(formatBytes(1536, 0)).toBe('2 KB');
  });
});

describe('formatPercent', () => {
  it('should format percentage with default 1 decimal', () => {
    expect(formatPercent(45.23)).toBe('45.2%');
  });

  it('should format 0%', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('should format 100%', () => {
    expect(formatPercent(100)).toBe('100.0%');
  });

  it('should handle values > 100%', () => {
    expect(formatPercent(150.7)).toBe('150.7%');
  });

  it('should respect decimals parameter', () => {
    expect(formatPercent(45.236, 2)).toBe('45.24%');
    expect(formatPercent(45.236, 0)).toBe('45%');
  });
});

describe('formatUptime', () => {
  it('should format minutes only', () => {
    expect(formatUptime(300)).toBe('5m');
    expect(formatUptime(59)).toBe('0m');
  });

  it('should format hours and minutes', () => {
    expect(formatUptime(3600)).toBe('1h 0m');
    expect(formatUptime(5400)).toBe('1h 30m');
  });

  it('should format days and hours', () => {
    expect(formatUptime(86400)).toBe('1d 0h');
    expect(formatUptime(90000)).toBe('1d 1h');
    expect(formatUptime(302400)).toBe('3d 12h');
  });

  it('should handle 0 seconds', () => {
    expect(formatUptime(0)).toBe('0m');
  });
});
