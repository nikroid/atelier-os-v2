import { describe, expect, it } from 'vitest';
import {
  normalizeContainerSize,
  pageContentCssVars,
  resolveContainerDimensionCss,
} from './containerDimensions';

describe('containerDimensions', () => {
  it('keeps percent values unchanged for flex CSS', () => {
    expect(normalizeContainerSize('50%')).toBe('50%');
    expect(normalizeContainerSize('120%')).toBe('120%');
    expect(resolveContainerDimensionCss('40%', 'width')).toBe('40%');
  });

  it('keeps px and auto unchanged', () => {
    expect(normalizeContainerSize('120px')).toBe('120px');
    expect(normalizeContainerSize('auto')).toBe('auto');
    expect(normalizeContainerSize(80)).toBe('80px');
  });

  it('builds page content css vars', () => {
    expect(pageContentCssVars(500, 700)).toEqual({
      '--page-content-w': '500px',
      '--page-content-h': '700px',
    });
  });
});
