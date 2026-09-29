const RUT_PATTERN = /^(\d{7,8})([\dK])$/;

function computeCheckDigit(body: string): string {
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return String(remainder);
}

function format(body: string, checkDigit: string): string {
  return `${body.replace(/\B(?=(\d{3})+$)/g, '.')}-${checkDigit}`;
}

/**
 * Validates a Chilean RUT (modulo 11 check digit) in any common notation
 * and returns it normalized as `12.345.678-5`, or `null` when invalid.
 */
export function parseRut(input: string): string | null {
  const cleaned = input.replace(/[.\-\s]/g, '').toUpperCase();
  const match = RUT_PATTERN.exec(cleaned);
  if (!match) return null;

  const [, body, checkDigit] = match;
  if (computeCheckDigit(body) !== checkDigit) return null;

  return format(body, checkDigit);
}
