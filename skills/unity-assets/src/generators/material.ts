import type { MaterialDefinition } from '../types.js';

// Common Unity shader GUIDs
const SHADER_GUIDS: Record<string, string> = {
  'Standard': '0000000000000000f000000000000000',
  'Universal Render Pipeline/Lit': '933532a4fcc9baf4fa0491de14d08ed7',
  'Universal Render Pipeline/Unlit': '0406db5a14f94604a8c57ccfbc9f3b46',
  'Universal Render Pipeline/Simple Lit': '8d2bb70cbf9db8d4da26e15b26e74248',
  'Particles/Standard Unlit': '0000000000000000f000000000000046',
  'Sprites/Default': '0000000000000000f000000000000046',
  'UI/Default': '0000000000000000f000000000000046',
};

// Shader property types for Unity YAML
interface ShaderProperty {
  name: string;
  type: 'color' | 'float' | 'range' | 'texture' | 'vector';
}

// Known properties for common shaders
const SHADER_PROPERTIES: Record<string, ShaderProperty[]> = {
  'Universal Render Pipeline/Lit': [
    { name: '_BaseColor', type: 'color' },
    { name: '_BaseMap', type: 'texture' },
    { name: '_Metallic', type: 'range' },
    { name: '_Smoothness', type: 'range' },
    { name: '_BumpMap', type: 'texture' },
    { name: '_BumpScale', type: 'float' },
    { name: '_EmissionColor', type: 'color' },
    { name: '_EmissionMap', type: 'texture' },
    { name: '_OcclusionMap', type: 'texture' },
    { name: '_OcclusionStrength', type: 'range' },
  ],
  'Universal Render Pipeline/Unlit': [
    { name: '_BaseColor', type: 'color' },
    { name: '_BaseMap', type: 'texture' },
  ],
  'Standard': [
    { name: '_Color', type: 'color' },
    { name: '_MainTex', type: 'texture' },
    { name: '_Metallic', type: 'range' },
    { name: '_Glossiness', type: 'range' },
    { name: '_BumpMap', type: 'texture' },
    { name: '_BumpScale', type: 'float' },
    { name: '_EmissionColor', type: 'color' },
    { name: '_EmissionMap', type: 'texture' },
  ],
};

function formatColorValue(color: unknown): string {
  if (Array.isArray(color) && color.length >= 3) {
    const [r, g, b, a = 1] = color;
    return `{r: ${r}, g: ${g}, b: ${b}, a: ${a}}`;
  }
  if (typeof color === 'object' && color !== null) {
    const c = color as Record<string, number>;
    return `{r: ${c.r ?? 1}, g: ${c.g ?? 1}, b: ${c.b ?? 1}, a: ${c.a ?? 1}}`;
  }
  return '{r: 1, g: 1, b: 1, a: 1}';
}

function formatVectorValue(vec: unknown): string {
  if (Array.isArray(vec)) {
    const [x = 0, y = 0, z = 0, w = 0] = vec;
    return `{x: ${x}, y: ${y}, z: ${z}, w: ${w}}`;
  }
  return '{x: 0, y: 0, z: 0, w: 0}';
}

function getPropertyType(propName: string, value: unknown): 'color' | 'float' | 'texture' | 'vector' {
  // Color properties typically have Color in the name or are arrays of 4 numbers
  if (propName.toLowerCase().includes('color')) {
    return 'color';
  }
  if (Array.isArray(value) && value.length === 4) {
    return 'color';
  }
  if (Array.isArray(value)) {
    return 'vector';
  }
  if (typeof value === 'number') {
    return 'float';
  }
  return 'float';
}

export function generateMaterial(def: MaterialDefinition): string {
  const shaderName = def.shader;
  const shaderGuid = SHADER_GUIDS[shaderName] ?? SHADER_GUIDS['Standard'];

  // Build saved properties
  const colors: string[] = [];
  const floats: string[] = [];
  const ints: string[] = [];

  if (def.properties) {
    for (const [name, value] of Object.entries(def.properties)) {
      const propType = getPropertyType(name, value);

      switch (propType) {
        case 'color':
          colors.push(`    - ${name}: ${formatColorValue(value)}`);
          break;
        case 'float':
          floats.push(`    - ${name}: ${value}`);
          break;
        case 'vector':
          // Vectors in Unity materials use the color format for RGBA
          colors.push(`    - ${name}: ${formatVectorValue(value)}`);
          break;
      }
    }
  }

  // Build keywords section
  const keywords = def.keywords ?? [];
  const enabledKeywords = keywords.map((k) => `    - ${k}`).join('\n');

  // Build the material YAML
  return `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!21 &2100000
Material:
  serializedVersion: 8
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_Name: ${def.name}
  m_Shader: {fileID: 4800000, guid: ${shaderGuid}, type: 3}
  m_Parent: {fileID: 0}
  m_ModifiedSerializedProperties: 0
  m_ValidKeywords:
${enabledKeywords || '    []'}
  m_InvalidKeywords: []
  m_LightmapFlags: 4
  m_EnableInstancingVariants: 0
  m_DoubleSidedGI: 0
  m_CustomRenderQueue: ${def.renderQueue ?? -1}
  stringTagMap:
    RenderType: Opaque
  disabledShaderPasses: []
  m_LockedProperties: 
  m_SavedProperties:
    serializedVersion: 3
    m_TexEnvs:
    - _BaseMap:
        m_Texture: {fileID: 0}
        m_Scale: {x: 1, y: 1}
        m_Offset: {x: 0, y: 0}
    - _BumpMap:
        m_Texture: {fileID: 0}
        m_Scale: {x: 1, y: 1}
        m_Offset: {x: 0, y: 0}
    - _EmissionMap:
        m_Texture: {fileID: 0}
        m_Scale: {x: 1, y: 1}
        m_Offset: {x: 0, y: 0}
    - _MainTex:
        m_Texture: {fileID: 0}
        m_Scale: {x: 1, y: 1}
        m_Offset: {x: 0, y: 0}
    - _OcclusionMap:
        m_Texture: {fileID: 0}
        m_Scale: {x: 1, y: 1}
        m_Offset: {x: 0, y: 0}
    m_Ints: []
    m_Floats:
${floats.length > 0 ? floats.join('\n') : '    []'}
    m_Colors:
${colors.length > 0 ? colors.join('\n') : '    []'}
  m_BuildTextureStacks: []
`;
}

/**
 * Generate a .meta file for the material
 */
export function generateMaterialMeta(materialName: string): string {
  const guid = generateDeterministicGuid(materialName + '.mat');

  return `fileFormatVersion: 2
guid: ${guid}
NativeFormatImporter:
  externalObjects: {}
  mainObjectFileID: 2100000
  userData: 
  assetBundleName: 
  assetBundleVariant: 
`;
}

function generateDeterministicGuid(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}${hex}${hex}${hex}`.slice(0, 32);
}
