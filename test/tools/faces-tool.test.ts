import { beforeEach, describe, expect, it, vi } from "vitest";
import * as facesApi from "../../src/api/faces-tool-api.js";
import { createTool } from "../../src/tools-console/faces-tool.js";
import { RequestType, type ToolArgs } from "../../src/types/faces-tools-types.js";
import { captureToolHandler, findTextContent } from "../utils.js";

vi.mock("../../src/api/faces-tool-api.js");

const LOCATION_A = "xrNOliv7T4WVovIR7FvPjQ";
const LOCATION_B = "lhhPp3i7TTG2SSeKWm9IOw";

type FaceEvent = {
  faceName?: string;
  eventTimestamp?: string;
  eventTimestampMs?: number;
};

function makeArgs(overrides: {
  locationUuids?: string[];
  lastEvaluatedKey?: string | null;
}): ToolArgs {
  return {
    requestType: RequestType.GET_FACE_EVENTS,
    faceEventFilter: {
      pageRequest: {
        lastEvaluatedKey: overrides.lastEvaluatedKey ?? null,
        maxPageSize: 200,
      },
      searchFilter: {
        faceNameContains: null,
        faceNames: [],
        hasEmbedding: null,
        hasName: null,
        labels: [],
        locationUuids: overrides.locationUuids ?? [],
        personUuids: [],
        timestampFilter: {
          rangeStart: "2026-07-27T15:20:00-07:00",
          rangeEnd: "2026-08-03T15:20:00-07:00",
        },
      },
    },
    timeZone: "America/Los_Angeles",
    faceEventUuid: null,
    personUuid: null,
    includeFields: null,
    filterBy: null,
  } as ToolArgs;
}

async function callTool(args: ToolArgs) {
  const handler = captureToolHandler<ToolArgs>(createTool);
  const result = await handler(args, {});
  return JSON.parse(findTextContent(result)!.text);
}

function event(faceName: string | undefined, ms: number, label: string): FaceEvent {
  return { faceName, eventTimestampMs: ms, eventTimestamp: label };
}

describe("faces-tool get-face-events", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("faceEventSummary", () => {
    it("rolls a page up into a distinct-person roster ordered by event count", async () => {
      vi.mocked(facesApi.getFaceEvents).mockResolvedValue({
        faceEvents: [
          event("Jess", 300, "August 3, 2026 at 3:00:00 PM"),
          event("Alex", 200, "August 3, 2026 at 2:00:00 PM"),
          event("Jess", 100, "August 3, 2026 at 1:00:00 PM"),
          event("Kyle Krueger", 400, "August 3, 2026 at 4:00:00 PM"),
          event("Jess", 500, "August 3, 2026 at 5:00:00 PM"),
        ],
        lastEvaluatedKey: null,
        // biome-ignore lint/suspicious/noExplicitAny: partial API shape for the test
      } as any);

      const output = await callTool(makeArgs({}));

      expect(output.faceEventSummary.identifiedPeople).toEqual([
        {
          name: "Jess",
          eventCount: 3,
          firstSeen: "August 3, 2026 at 1:00:00 PM",
          lastSeen: "August 3, 2026 at 5:00:00 PM",
        },
        { name: "Alex", eventCount: 1, firstSeen: "August 3, 2026 at 2:00:00 PM", lastSeen: "August 3, 2026 at 2:00:00 PM" },
        {
          name: "Kyle Krueger",
          eventCount: 1,
          firstSeen: "August 3, 2026 at 4:00:00 PM",
          lastSeen: "August 3, 2026 at 4:00:00 PM",
        },
      ]);
      expect(output.faceEventSummary.totalEventsThisPage).toBe(5);
      expect(output.faceEventSummary.namedEvents).toBe(5);
      expect(output.faceEventSummary.unnamedEvents).toBe(0);
    });

    it("counts unnamed detections separately instead of listing them as people", async () => {
      vi.mocked(facesApi.getFaceEvents).mockResolvedValue({
        faceEvents: [
          event("Jess", 300, "August 3, 2026 at 3:00:00 PM"),
          event(undefined, 200, "August 3, 2026 at 2:00:00 PM"),
          event("   ", 100, "August 3, 2026 at 1:00:00 PM"),
        ],
        lastEvaluatedKey: null,
        // biome-ignore lint/suspicious/noExplicitAny: partial API shape for the test
      } as any);

      const output = await callTool(makeArgs({}));

      expect(output.faceEventSummary.namedEvents).toBe(1);
      expect(output.faceEventSummary.unnamedEvents).toBe(2);
      expect(output.faceEventSummary.identifiedPeople).toHaveLength(1);
    });

    it("flags that more pages exist whenever a cursor came back", async () => {
      vi.mocked(facesApi.getFaceEvents).mockResolvedValue({
        faceEvents: [event("Jess", 300, "August 3, 2026 at 3:00:00 PM")],
        lastEvaluatedKey: "cursor-abc",
        // biome-ignore lint/suspicious/noExplicitAny: partial API shape for the test
      } as any);

      const output = await callTool(makeArgs({}));

      expect(output.faceEventSummary.morePagesAvailable).toBe(true);
      expect(output.lastEvaluatedKey).toBe("cursor-abc");
    });
  });

  describe("location filter fallback", () => {
    it("says so when an empty location-scoped search is silently retried org-wide", async () => {
      vi.mocked(facesApi.getFaceEvents)
        // biome-ignore lint/suspicious/noExplicitAny: partial API shape for the test
        .mockResolvedValueOnce({ faceEvents: [], lastEvaluatedKey: null } as any)
        .mockResolvedValueOnce({
          faceEvents: [event("Jess", 300, "August 3, 2026 at 3:00:00 PM")],
          lastEvaluatedKey: null,
          // biome-ignore lint/suspicious/noExplicitAny: partial API shape for the test
        } as any);

      const output = await callTool(makeArgs({ locationUuids: [LOCATION_A, LOCATION_B] }));

      // Without this the caller cannot distinguish org-wide results from
      // location-scoped ones and reports them as sightings at the location the
      // user named (the 2026-08-03 prod transcript).
      expect(output.note).toContain("SCOPE CHANGED");
      expect(output.note).toContain(LOCATION_A);
      expect(output.note).toContain(LOCATION_B);
      expect(output.getFaceEventsResponse).toHaveLength(1);
    });

    it("distinguishes 'nothing here' from 'nothing anywhere'", async () => {
      vi.mocked(facesApi.getFaceEvents).mockResolvedValue({
        faceEvents: [],
        lastEvaluatedKey: null,
        // biome-ignore lint/suspicious/noExplicitAny: partial API shape for the test
      } as any);

      const output = await callTool(makeArgs({ locationUuids: [LOCATION_A] }));

      expect(output.note).toContain("none org-wide");
      expect(output.note).not.toContain("SCOPE CHANGED");
    });

    it("adds no note when the location filter matched on the first try", async () => {
      vi.mocked(facesApi.getFaceEvents).mockResolvedValue({
        faceEvents: [event("Jess", 300, "August 3, 2026 at 3:00:00 PM")],
        lastEvaluatedKey: null,
        // biome-ignore lint/suspicious/noExplicitAny: partial API shape for the test
      } as any);

      const output = await callTool(makeArgs({ locationUuids: [LOCATION_A] }));

      expect(output.note).toBeUndefined();
      expect(vi.mocked(facesApi.getFaceEvents)).toHaveBeenCalledTimes(1);
    });
  });
});
