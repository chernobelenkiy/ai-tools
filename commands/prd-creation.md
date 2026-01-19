---
name: prd-creation
description: Create a comprehensive Product Requirements Document (PRD) for a new feature with Project Manager assistance.
allowed-tools: Task, Read, Glob, Grep, Edit, Write, Bash, AskUserQuestion, TodoWrite
model: sonnet
---

# PRD Creation Workflow

You are orchestrating the creation of a Product Requirements Document (PRD). Your goal is to transform a high-level feature idea into a detailed, technically feasible specification.

## Phase 1: Exploration & Context

1. **Initial Concept**:
   - **Ask the user**: "What is the core idea of the new feature? What problem are we solving?"

2. **Architectural Audit**:
   - **Spawn code-architect agent** to:
     - Analyze the existing codebase for relevant integration points.
     - Identify technical constraints or existing patterns that the new feature should follow.
     - Provide a brief "Technical Context" summary for the Project Manager.

## Phase 2: Requirements Gathering

1. **Spawn project-manager agent** to:
   - Interview the user with targeted questions based on the feature idea and technical context.
   - Topics to cover: Target audience, core user stories (JTBD), functional requirements, non-functional requirements (performance, security), and success metrics.
   - Identify potential edge cases and out-of-scope items.

## Phase 3: Drafting the PRD

1. **Document Structure**:
   The Project Manager will draft the PRD using the following structure:
   - **Overview**: Problem statement and goals.
   - **Target Audience**: Who is this for?
   - **User Stories**: "As a [user], I want to [action], so that [benefit]."
   - **Functional Requirements**: Detailed list of what the feature *must* do.
   - **Technical Constraints**: Integration points, data models, and performance targets (informed by Phase 1).
   - **UI/UX Requirements**: Key interactions and visual expectations.
   - **Phasing & MVP**: What goes into the first release vs. later.
   - **Success Metrics**: How will we know it's working?

2. **Review & Refine**:
   - Show the draft to the user for feedback.
   - Refine the document based on user input.

## Phase 4: Finalization & Handoff

1. **Spawn code-refactorer agent** to:
   - Review the PRD for technical clarity and consistency.
   - Ensure the requirements are actionable and don't introduce unnecessary complexity.

2. **Completion**:
   - Save the PRD (typically to `docs/prd/[feature-name].md`).
   - Offer to start the implementation using the `/implement-feature` command.
