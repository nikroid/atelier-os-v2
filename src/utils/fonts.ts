export type FontFamily = 'serif' | 'sans' | 'mono';

export const FONT_FAMILIES: { value: FontFamily; label: string; css: string }[] = [
  { value: 'serif', label: 'Serif (Georgia)', css: "Georgia, 'Times New Roman', serif" },
  { value: 'sans', label: 'Sans-serif', css: "system-ui, -apple-system, 'Helvetica Neue', sans-serif" },
  { value: 'mono', label: 'Monospace', css: "'Courier New', Courier, monospace" },
];

export const FONT_SIZE_PRESETS = [
  { label: 'Très petit', value: 8 },
  { label: 'Petit', value: 10 },
  { label: 'Corps', value: 11 },
  { label: 'Moyen', value: 14 },
  { label: 'Grand', value: 18 },
  { label: 'Titre', value: 24 },
  { label: 'Display', value: 32 },
];

export function fontFamilyCss(family?: FontFamily): string {
  return FONT_FAMILIES.find((f) => f.value === family)?.css ?? FONT_FAMILIES[0].css;
}
