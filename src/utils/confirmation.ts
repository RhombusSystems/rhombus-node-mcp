/**
 * Confirmation is an important flow for our MCP, as letting an AI perform tools that change and mutate can be potentially dangerous.
 *
 * A confirmation id is a self-validating token, not an entry in a per-process map. The server runs stateless behind a
 * load balancer with several instances, and the two halves of a confirmation — the call that asks and the call that
 * confirms — are separate requests that can land on different instances. An in-memory store never saw the id on the
 * second instance and demanded a fresh confirmation every time, so a confirmed action could not be performed at all in a
 * multi-instance deployment.
 *
 * The token is an HMAC over its issue time, a nonce and the action it confirms (tool name + arguments), keyed by a
 * deployment-wide secret that every instance holds and the model never sees, so the model cannot mint a token without
 * going through the ask. The key is CONFIRMATION_SECRET when set; otherwise OPENAI_API_KEY, which the chatbot hands its
 * bundled MCP server on every instance (a secret is only HMAC key material here, never exposed); otherwise the
 * single-user RHOMBUS_API_KEY; otherwise a per-process random key for a lone local process. The caller's own request
 * credential is deliberately NOT used: the chatbot mints a fresh session per turn, so a token issued on one turn would
 * never validate on the next. A token is valid for 15 minutes and only for the exact action it was issued for.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { createToolTextContent } from "../util.js";
import { logger } from "../logger.js";

export const CONFIRMATION_ARGS = {
  confirmationId: z
    .string()
    .nullable()
    .describe(
      'null on the first call. On the confirming call, exactly the id this tool returned (it starts with "c1"). Never a form key or any other value.'
    ),
};

export function addConfirmationParams<TInputArgs extends object>(
  args: TInputArgs
): TInputArgs & typeof CONFIRMATION_ARGS {
  return {
    ...args,
    ...CONFIRMATION_ARGS,
  };
}

/** The action a confirmation is bound to: the tool and the arguments it will run with. */
export type ConfirmationAction = {
  tool: string;
  args?: unknown;
};

export const CONFIRMATION_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

// Token layout (one alphanumeric word, so the model echoes it intact and
// nothing downstream has to escape it): "c1" + issue time (12 hex) + nonce
// (8 hex) + HMAC-SHA256 truncated to 128 bits (32 hex) = 54 characters.
const TOKEN_VERSION = "c1";
const TS_HEX = 12;
const NONCE_HEX = 8;
const SIG_HEX = 32;
const TOKEN_LENGTH = TOKEN_VERSION.length + TS_HEX + NONCE_HEX + SIG_HEX;

// Lone local process with no secret at all: a per-process key is all it needs.
const processFallbackKey = randomBytes(32);

/** Deployment-wide HMAC key material; see the module doc for the precedence. */
function keyMaterial(): Buffer {
  const secret =
    process.env.CONFIRMATION_SECRET || process.env.OPENAI_API_KEY || process.env.RHOMBUS_API_KEY;
  return secret ? Buffer.from(`confirmation:${secret}`, "utf8") : processFallbackKey;
}

/**
 * Stable serialization of the arguments: object keys sorted, arrays of
 * primitives sorted (the same cameras in another order are the same action),
 * and the confirmation id itself left out.
 */
function canonical(value: unknown): string {
  if (Array.isArray(value)) {
    const items = value.map(canonical);
    const primitives = value.every(v => v === null || typeof v !== "object");
    return `[${(primitives ? items.sort() : items).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .filter(k => k !== "confirmationId")
      .sort()
      .map(k => `${JSON.stringify(k)}:${canonical(record[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

function actionDigest(action: ConfirmationAction): string {
  return createHash("sha256")
    .update(`${action.tool}\n${canonical(action.args ?? null)}`)
    .digest("hex");
}

function signature(issuedAt: string, nonce: string, digest: string, key: Buffer): string {
  return createHmac("sha256", key)
    .update(`${TOKEN_VERSION}.${issuedAt}.${nonce}.${digest}`)
    .digest("hex")
    .slice(0, SIG_HEX);
}

/** Mint a confirmation id for `action`, valid for the caller for CONFIRMATION_MAX_AGE_MS. */
export function issueConfirmationId(action: ConfirmationAction, now: number = Date.now()): string {
  const issuedAt = now.toString(16).padStart(TS_HEX, "0");
  const nonce = randomBytes(NONCE_HEX / 2).toString("hex");
  return `${TOKEN_VERSION}${issuedAt}${nonce}${signature(issuedAt, nonce, actionDigest(action), keyMaterial())}`;
}

// Longest input searched for an embedded id; anything longer is rejected outright.
const MAX_CONFIRMATION_INPUT = 512;

/**
 * Every id-shaped substring of `value`, in order. Models occasionally mangle an id while copying it
 * back — a repeated chunk appended, the id wrapped in other text — and the signature check, not the
 * surrounding characters, is what proves the id was issued for this action.
 */
function idCandidates(value: string): string[] {
  if (value.length > MAX_CONFIRMATION_INPUT) return [];
  const out: string[] = [];
  for (let i = value.indexOf(TOKEN_VERSION); i !== -1; i = value.indexOf(TOKEN_VERSION, i + 1)) {
    if (i + TOKEN_LENGTH > value.length) break;
    out.push(value.slice(i, i + TOKEN_LENGTH));
  }
  return out;
}

/**
 * True when `confirmationId` contains an id this caller issued for exactly this action that has not
 * expired. A valid id surrounded by extra characters still confirms; a tampered, truncated or
 * foreign id never does.
 */
export function verifyConfirmationId(
  confirmationId: string | null | undefined,
  action: ConfirmationAction,
  now: number = Date.now()
): boolean {
  if (!confirmationId) return false;
  return idCandidates(confirmationId).some(candidate => verifyExactId(candidate, action, now));
}

function verifyExactId(confirmationId: string, action: ConfirmationAction, now: number): boolean {
  if (confirmationId.length !== TOKEN_LENGTH || !confirmationId.startsWith(TOKEN_VERSION)) {
    return false;
  }
  if (!/^[0-9a-f]+$/.test(confirmationId.slice(TOKEN_VERSION.length))) return false;
  let at = TOKEN_VERSION.length;
  const issuedAt = confirmationId.slice(at, (at += TS_HEX));
  const nonce = confirmationId.slice(at, (at += NONCE_HEX));
  const provided = confirmationId.slice(at);
  const issuedAtMs = parseInt(issuedAt, 16);
  if (
    !Number.isFinite(issuedAtMs) ||
    now - issuedAtMs > CONFIRMATION_MAX_AGE_MS ||
    issuedAtMs - now > 60_000
  ) {
    return false;
  }
  const expected = Buffer.from(
    signature(issuedAt, nonce, actionDigest(action), keyMaterial()),
    "utf8"
  );
  const given = Buffer.from(provided, "utf8");
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/**
 * Gate for a mutating tool. Returns `true` when `confirmationId` confirms
 * `action`; otherwise returns the tool result that asks the model to get the
 * user's confirmation and call again with the issued id.
 *
 * `action` binds the id to the tool and its arguments; a tool that omits it
 * gets an id bound to the tool name only.
 */
export function requireConfirmation(
  confirmationId: string | null | undefined,
  action: ConfirmationAction = { tool: "" }
) {
  logger.log("Checking for confirmationId:", confirmationId);
  if (verifyConfirmationId(confirmationId, action)) return true;

  const newId = issueConfirmationId(action);
  return createToolTextContent(
    JSON.stringify({
      needUserInput: true,
      description: `Ask the user to confirm this action with one plain yes/no question (no form). When they agree, call this tool again with the same arguments and the confirmation id: ${newId} (valid for 15 minutes, for this action only)`,
    })
  );
}

export function isConfirmed(confirmation: ReturnType<typeof requireConfirmation>) {
  return confirmation === true;
}
