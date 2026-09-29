import { createHash } from 'node:crypto';

const MAX_SCORE = 100;

/**
 * Deterministic financial score (0–100) for a RUT: the same RUT always
 * yields the same score, while different RUTs spread across the range.
 * Expects a RUT already normalized by `parseRut`.
 */
export function calculateScore(normalizedRut: string): number {
  const digest = createHash('sha256').update(normalizedRut).digest();
  return digest.readUInt32BE(0) % (MAX_SCORE + 1);
}
