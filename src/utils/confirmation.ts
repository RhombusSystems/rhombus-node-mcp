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
// nothing downstream has to escape it): "c2" + issue time (12 hex) + HMAC-SHA256
// truncated to 64 bits (16 hex) = 30 characters. The first format ("c1",
// 54 characters with an 8-hex nonce and a 128-bit signature) is still
// verified for ids in flight across a deploy. Shorter because the model copies
// the id by hand: one in eight live confirmations came back with the last 21
// characters of a 54-character id duplicated.
const TOKEN_VERSION = "c2";
const TS_HEX = 12;
const SIG_HEX = 16;
const TOKEN_LENGTH = TOKEN_VERSION.length + TS_HEX + SIG_HEX;
const LEGACY_VERSION = "c1";
const LEGACY_NONCE_HEX = 8;
const LEGACY_SIG_HEX = 32;
const LEGACY_TOKEN_LENGTH = LEGACY_VERSION.length + TS_HEX + LEGACY_NONCE_HEX + LEGACY_SIG_HEX;

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

function signature(
  version: string,
  issuedAt: string,
  nonce: string,
  digest: string,
  key: Buffer,
  sigHex: number
): string {
  return createHmac("sha256", key)
    .update(`${version}.${issuedAt}.${nonce}.${digest}`)
    .digest("hex")
    .slice(0, sigHex);
}

/** Mint a confirmation id for `action`, valid for the caller for CONFIRMATION_MAX_AGE_MS. */
export function issueConfirmationId(action: ConfirmationAction, now: number = Date.now()): string {
  const issuedAt = now.toString(16).padStart(TS_HEX, "0");
  return `${TOKEN_VERSION}${issuedAt}${signature(TOKEN_VERSION, issuedAt, "", actionDigest(action), keyMaterial(), SIG_HEX)}`;
}

/**
 * True when `confirmationId` was issued for exactly this action by this
 * deployment and has not expired. Only the token's own length is read: a
 * model that appends stray characters when copying the id (observed: the
 * last 21 characters duplicated) still confirms, since the signature covers
 * everything that matters.
 */
export function verifyConfirmationId(
  confirmationId: string | null | undefined,
  action: ConfirmationAction,
  now: number = Date.now()
): boolean {
  if (!confirmationId) return false;
  const layout = confirmationId.startsWith(TOKEN_VERSION)
    ? { version: TOKEN_VERSION, nonceHex: 0, sigHex: SIG_HEX, length: TOKEN_LENGTH }
    : confirmationId.startsWith(LEGACY_VERSION)
      ? {
          version: LEGACY_VERSION,
          nonceHex: LEGACY_NONCE_HEX,
          sigHex: LEGACY_SIG_HEX,
          length: LEGACY_TOKEN_LENGTH,
        }
      : undefined;
  if (!layout || confirmationId.length < layout.length) return false;
  const token = confirmationId.slice(0, layout.length);
  if (!/^[0-9a-f]+$/.test(token.slice(layout.version.length))) return false;
  let at = layout.version.length;
  const issuedAt = token.slice(at, (at += TS_HEX));
  const nonce = token.slice(at, (at += layout.nonceHex));
  const provided = token.slice(at);
  const issuedAtMs = parseInt(issuedAt, 16);
  if (
    !Number.isFinite(issuedAtMs) ||
    now - issuedAtMs > CONFIRMATION_MAX_AGE_MS ||
    issuedAtMs - now > 60_000
  ) {
    return false;
  }
  const expected = Buffer.from(
    signature(layout.version, issuedAt, nonce, actionDigest(action), keyMaterial(), layout.sigHex),
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
