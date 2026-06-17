import { describe, it, expect, vi, beforeEach } from "vitest";
import * as network from "../../src/network/network.js";
import { getImageForCameraAtTime } from "../../src/api/camera-tool-api.js";

vi.mock("../../src/network/network.js");

const UUID = "testCameraUUID1234567";

/** Convenience: the body of the first postApi call. */
function firstBody(): Record<string, unknown> {
  return vi.mocked(network.postApi).mock.calls[0][0].body as Record<string, unknown>;
}

describe("getImageForCameraAtTime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls /video/getExactFrameData and returns base64 from frameData", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: false, frameData: "BASE64==" } as never);

    const res = await getImageForCameraAtTime(UUID, 1700000000000);

    expect(res).toEqual({
      success: true,
      status: "successfully fetched image",
      imageType: "base64",
      imageData: "BASE64==",
    });

    const call = vi.mocked(network.postApi).mock.calls[0][0];
    expect(call.route).toBe("/video/getExactFrameData");
    expect(call.body).toMatchObject({
      cameraUuid: UUID,
      timestampMs: 1700000000000,
      downscaleFactor: 10,
      jpgQuality: 70,
    });
  });

  it("omits permyriadCrop fields when no crop is given (full frame)", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: false, frameData: "X" } as never);

    await getImageForCameraAtTime(UUID, 1);

    const body = firstBody();
    expect(body).not.toHaveProperty("permyriadCropX");
    expect(body).not.toHaveProperty("permyriadCropY");
    expect(body).not.toHaveProperty("permyriadCropWidth");
    expect(body).not.toHaveProperty("permyriadCropHeight");
  });

  it("translates percentage crop to permyriad", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: false, frameData: "X" } as never);

    await getImageForCameraAtTime(UUID, 1, undefined, undefined, {
      crop: { x: 50, y: 0, width: 25, height: 10 },
    });

    const body = firstBody();
    expect(body.permyriadCropX).toBe(5000);
    expect(body.permyriadCropY).toBe(0);
    expect(body.permyriadCropWidth).toBe(2500);
    expect(body.permyriadCropHeight).toBe(1000);
  });

  it("defaults missing crop edges (x/y -> 0, width/height -> 100) when a partial crop is given", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: false, frameData: "X" } as never);

    await getImageForCameraAtTime(UUID, 1, undefined, undefined, { crop: { width: 50 } });

    const body = firstBody();
    expect(body.permyriadCropX).toBe(0);
    expect(body.permyriadCropY).toBe(0);
    expect(body.permyriadCropWidth).toBe(5000);
    expect(body.permyriadCropHeight).toBe(10000);
  });

  it("uses a provided downscaleFactor", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: false, frameData: "X" } as never);

    await getImageForCameraAtTime(UUID, 1, undefined, undefined, { downscaleFactor: 2 });

    expect(firstBody().downscaleFactor).toBe(2);
  });

  it("returns failure when response.error is true", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: true, errorMsg: "no video here" } as never);

    const res = await getImageForCameraAtTime(UUID, 1);

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.status).toBe("failed to fetch image");
      expect(res.message).toBe("no video here");
    }
  });

  it("returns failure when frameData is missing", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: false } as never);

    const res = await getImageForCameraAtTime(UUID, 1);
    expect(res.success).toBe(false);
  });
});
