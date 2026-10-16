import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONFIRMATION_MAX_AGE_MS,
  isConfirmed,
  issueConfirmationId,
  requireConfirmation,
  verifyConfirmationId,
} from "./confirmation.js";

const action = { tool: "reboot-cameras", args: { cameraUuids: ["cam-a", "cam-b"] } };
const SECRET_VARS = ["CONFIRMATION_SECRET", "OPENAI_API_KEY", "RHOMBUS_API_KEY"] as const;
const savedEnv: Partial<Record<(typeof SECRET_VARS)[number], string | undefined>> = {};

/** The confirmation id a tool result asks the model to echo back. */
function issuedId(result: ReturnType<typeof requireConfirmation>): string {
  if (result === true) throw new Error("expected a confirmation request");
  const text = (result.content[0] as { text: string }).text;
  const match = /confirmation id: (\w+)/.exec(JSON.parse(text).description);
  if (!match) throw new Error(`no id in ${text}`);
  return match[1];
}

beforeEach(() => {
  for (const name of SECRET_VARS) {
    savedEnv[name] = process.env[name];
    delete process.env[name];
  }
  process.env.CONFIRMATION_SECRET = "deployment-secret-1";
});

afterEach(() => {
  vi.useRealTimers();
  for (const name of SECRET_VARS) {
    if (savedEnv[name] === undefined) delete process.env[name];
    else process.env[name] = savedEnv[name];
  }
});

describe("confirmation ids", () => {
  it("asks first, then accepts the issued id for the same action on a later turn", () => {
    const ask = requireConfirmation(null, action);
    expect(isConfirmed(ask)).toBe(false);
    expect(isConfirmed(requireConfirmation(issuedId(ask), action))).toBe(true);
  });

  it("validates on another instance of the same deployment: nothing is remembered in the process", async () => {
    const id = issueConfirmationId(action);
    // A fresh module graph stands in for another server instance: its own
    // per-process fallback key, the same deployment secret.
    vi.resetModules();
    const fresh = await import("./confirmation.js");
    expect(fresh.verifyConfirmationId(id, action)).toBe(true);
  });

  it("is bound to the action: other cameras, another tool, or a reordered list", () => {
    const id = issueConfirmationId(action);
    expect(
      verifyConfirmationId(id, { tool: "reboot-cameras", args: { cameraUuids: ["cam-a"] } })
    ).toBe(false);
    expect(verifyConfirmationId(id, { tool: "delete-cameras", args: action.args })).toBe(false);
    // Same cameras in another order are the same action.
    expect(
      verifyConfirmationId(id, {
        tool: "reboot-cameras",
        args: { cameraUuids: ["cam-b", "cam-a"] },
      })
    ).toBe(true);
    // The echoed confirmationId itself never changes the action.
    expect(
      verifyConfirmationId(id, {
        tool: "reboot-cameras",
        args: { ...action.args, confirmationId: id },
      })
    ).toBe(true);
  });

  it("is bound to the deployment secret, with OPENAI_API_KEY and RHOMBUS_API_KEY as fallbacks", () => {
    const id = issueConfirmationId(action);
    process.env.CONFIRMATION_SECRET = "another-deployment";
    expect(verifyConfirmationId(id, action)).toBe(false);

    delete process.env.CONFIRMATION_SECRET;
    process.env.OPENAI_API_KEY = "openai-key";
    const viaOpenAi = issueConfirmationId(action);
    expect(verifyConfirmationId(viaOpenAi, action)).toBe(true);
    expect(verifyConfirmationId(id, action)).toBe(false);

    delete process.env.OPENAI_API_KEY;
    process.env.RHOMBUS_API_KEY = "rhombus-key";
    expect(verifyConfirmationId(issueConfirmationId(action), action)).toBe(true);
    expect(verifyConfirmationId(viaOpenAi, action)).toBe(false);
  });

  it("expires after 15 minutes and never accepts a future-dated id", () => {
    const now = Date.now();
    const id = issueConfirmationId(action, now);
    expect(verifyConfirmationId(id, action, now + CONFIRMATION_MAX_AGE_MS - 1000)).toBe(true);
    expect(verifyConfirmationId(id, action, now + CONFIRMATION_MAX_AGE_MS + 1000)).toBe(false);
    expect(verifyConfirmationId(issueConfirmationId(action, now + 5 * 60_000), action, now)).toBe(
      false
    );
  });

  it("rejects tampered, truncated and legacy-shaped ids", () => {
    const id = issueConfirmationId(action);
    expect(id).toMatch(/^c1[0-9a-f]{52}$/); // one plain word: the model echoes it verbatim
    const flipped = id.slice(0, -1) + (id.endsWith("0") ? "1" : "0");
    expect(verifyConfirmationId(flipped, action)).toBe(false);
    expect(verifyConfirmationId(id.slice(0, -1), action)).toBe(false);
    expect(verifyConfirmationId("AbCdEfGh", action)).toBe(false); // the old 8-char store key
    expect(verifyConfirmationId("", action)).toBe(false);
    expect(verifyConfirmationId(null, action)).toBe(false);
  });

  it("re-asks with a new id when the given id does not confirm the action", () => {
    const stale = issueConfirmationId({ tool: "reboot-cameras", args: { cameraUuids: ["other"] } });
    const result = requireConfirmation(stale, action);
    expect(isConfirmed(result)).toBe(false);
    expect(issuedId(result)).not.toBe(stale);
  });

  it("without any secret falls back to a per-process key and still round-trips", () => {
    delete process.env.CONFIRMATION_SECRET;
    const id = issueConfirmationId(action);
    expect(verifyConfirmationId(id, action)).toBe(true);
  });
});
