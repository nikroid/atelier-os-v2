import type { FlexDirection } from '../types/templates';

export type FlexAxis = 'row' | 'column';

export function parseFlexDirection(direction?: FlexDirection): { axis: FlexAxis; reverse: boolean } {
  switch (direction) {
    case 'row-reverse':
      return { axis: 'row', reverse: true };
    case 'column-reverse':
      return { axis: 'column', reverse: true };
    case 'row':
      return { axis: 'row', reverse: false };
    default:
      return { axis: 'column', reverse: false };
  }
}

export function serializeFlexDirection(axis: FlexAxis, reverse: boolean): FlexDirection {
  if (reverse) return axis === 'row' ? 'row-reverse' : 'column-reverse';
  return axis;
}

export function flexAxis(direction?: FlexDirection): FlexAxis {
  return parseFlexDirection(direction).axis;
}

export function flexDirectionLabel(direction?: FlexDirection): string {
  const { axis, reverse } = parseFlexDirection(direction);
  if (axis === 'row') return reverse ? 'ligne inversée' : 'ligne';
  return reverse ? 'colonne inversée' : 'colonne';
}
