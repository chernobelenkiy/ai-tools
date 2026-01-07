import type { PrefabDefinition, ComponentDefinition } from '../types.js';

// Unity component class IDs (used in YAML serialization)
const COMPONENT_CLASS_IDS: Record<string, number> = {
  Transform: 4,
  GameObject: 1,
  Camera: 20,
  Light: 108,
  MeshFilter: 33,
  MeshRenderer: 23,
  SkinnedMeshRenderer: 137,
  BoxCollider: 65,
  SphereCollider: 135,
  CapsuleCollider: 136,
  MeshCollider: 64,
  Rigidbody: 54,
  AudioSource: 82,
  AudioListener: 81,
  Animator: 95,
  Animation: 111,
  ParticleSystem: 198,
  Canvas: 223,
  CanvasRenderer: 222,
  RectTransform: 224,
  Image: 114, // UI.Image is MonoBehaviour
  Text: 114, // UI.Text is MonoBehaviour
  Button: 114,
  // MonoBehaviour-based components use 114
};

let fileIdCounter = 1000000;

function getNextFileId(): number {
  return fileIdCounter++;
}

function formatPropertyValue(value: unknown, indent: string = ''): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === 'number')) {
      // Vector or color
      if (value.length === 2) {
        return `{x: ${value[0]}, y: ${value[1]}}`;
      }
      if (value.length === 3) {
        return `{x: ${value[0]}, y: ${value[1]}, z: ${value[2]}}`;
      }
      if (value.length === 4) {
        return `{x: ${value[0]}, y: ${value[1]}, z: ${value[2]}, w: ${value[3]}}`;
      }
    }
    // Array of objects
    return value.map((v) => `\n${indent}- ${formatPropertyValue(v, indent + '  ')}`).join('');
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length <= 4 && entries.every(([, v]) => typeof v === 'number')) {
      // Inline object (like a vector)
      return '{' + entries.map(([k, v]) => `${k}: ${v}`).join(', ') + '}';
    }
    return entries.map(([k, v]) => `\n${indent}${k}: ${formatPropertyValue(v, indent + '  ')}`).join('');
  }

  return String(value);
}

function generateComponent(
  comp: ComponentDefinition,
  gameObjectFileId: number,
  transformFileId: number
): { yaml: string; fileId: number } {
  const fileId = getNextFileId();
  const classId = COMPONENT_CLASS_IDS[comp.type] ?? 114; // Default to MonoBehaviour

  let componentYaml = '';

  if (comp.type === 'Transform') {
    componentYaml = `--- !u!4 &${fileId}
Transform:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: ${gameObjectFileId}}
  serializedVersion: 2
  m_LocalRotation: {x: 0, y: 0, z: 0, w: 1}
  m_LocalPosition: {x: 0, y: 0, z: 0}
  m_LocalScale: {x: 1, y: 1, z: 1}
  m_ConstrainProportionsScale: 0
  m_Children: []
  m_Father: {fileID: 0}
  m_LocalEulerAnglesHint: {x: 0, y: 0, z: 0}`;
  } else if (classId === 114) {
    // MonoBehaviour-based component
    const properties = Object.entries(comp.properties ?? {})
      .map(([key, value]) => `  ${key}: ${formatPropertyValue(value)}`)
      .join('\n');

    componentYaml = `--- !u!114 &${fileId}
MonoBehaviour:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: ${gameObjectFileId}}
  m_Enabled: 1
  m_EditorHideFlags: 0
  m_Script: {fileID: 0}
  m_Name: 
  m_EditorClassIdentifier: 
${properties}`;
  } else {
    // Built-in component
    const properties = Object.entries(comp.properties ?? {})
      .map(([key, value]) => `  ${key}: ${formatPropertyValue(value)}`)
      .join('\n');

    componentYaml = `--- !u!${classId} &${fileId}
${comp.type}:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: ${gameObjectFileId}}
  m_Enabled: 1
${properties}`;
  }

  return { yaml: componentYaml, fileId };
}

/**
 * Generate a prefab in Unity YAML format
 */
export function generatePrefab(def: PrefabDefinition): string {
  fileIdCounter = 1000000; // Reset counter for each prefab

  const gameObjectFileId = getNextFileId();
  const transformFileId = getNextFileId();

  // Generate transform first
  const transformYaml = `--- !u!4 &${transformFileId}
Transform:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: ${gameObjectFileId}}
  serializedVersion: 2
  m_LocalRotation: {x: 0, y: 0, z: 0, w: 1}
  m_LocalPosition: {x: 0, y: 0, z: 0}
  m_LocalScale: {x: 1, y: 1, z: 1}
  m_ConstrainProportionsScale: 0
  m_Children: []
  m_Father: {fileID: 0}
  m_LocalEulerAnglesHint: {x: 0, y: 0, z: 0}`;

  // Generate other components
  const componentResults = def.components.map((comp) =>
    generateComponent(comp, gameObjectFileId, transformFileId)
  );

  // Build component references for GameObject
  const componentRefs = [
    `  - component: {fileID: ${transformFileId}}`,
    ...componentResults.map((r) => `  - component: {fileID: ${r.fileId}}`),
  ].join('\n');

  // Generate GameObject
  const gameObjectYaml = `--- !u!1 &${gameObjectFileId}
GameObject:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  serializedVersion: 6
  m_Component:
${componentRefs}
  m_Layer: 0
  m_Name: ${def.name}
  m_TagString: Untagged
  m_Icon: {fileID: 0}
  m_NavMeshLayer: 0
  m_StaticEditorFlags: 0
  m_IsActive: 1`;

  // Combine all YAML sections
  const allYaml = [
    gameObjectYaml,
    transformYaml,
    ...componentResults.map((r) => r.yaml),
  ].join('\n');

  return `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
${allYaml}
`;
}

/**
 * Generate a .meta file for the prefab
 */
export function generatePrefabMeta(prefabName: string): string {
  const guid = generateDeterministicGuid(prefabName + '.prefab');

  return `fileFormatVersion: 2
guid: ${guid}
PrefabImporter:
  externalObjects: {}
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
