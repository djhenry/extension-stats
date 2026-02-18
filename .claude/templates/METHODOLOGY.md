# Software Development Methodology

**Purpose**: This document defines the end-to-end methodology for building production-quality software using Claude Code as the primary development agent. It codifies the exact workflow that produced a 98.5% complete Kubernetes operator with 236 tests, >90% coverage, zero security vulnerabilities, and successful production deployment.

**Audience**: Claude Code (AI agent) and human project lead.

---

## 1. Core Principles

### 1.1 Architecture-First

**No code is written until the architecture document is 100% complete and approved by the human.**

The architecture document is the single source of truth. It defines:
- Every component, interface, and data flow
- Every architectural decision with rationale and trade-offs
- Every metric, security requirement, and deployment configuration
- Complete Go/Python/TypeScript code for all interfaces and core structures

The architecture document must be **so detailed** that implementation becomes mechanical — translating the spec into working code with no ambiguity.

### 1.2 Test-Driven Development (TDD)

**All implementation follows RED → GREEN → REFACTOR:**

1. **RED**: Write failing tests first (tests are specified in the development spec with exact code)
2. **GREEN**: Write the minimum code to make tests pass
3. **REFACTOR**: Clean up code while keeping tests green

No exceptions. No "write code then add tests later."

### 1.3 Incremental Delivery via Sprints

Each sprint produces a **testable, verifiable increment**. Sprints are small (5-15 components) and focused on a single capability. After each sprint:
- All new tests pass
- All previous tests pass (regression protection)
- Coverage targets are met
- The increment can be demonstrated

### 1.4 Traceability

Every artifact traces back to requirements:
```
Requirements → Architecture Sections → Components → Sprints → Tests → Code
```

The completeness map tracks every component from specification to implementation.

### 1.5 Quality Gates

Every sprint must pass quality gates before proceeding:
- Unit tests pass with `-race` flag
- Coverage meets per-package targets
- Linter passes (language-specific)
- Security scanner finds zero issues
- All previous tests still pass

### 1.6 Documentation as Code

Documentation is a living artifact that evolves with the project. Sprint completion is tracked directly in the development spec with checkboxes. The documentation IS the project plan.

---

## 2. Workflow Phases

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PROJECT LIFECYCLE                            │
│                                                                     │
│  Phase 0        Phase 1          Phase 2           Phase 3          │
│  DISCOVERY  →   ARCHITECTURE  →  SPRINT PLANNING → IMPLEMENTATION  │
│  (Human+AI)     (AI generates)   (AI generates)    (AI executes)   │
│                 (Human approves)  (Human approves)  (Human reviews) │
│                                                                     │
│  Phase 4        Phase 5                                             │
│  QUALITY     →  RELEASE                                             │
│  (AI executes)  (Human approves)                                    │
│                                                                     │
│  [Repeat Phases 1-5 for each version delta]                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 0: Discovery (Human + AI)

**Input**: JIRA ticket, verbal description, domain knowledge
**Output**: Structured requirements document (PROJECT-KICKOFF.md filled in)
**Model**: Opus (deep reasoning for requirement extraction)
**Agent**: Plan agent or direct conversation

**Activities**:
1. Human provides JIRA ticket and describes the project verbally
2. AI asks clarifying questions about scope, constraints, and success criteria
3. AI fills in the PROJECT-KICKOFF template with structured requirements
4. Human reviews and approves requirements
5. AI identifies technology choices and external dependencies

**Quality Gate**: Human approves the filled PROJECT-KICKOFF document.

### Phase 1: Architecture (AI generates, Human approves)

**Input**: Approved PROJECT-KICKOFF document
**Output**: Complete ARCHITECTURE-{VERSION}.md
**Model**: Opus (complex architectural reasoning)
**Agent**: Plan agent for initial exploration, then direct writing

**Activities**:
1. AI reads the PROJECT-KICKOFF document and all referenced materials
2. AI uses the ARCHITECTURE-TEMPLATE.md to generate the architecture document
3. AI researches current APIs/libraries using Context7 or web search
4. AI produces the complete architecture with:
   - System overview and diagrams
   - All architectural decisions (AD-X format) with alternatives and trade-offs
   - Detailed component specifications with interfaces and code
   - Data flow diagrams (Mermaid)
   - Metrics, security, and deployment sections
   - Complete code for all interfaces, structs, and core functions
5. Human reviews architecture document
6. AI iterates based on feedback until human approves

**Quality Gate**: Human explicitly approves the architecture document. No implementation begins until this gate is passed.

### Phase 2: Sprint Planning (AI generates, Human approves)

**Input**: Approved ARCHITECTURE document
**Output**: Complete DEVELOPMENT-SPEC-{VERSION}.md
**Model**: Opus (complex planning and test design)
**Agent**: Plan agent for sprint decomposition, then direct writing

**Activities**:
1. AI reads the architecture document completely
2. AI decomposes the architecture into components (C01, C02, ...)
3. AI groups components into sprints with dependency ordering
4. For each sprint, AI writes:
   - Objective and architecture references
   - Component table with IDs, descriptions, files, and test files
   - TDD sections with exact test code (RED phase)
   - Implementation guidance (GREEN phase)
   - Acceptance criteria with runnable commands
5. AI creates the completeness map
6. AI creates the traceability matrix (Requirements → Components → Tests)
7. AI adds global acceptance criteria (coverage targets, security checklist)
8. Human reviews the development spec
9. AI iterates based on feedback until human approves

**Quality Gate**: Human explicitly approves the development spec. No implementation begins until this gate is passed.

### Phase 3: Implementation (AI executes, Human reviews)

**Input**: Approved DEVELOPMENT-SPEC document
**Output**: Working code with tests
**Model**: Sonnet (efficient coding, follows spec precisely)
**Agent**: Coding agent executing sprint by sprint

**Activities**:
For each sprint in sequence:
1. AI reads the sprint section from the development spec
2. AI writes the failing tests FIRST (RED phase - exact code from spec)
3. AI runs tests to confirm they fail
4. AI implements the minimum code to pass (GREEN phase)
5. AI runs tests to confirm they pass
6. AI refactors if needed while keeping tests green (REFACTOR phase)
7. AI runs the full test suite to verify no regressions
8. AI checks coverage targets
9. AI marks sprint acceptance criteria as complete in the development spec
10. AI commits with a descriptive message

**Quality Gate per Sprint**:
- All new tests pass
- All previous tests pass (zero regressions)
- Coverage targets met
- `make lint` / linter passes
- `make build` / compilation succeeds

### Phase 4: Quality Verification (AI executes)

**Input**: All sprints completed
**Output**: Quality report
**Model**: Sonnet (efficient execution of quality checks)
**Agent**: Direct execution

**Activities**:
1. Run full test suite with race detection
2. Run linter and fix actionable issues
3. Run security scanner (gosec, npm audit, etc.)
4. Verify all documentation is in English
5. Verify all sprint tasks are marked complete
6. Create PROJECT-STATUS document
7. Update CLAUDE.md / README.md with current status

**Quality Gate**: Zero failing tests, zero security vulnerabilities, all documentation updated.

### Phase 5: Release (Human approves)

**Input**: Quality verification passed
**Output**: Tagged release, built artifact, deployment
**Model**: Sonnet (efficient execution)
**Agent**: Direct execution

**Activities**:
1. Build production artifact (Docker image, binary, package)
2. Create git tag (following project conventions)
3. Push all commits and tags to remote repository
4. Deploy to target environment
5. Verify deployment health
6. Create release notes

**Quality Gate**: Human approves the release.

---

## 3. Version Increment Workflow

When adding features to an existing project:

1. Create ARCHITECTURE-DELTA document (not a full rewrite)
   - References the base architecture
   - Only documents what changes
   - Uses the ARCHITECTURE-DELTA-TEMPLATE.md

2. Create DEVELOPMENT-SPEC-DELTA document
   - Continues component numbering from previous version (e.g., C75+)
   - Continues sprint numbering (e.g., S14+)
   - Uses the DEVELOPMENT-SPEC-DELTA-TEMPLATE.md

3. Follow Phases 1-5 with the delta documents

**Key Rule**: Delta documents must explicitly state what files are NOT changed and why.

---

## 4. Model Selection Guide

| Phase | Recommended Model | Rationale |
|-------|------------------|-----------|
| Phase 0: Discovery | **Opus** | Deep reasoning for requirement extraction, ambiguity resolution |
| Phase 1: Architecture | **Opus** | Complex architectural decisions, trade-off analysis, system design |
| Phase 2: Sprint Planning | **Opus** | Test design, dependency analysis, comprehensive coverage planning |
| Phase 3: Implementation | **Sonnet** | Efficient code generation following a well-defined spec |
| Phase 4: Quality | **Sonnet** | Mechanical execution of quality checks |
| Phase 5: Release | **Sonnet** | Mechanical execution of build/deploy steps |
| Delta Architecture | **Opus** | Understanding existing system + designing changes |
| Delta Sprint Planning | **Opus** | Understanding existing tests + designing new sprints |
| Bug Fixes | **Sonnet** | Focused, efficient fixes with test verification |

**Rule of Thumb**: Use Opus when **thinking** (architecture, planning, analysis). Use Sonnet when **doing** (coding, testing, deploying).

---

## 5. Agent Selection Guide

| Task | Agent Type | Description |
|------|-----------|-------------|
| Codebase exploration | `Explore` agent | Fast search for patterns, files, and structure |
| Architecture planning | `Plan` agent | Design implementation approach before writing |
| Sprint implementation | Direct (no subagent) | Follow spec precisely, write code directly |
| Multi-file research | `general-purpose` agent | Deep research across codebase |
| Test execution | `Bash` tool | Run tests, linter, security scanner |
| Documentation generation | Direct (no subagent) | Write documentation following templates |
| Bug investigation | `gsd-debugger` agent | Scientific method debugging |
| Code review | `Explore` agent | Search for patterns and anti-patterns |

---

## 6. File Naming Conventions

### Architecture Documents
```
docs/ARCHITECTURE-{MAJOR}_{MINOR}_{PATCH}.md      # Base or delta
```
Examples: `ARCHITECTURE-1_0_0.md`, `ARCHITECTURE-1_2_0.md`

### Development Specifications
```
docs/DEVELOPMENT-SPEC-{MAJOR}_{MINOR}_{PATCH}.md   # Base or delta
```
Examples: `DEVELOPMENT-SPEC-1_0_0.md`, `DEVELOPMENT-SPEC-1_2_0.md`

### Project Status
```
docs/PROJECT-STATUS-v{MAJOR}_{MINOR}_{PATCH}.md
```

### Business Logic
```
docs/BUSINESS-LOGIC.md                              # Single document, updated per version
```

---

## 7. Sprint Size Guidelines

| Sprint Type | Components | Tests | Duration Estimate |
|------------|-----------|-------|------------------|
| Scaffolding | 3-5 | Compilation only | Small |
| Data Layer | 5-8 | 10-15 unit tests | Small |
| Core Logic | 3-5 | 15-25 unit tests | Medium |
| Controllers/Services | 5-7 | 15-20 unit tests | Medium |
| Integration | 3-5 | 5-10 integration tests | Medium |
| Deployment/Config | 5-10 | Manual verification | Small |
| E2E/Dashboard | 3-5 | 5-10 E2E tests | Medium |

**Rule**: If a sprint has more than 15 components, split it into two sprints.

---

## 8. Mandatory Context7 Usage

**CRITICAL**: When generating architecture or development spec documents, the AI MUST use Context7 (MCP tool `mcp__context7__resolve-library-id` + `mcp__context7__query-docs`) to verify:

1. Current API versions and function signatures
2. Non-deprecated patterns and best practices
3. Correct import paths and module names
4. Framework-specific conventions

This prevents generating code that uses outdated or deprecated APIs.

---

## 9. Communication Protocol

### Between Human and AI

1. **Human provides**: JIRA ticket, verbal description, domain context
2. **AI asks**: Clarifying questions before starting any phase
3. **AI produces**: Documents using templates
4. **Human reviews**: Approves or requests changes
5. **AI iterates**: Until human approves
6. **AI executes**: Implementation following approved spec
7. **AI reports**: Sprint completion, quality metrics

### Key Rules
- AI never begins implementation without approved architecture
- AI never skips a sprint or reorders without human approval
- AI always marks sprint completion in the development spec
- AI always runs full test suite after each sprint
- AI commits after each sprint with descriptive messages

---

## 10. Template Files Reference

| Template | Location | Purpose |
|----------|----------|---------|
| PROJECT-KICKOFF.md | `.claude/templates/project-init/` | Discovery phase requirements gathering |
| ARCHITECTURE-TEMPLATE.md | `.claude/templates/architecture/` | Base architecture document generation |
| ARCHITECTURE-DELTA-TEMPLATE.md | `.claude/templates/architecture/` | Delta architecture for new versions |
| DEVELOPMENT-SPEC-TEMPLATE.md | `.claude/templates/development-spec/` | Base sprint planning with TDD |
| DEVELOPMENT-SPEC-DELTA-TEMPLATE.md | `.claude/templates/development-spec/` | Delta sprint planning for new versions |
| AGENTS.md | `.claude/templates/agents/` | Agent roles, models, and skills |

---

## Appendix A: Quality Metrics Reference

| Metric | Minimum Target | Ideal |
|--------|---------------|-------|
| Unit test coverage (core logic) | > 90% | > 95% |
| Unit test coverage (adapters) | > 80% | > 90% |
| Unit test coverage (global) | > 80% | > 90% |
| Linter issues | 0 actionable | 0 total |
| Security vulnerabilities | 0 | 0 |
| Test race conditions | 0 | 0 |
| Build compilation | 0 errors | 0 warnings |

## Appendix B: Commit Message Convention

```
<type>(<scope>): <description>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
**Scope**: Package or component name (optional)
**Description**: Imperative mood, lowercase, no period

Examples:
```
feat(cache): Add NodePoolAggregate struct and GetByNodePool method
fix(controller): Handle NaN in reconcile latency metric
docs: Add ARCHITECTURE-1_2_0.md for node intelligence features
test(metrics): Add UpdateNodePoolMetrics emission tests
```

---

**Last Updated**: Template v1.0
**Based on**: GPU Reporter Operator v1.2.0 methodology (98.5% completion, 236 tests, production deployed)
