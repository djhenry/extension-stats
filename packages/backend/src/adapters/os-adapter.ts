// packages/backend/src/adapters/os-adapter.ts
import * as os from 'node:os';

export interface OsPort {
  cpus(): os.CpuInfo[];
  totalmem(): number;
  freemem(): number;
  uptime(): number;
  platform(): NodeJS.Platform;
  hostname(): string;
}

export class NodeOsAdapter implements OsPort {
  cpus(): os.CpuInfo[] { return os.cpus(); }
  totalmem(): number { return os.totalmem(); }
  freemem(): number { return os.freemem(); }
  uptime(): number { return os.uptime(); }
  platform(): NodeJS.Platform { return os.platform(); }
  hostname(): string { return os.hostname(); }
}
