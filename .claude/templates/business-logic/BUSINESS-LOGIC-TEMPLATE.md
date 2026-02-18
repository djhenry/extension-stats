# {PROJECT_NAME} — Business Logic

<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                CLAUDE CODE — BUSINESS LOGIC TEMPLATE                         ║
║                                                                              ║
║  PURPOSE: Document ALL domain rules, algorithms, data models, formulas,     ║
║           and edge cases BEFORE implementation begins.                       ║
║  MODEL: Use Opus.                                                            ║
║  WHEN: Create during Phase 1 (Architecture), referenced by Phase 2 sprints. ║
║                                                                              ║
║  This document is the "domain truth" — the architecture and dev spec         ║
║  reference it. If business logic is simple (< 5 rules), embed it in the     ║
║  architecture document instead of creating a separate file.                  ║
║                                                                              ║
║  RULES:                                                                      ║
║  1. Every algorithm must have pseudo-code AND a concrete example            ║
║  2. Every data model must list ALL fields with types and sources            ║
║  3. Every formula must show the calculation with real numbers                ║
║  4. Every edge case must describe the scenario AND the handling             ║
║  5. Use YAML/JSON examples for input data, tables for output data           ║
║                                                                              ║
║  REFERENCE: Based on GPU Reporter BUSINESS-LOGIC.md (11 sections)            ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

**Version**: {VERSION}
**Date**: {DATE}
**JIRA**: [{JIRA_ID}]({JIRA_URL})

---

## Table of Contents

1. [Summary](#1-summary)
2. [Data Model](#2-data-model)
3. [Domain Process 1: {NAME}](#3-domain-process-1)
4. [Domain Process 2: {NAME}](#4-domain-process-2)
5. [Domain Process N: {NAME}](#5-domain-process-n)
6. [Formulas and Calculations](#6-formulas-and-calculations)
7. [Complete Data Flow](#7-complete-data-flow)
8. [Special Cases and Edge Cases](#8-special-cases-and-edge-cases)

---

## 1. Summary

<!--
CLAUDE: Write 1 paragraph explaining:
- What data the system processes
- What the system produces from that data
- Who consumes the output

Then a bullet list of "Data collected" or "Operations performed"
-->

**Data collected/processed:**
- {BULLET_1}
- {BULLET_2}
- {BULLET_3}

---

## 2. Data Model

<!--
CLAUDE: Document EVERY data structure the domain uses.
For each structure:
- Name and purpose (1 sentence)
- Field table with: Field, Type, Source, Description
- Relationships to other structures
-->

### 2.1 {DataStructure1}

{PURPOSE_SENTENCE}

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `{field_name}` | {type} | {source} | {description} |

### 2.2 {DataStructure2}

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `{field_name}` | {type} | {source} | {description} |
| `{calculated_field}` | {type} | Calculated | {formula_description} |

---

## 3. {Domain Process 1 Name}

<!--
CLAUDE: For EACH business process/operation, document:
1. Data Source — where the input comes from
2. Algorithm — numbered pseudo-code steps
3. Example — concrete YAML/JSON input and expected output
4. Fields Used — which fields from the data source are relevant
-->

### Data Source

{DESCRIPTION_OF_DATA_SOURCE}

### Algorithm

```
1. {STEP_1}
2. For each {ITEM}:
   a. {SUB_STEP_A}
   b. {SUB_STEP_B} (if not exists, use "{DEFAULT}")
3. Result: {OUTPUT_DESCRIPTION}
```

### Example

Given the following input:

```yaml
{YAML_OR_JSON_EXAMPLE}
```

Result: `{DataStructure}({field1}="{value1}", {field2}="{value2}")`

### Fields Used

From the complete `{SourceSpec}`, only the following are used:
- `{field_path}` → {mapped_to}

The fields `{unused_fields}` **are not relevant** for {REASON}.

---

## 4. {Domain Process 2 Name}

### Business Rule

<!--
CLAUDE: State the rule clearly and unambiguously.
Include patterns, separators, conventions.
-->

{RULE_STATEMENT}

### Algorithm

```
1. {STEP_1}
2. {STEP_2}
3. Result: {OUTPUT}
```

### Example

```
{CONCRETE_EXAMPLE_WITH_MATCH_AND_NON_MATCH}
```

---

## 5. {Domain Process N Name}

<!--
CLAUDE: Repeat sections 3-4 pattern for each domain process.
Common processes to document:
- Data discovery/collection
- Data transformation/extraction
- Data aggregation/calculation
- Data validation/filtering
- Priority/precedence rules (e.g., affinity detection order)
-->

### Priority Order

<!--
CLAUDE: If the process has a priority/precedence order, document it explicitly.
Example from GPU Reporter: GPU Affinity Detection checks nodeSelector first,
then required affinity, then preferred affinity.
-->

| Priority | Source | Condition | Result |
|----------|--------|-----------|--------|
| 1 (highest) | {SOURCE} | {CONDITION} | {RESULT} |
| 2 | {SOURCE} | {CONDITION} | {RESULT} |
| 3 (lowest) | {SOURCE} | {CONDITION} | {RESULT} |
| Fallback | — | None of the above | {DEFAULT_VALUE} |

---

## 6. Formulas and Calculations

<!--
CLAUDE: Document ALL calculated fields and metrics.
Show the formula AND a concrete example with numbers.
-->

| Metric/Field | Formula | Description |
|-------------|---------|-------------|
| `{metric_name}` | `{formula}` | {description} |
| `{calculated_field}` | `{field_a} * {field_b}` | {description} |

### Example Calculation

Given:
- {field_a} = {value_1}
- {field_b} = {value_2}

Then:
- {result_field} = {value_1} × {value_2} = **{result}**

---

## 7. Complete Data Flow

<!--
CLAUDE: Show the end-to-end data flow from input sources to output.
Use ASCII art or Mermaid diagram.
Label each transformation step.
-->

```
{INPUT_SOURCES}          {PROCESSING}              {OUTPUT}
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ Source 1      │───►│ Process 1        │───►│ Output 1     │
│ (e.g., CRD)  │    │ (e.g., Extract)  │    │ (e.g., Metric│
└──────────────┘    └──────────────────┘    └──────────────┘
                           │
                           ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ Source 2      │───►│ Process 2        │───►│ Output 2     │
│ (e.g., API)  │    │ (e.g., Aggregate)│    │ (e.g., Report│
└──────────────┘    └──────────────────┘    └──────────────┘
```

### Flow Steps

1. **Step 1**: {DESCRIPTION} → produces {OUTPUT}
2. **Step 2**: {DESCRIPTION} → produces {OUTPUT}
3. **Step 3**: {DESCRIPTION} → produces {FINAL_OUTPUT}

---

## 8. Special Cases and Edge Cases

<!--
CLAUDE: Document EVERY edge case the system must handle.
For each case:
- Scenario description
- Why it happens in production
- How the system handles it
- Expected behavior/output
-->

### 8.1 {Edge Case 1 Name}

**Scenario**: {DESCRIPTION}
**Why it happens**: {REAL_WORLD_REASON}
**Handling**: {HOW_THE_SYSTEM_HANDLES_IT}
**Expected output**: {RESULT}

### 8.2 {Edge Case 2 Name}

**Scenario**: {DESCRIPTION}
**Handling**: {HOW}
**Expected output**: {RESULT}

### 8.3 {Edge Case N}

<!-- Continue for all edge cases. Common ones:
- Empty/null inputs
- Zero values
- Missing optional fields
- Deleted resources (cleanup)
- Concurrent modifications
- Resource type-specific behavior (e.g., DaemonSet vs Deployment)
- Scaling to zero replicas
- Resources without the expected labels/annotations
-->

---

**End of Business Logic Document v{VERSION}**
