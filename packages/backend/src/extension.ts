// packages/backend/src/extension.ts
import type { ExtensionContext } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { StatsManager } from './stats-manager';
import { ConfigManager } from './config-manager';
import { RpcBridge } from './rpc-bridge';
import { ContainerStatsCollector } from './container-stats-collector';
import { HostStatsCollector } from './host-stats-collector';
import { PodmanDesktopContainerEngine } from './adapters/container-engine-adapter';
import { NodeOsAdapter } from './adapters/os-adapter';
import fs from 'node:fs';

let statsManager: StatsManager | undefined;

export async function activate(
  extensionContext: ExtensionContext,
): Promise<void> {
  const configManager = new ConfigManager(extensionContext);

  const panel = extensionApi.window.createWebviewPanel(
    'container-stats',
    'Container Stats',
    {
      localResourceRoots: [extensionApi.Uri.joinPath(extensionContext.extensionUri, 'media')],
    },
  );

  // Load and set the webview HTML
  const indexHtmlUri = extensionApi.Uri.joinPath(extensionContext.extensionUri, 'media', 'index.html');
  const indexHtmlPath = indexHtmlUri.fsPath;
  let indexHtml = await fs.promises.readFile(indexHtmlPath, 'utf8');

  // Replace script tags with webview URIs (following official template pattern)
  const scriptLink = indexHtml.match(/<script.*?src="(.*?)".*?>/g);
  if (scriptLink) {
    scriptLink.forEach(link => {
      const src = link.match(/src="(.*?)"/);
      if (src) {
        const webviewSrc = panel.webview.asWebviewUri(
          extensionApi.Uri.joinPath(extensionContext.extensionUri, 'media', src[1]),
        );
        indexHtml = indexHtml.replace(src[1], webviewSrc.toString());
      }
    });
  }

  // Replace link tags with webview URIs
  const cssLink = indexHtml.match(/<link.*?href="(.*?)".*?>/g);
  if (cssLink) {
    cssLink.forEach(link => {
      const href = link.match(/href="(.*?)"/);
      if (href) {
        const webviewHref = panel.webview.asWebviewUri(
          extensionApi.Uri.joinPath(extensionContext.extensionUri, 'media', href[1]),
        );
        indexHtml = indexHtml.replace(href[1], webviewHref.toString());
      }
    });
  }

  panel.webview.html = indexHtml;

  // Add panel to subscriptions
  extensionContext.subscriptions.push(panel);

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
