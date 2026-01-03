import type { AssetType, StylePreset } from './types.js';

const styleModifiers: Record<StylePreset, string> = {
  'pixel-art-16bit':
    'in 16-bit pixel art style, limited color palette, crisp pixels, retro video game aesthetic',
  'hand-drawn':
    'hand-drawn illustration style, visible brush strokes, artistic sketch quality, warm traditional art feel',
  vector:
    'clean vector graphics style, flat colors, sharp defined edges, modern minimal design',
  '3d-render':
    '3D rendered style, soft realistic lighting, subtle shadows, depth and dimension',
  realistic:
    'photorealistic style, highly detailed textures, natural lighting, lifelike quality',
};

const typeModifiers: Record<AssetType, string> = {
  character:
    'full body character, centered in frame, clean background suitable for game sprite use, front-facing view',
  'ui-icon':
    'game UI icon, centered composition, clean simple design, suitable for inventory or menu use, isolated on clean background',
  background:
    'wide scenic game background, atmospheric depth, suitable for side-scrolling or platformer game level',
  tileset:
    'seamless tile pattern, edges designed to repeat seamlessly, top-down perspective for game map use',
};

export function buildPrompt(
  description: string,
  type: AssetType,
  style: StylePreset
): string {
  const styleModifier = styleModifiers[style];
  const typeModifier = typeModifiers[type];

  return `${description}, ${typeModifier}, ${styleModifier}, game asset, high quality`;
}

export function getTypeFolder(type: AssetType): string {
  const folders: Record<AssetType, string> = {
    character: 'characters',
    'ui-icon': 'ui-icons',
    background: 'backgrounds',
    tileset: 'tilesets',
  };
  return folders[type];
}
