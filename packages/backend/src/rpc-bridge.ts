// packages/backend/src/rpc-bridge.ts
import type { Disposable, Webview } from '@podman-desktop/api';
import type { StatsSnapshot, RpcMessage, RpcCommand } from '@extension-stats/shared';
import type { StatsManager, StatsListener } from './stats-manager';

export class RpcBridge implements StatsListener {
  private disposable: Disposable;

  constructor(
    private webview: Webview,
    private statsManager: StatsManager,
  ) {
    this.statsManager.setListener(this);

    this.disposable = webview.onDidReceiveMessage((message: unknown) => {
      this.handleCommand(message as RpcCommand);
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
