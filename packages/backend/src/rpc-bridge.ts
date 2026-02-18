// packages/backend/src/rpc-bridge.ts
import type * as podmanDesktopAPI from '@podman-desktop/api';
import type { StatsSnapshot, RpcMessage, RpcCommand } from '@podman-desktop-stats/shared';
import type { StatsManager, StatsListener } from './stats-manager';

export class RpcBridge implements StatsListener {
  private disposable: podmanDesktopAPI.Disposable;

  constructor(
    private webview: podmanDesktopAPI.Webview,
    private statsManager: StatsManager,
  ) {
    this.statsManager.setListener(this);

    this.disposable = webview.onDidReceiveMessage((message: RpcCommand) => {
      this.handleCommand(message);
    });
  }

  onStatsUpdate(snapshot: StatsSnapshot): void {
    const message: RpcMessage = {
      type: 'stats-update',
      payload: snapshot,
    };
    this.webview.postMessage(message);
  }

  private handleCommand(command: RpcCommand): void {
    switch (command.type) {
      case 'request-refresh':
        // Trigger immediate snapshot emission
        this.statsManager.emitSnapshot();
        break;
      case 'set-interval':
        // Handled via PD configuration, not direct RPC
        break;
    }
  }

  dispose(): void {
    this.disposable.dispose();
  }
}
