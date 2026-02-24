# Release — Phase 5: Build, Tag, Deploy

Create a production release of the current version.

**Version to release**: $ARGUMENTS (e.g., "1.2.0")

## Prerequisites
- Quality gate MUST have passed (`/rh-quality-gate`)
- All sprints MUST be complete
- User MUST approve the release

## Step 1: Verify readiness
1. Run `git status` — working tree must be clean
2. Verify all tests pass: `npm test`
3. Confirm version in `packages/backend/package.json` matches $ARGUMENTS
4. Verify build succeeds: `npm run build`

## Step 2: Update version (if needed)

If the version does not match $ARGUMENTS, update all package.json files:
```bash
npm version $ARGUMENTS --no-git-tag-version
npm version $ARGUMENTS --no-git-tag-version -w packages/shared
npm version $ARGUMENTS --no-git-tag-version -w packages/backend
npm version $ARGUMENTS --no-git-tag-version -w packages/frontend
```

Commit the version bump before proceeding.

## Step 3: Create git tag

Tag format: `v$ARGUMENTS` (e.g., `v1.2.0`)

```bash
git tag v$ARGUMENTS -m "Release v$ARGUMENTS: {RELEASE_TITLE}

{FEATURE_SUMMARY}

Tests: {M} passing
Coverage: {C}%"
```

## Step 4: Push everything
```bash
git push origin main
git push origin v$ARGUMENTS
```

Pushing the tag triggers the `.github/workflows/release.yml` workflow, which:
1. Builds the project
2. Packages the OCI image via the Containerfile
3. Pushes `ghcr.io/djhenry/extension-stats:$ARGUMENTS` and `:latest` to ghcr.io

## Step 5: Verify release

1. Check the GitHub Actions workflow completed successfully:
   ```bash
   gh run list --workflow=release.yml --limit=1
   ```

2. Verify the OCI image is available:
   ```bash
   podman pull ghcr.io/djhenry/extension-stats:$ARGUMENTS
   ```

3. Test installation in Podman Desktop:
   - Go to **Extensions** → **Install custom...**
   - Enter: `ghcr.io/djhenry/extension-stats:$ARGUMENTS`
   - Verify the extension loads and displays stats

## Step 6: Create GitHub release (optional)

```bash
gh release create v$ARGUMENTS --title "v$ARGUMENTS" --generate-notes
```

## Step 7: Report
```
Release v$ARGUMENTS ✅ COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Image:    ghcr.io/djhenry/extension-stats:$ARGUMENTS
Tag:      v$ARGUMENTS (pushed to remote)
Workflow: https://github.com/djhenry/extension-stats/actions
Release:  https://github.com/djhenry/extension-stats/releases/tag/v$ARGUMENTS
```
