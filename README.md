# ai-tools

A lightweight, opinionated collection of agent specs, rules, and links for building AI-assisted workflows. This repo focuses on clarity, interoperability (MCP), and pragmatic execution.

## What's inside

- `links.md` — Curated developer-oriented AI links
- `subagents/` — Individual agent personas/specs
- `skills/` — Reusable Claude Code skills with scripts (copy to your project's `.claude/skills/`)
- `rules/` — Additional rules and guidelines (e.g., `rules/claude-rules.md`)
- `mcp/cursor.json` — Example MCP server configuration for local tooling

## Quick start

1. Follow `CLAUDE.md` for interaction style and output quality when using Claude.
2. Use `links.md` to quickly jump to provider docs, SDKs, and tooling.

## Repo structure

```
.
├── CLAUDE.md
├── links.md
├── mcp/
│   └── cursor.json
├── rules/
│   └── claude-rules.md
├── skills/
│   ├── create-game-assets/   # DALL-E 3 game asset generator
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   ├── package.json
│   │   └── src/
│   └── remove-background/    # Remove image backgrounds (rembg)
│       ├── SKILL.md
│       └── README.md
└── subagents/
    ├── general/              # Core development & management agents
    │   ├── project-manager.md
    │   ├── code-architect.md
    │   ├── code-reviewer.md
    │   ├── code-simplifier.md
    │   ├── code-tester.md
    │   ├── build-verificator.md
    │   ├── ux-optimiser.md
    │   └── technical-integration-architect.md
    └── specific/             # Specialized technology & domain agents
        ├── ai-sdk-prompt-architect.md
        ├── nextjs-fsd-developer.md
        ├── flutter-ux-architect.md
        └── ... (more specific agents)
```

## Notes on MCP configuration

- `mcp/cursor.json` is provided as an example. Ensure you manage tokens via environment variables or your editor’s secrets manager. Avoid committing credentials.

## Contributing

- Keep edits minimal, documented, and aligned with existing patterns.
- Prefer updating `AGENTS.md` and `CLAUDE.md` when adding agents or guidelines.
- Validate links in `links.md` when updating categories.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
