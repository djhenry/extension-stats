#!/bin/bash
# Quick script to build and package the extension for Podman Desktop

set -e

echo "🔨 Building extension..."
npm run build

echo "📦 Packaging as OCI image..."
cd packages/backend
podman build -t localhost/extension-stats:1.0.0 -f Containerfile .

echo "💾 Exporting to tarball..."
podman save localhost/extension-stats:1.0.0 -o extension-stats-1.0.0.tar

echo "✅ Extension packaged successfully!"
echo ""
echo "📍 Extension file location:"
echo "   $(pwd)/extension-stats-1.0.0.tar"
echo ""
echo "📥 To install in Podman Desktop:"
echo "   1. Open Podman Desktop"
echo "   2. Go to Extensions"
echo "   3. Click 'Install from file...'"
echo "   4. Select the file above"
echo ""
