import { postApi } from "../network.js";
import { RequestModifiers } from "../util.js";
import { ApiPayload } from "../types/create-camera-policy-tool-types.js";
import { components } from "../types/schema-components.js";
import schema from "../types/schema.js";

export async function createCameraPolicy(
  args: ApiPayload,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  return await postApi<schema["Policy_CreateCameraPolicyWSResponse"]>({
    route: "/policy/createCameraPolicy",
    body: args,
    modifiers: requestModifiers,
    sessionId,
  });
}
