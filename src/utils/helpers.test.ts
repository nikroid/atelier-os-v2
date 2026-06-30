import { describe, expect, it } from 'vitest';
import {
  emptyWorkDimensions,
  formatWorkDimensions,
  parseWorkDimensions,
} from './helpers';

describe('work dimensions', () => {
  it('parses 2D string', () => {
    expect(parseWorkDimensions('120 × 80 cm')).toEqual({
      height: '120',
      width: '80',
      depth: '',
      isVolume: false,
    });
  });

  it('parses volume string', () => {
    const parsed = parseWorkDimensions('70 × 50 × 30 cm');
    expect(parsed.height).toBe('70');
    expect(parsed.width).toBe('50');
    expect(parsed.depth).toBe('30');
    expect(parsed.isVolume).toBe(true);
  });

  it('formats 2D dimensions', () => {
    expect(
      formatWorkDimensions({ height: '120', width: '80', depth: '', isVolume: false }),
    ).toBe('120 × 80 cm');
  });

  it('formats volume dimensions', () => {
    expect(
      formatWorkDimensions({ height: '70', width: '50', depth: '30', isVolume: true }),
    ).toBe('70 × 50 × 30 cm');
  });

  it('returns empty when incomplete', () => {
    expect(formatWorkDimensions(emptyWorkDimensions())).toBe('');
  });
});
