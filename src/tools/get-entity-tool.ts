import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createToolArgs } from "../util.js";
import { BASE_URL, postApi } from "../network.js";

async function getCameraList(requestModifiers?: any) {
  const url = BASE_URL + "/camera/getMinimalCameraStateList";
  return await postApi(url, "{}", requestModifiers).then(response => {
    return {
      cameraStates: response.cameraStates.filter(
        (camera: { locationUuid?: string }) => !!camera.locationUuid
      ),
    };
  });
}

async function getAccessControlledDoors(requestModifiers?: any) {
  const url = BASE_URL + "/component/findAccessControlledDoors";
  return await postApi(url, "{}", requestModifiers);
}

export function createTool(server: McpServer) {
  server.tool(
    "get-entity-tool",
    "get a list of entities like cameras, access controlled doors, sensors, etc",
    createToolArgs({
      entityType: z
        .enum(["camera", "access-controlled-doors"])
        .describe("The entity type to retreive.  Example: cameras."),
    }),
    async ({ entityType, requestModifiers }) => {
      let ret;
      switch (entityType) {
        case "camera":
          ret = await getCameraList(requestModifiers);
          break;
        case "access-controlled-doors":
          ret = await getAccessControlledDoors(requestModifiers);
          break;
        default:
          ret = {};
          break;
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(ret),
          },
        ],
      };
    }
  );
}
