export function parseFloat(value: string | number): number {
  if (typeof value === 'number') return value;
  return Number.parseFloat(value) || 0;
}
