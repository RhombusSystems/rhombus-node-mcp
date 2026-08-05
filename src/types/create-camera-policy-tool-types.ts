import { z } from "zod";
import { schemas } from "./zod-schemas.js";
import { ActivityEnum } from "./schema.js";

export const ApiPayloadSchema = schemas.Policy_CreateCameraPolicyWSRequest;
export type ApiPayload = z.infer<typeof ApiPayloadSchema>;

export const OUTPUT_SCHEMA = z.object({
  needUserInput: z.boolean().optional(),
  message: z
    .string()
    .optional()
    .describe(
      "The message for this stage in the policy creation process.  This message will be displayed to the user."
    ),
  policyUuid: z
    .string()
    .optional()
    .describe("The UUID of the policy that was created during this workflow"),
  policyName: z
    .string()
    .optional()
    .describe("The name of the policy that was created during this workflow"),
});

// ---------------------------------------------------------------------------
// scheduleConfigs / cameraUuids parsing
//
// Both are free-form STRING params, so nothing machine-enforces their shape:
// tools are adapted for OpenAI with `strict: false`, and even under `strict:
// true` a string param's *contents* are never constrained. Every check has to
// live here, and every message has to name the field, the expected shape, and
// what was actually received — otherwise the model has nothing to correct and
// reports the whole workflow as broken (prod 2026-08-04).
// ---------------------------------------------------------------------------

/**
 * The activities the camera-policy workflow offers. This is a curated, camera-
 * relevant subset of the API's org-wide `ActivityEnum` — it is what we suggest,
 * NOT what we accept (validation goes against the full enum below, so a
 * legitimate activity the playbook happens not to list still works).
 *
 * Keep in sync with the option list in the private MCP's
 * `workflows/create-camera-policy.ts` playbook.
 */
export const SUGGESTED_CAMERA_ACTIVITIES = [
  "MOTION",
  "MOTION_HUMAN",
  "MOTION_CAR",
  "MOTION_ANIMAL",
  "FACE_ALERT",
  "FACE_UNIDENTIFIED",
  "LICENSEPLATE_ALERT",
  "HUMAN_ENTER",
  "HUMAN_EXIT",
  "CAR_ENTER",
  "CAR_EXIT",
  "POSE_ANOMALOUS",
  "POSE_FALL",
  "HELMET_MISSING",
  "MASK_MISSING",
  "GLOVES_MISSING",
  "VISUAL_TAMPER",
  "TAMPER",
  "PEOPLECOUNT_HIGH",
] as const;

const VALID_ACTIVITIES = new Set<string>(Object.values(ActivityEnum) as string[]);

export const SCHEDULE_CONFIGS_EXAMPLE =
  '[{"scheduleUuid":"Wq1nR0kBS9y_2hZpVvGkAA","activities":["MOTION_HUMAN","MOTION_CAR"]}]';

const SHAPE_HINT =
  `Expected a JSON array string of objects, each with a "scheduleUuid" string and an "activities" ` +
  `array of activity strings — e.g. ${SCHEDULE_CONFIGS_EXAMPLE}. "activities" must be a real JSON ` +
  `array, NOT a string containing one.`;

// Rhombus uuids are 22-char base64url. Deliberately loose — this only has to
// catch the model passing a human-readable NAME ("Business Hours", "Front Door")
// where a uuid belongs, which otherwise reaches the API and fails there, after
// the policy has already been created.
const UUID_LIKE = /^[A-Za-z0-9_-]{10,64}$/;

export type ScheduleConfig = { scheduleUuid: string; activities: string[] };

type ParseResult<T> = { ok: true; value: T } | { ok: false; message: string };

function quote(value: unknown): string {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  const text = serialized ?? String(value);
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

/**
 * Accept every unambiguous spelling of "a list of activities" the model
 * produces, and return null only when the value cannot be read as one.
 * Tolerated: a real array; a JSON-encoded array (the playbook tells the model to
 * JSON-encode structured values into the form context, and it then re-embeds the
 * encoded string); a comma-separated string; the API's own
 * `[{activity: "..."}]` trigger shape.
 */
function coerceActivities(raw: unknown): string[] | null {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        return coerceActivities(JSON.parse(trimmed));
      } catch {
        return null;
      }
    }
    return trimmed
      .split(",")
      .map(part => part.trim())
      .filter(Boolean);
  }
  if (Array.isArray(raw)) {
    const out: string[] = [];
    for (const item of raw) {
      if (typeof item === "string") {
        if (item.trim()) out.push(item.trim());
        continue;
      }
      if (item && typeof item === "object") {
        const activity = (item as Record<string, unknown>).activity;
        if (typeof activity === "string" && activity.trim()) {
          out.push(activity.trim());
          continue;
        }
      }
      return null;
    }
    return out;
  }
  return null;
}

function normalizeActivity(activity: string): string {
  return activity.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

/**
 * Parse the `scheduleConfigs` JSON string into the trigger configs. Runs BEFORE
 * any mutation so every failure here is safely retryable.
 */
export function parseScheduleConfigs(raw: string): ParseResult<ScheduleConfig[]> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return {
      ok: false,
      message:
        `scheduleConfigs is not valid JSON (${error instanceof Error ? error.message : "parse error"}). ` +
        SHAPE_HINT,
    };
  }

  // Unwrap double (or triple) encoding rather than failing on it.
  let unwrapAttempts = 0;
  while (typeof parsed === "string" && unwrapAttempts < 3) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return {
        ok: false,
        message: `scheduleConfigs decoded to a plain string ("${quote(parsed)}") rather than an array. ${SHAPE_HINT}`,
      };
    }
    unwrapAttempts++;
  }

  if (parsed === null || typeof parsed !== "object") {
    return {
      ok: false,
      message: `scheduleConfigs must be a JSON array; received ${parsed === null ? "null" : `a ${typeof parsed}`} (${quote(raw)}). ${SHAPE_HINT}`,
    };
  }

  // A single config object instead of a one-element array is unambiguous.
  const entries = Array.isArray(parsed) ? parsed : [parsed];

  const configs: ScheduleConfig[] = [];
  const issues: string[] = [];

  entries.forEach((entry, index) => {
    const label = `scheduleConfigs[${index}]`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      issues.push(`${label} is not an object (received ${quote(entry)})`);
      return;
    }
    const fields = entry as Record<string, unknown>;

    const scheduleUuidRaw = fields.scheduleUuid ?? fields.uuid ?? fields.schedule;
    if (typeof scheduleUuidRaw !== "string" || !scheduleUuidRaw.trim()) {
      issues.push(
        `${label}.scheduleUuid is missing or not a string (received ${quote(scheduleUuidRaw)})`
      );
      return;
    }
    const scheduleUuid = scheduleUuidRaw.trim();
    if (!UUID_LIKE.test(scheduleUuid)) {
      issues.push(
        `${label}.scheduleUuid "${scheduleUuid}" is not a UUID — pass the schedule's uuid, not its name`
      );
      return;
    }

    const activitiesRaw = fields.activities ?? fields.activity ?? fields.triggerSet;
    const activities = coerceActivities(activitiesRaw);
    if (activities === null) {
      issues.push(
        `${label}.activities must be an array of activity strings (received ${quote(activitiesRaw)})`
      );
      return;
    }
    if (activities.length === 0) {
      issues.push(`${label}.activities is empty — include at least one activity`);
      return;
    }

    const normalized = activities.map(normalizeActivity);
    const unsupported = normalized.filter(activity => !VALID_ACTIVITIES.has(activity));
    if (unsupported.length > 0) {
      issues.push(
        `${label}.activities contains ${unsupported.length === 1 ? "an unsupported value" : "unsupported values"} ` +
          `${unsupported.map(value => `"${value}"`).join(", ")} — supported camera activities are ` +
          `${SUGGESTED_CAMERA_ACTIVITIES.join(", ")}`
      );
      return;
    }

    configs.push({ scheduleUuid, activities: normalized });
  });

  if (issues.length > 0) {
    return { ok: false, message: `Invalid scheduleConfigs: ${issues.join("; ")}.` };
  }
  return { ok: true, value: configs };
}

/**
 * True when `scheduleConfigs` is present but carries no configs — the legacy
 * step-1 call passes an empty list, and the old `!== "[]"` string compare missed
 * every other spelling of empty ("[ ]", "[\n]", "\"[]\""), which fell through
 * into policy creation and could create a DUPLICATE policy.
 */
export function isEmptyScheduleConfigs(raw: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return false;
  }
  let unwrapAttempts = 0;
  while (typeof parsed === "string" && unwrapAttempts < 3) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return false;
    }
    unwrapAttempts++;
  }
  return Array.isArray(parsed) && parsed.length === 0;
}

/**
 * Parse `cameraUuids` (comma-separated, or a JSON array the model encoded
 * instead) into a uuid list. Runs BEFORE any mutation, for the same reason as
 * the schedule configs: an unparsed camera NAME reaches the API and fails only
 * after the policy exists, leaving a half-built policy behind.
 */
export function parseCameraUuids(raw: string): ParseResult<string[]> {
  let values: string[];
  const trimmed = raw.trim();

  if (trimmed.startsWith("[") || trimmed.startsWith('"[')) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return {
        ok: false,
        message: `cameraUuids looks like a JSON array but is not valid JSON (${quote(raw)}). Pass a comma-separated list of camera uuids, e.g. "uuidA,uuidB".`,
      };
    }
    let unwrapAttempts = 0;
    while (typeof parsed === "string" && unwrapAttempts < 3) {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        break;
      }
      unwrapAttempts++;
    }
    if (!Array.isArray(parsed) || parsed.some(item => typeof item !== "string")) {
      return {
        ok: false,
        message: `cameraUuids must be a comma-separated list of camera uuids, e.g. "uuidA,uuidB" (received ${quote(raw)}).`,
      };
    }
    values = (parsed as string[]).map(value => value.trim()).filter(Boolean);
  } else {
    values = trimmed
      .split(",")
      .map(value => value.trim())
      .filter(Boolean);
  }

  if (values.length === 0) {
    return {
      ok: false,
      message: `cameraUuids contained no camera uuids (received ${quote(raw)}). Pass a comma-separated list of camera uuids, e.g. "uuidA,uuidB".`,
    };
  }

  const invalid = values.filter(value => !UUID_LIKE.test(value));
  if (invalid.length > 0) {
    return {
      ok: false,
      message:
        `cameraUuids contains ${invalid.length === 1 ? "a value that is not a uuid" : "values that are not uuids"}: ` +
        `${invalid.map(value => `"${value}"`).join(", ")} — pass camera uuids, not camera names. ` +
        `Resolve names to uuids with an entity lookup first.`,
    };
  }

  return { ok: true, value: values };
}
