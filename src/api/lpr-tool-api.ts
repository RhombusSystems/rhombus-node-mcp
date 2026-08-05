import { postApi, throwIfApiError } from "../network/network.js";
import type {
  SavedVehicle,
  VehicleEvent,
  VehicleEventsArgs,
  VehicleLabels,
} from "../types/lpr-tool-types.js";
import { schema } from "../types/schema.js";
import { formatTimestamp, type RequestModifiers } from "../util.js";

export async function getVehicleEvents(
  args: VehicleEventsArgs,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<VehicleEvent[]> {
  const requestArgs: schema["Vehicle_GetVehicleEventsWSRequest"] = {
    deviceUuidFilter: args.deviceUuidFilter,
    locationUuidFilter: args.locationUuidFilter,
    vehicleLabelQuery: args.vehicleLabelQuery,
    licensePlateFuzzyQuery: args.licensePlateFuzzyQuery,
    startTimeMs: args.startTime ? new Date(args.startTime).getTime() : undefined,
    endTimeMs: args.endTime ? new Date(args.endTime).getTime() : undefined,
  };

  const res = await postApi<schema["Vehicle_GetVehicleEventsWSResponse"]>({
    route: "/vehicle/getVehicleEvents",
    body: requestArgs,
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return (
    res.events?.map(
      event =>
        ({
          uuid: event.uuid ?? "",
          deviceUuid: event.deviceUuid ?? undefined,
          eventTimestamp: formatTimestamp(event.eventTimestamp ?? Date.now(), timeZone),
          imageS3Key: event.imageS3Key ?? undefined,
          thumbnailS3Key: event.thumbnailS3Key ?? undefined,
          locationUuid: event.locationUuid ?? undefined,
          vehicleLicensePlate: event.vehicleLicensePlate ?? "No License Plate",
        }) satisfies VehicleEvent
    ) ?? []
  );
}

export async function getSavedVehicles(
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<SavedVehicle[]> {
  const res = await postApi<schema["Vehicle_GetVehiclesWSResponse"]>({
    route: "/vehicle/getVehicles",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  return (
    res.vehicles?.map(
      vehicle =>
        ({
          createdTimestamp: formatTimestamp(vehicle.createdAtMillis ?? Date.now(), timeZone),
          name: vehicle.name ?? "No Name",
          description: vehicle.description ?? "No Description",
          licensePlate: vehicle.licensePlate ?? "No License Plate",
          orgUuid: vehicle.orgUuid ?? "",
        }) satisfies SavedVehicle
    ) ?? []
  );
}

export async function getVehicleLabels(
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<VehicleLabels> {
  const res = await postApi<schema["Vehicle_GetVehicleLabelsForOrgWSResponse"]>({
    route: "/vehicle/getVehicleLabelsForOrg",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });

  throwIfApiError(res);

  const processedVehicleLabels: VehicleLabels = {};

  for (const [licensePlate, labels] of Object.entries(res.vehicleLabels ?? {})) {
    const filteredLabels = labels?.filter(label => label !== null) ?? [];

    if (!filteredLabels || filteredLabels.length === 0) {
      continue;
    }

    processedVehicleLabels[licensePlate] = filteredLabels;
  }

  return processedVehicleLabels;
}

export async function searchLicensePlates(
  query: string,
  timeZone: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<any[]> {
  const res = await postApi<schema["Search_SearchLicensePlatesWSRequest"] & any>({
    route: "/search/searchLicensePlates",
    body: { licensePlateQuery: query },
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  return (res.licensePlateEvents || []).map((event: any) => ({
    licensePlate: event.vehicleLicensePlate ?? undefined,
    deviceUuid: event.deviceUuid ?? undefined,
    timestampMs: event.eventTimestamp ?? undefined,
  }));
}

/**
 * Save (or overwrite) a vehicle. The plate is the key, so calling this for a
 * plate that already exists replaces its name and description.
 *
 * NOTE the field-name asymmetry, which this used to get wrong: the REQUEST
 * field is `vehicleLicensePlate` (`Vehicle_SaveVehicleWSRequest`) while the
 * READ field is `licensePlate` (`VehicleV2Type`). Sending `licensePlate` here
 * silently saved a vehicle with no plate attached.
 */
export async function saveVehicle(
  name: string,
  licensePlate: string,
  description?: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Vehicle_SaveVehicleWSResponse"]>({
    route: "/vehicle/saveVehicle",
    body: {
      name,
      vehicleLicensePlate: licensePlate,
      description: description || "",
    } satisfies schema["Vehicle_SaveVehicleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  return { success: true, licensePlate, warningMsg: res.warningMsg ?? undefined };
}

export async function deleteVehicle(
  licensePlate: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Vehicle_DeleteVehicleWSResponse"]>({
    route: "/vehicle/deleteVehicle",
    body: {
      vehicleLicensePlate: licensePlate,
    } satisfies schema["Vehicle_DeleteVehicleWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  return { success: true, licensePlate, warningMsg: res.warningMsg ?? undefined };
}

export async function addVehicleLabel(
  licensePlate: string,
  label: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Vehicle_AddVehicleLabelWSResponse"]>({
    route: "/vehicle/addVehicleLabel",
    body: {
      vehicleLicensePlate: licensePlate,
      label,
    } satisfies schema["Vehicle_AddVehicleLabelWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  return { success: true, licensePlate, label, warningMsg: res.warningMsg ?? undefined };
}

export async function removeVehicleLabel(
  licensePlate: string,
  label: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Vehicle_RemoveVehicleLabelWSResponse"]>({
    route: "/vehicle/removeVehicleLabel",
    body: {
      vehicleLicensePlate: licensePlate,
      label,
    } satisfies schema["Vehicle_RemoveVehicleLabelWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  return { success: true, licensePlate, label, warningMsg: res.warningMsg ?? undefined };
}

/** The raw saved vehicle, for the exists-checks the write paths need. */
export async function findSavedVehicle(
  licensePlate: string,
  requestModifiers?: RequestModifiers,
  sessionId?: string
) {
  const res = await postApi<schema["Vehicle_GetVehiclesWSResponse"]>({
    route: "/vehicle/getVehicles",
    body: {},
    modifiers: requestModifiers,
    sessionId,
  });
  throwIfApiError(res);
  const normalized = licensePlate.trim().toUpperCase();
  return res.vehicles?.find(
    vehicle => vehicle?.licensePlate?.trim().toUpperCase() === normalized
  );
}
