# DeepSeek R1 Prompting Guide

**Current Model:** DeepSeek-R1 (`deepseek-reasoner`) - January 2025

**Architecture:** DeepSeek R1 is a 671B parameter Mixture-of-Experts (MoE) model with 37B activated parameters per token. Trained using large-scale reinforcement learning specifically for reasoning tasks. Performance comparable to OpenAI o1 on math, code, and reasoning benchmarks.

## Key Characteristics

- **Open-source** - Fully open weights and architecture
- **Built-in reasoning** - Generates Chain of Thought (CoT) automatically before answers
- **Ultra-low cost** - $0.55/$2.19 per million tokens (10x cheaper than GPT-4o)
- **OpenAI-compatible API** - Easy integration
- **64K max tokens** - Includes reasoning content
- **No sampling params** - Temperature, top_p, etc. are ignored

## Best Practices

### 1. Avoid System Prompts - Use User Prompts Only

```
Bad (will not work optimally):
System: You are an expert mathematician.

User: Solve this equation...

Good (all in user prompt):
User: You are an expert mathematician. Solve this equation step by step: [equation]
```

**Why:** DeepSeek R1 ignores system prompts. Place all instructions in the user message.

### 2. Use Zero-Shot Prompting (NO Few-Shot Examples)

```
Bad (degrades performance):
Here are examples:
Example 1: [input] -> [output]
Example 2: [input] -> [output]

Now solve: [your problem]

Good (direct instruction):
Solve this problem step by step: [your problem]
```

**Why:** Few-shot examples degrade R1's reasoning performance. The model is trained to reason from scratch.

### 3. Be Concise and Explicit

```
Good:
Analyze this code for security vulnerabilities. List each vulnerability with:
- Line number
- Severity (Critical/High/Medium/Low)
- Explanation
- Fix

[code]
```

**Why:** Long instructions distract the reasoning process. State tasks clearly and directly.

### 4. Encourage Self-Verification

```
Solve [problem].

After solving:
1. Verify your answer
2. Check for mistakes
3. List assumptions made
```

**Why:** Self-verification improves reliability without needing examples.

### 5. Control Reasoning with max_tokens

```python
response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[{"role": "user", "content": problem}],
    max_tokens=8000  # Default 32K, max 64K
)

# Access reasoning and answer separately
reasoning = response.choices[0].message.reasoning_content
answer = response.choices[0].message.content
```

**Why:** max_tokens limits both reasoning and answer length. Adjust based on task complexity.

### 6. Use Step-by-Step Instructions

```
Task: [your task]

Steps:
1. [First step]
2. [Second step]
3. [Third step]

Execute these steps methodically.
```

**Why:** Explicit steps guide the reasoning process for more coherent outputs.

## Example Structure

```
You are a Python security expert reviewing production code.

Task: Identify all security vulnerabilities in the code below.

Requirements:
- Analyze line by line
- Focus on SQL injection, XSS, and authentication issues
- Provide specific fixes

Output format:
For each vulnerability:
- Line number
- Type
- Risk level
- Fix

Code:
[your code here]
```

## When to Use DeepSeek R1

- Complex reasoning tasks (math, logic, proofs)
- Code generation and debugging
- Scientific problem-solving
- Budget-constrained projects (10x cheaper than alternatives)
- Open-source requirement
- Tasks where o1-level reasoning is needed at lower cost

## Important Limitations

- No function calling (in base R1)
- No temperature/top_p control (params ignored)
- Don't include reasoning_content in follow-up prompts (will error)
- Few-shot prompting degrades performance
- System prompts are ignored

## Common Mistakes

- Using system prompts instead of user prompts
- Providing few-shot examples (hurts performance)
- Using temperature parameters (ignored)
- Overly long/complex instructions
- Including reasoning_content in conversation history

## Pricing Advantage

- Input: $0.55/million tokens (vs $2.50 GPT-4o, $3 Claude Sonnet)
- Output: $2.19/million tokens (vs $10 GPT-4o, $15 Claude Sonnet)
- **10x cheaper than commercial alternatives**

## References

- [DeepSeek R1 GitHub](https://github.com/deepseek-ai/DeepSeek-R1)
- [DeepSeek API Docs](https://api-docs.deepseek.com/guides/reasoning_model)
- [Prompting Guidelines](https://deepwiki.com/deepseek-ai/DeepSeek-R1/3.3-prompting-guidelines)
