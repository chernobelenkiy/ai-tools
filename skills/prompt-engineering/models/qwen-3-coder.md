# Qwen 3 Coder Prompting Guide

**Release:** April 2025 (480B variant: August 13, 2025), Apache 2.0 license

## Architecture

- **Complete series**: 0.6B, 1.7B, 4B, 8B, 14B, 32B (dense) + 30B-A3B, 235B-A22B, 480B (MoE)
- **Native 256K context**, extendable to 1M tokens
- **Trained on 36T tokens** (70% code ratio, 7.5T pretraining)
- **119 programming languages** and dialects

## Key Characteristics

- **Hybrid thinking mode** - Deep thinking (complex algorithms) vs fast response (simple code)
- **Built-in MCP protocol** for intelligent coding agents
- **Execution-driven RL** - Trained for high code execution success rates
- **Repository-scale understanding** (256K-1M context)
- **SWE-Bench oriented** - Advanced software engineering capabilities

## Best Practices

### 1. Leverage Hybrid Thinking Mode Automatically

```
Complex algorithm (triggers deep thinking):
✅ "Implement a lock-free concurrent B-tree with optimistic concurrency control"
✅ "Design a query optimizer for distributed SQL engine"

Simple task (triggers fast response):
✅ "Add type hints to this Python function"
✅ "Fix this linting error: [error]"
```

### 2. Use Repository-Scale Context (256K-1M)

```
✅ "Analyze this entire codebase and suggest refactoring to improve modularity"
✅ "Find all API v1 calls across the repository and migrate to v2"
✅ "Generate comprehensive documentation from code comments and structure"
```

### 3. Specify Programming Language Explicitly

```
✅ "Write a Python function using type hints that..."
✅ "Refactor this TypeScript React component to use hooks..."
✅ "Implement this algorithm in Rust with zero-cost abstractions..."
```

### 4. Encourage Test-Driven Development

```
✅ "Write unit tests first, then implement the function to pass all tests"
✅ "Generate comprehensive test cases covering edge cases for..."
✅ "Add integration tests for this API endpoint"
```

### 5. Use for SWE-Bench Style Tasks

```
✅ "Fix this bug in the codebase: [GitHub issue description]"
✅ "Implement this feature request following SOLID principles: [requirements]"
✅ "Refactor this module to improve maintainability and testability"
```

### 6. Build Coding Agents with MCP Protocol

```
✅ Create intelligent agents with tool calling
✅ Automate software engineering workflows
✅ Build custom development assistants
```

### 7. Leverage Execution-Driven Training

```
Model is trained to generate executable, correct code.
Ask for working examples:

✅ "Write a working implementation with example usage"
✅ "Generate code that runs without modifications"
```

## Performance Highlights

- **Strong on LiveCodeBench v5**
- **Repository-scale code understanding**
- **High code execution success rates**
- **Advanced agentic capabilities** (SWE-Bench oriented)

## When to Use

- **Code generation** across 119 languages
- **Code review** and refactoring at scale
- **Bug fixing** (SWE-Bench style issues)
- **Repository-scale analysis** (256K-1M context)
- **Coding agents** and automation (MCP support)
- **Self-hosted coding assistants**
- **Cost-sensitive coding projects**

## Limitations

- Thinking mode selection is **automatic** (cannot force)
- Best performance on **coding tasks**, not general chat

## Cost Advantage

- **Open-source** (Apache 2.0)
- **Self-hostable** on own infrastructure
- **Smaller variants** (0.6B-14B) run on consumer hardware (M1/M2 Macs, RTX 3090)

## Deployment

- **Ollama**: `ollama run qwen3-coder`
- **Google Cloud Vertex AI**: Managed hosting
- **Local**: llama.cpp, vLLM
- **GitHub**: Full model weights available

## References

- [Qwen 3 Coder Official Site](https://www.qwen3coder.com/)
- [Qwen 3 Coder GitHub](https://github.com/QwenLM/Qwen3-Coder)
- [Google Cloud Docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/qwen/qwen3-coder)
