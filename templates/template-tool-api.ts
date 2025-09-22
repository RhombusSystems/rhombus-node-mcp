import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type { MyType } from "../types/NEW_TOOL_NAME-types.js";
import type { RequestModifiers } from "../util.js";

export async function getMyRequest(
  // TODO: ADD ADDITIONAL PARAMETERS
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<MyType> {
  // TODO: Fill in schema response type
  const res = await postApi<schema[""]>({
    route: "", // TODO: Fill in route
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(JSON.stringify(res));
  }


  return {
    // TODO: Fill in return type
  } satisfies MyType;
}