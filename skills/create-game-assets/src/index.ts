import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { AssetManifest, AssetSpec, GenerateOptions } from './types.js';
import { generateAssets } from './generate.js';

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
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
create-game-assets - Generate game assets using DALL-E 3

Usage:
  npx tsx src/index.ts --spec <path> [options]

Options:
  --spec <path>    Path to YAML specification file (required)
  --output <path>  Override output directory from spec
  --dry-run        Preview prompts without generating images
  --help, -h       Show this help message

Example:
  npx tsx src/index.ts --spec assets.yaml --dry-run
  npx tsx src/index.ts --spec assets.yaml --output ./output
`);
}

async function loadSpec(specPath: string): Promise<AssetSpec> {
  const content = await fs.readFile(specPath, 'utf-8');
  const spec = parseYaml(content) as AssetSpec;

  if (!spec.project) {
    throw new Error('Spec missing required field: project');
  }
  if (!spec.style) {
    throw new Error('Spec missing required field: style');
  }
  if (!spec.assets || spec.assets.length === 0) {
    throw new Error('Spec missing required field: assets');
  }

  return spec;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (!options.specPath) {
    console.error('Error: --spec is required');
    printHelp();
    process.exit(1);
  }

  if (!process.env['OPENAI_API_KEY'] && !options.dryRun) {
    console.error('Error: OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  const spec = await loadSpec(options.specPath);
  const outputDir = options.outputDir ?? spec.outputDir ?? './output';

  console.log(`Project: ${spec.project}`);
  console.log(`Style: ${spec.style}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Assets: ${spec.assets.length}`);
  console.log();

  if (!options.dryRun) {
    await fs.mkdir(outputDir, { recursive: true });
  }

  const results = await generateAssets(spec, outputDir, options.dryRun ?? false);

  if (!options.dryRun && results.length > 0) {
    const manifest: AssetManifest = {
      project: spec.project,
      style: spec.style,
      generatedAt: new Date().toISOString(),
      assets: results,
    };

    const manifestPath = path.join(outputDir, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\nManifest saved: ${manifestPath}`);
  }

  if (options.dryRun) {
    console.log('Dry run complete. No images were generated.');
  } else {
    console.log(`\nGenerated ${results.length} asset(s)`);
  }
}

main().catch((error: Error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
