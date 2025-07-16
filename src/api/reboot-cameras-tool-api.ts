import { postApi } from "../network.js";
import { RequestModifiers } from "../util.js";

export async function rebootCameras(
  cameraUuids: string[],
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  let successCount = 0;
  let errorCount = 0;
  for (const cameraUuid of cameraUuids) {
    try {
      const body = { cameraUuid };
      const response = await postApi({
        route: "/camera/reboot",
        body,
        modifiers: requestModifiers,
        sessionId,
      });
      if (response.error) {
        errorCount++;
      } else {
        successCount++;
      }
    } catch (error) {
      const ret = `Error rebooting cameras: ${error}`;
      return { error: true, status: ret };
    }
  }

  let status;
  if (successCount === cameraUuids.length) status = "SUCCESS";
  else if (successCount > 0 && successCount < cameraUuids.length) status = "PARTIAL_SUCCESS";
  else status = "ERROR";

  return { status, successCount, errorCount };
}
