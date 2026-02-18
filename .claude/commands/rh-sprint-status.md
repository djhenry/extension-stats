# Sprint Status — Check Progress

Show current project progress and identify what to do next.

## Step 1: Find the development spec
Look for `docs/DEVELOPMENT-SPEC-*.md` files. Read the latest one.

## Step 2: Analyze completion
1. Read the **Completeness Map** section
2. Count components by status: ✅ Done vs Pending
3. Read each sprint's **Acceptance Criteria** — check which have `[x]` vs `[ ]`
4. Identify the CURRENT sprint (first sprint with unchecked criteria)

## Step 3: Check test status
Run the test suite:
```bash
make test 2>&1 | tail -20
```
Report test count and coverage per package.

## Step 4: Report

```
Project Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sprint Progress:
  ✅ S1-S{N}: Complete
  🔄 S{N+1}: In Progress ({X}/{Y} components)
  ⏳ S{N+2}-S{M}: Pending

Components: {DONE}/{TOTAL} ({PERCENT}%)

Tests: {COUNT} passing, {COVERAGE}% coverage

Current Sprint: S{N+1} — {SPRINT_NAME}
  Next task: T{N+1}.{X} — {TASK_DESCRIPTION}

Commands:
  /rh-execute-sprint {N+1}    Execute current sprint
  /rh-quality-gate            Run quality checks
  /rh-release {VERSION}       Create release
```

## Step 5: Suggest next action
Based on the status:
- If sprints remain → suggest `/rh-execute-sprint {N}`
- If all sprints done → suggest `/rh-quality-gate`
- If quality passed → suggest `/rh-release {VERSION}`
