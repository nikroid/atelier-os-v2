import type { DocTemplate } from '../types/templates';
import { DEFAULT_TEMPLATES, getBuiltinTemplate } from './defaultTemplates';

export const BUILTIN_TEMPLATE_IDS = new Set(DEFAULT_TEMPLATES.map((t) => t.id));

export const DEFAULT_EDITOR_TEMPLATE_ID = 'builtin_catalogue';

export const BUILTIN_TEMPLATE_NAMES = new Set(DEFAULT_TEMPLATES.map((t) => t.nom));

export function isBuiltinTemplate(t: Pick<DocTemplate, 'id' | 'nom'>): boolean {
  return BUILTIN_TEMPLATE_IDS.has(t.id) || BUILTIN_TEMPLATE_NAMES.has(t.nom);
}

export function isBuiltinTemplateId(id: string): boolean {
  return BUILTIN_TEMPLATE_IDS.has(id);
}

export function getBuiltinTemplates(): DocTemplate[] {
  return DEFAULT_TEMPLATES.map((t) => JSON.parse(JSON.stringify(t)) as DocTemplate);
}

export function resolveTemplate(
  id: string,
  userTemplates: DocTemplate[] | undefined,
): DocTemplate | undefined {
  if (isBuiltinTemplateId(id)) return getBuiltinTemplate(id);
  return userTemplates?.find((t) => t.id === id);
}

/** Modèles par défaut (code) + modèles personnels (IndexedDB). */
export function mergeTemplates(userTemplates: DocTemplate[]): DocTemplate[] {
  const custom = userTemplates.filter((t) => !isBuiltinTemplate(t));
  return [...getBuiltinTemplates(), ...custom];
}

/** Dernier modèle personnel enregistré, sinon le Catalogue intégré. */
export function resolveDefaultEditorTemplateId(userTemplates: DocTemplate[] | undefined): string {
  const lastSaved = userTemplates
    ?.filter((t) => !isBuiltinTemplate(t))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  return lastSaved?.id ?? DEFAULT_EDITOR_TEMPLATE_ID;
}

export { getBuiltinTemplate };
