# Generate Architecture Delta — Phase 1 (Version Increment)

You are generating an architecture DELTA document for a NEW VERSION of an existing project.

## Prerequisites
- Base `docs/ARCHITECTURE-{BASE_VERSION}.md` must exist
- User has described the new features to add
- You MUST be using the **Opus** model

## Step 1: Read inputs
1. Read the BASE architecture document completely
2. Read `.claude/templates/architecture/ARCHITECTURE-DELTA-TEMPLATE.md`
3. Read `.claude/templates/METHODOLOGY.md` — section 3 (Version Increment Workflow)
4. Ask the user what new features/requirements this version addresses

## Step 2: Research
- Use Context7 to verify any new API patterns
- Explore the existing codebase to understand current implementation
- Identify which files will be modified vs unchanged

## Step 3: Generate the delta document
Create `docs/ARCHITECTURE-{NEW_VERSION}.md` following the delta template:
- Reference the base architecture for unchanged sections
- Only document NEW or MODIFIED components
- Continue AD numbering from the base (e.g., if base has AD-1 to AD-6, start at AD-7)
- Explicitly list files NOT changed and why
- Include impact analysis with risk levels
- Show backward compatibility matrix
- Document performance impact (before/after)
- Include migration guide

## Step 4: Self-review and present
Verify against the delta post-generation checklist, then present to the user for approval.

## Step 5: Next phase
Once approved:
> "Architecture delta complete. Next step: run `/rh-generate-devspec-delta` to plan the implementation sprints."
