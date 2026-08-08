const MAX_STORED_TEXT = 12_000;

export function sanitizeStoredText(value: string): string {
  let result = "";
  for (const character of value.normalize("NFC")) {
    const code = character.codePointAt(0) ?? 0;
    const permittedWhitespace = code === 9 || code === 10 || code === 13;
    if (code >= 32 || permittedWhitespace) result += character;
    if (result.length >= MAX_STORED_TEXT) break;
  }
  return result.trim();
}

export function truncateText(value: string, maximum = 1_900): string {
  const sanitized = sanitizeStoredText(value);
  return sanitized.length <= maximum
    ? sanitized
    : `${sanitized.slice(0, Math.max(0, maximum - 1)).trimEnd()}…`;
}
