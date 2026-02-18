# {PROJECT_NAME} - Project Status

<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║              CLAUDE CODE — PROJECT STATUS TEMPLATE                           ║
║                                                                              ║
║  PURPOSE: Track version completion status with sprint progress,              ║
║           component matrices, test summaries, and quality metrics.           ║
║  MODEL: Sonnet (created during quality gate phase).                          ║
║  WHEN: Create/update during Phase 4 (Quality Gate).                          ║
║  FILE: docs/PROJECT-STATUS-v{MAJOR}_{MINOR}_{PATCH}.md                      ║
║                                                                              ║
║  REFERENCE: Based on GPU Reporter PROJECT-STATUS-v1_2_0.md                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

**Last Updated**: {DATE}
**Version**: v{VERSION} ({STATUS})
**Overall Progress**: {PERCENT}% ({DONE}/{TOTAL} components)

---

## Executive Summary

<!--
CLAUDE: 1 paragraph summarizing the version status.
Then a "Key Achievements" bullet list with checkmarks.
-->

### Key Achievements

- ✅ {ACHIEVEMENT_1}
- ✅ {ACHIEVEMENT_2}
- ✅ {ACHIEVEMENT_3}

---

## Sprint Progress

| Sprint | Name | Progress | Status |
|--------|------|----------|--------|
| **S{N}** | {NAME} | {X}/{Y} ({PERCENT}%) | ✅ Completed / 🔄 In Progress / ⏳ Pending |

---

## Component Completion Matrix

### ✅ Completed Categories

| Category | Components | Files | Tests | Coverage |
|----------|-----------|-------|-------|----------|
| **{CATEGORY}** | {X}/{Y} | {FILES} | {N} tests | {PERCENT}% |

### 🔄 Pending

| Category | Completed | Pending | Status |
|----------|-----------|---------|--------|
| **{CATEGORY}** | {X}/{Y} | {Z}/{Y} | {REASON} |

---

## Test Summary

| Package/Module | Tests | Coverage | Target | Status |
|---------------|-------|----------|--------|--------|
| {PACKAGE} | {N} | {PERCENT}% | > {TARGET}% | ✅ / ❌ |
| **Total** | **{TOTAL}** | **{GLOBAL}%** | **> {TARGET}%** | **✅** |

---

## Quality Metrics

| Metric | Result | Details |
|--------|--------|---------|
| **Lint** | ✅ PASS / ❌ FAIL | {DETAILS} |
| **Security** | ✅ PASS / ❌ FAIL | {DETAILS} |
| **Tests** | ✅ PASS / ❌ FAIL | {DETAILS} |
| **Build** | ✅ PASS / ❌ FAIL | {DETAILS} |

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| **{VERSION}** | {DATE} | {HIGHLIGHTS} |

---

## Git History (This Version)

| Commit | Message |
|--------|---------|
| `{HASH}` | {MESSAGE} |

---

## Next Steps

<!--
CLAUDE: List remaining work and next planned version.
-->

- [ ] {NEXT_STEP_1}
- [ ] {NEXT_STEP_2}

---

**Project Status**: ✅ **{FINAL_STATUS}**
