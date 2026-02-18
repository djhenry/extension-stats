# Project Kickoff Document

**Project Name**: podman-desktop-stats-plugin
**JIRA Ticket**: N/A
**Date**: 2026-02-18
**Team**: Personal Project (dhenry)
**Version**: v1.0.0

---

## 1. Problem Statement

### 1.1 What problem does this project solve?
Podman Desktop lacks built-in, comprehensive resource monitoring for containers and the host system. Users currently must switch to the terminal and run `podman stats` or use external tools to understand resource consumption. This plugin brings real-time container and system resource statistics directly into the Podman Desktop UI as a dedicated dashboard.

### 1.2 Who are the users/consumers?
- Podman Desktop users who want visibility into container resource usage without leaving the IDE
- Developers running local containerized workloads who need to identify resource-hungry containers
- DevOps engineers testing container resource limits and performance locally

### 1.3 What exists today?
Podman Desktop provides basic container listing and lifecycle management but does not offer a dedicated stats/monitoring view. Users must rely on:
- `podman stats` CLI command (terminal-only, no historical view)
- External monitoring tools (Grafana, cAdvisor) which are overkill for local development
- No integrated host-level resource overview within Podman Desktop

### 1.4 Success criteria
- [ ] Plugin installs and activates in Podman Desktop without errors
- [ ] Real-time per-container CPU, memory, network I/O, and disk I/O stats displayed on a dashboard page
- [ ] Host system CPU, memory, and disk usage displayed on the same dashboard
- [ ] User-configurable refresh interval for stats polling
- [ ] Unit and integration test coverage >= 80%

---

## 2. Scope

### 2.1 In Scope
1. Per-container CPU and memory usage monitoring (real-time)
2. Per-container network I/O stats (bytes sent/received)
3. Per-container disk/block I/O stats (read/write)
4. Host system resource overview (CPU, memory, disk usage)
5. Dedicated dashboard page within Podman Desktop
6. User-configurable polling/refresh interval via extension settings
7. Support for Podman 4.x and 5.x (rootless mode)

### 2.2 Out of Scope
1. Historical data persistence or time-series storage
2. Alerting or notifications for resource thresholds
3. Status bar widget (future version)
4. Pod-level aggregated stats
5. Remote Podman machine stats (local only for v1.0)
6. Export/import of stats data

### 2.3 Future Versions (Planned)
- v1.1.0: Status bar widget with summary stats, historical charts with in-memory rolling window
- v1.2.0: Pod-level aggregated stats, resource threshold alerts
- v2.0.0: Remote Podman machine monitoring, data export

---

## 3. Technical Context

### 3.1 Technology Stack
| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Language | TypeScript | 5.x | Standard for Podman Desktop extensions |
| Framework | Podman Desktop Extension API | Latest stable | Required for PD extension integration |
| UI | Svelte | 4.x / 5.x (per PD version) | Podman Desktop's UI framework |
| Runtime | Node.js | 20+ | Podman Desktop's runtime environment |
| Container Engine | Podman API (REST) | 4.x / 5.x | Stats data source via libpod API |
| Build | TypeScript Compiler + Vite | Latest | Standard PD extension build tooling |

### 3.2 Target Environment
- **Platform**: Podman Desktop (latest stable release), running on Linux, macOS, Windows
- **Container Engine**: Podman 4.x and 5.x (rootless mode supported)
- **Access Pattern**: Local Podman socket connection

### 3.3 External Dependencies
| Dependency | Type | Owned By | Access Pattern |
|-----------|------|----------|----------------|
| Podman REST API | API (libpod) | Podman project | read-only (stats endpoints) |
| Podman Desktop Extension API | SDK | Podman Desktop project | extension lifecycle |
| System info (host stats) | OS API / Podman info | OS / Podman | read-only |

### 3.4 Build and Deploy Tools
- **Build**: `npm` / `vite` with TypeScript compilation
- **CI/CD**: GitHub Actions
- **Container Registry**: N/A (desktop extension, not a container image)
- **Deployment**: Published to Podman Desktop extension catalog or sideloaded
- **CLI Tool**: `npm`, `podman`

---

## 4. Architecture Constraints

### 4.1 Design Pattern
- [x] Other: Podman Desktop Extension pattern (backend activation + Svelte webview frontend)

Extensions follow a host/webview split:
- **Backend (extension.ts)**: Activates in the PD host process, communicates with Podman API
- **Frontend (Svelte)**: Webview-based dashboard UI rendered in PD's webview panel

### 4.2 Key Constraints
| Constraint | Requirement | Rationale |
|-----------|-------------|-----------|
| Read-Only | No write operations to containers or Podman state | Safety — monitoring only |
| Lightweight | Minimal CPU/memory overhead from polling | Must not degrade PD performance |
| Cross-platform | Must work on Linux, macOS, and Windows | PD is cross-platform |
| Podman API compat | Support both Podman 4.x and 5.x API | Broad user base |

### 4.3 RBAC / Permissions
| Resource | Verbs | Scope |
|----------|-------|-------|
| Podman containers | stats, list, inspect | Local socket |
| Podman system | info | Local socket |
| Host OS | CPU/memory/disk info | Read-only system calls |

---

## 5. Data Model

### 5.1 Input Data
| Data Source | Format | Volume | Update Frequency |
|-----------|--------|--------|-----------------|
| Podman container stats API | JSON (streaming or polling) | 1 entry per running container | User-configurable (1-10s) |
| Podman system info API | JSON | Single response | Same as above |
| Host OS resource info | Node.js os module / Podman info | Single response | Same as above |

### 5.2 Output Data
| Output | Format | Consumers | Endpoint |
|--------|--------|-----------|----------|
| Container stats dashboard | Svelte UI (webview) | Podman Desktop user | Dashboard page |
| Host stats overview | Svelte UI (webview) | Podman Desktop user | Dashboard page |

### 5.3 Business Rules
1. **Polling lifecycle**: Stats polling starts when the dashboard is visible and stops when navigated away (no background polling)
2. **Container filtering**: Only show stats for running containers; stopped/paused containers excluded from active stats
3. **Graceful degradation**: If a container is removed mid-poll, handle gracefully without errors in the UI
4. **Default interval**: Default refresh interval is 3 seconds if user has not configured a preference

---

## 6. Observability Requirements

### 6.1 Metrics
N/A — this is a desktop extension, not a server-side application. No Prometheus metrics.

### 6.2 Health Checks
N/A — extension health is managed by Podman Desktop's extension lifecycle.

### 6.3 Dashboards
- **Platform**: Built-in Svelte webview within Podman Desktop
- **Panels**: ~4-6 sections
- **Categories**:
  - Host system overview (CPU, memory, disk)
  - Per-container CPU usage
  - Per-container memory usage
  - Per-container network I/O
  - Per-container disk I/O

### 6.4 Alerting
N/A for v1.0 (planned for v1.2.0).

---

## 7. Deployment Configuration

### 7.1 Environments
| Environment | Purpose | Special Config |
|-------------|---------|----------------|
| Development | Local sideload via `podman desktop extension install` | Debug logging enabled |
| Production | Published to PD extension catalog | Minified build |

### 7.2 Security Requirements
- [x] No elevated privileges required (rootless Podman support)
- [x] Read-only access to Podman API (no container mutations)
- [x] No external network calls (all data from local Podman socket)
- [x] No secrets or credentials stored

---

## 8. Testing Strategy

### 8.1 Test Levels
| Level | Framework | Scope | Target Coverage |
|-------|-----------|-------|----------------|
| Unit | Vitest | Business logic, data transformation, utilities | > 90% |
| Unit (UI) | Vitest + Testing Library | Svelte component rendering | > 80% |
| Integration | Vitest | Podman API interaction mocking | Key flows |

### 8.2 Coverage Targets
| Package/Module | Target |
|---------------|--------|
| Stats data processing/transformation | > 95% |
| Podman API client | > 80% |
| Svelte UI components | > 80% |
| Global | > 80% |

---

## 9. Documentation Requirements

### 9.1 Required Documents
- [ ] ARCHITECTURE-v1.0.0.md
- [ ] DEVELOPMENT-SPEC-v1.0.0.md
- [ ] CHANGELOG.md
- [ ] README.md
- [ ] CLAUDE.md

### 9.2 Language
- All documentation in **English**
- All code comments in **English**
- All commit messages in **English**

---

## 10. Version Control

### 10.1 Repository
- **URL**: https://github.com/dhenry/podman-desktop-stats-plugin (TBD)
- **Branch Strategy**: Feature branches merged to main
- **Tag Format**: Semver: 1.0.0

### 10.2 Extension Package
- **Registry**: Podman Desktop extension catalog
- **Package Format**: OCI image or npm package (per PD extension packaging requirements)

---

## 11. Approval

| Role | Name | Date | Approved |
|------|------|------|----------|
| Project Lead | dhenry | 2026-02-18 | [ ] |

---
