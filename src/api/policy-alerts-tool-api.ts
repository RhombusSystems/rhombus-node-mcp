import { postApi } from "../network.js";
import { RequestModifiers } from "../util.js";
import { ToolArgs } from "../types/policy-alerts-tool-types.js";

export async function getPolicyAlerts(
  args: ToolArgs,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  return await postApi({
    route: "/event/getPolicyAlertsV2",
    body: args,
    modifiers: requestModifiers,
    sessionId,
  });
}
