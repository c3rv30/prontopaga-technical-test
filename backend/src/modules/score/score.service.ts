import { calculateScore } from '../../domain/score.js';

export interface ScoreResult {
  rut: string;
  score: number;
  /** ISO 8601 UTC timestamp of the query, without milliseconds. */
  fecha: string;
}

export class ScoreService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  /** Expects a RUT already normalized by `parseRut`. */
  getScore(rut: string): ScoreResult {
    return {
      rut,
      score: calculateScore(rut),
      fecha: this.now()
        .toISOString()
        .replace(/\.\d{3}Z$/, 'Z'),
    };
  }
}
