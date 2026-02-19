import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

interface UptimeWindow {
  startSeconds?: number | null;
  durationSeconds?: number | null;
}

interface CameraUptimeResult {
  cameraUuid: string;
  cameraName?: string;
  locationUuid?: string;
  totalUptimeSeconds: number;
  totalPeriodSeconds: number;
  uptimePercentage: number;
  outageCount: number;
  longestOutageSeconds: number;
}

function computeUptimeStats(
  cameraUuid: string,
  cameraName: string | undefined,
  locationUuid: string | undefined,
  windows: UptimeWindow[],
  startTimeSec: number,
  endTimeSec: number
): CameraUptimeResult {
  const totalPeriodSeconds = endTimeSec - startTimeSec;
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
      startTime: startTimeSec,
      endTime: endTimeSec,
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
    endTimeSec
  );
}

export async function getFleetUptime(
  startTimeSec: number,
  endTimeSec: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<{ cameras: CameraUptimeResult[]; summary: { totalCameras: number; averageUptimePercentage: number; worstCamera?: string; worstUptimePercentage?: number } }> {
  const cameraListRes = await postApi<any>({
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
              startTime: startTimeSec,
              endTime: endTimeSec,
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
            endTimeSec
          );
        } catch {
          return computeUptimeStats(cam.uuid, cam.name, cam.locationUuid, [], startTimeSec, endTimeSec);
        }
      })
    );
    uptimeResults.push(...batchResults);
  }

  uptimeResults.sort((a, b) => a.uptimePercentage - b.uptimePercentage);

  const avgUptime =
    uptimeResults.length > 0
      ? Math.round(
          (uptimeResults.reduce((sum, r) => sum + r.uptimePercentage, 0) / uptimeResults.length) * 100
        ) / 100
      : 0;

  return {
    cameras: uptimeResults,
    summary: {
      totalCameras: uptimeResults.length,
      averageUptimePercentage: avgUptime,
      worstCamera: uptimeResults[0]?.cameraName,
      worstUptimePercentage: uptimeResults[0]?.uptimePercentage,
    },
  };
}
