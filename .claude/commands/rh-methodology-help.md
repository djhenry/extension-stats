# Development Methodology — Quick Reference

Show the complete methodology workflow and available commands.

## Display this guide:

```
Development Methodology — Quick Reference
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WORKFLOW PHASES:

  Phase 0: Discovery           /rh-project-kickoff
  Phase 1: Architecture        /rh-generate-architecture
                               /rh-generate-architecture-delta
  Phase 2: Sprint Planning     /rh-generate-devspec
                               /rh-generate-devspec-delta
  Phase 3: Implementation      /rh-execute-sprint {N}       🔄 ralph-loop
                               /rh-execute-all-sprints {range} 🔄 ralph-loop
  Phase 4: Quality             /rh-quality-gate             🔄 ralph-loop
  Phase 5: Release             /rh-release {version}

  Status:                      /rh-sprint-status

  Reverse Engineering:         /rh-reverse-engineer {path} 🔄 ralph-loop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MODEL SELECTION:

  Phase 0-2 (Thinking):  Use Opus    → /model opus
  Phase 3-5 (Doing):     Use Sonnet  → /model sonnet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPICAL NEW PROJECT FLOW:

  1. /model opus
  2. /rh-project-kickoff         → Fill requirements from JIRA
  3. /rh-generate-architecture   → Generate architecture doc
  4. /rh-generate-devspec        → Generate sprint plan with TDD
  5. /model sonnet
  6. /rh-execute-all-sprints     → Implement all sprints
  7. /rh-quality-gate            → Verify quality
  8. /rh-release 1.0.0           → Build, tag, deploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REVERSE ENGINEERING FLOW (existing codebase → documentation):

  1. /model opus
  2. /rh-reverse-engineer {path}  → Analyzes code, asks questions,
                                    generates ALL 5 documents:
                                    CLAUDE.md, BUSINESS-LOGIC,
                                    ARCHITECTURE, DEVELOPMENT-SPEC,
                                    PROJECT-KICKOFF
  Use cases:
    - Understand existing project in ultra-detail
    - Prepare for technology migration
    - Onboard new team members
    - Create specs for a rewrite

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VERSION INCREMENT FLOW:

  1. /model opus
  2. /rh-generate-architecture-delta  → Delta architecture
  3. /rh-generate-devspec-delta       → Delta sprint plan
  4. /model sonnet
  5. /rh-execute-all-sprints {range}  → Implement new sprints
  6. /rh-quality-gate                 → Verify quality
  7. /rh-release {version}            → Build, tag, deploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEMPLATES (in .claude/templates/):

  METHODOLOGY.md                     Master workflow definition
  project-init/PROJECT-KICKOFF.md    Requirements template
  architecture/ARCHITECTURE-*.md     Architecture templates
  development-spec/DEVELOPMENT-*.md  Sprint planning templates
  agents/AGENTS.md                   Agent roles and models

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUALITY TARGETS:

  Core logic coverage:    > 90%
  Adapter coverage:       > 80%
  Global coverage:        > 80%
  Lint issues:            0 actionable
  Security vulnerabilities: 0
  Test race conditions:   0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RALPH WIGGUM LOOP (🔄):

  Development commands auto-activate /ralph-wiggum:ralph-loop
  This ensures tasks complete even across context resets.
  Each command has a completion promise that MUST be true to exit.

  /rh-execute-sprint      → promise: SPRINT_DONE
  /rh-execute-all-sprints → promise: ALL_SPRINTS_DONE
  /rh-quality-gate        → promise: QUALITY_PASSED
  /rh-reverse-engineer    → promise: REVERSE_ENGINEERING_DONE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY PRINCIPLES:

  ✦ Architecture-first: No code until architecture is approved
  ✦ TDD mandatory: RED → GREEN → REFACTOR, always
  ✦ Regression protection: All previous tests must pass
  ✦ Traceability: Requirements → Components → Tests
  ✦ Context7: Verify all API patterns before use
  ✦ Opus for thinking, Sonnet for doing
  ✦ Ralph loop for dev tasks: iterate until genuinely done
```
