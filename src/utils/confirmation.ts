/**
 * Confirmation is an important flow for our MCP, as letting an AI perform tools that change and mutate can be potentially dangerous
 */

import { z } from "zod";
import { createToolTextContent, generateRandomString } from "../util.js";
import { logger } from "../logger.js";

// export function createToolArgs<TArgs extends object>(args: TArgs): TArgs & typeof STATIC_ARGS {
//     return {
//       ...args,
//       ...STATIC_ARGS,
//     };
//   }

export const CONFIRMATION_ARGS = {
  confirmationId: z.string().nullable(),
};

export function addConfirmationParams<TInputArgs extends object>(
  args: TInputArgs
): TInputArgs & typeof CONFIRMATION_ARGS {
  return {
    ...args,
    ...CONFIRMATION_ARGS,
  };
}

// IN MEMORY
const confirmationStore = new Map<string, number>();
const CONFIRMATION_MAX_AGE = 15 * 60 * 1000; // 15 minutes

export function requireConfirmation(confirmationId: string | null) {
  // remove any old confirmations
  for (const entry of confirmationStore) {
    if (Date.now() - entry[1] > CONFIRMATION_MAX_AGE) confirmationStore.delete(entry[0]);
  }

  logger.log("Checking for confirmationId:", confirmationId);

  if (!confirmationId || !confirmationStore.has(confirmationId ?? "")) {
    const newId = generateRandomString(8);
    confirmationStore.set(newId, Date.now());

    return createToolTextContent(
      JSON.stringify({
        needUserInput: true,
        description: `Please request confirmation for the user for performing this action. Upon confirmation, call this tool again with the confirmation id: ${newId}`,
      })
    );
  }

  confirmationStore.delete(confirmationId);
  return true;
}

export function isConfirmed(confirmation: ReturnType<typeof requireConfirmation>) {
  return confirmation === true;
}