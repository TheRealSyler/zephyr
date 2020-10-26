export function createObjectFromArray<A extends any[], T extends {}>(array: A): T {
  return array.reduce((acc, val) => ((acc[val] = null), acc), {});
}
