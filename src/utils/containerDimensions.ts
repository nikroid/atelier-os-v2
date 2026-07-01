/** Variables CSS de référence pour les dimensions en % des conteneurs. */
export const PAGE_CONTENT_WIDTH_VAR = '--page-content-w';
export const PAGE_CONTENT_HEIGHT_VAR = '--page-content-h';

export function pageContentCssVars(contentW: number, contentH: number): Record<string, string> {
  return {
    [PAGE_CONTENT_WIDTH_VAR]: `${contentW}px`,
    [PAGE_CONTENT_HEIGHT_VAR]: `${contentH}px`,
  };
}

export function isPercentDimension(value: string | number | undefined): boolean {
  return typeof value === 'string' && value.trim().endsWith('%');
}

/**
 * Normalise une dimension de conteneur pour le CSS (px, %, auto inchangés).
 * Les % suivent le comportement flex natif du parent.
 */
export function normalizeContainerSize(value: string | number | undefined): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (value === 'auto') return 'auto';
  if (typeof value === 'number') return `${value}px`;
  return value.trim();
}

/** @deprecated Utiliser normalizeContainerSize — conservé pour compatibilité. */
export function resolveContainerDimensionCss(
  value: string | number | undefined,
  _axis: 'width' | 'height',
): string | undefined {
  return normalizeContainerSize(value);
}
