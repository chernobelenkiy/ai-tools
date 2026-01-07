import type { ScriptableObjectDefinition, ScriptableInstanceDefinition, FieldDefinition } from '../types.js';
import { generateScript } from './script.js';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Generate a ScriptableObject class definition (.cs file)
 */
export function generateScriptableObjectClass(def: ScriptableObjectDefinition): string {
  const menuPath = def.menuPath ?? `ScriptableObjects/${toPascalCase(def.name)}`;

  // Convert to script definition with CreateAssetMenu attribute
  const scriptContent = generateScript({
    type: 'script',
    name: def.name,
    description: def.description,
    namespace: def.namespace,
    scriptType: 'ScriptableObject',
    fields: def.fields,
    usings: ['UnityEngine'],
  });

  // Insert CreateAssetMenu attribute before the class declaration
  const createAssetMenu = `[CreateAssetMenu(fileName = "${toPascalCase(def.name)}", menuName = "${menuPath}")]`;

  // Find the class declaration and insert attribute before it
  const classMatch = scriptContent.match(/(\/\/\/ <summary>[\s\S]*?\/\/\/ <\/summary>\n)?(\s*public class)/);
  if (classMatch) {
    const index = scriptContent.indexOf(classMatch[0]);
    const before = scriptContent.slice(0, index);
    const after = scriptContent.slice(index);

    // Insert attribute before summary or class
    if (classMatch[1]) {
      // Has summary, insert before summary
      return before + `    ${createAssetMenu}\n` + after;
    } else {
      // No summary, insert before class
      return before + `    ${createAssetMenu}\n` + after;
    }
  }

  return scriptContent;
}

/**
 * Generate a ScriptableObject instance (.asset file in Unity YAML format)
 */
export function generateScriptableObjectInstance(
  def: ScriptableInstanceDefinition,
  scriptGuid?: string
): string {
  // Unity .asset files use a specific YAML format
  const yaml = generateUnityAssetYaml(def, scriptGuid);
  return yaml;
}

function generateUnityAssetYaml(
  def: ScriptableInstanceDefinition,
  scriptGuid?: string
): string {
  // Generate a placeholder GUID if not provided
  const guid = scriptGuid ?? generateDeterministicGuid(def.scriptableType);

  const properties = Object.entries(def.values)
    .map(([key, value]) => {
      return `  ${key}: ${formatYamlValue(value)}`;
    })
    .join('\n');

  return `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!114 &11400000
MonoBehaviour:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: 0}
  m_Enabled: 1
  m_EditorHideFlags: 0
  m_Script: {fileID: 11500000, guid: ${guid}, type: 3}
  m_Name: ${def.name}
  m_EditorClassIdentifier: 
${properties}
`;
}

function formatYamlValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  if (Array.isArray(value)) {
    // Check if it's a vector/color (array of numbers)
    if (value.every((v) => typeof v === 'number')) {
      if (value.length === 2) {
        return `{x: ${value[0]}, y: ${value[1]}}`;
      }
      if (value.length === 3) {
        return `{x: ${value[0]}, y: ${value[1]}, z: ${value[2]}}`;
      }
      if (value.length === 4) {
        return `{r: ${value[0]}, g: ${value[1]}, b: ${value[2]}, a: ${value[3]}}`;
      }
    }
    // Array of objects
    return '\n' + value.map((v) => `    - ${formatYamlValue(v)}`).join('\n');
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return '\n' + entries.map(([k, v]) => `    ${k}: ${formatYamlValue(v)}`).join('\n');
  }

  return String(value);
}

function generateDeterministicGuid(input: string): string {
  // Simple hash-based GUID generation for consistency
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Convert to hex and pad to 32 characters
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}${hex}${hex}${hex}`.slice(0, 32);
}
