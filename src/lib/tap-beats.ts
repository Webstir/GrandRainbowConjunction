/**
 * TAP sections split into reader paragraphs: blank lines, or a line break right
 * after sentence-ending punctuation when the next line starts a new thought.
 * Prose paragraphs become sentence/clause MDX sources; the reader stacks within
 * a paragraph, then clears for the first beat of the next paragraph.
 */

/** True if this chunk is a single MDX/JSX element (PascalCase tag). */
export function isAtomicTapSection(section: string): boolean {
  const t = section.trim();
  if (!t) return false;
  return /^<[A-Z]/.test(t);
}

/** If the block is `<WisdomSummary items={[ "…", … ]} />`, return the strings. */
export function parseWisdomSummaryItems(source: string): string[] | null {
  const t = source.trim();
  if (!/^<WisdomSummary\b/.test(t)) return null;
  const itemsIdx = t.indexOf("items=");
  if (itemsIdx === -1) return null;
  const open = t.indexOf("[", itemsIdx);
  const close = t.lastIndexOf("]");
  if (open === -1 || close <= open) return null;
  const inner = t.slice(open + 1, close);
  const out: string[] = [];
  const re = /"((?:[^"\\]|\\.)*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(inner)) !== null) {
    out.push(m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n"));
  }
  return out.length ? out : null;
}

/** Strong sentence end + next chunk looks like a new thought (not lowercase glue). */
const PERIOD_BOUNDARY =
  /(?<=[.!?…])(?<!\d\.)(?<!\b(?:Dr|Mr|Mrs|Ms|Mx|Prof|Sr|Jr|St)\.)\s+(?=[\p{Lu}\p{N}"'“‘(*\[\u2014\u2013\p{Extended_Pictographic}])/gu;

/** Same as a space after `.?!…`, but the gap is a newline → new reader paragraph. */
const NEWLINE_PARAGRAPH_BREAK =
  /(?<=[.!?…])(?<!\d\.)(?<!\b(?:Dr|Mr|Mrs|Ms|Mx|Prof|Sr|Jr|St)\.)\s*\n\s*(?=[\p{Lu}\p{N}"'“‘(*\[\u2014\u2013\p{Extended_Pictographic}])/gu;

/** Blank lines, then single-newline “hard” paragraph breaks after sentence end. */
function splitMarkdownParagraphBlocks(trimmed: string): string[] {
  const coarse = trimmed
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const block of coarse) {
    out.push(
      ...block
        .split(NEWLINE_PARAGRAPH_BREAK)
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }
  return out;
}

/** Em dash / en dash introducing a follow-on clause (…word — or …). */
const DASH_CLAUSE = /\s[—–]\s+(?=[\p{Ll}(*\[\u201c"'])/gu;

/** Colon before a lowercase / quoted clause (slow level: fewer…), not after a digit. */
const COLON_CLAUSE = /(?<!\d):\s+(?=[\p{Ll}*\u201c(])/gu;

function clauseSplitSegment(segment: string): string[] {
  let parts = [segment];
  for (const r of [DASH_CLAUSE, COLON_CLAUSE]) {
    const next: string[] = [];
    for (const p of parts) {
      next.push(...p.split(r).map((s) => s.trim()).filter(Boolean));
    }
    parts = next;
  }
  return parts;
}

/**
 * Split prose into tap beats: sentence ends (. ! ? …), then clause breaks (—, :)
 * where the next part reads like a new phrase. Skips common title abbreviations.
 * Merges trailing emoji-only tails onto the previous beat.
 */
export function splitProseIntoSentences(paragraph: string): string[] {
  const t = paragraph.trim();
  if (!t) return [];
  const byPeriod = t.split(PERIOD_BOUNDARY).map((s) => s.trim()).filter(Boolean);
  const pieces: string[] = [];
  for (const seg of byPeriod) {
    pieces.push(...clauseSplitSegment(seg));
  }
  const merged = mergeTrailingEmojiOnlyParts(pieces);
  return merged.length ? merged : [t];
}

function mergeTrailingEmojiOnlyParts(parts: string[]): string[] {
  const out: string[] = [];
  for (const s of parts) {
    if (!out.length) {
      out.push(s);
      continue;
    }
    const tr = s.trim();
    if (
      tr &&
      !/\p{L}/u.test(tr) &&
      !/^\d/u.test(tr) &&
      !/^[\u2014\u2013—–]/u.test(tr)
    ) {
      out[out.length - 1] = `${out[out.length - 1]} ${tr}`.trim();
    } else {
      out.push(s);
    }
  }
  return out;
}

export type RawParagraph =
  | { kind: "atomic"; source: string }
  | { kind: "prose"; sentences: string[] }
  | { kind: "wisdomStack"; items: string[] };

/** Paragraph-sized units inside one TAP chunk (blank-line separated). */
export function expandTapSectionToRawParagraphs(section: string): RawParagraph[] {
  const trimmed = section.trim();
  if (!trimmed) return [];
  const wisdomWhole = parseWisdomSummaryItems(trimmed);
  if (wisdomWhole) {
    if (wisdomWhole.length === 1) {
      return [{ kind: "atomic", source: trimmed }];
    }
    return [{ kind: "wisdomStack", items: wisdomWhole }];
  }
  if (isAtomicTapSection(trimmed)) {
    return [{ kind: "atomic", source: trimmed }];
  }
  const blocks = splitMarkdownParagraphBlocks(trimmed);
  const out: RawParagraph[] = [];
  for (const b of blocks) {
    const wisdom = parseWisdomSummaryItems(b);
    if (wisdom) {
      if (wisdom.length === 1) {
        out.push({ kind: "atomic", source: b });
      } else {
        out.push({ kind: "wisdomStack", items: wisdom });
      }
      continue;
    }
    if (isAtomicTapSection(b)) {
      out.push({ kind: "atomic", source: b });
    } else {
      const sentences = splitProseIntoSentences(b);
      if (sentences.length) out.push({ kind: "prose", sentences });
    }
  }
  return out;
}
