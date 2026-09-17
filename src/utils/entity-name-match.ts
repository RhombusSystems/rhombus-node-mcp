/** Match human names despite capitalization, spacing, or punctuation differences. */
export function matchesEntityName(name: string, query: string): boolean {
  const lowerName = name.toLowerCase();
  const lowerQuery = query.toLowerCase();
  if (lowerName.includes(lowerQuery)) return true;

  const compact = (value: string) => value.normalize("NFKC").replace(/[^\p{L}\p{N}]/gu, "");
  const compactQuery = compact(lowerQuery);
  // Do not turn punctuation-only or tiny queries into broad matches.
  return compactQuery.length >= 3 && compact(lowerName).includes(compactQuery);
}
