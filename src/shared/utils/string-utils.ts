/**
 * Capitalizes the first letter of each word in a string.
 * Example: "bihar patna" -> "Bihar Patna"
 */
export function capitalizeWords(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
