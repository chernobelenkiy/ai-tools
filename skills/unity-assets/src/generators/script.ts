import type { ScriptDefinition, FieldDefinition } from '../types.js';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function mapFieldType(field: FieldDefinition): string {
  const typeMap: Record<string, string> = {
    int: 'int',
    float: 'float',
    string: 'string',
    bool: 'bool',
    vector2: 'Vector2',
    vector3: 'Vector3',
    vector4: 'Vector4',
    color: 'Color',
    gameobject: 'GameObject',
    transform: 'Transform',
    sprite: 'Sprite',
    texture: 'Texture2D',
    audioclip: 'AudioClip',
    animator: 'Animator',
    rigidbody: 'Rigidbody',
    rigidbody2d: 'Rigidbody2D',
    collider: 'Collider',
    collider2d: 'Collider2D',
  };

  const lowerType = field.type.toLowerCase();

  // Handle enum types
  if (field.values && field.values.length > 0) {
    return toPascalCase(field.name) + 'Type';
  }

  // Handle arrays
  if (lowerType.endsWith('[]')) {
    const baseType = lowerType.slice(0, -2);
    return (typeMap[baseType] ?? toPascalCase(baseType)) + '[]';
  }

  // Handle lists
  if (lowerType.startsWith('list<') && lowerType.endsWith('>')) {
    const innerType = lowerType.slice(5, -1);
    return `List<${typeMap[innerType] ?? toPascalCase(innerType)}>`;
  }

  return typeMap[lowerType] ?? field.type;
}

function generateFieldDefault(field: FieldDefinition): string {
  if (field.default === undefined) return '';

  const csType = mapFieldType(field);

  if (typeof field.default === 'string') {
    if (field.values && field.values.length > 0) {
      // Enum value
      return ` = ${toPascalCase(field.name)}Type.${field.default}`;
    }
    return ` = "${field.default}"`;
  }

  if (typeof field.default === 'boolean') {
    return ` = ${field.default ? 'true' : 'false'}`;
  }

  if (typeof field.default === 'number') {
    if (csType === 'float') {
      return ` = ${field.default}f`;
    }
    return ` = ${field.default}`;
  }

  if (Array.isArray(field.default)) {
    if (csType === 'Vector2') {
      const [x, y] = field.default;
      return ` = new Vector2(${x}f, ${y}f)`;
    }
    if (csType === 'Vector3') {
      const [x, y, z] = field.default;
      return ` = new Vector3(${x}f, ${y}f, ${z}f)`;
    }
    if (csType === 'Vector4' || csType === 'Color') {
      const [x, y, z, w] = field.default;
      return ` = new ${csType}(${x}f, ${y}f, ${z}f, ${w}f)`;
    }
  }

  return '';
}

function generateFieldAttributes(field: FieldDefinition): string[] {
  const attrs: string[] = [];

  if (field.space) {
    attrs.push('[Space]');
  }

  if (field.header) {
    attrs.push(`[Header("${field.header}")]`);
  }

  if (field.tooltip) {
    attrs.push(`[Tooltip("${field.tooltip}")]`);
  }

  if (field.range) {
    const [min, max] = field.range;
    attrs.push(`[Range(${min}f, ${max}f)]`);
  }

  return attrs;
}

function generateEnums(fields: FieldDefinition[]): string {
  const enums = fields.filter((f) => f.values && f.values.length > 0);
  if (enums.length === 0) return '';

  return (
    enums
      .map((field) => {
        const enumName = toPascalCase(field.name) + 'Type';
        const values = field.values!.map((v) => `        ${toPascalCase(v)}`).join(',\n');
        return `    public enum ${enumName}\n    {\n${values}\n    }`;
      })
      .join('\n\n') + '\n\n'
  );
}

export function generateScript(def: ScriptDefinition): string {
  const className = toPascalCase(def.name);
  const baseClass = def.baseClass ?? (def.scriptType === 'ScriptableObject' ? 'ScriptableObject' : 'MonoBehaviour');
  const scriptType = def.scriptType ?? 'MonoBehaviour';

  // Build usings
  const defaultUsings = ['UnityEngine'];
  if (def.fields?.some((f) => f.type.toLowerCase().includes('list'))) {
    defaultUsings.push('System.Collections.Generic');
  }
  const usings = [...new Set([...defaultUsings, ...(def.usings ?? [])])];
  const usingStatements = usings.map((u) => `using ${u};`).join('\n');

  // Handle interfaces and inheritance
  const interfaces = def.interfaces ?? [];
  let inheritance = '';

  if (scriptType === 'interface') {
    inheritance = interfaces.length > 0 ? ` : ${interfaces.join(', ')}` : '';
  } else if (scriptType === 'static' || scriptType === 'enum') {
    // Static classes and enums don't inherit
    inheritance = '';
  } else {
    inheritance = interfaces.length > 0
      ? ` : ${baseClass}, ${interfaces.join(', ')}`
      : ` : ${baseClass}`;
  }

  // Generate class keyword
  const classKeyword =
    scriptType === 'interface' ? 'interface' : scriptType === 'enum' ? 'enum' : scriptType === 'static' ? 'static class' : 'class';

  // Generate enums for enum fields
  const enumDeclarations = def.fields ? generateEnums(def.fields) : '';

  // Generate fields
  const fields = (def.fields ?? [])
    .map((field) => {
      const attrs = generateFieldAttributes(field);
      const csType = mapFieldType(field);
      const fieldName = toCamelCase(field.name);
      const defaultValue = generateFieldDefault(field);
      const attrStr = attrs.length > 0 ? attrs.map((a) => `        ${a}`).join('\n') + '\n' : '';
      return `${attrStr}        [SerializeField] private ${csType} ${fieldName}${defaultValue};`;
    })
    .join('\n\n');

  // Generate properties for fields
  const properties = (def.fields ?? [])
    .map((field) => {
      const csType = mapFieldType(field);
      const fieldName = toCamelCase(field.name);
      const propName = toPascalCase(field.name);
      return `        public ${csType} ${propName} => ${fieldName};`;
    })
    .join('\n');

  // Description as summary comment
  const description = def.description ? `    /// <summary>\n    /// ${def.description}\n    /// </summary>\n` : '';

  // Namespace wrapper
  const namespaceStart = def.namespace ? `namespace ${def.namespace}\n{\n` : '';
  const namespaceEnd = def.namespace ? '\n}' : '';
  const indent = def.namespace ? '    ' : '';

  // Build methods section
  const methods = (def.methods ?? []).map((m) => `        ${m}`).join('\n\n');

  const classContent = `
${description}${indent}public ${classKeyword} ${className}${inheritance}
${indent}{
${enumDeclarations}        #region Fields
${fields}
        #endregion

        #region Properties
${properties}
        #endregion
${methods ? `\n        #region Methods\n${methods}\n        #endregion` : ''}
${indent}}`;

  return `${usingStatements}

${namespaceStart}${classContent}${namespaceEnd}
`;
}
