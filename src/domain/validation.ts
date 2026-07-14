export const MIN_COMPETITORS = 1;
export const MAX_COMPETITORS = 100;
export const MIN_DISCIPLINES = 1;
export const MAX_DISCIPLINES = 50;
export const MAX_NAME_LENGTH = 200;

export function isValidCount(count: number, min: number, max: number): boolean {
  return Number.isInteger(count) && count >= min && count <= max;
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_NAME_LENGTH;
}

export function isValidScore(value: string): boolean {
  if (value.trim() === '') return true; // empty = not yet entered
  const n = Number(value);
  return Number.isFinite(n);
}
