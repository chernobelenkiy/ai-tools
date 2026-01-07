// Unity asset types

export type UnityAssetType =
  | 'script'
  | 'scriptable-object'
  | 'scriptable-instance'
  | 'material'
  | 'shader'
  | 'prefab'
  | 'animation';

export type ScriptType = 'MonoBehaviour' | 'ScriptableObject' | 'interface' | 'enum' | 'static';

export type ShaderPipeline = 'urp' | 'hdrp' | 'builtin';

// Field definition for ScriptableObjects and scripts
export interface FieldDefinition {
  name: string;
  type: string;
  default?: string | number | boolean | number[];
  values?: string[]; // For enums
  tooltip?: string;
  range?: [number, number];
  header?: string;
  space?: boolean;
}

// Component definition for prefabs
export interface ComponentDefinition {
  type: string;
  properties?: Record<string, unknown>;
}

// Base asset definition
export interface BaseAssetDefinition {
  type: UnityAssetType;
  name: string;
  description?: string;
  namespace?: string;
}

// C# Script definition
export interface ScriptDefinition extends BaseAssetDefinition {
  type: 'script';
  scriptType?: ScriptType;
  baseClass?: string;
  interfaces?: string[];
  fields?: FieldDefinition[];
  usings?: string[];
  methods?: string[];
}

// ScriptableObject class definition
export interface ScriptableObjectDefinition extends BaseAssetDefinition {
  type: 'scriptable-object';
  menuPath?: string;
  fields: FieldDefinition[];
}

// ScriptableObject instance (asset file)
export interface ScriptableInstanceDefinition extends BaseAssetDefinition {
  type: 'scriptable-instance';
  scriptableType: string;
  values: Record<string, unknown>;
}

// Material definition
export interface MaterialDefinition extends BaseAssetDefinition {
  type: 'material';
  shader: string;
  properties?: Record<string, unknown>;
  keywords?: string[];
  renderQueue?: number;
}

// Shader definition
export interface ShaderDefinition extends BaseAssetDefinition {
  type: 'shader';
  pipeline?: ShaderPipeline;
  properties?: FieldDefinition[];
  features?: string[];
}

// Prefab definition
export interface PrefabDefinition extends BaseAssetDefinition {
  type: 'prefab';
  components: ComponentDefinition[];
  children?: PrefabDefinition[];
}

// Animation definition
export interface AnimationDefinition extends BaseAssetDefinition {
  type: 'animation';
  length?: number;
  loop?: boolean;
  curves?: AnimationCurve[];
}

export interface AnimationCurve {
  path: string;
  property: string;
  keys: AnimationKey[];
}

export interface AnimationKey {
  time: number;
  value: number;
  inTangent?: number;
  outTangent?: number;
}

// Union type for all asset definitions
export type AssetDefinition =
  | ScriptDefinition
  | ScriptableObjectDefinition
  | ScriptableInstanceDefinition
  | MaterialDefinition
  | ShaderDefinition
  | PrefabDefinition
  | AnimationDefinition;

// Asset specification file structure
export interface AssetSpec {
  project: string;
  unityProject?: string;
  unityVersion?: string;
  outputDir: string;
  defaultNamespace?: string;
  assets: AssetDefinition[];
}

// Generated asset result
export interface GeneratedAsset {
  name: string;
  type: UnityAssetType;
  path: string;
  metaPath?: string;
  generatedAt: string;
}

// Asset manifest
export interface AssetManifest {
  project: string;
  generatedAt: string;
  assets: GeneratedAsset[];
  requiresBatchMode: boolean;
}

// CLI options
export interface GenerateOptions {
  specPath: string;
  outputDir?: string;
  dryRun?: boolean;
  unityPath?: string;
  skipBatchMode?: boolean;
}
