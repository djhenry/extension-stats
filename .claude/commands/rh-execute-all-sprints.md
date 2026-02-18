# Execute All Sprints — Automated Full Implementation

Execute ALL sprints sequentially from the development specification, following TDD methodology.

**Sprint range**: $ARGUMENTS (e.g., "1-13", "17-20", or empty for ALL)

## ⚠️ MANDATORY: Activate Ralph Wiggum Loop

**BEFORE doing anything else**, activate the Ralph Wiggum loop to ensure task completion:

```
/ralph-wiggum:ralph-loop
```

Configure the loop with:
- **Max iterations**: 20
- **Completion promise**: `ALL_SPRINTS_DONE` — only output this when ALL sprints in the range are complete, ALL tests pass, ALL acceptance criteria are marked `[x]`, and ALL commits are created.

**CRITICAL**: Do NOT output `ALL_SPRINTS_DONE` until every sprint is genuinely complete. The loop ensures you will iterate and resume across context resets until everything is done.

---

## Prerequisites
- Development spec must exist and be approved
- Use **Sonnet** model for implementation
- If resuming, check which sprints are already complete (read the dev spec acceptance criteria)

## Execution Loop

For each sprint in the range:

### 1. Read sprint section from the dev spec
### 2. Execute all TDD tasks in order (RED → GREEN → REFACTOR)
### 3. Run full test suite — verify zero regressions
### 4. Check coverage targets
### 5. Mark sprint complete in the dev spec (acceptance criteria `[x]`, completeness map `✅ Done`)
### 6. Commit with descriptive message
### 7. Report sprint completion
### 8. Move to next sprint

## After all sprints complete:
1. Run quality checks: `make test`, `make lint`, `make gosec` (or equivalents)
2. Update CLAUDE.md with current status
3. Report final summary:

```
All Sprints Complete ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprints executed: S{FIRST}-S{LAST}
Components:       {DONE}/{TOTAL}
Tests:            {COUNT} passing
Coverage:         {PERCENT}%
Commits:          {N} commits created

Next: /rh-quality-gate → /rh-release {VERSION}
```

**Only after ALL sprints are complete and verified**, output:
```
<promise>ALL_SPRINTS_DONE</promise>
```

## CRITICAL RULES
- Stop IMMEDIATELY if a sprint fails (tests don't pass, coverage not met)
- Report the failure and ask the user for guidance
- NEVER skip a failing test or lower coverage targets
- Each sprint is committed SEPARATELY (not batched)
- Always run full test suite between sprints (not just new tests)
- NEVER output `ALL_SPRINTS_DONE` if any sprint has unchecked acceptance criteria
