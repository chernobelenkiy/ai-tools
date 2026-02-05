# Gemini 3.0 Prompting Guide

**Current Models:** Gemini 3 Pro, Gemini 3 Flash, Nano Banana Pro (Gemini 3 Pro Image)

## Architecture

Gemini 3 is Google's most intelligent model family built on state-of-the-art reasoning. Excels at agentic workflows, autonomous coding, complex multimodal tasks, and research synthesis. Features 1M token context window.

## Model Selection

- **Gemini 3 Pro** (`gemini-3-pro-preview`): Best for complex reasoning tasks requiring broad world knowledge
- **Gemini 3 Flash** (`gemini-3-flash-preview`): Pro-level intelligence at Flash speed and pricing
- **Nano Banana Pro** (`gemini-3-pro-image-preview`): Highest quality image generation model

## Key Capabilities

- Dynamic thinking by default for reasoning through prompts
- 1M token input context, 64K output
- January 2025 knowledge cutoff
- Multimodal: text, images, video (up to 2 hours), audio, PDFs
- Grounding with Google Search for real-time data
- Thinking level parameter for control over reasoning depth

## Best Practices

### 1. Keep Prompts Simple (Major Change from Gemini 2.x)

Gemini 3 requires SIMPLER prompts than previous versions. It infers structure from minimal cues.

```
Bad (Gemini 2.x style - too verbose):
Extract the following fields from the Q3 2025 financial report. 
Return the data as valid JSON. Make sure to use proper JSON syntax 
with quotes around strings. The JSON should have the following fields: 
revenue (as a number), expenses (as a number), and margin (as a percentage).
Do not include any text outside the JSON structure.

Good (Gemini 3 style - concise):
Extract Q3 2025 revenue, operating expenses, and net profit margin. 
Return as JSON: {revenue, expenses, margin}
```

### 2. Control Thinking Level

Use `thinking_level` parameter (replaces `thinking_budget`):

- **`minimal`** (Flash only): No thinking, fastest responses (chat, high-throughput)
- **`low`**: Minimizes latency and cost for simple tasks
- **`medium`** (Flash only): Balanced thinking for most tasks
- **`high`** (Default): Maximizes reasoning depth (complex tasks)

```python
response = client.models.generate_content(
    model="gemini-3-pro-preview",
    contents="How does quantum computing work?",
    config={
        "thinking_config": {
            "thinking_level": "low"  # For faster responses
        }
    }
)
```

### 3. Use Four-Part Structure (Optional but Recommended)

```
Persona: You are a [role] with expertise in [domain].

Task: [Action verb] [specific thing] to [goal].

Context:
- [Background 1]
- [Background 2]
- [Constraint]

Format: Provide output as:
- [Structure 1]
- [Structure 2]
```

### 4. Optimize Media Resolution

Control multimodal processing with `media_resolution`:

- **Images**: `media_resolution_high` (1120 tokens, recommended)
- **PDFs**: `media_resolution_medium` (560 tokens, optimal for OCR)
- **Video (general)**: `media_resolution_low` (70 tokens/frame)
- **Video (text-heavy)**: `media_resolution_high` (280 tokens/frame for OCR)

### 5. Keep Temperature at Default (1.0)

**CRITICAL**: Keep temperature at `1.0` (default). Gemini 3's reasoning is optimized for this setting. Lower values may cause looping or degraded performance on complex tasks.

### 6. Request Citations for Research

```
Task: Research the impact of AI on healthcare in 2025.

Requirements:
- Cite sources for all factual claims
- Use format: [Claim (Source, Year)]
- Flag any uncertain information
- Provide reference list at end
```

### 7. Leverage Multimodal Capabilities

```
Analyze this chart and the accompanying text together:

Image: [image]
Text: [description]

Compare: [specific comparison]
Synthesize: [how to integrate both modalities]
```

## Example Structure

```
Persona: You are a research analyst specializing in climate science.

Task: Analyze the provided climate data and identify key trends for 2025-2030.

Context:
- Data covers global temperature changes
- Focus on actionable insights for policymakers
- Must cite sources

Format: Provide:
1. Executive summary (3-4 sentences)
2. Key trends (bullet points with data)
3. Recommendations (numbered list)

Include citations for all claims.
```

## When to Use Gemini 3

- Research with citations needed
- Multimodal analysis (text + images + video)
- Extremely long document processing (1M tokens)
- Factual accuracy is critical
- Grounding with Google Search for real-time data

## Common Mistakes

- Over-engineering prompts (Gemini 3 prefers simplicity)
- Changing temperature from 1.0 (causes issues)
- Not using thinking_level for performance tuning
- Missing media_resolution optimization for multimodal tasks

## References

- [Gemini 3 Developer Guide](https://ai.google.dev/gemini-api/docs/gemini-3)
- [Gemini 3 Prompting Playbook](https://promptbuilder.cc/blog/gemini-3-prompting-playbook-november-2025/)
