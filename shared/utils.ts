export function urlFriendly(text: string) {
  return /^[a-zA-Z0-9]+$/.test(text);
}
export function capitalize(text: string) {
  return `${text[0].toLocaleUpperCase()}${text.slice(1)}`;
}
