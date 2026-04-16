import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { createTool } from "../../src/tools/camera-tool.js";
import type { ToolArgs } from "../../src/types/camera-tool-types.js";
import { getCameraList } from "../../src/api/get-entity-tool-api.js";
import {
  isLiveConfigured,
  isHeavyTestEnabled,
  captureToolHandler,
  spyOnPostApi,
  dumpApiCallsOnFailure,
  rateLimitedMap,
  printResultsTable,
  findTextContent,
  findImageContent,
  type PostApiSpy,
  type TestResult,
  type MinimalCameraState,
} from "../utils.js";

// ---------------------------------------------------------------------------
// No vi.mock — this file hits the real Rhombus API.
// Requires a valid .env.test (copy from .env.test.template and fill in values).
// ---------------------------------------------------------------------------

const CAMERA_UUID = process.env.CAMERA_UUID!;

// ---------------------------------------------------------------------------
// Suite — skipped automatically when .env.test isn't populated.
// ---------------------------------------------------------------------------

describe.skipIf(!isLiveConfigured())("camera-tool LIVE", () => {
  let handler: ReturnType<typeof captureToolHandler<ToolArgs>>;
  let postApiSpy: PostApiSpy;

  beforeEach(() => {
    handler = captureToolHandler<ToolArgs>(createTool);
    postApiSpy = spyOnPostApi();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('requestType: "image"', () => {
    it("returns a non-empty base64 JPEG image for CAMERA_UUID", async () => {
      dumpApiCallsOnFailure(postApiSpy);

      const result = await handler(
        {
          cameraUuid: CAMERA_UUID,
          requestType: "image",
          timestampISO: null, // defaults to ~5 min ago
        },
        {} // no requestModifiers or sessionId
      );

      // Should have at least two content parts: image + metadata text
      expect(result).toMatchObject({
        content: expect.arrayContaining([
          expect.objectContaining({
            type: "image",
            mimeType: "image/jpeg",
            data: expect.any(String),
          }),
          expect.objectContaining({
            type: "text",
            text: expect.any(String),
          }),
        ]),
      });

      // Image data must be non-empty and valid base64
      const imagePart = findImageContent(result);
      expect(imagePart).toBeDefined();
      expect(imagePart!.data.length).toBeGreaterThan(0);
      expect(imagePart!.data).toMatch(/^[A-Za-z0-9+/]+=*$/);

      // Metadata text must report success and include the camera UUID
      const textPart = findTextContent(result);
      expect(textPart).toBeDefined();
      const meta = JSON.parse(textPart!.text);
      expect(meta.success).toBe(true);
      expect(meta.cameraUuid).toBe(CAMERA_UUID);
      expect(typeof meta.frameUri).toBe("string");
      expect(meta.frameUri.length).toBeGreaterThan(0);
    }, 15_000); // real network call — allow up to 15 s
  });

  describe.skipIf(!isHeavyTestEnabled())('requestType: "image" — all online cameras', () => {
    let onlineCameras: Array<{ uuid: string; name: string }> = [];

    // Fetch ALL online cameras once before the tests in this block run.
    beforeAll(async () => {
      const { cameras } = (await getCameraList()) as { cameras: MinimalCameraState[] };
      const connected = cameras.filter(c => c.connectionStatus === "GREEN");

      onlineCameras = connected.map(c => ({
        uuid: c.uuid,
        name: `${c.name ?? c.uuid} (${c.uuid})`,
      }));

      console.log(
        `[camera-tool LIVE] Found ${onlineCameras.length} online camera(s), running all in parallel`
      );
    }, 30_000);

    it("fetches a base64 image for every online camera in parallel", async () => {
      expect(onlineCameras.length).toBeGreaterThan(0);

      const results: TestResult[] = await rateLimitedMap(
        onlineCameras,
        async (cam): Promise<TestResult> => {
          try {
            const result = await handler(
              { cameraUuid: cam.uuid, requestType: "image", timestampISO: null },
              {}
            );

            const imagePart = findImageContent(result);
            const textPart = findTextContent(result);
            const meta = textPart ? JSON.parse(textPart.text) : {};

            if (imagePart && meta.success) {
              return { name: cam.name, success: true };
            }
            return {
              name: cam.name,
              success: false,
              error: meta.status ?? "no image part returned",
            };
          } catch (err: unknown) {
            return {
              name: cam.name,
              success: false,
              error: err instanceof Error ? err.message : String(err),
            };
          }
        },
        10 // max 10 requests per second
      );

      printResultsTable("Image Fetch Results — All Online Cameras", results);

      // At least 80% of cameras should succeed
      const successRate = results.filter(r => r.success).length / results.length;
      expect(successRate).toBeGreaterThanOrEqual(0.8);
    }, 120_000); // rate-limited to 5/s — ceil(numCameras / 5) s of throttle + network time
  });
});
