// packages/shared/src/rpc-types.ts
import type { StatsSnapshot } from './types';

/** Message sent from backend to frontend */
export interface RpcMessage {
  type: 'stats-update';
  payload: StatsSnapshot;
}

/** Command sent from frontend to backend */
export interface RpcCommand {
  type: 'request-refresh' | 'set-interval';
  payload?: unknown;
}
