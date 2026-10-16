import { afterEach, describe, expect, it, vi } from "vitest";
import { requestAuthContext } from "../auth-context.js";
import {
  CONFIRMATION_MAX_AGE_MS,
  isConfirmed,
  issueConfirmationId,
  requireConfirmation,
  verifyConfirmationId,
} from "./confirmation.js";

const action = { tool: "reboot-cameras", args: { cameraUuids: ["cam-a", "cam-b"] } };
const asCaller = <T>(credential: string, fn: () => T): T =>
  requestAuthContext.run({ apiKey: credential }, fn);

/** The confirmation id a tool result asks the model to echo back. */
function issuedId(result: ReturnType<typeof requireConfirmation>): string {
  if (result === true) throw new Error("expected a confirmation request");
  const text = (result.content[0] as { text: string }).text;
  const match = /confirmation id: (\S+)/.exec(JSON.parse(text).description);
  if (!match) throw new Error(`no id in ${text}`);
  return match[1];
}

afterEach(() => {
  vi.useRealTimers();
});

describe("confirmation ids", () => {
  it("asks first, then accepts the issued id for the same caller and action", () => {
    asCaller("key-1", () => {
      const ask = requireConfirmation(null, action);
      expect(isConfirmed(ask)).toBe(false);
      expect(isConfirmed(requireConfirmation(issuedId(ask), action))).toBe(true);
    });
  });

  it("validates on another instance: nothing is remembered in the process", async () => {
    const id = asCaller("key-1", () => issueConfirmationId(action));
    // A fresh module graph stands in for another server instance: its own
    // request context and its own per-process fallback key.
    vi.resetModules();
    const fresh = await import("./confirmation.js");
    const freshAuth = await import("../auth-context.js");
    expect(
      freshAuth.requestAuthContext.run({ apiKey: "key-1" }, () =>
        fresh.verifyConfirmationId(id, action)
      )
    ).toBe(true);
    expect(
      freshAuth.requestAuthContext.run({ apiKey: "key-2" }, () =>
        fresh.verifyConfirmationId(id, action)
      )
    ).toBe(false);
  });

  it("is bound to the action: other cameras, another tool, or a reordered list", () => {
    asCaller("key-1", () => {
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
  });

  it("is bound to the caller's credential", () => {
    const id = asCaller("key-1", () => issueConfirmationId(action));
    expect(asCaller("key-2", () => verifyConfirmationId(id, action))).toBe(false);
    expect(
      requestAuthContext.run({ sessionId: "s", latestRecordUuid: "r" }, () =>
        verifyConfirmationId(id, action)
      )
    ).toBe(false);
  });

  it("expires after 15 minutes and never accepts a future-dated id", () => {
    asCaller("key-1", () => {
      const now = Date.now();
      const id = issueConfirmationId(action, now);
      expect(verifyConfirmationId(id, action, now + CONFIRMATION_MAX_AGE_MS - 1000)).toBe(true);
      expect(verifyConfirmationId(id, action, now + CONFIRMATION_MAX_AGE_MS + 1000)).toBe(false);
      expect(verifyConfirmationId(issueConfirmationId(action, now + 5 * 60_000), action, now)).toBe(
        false
      );
    });
  });

  it("rejects tampered, truncated and legacy-shaped ids", () => {
    asCaller("key-1", () => {
      const id = issueConfirmationId(action);
      expect(id).toMatch(/^c1[0-9a-f]{52}$/); // one plain word: the model echoes it verbatim
      const flipped = id.slice(0, -1) + (id.endsWith("0") ? "1" : "0");
      expect(verifyConfirmationId(flipped, action)).toBe(false);
      expect(verifyConfirmationId(id.slice(0, -1), action)).toBe(false);
      expect(verifyConfirmationId("AbCdEfGh", action)).toBe(false); // the old 8-char store key
      expect(verifyConfirmationId("", action)).toBe(false);
      expect(verifyConfirmationId(null, action)).toBe(false);
    });
  });

  it("re-asks with a new id when the given id does not confirm the action", () => {
    asCaller("key-1", () => {
      const stale = issueConfirmationId({
        tool: "reboot-cameras",
        args: { cameraUuids: ["other"] },
      });
      const result = requireConfirmation(stale, action);
      expect(isConfirmed(result)).toBe(false);
      expect(issuedId(result)).not.toBe(stale);
    });
  });

  it("without any credential falls back to a per-process key and still round-trips", () => {
    const saved = process.env.RHOMBUS_API_KEY;
    delete process.env.RHOMBUS_API_KEY;
    try {
      const id = issueConfirmationId(action);
      expect(verifyConfirmationId(id, action)).toBe(true);
    } finally {
      if (saved !== undefined) process.env.RHOMBUS_API_KEY = saved;
    }
  });
});
