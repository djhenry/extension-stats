# Generate Development Specification — Phase 2

You are generating a COMPLETE development specification with TDD sprint planning.

## Prerequisites
- `docs/ARCHITECTURE-{VERSION}.md` must exist and be approved
- You MUST be using the **Opus** model

## Step 1: Read inputs
1. Read the APPROVED architecture document completely — every section
2. Read `.claude/templates/development-spec/DEVELOPMENT-SPEC-TEMPLATE.md`
3. Read `.claude/templates/METHODOLOGY.md` — sections 1 (Principles) and 7 (Sprint Size)
4. If it exists, read `docs/BUSINESS-LOGIC.md` for domain rules

## Step 2: Decompose into components
1. Go through EVERY section of the architecture document
2. Identify EVERY implementable component (struct, function, interface, config file, test)
3. Assign sequential IDs: C01, C02, C03, ...
4. For each component note: architecture section, source file, test file

## Step 3: Group into sprints
Organize components into sprints following this order:
1. **S1: Scaffolding** — project init, type definitions, directory structure
2. **S2: Data Layer** — caches, stores, indexes (pure domain, no framework)
3. **S3: Business Logic** — core algorithms, extractors, calculators
4. **S4-S6: Adapters** — controllers, handlers, services (framework-specific)
5. **S7: Metrics/Output** — metric registration, emission logic
6. **S8: Wiring** — main entry point, dependency injection
7. **S9: Integration Tests** — cross-component tests with real dependencies
8. **S10: Deployment Config** — manifests, overlays, environment configs
9. **S11: CI/CD and Build** — Dockerfile, Makefile, CI pipeline
10. **S12: E2E and Dashboard** — end-to-end tests, visualization
11. **S13: Observability** — alerts, runbooks, monitoring

Adjust sprint count and content based on the project. Keep 5-12 components per sprint.

## Step 4: Write TDD test specifications
For EACH sprint, write:
- **RED phase**: Complete, compilable test code with realistic assertions
- **GREEN phase**: Implementation guidance referencing architecture sections
- **REFACTOR phase**: Existing test updates for regression protection

Test code must be REAL code, not pseudocode. Use Context7 to verify test framework APIs.

## Step 5: Create tracking artifacts
1. **Completeness Map**: Table with ALL components (ID, name, arch section, sprint, files, tests, status)
2. **Sprint Plan Overview**: Summary table with sprint names, components, test counts
3. **Dependency Graph**: Mermaid diagram showing sprint dependencies
4. **Traceability Matrix**: Requirements → Components → Sprints → Tests
5. **Global Acceptance Criteria**: Coverage targets, security checklist, version checklist
6. **Sprint Execution Checklists**: Numbered step-by-step for each sprint

## Step 6: Generate the document
Create `docs/DEVELOPMENT-SPEC-{VERSION}.md` with ALL sections filled.

## Step 7: Self-review
- [ ] Every component has a unique ID
- [ ] Every component appears in BOTH the completeness map AND a sprint
- [ ] Every sprint has test code written FIRST (RED phase)
- [ ] Test code is REAL, compilable code
- [ ] Every sprint has acceptance criteria with runnable commands
- [ ] Every sprint has "All existing tests still pass (regression)" criterion
- [ ] Traceability matrix connects all requirements to components
- [ ] Sprint execution checklists are provided for ALL sprints

## Step 8: Present for approval
Show the document to the user. Iterate until approved.

## Step 9: Next phase
Once approved:
> "Development specification complete. The project has {N} sprints with {M} components. Next step: switch to Sonnet model (`/model sonnet`) and run `/rh-execute-sprint 1` to begin implementation."
