import type { ShaderDefinition, FieldDefinition } from '../types.js';

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function mapPropertyType(field: FieldDefinition): string {
  const typeMap: Record<string, string> = {
    float: 'Float',
    range: 'Range(0, 1)',
    int: 'Int',
    color: 'Color',
    vector: 'Vector',
    '2d': '2D',
    '3d': '3D',
    cube: 'Cube',
  };

  const lowerType = field.type.toLowerCase();

  if (field.range) {
    return `Range(${field.range[0]}, ${field.range[1]})`;
  }

  return typeMap[lowerType] ?? 'Float';
}

function getPropertyDefault(field: FieldDefinition): string {
  const type = field.type.toLowerCase();

  if (field.default !== undefined) {
    if (type === 'color' && Array.isArray(field.default)) {
      const [r, g, b, a = 1] = field.default;
      return `(${r}, ${g}, ${b}, ${a})`;
    }
    if (type === 'vector' && Array.isArray(field.default)) {
      const [x, y, z, w = 0] = field.default;
      return `(${x}, ${y}, ${z}, ${w})`;
    }
    if (typeof field.default === 'number') {
      return field.default.toString();
    }
  }

  // Defaults by type
  const defaults: Record<string, string> = {
    float: '1',
    range: '0.5',
    int: '1',
    color: '(1, 1, 1, 1)',
    vector: '(0, 0, 0, 0)',
    '2d': '"white" {}',
    '3d': '"" {}',
    cube: '"" {}',
  };

  return defaults[type] ?? '1';
}

export function generateShader(def: ShaderDefinition): string {
  const shaderName = `Custom/${toPascalCase(def.name)}`;
  const pipeline = def.pipeline ?? 'urp';

  // Generate properties block
  const properties = (def.properties ?? [])
    .map((field) => {
      const propName = `_${toPascalCase(field.name)}`;
      const displayName = field.name.replace(/([A-Z])/g, ' $1').trim();
      const propType = mapPropertyType(field);
      const defaultVal = getPropertyDefault(field);
      return `        ${propName} ("${displayName}", ${propType}) = ${defaultVal}`;
    })
    .join('\n');

  if (pipeline === 'urp') {
    return generateURPShader(shaderName, properties, def);
  } else if (pipeline === 'hdrp') {
    return generateHDRPShader(shaderName, properties, def);
  } else {
    return generateBuiltinShader(shaderName, properties, def);
  }
}

function generateURPShader(
  shaderName: string,
  properties: string,
  def: ShaderDefinition
): string {
  const propertyVariables = (def.properties ?? [])
    .map((field) => {
      const propName = `_${toPascalCase(field.name)}`;
      const hlslType = getHLSLType(field.type);
      return `            ${hlslType} ${propName};`;
    })
    .join('\n');

  return `Shader "${shaderName}"
{
    Properties
    {
${properties}
    }

    SubShader
    {
        Tags
        {
            "RenderType" = "Opaque"
            "RenderPipeline" = "UniversalPipeline"
            "Queue" = "Geometry"
        }

        Pass
        {
            Name "ForwardLit"
            Tags { "LightMode" = "UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_fog

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS : NORMAL;
                float2 uv : TEXCOORD0;
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 normalWS : TEXCOORD1;
                float3 positionWS : TEXCOORD2;
                float fogFactor : TEXCOORD3;
            };

            CBUFFER_START(UnityPerMaterial)
${propertyVariables}
            CBUFFER_END

            Varyings vert(Attributes input)
            {
                Varyings output;
                output.positionWS = TransformObjectToWorld(input.positionOS.xyz);
                output.positionCS = TransformWorldToHClip(output.positionWS);
                output.normalWS = TransformObjectToWorldNormal(input.normalOS);
                output.uv = input.uv;
                output.fogFactor = ComputeFogFactor(output.positionCS.z);
                return output;
            }

            half4 frag(Varyings input) : SV_Target
            {
                // Basic lighting
                Light mainLight = GetMainLight();
                half3 lighting = mainLight.color * saturate(dot(input.normalWS, mainLight.direction));
                lighting += half3(0.1, 0.1, 0.1); // Ambient

                half4 color = half4(1, 1, 1, 1);
                color.rgb *= lighting;

                color.rgb = MixFog(color.rgb, input.fogFactor);
                return color;
            }
            ENDHLSL
        }
    }

    FallBack "Universal Render Pipeline/Lit"
}
`;
}

function generateHDRPShader(
  shaderName: string,
  properties: string,
  def: ShaderDefinition
): string {
  return `Shader "${shaderName}"
{
    Properties
    {
${properties}
    }

    SubShader
    {
        Tags
        {
            "RenderType" = "Opaque"
            "RenderPipeline" = "HDRenderPipeline"
        }

        Pass
        {
            Name "ForwardOnly"
            Tags { "LightMode" = "ForwardOnly" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "Packages/com.unity.render-pipelines.high-definition/Runtime/RenderPipeline/ShaderPass/ShaderPassForward.hlsl"

            // Minimal HDRP shader - extend as needed
            ENDHLSL
        }
    }

    FallBack "HDRP/Lit"
}
`;
}

function generateBuiltinShader(
  shaderName: string,
  properties: string,
  def: ShaderDefinition
): string {
  const propertyVariables = (def.properties ?? [])
    .map((field) => {
      const propName = `_${toPascalCase(field.name)}`;
      const cgType = getCGType(field.type);
      return `            ${cgType} ${propName};`;
    })
    .join('\n');

  return `Shader "${shaderName}"
{
    Properties
    {
${properties}
    }

    SubShader
    {
        Tags { "RenderType" = "Opaque" "Queue" = "Geometry" }
        LOD 200

        Pass
        {
            Tags { "LightMode" = "ForwardBase" }

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_fog

            #include "UnityCG.cginc"
            #include "Lighting.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 worldNormal : TEXCOORD1;
                float3 worldPos : TEXCOORD2;
                UNITY_FOG_COORDS(3)
            };

${propertyVariables}

            v2f vert(appdata v)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                o.worldPos = mul(unity_ObjectToWorld, v.vertex).xyz;
                o.worldNormal = UnityObjectToWorldNormal(v.normal);
                o.uv = v.uv;
                UNITY_TRANSFER_FOG(o, o.pos);
                return o;
            }

            fixed4 frag(v2f i) : SV_Target
            {
                // Basic diffuse lighting
                float3 lightDir = normalize(_WorldSpaceLightPos0.xyz);
                float diff = max(0, dot(i.worldNormal, lightDir));
                float3 lighting = _LightColor0.rgb * diff + UNITY_LIGHTMODEL_AMBIENT.rgb;

                fixed4 col = fixed4(1, 1, 1, 1);
                col.rgb *= lighting;

                UNITY_APPLY_FOG(i.fogCoord, col);
                return col;
            }
            ENDCG
        }
    }

    FallBack "Diffuse"
}
`;
}

function getHLSLType(type: string): string {
  const typeMap: Record<string, string> = {
    float: 'half',
    range: 'half',
    int: 'int',
    color: 'half4',
    vector: 'float4',
    '2d': 'TEXTURE2D(_Tex)',
    '3d': 'TEXTURE3D(_Tex)',
    cube: 'TEXTURECUBE(_Tex)',
  };
  return typeMap[type.toLowerCase()] ?? 'half';
}

function getCGType(type: string): string {
  const typeMap: Record<string, string> = {
    float: 'float',
    range: 'float',
    int: 'int',
    color: 'fixed4',
    vector: 'float4',
    '2d': 'sampler2D',
    '3d': 'sampler3D',
    cube: 'samplerCUBE',
  };
  return typeMap[type.toLowerCase()] ?? 'float';
}

/**
 * Generate a .meta file for the shader
 */
export function generateShaderMeta(shaderName: string): string {
  const guid = generateDeterministicGuid(shaderName + '.shader');

  return `fileFormatVersion: 2
guid: ${guid}
ShaderImporter:
  externalObjects: {}
  defaultTextures: []
  nonModifiableTextures: []
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
