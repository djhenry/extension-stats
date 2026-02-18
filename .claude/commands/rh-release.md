# Release — Phase 5: Build, Tag, Deploy

Create a production release of the current version.

**Version to release**: $ARGUMENTS (e.g., "1.2.0")

## Prerequisites
- Quality gate MUST have passed (`/rh-quality-gate`)
- All sprints MUST be complete
- User MUST approve the release

## Step 1: Verify readiness
1. Run `git status` — working tree must be clean
2. Verify all tests pass: `make test`
3. Confirm version in Makefile/package.json matches $ARGUMENTS

## Step 2: Build production artifact
```bash
# For Docker/container projects:
make docker-buildx IMG={REGISTRY}/{PROJECT}:$ARGUMENTS
# or: make docker-build IMG=...

# For binary projects:
make build

# For npm projects:
npm run build
```

## Step 3: Create git tag
**CRITICAL**: Follow the project's tag format convention.

Check if `docs/GITLAB-TAG-FORMAT.md` exists and follow its rules.

Default (GitLab Red Hat): NO "v" prefix
```bash
git tag -a $ARGUMENTS -m "Release $ARGUMENTS: {RELEASE_TITLE}

{FEATURE_SUMMARY}

Components: {N} complete
Tests: {M} passing
Coverage: {C}%
JIRA: {JIRA_ID}"
```

## Step 4: Push everything
```bash
git push origin main
git push origin $ARGUMENTS
```

## Step 5: Deploy (if requested)
```bash
# Kubernetes/OpenShift:
kustomize build config/overlays/production | oc apply -f -

# Verify deployment:
oc get pods -n {NAMESPACE}
oc logs -n {NAMESPACE} {POD} --tail=20
```

## Step 6: Verify deployment
1. Check pods are running and ready
2. Check application logs for startup success
3. Verify health endpoints respond
4. Verify metrics endpoint is serving

## Step 7: Report
```
Release $ARGUMENTS ✅ COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Image:      {REGISTRY}/{PROJECT}:$ARGUMENTS
Tag:        $ARGUMENTS (pushed to remote)
Commits:    {N} commits pushed
Deployment: {STATUS}

GitLab Tag: {REPO_URL}/-/tags/$ARGUMENTS
```
