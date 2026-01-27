---
name: research
description: Comprehensive research workflow (Context -> Search -> Brainstorm -> Propose)
allowed-tools: Task, Read, Glob, Grep, WebSearch, WebFetch, AskQuestion, TodoWrite
---

# Research Workflow

This command orchestrates a deep-dive research and brainstorming session to solve complex problems or explore new technical directions.

## Phase 1: Context & Discovery

1.  **Context Intake**:
    -   Read relevant files and documentation.
    -   Analyze the current state of the project.
2.  **User Inquiry**:
    -   **Mandatory**: Use `AskQuestion` to gather missing context.
    -   Ask about: Business goals, technical constraints, preferred tech stack, and "what success looks like."
    -   Identify the "core tension" of the problem.

## Phase 2: Information Gathering (The Hunt)

1.  **Spawn researcher agent** to:
    -   Perform broad web searches for industry standards and competitors.
    -   Use **Context7** to research specific libraries or APIs mentioned or relevant.
    -   Look for academic or scientific papers if the problem is foundational.
    -   Identify 3-5 distinct "patterns" or "approaches" used in the wild.

## Phase 3: Brainstorming & Synthesis

1.  **Researcher Agent** continues to:
    -   Apply creative thinking techniques (First Principles, Lateral Thinking).
    -   Cross-pollinate ideas from different domains.
    -   Develop "Wildcard" solutions (high risk, high reward).
    -   Map all options onto a "Complexity vs. Impact" matrix.

## Phase 4: Proposal & Feedback

1.  **Present Findings**:
    -   **Summary of Research**: What was found and where.
    -   **Categorized Options**:
        -   *The Standard*: Best practice, low risk.
        -   *The Efficient*: Fastest to implement, good enough.
        -   *The Innovative*: Researcher's creative proposal, high leverage.
    -   **Trade-off Analysis**: Clear pros/cons for each.
2.  **Next Steps**:
    -   Ask the user which path they want to explore further.
    -   Offer to spawn a `code-architect` for a POC or `project-manager` for a roadmap.

## Completion

1.  Summarize the session.
2.  Provide links to all gathered resources.
3.  Ensure the user has a clear path forward.
