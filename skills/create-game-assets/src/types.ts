export type AssetType = 'character' | 'ui-icon' | 'background' | 'tileset';

export type StylePreset =
  | 'pixel-art-16bit'
  | 'hand-drawn'
  | 'vector'
  | '3d-render'
  | 'realistic';

export type ImageSize = '1024x1024' | '1792x1024' | '1024x1792';

export interface AssetDefinition {
  type: AssetType;
  name: string;
  description: string;
  size?: ImageSize;
  variants?: number;
}

export interface AssetSpec {
  project: string;
  style: StylePreset;
  outputDir?: string;
  assets: AssetDefinition[];
}

export interface GeneratedAsset {
  name: string;
  type: AssetType;
  path: string;
  prompt: string;
  revisedPrompt?: string;
  generatedAt: string;
}

export interface AssetManifest {
  project: string;
  style: StylePreset;
  generatedAt: string;
  assets: GeneratedAsset[];
}

export interface GenerateOptions {
  specPath: string;
  outputDir?: string;
  dryRun?: boolean;
}
