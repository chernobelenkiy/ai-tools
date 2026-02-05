# Qwen 3 Prompting Guide

**Release:** April 28, 2025 (Apache 2.0 license)

## Architecture

- **Dense models**: 0.6B, 1.7B, 4B, 8B, 14B, 32B parameters
- **MoE models**: 30B-A3B (~3.3B active), 235B-A22B (~22B active)
- Native 32K context, extendable to 128K with YaRN
- Trained on 36 trillion tokens
- Supports 119 languages

## Key Characteristics

- **Hybrid thinking mode** - Switches between deep thinking (complex) and fast response (simple)
- **Unified tokenizer** across all model sizes for easy deployment
- **10x faster throughput** (MoE vs dense) on long-context tasks
- **Multilingual excellence** - 119 languages supported
- **Apache 2.0 license** - Fully commercial-friendly

## Best Practices

### 1. Use Recommended Generation Parameters

```
temperature: 0.7
top_p: 0.8
top_k: 20
presence_penalty: 0-2 (adjust to reduce repetitions)
```

### 2. Leverage Automatic Chain-of-Thought

```
Qwen 3 uses CoT automatically for complex reasoning.
No need to explicitly prompt "think step by step"

Good:
Design a distributed system architecture for real-time analytics...

Model automatically engages deep thinking mode.
```

### 3. Choose Mode Based on Task Complexity

```
Complex (deep thinking mode):
✅ "Analyze this algorithm and optimize its time complexity"
✅ "Design a fault-tolerant distributed consensus protocol"

Simple (fast response mode):
✅ "What is the capital of France?"
✅ "Format this JSON: [data]"
```

### 4. Follow Standard Prompting Best Practices

```
✅ Instructions at the beginning
✅ Use separators (### or """) for context
✅ Be specific about desired format
✅ Show examples when needed (few-shot works well)
```

### 5. Optimize for Multilingual Tasks

```
✅ "Translate this English document to Chinese, preserving technical terms"
✅ "Generate product descriptions in Spanish, French, and German"
```

### 6. Use Long Context Effectively (128K with YaRN)

```
✅ "Analyze this entire codebase and identify architectural issues"
✅ "Summarize key decisions from these 50 meeting transcripts"
```

## Performance Highlights

- **92.3% accuracy** on complex math tasks
- **69.6 on Tau2-Bench** (agentic capabilities)
- **Leads on CodeForces ELO** among open-source models
- **Strong on BFCL and LiveCodeBench v5**

## When to Use

- **Multilingual applications** (119 languages)
- **Cost-sensitive production** deployments
- **Self-hosting requirements**
- **Flexible model sizes** needed (0.6B-235B)
- **Edge devices** (smaller variants)
- **Long-context tasks** (128K)

## Deployment Options

- **Local**: llama.cpp, Ollama (`ollama run qwen3`)
- **Cloud**: DashScope, Alibaba Cloud Model Studio
- **Servers**: vLLM, SGLang
- **Docker**: Containerized deployment

## References

- [Qwen 3 GitHub](https://github.com/QwenLM/Qwen3)
- [Qwen 3 Documentation](https://qwen.readthedocs.io/)
- [Technical Overview](https://deepwiki.com/QwenLM/Qwen3)
