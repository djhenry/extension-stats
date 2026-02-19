# Simple Installation Guide

## Quick Setup (Development Mode)

This is the easiest way to install and test the extension.

### Step 1: Enable Development Mode

1. Open **Podman Desktop**
2. Go to **Preferences** (Settings)
3. Find and enable **Development Mode** (or **Developer Mode**)

### Step 2: Build the Extension

```bash
cd /home/dhenry/git/podman-desktop-stats-plugin
npm install
npm run build
```

This creates:
- `packages/backend/dist/extension.js` - Backend code
- `packages/backend/media/*` - Frontend UI assets

### Step 3: Add Local Folder Extension

1. In **Podman Desktop**, go to **Extensions**
2. Look for **"Add local folder extension"** or **"Install from local folder"**
3. Click it
4. Navigate to and select:
   ```
   /home/dhenry/git/podman-desktop-stats-plugin/packages/backend
   ```
5. Click **Open** or **Select Folder**

The extension should now load!

### Step 4: Access the Dashboard

1. Look for **"Container Stats"** in the Podman Desktop sidebar
2. Click it to open the stats dashboard
3. You should see:
   - Host system stats (CPU, memory, cores, uptime)
   - Container stats table (if containers are running)

---

## For Development: Watch Mode

If you want to make changes and see them update:

```bash
# Terminal 1: Watch backend changes
cd packages/backend
npm run watch

# Terminal 2: Watch frontend changes
cd packages/frontend
npm run watch
```

After making changes:
1. Go to **Extensions** → **Container Stats**
2. Look for a **Reload** or **Restart** button
3. Click it to reload the extension with your changes

---

## Testing with Containers

If you don't have any containers running, start one to see stats:

```bash
podman run -d --name test-nginx nginx
```

The dashboard will automatically pick it up within a few seconds (default: 3s refresh).

---

## Troubleshooting

### Extension Not Showing

- **Restart Podman Desktop** after adding the local folder
- **Check the folder path** - it should be `packages/backend`, not the project root
- **Verify build succeeded**: Check that `packages/backend/dist/extension.js` exists

### No Data Showing

- **Start some containers**: `podman run -d nginx`
- **Check console logs**:
  - Podman Desktop → Help → Developer Tools → Console
  - Look for `[container-stats]` messages
- **Check frontend errors**:
  - Right-click "Container Stats" → "Open Devtools of the webview"

### Build Errors

```bash
# Clean rebuild
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules packages/*/dist packages/backend/media
npm install
npm run build
```

---

## Configuration

Adjust refresh interval:

1. **Preferences** → **Extensions** → **Container Stats**
2. Set **Refresh Interval** (1-60 seconds, default: 3s)
3. Changes apply immediately

---

That's it! Much simpler than OCI images for local development.
