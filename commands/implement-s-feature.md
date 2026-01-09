---
name: implement-s-feature
description: Lightweight feature implementation workflow for small/simple features (Plan -> Implement -> Simplify)
allowed-tools: Task, Read, Glob, Grep, Edit, Write, Bash, AskUserQuestion, TodoWrite
---

# Simple Feature Implementation Workflow

You are orchestrating a lightweight implementation pipeline for small or well-defined features. Follow these phases strictly.

## Phase 1: Planning

1. **Spawn plan agent** to:
   - Read the feature requirement or file specified by the user ($ARGUMENTS)
   - Create a concise implementation plan
   - Identify files to modify

2. **Present the plan to user** and wait for explicit approval before proceeding.

## Phase 2: Implementation

After plan approval:

1. **Spawn code-architect agent** to implement the feature:
   - Follow the approved plan
   - Write clean, production-ready code with full type safety
   - Adhere to existing patterns in the codebase

## Phase 3: Simplification & Quality

After implementation:

1. **Spawn code-simplifier:code-simplifier agent** to:
   - Review the new code for unnecessary complexity
   - Improve readability and ensure scalability
   - Apply approved simplifications directly to the codebase

## Completion

After all phases complete successfully:
- Summarize the changes
- List all modified files
- Mark all todos as completed
