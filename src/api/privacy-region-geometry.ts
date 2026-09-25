/**
 * Privacy-region geometry for update-tool — a port of the Console's own
 * conversion (rhombus-cloud-frontend `common/util/math/geometry/privacyWindowUtils.ts`
 * and `common/state/region/toServer.ts`), so a region MIND writes lands exactly
 * where the same rectangle drawn in the Console's Privacy tab would.
 *
 * Two coordinate spaces are involved:
 *  - CLIENT space: fractions (0..1) of the image as the user sees it in the
 *    Console, i.e. AFTER the camera's `rotation` and PTZ crop are applied.
 *    "The upper-left 25%" means client space.
 *  - SERVER space: what `privacy_windows` / `privacy_window_polygons` store —
 *    unrotated, full-sensor coordinates. `privacy_windows` are PermyriadRects
 *    (integers, 0..10000); polygon coordinates are fractions (0..1).
 *
 * Firmware at or after PRIVACY_POLYGON_MINIMUM_VERSION reads
 * `privacy_window_polygons`; older firmware only reads `privacy_windows`. The
 * Console picks the field by that version and nulls the other one — this
 * module mirrors that choice.
 */

export const PRIVACY_POLYGON_MINIMUM_VERSION = "2025_0626";

type Point = { x: number; y: number };
type Box = { x: number; y: number; width: number; height: number };

export type ServerPrivacyWindow = { x?: number; y?: number; w?: number; h?: number; size?: number };
export type ServerPrivacyPolygon = { coordinates?: Point[] };
export type PtzConfig = {
  size_percent?: number | null;
  offset_x_percent?: number | null;
  offset_y_percent?: number | null;
} | null;

/** The slice of a camera's video facet config that privacy regions depend on. */
export type PrivacyRegionConfig = {
  rotation?: number | null;
  ptz_config?: PtzConfig;
  privacy_windows?: ServerPrivacyWindow[] | null;
  privacy_window_polygons?: ServerPrivacyPolygon[] | null;
};

/** A rectangle in client space, as percentages (0..100) of the displayed image. */
export type PrivacyRectPercent = {
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
};

export type PrivacyRegionMode = "add" | "replace" | "clear";

/** The `videoFacetSettings[facet]` fields to send, exactly as the Console sends them. */
export type PrivacyRegionUpdate =
  | { privacy_window_polygons: ServerPrivacyPolygon[]; privacy_windows: null }
  | { privacy_window_polygons: null; privacy_windows: ServerPrivacyWindow[] };

const PERMYRIAD = 10_000;

/** Firmware versions are `YYYY_MMDD_HHMM_hash`, so a string compare orders them. */
export function supportsPrivacyPolygons(firmwareVersion: string | null | undefined): boolean {
  return typeof firmwareVersion === "string" && firmwareVersion >= PRIVACY_POLYGON_MINIMUM_VERSION;
}

function rotatePoint(p: Point, rotation?: number | null): Point {
  switch (rotation) {
    case 90:
    case -270:
      return { x: 1 - p.y, y: p.x };
    case 180:
    case -180:
      return { x: 1 - p.x, y: 1 - p.y };
    case 270:
    case -90:
      return { x: p.y, y: 1 - p.x };
    default:
      return p;
  }
}

function rotateBox(b: Box, rotation?: number | null): Box {
  const corner1 = rotatePoint({ x: b.x, y: b.y }, rotation);
  const corner2 = rotatePoint({ x: b.x + b.width, y: b.y + b.height }, rotation);
  const x = Math.min(corner1.x, corner2.x);
  const y = Math.min(corner1.y, corner2.y);
  return {
    x,
    y,
    width: Math.max(corner1.x, corner2.x) - x,
    height: Math.max(corner1.y, corner2.y) - y,
  };
}

// The server stores regions relative to the full, un-cropped PTZ view.
function reversePtzPoint(p: Point, ptz?: PtzConfig): Point {
  const size = ptz?.size_percent || 1;
  return {
    x: p.x * size + (ptz?.offset_x_percent || 0),
    y: p.y * size + (ptz?.offset_y_percent || 0),
  };
}

function applyPtzPoint(p: Point, ptz?: PtzConfig): Point {
  const size = ptz?.size_percent || 1;
  return {
    x: (p.x - (ptz?.offset_x_percent || 0)) / size,
    y: (p.y - (ptz?.offset_y_percent || 0)) / size,
  };
}

function percentToClientBox(rect: PrivacyRectPercent): Box {
  return {
    x: rect.leftPercent / 100,
    y: rect.topPercent / 100,
    width: rect.widthPercent / 100,
    height: rect.heightPercent / 100,
  };
}

function boxCorners(b: Box): Point[] {
  return [
    { x: b.x, y: b.y },
    { x: b.x + b.width, y: b.y },
    { x: b.x + b.width, y: b.y + b.height },
    { x: b.x, y: b.y + b.height },
  ];
}

/** Client-space percent rectangle → server PermyriadRect (Console `convertToServerWindow`). */
export function toServerWindow(rect: PrivacyRectPercent, config: PrivacyRegionConfig): ServerPrivacyWindow {
  const unrotated = rotateBox(percentToClientBox(rect), (config.rotation || 0) * -1);
  const topLeft = reversePtzPoint({ x: unrotated.x, y: unrotated.y }, config.ptz_config);
  const size = config.ptz_config?.size_percent || 1;
  return {
    x: Math.round(topLeft.x * PERMYRIAD),
    y: Math.round(topLeft.y * PERMYRIAD),
    w: Math.round(unrotated.width * size * PERMYRIAD),
    h: Math.round(unrotated.height * size * PERMYRIAD),
  };
}

/** Client-space percent rectangle → server polygon (Console `getServerPrivacyPolygon`). */
export function toServerPolygon(rect: PrivacyRectPercent, config: PrivacyRegionConfig): ServerPrivacyPolygon {
  const rotation = (config.rotation || 0) * -1;
  return {
    coordinates: boxCorners(percentToClientBox(rect)).map(p =>
      reversePtzPoint(rotatePoint(p, rotation), config.ptz_config)
    ),
  };
}

// A stored window as a 4-corner polygon. Windows and polygons share the same
// server space (the Console's readers apply identical PTZ + rotation to both),
// so this needs no rotation — only the permyriad → fraction scale.
function windowToServerPolygon(w: ServerPrivacyWindow): ServerPrivacyPolygon | null {
  if (!w.w && !w.h) return null;
  return {
    coordinates: boxCorners({
      x: (w.x || 0) / PERMYRIAD,
      y: (w.y || 0) / PERMYRIAD,
      width: (w.w || 0) / PERMYRIAD,
      height: (w.h || 0) / PERMYRIAD,
    }),
  };
}

/**
 * The regions currently in effect, as the Console's Privacy tab loads them: on
 * polygon firmware, legacy windows are shown (and re-saved) as polygons next to
 * the stored polygons; on older firmware only the windows count.
 */
export function existingServerRegions(
  config: PrivacyRegionConfig,
  polygons: boolean
): { windows: ServerPrivacyWindow[]; polygons: ServerPrivacyPolygon[] } {
  const windows = (config.privacy_windows ?? []).filter(w => w && (w.w || w.h));
  if (!polygons) return { windows, polygons: [] };
  const fromWindows = windows.map(windowToServerPolygon).filter((p): p is ServerPrivacyPolygon => !!p);
  const stored = (config.privacy_window_polygons ?? []).filter(p => (p?.coordinates?.length ?? 0) >= 3);
  return { windows: [], polygons: [...fromWindows, ...stored] };
}

/** Number of privacy regions the camera will apply, counted the way the Console counts them. */
export function countPrivacyRegions(config: PrivacyRegionConfig, polygons: boolean): number {
  const existing = existingServerRegions(config, polygons);
  return polygons ? existing.polygons.length : existing.windows.length;
}

/**
 * Build the video-facet update for a privacy-region change. `add` keeps every
 * region already on the camera, `replace` drops them, `clear` removes all.
 */
export function buildPrivacyRegionUpdate(
  mode: PrivacyRegionMode,
  rects: PrivacyRectPercent[],
  config: PrivacyRegionConfig,
  polygons: boolean
): PrivacyRegionUpdate {
  const existing = mode === "add" ? existingServerRegions(config, polygons) : { windows: [], polygons: [] };
  const incoming = mode === "clear" ? [] : rects;

  if (polygons) {
    return {
      privacy_window_polygons: [
        ...existing.polygons,
        ...incoming.map(rect => toServerPolygon(rect, config)),
      ],
      privacy_windows: null,
    };
  }
  return {
    privacy_window_polygons: null,
    privacy_windows: [...existing.windows, ...incoming.map(rect => toServerWindow(rect, config))],
  };
}

/** Read-back helper: the client-space bounding boxes (percent) of the regions in effect. */
export function describePrivacyRegions(config: PrivacyRegionConfig, polygons: boolean): PrivacyRectPercent[] {
  const existing = existingServerRegions(config, polygons);
  const serverPolygons = polygons
    ? existing.polygons
    : existing.windows.map(windowToServerPolygon).filter((p): p is ServerPrivacyPolygon => !!p);
  return serverPolygons.map(p => {
    const points = (p.coordinates ?? []).map(pt =>
      rotatePoint(applyPtzPoint(pt, config.ptz_config), config.rotation)
    );
    const xs = points.map(pt => pt.x);
    const ys = points.map(pt => pt.y);
    const pct = (v: number) => Math.round(v * 1000) / 10;
    return {
      leftPercent: pct(Math.min(...xs)),
      topPercent: pct(Math.min(...ys)),
      widthPercent: pct(Math.max(...xs) - Math.min(...xs)),
      heightPercent: pct(Math.max(...ys) - Math.min(...ys)),
    };
  });
}
