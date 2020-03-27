export function Clamp(min: number, max: number, value: number) {
  return Math.max(Math.min(max, value), min);
}
