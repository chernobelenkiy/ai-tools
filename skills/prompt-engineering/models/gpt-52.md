# GPT-5.2 Prompting Guide

**Current Models:** GPT-5.2 Instant, GPT-5.2 Thinking, GPT-5.2 Pro (released December 2025)

## Architecture

GPT-5.2 represents OpenAI's most advanced model for professional work with adaptive reasoning that activates for complex tasks. Features multiple variants optimized for speed vs. intelligence trade-offs.

## Model Selection

- **GPT-5.2 Instant**: Fastest responses, best for real-time applications
- **GPT-5.2 Thinking**: Extended reasoning for complex logic and coding
- **GPT-5.2 Pro**: Maximum capability for professional knowledge work

## Key Capabilities

- Adaptive reasoning (automatically engages for complex tasks)
- 70.9% wins/ties against industry professionals (GDPval benchmark)
- August 2025 knowledge cutoff
- Context: 128K tokens
- State-of-the-art coding, math, and scientific reasoning

## Best Practices

### 1. Use the CTCO Framework (2026 Standard)

The CTCO Framework is the recommended structure for GPT-5.2 prompting:

```
# Context (C)
Define the model's role and background
Provide domain knowledge and constraints

# Task (T)
Specify a single, atomic action
Be clear and direct about the goal

# Constraints (C)
Set negative constraints (what NOT to do)
Define scope limits and requirements

# Output (O)
Define exact format (JSON, Markdown, etc.)
Provide schema or structure
```

### 2. Control Reasoning Effort

GPT-5.2 distinguishes between reasoning levels:

- **Low/Minimal Effort** (for formatting, data extraction):
  - Prompt: "Directly output the result without preamble"
  - Use GPT-5.2 Instant for speed
  
- **High/Thinking Effort** (for complex logic):
  - Use "Plan-then-Execute" patterns
  - Prompt: "First plan your approach, then execute step-by-step with verification"
  - Use GPT-5.2 Thinking for quality

### 3. Avoid "Instruction Drift"

In long-context windows, instructions can get lost:
- Place critical instructions at BOTH the beginning AND end
- Use clear section markers (#, ##, ###)
- Reference earlier context explicitly

### 4. Use Structured Outputs

GPT-5.2 excels at JSON schemas:
```json
{
  "role": "system",
  "content": "You are an expert analyst."
}
{
  "role": "user",
  "content": "Context: [background]\n\nTask: Analyze [data]\n\nConstraints: \n- Use only provided data\n- No speculation\n\nOutput: Return as JSON with fields: summary, insights, recommendations"
}
```

## Example CTCO Structure

```
CONTEXT:
You are a senior software engineer with expertise in system design and security.
You're reviewing code for a fintech application that processes sensitive user data.

TASK:
Review the attached Python function for security vulnerabilities and performance issues.

CONSTRAINTS:
- Focus ONLY on security and performance (not style)
- Do NOT suggest rewrites unless critical
- MUST cite specific line numbers
- Prioritize issues by severity (Critical/High/Medium/Low)

OUTPUT:
Return as JSON:
{
  "issues": [
    {
      "line": number,
      "severity": "Critical|High|Medium|Low",
      "category": "Security|Performance",
      "description": "string",
      "fix": "string"
    }
  ],
  "summary": "string"
}
```

## When to Use GPT-5.2

- Professional knowledge work requiring precision
- Structured data extraction and transformation
- Complex coding with reasoning requirements
- Real-time applications (GPT-5.2 Instant)
- Maximum reasoning depth (GPT-5.2 Thinking/Pro)

## References

- [GPT-5.2 Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide/)
- [GPT-5.2 2026 Playbook](https://www.atlabs.ai/blog/gpt-5.2-prompting-guide-the-2026-playbook-for-developers-agents)
