# Project Kickoff Document

<!--
INSTRUCTIONS FOR CLAUDE:
This template captures all information needed to generate ARCHITECTURE and DEVELOPMENT-SPEC documents.
Fill this document by asking the human clarifying questions for each section.
Do NOT start architecture or sprint planning until ALL sections are complete and human-approved.
Use Opus model for this phase.
-->

**Project Name**: [NAME]
**JIRA Ticket**: [LINK]
**Date**: [YYYY-MM-DD]
**Team**: [TEAM NAME]
**Version**: v[X.Y.Z]

---

## 1. Problem Statement

### 1.1 What problem does this project solve?
<!-- 2-3 sentences describing the business problem -->

### 1.2 Who are the users/consumers?
<!-- List the teams, systems, or personas that will use this -->

### 1.3 What exists today?
<!-- Current solution (if any), pain points, limitations -->

### 1.4 Success criteria
<!-- How do we know the project succeeded? Measurable outcomes -->
- [ ] Criterion 1: [MEASURABLE OUTCOME]
- [ ] Criterion 2: [MEASURABLE OUTCOME]
- [ ] Criterion 3: [MEASURABLE OUTCOME]

---

## 2. Scope

### 2.1 In Scope
<!-- Explicit list of features/capabilities to build -->
1. [FEATURE 1]
2. [FEATURE 2]
3. [FEATURE 3]

### 2.2 Out of Scope
<!-- Explicit list of things NOT included in this version -->
1. [EXCLUDED 1]
2. [EXCLUDED 2]

### 2.3 Future Versions (Planned)
<!-- Features planned for later versions -->
- v[X.Y+1.0]: [PLANNED FEATURES]

---

## 3. Technical Context

### 3.1 Technology Stack
<!-- Language, framework, runtime, infrastructure -->
| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Language | [e.g., Go, Python, TypeScript] | [VERSION] | [WHY] |
| Framework | [e.g., controller-runtime, FastAPI, Next.js] | [VERSION] | [WHY] |
| Runtime | [e.g., Kubernetes, Docker, Lambda] | [VERSION] | [WHY] |
| Database | [e.g., PostgreSQL, DynamoDB, none] | [VERSION] | [WHY] |
| Observability | [e.g., Prometheus, CloudWatch] | | [WHY] |

### 3.2 Target Environment
<!-- Where will this run? -->
- **Platform**: [e.g., OpenShift 4.19+, AWS EKS, bare metal]
- **Namespaces/Accounts**: [e.g., gpu-reporter-system]
- **Access Pattern**: [e.g., cluster-wide, namespaced, multi-region]

### 3.3 External Dependencies
<!-- Systems, APIs, CRDs, services that this project depends on -->
| Dependency | Type | Owned By | Access Pattern |
|-----------|------|----------|----------------|
| [NAME] | [CRD/API/Service] | [TEAM] | [read-only/read-write] |

### 3.4 Build and Deploy Tools
<!-- CI/CD, build tools, deployment method -->
- **Build**: [e.g., make, gradle, npm]
- **CI/CD**: [e.g., GitLab CI, GitHub Actions, Jenkins]
- **Container Registry**: [e.g., images.paas.redhat.com, ECR]
- **Deployment**: [e.g., Kustomize, Helm, CDK, Terraform]
- **CLI Tool**: [e.g., oc, kubectl, aws]

---

## 4. Architecture Constraints

### 4.1 Design Pattern
<!-- Required architectural pattern -->
- [ ] Hexagonal Architecture (Ports & Adapters)
- [ ] Clean Architecture
- [ ] MVC
- [ ] Microservices
- [ ] Event-Driven
- [ ] Other: [SPECIFY]

### 4.2 Key Constraints
<!-- Non-negotiable requirements -->
| Constraint | Requirement | Rationale |
|-----------|-------------|-----------|
| [e.g., Read-Only] | [e.g., No write operations to watched resources] | [WHY] |
| [e.g., Security] | [e.g., Non-root, read-only filesystem] | [WHY] |
| [e.g., Performance] | [e.g., p99 latency < 100ms] | [WHY] |

### 4.3 RBAC / Permissions
<!-- What permissions does this project need? -->
| Resource | Verbs | Scope |
|----------|-------|-------|
| [e.g., Deployments] | [e.g., get, list, watch] | [cluster-wide/namespaced] |

---

## 5. Data Model

### 5.1 Input Data
<!-- What data does this project consume? -->
| Data Source | Format | Volume | Update Frequency |
|-----------|--------|--------|-----------------|
| [SOURCE] | [FORMAT] | [e.g., ~1000 resources] | [e.g., event-driven] |

### 5.2 Output Data
<!-- What data does this project produce? -->
| Output | Format | Consumers | Endpoint |
|--------|--------|-----------|----------|
| [OUTPUT] | [e.g., Prometheus metrics] | [WHO] | [e.g., /metrics:8080] |

### 5.3 Business Rules
<!-- Key business rules that drive the logic -->
1. [RULE 1]: [DESCRIPTION]
2. [RULE 2]: [DESCRIPTION]
3. [RULE 3]: [DESCRIPTION]

<!--
NOTE: If business rules are complex, create a separate BUSINESS-LOGIC.md document
following the format in the docs/ folder. Reference it here.
-->

---

## 6. Observability Requirements

### 6.1 Metrics
<!-- What metrics should be exposed? -->
| Metric Name | Labels | Type | Description |
|------------|--------|------|-------------|
| [PREFIX]_[NAME] | [LABELS] | [gauge/counter/histogram] | [DESC] |

### 6.2 Health Checks
<!-- Liveness, readiness probes -->
| Endpoint | Port | Purpose |
|----------|------|---------|
| /healthz | [PORT] | Liveness probe |
| /readyz | [PORT] | Readiness probe |

### 6.3 Dashboards
<!-- Visualization requirements -->
- **Platform**: [e.g., Grafana, CloudWatch, built-in console]
- **Panels**: [e.g., ~15-20 panels in 4 categories]
- **Categories**: [LIST OF DASHBOARD SECTIONS]

### 6.4 Alerting
<!-- Alert requirements -->
| Alert | Condition | Severity |
|-------|-----------|----------|
| [NAME] | [CONDITION] | [critical/warning/info] |

---

## 7. Deployment Configuration

### 7.1 Environments
| Environment | Replicas | Log Level | Resources | Special Config |
|-------------|----------|-----------|-----------|----------------|
| Development | [N] | debug | [CPU/MEM] | [e.g., leader-elect=false] |
| Staging | [N] | info | [CPU/MEM] | |
| Production | [N] | info | [CPU/MEM] | [e.g., pod anti-affinity] |

### 7.2 Security Requirements
<!-- Container security context, network policies -->
- [ ] Non-root user (UID: [NUMBER])
- [ ] Read-only root filesystem
- [ ] Drop all capabilities
- [ ] Seccomp profile: RuntimeDefault
- [ ] Network policies (ingress/egress restrictions)
- [ ] Other: [SPECIFY]

---

## 8. Testing Strategy

### 8.1 Test Levels
| Level | Framework | Scope | Target Coverage |
|-------|-----------|-------|----------------|
| Unit | [e.g., go test, pytest, jest] | Domain logic | > 90% |
| Unit (adapters) | [SAME] | Controllers/handlers | > 80% |
| Integration | [e.g., envtest, testcontainers] | Cross-component | Key flows |
| E2E | [e.g., custom, cypress] | Full system | Critical paths |
| Performance | [e.g., custom, k6] | Latency/throughput | Targets met |

### 8.2 Coverage Targets
| Package/Module | Target |
|---------------|--------|
| Core business logic | > 95% |
| Adapters/Controllers | > 80% |
| Global | > 80% |

---

## 9. Documentation Requirements

### 9.1 Required Documents
- [ ] ARCHITECTURE-{VERSION}.md
- [ ] DEVELOPMENT-SPEC-{VERSION}.md
- [ ] BUSINESS-LOGIC.md (if complex rules)
- [ ] CHANGELOG.md
- [ ] README.md
- [ ] CLAUDE.md
- [ ] Dashboard documentation
- [ ] E2E testing guide

### 9.2 Language
- All documentation in **English**
- All code comments in **English**
- All commit messages in **English**

---

## 10. Version Control

### 10.1 Repository
- **URL**: [REPO URL]
- **Branch Strategy**: [e.g., main only, feature branches]
- **Tag Format**: [e.g., semver without "v" prefix: 1.0.0]

### 10.2 Docker Image
- **Registry**: [REGISTRY URL]
- **Tag Format**: [e.g., semver: project-name:1.0.0]

---

## 11. Approval

| Role | Name | Date | Approved |
|------|------|------|----------|
| Project Lead | [NAME] | [DATE] | [ ] |
| Tech Lead | [NAME] | [DATE] | [ ] |

---

<!--
CLAUDE INSTRUCTIONS:
After this document is approved by the human:
1. Switch to Opus model if not already
2. Use ARCHITECTURE-TEMPLATE.md to generate the architecture document
3. Use Context7 to verify all API versions and library patterns
4. Present architecture to human for approval
5. After architecture approval, use DEVELOPMENT-SPEC-TEMPLATE.md for sprint planning
6. Present development spec to human for approval
7. Only then begin implementation with Sonnet model
-->
