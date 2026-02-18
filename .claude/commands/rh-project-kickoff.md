# Project Kickoff — Phase 0: Discovery

You are starting a NEW project. Follow these steps EXACTLY:

## Step 1: Switch to Opus model
If not already using Opus, inform the user they should switch to Opus for this phase (`/model opus`).

## Step 2: Gather information
Read the template at `.claude/templates/project-init/PROJECT-KICKOFF.md`.

Ask the user for:
1. **JIRA ticket URL** — fetch it and extract requirements
2. **Verbal description** — what does this project do?
3. **Technology stack** — language, framework, platform
4. **Team and repository** — who owns this, where does it live?

Use `AskUserQuestion` to clarify any ambiguities. Ask about:
- Scope boundaries (what's in vs out)
- External dependencies
- Performance targets
- Security requirements
- Testing strategy preferences

## Step 3: Fill the template
Create a new file `docs/PROJECT-KICKOFF.md` using the template, filling in ALL sections based on the gathered information. Do NOT leave any section empty — if information is missing, ask the user.

## Step 4: Review
Present the completed document to the user and ask for approval. Iterate until approved.

## Step 5: Next phase
Once approved, tell the user:
> "Project kickoff complete. Next step: run `/rh-generate-architecture` to create the architecture document."

**IMPORTANT**: Do NOT proceed to architecture generation without explicit user approval of the kickoff document.
