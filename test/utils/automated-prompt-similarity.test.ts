import { describe, expect, it } from "vitest";
import {
  findSimilarPrompt,
  promptSimilarity,
} from "../../src/utils/automated-prompt-similarity.js";

describe("automated prompt similarity", () => {
  it("rates a rephrased request as the same job and an unrelated one as different", () => {
    const a =
      "Every weekday, summarize all camera alerts and motion events from the previous 24 hours across the organization.";
    const b =
      "Give me a short summary of camera alerts and motion events from the previous 24 hours.\n\nResponse format guidance: concise Markdown";
    const c = "Weekly report of door badge events by person and door.";
    expect(promptSimilarity(a, b)).toBeGreaterThan(0.35);
    expect(promptSimilarity(a, c)).toBeLessThan(0.2);
  });

  it("needs the same cadence and recipients for a moderately similar prompt", () => {
    const existing = [
      {
        uuid: "x",
        prompt: "Summarize camera alerts and motion events from the previous 24 hours.",
        frequency: { frequency: 1, unit: "DAYS" },
        notifyUserUuids: ["u1"],
      },
    ];
    const candidate = {
      prompt: "Give me a short summary of camera alerts from the previous 24 hours.",
      frequencyValue: 1,
      frequencyUnit: "DAYS",
      notifyUserUuids: ["u1"],
    };
    expect(findSimilarPrompt(candidate, existing as never)?.existing.uuid).toBe("x");
    expect(
      findSimilarPrompt({ ...candidate, frequencyUnit: "WEEKS" }, existing as never)
    ).toBeUndefined();
    expect(
      findSimilarPrompt({ ...candidate, notifyUserUuids: ["u2"] }, existing as never)
    ).toBeUndefined();
  });
});
