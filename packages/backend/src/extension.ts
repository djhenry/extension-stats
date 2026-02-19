// packages/backend/src/extension.ts
import * as podmanDesktopAPI from '@podman-desktop/api';
import { StatsManager } from './stats-manager';
import { ConfigManager } from './config-manager';
import { RpcBridge } from './rpc-bridge';
import { ContainerStatsCollector } from './container-stats-collector';
import { HostStatsCollector } from './host-stats-collector';
import { PodmanDesktopContainerEngine } from './adapters/container-engine-adapter';
import { NodeOsAdapter } from './adapters/os-adapter';
import * as fs from 'node:fs';
import * as path from 'node:path';

let statsManager: StatsManager | undefined;

export async function activate(
  extensionContext: podmanDesktopAPI.ExtensionContext,
): Promise<void> {
  const configManager = new ConfigManager(extensionContext);

  const panel = podmanDesktopAPI.window.createWebviewPanel(
    'container-stats',
    'Container Stats',
    {
      localResourceRoots: [podmanDesktopAPI.Uri.file(path.join(extensionContext.extensionPath, 'media'))],
    },
  );

  // Load and set the webview HTML
  const htmlPath = path.join(extensionContext.extensionPath, 'media', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Convert asset paths to webview URIs
  const mediaPath = podmanDesktopAPI.Uri.file(path.join(extensionContext.extensionPath, 'media'));
  const mediaUri = panel.webview.asWebviewUri(mediaPath);

  // Replace absolute paths with webview URIs
  const updatedHtml = html
    .replace(/src="\/assets\//g, `src="${mediaUri}/assets/`)
    .replace(/href="\/assets\//g, `href="${mediaUri}/assets/`);

  panel.webview.html = updatedHtml;

  // Create adapters
  const containerEngineAdapter = new PodmanDesktopContainerEngine();
  const osAdapter = new NodeOsAdapter();

  // Create collectors
  const containerCollector = new ContainerStatsCollector(containerEngineAdapter);
  const hostCollector = new HostStatsCollector(osAdapter);

  // Create stats manager
  statsManager = new StatsManager(configManager, containerCollector, hostCollector);

  // Create RPC bridge
  const rpcBridge = new RpcBridge(panel.webview, statsManager);

  // Start/stop polling based on webview visibility
  panel.onDidChangeViewState(({ webviewPanel }) => {
    if (webviewPanel.visible) {
      statsManager?.start();
    } else {
      statsManager?.stop();
    }
  });

  extensionContext.subscriptions.push(panel);
  extensionContext.subscriptions.push(rpcBridge);
  extensionContext.subscriptions.push({
    dispose: () => {
      statsManager?.stop();
      statsManager = undefined;
    },
  });
}

export async function deactivate(): Promise<void> {
  statsManager?.stop();
  statsManager = undefined;
}
