# humanizer

A Claude Code skill for removing signs of AI-generated writing from text, making it sound more natural and human-written. Based on Wikipedia's comprehensive "Signs of AI writing" guide.

## Adding This Skill to Your Project

Copy the `humanizer` folder to your project's `.claude/skills/` directory:

```bash
# From your project root
mkdir -p .claude/skills
cp -r /path/to/ai-tools/skills/humanizer .claude/skills/
```

## Using the Skill

Start Claude Code in your project and ask naturally:

```
Humanize this text: [paste your text]
```

```
Make this sound less AI-generated
```

```
Review this for AI writing patterns
```

```
Clean up this text - it sounds too robotic
```

## What It Detects

The skill identifies and fixes 24 common AI writing patterns across five categories:

### Content Patterns
- Inflated significance claims ("pivotal moment", "testament to")
- Undue notability emphasis
- Superficial -ing analyses
- Promotional language ("nestled", "vibrant", "breathtaking")
- Vague attributions ("Experts believe", "Industry reports")
- Formulaic "Challenges and Future Prospects" sections

### Language Patterns
- Overused AI vocabulary (delve, crucial, landscape, tapestry)
- Copula avoidance ("serves as" instead of "is")
- Negative parallelisms ("It's not just X, it's Y")
- Rule of three overuse
- Synonym cycling
- False ranges

### Style Patterns
- Em dash overuse
- Excessive boldface
- Inline-header vertical lists
- Title Case In Headings
- Emoji decoration
- Curly quotation marks

### Communication Patterns
- Collaborative artifacts ("I hope this helps!")
- Knowledge-cutoff disclaimers
- Sycophantic tone

### Filler and Hedging
- Filler phrases ("in order to", "at this point in time")
- Excessive hedging
- Generic positive conclusions

## Example

**Before:**
```
The new software update serves as a testament to the company's commitment to 
innovation. Moreover, it provides a seamless, intuitive, and powerful user 
experience—ensuring that users can accomplish their goals efficiently. It's 
not just an update, it's a revolution in how we think about productivity.
```

**After:**
```
The software update adds batch processing, keyboard shortcuts, and offline 
mode. Early feedback from beta testers has been positive, with most reporting 
faster task completion.
```

## Beyond Pattern Removal

The skill doesn't just remove AI patterns - it adds voice and personality. Signs of "clean but soulless" writing:

- Every sentence is the same length
- No opinions, just neutral reporting
- No acknowledgment of uncertainty
- No first-person perspective when appropriate
- Reads like a Wikipedia article

The skill encourages:
- Having opinions and reacting to facts
- Varying sentence rhythm
- Acknowledging complexity and mixed feelings
- Using "I" when appropriate
- Being specific about feelings

## Reference

Based on [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), maintained by WikiProject AI Cleanup.
