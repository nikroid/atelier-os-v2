import type { DocBlock } from '../types/templates';
import { flexDirectionLabel } from './flexDirection';
import { FIELD_CATALOG } from './templateFields';

/** Libellé affiché dans l'arbre et le panneau propriétés. */
export function getBlockLabel(block: DocBlock, isPageRoot = false): string {
  if (block.type === 'field') {
    if (!block.field) return 'Champ';
    return FIELD_CATALOG.find((f) => f.key === block.field)?.label ?? block.field;
  }
  if (block.type === 'text') {
    const preview = block.content?.slice(0, 24) || 'Texte';
    return block.content && block.content.length > 24 ? `${preview}…` : preview;
  }
  if (block.type === 'container') {
    if (isPageRoot || block.containerRole === 'page-content') return 'Contenu de page';
    return `Conteneur ${flexDirectionLabel(block.direction)}`;
  }
  if (block.type === 'image') return 'Image statique';
  if (block.type === 'spacer') return 'Espaceur';
  if (block.type === 'rectangle') return 'Séparateur';
  return block.type;
}
