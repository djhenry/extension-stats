# Reverse Engineer — Extract Full Documentation from Existing Codebase

You are performing a **complete reverse engineering** of an existing codebase to generate all methodology documents. This is the INVERSE of the normal flow: instead of writing specs then code, you are reading code to produce specs.

**Project path**: $ARGUMENTS (e.g., "." for current directory, or a path to another project)

## ⚠️ MANDATORY: Model and Ralph Wiggum Loop

### Model: Opus 4.6 (1M Context)

**This command REQUIRES Opus.** If not already using Opus, inform the user:
> "This command requires Opus model for deep codebase analysis. Please run `/model opus` first."

Do NOT proceed with Sonnet — the analysis quality will be insufficient.

### Activate Ralph Wiggum Loop

**BEFORE doing anything else**, activate the Ralph Wiggum loop:

```
/ralph-wiggum:ralph-loop
```

Configure the loop with:
- **Max iterations**: 20
- **Completion promise**: `REVERSE_ENGINEERING_DONE` — only output this when ALL 5 documents are generated, internally consistent, and approved by the user.

**Why Ralph loop**: Reverse engineering requires multiple passes:
- Pass 1: Broad exploration, rough document skeleton
- Pass 2: Deep dive into specific components, fill gaps
- Pass 3: Cross-reference consistency between documents
- Pass 4+: Iterative quality improvement based on user feedback

---

## Phase 1: Discovery — Ask Questions FIRST

**CRITICAL: Do NOT start analyzing code until you have asked the user ALL necessary questions.**

### Mandatory Questions

Use `AskUserQuestion` to ask the following:

1. **Purpose of reverse engineering**:
   - "Understand and improve the existing project" (keep same technology)
   - "Migrate to a different technology" (if so, which target technology?)
   - "Onboard new team members" (documentation for humans)
   - "Create a specification for a rewrite from scratch"

2. **Project context**:
   - "What does this project do? (1-2 sentences)"
   - "Who are the users/consumers?"
   - "What is the business domain?"

3. **Known information**:
   - "Is there any existing documentation? (README, wiki, JIRA tickets)"
   - "Are there specific areas you want documented in extra detail?"
   - "Are there known issues, technical debt, or pain points?"

4. **Constraints**:
   - "Are there external dependencies I should know about? (APIs, CRDs, databases)"
   - "Are there security or compliance requirements?"
   - "What environments does this deploy to?"

5. **Output preferences**:
   - "Where should I create the documents? (default: docs/)"
   - "Should I include the project version in filenames? (e.g., ARCHITECTURE-1_0_0.md)"
   - "What version number should I use? (default: detect from code or use 1.0.0)"

### Additional Questions

Based on initial code exploration, ask about:
- Unclear business rules you find in the code
- Magic numbers or undocumented constants
- Commented-out code or TODO markers
- Configuration patterns you don't understand
- External systems referenced in the code

**RULE**: Ask ALL questions in a SINGLE batch using `AskUserQuestion` with multiple questions. Do NOT drip-feed questions one at a time.

---

## Phase 2: Deep Codebase Exploration

After questions are answered, perform an exhaustive analysis. Use multiple Explore agents in parallel for maximum coverage.

### 2.1 Project Structure Analysis

```
Tasks to execute (use Explore agents in parallel):

Agent 1: "Project Structure and Build System"
- Read all build files (Makefile, package.json, go.mod, pyproject.toml, etc.)
- Identify the entry point(s)
- Map the directory structure to architectural layers
- List all dependencies with versions
- Document build, test, lint, deploy commands
- Identify CI/CD configuration

Agent 2: "Domain Layer / Business Logic"
- Find all domain/business logic code (models, services, algorithms)
- Extract ALL business rules, calculations, and formulas
- Identify data structures and their relationships
- Find validation rules, edge case handling
- Extract constants and their meanings

Agent 3: "Adapter Layer / Infrastructure"
- Find all external integrations (APIs, databases, queues, watches)
- Document controllers, handlers, routes, endpoints
- Extract RBAC rules, security configurations
- Map data flow from input to output
- Identify event handling, predicates, filters

Agent 4: "Testing and Quality"
- Analyze test structure and coverage
- Extract test patterns (table-driven, fixtures, mocks)
- Count tests by category (unit, integration, e2e)
- Identify testing frameworks and tools
- Note any testing gaps
```

### 2.2 Metrics and Observability Analysis

- Find ALL exposed metrics (Prometheus, StatsD, custom)
- Document health endpoints
- Find alerting rules
- Find dashboard configurations (Grafana JSON, etc.)

### 2.3 Deployment Analysis

- Read Dockerfiles, Helm charts, Kustomize overlays, Terraform, CDK
- Document all environments and their configurations
- Extract security contexts, resource limits
- Find network policies

### 2.4 Code Quality Analysis

Run available quality tools:
```bash
# Try these in order, use whichever works:
make lint 2>/dev/null || echo "No lint target"
make test 2>/dev/null || echo "No test target"
make gosec 2>/dev/null || echo "No gosec target"
```

---

## Phase 3: Document Generation

Generate documents in this order (most concrete to most abstract):

### 3.1 Generate CLAUDE.md

**Template**: `.claude/templates/project-init/CLAUDE-MD-TEMPLATE.md`

This is the quickest document — it captures:
- Build/test/deploy commands (from Makefile/package.json analysis)
- Architecture overview (from directory structure analysis)
- Important constraints (from code analysis)
- Anti-patterns (from code smells and patterns found)
- Metrics reference (from metrics analysis)

**Write to**: `CLAUDE.md` (project root)

### 3.2 Generate BUSINESS-LOGIC.md

**Template**: `.claude/templates/business-logic/BUSINESS-LOGIC-TEMPLATE.md`

Extract from code:
- Data models → field tables with types and sources
- Algorithms → pseudo-code from actual function implementations
- Business rules → from conditional logic, validations, transformations
- Formulas → from calculated fields, aggregations, metrics
- Edge cases → from error handling, special case branches, comments
- Data flow → from tracing input through processing to output

**CRITICAL**: Do NOT just describe what the code does — explain the BUSINESS REASON behind each rule. If the reason is unclear, note it as "Rationale: unclear from code, verify with team" and add it to the questions for the user.

**Write to**: `docs/BUSINESS-LOGIC.md`

### 3.3 Generate ARCHITECTURE.md

**Template**: `.claude/templates/architecture/ARCHITECTURE-TEMPLATE.md`

Extract from code:
- Executive summary → from README + code analysis
- System context → from external dependencies and integrations
- Architecture decisions → INFER from code patterns:
  - Why this language/framework?
  - Why this architecture pattern? (hexagonal, MVC, etc.)
  - Why this data storage approach?
  - Why this communication pattern?
  - Why this deployment model?

  For each decision, document:
  - **Decision**: What was chosen (evident from code)
  - **Alternatives**: What COULD have been chosen (based on domain knowledge)
  - **Rationale**: INFERRED reasons (mark as "inferred" if not documented)
  - **Trade-offs**: What the choice gains and loses

- Components → from code modules/packages with full interface code
- Data structures → from struct/class definitions with ALL fields
- Metrics → from metric registration code
- Security → from manifests, RBAC, security contexts
- Deployment → from Dockerfiles, Kustomize, Helm
- Project structure → from directory listing with annotations

**Write to**: `docs/ARCHITECTURE-{VERSION}.md`

### 3.4 Generate DEVELOPMENT-SPEC.md

**Template**: `.claude/templates/development-spec/DEVELOPMENT-SPEC-TEMPLATE.md`

This is the most complex reverse engineering task. You must:

1. **Decompose the codebase into components** (C01, C02, ...)
   - Each function, struct, interface, config file = component
   - Number them sequentially

2. **Group components into logical sprints**
   - Sprint 1: Scaffolding (project init, type definitions)
   - Sprint 2: Data layer (caches, stores, models)
   - Sprint 3: Business logic (algorithms, extractors)
   - Sprint 4+: Adapters (controllers, handlers)
   - Sprint N: Metrics, wiring, deployment, tests

   Order sprints by dependency: what had to exist before what?

3. **For each sprint, document the EXISTING tests**
   - Extract test function signatures from test files
   - Document what each test verifies
   - Note test patterns (table-driven, fixtures, etc.)
   - Mark coverage per package

4. **Create completeness map**
   - All components with status "✅ Done" (since code exists)
   - Reference architecture sections

5. **Create traceability matrix**
   - Map components to architecture sections
   - Map components to test files

**Write to**: `docs/DEVELOPMENT-SPEC-{VERSION}.md`

### 3.5 Generate PROJECT-KICKOFF.md

**Template**: `.claude/templates/project-init/PROJECT-KICKOFF.md`

Reconstruct requirements from implementation:
- Problem statement → from README + code purpose
- Scope → from implemented features
- Technology stack → from actual dependencies
- Constraints → from security, RBAC, deployment configs
- Data model → from domain structures
- Observability → from metrics, health endpoints, dashboards
- Testing strategy → from existing test infrastructure
- Deployment config → from manifests and overlays

**Write to**: `docs/PROJECT-KICKOFF.md`

---

## Phase 4: Cross-Reference Validation

After generating all 5 documents, verify internal consistency:

1. **Architecture ↔ Business Logic**: Every business rule in BUSINESS-LOGIC.md should be traceable to a component in ARCHITECTURE.md
2. **Architecture ↔ Dev Spec**: Every component in ARCHITECTURE.md should appear in the completeness map of DEVELOPMENT-SPEC.md
3. **Dev Spec ↔ Tests**: Every test file referenced in DEVELOPMENT-SPEC.md should actually exist
4. **CLAUDE.md ↔ Architecture**: Commands in CLAUDE.md should match the build system documented in ARCHITECTURE.md
5. **Metrics**: All metrics in CLAUDE.md should match the metrics reference in ARCHITECTURE.md

Fix any inconsistencies found.

---

## Phase 5: User Review

Present a summary to the user:

```
Reverse Engineering Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Documents generated:
  ✅ CLAUDE.md                    — {N} lines
  ✅ docs/BUSINESS-LOGIC.md       — {N} lines
  ✅ docs/ARCHITECTURE-{V}.md     — {N} lines
  ✅ docs/DEVELOPMENT-SPEC-{V}.md — {N} lines
  ✅ docs/PROJECT-KICKOFF.md      — {N} lines

Codebase analysis:
  Components identified:  {N}
  Sprints reconstructed:  {N}
  Tests documented:       {N}
  Metrics found:          {N}
  Business rules:         {N}
  Edge cases:             {N}
  Architecture decisions: {N} (inferred)

Questions for the user:
  {LIST_OF_OPEN_QUESTIONS_ABOUT_UNCLEAR_BUSINESS_RULES}
```

Ask the user to review each document and provide feedback. Iterate based on their corrections.

---

## Phase 6: Commit

After user approval, commit all generated documents:

```
docs: Reverse engineer project documentation from existing codebase

Generated from code analysis:
- CLAUDE.md: Build commands, architecture overview, constraints
- BUSINESS-LOGIC.md: {N} domain rules, {M} algorithms, {K} edge cases
- ARCHITECTURE-{VERSION}.md: {N} components, {M} decisions, {K} metrics
- DEVELOPMENT-SPEC-{VERSION}.md: {N} sprints, {M} components, {K} tests
- PROJECT-KICKOFF.md: Reconstructed requirements

Total: {TOTAL_LINES} lines of documentation
```

**Only after ALL documents are generated, validated, and approved**, output:
```
<promise>REVERSE_ENGINEERING_DONE</promise>
```

---

## CRITICAL RULES

- **NEVER guess business logic** — if you can't determine the business reason from code, mark it as "verify with team" and ask the user
- **NEVER skip edge cases** — every `if/else`, error handler, and special case branch is a potential business rule
- **NEVER invent architecture decisions** — only document decisions you can INFER from the code. Mark all as "inferred from code" unless documented
- **ALWAYS read test files** — tests are the best documentation of intended behavior
- **ALWAYS cross-reference** — the 5 documents must be internally consistent
- **ALWAYS use Explore agents** — the codebase is too large for manual file-by-file reading
- **ALWAYS ask before assuming** — when in doubt, ask the user
- **NEVER output REVERSE_ENGINEERING_DONE** until the user has approved the documents
