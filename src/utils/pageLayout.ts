import { PAGE_FORMATS } from '../types/templates';

export function getPageDimensions(format: string): { w: number; h: number } {
  const found = PAGE_FORMATS.find((f) => f.value === format);
  if (found) return { w: found.w, h: found.h };
  return { w: 210, h: 297 };
}
