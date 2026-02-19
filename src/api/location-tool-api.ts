import { postApi } from "../network.js";
import schema from "../types/schema.js";
import { RequestModifiers } from "../util.js";

export async function getLocations(requestModifiers?: RequestModifiers, sessionId?: string) {
  const res = await postApi<any>({
    route: "/location/getLocationsV2",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });

  return {
    locations: (res.locations || []).map((loc: any) => ({
      uuid: loc.uuid ?? undefined,
      name: loc.name ?? undefined,
    })),
  };
}

export async function createLocation(
  name: string,
  address?: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Location_CreateLocationWSResponse"]>({
    route: "/location/createLocation",
    body: { name, address: address || undefined },
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));
  return { uuid: (res as any).locationUuid ?? res.uuid ?? undefined, success: true };
}

export async function updateLocation(
  locationUuid: string,
  name?: string,
  address?: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const body: any = { locationUuid };
  if (name) body.name = name;
  if (address) body.address = address;
  const res = await postApi<schema["Location_UpdateLocationWSResponse"]>({
    route: "/location/updateLocation",
    body,
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));
  return { success: true };
}

export async function getLocationLabels(requestModifiers?: RequestModifiers, sessionId?: string) {
  const res = await postApi<schema["Location_GetLocationLabelsForOrgWSResponse"]>({
    route: "/location/getLocationLabelsForOrg",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
  if (res.error) throw new Error(JSON.stringify(res));
  return ((res as any).locationLabels || []).map((label: any) => ({
    uuid: label.uuid ?? undefined,
    name: label.name ?? undefined,
  }));
}
