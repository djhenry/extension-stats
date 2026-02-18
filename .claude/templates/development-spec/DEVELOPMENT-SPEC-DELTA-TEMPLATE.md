# {PROJECT_NAME} — Development Specification v{VERSION} (Delta)

<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║            CLAUDE CODE — DEVELOPMENT SPEC DELTA TEMPLATE                     ║
║                                                                              ║
║  PURPOSE: Sprint plan for NEW FEATURES added to an existing project.         ║
║  MODEL: Use Opus.                                                            ║
║  INPUT: ARCHITECTURE-DELTA-{VERSION}.md + base DEVELOPMENT-SPEC.             ║
║                                                                              ║
║  KEY DIFFERENCES FROM BASE TEMPLATE:                                         ║
║  1. Component IDs CONTINUE from previous version (e.g., C75+)               ║
║  2. Sprint numbers CONTINUE from previous version (e.g., S14+)              ║
║  3. Scope of changes section documents impact radius                         ║
║  4. Combined completeness tracks ALL versions                                ║
║  5. Regression protection is emphasized in every sprint                      ║
║                                                                              ║
║  REFERENCE: Based on DEVELOPMENT-SPEC-1_1_0.md and 1_2_0.md                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

**Version**: {VERSION}
**Date**: {DATE}
**Based on**: [ARCHITECTURE-{VERSION}.md](ARCHITECTURE-{VERSION}.md)
**Related documents**:
- [ARCHITECTURE-{BASE_VERSION}.md](ARCHITECTURE-{BASE_VERSION}.md) — Base architecture
- [DEVELOPMENT-SPEC-{BASE_VERSION}.md](DEVELOPMENT-SPEC-{BASE_VERSION}.md) — Base development specification
**JIRA**: [{JIRA_ID}]({JIRA_URL})
**Methodology**: TDD (Red-Green-Refactor), Iterative-Incremental
**Target coverage**: > {COVERAGE_TARGET}%

---

## 1. Overview

### 1.1 Feature Summary

<!-- CLAUDE: What new features does this version add? Bullet list. -->

### 1.2 Motivation

<!-- CLAUDE: Why are these features needed? 1-2 paragraphs. -->

### 1.3 Design Principles

1. **Backward Compatibility**: All existing tests pass without modification
2. **Minimal Invasiveness**: Extend existing components, don't rewrite them
3. **Same TDD Rigor**: Tests first, always

### 1.4 MCP Context7 (mandatory)

The use of **MCP Context7** is **mandatory** to verify all new API patterns.

---

## 2. Scope of Changes

### 2.1 Files to Modify (Source)

| # | File | Changes |
|---|------|---------|
| 1 | `{FILE_PATH}` | {DESCRIPTION_OF_CHANGES} |

### 2.2 Files to Modify (Tests)

| # | File | Changes |
|---|------|---------|
| 1 | `{TEST_FILE_PATH}` | {DESCRIPTION_OF_TEST_CHANGES} |

### 2.3 Files to Add

| # | File | Purpose |
|---|------|---------|
| 1 | `{FILE_PATH}` | {PURPOSE} |

### 2.4 Files NOT Changed

| File | Reason |
|------|--------|
| `{FILE_PATH}` | {REASON_NOT_CHANGED} |

---

## 3. Sprint Plan

### General Overview

| Sprint | Name | Components | New Tests | Verifiable Increment |
|--------|------|-----------|-----------|---------------------|
| S{N} | {NAME} | C{X}-C{Y} | ~{Z} tests | {INCREMENT} |

### Dependencies

```
Sprint {N} ──> Sprint {N+1} ──> Sprint {N+2}
```

---

## 4. Sprint {N}: {SPRINT_NAME}

### Objective

### Architecture Ref.

- ARCHITECTURE-{VERSION}.md Section {X} ({NAME})

### Components: C{X}-C{Y}

| # | Component | Description | File | Tests |
|---|-----------|-------------|------|-------|
| C{X} | {NAME} | {DESC} | {FILE} | {TEST_FILE} |

### Tests FIRST (TDD)

#### T{N}.1: Tests for {COMPONENT}

**File:** `{TEST_FILE_PATH}` (additions)

```{LANGUAGE}
{TEST_CODE}
```

**Verification:** Tests fail (RED) — {REASON}

#### T{N}.2: Implement {COMPONENT}

**File:** `{FILE_PATH}`

Implement:
- {WHAT_TO_IMPLEMENT}

**Verification:** All tests pass (GREEN)

#### T{N}.3: Update existing tests for new fields

**File:** `{TEST_FILE_PATH}`

Update all existing tests that create `{STRUCT}` to include the new fields
with sensible defaults ({DEFAULTS}).

**Verification:** All existing tests pass (regression)

### Sprint {N} Acceptance Criteria

- [ ] `{TEST_COMMAND}` — all pass
- [ ] `{RACE_TEST_COMMAND}` — passes
- [ ] Coverage > {TARGET}% for {PACKAGE}
- [ ] All existing tests still pass (regression)
- [ ] {SPECIFIC_VERIFICATION}

---

## 5. Sprint {N+1}: {SPRINT_NAME}

<!-- CLAUDE: Repeat sprint structure -->

---

## {M}. Completeness Map (v{VERSION} Delta)

### v{VERSION} Components

| # | Component | ARCH Section | Sprint | Files | Tests | Status |
|---|-----------|-------------|--------|-------|-------|--------|
| C{X} | {NAME} | {SECTION} | S{N} | {FILE} | {TEST_FILE} | Pending |

**Total: {Z} new components for v{VERSION} (C{X}-C{Y})**

### Combined Completeness (v{BASE} + v{VERSION})

| Version | Components | Completed | Pending |
|---------|-----------|-----------|---------|
| v{BASE_VERSION} | {N1} (C01-C{N1}) | {COMPLETED} | {PENDING} |
| v{VERSION} | {N2} (C{X}-C{Y}) | 0 | {N2} |
| **Total** | **{TOTAL}** | **{COMPLETED}** | **{TOTAL_PENDING}** |

---

## {M+1}. Global Acceptance Criteria

### Test Coverage

| Package/Module | Target | v{BASE} Actual | v{VERSION} Target |
|---------------|--------|----------------|-------------------|
| {PACKAGE} | > {TARGET}% | {ACTUAL}% | > {TARGET}% |

### Functional Requirements (v{VERSION})

| ID | Requirement | Verification Sprint |
|----|------------|---------------------|
| R{V}-01 | {REQUIREMENT} | S{N} |

### Non-Functional Requirements

| Requirement | Target | Notes |
|------------|--------|-------|
| {NFR} | {TARGET} | {NOTES} |
| All v{BASE} tests pass | 100% | Regression protection |

### Version Checklist

**v{VERSION}:**
- [ ] All v{BASE} tests pass (~{N} tests)
- [ ] New v{VERSION} tests pass (~{M} tests)
- [ ] `{TEST_COMMAND} -race` passes
- [ ] `{LINT_COMMAND}` passes
- [ ] `{BUILD_COMMAND}` compiles
- [ ] `{SECURITY_COMMAND}` finds 0 issues
- [ ] CLAUDE.md updated with v{VERSION} information
- [ ] README.md updated

---

## {M+2}. Traceability Matrix

### Requirements → Components

| Requirement | Components |
|------------|-----------|
| R{V}-01 | C{X}, C{Y} |

### Components → Sprint

| Sprint | Components |
|--------|-----------|
| S{N} | C{X}-C{Y} ({Z}) |

### Data Flow per Component

```
C{X} ({DESCRIPTION})
  └──> C{Y} ({DESCRIPTION})
         └──> C{Z} ({DESCRIPTION})
```

### Test Coverage Matrix

| Component | Unit Tests | Integration Tests | E2E Tests |
|-----------|-----------|-------------------|-----------|
| C{X}-C{Y} | {TEST_FILE} (S{N}) | {INT_TEST} | - |

---

## Appendix: Sprint Execution Checklist

### Sprint {N} Execution Order

1. [ ] Write {component} tests (RED)
2. [ ] Implement {component} (GREEN)
3. [ ] Update existing tests for new fields
4. [ ] Run full test suite: `{TEST_COMMAND}`
5. [ ] Verify coverage targets met
6. [ ] Verify all existing tests pass (regression)

---

**End of Development Specification v{VERSION} (Delta)**
