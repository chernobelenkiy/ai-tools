# create-game-assets

A Claude Code skill that generates game assets (sprites, UI elements, backgrounds, tilesets) using OpenAI DALL-E 3.

## Adding This Skill to Your Project

Copy the entire `create-game-assets` folder to your project's `.claude/skills/` directory:

```bash
# From your project root
mkdir -p .claude/skills
cp -r /path/to/ai-tools/skills/create-game-assets .claude/skills/
```

Your project structure should look like:
```
your-project/
├── .claude/
│   └── skills/
│       └── create-game-assets/
│           ├── SKILL.md
│           ├── package.json
│           ├── src/
│           └── ...
└── ... your project files
```

## Setup

### Step 1: Set OpenAI API Key

For zsh (default on modern macOS):
```bash
echo 'export OPENAI_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

For bash:
```bash
echo 'export OPENAI_API_KEY="your-key-here"' >> ~/.bash_profile
source ~/.bash_profile
```

### Step 2: Install Dependencies

```bash
cd .claude/skills/create-game-assets
npm install
```

## Using the Skill

Start Claude Code in your project and ask naturally:

```
Generate pixel art sprites for my platformer game
```

```
I need a knight character, slime enemy, and health potion for my RPG
```

```
Create game UI icons: health bar, mana potion, gold coin
```

Claude will:
1. Ask about your preferred art style
2. Ask for asset descriptions
3. Create an `assets.yaml` specification
4. Show a preview with `--dry-run`
5. Generate images after your approval

## Asset Types

- `character` - Player characters, NPCs, enemies
- `ui-icon` - Menu icons, inventory items, buttons
- `background` - Level backgrounds, title screens
- `tileset` - Seamless tiles for game maps

## Style Presets

- `pixel-art-16bit` - Retro 16-bit pixel art
- `hand-drawn` - Illustrated, sketch-like
- `vector` - Clean flat vector graphics
- `3d-render` - 3D rendered with soft lighting
- `realistic` - Photorealistic textures

## Output Structure

Generated assets are organized by type:

```
assets/
├── characters/
│   ├── hero-1.png
│   ├── hero-2.png
│   └── hero.meta.json
├── ui-icons/
│   └── coin.png
├── backgrounds/
│   └── castle.png
└── manifest.json
```

## Costs

DALL-E 3 pricing:
- 1024x1024: ~$0.04 per image
- 1792x1024: ~$0.08 per image

Always use `--dry-run` to preview prompts before generating.

## Manual Usage (without Claude Code)

```bash
cd .claude/skills/create-game-assets

# Preview prompts
npx tsx src/index.ts --spec /path/to/assets.yaml --dry-run

# Generate assets
npx tsx src/index.ts --spec /path/to/assets.yaml --output ./output
```
