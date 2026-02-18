# {PROJECT_NAME} — Architecture Delta v{VERSION}

<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                CLAUDE CODE — ARCHITECTURE DELTA TEMPLATE                     ║
║                                                                              ║
║  PURPOSE: Document architecture changes for a NEW VERSION of an existing     ║
║           project. Only documents what CHANGES — not the entire system.      ║
║  MODEL: Use Opus.                                                            ║
║  INPUT: Base ARCHITECTURE document + feature requirements.                   ║
║  REFERENCE: Based on ARCHITECTURE-1_1_0.md and ARCHITECTURE-1_2_0.md        ║
║                                                                              ║
║  RULES:                                                                      ║
║  1. Reference the base architecture for unchanged sections.                  ║
║  2. Only document NEW or MODIFIED components.                                ║
║  3. Explicitly list files NOT changed and why.                               ║
║  4. Continue numbering from the base (AD-N+1, etc.)                         ║
║  5. Show impact analysis: what existing code is affected.                    ║
║  6. Maintain backward compatibility unless explicitly breaking.              ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

**Version**: {VERSION}
**Date**: {DATE}
**Based on**: [ARCHITECTURE-{BASE_VERSION}.md](ARCHITECTURE-{BASE_VERSION}.md)
**JIRA**: [{JIRA_ID}]({JIRA_URL})
**Methodology**: TDD, Incremental Delivery
**Target coverage**: > {COVERAGE_TARGET}%

**Related Documents**:
- [ARCHITECTURE-{BASE_VERSION}.md](ARCHITECTURE-{BASE_VERSION}.md) — Base architecture
- [DEVELOPMENT-SPEC-{BASE_VERSION}.md](DEVELOPMENT-SPEC-{BASE_VERSION}.md) — Base development specification
- [BUSINESS-LOGIC.md](BUSINESS-LOGIC.md) — Business rules

---

## 1. Feature Summary

### 1.1 What's New in v{VERSION}

<!--
CLAUDE: Describe the new features in 3-5 bullet points.
Each bullet should be a user-visible capability.
-->

### 1.2 Motivation

<!--
CLAUDE: Why is this version needed? What problem does it solve?
2-3 paragraphs.
-->

### 1.3 Design Principles

<!--
CLAUDE: List the principles guiding the design of these changes.
Example:
1. **Zero Breaking Changes**: All existing metrics and APIs remain unchanged
2. **Minimal Code Modifications**: Extend, don't rewrite
3. **Same Performance Profile**: New features add < 5ms to reconciliation
-->

---

## 2. Impact Analysis

### 2.1 Files Modified

| # | File | Changes | Risk |
|---|------|---------|------|
| 1 | `{FILE_PATH}` | {DESCRIPTION_OF_CHANGES} | {LOW/MEDIUM/HIGH} |

### 2.2 Files Added

| # | File | Purpose |
|---|------|---------|
| 1 | `{FILE_PATH}` | {PURPOSE} |

### 2.3 Files NOT Changed

<!--
CLAUDE: This is CRITICAL. Explicitly document what stays the same and why.
This prevents accidental modifications and clarifies scope.
-->

| File | Reason Not Changed |
|------|-------------------|
| `{FILE_PATH}` | {REASON} |

### 2.4 Backward Compatibility

<!--
CLAUDE: Confirm that existing functionality is preserved.
List any breaking changes (should be zero for minor versions).
-->

- [ ] All existing metrics continue to emit with same labels
- [ ] All existing API contracts preserved
- [ ] All existing tests pass without modification
- [ ] No existing configuration changes required

---

## 3. New Architecture Decisions

<!--
CLAUDE: Continue AD numbering from base architecture.
Only document NEW decisions for this version.
-->

#### AD-{N}: {DECISION_TITLE}

**Decision**: {WHAT WAS DECIDED}

**Alternatives considered**:
- {ALTERNATIVE_1}
- {ALTERNATIVE_2}

**Reasons**:
1. {REASON_1}
2. {REASON_2}

**Trade-offs**:
- ✅ {ADVANTAGE}
- ❌ {DISADVANTAGE}

---

## 4. Modified Components

<!--
CLAUDE: For each MODIFIED component, show:
- What changes in the component
- New code additions (complete code)
- How it integrates with existing code
Reference base architecture sections for unchanged behavior.
-->

### 4.1 {COMPONENT_NAME} (Modified)

**Base Reference**: Section {N} of ARCHITECTURE-{BASE_VERSION}.md

#### What Changes
<!-- Bullet list of specific changes -->

#### New/Modified Code

```{LANGUAGE}
// {FILE_PATH} — additions/modifications
{CODE}
```

#### Integration with Existing Code
<!-- How the new code connects to existing components -->

---

## 5. New Components

<!--
CLAUDE: For each NEW component, provide full specification
following the same format as Section 4 in the base architecture.
-->

### 5.1 {NEW_COMPONENT_NAME}

#### Purpose
<!-- 1-2 sentences -->

#### Interface

```{LANGUAGE}
// {FILE_PATH}
{INTERFACE_CODE}
```

#### Implementation

```{LANGUAGE}
// {FILE_PATH}
{IMPLEMENTATION_CODE}
```

---

## 6. New Data Structures

<!--
CLAUDE: Document new structs/classes and extensions to existing ones.
Show full struct definition including existing fields for context.
Mark new fields clearly with comments.
-->

### 6.1 {DATA_STRUCTURE} (Extended)

```{LANGUAGE}
type {STRUCT_NAME} struct {
    // Existing fields (from v{BASE_VERSION})
    {FIELD_1} {TYPE_1}
    {FIELD_2} {TYPE_2}

    // NEW in v{VERSION}: {FEATURE_NAME}
    {NEW_FIELD_1} {TYPE} // {DESCRIPTION}
    {NEW_FIELD_2} {TYPE} // {DESCRIPTION}
}
```

### 6.2 {NEW_DATA_STRUCTURE}

```{LANGUAGE}
// New struct for v{VERSION}
type {STRUCT_NAME} struct {
    {FIELDS}
}
```

---

## 7. New Aggregation/Query Methods

<!--
CLAUDE: Document new methods on existing data structures.
Show complete implementation with thread-safety.
-->

### 7.1 {METHOD_NAME}

```{LANGUAGE}
// {FILE_PATH}
{METHOD_IMPLEMENTATION}
```

**Key**: How the aggregation key is constructed
**Thread-safety**: {MECHANISM}
**Performance**: {BIG_O_OR_NOTES}

---

## 8. New Metrics

<!--
CLAUDE: Document only NEW metrics added in this version.
Reference Section 21 of base architecture for existing metrics.
-->

### 8.1 Metrics Summary

**Existing metrics** (from v{BASE_VERSION}): {N} metrics (unchanged)
**New metrics** (v{VERSION}): {M} metrics
**Total**: {N+M} metrics

### 8.2 New Metric Specifications

| # | Metric Name | Type | Labels | Description | Updated By |
|---|------------|------|--------|-------------|-----------|
| {N+1} | `{PREFIX}_{NAME}` | {TYPE} | `{LABELS}` | {DESC} | {COMPONENT} |

### 8.3 Metrics Implementation

```{LANGUAGE}
// {FILE_PATH} — new metric registrations
{METRICS_CODE}
```

### 8.4 Metrics Emission

```{LANGUAGE}
// {FILE_PATH} — new method for emitting metrics
{EMISSION_CODE}
```

---

## 9. Modified Event Handling / Predicates

<!--
CLAUDE: If event filtering changes (e.g., new labels trigger reconciliation),
document the changes to predicates/filters.
-->

### 9.1 Updated Predicates

**Before** (v{BASE_VERSION}):
```{LANGUAGE}
{OLD_PREDICATE_CODE}
```

**After** (v{VERSION}):
```{LANGUAGE}
{NEW_PREDICATE_CODE}
```

**New trigger conditions**:
<!-- List what new events/changes cause processing -->

---

## 10. New Dashboard Panels

<!--
CLAUDE: Document new dashboard panels.
Reference base architecture for existing panels.
-->

### 10.1 Dashboard Changes Summary

**Existing panels** (from v{BASE_VERSION}): {N} panels
**New panels** (v{VERSION}): {M} panels
**Total**: {N+M} panels in {K} categories

### 10.2 New Panel Specifications

#### Panel: {PANEL_TITLE}

| Property | Value |
|----------|-------|
| Category | {CATEGORY} |
| Type | {stat/gauge/table/graph} |
| Query | `{QUERY}` |
| Description | {DESCRIPTION} |

---

## 11. Performance Impact Analysis

| Metric | Before v{VERSION} | After v{VERSION} | Notes |
|--------|-------------------|-------------------|-------|
| {LATENCY_METRIC} | {BEFORE} | {AFTER} | {EXPLANATION} |
| {MEMORY_METRIC} | {BEFORE} | {AFTER} | {EXPLANATION} |
| {CARDINALITY} | {BEFORE} | {AFTER} | {EXPLANATION} |

---

## 12. Deployment Changes

<!--
CLAUDE: Document any changes to deployment configuration.
E.g., new resource limits, new environment variables, new manifests.
-->

### 12.1 Resource Changes

| Environment | Before | After | Reason |
|-------------|--------|-------|--------|
| {ENV} | {OLD_RESOURCES} | {NEW_RESOURCES} | {REASON} |

### 12.2 New Configuration

<!-- Any new command-line args, env vars, or config files -->

---

## 13. Migration Guide

<!--
CLAUDE: How does someone upgrade from v{BASE_VERSION} to v{VERSION}?
Step-by-step instructions.
-->

### 13.1 Upgrade Steps

1. {STEP_1}
2. {STEP_2}
3. {STEP_3}

### 13.2 Rollback Procedure

1. {ROLLBACK_STEP_1}
2. {ROLLBACK_STEP_2}

---

## 14. Label and Constant Reference

<!--
CLAUDE: Document all new labels, constants, and configuration values
added in this version.
-->

### 14.1 New Constants

```{LANGUAGE}
// {FILE_PATH}
const (
    {CONSTANT_1} = "{VALUE_1}" // {DESCRIPTION}
    {CONSTANT_2} = "{VALUE_2}" // {DESCRIPTION}
)
```

### 14.2 New Labels / Tags

| Label Key | Example Values | Source | Used By |
|-----------|---------------|--------|---------|
| `{LABEL}` | `{VALUES}` | {SOURCE} | {COMPONENTS} |

---

**End of Architecture Delta v{VERSION}**

<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║  CLAUDE POST-GENERATION CHECKLIST (DELTA):                                   ║
║                                                                              ║
║  [ ] Base architecture document referenced correctly                         ║
║  [ ] Files NOT changed are explicitly listed                                 ║
║  [ ] Backward compatibility confirmed                                        ║
║  [ ] New AD-X decisions continue numbering from base                         ║
║  [ ] All new code is complete (not pseudocode)                               ║
║  [ ] Performance impact analysis is realistic                                ║
║  [ ] Migration guide is actionable                                           ║
║  [ ] New metrics have complete specifications                                ║
║  [ ] Context7 was used to verify new API patterns                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->
