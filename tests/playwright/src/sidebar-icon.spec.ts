import { existsSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

import {
  expect as playExpect,
  test,
  RunnerOptions,
} from '@podman-desktop/tests-playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXTENSION_LABEL = 'dhenry.extension-stats';
const EXTENSION_NAME = 'Container Stats';
const CUSTOM_FOLDER = 'extension-stats-tests';

// Matches the Runner's output path: {customOutputFolder}/{profile}/{customFolder}
// CWD is tests/playwright/ and customOutputFolder is 'output/'
const PD_HOME = resolve(__dirname, '..', 'output', CUSTOM_FOLDER);
const PLUGINS_DIR = join(PD_HOME, 'plugins');
const EXTENSION_DIR = join(PLUGINS_DIR, EXTENSION_LABEL);
const PROJECT_ROOT = resolve(__dirname, '..', '..', '..');
const BACKEND_DIR = resolve(PROJECT_ROOT, 'packages', 'backend');

// Pre-install the extension into the plugins directory before PD launches
function preInstallExtension(): void {
  // Build the extension first
  console.log('Building extension...');
  execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit' });

  // Create the plugins directory
  mkdirSync(EXTENSION_DIR, { recursive: true });

  // Copy package.json and icon from packages/backend
  const filesToCopy = ['package.json', 'icon.png'];
  for (const file of filesToCopy) {
    const src = join(BACKEND_DIR, file);
    if (existsSync(src)) {
      cpSync(src, join(EXTENSION_DIR, file));
    }
  }

  // Copy the dist directory
  const distSrc = join(BACKEND_DIR, 'dist');
  if (existsSync(distSrc)) {
    cpSync(distSrc, join(EXTENSION_DIR, 'dist'), { recursive: true });
  }

  // Copy the media directory if it exists
  const mediaSrc = join(BACKEND_DIR, 'media');
  if (existsSync(mediaSrc)) {
    cpSync(mediaSrc, join(EXTENSION_DIR, 'media'), { recursive: true });
  }

  console.log(`Extension pre-installed to ${EXTENSION_DIR}`);
  console.log('Contents:', readdirSync(EXTENSION_DIR));
}

// Run pre-installation before the Runner starts
preInstallExtension();

test.use({
  runnerOptions: new RunnerOptions({
    customFolder: CUSTOM_FOLDER,
    customOutputFolder: 'output/',
    autoUpdate: false,
    autoCheckUpdates: false,
  }),
});

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('sidebar-icon-e2e');
  await welcomePage.handleWelcomePage(true);

  // Wait for extensions to finish loading
  await page.waitForTimeout(5_000);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial('Sidebar icon verification', () => {
  test('extension should be installed and active', async ({ navigationBar }) => {
    const extensionsPage = await navigationBar.openExtensions();
    await playExpect
      .poll(async () => await extensionsPage.extensionIsInstalled(EXTENSION_LABEL), {
        timeout: 30_000,
      })
      .toBeTruthy();
  });

  test('sidebar icon should be visible', async ({ page, runner }) => {
    const navBar = page.getByRole('navigation', { name: 'AppNavigation' });
    await playExpect(navBar).toBeVisible({ timeout: 30_000 });

    const statsLink = navBar.getByRole('link', { name: new RegExp(EXTENSION_NAME, 'i') });
    await playExpect(statsLink).toBeVisible({ timeout: 30_000 });

    // Capture the link's inner HTML for debugging
    const innerHTML = await statsLink.innerHTML();
    console.log('Container Stats link innerHTML:', innerHTML);

    // Take screenshot before assertions for debugging
    await runner.screenshot('sidebar-icon.png');

    // The icon should be an <img> inside the nav link
    const icon = statsLink.locator('img');
    await playExpect(icon).toBeVisible();

    // The img src should be non-empty (this is the actual bug check)
    const src = await icon.getAttribute('src');
    playExpect(src).toBeTruthy();
    playExpect(src!.length).toBeGreaterThan(0);
  });

  test('Container Stats panel should open on click', async ({ page }) => {
    const navBar = page.getByRole('navigation', { name: 'AppNavigation' });
    const statsLink = navBar.getByRole('link', { name: new RegExp(EXTENSION_NAME, 'i') });

    await statsLink.click();

    // The extension webview should appear
    const webview = page.getByRole('document', { name: /Webview Container Stats/i });
    await playExpect(webview).toBeVisible({ timeout: 30_000 });
  });
});
