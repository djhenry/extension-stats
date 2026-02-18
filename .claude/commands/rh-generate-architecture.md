# Generate Architecture Document — Phase 1

You are generating a COMPLETE architecture document for a project. Follow these steps EXACTLY:

## Prerequisites
- `docs/PROJECT-KICKOFF.md` must exist and be approved by the user
- You MUST be using the **Opus** model for this phase

## Step 1: Read inputs
1. Read `docs/PROJECT-KICKOFF.md` — the approved requirements
2. Read `.claude/templates/architecture/ARCHITECTURE-TEMPLATE.md` — the template to follow
3. Read `.claude/templates/METHODOLOGY.md` — section 4 (Model Selection) and section 8 (Context7)

## Step 2: Research with Context7
Use `mcp__context7__resolve-library-id` and `mcp__context7__query-docs` to verify:
- Current API versions for the chosen framework/libraries
- Non-deprecated patterns and best practices
- Correct import paths and module names
- Testing framework conventions

## Step 3: Generate the architecture document
Create `docs/ARCHITECTURE-{VERSION}.md` following the template EXACTLY:
- Fill in EVERY section — no placeholders
- Write COMPLETE code for all interfaces, structs, and core functions
- Create Mermaid diagrams for all architecture views and flows
- Document ALL architectural decisions (AD-X format) with alternatives and trade-offs
- Specify ALL metrics with names, types, labels, and descriptions
- Define security context, RBAC, and network policies
- Define deployment configurations for all environments
- Include operational runbooks
- Specify dashboard panels

## Step 4: Self-review
Before presenting to the user, verify against the post-generation checklist at the bottom of the template:
- [ ] Every section is filled in (no placeholders remain)
- [ ] All code is syntactically correct for the chosen language
- [ ] All Mermaid diagrams are valid
- [ ] All architecture decisions have alternatives and trade-offs
- [ ] Context7 was used to verify API versions
- [ ] Metrics reference table is complete
- [ ] Security section covers container, RBAC, and network
- [ ] Testing strategy matches coverage targets from PROJECT-KICKOFF
- [ ] Project structure shows clear domain/adapter separation

## Step 5: Present for approval
Show the document to the user. Iterate until approved.

## Step 6: Next phase
Once approved, tell the user:
> "Architecture document complete. Next step: run `/rh-generate-devspec` to create the sprint planning document."

**IMPORTANT**: Do NOT proceed to sprint planning without explicit user approval.
