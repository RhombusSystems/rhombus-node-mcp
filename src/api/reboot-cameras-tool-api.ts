import { postApi } from "../network/network.js";
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
      const response = await postApi<any>({
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

/**
 * Name and connection status (GREEN / YELLOW / ORANGE / RED, RED = disconnected) of each requested
 * camera, from the minimal state list the Console shows. A camera missing from that list (e.g. a
 * doorbell camera) is absent from the map; a failed lookup returns an empty map, which never blocks
 * a reboot.
 */
export async function getCameraConnections(
  cameraUuids: string[],
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<Map<string, { name?: string; connectionStatus?: string }>> {
  const connections = new Map<string, { name?: string; connectionStatus?: string }>();
  try {
    const response = await postApi<any>({
      route: "/camera/getMinimalCameraStateList",
      body: {},
      modifiers: requestModifiers,
      sessionId,
    });
    for (const state of response?.cameraStates ?? []) {
      if (state?.uuid && cameraUuids.includes(state.uuid)) {
        connections.set(state.uuid, {
          name: state.name ?? undefined,
          connectionStatus: state.connectionStatus ?? undefined,
        });
      }
    }
  } catch {
    // Lookup failure: fall through with what we have.
  }
  return connections;
}
