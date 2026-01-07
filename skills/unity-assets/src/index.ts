import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type {
  AssetSpec,
  AssetDefinition,
  GeneratedAsset,
  AssetManifest,
  GenerateOptions,
  ScriptDefinition,
  ScriptableObjectDefinition,
  ScriptableInstanceDefinition,
  MaterialDefinition,
  ShaderDefinition,
  PrefabDefinition,
} from './types.js';
import {
  generateScript,
  generateScriptableObjectClass,
  generateScriptableObjectInstance,
  generateMaterial,
  generateMaterialMeta,
  generatePrefab,
  generatePrefabMeta,
  generateShader,
  generateShaderMeta,
} from './generators/index.js';
import {
  runUnityBatchMode,
  isUnityProject,
  installEditorBridge,
} from './unity-runner.js';

function parseArgs(args: string[]): GenerateOptions {
  const options: GenerateOptions = {
    specPath: '',
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--spec' && args[i + 1]) {
      options.specPath = args[++i] as string;
    } else if (arg === '--output' && args[i + 1]) {
      options.outputDir = args[++i];
    } else if (arg === '--unity' && args[i + 1]) {
      options.unityPath = args[++i];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--skip-batch') {
      options.skipBatchMode = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
unity-assets - Generate Unity assets from YAML specifications

Usage:
  npx tsx src/index.ts --spec <path> [options]

Options:
  --spec <path>     Path to YAML specification file (required)
  --output <path>   Override output directory from spec
  --unity <path>    Path to Unity Editor executable
  --dry-run         Preview what will be generated without writing files
  --skip-batch      Skip Unity batch mode processing (generate files only)
  --help, -h        Show this help message

Examples:
  npx tsx src/index.ts --spec assets.yaml --dry-run
  npx tsx src/index.ts --spec assets.yaml --output ./Assets/Generated
  npx tsx src/index.ts --spec assets.yaml --skip-batch
`);
}

async function loadSpec(specPath: string): Promise<AssetSpec> {
  const content = await fs.readFile(specPath, 'utf-8');
  const spec = parseYaml(content) as AssetSpec;

  if (!spec.project) {
    throw new Error('Spec missing required field: project');
  }
  if (!spec.outputDir) {
    throw new Error('Spec missing required field: outputDir');
  }
  if (!spec.assets || spec.assets.length === 0) {
    throw new Error('Spec missing required field: assets');
  }

  return spec;
}

function getOutputFolder(assetType: string): string {
  const folders: Record<string, string> = {
    script: 'Scripts',
    'scriptable-object': 'ScriptableObjects',
    'scriptable-instance': 'Data',
    material: 'Materials',
    shader: 'Shaders',
    prefab: 'Prefabs',
    animation: 'Animations',
  };
  return folders[assetType] ?? 'Other';
}

function getFileExtension(assetType: string): string {
  const extensions: Record<string, string> = {
    script: '.cs',
    'scriptable-object': '.cs',
    'scriptable-instance': '.asset',
    material: '.mat',
    shader: '.shader',
    prefab: '.prefab',
    animation: '.anim',
  };
  return extensions[assetType] ?? '.txt';
}

async function generateAsset(
  asset: AssetDefinition,
  outputDir: string,
  defaultNamespace?: string,
  dryRun = false
): Promise<GeneratedAsset | null> {
  const folder = getOutputFolder(asset.type);
  const ext = getFileExtension(asset.type);
  const assetDir = path.join(outputDir, folder);
  const fileName = asset.name + ext;
  const filePath = path.join(assetDir, fileName);

  let content: string;
  let metaContent: string | null = null;

  switch (asset.type) {
    case 'script': {
      const def = asset as ScriptDefinition;
      def.namespace = def.namespace ?? defaultNamespace;
      content = generateScript(def);
      break;
    }
    case 'scriptable-object': {
      const def = asset as ScriptableObjectDefinition;
      def.namespace = def.namespace ?? defaultNamespace;
      content = generateScriptableObjectClass(def);
      break;
    }
    case 'scriptable-instance': {
      const def = asset as ScriptableInstanceDefinition;
      content = generateScriptableObjectInstance(def);
      break;
    }
    case 'material': {
      const def = asset as MaterialDefinition;
      content = generateMaterial(def);
      metaContent = generateMaterialMeta(def.name);
      break;
    }
    case 'shader': {
      const def = asset as ShaderDefinition;
      content = generateShader(def);
      metaContent = generateShaderMeta(def.name);
      break;
    }
    case 'prefab': {
      const def = asset as PrefabDefinition;
      content = generatePrefab(def);
      metaContent = generatePrefabMeta(def.name);
      break;
    }
    default:
      console.warn(`Unknown asset type: ${asset.type}`);
      return null;
  }

  if (dryRun) {
    console.log(`[DRY RUN] Would generate: ${filePath}`);
    console.log(`  Type: ${asset.type}`);
    if (asset.description) {
      console.log(`  Description: ${asset.description}`);
    }
    console.log(`  Content preview (first 500 chars):`);
    console.log(content.slice(0, 500));
    console.log('---');
    return null;
  }

  // Create directory and write file
  await fs.mkdir(assetDir, { recursive: true });
  await fs.writeFile(filePath, content);
  console.log(`Generated: ${filePath}`);

  // Write meta file if applicable
  if (metaContent) {
    const metaPath = filePath + '.meta';
    await fs.writeFile(metaPath, metaContent);
  }

  return {
    name: asset.name,
    type: asset.type,
    path: path.relative(outputDir, filePath),
    metaPath: metaContent ? path.relative(outputDir, filePath + '.meta') : undefined,
    generatedAt: new Date().toISOString(),
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (!options.specPath) {
    console.error('Error: --spec is required');
    printHelp();
    process.exit(1);
  }

  const spec = await loadSpec(options.specPath);
  const outputDir = options.outputDir ?? spec.outputDir;

  console.log(`\n🎮 Unity Assets Generator`);
  console.log(`========================`);
  console.log(`Project: ${spec.project}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Assets: ${spec.assets.length}`);
  if (spec.unityProject) {
    console.log(`Unity Project: ${spec.unityProject}`);
  }
  console.log();

  // Check if output is inside a Unity project
  const absoluteOutputDir = path.isAbsolute(outputDir)
    ? outputDir
    : path.resolve(outputDir);

  let unityProjectPath: string | null = null;

  if (spec.unityProject) {
    unityProjectPath = spec.unityProject;
  } else {
    // Try to detect Unity project from output path
    let checkPath = absoluteOutputDir;
    while (checkPath !== path.dirname(checkPath)) {
      if (await isUnityProject(checkPath)) {
        unityProjectPath = checkPath;
        break;
      }
      checkPath = path.dirname(checkPath);
    }
  }

  if (unityProjectPath) {
    console.log(`Detected Unity project: ${unityProjectPath}`);
  }

  // Generate assets
  const results: GeneratedAsset[] = [];
  let requiresBatchMode = false;

  for (const asset of spec.assets) {
    const result = await generateAsset(
      asset,
      absoluteOutputDir,
      spec.defaultNamespace,
      options.dryRun ?? false
    );

    if (result) {
      results.push(result);

      // Some asset types may benefit from batch mode processing
      if (['prefab', 'scriptable-instance'].includes(asset.type)) {
        requiresBatchMode = true;
      }
    }
  }

  if (options.dryRun) {
    console.log(`\nDry run complete. ${spec.assets.length} asset(s) would be generated.`);
    return;
  }

  // Write manifest
  const manifest: AssetManifest = {
    project: spec.project,
    generatedAt: new Date().toISOString(),
    assets: results,
    requiresBatchMode,
  };

  const manifestPath = path.join(absoluteOutputDir, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest saved: ${manifestPath}`);

  // Run Unity batch mode if applicable
  if (
    unityProjectPath &&
    requiresBatchMode &&
    !options.skipBatchMode
  ) {
    console.log(`\n🔄 Running Unity batch mode to process assets...`);

    // Install editor bridge if needed
    await installEditorBridge(unityProjectPath);

    const result = await runUnityBatchMode({
      unityPath: options.unityPath,
      projectPath: unityProjectPath,
      executeMethod: 'ClaudeAssetBridge.ProcessManifest',
      args: {
        manifest: manifestPath,
      },
    });

    if (result.success) {
      console.log(`✅ Unity batch processing complete`);
    } else {
      console.warn(`⚠️  Unity batch processing failed (exit code: ${result.exitCode})`);
      console.log(`Log file: ${result.logPath}`);
      if (result.logTail) {
        console.log(`\nLog tail:\n${result.logTail}`);
      }
    }
  } else if (requiresBatchMode && !options.skipBatchMode) {
    console.log(`\n💡 Some assets may need Unity to process them properly.`);
    console.log(`   Run Unity and import the generated assets, or use batch mode.`);
  }

  console.log(`\n✅ Generated ${results.length} asset(s)`);
}

main().catch((error: Error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
