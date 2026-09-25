/**
 * Privacy-region geometry for update-tool — a port of the Console's own
 * conversion (rhombus-cloud-frontend `common/util/math/geometry/privacyWindowUtils.ts`
 * and `common/state/region/toServer.ts`), so a region MIND writes lands exactly
 * where the same shape drawn in the Console's Privacy tab would.
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
 * `privacy_window_polygons` (any simple polygon, 3+ points); older firmware
 * only reads `privacy_windows` (axis-aligned rectangles). The Console picks the
 * field by that version and nulls the other one — this module mirrors that
 * choice, and the Console's editor validation (validatePrivacyShapes).
 */

export const PRIVACY_POLYGON_MINIMUM_VERSION = "2025_0626";

// R1/R2 firmware cannot black out more than this share of the view per region
// (Console `privacy-region/ValidationPlugin.ts`, MAX_POLYGON_COVERAGE).
export const RESTRICTED_COVERAGE_HW_VARIATIONS = new Set(["CAMERA_R1", "CAMERA_R2"]);
export const MAX_RESTRICTED_COVERAGE = 0.4;

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

/** A polygon in client space: ordered vertices as percentages of the displayed image. */
export type PrivacyPolygonPercent = { points: { xPercent: number; yPercent: number }[] };

export type PrivacyShape = PrivacyRectPercent | PrivacyPolygonPercent;

export type PrivacyRegionMode = "add" | "replace" | "clear";

/** The `videoFacetSettings[facet]` fields to send, exactly as the Console sends them. */
export type PrivacyRegionUpdate =
  | { privacy_window_polygons: ServerPrivacyPolygon[]; privacy_windows: null }
  | { privacy_window_polygons: null; privacy_windows: ServerPrivacyWindow[] };

/** A region in effect after a write, described in client space. */
export type PrivacyRegionDescription = {
  shape: "rectangle" | "polygon";
  points: { xPercent: number; yPercent: number }[];
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
};

const PERMYRIAD = 10_000;
const EPSILON = 1e-9;

/** Firmware versions are `YYYY_MMDD_HHMM_hash`, so a string compare orders them. */
export function supportsPrivacyPolygons(firmwareVersion: string | null | undefined): boolean {
  return typeof firmwareVersion === "string" && firmwareVersion >= PRIVACY_POLYGON_MINIMUM_VERSION;
}

function isPolygonShape(shape: PrivacyShape): shape is PrivacyPolygonPercent {
  return "points" in shape;
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

function boxCorners(b: Box): Point[] {
  return [
    { x: b.x, y: b.y },
    { x: b.x + b.width, y: b.y },
    { x: b.x + b.width, y: b.y + b.height },
    { x: b.x, y: b.y + b.height },
  ];
}

/** A shape's vertices in client space (0..1), in drawing order. */
export function shapeToClientPoints(shape: PrivacyShape): Point[] {
  if (isPolygonShape(shape)) {
    return shape.points.map(p => ({ x: p.xPercent / 100, y: p.yPercent / 100 }));
  }
  return boxCorners({
    x: shape.leftPercent / 100,
    y: shape.topPercent / 100,
    width: shape.widthPercent / 100,
    height: shape.heightPercent / 100,
  });
}

/** The box a 4-point axis-aligned polygon spans, or null for any other shape. */
function asAxisAlignedBox(points: Point[]): Box | null {
  if (points.length !== 4) return null;
  const xs = [...new Set(points.map(p => p.x))];
  const ys = [...new Set(points.map(p => p.y))];
  if (xs.length !== 2 || ys.length !== 2) return null;
  // All four corner combinations must be present (rules out a bow-tie ordering
  // of the same four values, which is caught by the self-intersection check).
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

/** Shoelace area of a simple polygon (Console `getPolygonArea`). */
export function polygonArea(points: Point[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += (a.y + b.y) * (a.x - b.x);
  }
  return Math.abs(sum) / 2;
}

function orientation(p: Point, q: Point, r: Point): number {
  const value = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (Math.abs(value) < EPSILON) return 0;
  return value > 0 ? 1 : 2;
}

function onSegment(p: Point, q: Point, r: Point): boolean {
  return (
    q.x <= Math.max(p.x, r.x) + EPSILON &&
    q.x + EPSILON >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) + EPSILON &&
    q.y + EPSILON >= Math.min(p.y, r.y)
  );
}

function segmentsIntersect(p1: Point, q1: Point, p2: Point, q2: Point): boolean {
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;
  return false;
}

/** True when any two non-adjacent edges cross (Console `isPolygonSelfIntersecting`). */
export function isSelfIntersecting(points: Point[]): boolean {
  const n = points.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Edges i and j share a vertex when adjacent (including last↔first).
      if (j === i + 1 || (i === 0 && j === n - 1)) continue;
      if (segmentsIntersect(points[i], points[(i + 1) % n], points[j], points[(j + 1) % n])) {
        return true;
      }
    }
  }
  return false;
}

/**
 * The Console editor's rules for a privacy shape, applied before anything is
 * written. Returns a message naming the region and the rule, or null.
 */
export function validatePrivacyShapes(
  shapes: PrivacyShape[],
  options: { polygons: boolean; hwVariation?: string | null }
): string | null {
  for (const [index, shape] of shapes.entries()) {
    const label = `regions[${index}]`;
    const points = shapeToClientPoints(shape);

    if (points.length < 3) return `${label} needs at least 3 points.`;
    if (isSelfIntersecting(points)) {
      return `${label} is self-intersecting — its edges cross. List the points in order around the outline (clockwise or counter-clockwise).`;
    }
    const area = polygonArea(points);
    if (area < EPSILON) return `${label} has no area — its points are all on one line.`;

    if (!options.polygons && !asAxisAlignedBox(points)) {
      return `${label} is not an axis-aligned rectangle, and this camera's firmware only supports rectangular privacy regions (polygons need firmware ${PRIVACY_POLYGON_MINIMUM_VERSION} or newer). Offer the user a rectangle that covers the area, or ask them to update the camera firmware.`;
    }

    if (
      options.hwVariation &&
      RESTRICTED_COVERAGE_HW_VARIATIONS.has(options.hwVariation) &&
      area >= MAX_RESTRICTED_COVERAGE
    ) {
      return `${label} covers ${Math.round(area * 100)}% of the image; on this camera model a privacy region must cover less than ${MAX_RESTRICTED_COVERAGE * 100}% of the view.`;
    }
  }
  return null;
}

function toServerPoints(points: Point[], config: PrivacyRegionConfig): Point[] {
  const rotation = (config.rotation || 0) * -1;
  return points.map(p => reversePtzPoint(rotatePoint(p, rotation), config.ptz_config));
}

/** Client-space shape → server polygon (Console `getServerPrivacyPolygon`). */
export function toServerPolygon(shape: PrivacyShape, config: PrivacyRegionConfig): ServerPrivacyPolygon {
  return { coordinates: toServerPoints(shapeToClientPoints(shape), config) };
}

/**
 * Client-space rectangle → server PermyriadRect (Console `convertToServerWindow`).
 * Only valid for axis-aligned rectangles — validatePrivacyShapes rejects any
 * other shape on window-only firmware before this is reached.
 */
export function toServerWindow(shape: PrivacyShape, config: PrivacyRegionConfig): ServerPrivacyWindow {
  const box = asAxisAlignedBox(shapeToClientPoints(shape));
  if (!box) throw new Error("A privacy window must be an axis-aligned rectangle");
  const unrotated = rotateBox(box, (config.rotation || 0) * -1);
  const topLeft = reversePtzPoint({ x: unrotated.x, y: unrotated.y }, config.ptz_config);
  const size = config.ptz_config?.size_percent || 1;
  return {
    x: Math.round(topLeft.x * PERMYRIAD),
    y: Math.round(topLeft.y * PERMYRIAD),
    w: Math.round(unrotated.width * size * PERMYRIAD),
    h: Math.round(unrotated.height * size * PERMYRIAD),
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
 * Shapes must already have passed validatePrivacyShapes.
 */
export function buildPrivacyRegionUpdate(
  mode: PrivacyRegionMode,
  shapes: PrivacyShape[],
  config: PrivacyRegionConfig,
  polygons: boolean
): PrivacyRegionUpdate {
  const existing = mode === "add" ? existingServerRegions(config, polygons) : { windows: [], polygons: [] };
  const incoming = mode === "clear" ? [] : shapes;

  if (polygons) {
    return {
      privacy_window_polygons: [
        ...existing.polygons,
        ...incoming.map(shape => toServerPolygon(shape, config)),
      ],
      privacy_windows: null,
    };
  }
  return {
    privacy_window_polygons: null,
    privacy_windows: [...existing.windows, ...incoming.map(shape => toServerWindow(shape, config))],
  };
}

/** Read-back helper: the regions in effect, in client-space percent (vertices + bounding box). */
export function describePrivacyRegions(
  config: PrivacyRegionConfig,
  polygons: boolean
): PrivacyRegionDescription[] {
  const existing = existingServerRegions(config, polygons);
  const serverPolygons = polygons
    ? existing.polygons
    : existing.windows.map(windowToServerPolygon).filter((p): p is ServerPrivacyPolygon => !!p);
  const pct = (v: number) => Math.round(v * 1000) / 10;
  return serverPolygons.map(p => {
    const points = (p.coordinates ?? []).map(pt =>
      rotatePoint(applyPtzPoint(pt, config.ptz_config), config.rotation)
    );
    const xs = points.map(pt => pt.x);
    const ys = points.map(pt => pt.y);
    return {
      shape: asAxisAlignedBox(points.map(pt => ({ x: pct(pt.x), y: pct(pt.y) }))) ? "rectangle" : "polygon",
      points: points.map(pt => ({ xPercent: pct(pt.x), yPercent: pct(pt.y) })),
      leftPercent: pct(Math.min(...xs)),
      topPercent: pct(Math.min(...ys)),
      widthPercent: pct(Math.max(...xs) - Math.min(...xs)),
      heightPercent: pct(Math.max(...ys) - Math.min(...ys)),
    };
  });
}
