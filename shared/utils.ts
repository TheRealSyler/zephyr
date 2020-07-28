export function urlFriendly(text: string) {
  return /[a-zA-Z0-9]+/.test(text);
}
