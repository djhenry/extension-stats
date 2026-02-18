// packages/backend/src/config-manager.ts
import * as podmanDesktopAPI from '@podman-desktop/api';

const CONFIG_SECTION = 'containerStats';
const DEFAULT_REFRESH_INTERVAL_S = 3;
const MIN_REFRESH_INTERVAL_S = 1;
const MAX_REFRESH_INTERVAL_S = 30;

export class ConfigManager {
  constructor(private extensionContext: podmanDesktopAPI.ExtensionContext) {}

  getRefreshIntervalMs(): number {
    const config = podmanDesktopAPI.configuration.getConfiguration(CONFIG_SECTION);
    const value = config.get<number>('refreshInterval') ?? DEFAULT_REFRESH_INTERVAL_S;
    const clamped = Math.max(MIN_REFRESH_INTERVAL_S, Math.min(MAX_REFRESH_INTERVAL_S, value));
    return clamped * 1000;
  }

  getRefreshIntervalSeconds(): number {
    return this.getRefreshIntervalMs() / 1000;
  }

  onDidChangeConfiguration(callback: () => void): podmanDesktopAPI.Disposable {
    return podmanDesktopAPI.configuration.onDidChangeConfiguration(e => {
      if (e.key.startsWith(`${CONFIG_SECTION}.`)) {
        callback();
      }
    });
  }
}
