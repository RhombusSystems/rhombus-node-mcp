import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTool } from "../../src/tools/camera-tool.js";
import * as cameraApi from "../../src/api/camera-tool-api.js";
import type { ToolArgs } from "../../src/types/camera-tool-types.js";
import { captureToolHandler, findTextContent } from "../utils.js";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("../../src/api/camera-tool-api.js");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal valid tool extra (no modifiers, no session). */
const EMPTY_EXTRA = {};

/** A realistic-looking 22-char camera UUID pulled from .env.test (falls back to a stub). */
const CAMERA_UUID = process.env.CAMERA_UUID ?? "testCameraUUID1234567";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("camera-tool handler", () => {
  let handler: ReturnType<typeof captureToolHandler<ToolArgs>>;

  beforeEach(() => {
    vi.clearAllMocks();
    handler = captureToolHandler<ToolArgs>(createTool);
  });

  // -------------------------------------------------------------------------
  // Guard: missing cameraUuid
  // -------------------------------------------------------------------------

  describe("when cameraUuid is missing", () => {
    it("returns a needUserInput response without calling any API", async () => {
      // Pass undefined — the tool schema normally enforces a string, but the
      // handler has an explicit runtime guard we want to exercise.
      const result = await handler(
        { cameraUuid: undefined as unknown as string, requestType: "image", timestampISO: null },
        EMPTY_EXTRA
      );

      // Shape check
      expect(result).toMatchObject({
        content: [{ type: "text", text: expect.any(String) }],
      });

      // Semantic check
      const payload = JSON.parse(findTextContent(result)!.text);
      expect(payload.needUserInput).toBe(true);
      expect(payload.commandForUser).toMatch(/camera/i);

      // No API calls should have been made
      expect(cameraApi.getImageForCameraAtTime).not.toHaveBeenCalled();
      expect(cameraApi.getCameraSettings).not.toHaveBeenCalled();
      expect(cameraApi.getCameraMediaUris).not.toHaveBeenCalled();
      expect(cameraApi.getCameraAIThresholds).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // requestType: "image"
  // -------------------------------------------------------------------------

  describe('requestType: "image"', () => {
    it("returns image + text content on success", async () => {
      vi.mocked(cameraApi.getImageForCameraAtTime).mockResolvedValue({
        success: true,
        status: "successfully fetched image",
        frameUri: "https://cdn.example.com/frame.jpg",
        imageType: "base64",
        imageData: "abc123base64==",
      });

      const result = await handler(
        { cameraUuid: CAMERA_UUID, requestType: "image", timestampISO: null },
        EMPTY_EXTRA
      );

      expect(result).toMatchObject({
        content: expect.arrayContaining([
          // Image part
          expect.objectContaining({
            type: "image",
            data: "abc123base64==",
            mimeType: "image/jpeg",
          }),
          // Metadata text part
          expect.objectContaining({
            type: "text",
            text: expect.stringContaining(CAMERA_UUID),
          }),
        ]),
      });

      const textPart = findTextContent(result);
      const meta = JSON.parse(textPart!.text);
      expect(meta.success).toBe(true);
      expect(meta.frameUri).toBe("https://cdn.example.com/frame.jpg");
    });

    it("returns error text when the image fetch fails", async () => {
      vi.mocked(cameraApi.getImageForCameraAtTime).mockResolvedValue({
        success: false,
        status: "failed to fetch image",
      });

      const result = await handler(
        { cameraUuid: CAMERA_UUID, requestType: "image", timestampISO: null },
        EMPTY_EXTRA
      );

      expect(result).toMatchObject({
        content: [
          {
            type: "text",
            text: expect.stringContaining("failed to fetch image"),
          },
        ],
      });
    });

    it("converts timestampISO to milliseconds and forwards it to the API", async () => {
      vi.mocked(cameraApi.getImageForCameraAtTime).mockResolvedValue({
        success: false,
        status: "irrelevant",
      });

      const iso = "2024-06-15T10:30:00.000Z";

      await handler(
        { cameraUuid: CAMERA_UUID, requestType: "image", timestampISO: iso },
        EMPTY_EXTRA
      );

      const [calledUuid, calledTimestampMs] = vi.mocked(cameraApi.getImageForCameraAtTime).mock
        .calls[0];

      expect(calledUuid).toBe(CAMERA_UUID);
      expect(calledTimestampMs).toBe(new Date(iso).getTime());
    });

    it("defaults to ~5 minutes ago when timestampISO is null", async () => {
      vi.mocked(cameraApi.getImageForCameraAtTime).mockResolvedValue({
        success: false,
        status: "irrelevant",
      });

      const before = Date.now();

      await handler(
        { cameraUuid: CAMERA_UUID, requestType: "image", timestampISO: null },
        EMPTY_EXTRA
      );

      const after = Date.now();
      const [, calledTimestampMs] = vi.mocked(cameraApi.getImageForCameraAtTime).mock.calls[0];

      const fiveMinutesMs = 5 * 60 * 1000;
      expect(calledTimestampMs).toBeGreaterThanOrEqual(before - fiveMinutesMs - 500);
      expect(calledTimestampMs).toBeLessThanOrEqual(after - fiveMinutesMs + 500);
    });

    it("passes cameraUuid to the API", async () => {
      vi.mocked(cameraApi.getImageForCameraAtTime).mockResolvedValue({
        success: false,
        status: "irrelevant",
      });

      await handler(
        { cameraUuid: CAMERA_UUID, requestType: "image", timestampISO: null },
        EMPTY_EXTRA
      );

      expect(vi.mocked(cameraApi.getImageForCameraAtTime)).toHaveBeenCalledWith(
        CAMERA_UUID,
        expect.any(Number),
        undefined, // requestModifiers
        undefined // sessionId
      );
    });
  });

  // -------------------------------------------------------------------------
  // requestType: "get-settings"
  // -------------------------------------------------------------------------

  describe('requestType: "get-settings"', () => {
    it("returns JSON-stringified settings as text content", async () => {
      const mockSettings = {
        success: true,
        status: "fetched camera settings",
        config: { resolution: { width: 1920, height: 1080 } },
        daysInCloud: 30,
        daysOnCamera: 7,
        cloudArchiveDays: 30,
      };
      vi.mocked(cameraApi.getCameraSettings).mockResolvedValue(mockSettings);

      const result = await handler(
        { cameraUuid: CAMERA_UUID, requestType: "get-settings", timestampISO: null },
        EMPTY_EXTRA
      );

      expect(result).toMatchObject({
        content: [{ type: "text", text: JSON.stringify(mockSettings) }],
      });
    });

    it("forwards the cameraUuid to the API", async () => {
      vi.mocked(cameraApi.getCameraSettings).mockResolvedValue({
        success: false,
        status: "failed to fetch camera settings",
      });

      await handler(
        { cameraUuid: CAMERA_UUID, requestType: "get-settings", timestampISO: null },
        EMPTY_EXTRA
      );

      expect(vi.mocked(cameraApi.getCameraSettings)).toHaveBeenCalledWith(
        CAMERA_UUID,
        undefined,
        undefined
      );
    });
  });

  // -------------------------------------------------------------------------
  // requestType: "get-media-uris"
  // -------------------------------------------------------------------------

  describe('requestType: "get-media-uris"', () => {
    it("returns JSON-stringified media URIs as text content", async () => {
      const mockUris = {
        liveUri: "rtsp://stream.example.com/live",
        archiveUri: "rtsp://stream.example.com/archive",
      };
      vi.mocked(cameraApi.getCameraMediaUris).mockResolvedValue(mockUris as never);

      const result = await handler(
        { cameraUuid: CAMERA_UUID, requestType: "get-media-uris", timestampISO: null },
        EMPTY_EXTRA
      );

      expect(result).toMatchObject({
        content: [{ type: "text", text: JSON.stringify(mockUris) }],
      });
    });

    it("forwards the cameraUuid to the API", async () => {
      vi.mocked(cameraApi.getCameraMediaUris).mockResolvedValue({} as never);

      await handler(
        { cameraUuid: CAMERA_UUID, requestType: "get-media-uris", timestampISO: null },
        EMPTY_EXTRA
      );

      expect(vi.mocked(cameraApi.getCameraMediaUris)).toHaveBeenCalledWith(
        CAMERA_UUID,
        undefined,
        undefined
      );
    });
  });

  // -------------------------------------------------------------------------
  // requestType: "get-ai-thresholds"
  // -------------------------------------------------------------------------

  describe('requestType: "get-ai-thresholds"', () => {
    it("returns JSON-stringified AI thresholds as text content", async () => {
      const mockThresholds = {
        motionSensitivity: 0.6,
        personDetectionThreshold: 0.8,
        vehicleDetectionThreshold: 0.75,
      };
      vi.mocked(cameraApi.getCameraAIThresholds).mockResolvedValue(mockThresholds as never);

      const result = await handler(
        { cameraUuid: CAMERA_UUID, requestType: "get-ai-thresholds", timestampISO: null },
        EMPTY_EXTRA
      );

      expect(result).toMatchObject({
        content: [{ type: "text", text: JSON.stringify(mockThresholds) }],
      });
    });

    it("forwards the cameraUuid to the API", async () => {
      vi.mocked(cameraApi.getCameraAIThresholds).mockResolvedValue({} as never);

      await handler(
        { cameraUuid: CAMERA_UUID, requestType: "get-ai-thresholds", timestampISO: null },
        EMPTY_EXTRA
      );

      expect(vi.mocked(cameraApi.getCameraAIThresholds)).toHaveBeenCalledWith(
        CAMERA_UUID,
        undefined,
        undefined
      );
    });
  });
});
