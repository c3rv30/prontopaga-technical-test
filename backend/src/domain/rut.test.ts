import { describe, expect, it } from 'vitest';
import { parseRut } from './rut.js';

describe('parseRut', () => {
  it('normalizes dotted and plain notations to the same value', () => {
    expect(parseRut('12.345.678-5')).toBe('12.345.678-5');
    expect(parseRut('123456785')).toBe('12.345.678-5');
  });

  it('accepts a K check digit in any case', () => {
    expect(parseRut('10000013-k')).toBe('10.000.013-K');
  });

  it('rejects an invalid check digit', () => {
    expect(parseRut('12.345.678-9')).toBeNull();
  });

  it('rejects malformed input', () => {
    expect(parseRut('not-a-rut')).toBeNull();
  });
});
