import iconv from 'iconv-lite';
export function createObjectFromArray<A extends any[], T extends {}>(array: A): T {
  return array.reduce((acc, val) => ((acc[val] = null), acc), {});
}
export function convertToUtf8(text: string) {
  return iconv.encode(text, 'utf8').toString('utf8');
}
