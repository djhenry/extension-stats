# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                CLAUDE CODE — CLAUDE.MD TEMPLATE                              ║
║                                                                              ║
║  PURPOSE: Generate CLAUDE.md for a new project so future Claude instances    ║
║           can be productive immediately.                                     ║
║  MODEL: Sonnet (update during quality gate phase).                           ║
║  WHEN: Create after Phase 2 (Sprint Planning), update after each release.    ║
║                                                                              ║
║  RULES:                                                                      ║
║  1. Include ALL build/test/deploy commands                                   ║
║  2. Document architecture at the "big picture" level                         ║
║  3. Include anti-patterns specific to this project                           ║
║  4. Keep updated with every version release                                  ║
║  5. Do NOT repeat generic development practices                              ║
║  6. Do NOT include obvious instructions                                      ║
║                                                                              ║
║  REFERENCE: Based on GPU Reporter CLAUDE.md (663 lines)                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

## Project Overview

**{PROJECT_NAME}** — {ONE_LINE_DESCRIPTION}

**Current Status**: **v{VERSION} - {STATUS}** ({SPRINTS_COMPLETE}, {PERCENT}% - {DONE}/{TOTAL} components).

Core functionality:
- ✅ {FEATURE_1}
- ✅ {FEATURE_2}
- 🔄 Remaining: {WHAT_REMAINS}

**Key Documents**:
- `docs/ARCHITECTURE-{VERSION}.md` — Technical architecture
- `docs/DEVELOPMENT-SPEC-{VERSION}.md` — Sprint plan with TDD
- `docs/BUSINESS-LOGIC.md` — Domain rules and algorithms
- `CHANGELOG.md` — Release history

## ⚠️ CRITICAL: {PROJECT_SPECIFIC_WARNING}

<!--
CLAUDE: Include any critical project-specific conventions here.
Examples: tag format rules, naming conventions, deployment restrictions.
-->

## Development Commands

### Build and Test
```bash
# Build
{BUILD_COMMAND}

# Run all tests
{TEST_COMMAND}

# Run tests with coverage
{COVERAGE_COMMAND}

# Run specific test
{SINGLE_TEST_COMMAND}

# Run linter
{LINT_COMMAND}

# Run security scan
{SECURITY_COMMAND}
```

### Local Development
```bash
# Run locally
{RUN_COMMAND}

# Deploy to development
{DEPLOY_DEV_COMMAND}
```

### Testing Levels
```bash
# Unit tests
{UNIT_TEST_COMMAND}

# Integration tests
{INTEGRATION_TEST_COMMAND}

# E2E tests
{E2E_TEST_COMMAND}
```

### Deployment
```bash
# Build container image
{DOCKER_BUILD_COMMAND}

# Deploy to production
{DEPLOY_PROD_COMMAND}
```

## Architecture Overview

### Design Pattern
**{PATTERN_NAME}** ({PATTERN_DESCRIPTION}):
- **Domain Layer** (`{DOMAIN_DIR}/`): {DESCRIPTION}
- **Adapters Layer** (`{ADAPTER_DIR}/`): {DESCRIPTION}

### Core Components

<!--
CLAUDE: List the main components with 1-line descriptions.
Show what each watches/processes and what state it updates.
-->

### Data Flow
```
{INPUT} → {PROCESSING} → {STATE} → {OUTPUT}
```

## Important Constraints

<!--
CLAUDE: List project-specific constraints that affect development.
Only include things that are NOT obvious from the code.
-->

### {CONSTRAINT_CATEGORY}
- {CONSTRAINT_1}
- {CONSTRAINT_2}

### Performance Targets
- {METRIC_1}: {TARGET}
- {METRIC_2}: {TARGET}

### Security Requirements
- {REQUIREMENT_1}
- {REQUIREMENT_2}

## Metrics Exposed

**All metrics use the `{PREFIX}_` prefix:**

<!--
CLAUDE: List ALL metrics with names, types, labels, and descriptions.
-->

## Common Patterns

<!--
CLAUDE: Show 2-3 code patterns that are used throughout the project.
Only include patterns that require understanding multiple files.
-->

## Anti-Patterns to Avoid

<!--
CLAUDE: List things that would break the project if done.
Be specific to THIS project, not generic advice.
-->

❌ {ANTI_PATTERN_1}
❌ {ANTI_PATTERN_2}

## Troubleshooting

### {PROBLEM_1}
```bash
{DIAGNOSTIC_COMMANDS}
```

## References

- JIRA: [{JIRA_ID}]({JIRA_URL})
- {FRAMEWORK_DOCS}: {URL}
