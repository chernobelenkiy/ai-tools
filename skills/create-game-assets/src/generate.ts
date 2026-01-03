import OpenAI from 'openai';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type {
  AssetDefinition,
  AssetSpec,
  GeneratedAsset,
  ImageSize,
} from './types.js';
import { buildPrompt, getTypeFolder } from './prompts.js';

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI();
  }
  return openaiClient;
}

async function downloadImage(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(buffer));
}

async function generateSingleAsset(
  asset: AssetDefinition,
  style: AssetSpec['style'],
  outputDir: string,
  variantIndex?: number
): Promise<GeneratedAsset> {
  const prompt = buildPrompt(asset.description, asset.type, style);
  const typeFolder = getTypeFolder(asset.type);
  const assetDir = path.join(outputDir, typeFolder);

  await fs.mkdir(assetDir, { recursive: true });

  const suffix = variantIndex !== undefined ? `-${variantIndex + 1}` : '';
  const filename = `${asset.name}${suffix}.png`;
  const outputPath = path.join(assetDir, filename);

  console.log(`Generating: ${asset.name}${suffix}`);
  console.log(`  Prompt: ${prompt.slice(0, 100)}...`);

  const size: ImageSize = asset.size ?? '1024x1024';

  const response = await getOpenAI().images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size,
    quality: 'standard',
    response_format: 'url',
  });

  const firstImage = response.data?.[0];
  if (!firstImage?.url) {
    throw new Error(`No image URL returned for ${asset.name}`);
  }

  const imageUrl = firstImage.url;
  const revisedPrompt = firstImage.revised_prompt;

  await downloadImage(imageUrl, outputPath);
  console.log(`  Saved: ${outputPath}`);

  return {
    name: `${asset.name}${suffix}`,
    type: asset.type,
    path: path.relative(outputDir, outputPath),
    prompt,
    revisedPrompt,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateAssets(
  spec: AssetSpec,
  outputDir: string,
  dryRun: boolean
): Promise<GeneratedAsset[]> {
  const results: GeneratedAsset[] = [];

  for (const asset of spec.assets) {
    const variantCount = asset.variants ?? 1;

    for (let i = 0; i < variantCount; i++) {
      const prompt = buildPrompt(asset.description, asset.type, spec.style);

      if (dryRun) {
        console.log(`[DRY RUN] ${asset.name}${variantCount > 1 ? `-${i + 1}` : ''}`);
        console.log(`  Type: ${asset.type}`);
        console.log(`  Size: ${asset.size ?? '1024x1024'}`);
        console.log(`  Prompt: ${prompt}`);
        console.log();
        continue;
      }

      const result = await generateSingleAsset(
        asset,
        spec.style,
        outputDir,
        variantCount > 1 ? i : undefined
      );
      results.push(result);

      // Save metadata for this asset
      const typeFolder = getTypeFolder(asset.type);
      const metaPath = path.join(outputDir, typeFolder, `${asset.name}.meta.json`);
      await fs.writeFile(metaPath, JSON.stringify(result, null, 2));
    }
  }

  return results;
}
