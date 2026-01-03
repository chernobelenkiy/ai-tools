# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a collection of AI agent specifications, rules, and curated links for building AI-assisted workflows. No build system or tests—just markdown files organizing agent personas and integration configurations.

## Structure

- `subagents/` — Agent specs with YAML frontmatter (name, description, model, color) and markdown body defining behavior, deliverables, and workflow
- `rules/` — Shared guidelines (e.g., `claude-rules.md`)
- `mcp/` — MCP server configurations for editor integrations
- `links.md` — Curated AI/developer tool links

## Agent Spec Format

Each file in `subagents/` follows this pattern:

```markdown
---
name: agent-name
description: One-line description
model: sonnet|opus|haiku
color: color-name
---

[Agent instructions in markdown]
```

## Key Conventions

1. **Working directory pattern**: Agents use `.agents-playbook/[task-name]/` for artifacts (tasks.md, design.md, requirements.md, memory-board.md, review.md)
2. **Planning mode**: Agents ask clarifying questions before implementation; require explicit approval at stage gates
3. **Minimal changes**: Do not over-engineer; make precise fixes; avoid unnecessary files and console logs
4. **Context7**: Use `mcp__context7__resolve-library-id` and `mcp__context7__query-docs` to fetch library documentation

## MCP Configuration

`mcp/cursor.json` contains example MCP server configs (Context7, Playwright, Figma, GitHub, Supabase, etc.). Tokens should be injected via environment variables—never commit credentials.
