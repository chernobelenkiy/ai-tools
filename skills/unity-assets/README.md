# unity-assets

A Claude Code skill that generates Unity assets (C# scripts, ScriptableObjects, materials, shaders, prefabs) from YAML specifications.

## Adding This Skill to Your Project

Copy the entire `unity-assets` folder to your project's `.claude/skills/` directory:

```bash
# From your project root
mkdir -p .claude/skills
cp -r /path/to/ai-tools/skills/unity-assets .claude/skills/
```

Your project structure should look like:
```
your-project/
├── .claude/
│   └── skills/
│       └── unity-assets/
│           ├── SKILL.md
│           ├── package.json
│           ├── src/
│           └── ...
└── ... your project files
```

## Setup

### Step 1: Install Dependencies

```bash
cd .claude/skills/unity-assets
npm install
```

### Step 2 (Optional): Set Unity Path

For batch mode processing (prefabs, ScriptableObject instances):

For zsh (default on modern macOS):
```bash
# Find your Unity version first
ls /Applications/Unity/Hub/Editor/

# Set the path (replace version number)
echo 'export UNITY_PATH="/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app/Contents/MacOS/Unity"' >> ~/.zshrc
source ~/.zshrc
```

For Windows (PowerShell):
```powershell
[Environment]::SetEnvironmentVariable("UNITY_PATH", "C:\Program Files\Unity\Hub\Editor\2022.3.0f1\Editor\Unity.exe", "User")
```

## Using the Skill

Start Claude Code in your project and ask naturally:

```
Generate a PlayerController script with movement and jumping
```

```
Create a WeaponData ScriptableObject with damage, speed, and element type
```

```
Make a glowing material for crystals with blue emission
```

```
Scaffold the inventory system for my RPG
```

Claude will:
1. Ask clarifying questions about your requirements
2. Create an `assets.yaml` specification
3. Show a preview with `--dry-run`
4. Generate assets after your approval

## Asset Types

| Type | Description |
|------|-------------|
| `script` | C# MonoBehaviour, interface, enum, or static class |
| `scriptable-object` | ScriptableObject class definition |
| `scriptable-instance` | ScriptableObject asset file (.asset) |
| `material` | Material file (.mat) for URP or Built-in |
| `shader` | Custom shader (URP, HDRP, Built-in) |
| `prefab` | Prefab with components (.prefab) |

## Example YAML Specification

```yaml
project: my-rpg
unityProject: /Users/me/Unity/MyRPG
outputDir: Assets/Generated
defaultNamespace: MyRPG

assets:
  - type: script
    name: PlayerHealth
    description: "Manages player health and damage"
    fields:
      - name: maxHealth
        type: int
        default: 100
        header: "Health Settings"
      - name: currentHealth
        type: int
      - name: isInvulnerable
        type: bool
        default: false

  - type: scriptable-object
    name: ItemData
    menuPath: "Game/Items"
    fields:
      - name: itemName
        type: string
      - name: description
        type: string
      - name: icon
        type: Sprite
      - name: stackable
        type: bool
        default: true
      - name: maxStack
        type: int
        default: 99

  - type: material
    name: LavaMaterial
    shader: Universal Render Pipeline/Lit
    properties:
      _BaseColor: [1.0, 0.3, 0.0, 1.0]
      _EmissionColor: [2.0, 0.5, 0.0, 1.0]
```

## Output Structure

Generated assets are organized by type:

```
Assets/Generated/
├── Scripts/
│   └── PlayerHealth.cs
├── ScriptableObjects/
│   └── ItemData.cs
├── Materials/
│   ├── LavaMaterial.mat
│   └── LavaMaterial.mat.meta
└── manifest.json
```

## Manual Usage (without Claude Code)

```bash
cd .claude/skills/unity-assets

# Preview what will be generated
npx tsx src/index.ts --spec /path/to/assets.yaml --dry-run

# Generate assets
npx tsx src/index.ts --spec /path/to/assets.yaml --output ./Assets/Generated

# Generate without Unity batch processing
npx tsx src/index.ts --spec /path/to/assets.yaml --skip-batch
```

## CLI Options

| Option | Description |
|--------|-------------|
| `--spec <path>` | Path to YAML specification (required) |
| `--output <path>` | Override output directory |
| `--unity <path>` | Path to Unity Editor executable |
| `--dry-run` | Preview without generating files |
| `--skip-batch` | Skip Unity batch mode processing |

## Field Attributes

Scripts and ScriptableObjects support Unity attributes:

```yaml
fields:
  - name: speed
    type: float
    default: 5.0
    tooltip: "Movement speed"     # [Tooltip("...")]
    range: [0, 100]               # [Range(0, 100)]
    header: "Movement"            # [Header("Movement")]
    space: true                   # [Space]
```

## Shader Pipelines

For `shader` assets, specify the render pipeline:

- `urp` (default) - Universal Render Pipeline
- `hdrp` - High Definition Render Pipeline
- `builtin` - Built-in Render Pipeline

## Unity Batch Mode

Some assets (prefabs, ScriptableObject instances) benefit from Unity batch mode processing. When:

1. `UNITY_PATH` is set or Unity is detected
2. Output is inside a Unity project
3. `--skip-batch` is not used

The skill will:
1. Install an Editor bridge script (`ClaudeAssetBridge.cs`)
2. Run Unity in batch mode to process assets
3. Ensure proper GUID and reference handling

If Unity isn't available, files are still generated and can be imported manually.

## Tips

- Use `--dry-run` first to preview generated code
- Set `defaultNamespace` in your spec for consistent namespacing
- For large projects, organize specs by feature area
- Materials work best with text-mode serialization (Edit > Project Settings > Editor > Asset Serialization > Force Text)
