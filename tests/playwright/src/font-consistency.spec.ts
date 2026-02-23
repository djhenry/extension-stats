import { existsSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import type { Page } from '@playwright/test';

import {
  expect as playExpect,
  test,
  RunnerOptions,
  Runner,
} from '@podman-desktop/tests-playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXTENSION_LABEL = 'dhenry.extension-stats';
const EXTENSION_NAME = 'Container Stats';
const CUSTOM_FOLDER = 'extension-stats-font-tests';

const PD_HOME = resolve(__dirname, '..', 'output', CUSTOM_FOLDER);
const PLUGINS_DIR = join(PD_HOME, 'plugins');
const EXTENSION_DIR = join(PLUGINS_DIR, EXTENSION_LABEL);
const PROJECT_ROOT = resolve(__dirname, '..', '..', '..');
const BACKEND_DIR = resolve(PROJECT_ROOT, 'packages', 'backend');

interface FontStyles {
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
}

function preInstallExtension(): void {
  console.log('Building extension...');
  execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'inherit' });

  mkdirSync(EXTENSION_DIR, { recursive: true });

  const filesToCopy = ['package.json', 'icon.png'];
  for (const file of filesToCopy) {
    const src = join(BACKEND_DIR, file);
    if (existsSync(src)) {
      cpSync(src, join(EXTENSION_DIR, file));
    }
  }

  const distSrc = join(BACKEND_DIR, 'dist');
  if (existsSync(distSrc)) {
    cpSync(distSrc, join(EXTENSION_DIR, 'dist'), { recursive: true });
  }

  const mediaSrc = join(BACKEND_DIR, 'media');
  if (existsSync(mediaSrc)) {
    cpSync(mediaSrc, join(EXTENSION_DIR, 'media'), { recursive: true });
  }

  console.log(`Extension pre-installed to ${EXTENSION_DIR}`);
  console.log('Contents:', readdirSync(EXTENSION_DIR));
}

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
  runner.setVideoAndTraceName('font-consistency-e2e');
  await welcomePage.handleWelcomePage(true);
  await page.waitForTimeout(5_000);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

/**
 * Helper to get computed font styles from an element via page.evaluate.
 */
async function getComputedFontStyles(
  page: Page,
  selector: string,
): Promise<FontStyles> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`Element not found: ${sel}`);
    const computed = window.getComputedStyle(el);
    return {
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      fontFamily: computed.fontFamily,
    };
  }, selector);
}

/**
 * Find the extension webview's page from the Electron app's windows.
 * PD renders <webview> elements which create separate BrowserWindow-like pages.
 */
async function getWebviewPage(runner: Runner): Promise<Page | undefined> {
  const electronApp = runner.getElectronApp();
  const allWindows = electronApp.windows();
  console.log(`Total Electron windows: ${allWindows.length}`);

  for (const win of allWindows) {
    const url = win.url();
    console.log(`  Window URL: ${url}`);
    // The webview page has a URL like http://<uuid>.webview.localhost:<port>/...
    if (url.includes('webview.localhost')) {
      return win;
    }
  }
  return undefined;
}

test.describe.serial('Font consistency with native PD tabs', () => {
  // Reference styles captured from a native PD tab
  let nativeTitle: FontStyles;
  let nativeTableHeader: FontStyles;
  let nativeTableCell: FontStyles;

  test('capture reference font styles from native Networks tab', async ({ page, runner }) => {
    // Navigate to the Networks tab
    const navBar = page.getByRole('navigation', { name: 'AppNavigation' });
    const networksLink = navBar.getByRole('link', { name: /Networks/i });
    await playExpect(networksLink).toBeVisible({ timeout: 15_000 });
    await networksLink.click();

    await page.waitForTimeout(2_000);
    await runner.screenshot('networks-tab.png');

    // Capture the page title style (NavPage h1)
    const title = page.getByRole('heading', { level: 1 });
    await playExpect(title).toBeVisible({ timeout: 10_000 });
    nativeTitle = await page.evaluate(() => {
      const el = document.querySelector('h1');
      if (!el) throw new Error('h1 not found');
      const s = window.getComputedStyle(el);
      return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
    });
    console.log('Native title styles:', JSON.stringify(nativeTitle));

    // Capture table header style - use the "Name" column header
    const nameHeader = page.getByRole('columnheader', { name: 'Name' });
    await playExpect(nameHeader).toBeVisible({ timeout: 10_000 });
    nativeTableHeader = await nameHeader.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
    });
    console.log('Native table header styles:', JSON.stringify(nativeTableHeader));

    // Capture table cell text style
    const firstCell = page.locator('[role="cell"]').nth(2); // skip checkbox/toggle cells
    const cellVisible = await firstCell.isVisible().catch(() => false);
    if (cellVisible) {
      nativeTableCell = await firstCell.evaluate(el => {
        const s = window.getComputedStyle(el);
        return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
      });
      console.log('Native table cell styles:', JSON.stringify(nativeTableCell));
    } else {
      // Fallback: use PD's known defaults
      nativeTableCell = { fontSize: '12px', fontWeight: '400', fontFamily: nativeTitle.fontFamily };
      console.log('No native cells visible, using PD defaults:', JSON.stringify(nativeTableCell));
    }
  });

  test('extension title font matches native title font', async ({ page, runner }) => {
    // Navigate to Container Stats extension
    const navBar = page.getByRole('navigation', { name: 'AppNavigation' });
    const statsLink = navBar.getByRole('link', { name: new RegExp(EXTENSION_NAME, 'i') });
    await playExpect(statsLink).toBeVisible({ timeout: 15_000 });
    await statsLink.click();

    // Wait for the webview element to appear in the main page
    const webview = page.getByRole('document', { name: /Webview Container Stats/i });
    await playExpect(webview).toBeVisible({ timeout: 30_000 });

    // Wait for the webview page to be available in Electron's window list
    await page.waitForTimeout(3_000);

    // Get the webview's separate page from the Electron app
    const webviewPage = await getWebviewPage(runner);
    playExpect(webviewPage).toBeTruthy();

    // Wait for the extension content to render
    const extTitle = webviewPage!.locator('h2').first();
    await playExpect(extTitle).toBeVisible({ timeout: 15_000 });

    await runner.screenshot('extension-title-font.png');

    const extTitleStyles = await extTitle.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
    });
    console.log('Extension title styles:', JSON.stringify(extTitleStyles));
    console.log('Native title styles:', JSON.stringify(nativeTitle));

    // Font size must match (PD uses text-xl = 16px)
    playExpect(extTitleStyles.fontSize).toBe(nativeTitle.fontSize);
    // Font weight must match (PD uses font-bold = 700)
    playExpect(extTitleStyles.fontWeight).toBe(nativeTitle.fontWeight);
  });

  test('extension table header font matches native table header font', async ({ runner }) => {
    const webviewPage = await getWebviewPage(runner);
    playExpect(webviewPage).toBeTruthy();

    // Our extension always renders table headers (even with no containers)
    const extHeader = webviewPage!.locator('[role="columnheader"]').first();
    await playExpect(extHeader).toBeVisible({ timeout: 10_000 });

    await runner.screenshot('extension-table-header-font.png');

    const extHeaderStyles = await extHeader.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
    });
    console.log('Extension table header styles:', JSON.stringify(extHeaderStyles));
    console.log('Native table header styles:', JSON.stringify(nativeTableHeader));

    // Font size must match PD's table header (11px / text-sm in PD's config)
    playExpect(extHeaderStyles.fontSize).toBe(nativeTableHeader.fontSize);
    // Font weight must match (600 / semibold)
    playExpect(extHeaderStyles.fontWeight).toBe(nativeTableHeader.fontWeight);
  });

  test('extension table cell font size matches native table cell font size', async ({ runner }) => {
    const webviewPage = await getWebviewPage(runner);
    playExpect(webviewPage).toBeTruthy();

    // Check cell font size if containers are running
    const extCell = webviewPage!.locator('[role="cell"]').first();
    const cellVisible = await extCell.isVisible().catch(() => false);

    if (cellVisible) {
      const extCellStyles = await extCell.evaluate(el => {
        const s = window.getComputedStyle(el);
        return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
      });
      console.log('Extension table cell styles:', JSON.stringify(extCellStyles));
      console.log('Native table cell styles:', JSON.stringify(nativeTableCell));

      await runner.screenshot('extension-table-cell-font.png');

      // Font size must match PD's table body (12px / text-base in PD's config)
      playExpect(extCellStyles.fontSize).toBe(nativeTableCell.fontSize);
    } else {
      // No containers running — verify empty state renders
      const emptyMsg = webviewPage!.locator('text=No running containers');
      await playExpect(emptyMsg).toBeVisible({ timeout: 5_000 });

      await runner.screenshot('extension-no-containers.png');
      console.log('No container cells visible (no running containers). Empty state verified.');
    }
  });
});
