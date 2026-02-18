// packages/backend/src/logger.ts

export function log(message: string, ...args: unknown[]): void {
  console.log(`[container-stats] ${message}`, ...args);
}

export function warn(message: string, ...args: unknown[]): void {
  console.warn(`[container-stats] ${message}`, ...args);
}

export function error(message: string, ...args: unknown[]): void {
  console.error(`[container-stats] ${message}`, ...args);
}
