# Installation Guide

This guide covers different ways to install the Container Stats extension in Podman Desktop.

## Prerequisites

- Podman Desktop 1.17.0 or later
- Node.js 20+ and npm 10+ (for building from source)
- Podman CLI (for creating OCI images)

## Method 1: Install from OCI Image (Recommended)

This is the standard way to install Podman Desktop extensions.

### Step 1: Build the Extension

```bash
# From project root
npm install
npm run build
```

### Step 2: Package as OCI Image

```bash
# Navigate to backend package
cd packages/backend

# Build OCI image
npm run package

# This creates: localhost/extension-stats:1.0.0
```

### Step 3: Install in Podman Desktop

**Option A: Install from Local Registry**

1. Open Podman Desktop
2. Go to **Extensions**
3. Click **Install custom...**
4. Enter the image reference:
   ```
   localhost/extension-stats:1.0.0
   ```
5. Click **Install**

**Option B: Export and Install from File**

```bash
# Export to tarball
cd packages/backend
npm run package:load

# This creates: packages/extension-stats-1.0.0.tar
```

Then in Podman Desktop:
1. Go to **Extensions**
2. Click **Install from file...**
3. Select the `.tar` file
4. Click **Install**

## Method 2: Install from Registry (Future)

Once published to a container registry:

1. Open Podman Desktop
2. Go to **Extensions**
3. Click **Install custom...**
4. Enter:
   ```
   ghcr.io/yourusername/extension-stats:1.0.0
   ```
5. Click **Install**

## Method 3: Development Mode (For Active Development)

If you're actively developing the extension:

### Using Symlink (Podman Desktop 1.8+)

Some versions of Podman Desktop support loading extensions from a directory:

1. **Find Podman Desktop's extension directory**:
   - Linux: `~/.local/share/containers/podman-desktop/extensions`
   - macOS: `~/Library/Application Support/containers/podman-desktop/extensions`
   - Windows: `%APPDATA%\containers\podman-desktop\extensions`

2. **Create a symlink** to your built extension:
   ```bash
   # Linux/macOS example
   ln -s /home/dhenry/git/extension-stats/packages/backend \
         ~/.local/share/containers/podman-desktop/extensions/extension-stats
   ```

3. **Restart Podman Desktop**

4. The extension should appear in the Extensions list

### Using Watch Mode

For rapid development:

```bash
# Terminal 1: Watch backend changes
cd packages/backend
npm run watch

# Terminal 2: Watch frontend changes
cd packages/frontend
npm run watch
```

After making changes:
1. Rebuild the OCI image: `npm run package`
2. In Podman Desktop: Extensions → Container Stats → **Reload** (or reinstall)

## Verification

After installation, verify the extension is working:

1. **Check extension is listed**:
   - Go to Podman Desktop → **Extensions**
   - Look for "Container Stats" in the list
   - Status should be "Active" or "Running"

2. **Access the dashboard**:
   - Look for "Container Stats" in the left sidebar
   - Click to open the stats dashboard
   - You should see host stats and any running containers

3. **Check logs** (if issues occur):
   - Podman Desktop → Help → **Developer Tools** → Console
   - Look for `[container-stats]` log messages

## Troubleshooting

### Extension Not Showing

**Problem**: Extension doesn't appear after installation

**Solutions**:
- Restart Podman Desktop
- Check Podman Desktop version (requires 1.17.0+)
- Verify the OCI image was built: `podman images | grep extension-stats`
- Check extension logs in Developer Tools

### Build Fails

**Problem**: `npm run package` fails

**Solutions**:
```bash
# Ensure extension is built first
cd /home/dhenry/git/extension-stats
npm run build

# Check that dist/ and media/ exist
ls -la packages/backend/dist
ls -la packages/backend/media

# Rebuild if needed
rm -rf packages/backend/dist packages/backend/media
npm run build
```

### No Data Showing

**Problem**: Dashboard is empty/blank

**Solutions**:
- Start some containers: `podman run -d nginx`
- Check Podman is running: `podman ps`
- Open webview DevTools: Right-click extension → "Open Devtools of the webview"
- Check for JavaScript errors in console

### Permission Errors

**Problem**: Extension can't access Podman stats

**Solutions**:
- Ensure Podman service is running
- Check Podman socket permissions
- On Linux: Verify user is in `podman` group if using rootless Podman

## Updating the Extension

To update to a new version:

1. **Build the new version**:
   ```bash
   npm run build
   cd packages/backend
   npm run package
   ```

2. **Uninstall old version** in Podman Desktop:
   - Extensions → Container Stats → **Uninstall**

3. **Install new version** following Method 1 above

Or use the **Reload** button if available (preserves settings).

## Uninstalling

1. Open Podman Desktop
2. Go to **Extensions**
3. Find "Container Stats"
4. Click **Uninstall** or **Remove**
5. Restart Podman Desktop (recommended)

## Next Steps

- See [README.md](README.md) for usage instructions
- See [CLAUDE.md](CLAUDE.md) for development details
- Report issues: https://github.com/yourusername/extension-stats/issues
