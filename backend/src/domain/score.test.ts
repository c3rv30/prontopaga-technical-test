import { describe, expect, it } from 'vitest';
import { calculateScore } from './score.js';

describe('calculateScore', () => {
  it('returns the same score for the same RUT', () => {
    expect(calculateScore('12.345.678-5')).toBe(calculateScore('12.345.678-5'));
  });

  it('returns an integer between 0 and 100 that varies across RUTs', () => {
    const scores = ['12.345.678-5', '10.000.013-K', '7.654.321-6'].map(
      calculateScore,
    );

    for (const score of scores) {
      expect(Number.isInteger(score)).toBe(true);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
    expect(new Set(scores).size).toBeGreaterThan(1);
  });
});
