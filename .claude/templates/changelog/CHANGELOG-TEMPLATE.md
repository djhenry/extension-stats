# Changelog

All notable changes to {PROJECT_NAME} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                CLAUDE CODE — CHANGELOG TEMPLATE                              ║
║                                                                              ║
║  PURPOSE: Maintain a structured release history.                             ║
║  MODEL: Sonnet (updated during release phase).                               ║
║  WHEN: Update during Phase 5 (Release) for each version.                     ║
║  FILE: CHANGELOG.md (project root)                                           ║
║                                                                              ║
║  RULES:                                                                      ║
║  1. Follow Keep a Changelog format exactly                                   ║
║  2. Newest version FIRST (reverse chronological)                             ║
║  3. Use categories: Added, Changed, Fixed, Deprecated, Removed, Security    ║
║  4. Include Testing section with test counts and coverage                    ║
║  5. Link version headers to git tags/comparisons                            ║
║  6. Be specific — mention file names, function names, metric names          ║
║                                                                              ║
║  REFERENCE: Based on GPU Reporter CHANGELOG.md                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

## [Unreleased]

<!--
CLAUDE: Keep this section for work-in-progress changes.
Move to a version section when releasing.
-->

## [{VERSION}] - {YYYY-MM-DD}

### Added

<!--
CLAUDE: New features, capabilities, files, metrics, etc.
Group by feature area with subheadings if needed.
Be specific: mention function names, file paths, metric names.
-->

#### {Feature Area 1} (Sprint {N})
- **{Feature name}**: {Description of what was added}
  - {Implementation detail 1}
  - {Implementation detail 2}

#### {Feature Area 2} (Sprint {M})
- **{Feature name}**: {Description}

### Changed

<!--
CLAUDE: Modifications to existing functionality.
Explain what changed AND why.
-->

- {WHAT_CHANGED} — {WHY}

### Fixed

<!--
CLAUDE: Bug fixes.
Reference the symptom, root cause, and fix.
-->

- **{Bug symptom}**: {Root cause and fix description}

### Deprecated

<!--
CLAUDE: Features that will be removed in future versions.
Mention the replacement if any.
-->

### Removed

<!--
CLAUDE: Features removed in this version.
Only if something was actually deleted, not just changed.
-->

### Security

<!--
CLAUDE: Security-related changes.
CVE fixes, dependency updates, hardening measures.
-->

### Testing

<!--
CLAUDE: ALWAYS include this section.
Show test counts, coverage, and what was tested.
-->

- {TOTAL} total tests passing ({NEW} new tests for this version)
- Coverage: {COVERAGE_DETAILS_PER_PACKAGE}
- New tests:
  - {N} tests for {FEATURE_1}
  - {M} tests for {FEATURE_2}
- All previous tests still passing (regression protection)

---

<!--
CLAUDE: Repeat the version section for each previous release.
Keep ALL history — never delete old versions.

Footer with comparison links (adjust for your git hosting):
-->

[Unreleased]: {REPO_URL}/-/compare/{LATEST_TAG}...HEAD
[{VERSION}]: {REPO_URL}/-/compare/{PREVIOUS_TAG}...{VERSION}
