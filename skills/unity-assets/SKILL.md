---
name: unity-assets
description: Generate Unity assets (C# scripts, ScriptableObjects, materials, shaders, prefabs) from YAML specifications. Use when user asks to create Unity game assets or scaffold a Unity project.
---

# Unity Assets Skill

## When to Use This Skill

- User asks to generate Unity scripts, components, or game code
- User wants to create ScriptableObjects for data containers
- User needs materials, shaders, or prefabs generated
- User mentions scaffolding a Unity project structure
- User has a YAML asset specification file for Unity

## Prerequisites

- Node.js installed
- Run `npm install` in the skill folder first
- (Optional) Unity Hub with Unity Editor for batch mode processing
- (Optional) Set `UNITY_PATH` environment variable to Unity Editor executable

## How It Works

1. Ask user what Unity assets they need (scripts, ScriptableObjects, materials, etc.)
2. Create an `assets.yaml` specification file based on their requirements
3. Review the spec with `--dry-run` to preview what will be generated
4. Run the generator to create files
5. Assets are saved organized by type in the output directory
6. (Optional) Unity batch mode processes prefabs and ScriptableObject instances

## Procedure

```bash
# Navigate to the skill script
cd ~/projects/ai-tools/skills/unity-assets

# Install dependencies (first time only)
npm install

# Preview what will be generated
npx tsx src/index.ts --spec /path/to/assets.yaml --dry-run

# Generate the assets
npx tsx src/index.ts --spec /path/to/assets.yaml --output /path/to/Unity/Project/Assets

# Generate without Unity batch processing
npx tsx src/index.ts --spec /path/to/assets.yaml --skip-batch
```

## Asset Specification Format

Create a YAML file like this:

```yaml
project: my-game
unityProject: /path/to/UnityProject  # Optional
outputDir: Assets/Generated
defaultNamespace: MyGame

assets:
  # C# MonoBehaviour script
  - type: script
    name: PlayerController
    description: "Third-person character controller"
    namespace: MyGame.Characters
    fields:
      - name: moveSpeed
        type: float
        default: 5.0
        tooltip: "Movement speed in units/second"
      - name: jumpForce
        type: float
        default: 10.0
        range: [0, 50]

  # ScriptableObject class definition
  - type: scriptable-object
    name: WeaponData
    description: "Weapon stats container"
    menuPath: "Game/Weapons"
    fields:
      - name: damage
        type: int
        default: 10
      - name: attackSpeed
        type: float
        default: 1.0
      - name: element
        type: enum
        values: [Fire, Ice, Lightning, Physical]

  # ScriptableObject instance (.asset file)
  - type: scriptable-instance
    name: Sword
    scriptableType: WeaponData
    values:
      damage: 25
      attackSpeed: 1.2
      element: Physical

  # Material
  - type: material
    name: GlowingCrystal
    shader: Universal Render Pipeline/Lit
    properties:
      _BaseColor: [0.2, 0.8, 1.0, 1.0]
      _EmissionColor: [0.5, 1.0, 1.5, 1.0]
      _Smoothness: 0.9

  # Shader
  - type: shader
    name: CustomToon
    pipeline: urp
    properties:
      - name: mainColor
        type: color
        default: [1, 1, 1, 1]
      - name: outlineWidth
        type: range
        range: [0, 0.1]
        default: 0.02

  # Prefab
  - type: prefab
    name: HealthPickup
    components:
      - type: SphereCollider
        properties:
          isTrigger: true
          radius: 0.5
      - type: AudioSource
        properties:
          playOnAwake: false
```

## Asset Types

| Type | Output | Description |
|------|--------|-------------|
| `script` | `.cs` | MonoBehaviour, interface, enum, or static class |
| `scriptable-object` | `.cs` | ScriptableObject class with CreateAssetMenu |
| `scriptable-instance` | `.asset` | ScriptableObject instance (data file) |
| `material` | `.mat` | Material with shader and properties |
| `shader` | `.shader` | Custom shader (URP, HDRP, or Built-in) |
| `prefab` | `.prefab` | Prefab with components |

## Script Types

For `script` assets, you can specify `scriptType`:

- `MonoBehaviour` (default) - Standard Unity component
- `ScriptableObject` - For custom SO definitions
- `interface` - C# interface
- `enum` - Enumeration
- `static` - Static utility class

## Field Types

Common field types for scripts and ScriptableObjects:

- Primitives: `int`, `float`, `string`, `bool`
- Unity: `Vector2`, `Vector3`, `Color`, `GameObject`, `Transform`
- References: `Sprite`, `AudioClip`, `Texture`, `Material`
- Collections: `List<T>`, `T[]`
- Custom: Any type name (generates as-is)

## Output Structure

```
Assets/Generated/
├── Scripts/
│   └── PlayerController.cs
├── ScriptableObjects/
│   └── WeaponData.cs
├── Data/
│   └── Sword.asset
├── Materials/
│   ├── GlowingCrystal.mat
│   └── GlowingCrystal.mat.meta
├── Shaders/
│   └── CustomToon.shader
├── Prefabs/
│   └── HealthPickup.prefab
└── manifest.json
```

## Examples

**User**: "Generate scripts for my RPG inventory system"

**Expected behavior**:
1. Ask what inventory features they need (items, slots, UI, etc.)
2. Ask about namespace preference
3. Create `assets.yaml` with script definitions
4. Show dry-run preview
5. Generate scripts after approval

**User**: "Create a WeaponData ScriptableObject with damage, speed, and element"

**Expected behavior**:
1. Create `assets.yaml`:
```yaml
project: weapons
outputDir: ./Assets/Generated

assets:
  - type: scriptable-object
    name: WeaponData
    menuPath: "Data/Weapons"
    fields:
      - name: damage
        type: int
        default: 10
      - name: attackSpeed
        type: float
        default: 1.0
      - name: element
        type: enum
        values: [Fire, Ice, Lightning, Physical]
```
2. Preview and generate

**User**: "Make a glowing material for my crystal objects"

**Expected behavior**:
1. Ask about shader preference (URP, Built-in, etc.)
2. Create material with emission properties
3. Generate .mat file ready for Unity import

## Unity Batch Mode

For prefabs and ScriptableObject instances, the skill can optionally run Unity in batch mode to ensure proper asset processing. This requires:

1. Unity Editor installed
2. `UNITY_PATH` environment variable set (or detected automatically)
3. Output path inside a Unity project

If batch mode isn't available, files are still generated and can be imported manually in Unity.
