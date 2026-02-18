# CI/CD Pipeline Template

<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                CLAUDE CODE — CI/CD PIPELINE TEMPLATE                         ║
║                                                                              ║
║  PURPOSE: Generate CI/CD pipeline configuration for the project.             ║
║  MODEL: Sonnet (created during Sprint 11 / CI-CD sprint).                    ║
║  WHEN: During the CI/CD sprint or Phase 5 (Release).                         ║
║                                                                              ║
║  This template covers GitLab CI and GitHub Actions.                          ║
║  Choose the appropriate platform section for your project.                   ║
║                                                                              ║
║  REFERENCE: Based on GPU Reporter .gitlab-ci.yml                             ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

---

## Pipeline Stages

Every project pipeline MUST include these stages in order:

| Stage | Purpose | Failure Policy |
|-------|---------|----------------|
| **validate** | Lint + security scan | Blocks pipeline |
| **test** | Unit tests + coverage | Blocks pipeline |
| **build** | Build artifact (binary/image) | Blocks pipeline |
| **image-scan** | Container vulnerability scan | Advisory (allow_failure) |
| **image-push** | Push to registry | Only on main/tags |

---

## GitLab CI Template

**File**: `.gitlab-ci.yml`

```yaml
# ============================================================
# {PROJECT_NAME} — GitLab CI/CD Pipeline
# ============================================================
#
# Stages: validate → test → build → image-scan → image-push
#
# Triggers:
#   - All branches: validate + test + build + image-scan
#   - main branch:  + push image as :latest
#   - Git tags:     + push image as :{tag} AND :latest
# ============================================================

# --- Shared templates (adjust to your organization) ---
# include:
#   - project: '{ORG}/gitlab-cicd-templates'
#     file: '/{LANGUAGE}-validate.yml'
#   - project: '{ORG}/gitlab-cicd-templates'
#     file: '/buildah.yml'
#   - project: '{ORG}/gitlab-cicd-templates'
#     file: '/image-scan.yml'

stages:
  - validate
  - test
  - build
  - image-scan
  - image-push

variables:
  OCI_IMAGE_NAME: {REGISTRY}/{ORG}/{PROJECT_NAME}

# --- Stage: Validate ---

validate:lint:
  stage: validate
  image: {LINT_IMAGE}
  script:
    - {LINT_COMMAND}
  # allow_failure: true  # Set to false once lint is clean

validate:security:
  stage: validate
  image: {SECURITY_SCANNER_IMAGE}
  script:
    - {SECURITY_COMMAND}
  # allow_failure: true

# --- Stage: Test ---

test:unit:
  stage: test
  image: {LANGUAGE_IMAGE}:{VERSION}
  script:
    - {TEST_COMMAND}
  coverage: '/{COVERAGE_REGEX}/'
  artifacts:
    paths:
      - {COVERAGE_FILE}
    reports:
      junit: {JUNIT_REPORT}  # Optional

# --- Stage: Build ---

build:
  stage: build
  variables:
    OCI_IMAGE_TAG: ${CI_COMMIT_TAG:-${CI_COMMIT_REF_SLUG}}
  script:
    - {BUILD_COMMAND}
  artifacts:
    paths:
      - {BUILD_ARTIFACT}

# --- Stage: Image Scan ---

image-scan:
  stage: image-scan
  allow_failure: true
  script:
    - {SCAN_COMMAND}

# --- Stage: Image Push ---

# Push on main branch → :latest
image-push-main:
  stage: image-push
  variables:
    OCI_IMAGE_TAG: latest
  script:
    - {PUSH_COMMAND}
  rules:
    - if: $CI_COMMIT_BRANCH == "main" && $CI_COMMIT_TAG == null
      when: always

# Push on git tag → :{tag}
image-push-tag:
  stage: image-push
  variables:
    OCI_IMAGE_TAG: ${CI_COMMIT_TAG}
  script:
    - {PUSH_COMMAND}
  rules:
    - if: $CI_COMMIT_TAG
      when: always

# Push on git tag → :latest (in addition to :{tag})
image-push-tag-latest:
  stage: image-push
  variables:
    OCI_IMAGE_TAG: latest
  script:
    - {PUSH_COMMAND}
  rules:
    - if: $CI_COMMIT_TAG
      when: always
  needs:
    - image-push-tag
```

---

## GitHub Actions Template

**File**: `.github/workflows/ci.yml`

```yaml
# ============================================================
# {PROJECT_NAME} — GitHub Actions CI/CD Pipeline
# ============================================================

name: CI/CD

on:
  push:
    branches: [main]
    tags: ['*.*.*']     # Semver tags trigger release
  pull_request:
    branches: [main]

env:
  REGISTRY: {REGISTRY}
  IMAGE_NAME: {ORG}/{PROJECT_NAME}

jobs:
  # --- Validate ---
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-{LANGUAGE}@v5
        with:
          {LANGUAGE}-version: '{VERSION}'
      - name: Lint
        run: {LINT_COMMAND}
      - name: Security Scan
        run: {SECURITY_COMMAND}

  # --- Test ---
  test:
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-{LANGUAGE}@v5
        with:
          {LANGUAGE}-version: '{VERSION}'
      - name: Run Tests
        run: {TEST_COMMAND}
      - name: Upload Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: {COVERAGE_FILE}

  # --- Build and Push ---
  build-and-push:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.REGISTRY_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
            type=ref,event=branch
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          platforms: linux/amd64,linux/arm64
```

---

## Pipeline Design Principles

1. **Fast feedback**: Lint and security checks run first (cheapest, fastest)
2. **Gate on quality**: Tests MUST pass before build proceeds
3. **Scan everything**: Container image scanned before push
4. **Tag-driven releases**: Git tags trigger versioned image pushes
5. **Main = latest**: Pushes to main always update the `:latest` tag
6. **Semver tags**: Version tags push both `:{version}` and `:latest`

---

## Language-Specific Variables

### Go
```yaml
LANGUAGE_IMAGE: golang
VERSION: "1.26"
LINT_COMMAND: golangci-lint run
SECURITY_COMMAND: gosec ./...
TEST_COMMAND: go test -race -coverprofile=cover.out ./...
COVERAGE_REGEX: 'total:.*\s(\d+\.\d+)%'
COVERAGE_FILE: cover.out
BUILD_COMMAND: CGO_ENABLED=0 go build -o bin/manager main.go
```

### Python
```yaml
LANGUAGE_IMAGE: python
VERSION: "3.12"
LINT_COMMAND: ruff check .
SECURITY_COMMAND: bandit -r src/
TEST_COMMAND: pytest --cov=src --cov-report=xml
COVERAGE_REGEX: 'TOTAL.*\s(\d+)%'
COVERAGE_FILE: coverage.xml
BUILD_COMMAND: pip wheel . -w dist/
```

### TypeScript/Node
```yaml
LANGUAGE_IMAGE: node
VERSION: "22"
LINT_COMMAND: npm run lint
SECURITY_COMMAND: npm audit --audit-level=moderate
TEST_COMMAND: npm test -- --coverage
COVERAGE_REGEX: 'All files.*\|.*\|\s*([\d.]+)'
COVERAGE_FILE: coverage/lcov.info
BUILD_COMMAND: npm run build
```

---

**End of CI/CD Template**
