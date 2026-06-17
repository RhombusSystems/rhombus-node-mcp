/**
 * Keystone correlation helper for the OnGuard feature set.
 *
 * Given a badge-event-like entry (a camera `deviceUuid` + a `timestampMs`), produce the media hints
 * the agent needs to *show* the moment: a still (camera-tool `image`) and a short clip window
 * (clips-tool `createClip`). Pure and reusable — the follow-the-badge timeline, anomaly review, and
 * lost-badge tracking all turn badge events into "here's the picture/video" the same way.
 *
 * Kept deliberately small and side-effect-free. Richer correlation (co-located face events,
 * people-count in the window) layers on top of this when those features land.
 */

export interface BadgeEventLike {
  /** The camera that saw the event. Some OnGuard events aren't mapped to a camera. */
  deviceUuid?: string;
  /** Event time, epoch ms. */
  timestampMs?: number;
}

export interface ClipHint {
  /** The camera that saw the event. Pass to clips-tool `createClip`. */
  deviceUuid: string;
  startTimeMs: number;
  endTimeMs: number;
}

export interface StillHint {
  /** The camera that saw the event. Pass to camera-tool (requestType `image`). */
  deviceUuid: string;
  timestampMs: number;
}

export interface MediaHints {
  clipHint?: ClipHint;
  stillHint?: StillHint;
}

export const DEFAULT_CLIP_PADDING_SECONDS = 15;

/**
 * Build still + clip hints for a single badge event. Returns empty hints (no clip/still) when the
 * event lacks a camera or timestamp, so callers can render those events without media gracefully.
 */
export function buildMediaHints(
  event: BadgeEventLike,
  clipPaddingSeconds: number = DEFAULT_CLIP_PADDING_SECONDS
): MediaHints {
  if (!event.deviceUuid || event.timestampMs == null) {
    return {};
  }
  const padMs = Math.max(0, clipPaddingSeconds) * 1000;
  return {
    clipHint: {
      deviceUuid: event.deviceUuid,
      startTimeMs: event.timestampMs - padMs,
      endTimeMs: event.timestampMs + padMs,
    },
    stillHint: {
      deviceUuid: event.deviceUuid,
      timestampMs: event.timestampMs,
    },
  };
}
