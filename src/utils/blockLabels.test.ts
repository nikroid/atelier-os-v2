import { describe, expect, it } from 'vitest';
import type { DocBlock } from '../types/templates';
import { getBlockLabel } from './blockLabels';

describe('getBlockLabel', () => {
  const pageRoot: DocBlock = {
    id: 'root',
    type: 'container',
    containerRole: 'page-content',
    direction: 'column',
    children: [],
  };

  it('labels page root as Contenu de page', () => {
    expect(getBlockLabel(pageRoot, true)).toBe('Contenu de page');
    expect(getBlockLabel(pageRoot, false)).toBe('Contenu de page');
  });

  it('labels layout containers by direction', () => {
    const row: DocBlock = { id: 'r', type: 'container', direction: 'row', children: [] };
    expect(getBlockLabel(row)).toBe('Conteneur ligne');
  });

  it('labels field blocks from catalog', () => {
    const field: DocBlock = { id: 'f', type: 'field', field: 'work.prix' };
    expect(getBlockLabel(field)).toBe('Prix');
  });
});
