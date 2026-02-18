# Generate Development Spec Delta — Phase 2 (Version Increment)

You are generating a development spec DELTA for a NEW VERSION.

## Prerequisites
- `docs/ARCHITECTURE-{NEW_VERSION}.md` (delta) must exist and be approved
- Base `docs/DEVELOPMENT-SPEC-{BASE_VERSION}.md` must exist
- You MUST be using the **Opus** model

## Step 1: Read inputs
1. Read the approved ARCHITECTURE DELTA document
2. Read the BASE development spec to understand existing component/sprint numbering
3. Read `.claude/templates/development-spec/DEVELOPMENT-SPEC-DELTA-TEMPLATE.md`

## Step 2: Continue numbering
- Find the LAST component ID in the base spec (e.g., C74) → start at C75
- Find the LAST sprint number (e.g., S13) → start at S14
- Find the LAST requirement ID → continue from there

## Step 3: Scope of changes
Document explicitly:
- Files to modify (source)
- Files to modify (tests)
- Files to add
- Files NOT changed (with reasons)

## Step 4: Generate delta sprints
Follow the same TDD structure as the base spec:
- Objective, Architecture Ref, Component Table
- Tests FIRST (RED) with real code
- Implementation guidance (GREEN)
- Existing test updates (REFACTOR)
- Acceptance criteria with regression check

## Step 5: Create tracking artifacts
- Delta completeness map (new components only)
- Combined completeness (all versions)
- Traceability matrix for new requirements
- Sprint execution checklists

## Step 6: Present for approval
Once approved:
> "Delta development spec complete. {N} new sprints with {M} components. Run `/rh-execute-sprint {FIRST_SPRINT}` to begin."
