# Claude Code Context: Podman Desktop Stats Plugin

This document provides context for AI assistants working on this project.

## Project Overview

A Podman Desktop extension providing real-time container and host system statistics monitoring. Built with TypeScript, Svelte 5, and hexagonal architecture.

**Status**: v1.0.0 - Production ready
**Test Coverage**: 98 tests, > 80% coverage
**Architecture**: Hexagonal (Ports & Adapters) with dependency injection

## Quick Start

```bash
# Install and test
npm install
npm test

# Build
npm run build

# Lint
npm run lint
```

## Architecture

### Hexagonal Architecture

```
┌─────────────────────────────────────────────┐
│ Frontend (Svelte 5)                         │
│ ├── stores/stats-store.ts                   │
│ ├── components/HostOverview.svelte          │
│ └── components/ContainerTable.svelte        │
└─────────────────────────────────────────────┘
                    ↕ RPC (postMessage)
┌─────────────────────────────────────────────┐
│ Backend (Node.js)                           │
│ ├── RpcBridge ─────────────────────────┐    │
│ ├── StatsManager (orchestration)      │    │
│ ├── ContainerStatsCollector ──────┐   │    │
│ ├── HostStatsCollector ────────┐  │   │    │
│ └── Adapters (Ports)           │  │   │    │
│     ├── ContainerEnginePort ───┘  │   │    │
│     └── OsPort ───────────────────┘   │    │
└───────────────────────────────────────┴────┘
```

### Key Components

| Component | Purpose | Tests |
|-----------|---------|-------|
| **stats-calculator.ts** | CPU/memory/I/O computation | stats-calculator.test.ts |
| **ContainerStatsCollector** | Container metrics aggregation | container-stats-collector.test.ts |
| **HostStatsCollector** | Host system metrics | host-stats-collector.test.ts |
| **StatsManager** | Orchestration + polling | stats-manager.test.ts |
| **RpcBridge** | Backend ↔ Frontend messaging | rpc-bridge.test.ts |
| **stats-store.ts** | Svelte reactive store | stats-store.test.ts |
| **integration.test.ts** | Full pipeline E2E | (self) |

## Testing Strategy

### TDD Methodology

All code follows RED-GREEN-REFACTOR:
1. **RED**: Write failing test first
2. **GREEN**: Implement minimum code to pass
3. **REFACTOR**: Optimize while keeping tests green

### Test Commands

```bash
# All tests
npm test

# Backend only (88 tests)
npx vitest run packages/backend packages/shared

# Frontend only (10 tests)
cd packages/frontend && npm test

# Coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Coverage Targets

- **Global**: > 80%
- **stats-calculator.ts**: > 95%
- **format.ts**: > 95%
- **All backend modules**: > 80%

## Code Guidelines

### TypeScript Strict Mode

- All packages use `strict: true`
- No implicit `any`
- Null safety enforced

### Dependency Injection

All components accept dependencies via constructor:

```typescript
export class StatsManager {
  constructor(
    private readonly config: ConfigManager,
    private readonly containerCollector: ContainerStatsCollector,
    private readonly hostCollector: HostStatsCollector,
  ) {}
}
```

### Port/Adapter Pattern

External dependencies accessed through ports:

```typescript
// Port (interface)
export interface ContainerEnginePort {
  listContainers(): Promise<ContainerInfo[]>;
  statsContainer(engineId: string, containerId: string, callback: (stats: ContainerStatsInfo) => void): Promise<Disposable>;
}

// Adapter (implementation)
export class PodmanDesktopContainerEngine implements ContainerEnginePort {
  listContainers(): Promise<ContainerInfo[]> {
    return containerEngine.listContainers();
  }
  // ...
}
```

### Svelte 5 Components

Use runes syntax:

```svelte
<script lang="ts">
  interface Props {
    value: number;
    max: number;
  }

  let { value, max }: Props = $props();
  const percentage = $derived(Math.min(100, (value / max) * 100));
</script>
```

## Common Tasks

### Adding a New Metric

1. Update `ContainerStats` type in `packages/shared/src/types.ts`
2. Add calculation function in `packages/backend/src/stats-calculator.ts`
3. Write tests in `stats-calculator.test.ts` (RED phase)
4. Implement calculation (GREEN phase)
5. Update `ContainerStatsCollector` to call new function
6. Update frontend component to display metric
7. Run full test suite: `npm test`

### Fixing a Bug

1. Write a failing test that reproduces the bug (RED)
2. Fix the implementation (GREEN)
3. Verify all tests pass: `npm test`
4. Check for regressions: `npm run lint`
5. Commit with conventional commit message

### Refactoring

1. Ensure all tests pass before starting
2. Make incremental changes
3. Run tests after each change
4. Maintain test coverage
5. Update documentation if interfaces change

## File Locations

### Tests
- Backend: `packages/backend/src/__tests__/*.test.ts`
- Frontend: `packages/frontend/src/__tests__/*.test.ts`
- Shared: `packages/shared/src/__tests__/*.test.ts`

### Source
- Types: `packages/shared/src/types.ts`
- RPC: `packages/shared/src/rpc-types.ts`
- Formatters: `packages/shared/src/format.ts`
- Backend entry: `packages/backend/src/extension.ts`
- Frontend entry: `packages/frontend/src/main.ts`

### Configs
- Root: `package.json`, `tsconfig.base.json`, `vitest.config.ts`
- Backend: `packages/backend/package.json`, `packages/backend/vite.config.ts`
- Frontend: `packages/frontend/package.json`, `packages/frontend/vite.config.ts`

## Known Issues & Decisions

### ESLint Warnings
- 44 warnings about `any` type usage in test mocks (acceptable)
- Test mocks use `any` for simplicity and flexibility

### Svelte 5 Testing
- Uses `resolve.conditions: ['browser']` to force client-side rendering
- vitest-setup.ts ensures proper jsdom environment

### Vitest Workspace
- Deprecated workspace file (vitest.workspace.ts) to be migrated
- Frontend tests must run from `packages/frontend` directory
- Backend tests run from root with workspace config

## Documentation

- **Architecture**: `docs/ARCHITECTURE-1_0_0.md` - Complete system design
- **Development Spec**: `docs/DEVELOPMENT-SPEC-1_0_0.md` - Sprint-by-sprint implementation guide
- **Project Kickoff**: `docs/PROJECT-KICKOFF-1_0_0.md` - Requirements and planning

## Debugging

### Backend Debugging
1. Use Podman Desktop developer tools
2. Console logs visible in PD DevTools console
3. Use `logger.ts` with `[container-stats]` prefix

### Frontend Debugging
1. Right-click extension icon → "Open Devtools of the webview"
2. Svelte DevTools available in browser
3. Check `statsSnapshot` store state

### Test Debugging
```bash
# Run single test file
npx vitest run packages/backend/src/__tests__/stats-calculator.test.ts

# Run with verbose output
npx vitest run --reporter=verbose

# Run in watch mode for debugging
npx vitest watch
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. Install dependencies
2. Type check
3. Lint
4. Test with coverage
5. Build

All checks must pass before merge.

## Questions?

1. Check `docs/ARCHITECTURE-1_0_0.md` for system design
2. Check `docs/DEVELOPMENT-SPEC-1_0_0.md` for implementation details
3. Run tests to understand component behavior
4. Review test files for usage examples
