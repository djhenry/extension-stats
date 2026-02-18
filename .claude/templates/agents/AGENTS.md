# Agent Roles, Models, and Skills

<!--
PURPOSE: Define which Claude Code agents, models, and skills to use for each phase
of the development methodology. This ensures consistent, high-quality output
across all projects regardless of the human operator.
-->

---

## 1. Model Selection Matrix

### Primary Rule

> **Opus for THINKING. Sonnet for DOING.**

| Activity | Model | Rationale |
|----------|-------|-----------|
| Requirement extraction | **Opus** | Deep reasoning to identify ambiguities, gaps, and implicit requirements |
| Architecture generation | **Opus** | Complex system design, trade-off analysis, decision justification |
| Sprint planning | **Opus** | Test design, dependency analysis, comprehensive component decomposition |
| Code implementation | **Sonnet** | Efficient code generation following a well-defined specification |
| Test writing (from spec) | **Sonnet** | Mechanical translation of spec tests into code |
| Quality checks | **Sonnet** | Running lint, security scans, test suites |
| Documentation updates | **Sonnet** | Updating README, CLAUDE.md, changelogs |
| Build and deploy | **Sonnet** | Executing build commands, deployment scripts |
| Bug investigation | **Opus** | Root cause analysis requiring deep codebase understanding |
| Architecture review | **Opus** | Evaluating design decisions, identifying issues |
| Delta architecture | **Opus** | Understanding existing system + designing targeted changes |

### When to Switch Models

**Switch to Opus when**:
- You're about to make an architectural decision
- You need to understand complex cross-cutting concerns
- You're designing test strategies for new features
- You're writing a document that will guide future implementation
- You're debugging a complex issue with multiple interacting components

**Switch to Sonnet when**:
- The spec clearly defines what to implement
- You're writing tests that are already specified in the dev-spec
- You're running quality checks (lint, security, tests)
- You're committing, tagging, building, or deploying
- You're making small, well-defined changes

---

## 2. Agent Roles by Phase

### Phase 0: Discovery

| Task | Agent Type | Model | Details |
|------|-----------|-------|---------|
| Read JIRA ticket | Direct (WebFetch) | Opus | Fetch and analyze JIRA content |
| Ask clarifying questions | Direct (AskUserQuestion) | Opus | Use structured questions with options |
| Fill PROJECT-KICKOFF | Direct (Write) | Opus | Generate structured requirements |
| Research technologies | Explore agent | Opus | Search for current best practices |
| Verify API versions | Context7 MCP tools | Opus | `resolve-library-id` + `query-docs` |

**Workflow**:
```
1. Human provides JIRA ticket URL + verbal description
2. Claude (Opus) reads JIRA → asks questions → fills PROJECT-KICKOFF.md
3. Human reviews → Claude iterates until approved
```

### Phase 1: Architecture

| Task | Agent Type | Model | Details |
|------|-----------|-------|---------|
| Explore existing codebase | Explore agent | Opus | If extending existing project |
| Research library APIs | Context7 MCP tools | Opus | Verify all API patterns |
| Generate architecture doc | Direct (Write) | Opus | Using ARCHITECTURE-TEMPLATE.md |
| Create Mermaid diagrams | Direct (Write) | Opus | Part of architecture generation |
| Write interface contracts | Direct (Write) | Opus | Complete code for all interfaces |
| Review for completeness | Direct | Opus | Self-review against checklist |

**Workflow**:
```
1. Claude (Opus) reads approved PROJECT-KICKOFF.md
2. Claude uses Context7 to verify all library APIs
3. Claude generates ARCHITECTURE-{VERSION}.md using template
4. Claude self-reviews against post-generation checklist
5. Human reviews → Claude iterates until approved
```

### Phase 2: Sprint Planning

| Task | Agent Type | Model | Details |
|------|-----------|-------|---------|
| Decompose into components | Direct | Opus | Read architecture, create component list |
| Design sprint sequence | Direct | Opus | Dependency analysis, sprint sizing |
| Write test specifications | Direct | Opus | Complete test code for each sprint |
| Create traceability matrix | Direct | Opus | Link requirements → components → tests |
| Generate dev-spec doc | Direct (Write) | Opus | Using DEVELOPMENT-SPEC-TEMPLATE.md |

**Workflow**:
```
1. Claude (Opus) reads approved ARCHITECTURE-{VERSION}.md
2. Claude decomposes architecture into numbered components (C01, C02, ...)
3. Claude groups components into sprints with dependency ordering
4. Claude writes complete test code for each sprint (RED phase)
5. Claude creates completeness map and traceability matrix
6. Human reviews → Claude iterates until approved
```

### Phase 3: Implementation

| Task | Agent Type | Model | Details |
|------|-----------|-------|---------|
| Read sprint from spec | Direct (Read) | Sonnet | Read current sprint section |
| Write tests (RED) | Direct (Write/Edit) | Sonnet | Copy test code from spec |
| Run failing tests | Direct (Bash) | Sonnet | Verify tests fail for right reason |
| Implement code (GREEN) | Direct (Write/Edit) | Sonnet | Minimum code to pass tests |
| Run passing tests | Direct (Bash) | Sonnet | Verify all tests pass |
| Refactor | Direct (Edit) | Sonnet | Clean up while keeping tests green |
| Full regression | Direct (Bash) | Sonnet | Run entire test suite |
| Check coverage | Direct (Bash) | Sonnet | Verify coverage targets |
| Mark sprint complete | Direct (Edit) | Sonnet | Update dev-spec checkboxes |
| Commit | Direct (Bash) | Sonnet | Git commit with descriptive message |

**Workflow** (per sprint):
```
1. Claude (Sonnet) reads sprint N from DEVELOPMENT-SPEC
2. For each component in the sprint:
   a. Write tests from spec (RED) → verify they fail
   b. Implement code (GREEN) → verify tests pass
   c. Refactor if needed → verify tests still pass
3. Run full test suite with race detection
4. Check coverage targets
5. Mark acceptance criteria as complete
6. Git commit
```

**Critical Rule**: The implementing agent MUST follow the spec exactly. No improvisation, no "improvements" beyond the spec. If the spec is wrong, stop and ask the human.

### Phase 4: Quality Verification

| Task | Agent Type | Model | Details |
|------|-----------|-------|---------|
| Run linter | Direct (Bash) | Sonnet | Fix actionable issues |
| Run security scanner | Direct (Bash) | Sonnet | Verify 0 vulnerabilities |
| Verify documentation | Direct (Read) | Sonnet | Check English, completeness |
| Create PROJECT-STATUS | Direct (Write) | Sonnet | Following status template |
| Update CLAUDE.md | Direct (Edit) | Sonnet | Update with current status |
| Update README.md | Direct (Edit) | Sonnet | Update features, badges |

### Phase 5: Release

| Task | Agent Type | Model | Details |
|------|-----------|-------|---------|
| Build artifact | Direct (Bash) | Sonnet | Docker build, package, etc. |
| Create git tag | Direct (Bash) | Sonnet | Following tag conventions |
| Push to remote | Direct (Bash) | Sonnet | Push commits + tags |
| Deploy | Direct (Bash) | Sonnet | Apply deployment manifests |
| Verify deployment | Direct (Bash) | Sonnet | Check pods, logs, metrics |

---

## 3. Skill Definitions

### Skill: Sprint Executor

**When to use**: Implementing a sprint from the development spec
**Model**: Sonnet
**Input**: Sprint number and DEVELOPMENT-SPEC path

**Behavior**:
```
1. Read the sprint section from the development spec
2. For each TDD section (T{N}.{X}):
   a. If test section: Write the tests, run them, verify they FAIL
   b. If implementation section: Write the code, run tests, verify they PASS
   c. If update section: Modify existing tests, verify they PASS
3. Run full test suite: verify zero regressions
4. Check coverage: verify targets met
5. Mark acceptance criteria checkboxes as [x]
6. Commit with message: "feat(sprint-{N}): {Sprint Name}"
```

### Skill: Quality Gate

**When to use**: After all sprints are complete
**Model**: Sonnet
**Input**: Project root path

**Behavior**:
```
1. Run: make test (or equivalent)
2. Run: make lint (or equivalent) — fix actionable issues
3. Run: make security-scan (or equivalent) — verify 0 issues
4. Run: test with race detection
5. Check all documentation is in English
6. Verify all sprint checkboxes are marked
7. Output quality report
```

### Skill: Architecture Generator

**When to use**: Starting Phase 1
**Model**: Opus
**Input**: Approved PROJECT-KICKOFF.md

**Behavior**:
```
1. Read PROJECT-KICKOFF.md
2. Read ARCHITECTURE-TEMPLATE.md
3. Use Context7 to verify all library APIs
4. Generate complete ARCHITECTURE-{VERSION}.md
5. Self-review against post-generation checklist
6. Present to human for approval
```

### Skill: Sprint Planner

**When to use**: Starting Phase 2
**Model**: Opus
**Input**: Approved ARCHITECTURE-{VERSION}.md

**Behavior**:
```
1. Read ARCHITECTURE-{VERSION}.md completely
2. Read DEVELOPMENT-SPEC-TEMPLATE.md
3. Use Context7 to verify test framework APIs
4. Decompose architecture into components (C01, C02, ...)
5. Group into sprints with dependency ordering
6. Write complete test code for each sprint
7. Create completeness map and traceability matrix
8. Self-review against post-generation checklist
9. Present to human for approval
```

---

## 4. Subagent Usage Guidelines

### When to Use Subagents

| Situation | Use Subagent? | Agent Type |
|-----------|--------------|-----------|
| Quick file search | No | Use Glob/Grep directly |
| Deep codebase exploration | Yes | Explore agent |
| Understanding complex architecture | Yes | Explore agent (thorough) |
| Running independent quality checks | Yes (parallel) | Bash agents |
| Multi-file research | Yes | general-purpose agent |
| Bug investigation | Yes | gsd-debugger agent |
| Simple implementation from spec | No | Direct coding |

### Parallelization Opportunities

**Can run in parallel**:
- Multiple quality checks (lint + security + tests)
- Independent file reads for analysis
- Multiple Explore agents for different codebases

**Must run sequentially**:
- Sprint implementation (each sprint depends on previous)
- Test writing → running → implementation (TDD order)
- Git operations (add → commit → push)

---

## 5. Context7 Usage Protocol

### When to Use Context7

1. **Architecture Generation**: Verify EVERY library API before writing architecture
2. **Sprint Planning**: Verify test framework assertions and patterns
3. **Implementation**: When unsure about a specific API call

### How to Use Context7

```
Step 1: Resolve library ID
   mcp__context7__resolve-library-id(libraryName="{library}", query="{what you need}")

Step 2: Query documentation
   mcp__context7__query-docs(libraryId="{resolved_id}", query="{specific question}")
```

### Common Libraries to Verify

| Library | Typical Query |
|---------|--------------|
| controller-runtime | "Reconciler interface, predicate functions" |
| client-go | "Kubernetes client fake for testing" |
| testify | "assert and require functions" |
| envtest | "Setting up test environment" |
| prometheus | "GaugeVec, CounterVec registration" |
| pytest | "Fixture patterns, assert syntax" |
| jest | "Mock functions, expect assertions" |

---

## 6. Error Recovery Procedures

### Test Failure During Implementation

```
1. Read the error message carefully
2. Check if the test matches the spec exactly
3. If test is correct: fix the implementation
4. If test has a typo: fix the test, note it in commit message
5. NEVER skip a failing test
```

### Spec Ambiguity During Implementation

```
1. STOP implementation
2. Re-read the architecture document section referenced in the sprint
3. If still ambiguous: Ask the human using AskUserQuestion
4. Document the clarification in the spec
5. Continue implementation
```

### Regression Failure

```
1. STOP implementation
2. Identify which previous test is failing
3. Determine if the failure is caused by the current sprint's changes
4. If yes: fix the implementation to maintain backward compatibility
5. If no: investigate if the previous test has a pre-existing issue
6. NEVER modify a previous test to make it pass unless the test itself is wrong
```

---

## 7. Communication Protocol

### Progress Reporting

After each sprint, report to the human:
```
Sprint {N}: {Name} ✅
- Tests: {X} new, {Y} total, all passing
- Coverage: {Z}% (target: >{T}%)
- Components: C{A}-C{B} complete
- Regressions: 0
```

### Blocking Issues

If blocked, immediately report:
```
⚠️ BLOCKED on Sprint {N}:
- Issue: {description}
- Attempted: {what was tried}
- Options: {possible solutions}
- Recommendation: {preferred solution}
- Need: {what's needed from human}
```

### Sprint Completion Summary

At project completion, provide:
```
PROJECT COMPLETE:
- Version: v{VERSION}
- Components: {X}/{Y} complete ({Z}%)
- Tests: {N} passing
- Coverage: {C}% (target: >{T}%)
- Security: 0 vulnerabilities
- Quality: All checks passing
```

---

**Last Updated**: Template v1.0
**Based on**: GPU Reporter v1.2.0 development methodology
