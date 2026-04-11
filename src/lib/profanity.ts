/** Minimal word-boundary style filter for anonymous community answers */
const BLOCKLIST = new Set([
  "spam",
  "scam",
  // extend as needed
]);

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  return words.some((w) => BLOCKLIST.has(w.replace(/[^a-z]/g, "")));
}
