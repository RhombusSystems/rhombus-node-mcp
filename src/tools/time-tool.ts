import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { parse } from "chrono-node";
import { DateTime } from "luxon";

function nullToUndefined(value: number | null): number | undefined {
  return value === null ? undefined : value;
}

export function createTool(server: McpServer) {
  server.tool(
    "time-tool",
    "Tool for converting a natural language time description into a timestamp in milliseconds.",
    {
      time_description: z
        .string()
        .describe(
          "A natural language description of the time (e.g., '2pm today', 'tomorrow at noon')."
        ),
      timezone: z
        .nullable(z.string())
        .describe(
          "Optional IANA timezone string (e.g., 'America/Los_Angeles', 'UTC'). Defaults to system timezone."
        ),
    },
    async ({ time_description, timezone }) => {
      // console.error(`🕛 handling tool call for time ${time_description} using timezone ${timezone}`);
      const now = DateTime.now()
        .setZone(timezone || undefined)
        .toJSDate();
      const parsed = parse(time_description, now, { forwardDate: true });

      if (!parsed || parsed.length === 0) {
        throw new Error(`Could not parse time description: ${time_description}`);
      }

      const dateComponents = parsed[0].start;
      if (!dateComponents) {
        throw new Error("Parsed time has no start component");
      }

      const dt = DateTime.fromObject(
        {
          year: nullToUndefined(dateComponents.get("year")),
          month: nullToUndefined(dateComponents.get("month")),
          day: nullToUndefined(dateComponents.get("day")),
          hour: nullToUndefined(dateComponents.get("hour")),
          minute: nullToUndefined(dateComponents.get("minute")),
          second: nullToUndefined(dateComponents.get("second")),
          millisecond: 0,
        },
        {
          zone: timezone || "local",
        }
      );

      if (!dt.isValid) {
        throw new Error(`Could not construct valid DateTime: ${dt.invalidReason}`);
      }

      const timestamp = dt.toMillis();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              timestamp,
              iso: dt.toISO(),
              timezone: dt.zoneName,
            }),
          },
        ],
      };
    }
  );
}
