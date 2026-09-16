import { logger } from "../logger.js";
import { postApi } from "../network/network.js";
import { cachedPostApi } from "../network/org-reference-cache.js";
import { UptimeSource } from "../types/camera-uptime-tool-types.js";
import type { schema } from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

type UptimeWindow = schema["TimeWindowSeconds"];

interface CameraUptimeResult {
  cameraUuid: string;
  cameraName?: string;
  locationUuid?: string;
  uptimeSource: UptimeSource;
  totalPeriodSeconds: number;
  /*
   * Omitted entirely when uptimeSource is UNAVAILABLE. A missing number is
   * "we don't know"; emitting 0 here would be read as "down the whole time",
   * which is the exact confusion this field exists to prevent.
   */
  totalUptimeSeconds?: number;
  uptimePercentage?: number;
  outageCount?: number;
  longestOutageSeconds?: number;
}

/*
 * Read the uptime source off a webservice response.
 *
 * A webservice that predates UptimeSourceEnum sends nothing here. Treat that
 * as HARDWARE so behaviour against an older server is unchanged - only a
 * server that explicitly says UNAVAILABLE makes us report "unknown".
 */
function readUptimeSource(value: unknown): UptimeSource {
  switch (value) {
    case UptimeSource.MEDIA_PRESENCE:
      return UptimeSource.MEDIA_PRESENCE;
    case UptimeSource.UNAVAILABLE:
      return UptimeSource.UNAVAILABLE;
    case UptimeSource.HARDWARE:
      return UptimeSource.HARDWARE;
    default:
      return UptimeSource.HARDWARE;
  }
}

function computeUptimeStats(
  cameraUuid: string,
  cameraName: string | undefined,
  locationUuid: string | undefined,
  windows: UptimeWindow[],
  startTimeSec: number,
  endTimeSec: number,
  uptimeSource: UptimeSource
): CameraUptimeResult {
  const totalPeriodSeconds = endTimeSec - startTimeSec;

  if (uptimeSource === UptimeSource.UNAVAILABLE) {
    return { cameraUuid, cameraName, locationUuid, uptimeSource, totalPeriodSeconds };
  }

  let totalUptimeSeconds = 0;

  const sortedWindows = windows
    .filter(w => w.startSeconds != null && w.durationSeconds != null)
    .sort((a, b) => (a.startSeconds ?? 0) - (b.startSeconds ?? 0));

  for (const w of sortedWindows) {
    const wStart = Math.max(w.startSeconds!, startTimeSec);
    const wEnd = Math.min(w.startSeconds! + w.durationSeconds!, endTimeSec);
    if (wEnd > wStart) {
      totalUptimeSeconds += wEnd - wStart;
    }
  }

  let outageCount = 0;
  let longestOutageSeconds = 0;
  let lastEnd = startTimeSec;

  for (const w of sortedWindows) {
    const wStart = Math.max(w.startSeconds!, startTimeSec);
    if (wStart > lastEnd) {
      outageCount++;
      longestOutageSeconds = Math.max(longestOutageSeconds, wStart - lastEnd);
    }
    const wEnd = Math.min(w.startSeconds! + w.durationSeconds!, endTimeSec);
    lastEnd = Math.max(lastEnd, wEnd);
  }
  if (lastEnd < endTimeSec) {
    outageCount++;
    longestOutageSeconds = Math.max(longestOutageSeconds, endTimeSec - lastEnd);
  }

  const uptimePercentage =
    totalPeriodSeconds > 0
      ? Math.round((totalUptimeSeconds / totalPeriodSeconds) * 10000) / 100
      : 0;

  return {
    cameraUuid,
    cameraName,
    locationUuid,
    uptimeSource,
    totalUptimeSeconds,
    totalPeriodSeconds,
    uptimePercentage,
    outageCount,
    longestOutageSeconds,
  };
}

export async function getCameraUptime(
  cameraUuid: string,
  startTimeSec: number,
  endTimeSec: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<CameraUptimeResult> {
  const res = await postApi<schema["Camera_GetUptimeWindowsWSResponse"]>({
    route: "/camera/getUptimeWindows",
    body: {
      cameraUuid,
      // The endpoint takes MILLISECONDS despite its (formerly wrong) swagger
      // docs saying seconds — passing seconds makes the server clamp the
      // range away entirely and return zero windows for every camera.
      startTime: startTimeSec * 1000,
      endTime: endTimeSec * 1000,
    } satisfies schema["Camera_GetUptimeWindowsWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.errorMsg ?? "Failed to get camera uptime windows");
  }

  return computeUptimeStats(
    cameraUuid,
    undefined,
    undefined,
    (res.uptimeWindows ?? []) as UptimeWindow[],
    startTimeSec,
    endTimeSec,
    // Cast until the generated schema carries uptimeSource; readUptimeSource
    // validates whatever actually arrives.
    readUptimeSource((res as { uptimeSource?: unknown }).uptimeSource)
  );
}

interface FleetUptimeEntry {
  windows: UptimeWindow[];
  uptimeSource: UptimeSource;
}

async function getFleetUptimeWindowsForOrg(
  startTimeSec: number,
  endTimeSec: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<Map<string, FleetUptimeEntry> | null> {
  const res = await postApi<schema["Common_devices_GetUptimeWindowsForOrgWSResponse"]>({
    route: "/camera/getUptimeWindowsForOrg",
    body: {
      startTimeMs: startTimeSec * 1000,
      endTimeMs: endTimeSec * 1000,
    },
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error || !Array.isArray(res.uptimeByDevice)) {
    // Most likely an older webservice without the batch route yet.
    logger.warn(
      `getUptimeWindowsForOrg unavailable (${res.status ?? "no uptimeByDevice in response"}); falling back to per-camera fan-out`
    );
    return null;
  }

  const windowsByCamera = new Map<string, FleetUptimeEntry>();
  for (const entry of res.uptimeByDevice) {
    if (entry?.deviceUuid) {
      windowsByCamera.set(entry.deviceUuid, {
        windows: entry.uptimeWindows ?? [],
        uptimeSource: readUptimeSource((entry as { uptimeSource?: unknown }).uptimeSource),
      });
    }
  }
  return windowsByCamera;
}

export async function getFleetUptime(
  startTimeSec: number,
  endTimeSec: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{
  cameras: CameraUptimeResult[];
  summary: {
    totalCameras: number;
    camerasWithKnownUptime: number;
    camerasWithUnknownUptime: number;
    averageUptimePercentage: number;
    worstCamera?: string;
    worstUptimePercentage?: number;
  };
}> {
  const cameraListRes = await cachedPostApi<any>({
    route: "/camera/getMinimalCameraStateList",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });

  const cameras: { uuid: string; name: string; locationUuid?: string }[] = (
    cameraListRes.cameraStates ?? []
  )
    .filter((c: any) => c.locationUuid)
    .map((c: any) => ({
      uuid: c.uuid,
      name: c.name ?? c.uuid,
      locationUuid: c.locationUuid,
    }));

  const uptimeResults: CameraUptimeResult[] = [];

  const batchWindows = await getFleetUptimeWindowsForOrg(
    startTimeSec,
    endTimeSec,
    requestModifiers,
    sessionId
  );

  if (batchWindows) {
    for (const cam of cameras) {
      /*
       * A camera the batch route said nothing about is unknown, not down -
       * it never reached the uptime store at all.
       */
      const entry = batchWindows.get(cam.uuid) ?? {
        windows: [],
        uptimeSource: UptimeSource.UNAVAILABLE,
      };

      uptimeResults.push(
        computeUptimeStats(
          cam.uuid,
          cam.name,
          cam.locationUuid,
          entry.windows,
          startTimeSec,
          endTimeSec,
          entry.uptimeSource
        )
      );
    }
  } else {
    const batchSize = 10;
    for (let i = 0; i < cameras.length; i += batchSize) {
      const batch = cameras.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async cam => {
          try {
            const res = await postApi<schema["Camera_GetUptimeWindowsWSResponse"]>({
              route: "/camera/getUptimeWindows",
              body: {
                cameraUuid: cam.uuid,
                // milliseconds — see getCameraUptime
                startTime: startTimeSec * 1000,
                endTime: endTimeSec * 1000,
              } satisfies schema["Camera_GetUptimeWindowsWSRequest"],
              modifiers: requestModifiers,
              sessionId,
            });
            return computeUptimeStats(
              cam.uuid,
              cam.name,
              cam.locationUuid,
              (res.uptimeWindows ?? []) as UptimeWindow[],
              startTimeSec,
              endTimeSec,
              readUptimeSource((res as { uptimeSource?: unknown }).uptimeSource)
            );
          } catch {
            /*
             * The call failed, so we know nothing about this camera. Report
             * that, rather than a fabricated 0%.
             */
            return computeUptimeStats(
              cam.uuid,
              cam.name,
              cam.locationUuid,
              [],
              startTimeSec,
              endTimeSec,
              UptimeSource.UNAVAILABLE
            );
          }
        })
      );
      uptimeResults.push(...batchResults);
    }
  }

  /*
   * Known uptime first, worst first; cameras with no signal sort to the end so
   * they never look like the worst performers.
   */
  uptimeResults.sort((a, b) => {
    const aKnown = a.uptimePercentage != null;
    const bKnown = b.uptimePercentage != null;
    if (aKnown !== bKnown) {
      return aKnown ? -1 : 1;
    }
    if (!aKnown) {
      return 0;
    }
    return a.uptimePercentage! - b.uptimePercentage!;
  });

  const knownResults = uptimeResults.filter(r => r.uptimePercentage != null);

  const avgUptime =
    knownResults.length > 0
      ? Math.round(
          (knownResults.reduce((sum, r) => sum + r.uptimePercentage!, 0) / knownResults.length) * 100
        ) / 100
      : 0;

  return {
    cameras: uptimeResults,
    summary: {
      totalCameras: uptimeResults.length,
      camerasWithKnownUptime: knownResults.length,
      camerasWithUnknownUptime: uptimeResults.length - knownResults.length,
      averageUptimePercentage: avgUptime,
      worstCamera: knownResults[0]?.cameraName,
      worstUptimePercentage: knownResults[0]?.uptimePercentage,
    },
  };
}
