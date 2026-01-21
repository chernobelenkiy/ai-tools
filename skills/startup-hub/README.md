# Startup Hub Skill

Research startups, analyze market fit, and manage project entries in Startup Hub.

## Prerequisites

- Startup Hub MCP server configured and running
- Authentication token set (if required by your Startup Hub instance)

## MCP Configuration

Add to your MCP settings:

```json
{
  "startup-hub": {
    "url": "https://your-startup-hub-instance.com/api/mcp"
  }
}
```

## Features

- **Project Management**: Create, update, list, and delete startup project entries
- **Market Research**: Conduct competitive analysis and market fit evaluation
- **Documentation**: Structure project ideas with problem, solution, and traction data

## Usage

The skill is automatically invoked when you:

1. Ask to document a new project idea
2. Request competitive analysis
3. Want to manage Startup Hub entries
4. Need market research for a startup concept

## Example Prompts

- "Document my new AI writing assistant startup in Startup Hub"
- "Research competitors for a meditation app and create a project entry"
- "List all MVP-stage projects in Startup Hub"
- "Update the traction metrics for project X"

## Project Statuses

| Status | Description |
|--------|-------------|
| `IDEA` | Early concept, needs validation |
| `MVP` | Minimum viable product in development |
| `BETA` | Limited release, gathering feedback |
| `LAUNCHED` | Live product with active users |
| `PAUSED` | On hold or pivoting |
