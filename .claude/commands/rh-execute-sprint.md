# Execute Sprint — Phase 3: Implementation

You are executing a specific sprint from the development specification using TDD methodology.

**Sprint to execute**: $ARGUMENTS (e.g., "1", "14", "17-20")

## ⚠️ MANDATORY: Activate Ralph Wiggum Loop

**BEFORE doing anything else**, activate the Ralph Wiggum loop to ensure task completion:

```
/ralph-wiggum:ralph-loop
```

Configure the loop with:
- **Max iterations**: 20
- **Completion promise**: `SPRINT_DONE` — only output this when ALL acceptance criteria for the sprint are marked `[x]`, ALL tests pass, and the commit is created.

**CRITICAL**: Do NOT output `SPRINT_DONE` until the sprint is genuinely 100% complete. The loop ensures you will iterate until everything is done, even across context resets.

---

## Prerequisites
- Development spec must exist and be approved
- Use **Sonnet** model for implementation efficiency
- All previous sprints must be complete (check acceptance criteria)

## Step 1: Read the sprint
1. Find the DEVELOPMENT-SPEC document in `docs/`
2. Read the specific sprint section for sprint $ARGUMENTS
3. Read the sprint execution checklist in the Appendix
4. If a range is given (e.g., "17-20"), execute them sequentially

## Step 2: Execute TDD for each component

For each task (T{N}.{X}) in the sprint:

### If it's a TEST task (RED phase):
1. Read the test code from the spec
2. Write the test file (create or append)
3. Run the tests: they MUST FAIL
4. If tests pass unexpectedly → something is wrong, investigate
5. Report: "T{N}.{X}: Tests written (RED) ✅ — {N} tests failing as expected"

### If it's an IMPLEMENTATION task (GREEN phase):
1. Read the implementation guidance from the spec
2. Read the referenced architecture section for full code/interface details
3. Implement the MINIMUM code to make tests pass
4. Run tests: they MUST PASS
5. Report: "T{N}.{X}: Implementation complete (GREEN) ✅ — all tests passing"

### If it's a REFACTOR/UPDATE task:
1. Update existing tests as described in the spec
2. Run the FULL test suite (not just current sprint tests)
3. Verify ZERO regressions
4. Report: "T{N}.{X}: Existing tests updated ✅ — zero regressions"

## Step 3: Sprint verification
After all tasks are complete:
1. Run full test suite with race detection: `go test -race ./...` (or equivalent)
2. Check coverage: verify targets from acceptance criteria are met
3. Run linter: `make lint` (or equivalent)
4. Verify build: `make build` (or equivalent)

## Step 4: Mark completion
1. In the DEVELOPMENT-SPEC document, mark ALL acceptance criteria as `[x]`
2. In the completeness map, update component status to "✅ Done"
3. In the sprint execution checklist (Appendix), mark all steps as `[x]`

## Step 5: Commit
Create a git commit with message:
```
feat(sprint-{N}): {Sprint Name}

Components: C{X}-C{Y}
Tests: {N} new tests, all passing
Coverage: {Z}% (target: >{T}%)
Regressions: 0
```

## Step 6: Report and complete loop
```
Sprint {N}: {Name} ✅ COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Components: C{X}-C{Y} ({Z} components)
New tests:  {N}
Total tests: {M} (all passing)
Coverage:   {C}% (target: >{T}%)
Regressions: 0
Commit:     {HASH}

Next: /rh-execute-sprint {N+1}
```

**Only after ALL the above is verified**, output:
```
<promise>SPRINT_DONE</promise>
```

## CRITICAL RULES
- **NEVER** skip the RED phase — tests MUST be written before implementation
- **NEVER** modify a test to make it pass — fix the implementation instead
- **NEVER** skip the regression check — run ALL tests, not just new ones
- **NEVER** improvise beyond the spec — if the spec is wrong, STOP and ask the user
- **ALWAYS** commit after each sprint (not after each component)
- **NEVER** output `SPRINT_DONE` if any test is failing or coverage is not met
