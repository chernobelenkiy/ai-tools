# Claude 4.5 Prompting Guide

**Current Models:** Claude Sonnet 4.5, Claude Opus 4.5, Claude Haiku 4.5

## Architecture

Claude 4.5 excels at extended autonomous operation, deep reasoning, long-context analysis (200K tokens, 1M beta for Sonnet), and context-aware workflows. Built for coding, AI agents, and complex analytical tasks.

## Model Selection

- **Sonnet 4.5** (`claude-sonnet-4-5-20250929`): Best for complex agents and coding tasks
- **Opus 4.5** (`claude-opus-4-5-20251101`): Maximum intelligence with effort parameter control
- **Haiku 4.5** (`claude-haiku-4-5-20251001`): Near-frontier performance at 2x speed, 1/3 cost

## New Capabilities (Claude 4.5)

- Extended thinking with thinking block preservation
- Effort parameter (Opus only): Control token usage (low/medium/high)
- Context awareness: Model tracks remaining token budget
- Programmatic tool calling: Reduce latency in multi-tool workflows
- Tool search tool: Work with hundreds of tools via dynamic discovery
- Memory tool: Store/retrieve info outside context window
- Enhanced computer use with zoom action for fine-grained UI inspection

## Best Practices

### 1. Provide Comprehensive Context Upfront

- Include all relevant background and constraints
- Don't assume the model knows niche details
- Use XML tags for structure: `<context>`, `<instructions>`, `<examples>`

### 2. Request Step-by-Step Reasoning

- Use numbered sections and clear structure
- Ask for assumptions, risks, and alternatives
- Invite the model to flag uncertainty

### 3. Leverage Long Context Effectively

- Place most important info at beginning AND end (avoid "lost in the middle")
- Use clear section headers and delimiters
- Reference specific sections by name

### 4. Use Structured Output Formats

- XML tags work better than JSON for complex structures
- Use examples to show desired format
- Be explicit about edge cases

## Example Structure

```xml
<task>
Your clear, specific task description
</task>

<context>
Relevant background information
- Key constraint 1
- Key constraint 2
</context>

<instructions>
1. First, analyze X by...
2. Then, consider Y by examining...
3. Finally, provide Z in the following format:
</instructions>

<example>
Input: [example input]
Output: [example output with reasoning]
</example>
```

## When to Use Claude 4.5

- Extended autonomous agent operations
- Complex coding and refactoring tasks
- Long-context document analysis (200K-1M tokens)
- Tasks requiring deep reasoning with tool use
- Multi-step workflows with context preservation

## References

- [Claude Prompt Engineering Overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
- [Anthropic Courses](https://github.com/anthropics/courses)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
