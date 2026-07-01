import { describe, expect, it } from 'vitest';
import type { DocBlock } from '../../types/templates';
import { getChildWrapStyle } from './BlockRenderer';

function container(overrides: Partial<DocBlock> = {}): DocBlock {
  return {
    id: 'c1',
    type: 'container',
    direction: 'column',
    children: [],
    ...overrides,
  };
}

describe('getChildWrapStyle', () => {
  it('column parent + height % → flex-basis sur axe principal', () => {
    const child = container({ height: '25%' });
    const style = getChildWrapStyle(child, 'column');
    expect(style.flex).toBe('0 0 25%');
    expect(style.width).toBe('100%');
  });

  it('row parent + width px + height % → flex largeur + height cross-axis', () => {
    const child = container({ width: '32px', height: '50%' });
    const style = getChildWrapStyle(child, 'row');
    expect(style.flex).toBe('0 0 32px');
    expect(style.height).toBe('50%');
    expect(style.maxHeight).toBe('50%');
    expect(style.minHeight).toBe(0);
    expect(style.alignSelf).toBe('flex-start');
  });

  it('row parent + height % sans largeur custom → flex grow + height %', () => {
    const child = container({ height: '25%' });
    const style = getChildWrapStyle(child, 'row');
    expect(style.flex).toBe('1 1 0%');
    expect(style.height).toBe('25%');
    expect(style.alignSelf).toBe('flex-start');
  });

  it('row parent sans height → stretch sur axe secondaire', () => {
    const child = container({ width: '32px' });
    const style = getChildWrapStyle(child, 'row', 'stretch');
    expect(style.flex).toBe('0 0 32px');
    expect(style.alignSelf).toBe('stretch');
    expect(style.height).toBeUndefined();
  });
});
