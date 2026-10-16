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
    expect(id).toMatch(/^c2[0-9a-f]{28}$/); // one short plain word: the model copies it by hand
    const flipped = id.slice(0, -1) + (id.endsWith("0") ? "1" : "0");
    expect(verifyConfirmationId(flipped, action)).toBe(false);
    expect(verifyConfirmationId(id.slice(0, -1), action)).toBe(false);
    expect(verifyConfirmationId("AbCdEfGh", action)).toBe(false); // the original 8-char store key
    expect(verifyConfirmationId("", action)).toBe(false);
    expect(verifyConfirmationId(null, action)).toBe(false);
  });

  // A client that confirmed through its own form first passed that form's key as the
  // confirmationId; it must re-ask (never act), and the ask must steer toward ONE plain question.
  it("treats a form key as no confirmation and asks for one plain yes/no", () => {
    const result = requireConfirmation("Xk3vT9qLQe2mA7pZr1sYwB:0", action);
    expect(isConfirmed(result)).toBe(false);
    const description = JSON.parse((result as { content: { text: string }[] }).content[0].text)
      .description as string;
    expect(description).toMatch(/one plain yes\/no question \(no form\)/);
    expect(isConfirmed(requireConfirmation(issuedId(result), action))).toBe(true);
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

  it("accepts an id the model padded with stray characters, but not a shortened one", () => {
    const id = issueConfirmationId(action);
    expect(verifyConfirmationId(id + id.slice(-21), action)).toBe(true); // observed live: last 21 chars duplicated
    expect(verifyConfirmationId(id + " ", action)).toBe(true);
    expect(verifyConfirmationId(id.slice(0, -1), action)).toBe(false);
  });

  it("still verifies an in-flight first-format (c1) id issued before the format change", () => {
    // Re-create a c1 token the way the previous build issued it.
    const { createHmac, createHash } = require("node:crypto") as typeof import("node:crypto");
    const issuedAt = Date.now().toString(16).padStart(12, "0");
    const nonce = "0123abcd";
    const canonical = '{"cameraUuids":["cam-a","cam-b"]}';
    const digest = createHash("sha256").update(`reboot-cameras\n${canonical}`).digest("hex");
    const key = Buffer.from(`confirmation:${process.env.CONFIRMATION_SECRET}`, "utf8");
    const sig = createHmac("sha256", key)
      .update(`c1.${issuedAt}.${nonce}.${digest}`)
      .digest("hex")
      .slice(0, 32);
    const legacy = `c1${issuedAt}${nonce}${sig}`;
    expect(legacy).toHaveLength(54);
    expect(verifyConfirmationId(legacy, action)).toBe(true);
    expect(
      verifyConfirmationId(legacy, { tool: "reboot-cameras", args: { cameraUuids: ["cam-a"] } })
    ).toBe(false);
  });
});
