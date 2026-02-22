# Changelog

All notable changes to the Podman Desktop Stats Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-18

### Added

#### Core Features
- Real-time container statistics monitoring (CPU, memory, network I/O, block I/O, PIDs)
- Host system overview (CPU usage, memory utilization, core count, uptime)
- Configurable refresh interval (1-60 seconds, default: 3s)
- Dashboard UI with clean, responsive design
- Zero-configuration setup - works out of the box

#### Architecture
- Hexagonal architecture with ports and adapters pattern
- Dependency injection throughout backend
- RPC-based backend-frontend communication
- Reactive Svelte stores for state management
- TypeScript strict mode across all packages

#### Backend Components
- `StatsCalculator`: CPU/memory/I/O computation functions
- `ContainerStatsCollector`: Real-time container metrics aggregation
- `HostStatsCollector`: Host system metrics collection
- `StatsManager`: Orchestration layer with interval polling
- `RpcBridge`: Backend-to-frontend messaging
- `ConfigManager`: Extension configuration management
- Adapter pattern for Podman Desktop API and Node.js OS module

#### Frontend Components
- `stats-store`: Svelte writable store with message listener
- `HostOverview`: Host stats panel (CPU, memory, cores, uptime)
- `ContainerTable`: Container stats table with sortable columns
- `StatsBar`: Progress bar widget for percentage display
- `Dashboard`: Main layout component
- Tailwind CSS styling

#### Testing
- 98 total tests (88 backend + 10 frontend)
- Unit tests for all components
- Integration tests for full backend pipeline
- > 80% global coverage
- > 95% coverage for critical modules (stats-calculator, format)
- TDD methodology throughout

#### Documentation
- Complete architecture document (ARCHITECTURE-1_0_0.md)
- Sprint-by-sprint development specification (DEVELOPMENT-SPEC-1_0_0.md)
- Project kickoff document with requirements (PROJECT-KICKOFF-1_0_0.md)
- README with installation and development instructions
- CLAUDE.md with AI agent context

#### CI/CD
- GitHub Actions workflow for automated testing
- Linting and type checking in CI
- Coverage reporting
- Build verification

### Technical Details

**Dependencies:**
- Podman Desktop Extension API 1.0+
- Svelte 5.0
- TypeScript 5.7
- Vite 6.0
- Vitest 3.0

**Compatibility:**
- Podman 4.x and 5.x
- Node.js 20+
- Works with rootless Podman

**Performance:**
- < 500ms extension activation time
- < 1% CPU overhead when idle
- < 20MB memory overhead (50 containers)

### Security

- Read-only access to Podman API (no container mutations)
- No elevated privileges required
- No external network calls
- No filesystem writes
- No secrets or credentials storage
- Passes `npm audit` security checks

## [Unreleased]

### Planned Features
- Historical stats with time-series graphs
- Export stats to CSV/JSON
- Custom metric alerts and notifications
- Docker compatibility (via Podman Desktop)
- Multi-host support (remote Podman connections)

---

[1.0.0]: https://github.com/yourusername/extension-stats/releases/tag/v1.0.0
