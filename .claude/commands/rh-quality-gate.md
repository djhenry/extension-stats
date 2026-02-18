# Quality Gate — Phase 4: Verification

Run ALL quality checks to verify the project is production-ready.

## ⚠️ MANDATORY: Activate Ralph Wiggum Loop

**BEFORE doing anything else**, activate the Ralph Wiggum loop to ensure task completion:

```
/ralph-wiggum:ralph-loop
```

Configure the loop with:
- **Max iterations**: 20
- **Completion promise**: `QUALITY_PASSED` — only output this when ALL tests pass, linter is clean, security scanner finds 0 issues, documentation is verified, and PROJECT-STATUS is created/updated.

**CRITICAL**: Do NOT output `QUALITY_PASSED` until every quality check genuinely passes. The loop ensures you iterate until everything is fixed.

---

## Step 1: Run full test suite
```bash
make test
# or: go test -race ./...
# or: pytest
# or: npm test
```
Report: total tests, pass/fail, coverage percentages per package.

## Step 2: Run linter
```bash
make lint
# or: golangci-lint run
# or: ruff check .
# or: eslint .
```
- Fix ALL actionable issues (goconst, gofmt, staticcheck, etc.)
- Document any acceptable warnings (e.g., dupl for shared logic)
- Re-run until clean

## Step 3: Run security scanner
```bash
make gosec
# or: gosec ./...
# or: npm audit
# or: bandit -r .
# or: safety check
```
- MUST find 0 vulnerabilities
- If issues found, fix them immediately

## Step 4: Verify documentation
1. Check that ALL documentation is in **English** (no Spanish, no other languages)
2. Verify all sprint acceptance criteria are marked `[x]` in the dev spec
3. Verify the completeness map is up to date
4. Check CLAUDE.md has current project status
5. Check README.md is current

## Step 5: Create/Update PROJECT-STATUS
Create or update `docs/PROJECT-STATUS-v{VERSION}.md` with:
- Executive summary
- Sprint progress table
- Component completion matrix
- Test summary (count, coverage)
- Quality metrics (lint, security)

## Step 6: Commit fixes
If any fixes were made (lint, security, docs), commit them:
```
refactor: Fix quality gate issues (lint, security, docs)
```

## Step 7: Report and complete loop
```
Quality Gate Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tests:      {N} passing, {C}% coverage
Lint:       {X} issues fixed, {Y} acceptable warnings
Security:   0 vulnerabilities
Docs:       All English, all current
Status:     {Z}% complete ({A}/{B} components)

Result: ✅ PASS
```

**Only after ALL checks pass**, output:
```
<promise>QUALITY_PASSED</promise>
```

If any check FAILS and cannot be fixed, do NOT output the promise. Report the failure and ask the user for guidance.
