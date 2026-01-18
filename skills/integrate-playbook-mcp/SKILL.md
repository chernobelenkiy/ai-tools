---
name: integrate-playbook-mcp
description: Expertly integrate Agents Playbook MCP into external AI frameworks and design sophisticated workflows using 2026 models.
---

# Agents Playbook MCP Integration Skill

## When to Use This Skill

- User wants to connect **Agents Playbook** to their custom AI application.
- User needs to implement MCP tool-calling in **Vercel AI SDK**, **LangChain**, or **OpenAI SDK**.
- User wants to design structured AI workflows with specialized agent personas.
- User needs to update or benchmark AI workflows against **2026 models** (GPT-5, Gemini 3, Claude 4).

## How It Works

This skill provides a systematic approach to technical integration and workflow design:

1. **Discovery & Audit**: Map the target stack (Node/Python, framework, model).
2. **MCP Client Setup**: Configure the transport (Stdio, HTTP, SSE) to the Playbook server.
3. **Tool Mapping**: Extract and adapt tools from the MCP server to the target SDK's format.
4. **Workflow Orchestration**: Define stages, handoffs, and context-saving mechanisms.
5. **Prompt Engineering**: Craft system prompts using Playbook best practices.

## Procedure

### 1. Integration Setup

#### Vercel AI SDK (TypeScript)
```typescript
import { createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';

const mcpClient = createMCPClient({
  transport: new Experimental_StdioMCPTransport({
    command: 'npx',
    args: ['-y', '@agents-playbook/mcp-server'], // or your specific server
  })
});
```

#### LangChain JS
```typescript
import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const client = new MultiServerMCPClient({
  mcpServers: {
    playbook: {
      transport: "stdio",
      command: "node",
      args: ["dist/mcp-server.js"],
    }
  }
});
```

### 2. Workflow Design (Playbook Standards)

1. **Define Stages**: Break the task into logical steps (e.g., Analysis -> Code -> Test).
2. **Assign Personas**: Use specialized agents (e.g., `code-architect`, `code-tester`).
3. **Context Management**: Use context layering and pruning to maintain state across stages.
4. **Gates & Reviews**: Add user approval steps after high-risk phases (like planning).

### 3. Model Optimization & Economics (2026)

- **Deep Reasoning**: Use **GPT-5.2 (Thinking)** (~$1.75/$14.00) or **Claude Opus 4.5** ($15.00/$75.00) for complex logic.
- **Agentic Workhorse**: Use **Claude Sonnet 4.5** ($3.00/$15.00) for implementation and general orchestrations.
- **Massive Context**: Use **Gemini 3 Pro** ($1.25/$5.00) for 1M+ token codebase analysis.
- **Efficiency**: Use **DeepSeek R1** ($0.14/$0.28) or **Gemini 3 Flash** ($0.10/$0.40) for high-frequency tool calls.

#### 💡 Cost Saving Measures
- **Enable Caching**: Implement `cache_control` for static project context.
- **Async Batching**: Route non-urgent tasks to Batch APIs for 50% savings.
- **Model Routing**: Implement logic to use cheaper models for validation and only frontier models for generation.

### 4. Context Engineering & RAG Implementation

1. **Implement Hybrid Search**: Bridge MCP tools with a vector DB (e.g., Pinecone, Weaviate) and a keyword index.
2. **Setup Retrieval Pipelines**: 
   - Define a "Retriever Agent" that selects chunks based on semantic similarity + recency.
   - Use **Re-ranking** to filter the top 5 most relevant snippets before injection.
3. **Apply Context Layering**: 
   - Inject System Instructions at the top.
   - Place active task data in the middle.
   - Append retrieved RAG chunks at the bottom with clear `<source>` tags.
4. **Recursive Summarization**: 
   - For long sessions, trigger a summarization step every 20k tokens to keep the active window lean.

## Important Rules

| Rule | Description |
|------|-------------|
| **Audit First** | Always check `agents-playbook` for existing workflows before creating new ones. |
| **No Hardcoding** | Use environment variables for API tokens and server URLs. |
| **Clean Close** | Always call `client.close()` or equivalent to prevent hanging processes. |
| **Verify Modality** | Ensure the chosen model supports the required modality (Vision, Audio, etc.) if needed. |

## Examples

### Example: Integrating with Cursor
"Set up a Cursor project that uses my Agents Playbook workflows via MCP."
1. Configure Cursor to point to the local or remote MCP endpoint.
2. Use the `get_available_workflows` tool to list existing patterns.
3. Map a `playbooker` persona to orchestrate the implementation.
