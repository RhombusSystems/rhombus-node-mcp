import type { AutomatedPromptSummary } from "../types/automated-prompts-tool-types.js";

/**
 * Near-duplicate detection for automated prompts.
 *
 * Users rephrase a request ("every weekday at 9 AM, email me a summary…") and
 * the model happily creates a second schedule next to the first, so the user
 * ends up with two emails a day and no idea why. Before creating, the tool
 * compares the new prompt with the org's existing ones and asks the user
 * when one looks like the same job.
 */

const STOPWORDS = new Set(
  "a an and are as at be by for from give has have i if in into is it its me my of on or our over please that the this to us we with you your".split(
    " "
  )
);

/** Everything after the folded response guidance belongs to formatting, not to the task. */
function taskText(prompt: string): string {
  const cut = prompt.indexOf("Response format guidance:");
  return cut >= 0 ? prompt.slice(0, cut) : prompt;
}

export function promptTokens(prompt: string): Set<string> {
  return new Set(
    taskText(prompt)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOPWORDS.has(w))
  );
}

/** Jaccard similarity of the two prompts' task vocabularies, 0..1. */
export function promptSimilarity(a: string, b: string): number {
  const ta = promptTokens(a);
  const tb = promptTokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let shared = 0;
  for (const w of ta) if (tb.has(w)) shared++;
  return shared / (ta.size + tb.size - shared);
}

export type NewPromptShape = {
  prompt: string;
  frequencyValue?: number | null;
  frequencyUnit?: string | null;
  notifyUserUuids?: string[] | null;
};

const sameSet = (
  a: readonly string[] | null | undefined,
  b: readonly string[] | null | undefined
) => {
  const sa = new Set(a ?? []);
  const sb = new Set(b ?? []);
  return sa.size === sb.size && [...sa].every(x => sb.has(x));
};

/**
 * The existing prompt that looks like the same job as `candidate`, if any:
 * a near-identical task text, or a fairly similar one on the same cadence
 * to the same recipients.
 */
export function findSimilarPrompt(
  candidate: NewPromptShape,
  existing: readonly AutomatedPromptSummary[]
): { existing: AutomatedPromptSummary; similarity: number } | undefined {
  let best: { existing: AutomatedPromptSummary; similarity: number } | undefined;
  for (const e of existing) {
    if (!e.prompt) continue;
    const similarity = promptSimilarity(candidate.prompt, e.prompt);
    const sameCadence =
      e.frequency?.unit === candidate.frequencyUnit &&
      Number(e.frequency?.frequency) === Number(candidate.frequencyValue);
    const sameRecipients = sameSet(e.notifyUserUuids, candidate.notifyUserUuids);
    const duplicate = similarity >= 0.6 || (similarity >= 0.35 && sameCadence && sameRecipients);
    if (duplicate && (!best || similarity > best.similarity)) best = { existing: e, similarity };
  }
  return best;
}
