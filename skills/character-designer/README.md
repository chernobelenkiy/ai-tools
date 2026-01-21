# character-designer

A Claude Code skill for designing AI characters and personas with structured, consistent definitions. Based on best practices from Character.AI, JanitorAI, and prompt engineering research.

## Adding This Skill to Your Project

Copy the `character-designer` folder to your project's `.claude/skills/` directory:

```bash
# From your project root
mkdir -p .claude/skills
cp -r /path/to/ai-tools/skills/character-designer .claude/skills/
```

## Using the Skill

Start Claude Code in your project and ask naturally:

```
Create an AI character for a customer support chatbot
```

```
Design a persona for my game's NPC shopkeeper
```

```
Help me build a roleplay character for Character.AI
```

```
Review and improve this character definition
```

## What It Provides

### Structured Character Template

Uses XML-based formatting optimized for AI comprehension:

```xml
<character>
<name>Character Name</name>
<role>Brief role/occupation</role>

<appearance>Physical traits and distinctive features</appearance>
<personality>3-5 core traits with behavioral examples</personality>
<speech>Vocabulary, verbal tics, speech patterns</speech>
<knowledge>What they know and don't know</knowledge>
<background>Brief relevant backstory</background>
</character>

<example_dialogue>
User: [typical interaction]
{{char}}: [authentic response demonstrating personality]
</example_dialogue>
```

### The Five Pillars of Design

1. **Identity Foundation** - Name, role, and core drive
2. **Distinctive Voice** - Recognizable speech patterns
3. **Behavioral Anchors** - How they act, not just what they are
4. **Knowledge Boundaries** - What they know AND don't know
5. **Example Dialogues** - Demonstration over description

### Character Type Templates

Pre-built templates for common use cases:
- Expert Advisor (technical consultant, mentor)
- Companion/Friend (casual support, emotional connection)
- Creative Collaborator (brainstorming partner)

## Key Best Practices

### Token Efficiency
Target 500 tokens or less for core definitions. Excessive detail causes AI to ignore or misuse information.

### Show, Don't Tell
**Instead of:** "She is brave"
**Use:** "When faced with danger, she steps forward first but clenches her fists to hide the shaking"

### Define Knowledge Gaps
```xml
<knowledge>
KNOWS: Marine biology (expert level), podcast production
DOESN'T KNOW: Current pop culture, how to use TikTok
</knowledge>
```

Knowledge gaps make characters feel real.

## Example Output

When you ask to create a character, you'll receive:

1. **Character Definition** - Structured XML format ready to use
2. **Test Conversation Starters** - 3-5 prompts to try
3. **Iteration Notes** - What to watch for during testing

## Common Mistakes the Skill Helps Avoid

- **Kitchen Sink** - Cramming every possible detail
- **Behavioral Scripts** - Telling AI exactly what to do
- **Abstract Traits** - Vague descriptors without grounding
- **Perfect Knowledge** - Characters who know everything

## Iteration Process

The skill recommends:
- Week 1: 20-50 test conversations to discover inconsistencies
- Week 2: Refine definition based on observations
- Week 3: Polish and reduce to essentials

## References

Based on research from:
- [Character.AI Character Book](https://book.character.ai/)
- [JanitorAI Persona Guide](https://help.janitorai.com/en/article/what-makes-a-good-persona-bhlhjn/)
- [ChatGPT Persona Best Practices](https://www.looppanel.com/blog/chatgpt-persona)
