import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

// Removed circular reference types
// Removed circular reference types
// Removed circular reference type
type AccessControlCredentialType = Partial<{
  createdAtMillis: number | null;
  endDateEpochSecExclusive: number | null;
  lastUsedAccessControlledDoorUuid: string | null;
  lastUsedAtMillis: number | null;
  lastUsedLocationUuid: string | null;
  lowercaseHexValue: string | null;
  managedCredUuid: string | null;
  orgUuid: string | null;
  startDateEpochSecInclusive: number | null;
  type: AccessControlCredentialEnumType;
  updatedAtMillis: number | null;
  userUuid: string | null;
  uuid: string | null;
  value: string | null;
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType;
}>;
type AccessControlCredentialEnumType =
  | "STANDARD_CSN"
  | "RHOMBUS_SECURE_CSN"
  | "RHOMBUS_SECURE_MOBILE"
  | "WIEGAND_H10301"
  | "WIEGAND_64BIT_RAW";
type AccessControlCredentialWorkflowStatusEnumType =
  | "ACTIVE"
  | "UNASSIGNED"
  | "SUSPENDED"
  | "REVOKED";
// Removed circular reference types
// Removed circular reference types
type BodyPart = Partial<{
  contentDisposition: ContentDisposition;
  entity: {};
  headers: Partial<
    {
      empty: boolean | null;
    } & {
      [key: string]: Array<string | null> | null;
    }
  >;
  mediaType: MediaType;
  messageBodyWorkers: MessageBodyWorkers;
  parameterizedHeaders: Partial<
    {
      empty: boolean | null;
    } & {
      [key: string]: Array<ParameterizedHeader> | null;
    }
  >;
  parent: MultiPart;
  providers: Providers;
}>;
type ContentDisposition = Partial<{
  creationDate: string | null;
  fileName: string | null;
  modificationDate: string | null;
  parameters: {};
  readDate: string | null;
  size: number | null;
  type: string | null;
}>;
type MediaType = Partial<{
  parameters: {};
  subtype: string | null;
  type: string | null;
  wildcardSubtype: boolean | null;
  wildcardType: boolean | null;
}>;
type MessageBodyWorkers = {};
type ParameterizedHeader = Partial<{
  parameters: {};
  value: string | null;
}>;
type Providers = {};
// Removed circular reference type
type MultiPart = Partial<{
  bodyParts: Array<BodyPart> | null;
  contentDisposition: ContentDisposition;
  entity: {};
  headers: Partial<
    {
      empty: boolean | null;
    } & {
      [key: string]: Array<string | null> | null;
    }
  >;
  mediaType: MediaType;
  messageBodyWorkers: MessageBodyWorkers;
  parameterizedHeaders: Partial<
    {
      empty: boolean | null;
    } & {
      [key: string]: Array<ParameterizedHeader> | null;
    }
  >;
  parent: MultiPart;
  providers: Providers;
}>;
// Removed circular reference type

const Accesscontrol_group_AddUsersToAccessControlGroupWSRequest = z
  .object({
    groupUuid: z.string().nullable(),
    userUuids: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const OrgGroupMemberType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    groupUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    type: z.literal("RHOMBUS_ACCESS_CONTROL").nullable(),
    updatedAtMillis: z.number().int().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_group_AddUsersToAccessControlGroupWSResponse = z
  .object({ groupMembers: z.array(OrgGroupMemberType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_AssignAccessControlCredentialWSRequest = z
  .object({ credentialHexValue: z.string().nullable(), userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const AccessControlCredentialEnumType = z.enum([
  "STANDARD_CSN",
  "RHOMBUS_SECURE_CSN",
  "RHOMBUS_SECURE_MOBILE",
  "WIEGAND_H10301",
  "WIEGAND_64BIT_RAW",
]);
const AccessControlCredentialWorkflowStatusEnumType = z.enum([
  "ACTIVE",
  "UNASSIGNED",
  "SUSPENDED",
  "REVOKED",
]);
const AccessControlCredentialType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    endDateEpochSecExclusive: z.number().int().nullable(),
    lastUsedAccessControlledDoorUuid: z.string().nullable(),
    lastUsedAtMillis: z.number().int().nullable(),
    lastUsedLocationUuid: z.string().nullable(),
    lowercaseHexValue: z.string().nullable(),
    managedCredUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    startDateEpochSecInclusive: z.number().int().nullable(),
    type: AccessControlCredentialEnumType,
    updatedAtMillis: z.number().int().nullable(),
    userUuid: z.string().nullable(),
    uuid: z.string().nullable(),
    value: z.string().nullable(),
    workflowStatus: AccessControlCredentialWorkflowStatusEnumType,
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_AssignAccessControlCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_CreateAccessControlGroupWSRequest = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    userUuids: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const OrgGroupType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    type: z.literal("RHOMBUS_ACCESS_CONTROL").nullable(),
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_CreateAccessControlGroupWSResponse = z
  .object({ group: OrgGroupType, groupMembers: z.array(OrgGroupMemberType).nullable() })
  .partial()
  .passthrough();
const LocationAccessGrantType = z
  .object({
    accessControlledDoorUuids: z.array(z.string().nullable()).nullable(),
    createdAtMillis: z.number().int().nullable(),
    doorLabelIds: z.array(z.string().nullable()).nullable(),
    groupUuids: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduleUuid: z.string().nullable(),
    sortKey: z.string().nullable(),
    storedInS3: z.boolean().nullable(),
    updatedAtMillis: z.number().int().nullable(),
    userUuids: z.array(z.string().nullable()).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_CreateAccessGrantWSRequest = z
  .object({ accessGrant: LocationAccessGrantType })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_CreateAccessGrantWSResponse = z
  .object({ accessGrant: LocationAccessGrantType })
  .partial()
  .passthrough();
const LocationAccessRevocationType = z
  .object({
    accessControlledDoorUuids: z.array(z.string().nullable()).nullable(),
    createdAtMillis: z.number().int().nullable(),
    doorLabelIds: z.array(z.string().nullable()).nullable(),
    groupUuids: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduleUuid: z.string().nullable(),
    sortKey: z.string().nullable(),
    storedInS3: z.boolean().nullable(),
    updatedAtMillis: z.number().int().nullable(),
    userUuids: z.array(z.string().nullable()).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_CreateAccessRevocationWSRequest = z
  .object({ accessRevocation: LocationAccessRevocationType })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_CreateAccessRevocationWSResponse = z
  .object({ accessRevocation: LocationAccessRevocationType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_CreateAppleWalletPassWSRequest = z
  .object({ credUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_CreateRhombusSecureCsnCredentialWSRequest = z
  .object({
    credentialValue: z.string().nullable(),
    endDateEpochSecExclusive: z.number().int().nullable(),
    startDateEpochSecInclusive: z.number().int().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_CreateRhombusSecureCsnCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_CreateStandardCsnCredentialWSRequest = z
  .object({
    credentialValue: z.string().nullable(),
    endDateEpochSecExclusive: z.number().int().nullable(),
    startDateEpochSecInclusive: z.number().int().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_CreateStandardCsnCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_CreateWiegandCredentialWSRequest = z
  .object({
    cardNumber: z.number().int().nullable(),
    companyId: z.number().int().nullable(),
    endDateEpochSecExclusive: z.number().int().nullable(),
    facilityCode: z.number().int().nullable(),
    siteCode: z.number().int().nullable(),
    startDateEpochSecInclusive: z.number().int().nullable(),
    userUuid: z.string().nullable(),
    value: z.string().nullable(),
    wiegandFormat: z.enum(["H10301", "H10302", "WIEGAND_64BIT_RAW", "HID_CORP1000"]).nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_CreateWiegandCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_DeleteAccessControlCredentialWSRequest = z
  .object({ credentialUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_DeleteAccessControlCredentialWSResponse = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_group_DeleteAccessControlGroupWSRequest = z
  .object({ groupUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_DeleteAccessControlGroupWSResponse = z.object({}).partial().passthrough();
const Accesscontrol_accessgrant_DeleteLocationAccessGrantWSRequest = z
  .object({ accessGrantUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_DeleteLocationAccessGrantWSResponse = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_DeleteLocationAccessRevocationWSRequest = z
  .object({ accessRevocationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_DeleteLocationAccessRevocationWSResponse = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_credentials_DeleteUnassignedAccessControlCredentialWSRequest = z
  .object({ credentialHexValue: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_DeleteUnassignedAccessControlCredentialWSResponse = z
  .object({})
  .partial()
  .passthrough();
const AccessControlledDoorStateEnumType = z.enum(["UNLOCKED", "ACCESS_CONTROLLED"]);
const LocalInterval = z
  .object({
    localEndDateTime: z.string().nullable(),
    localStartDateTime: z.string().nullable(),
    state: AccessControlledDoorStateEnumType,
  })
  .passthrough();
const DoorScheduleExceptionType = z
  .object({
    createdAtMillis: z.number().int().nullish(),
    defaultState: AccessControlledDoorStateEnumType.optional(),
    description: z.string().nullish(),
    doorUuids: z.array(z.string().nullable()).nullable(),
    intervals: z.array(LocalInterval).nullable(),
    localEndDate: z.string().nullable(),
    localStartDate: z.string().nullable(),
    locationUuid: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullish(),
    updatedAtMillis: z.number().int().nullish(),
    uuid: z.string().nullish(),
  })
  .passthrough();
const Accesscontrol_doorexception_CreateDoorScheduleExceptionWSRequest = z
  .object({ exception: DoorScheduleExceptionType })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_CreateDoorScheduleExceptionWSResponse = z
  .object({ exception: DoorScheduleExceptionType })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSRequest = z
  .object({ exceptionUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSResponse = z
  .object({ exceptionUuid: z.string().nullable(), orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const DateRangeFilter = z
  .object({
    localEndDateRangeEnd: z.string().nullable(),
    localEndDateRangeStart: z.string().nullable(),
    localStartDateRangeEnd: z.string().nullable(),
    localStartDateRangeStart: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_FindDoorScheduleExceptionsWSRequest = z
  .object({ dateRangeFilter: DateRangeFilter })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_FindDoorScheduleExceptionsWSResponse = z
  .object({ exceptions: z.array(DoorScheduleExceptionType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSRequest = z
  .object({ dateRangeFilter: DateRangeFilter, doorUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSResponse = z
  .object({ exceptions: z.array(DoorScheduleExceptionType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSRequest = z
  .object({ dateRangeFilter: DateRangeFilter, locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSResponse = z
  .object({ exceptions: z.array(DoorScheduleExceptionType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_GetDoorScheduleExceptionWSRequest = z
  .object({ exceptionUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_GetDoorScheduleExceptionWSResponse = z
  .object({ exception: DoorScheduleExceptionType })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSRequest = z
  .object({ exception: DoorScheduleExceptionType })
  .partial()
  .passthrough();
const Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSResponse = z
  .object({ exception: DoorScheduleExceptionType })
  .partial()
  .passthrough();
const CredentialQueryFilter = z
  .object({
    credTypeFilter: z
      .array(
        z
          .enum([
            "STANDARD_CSN",
            "RHOMBUS_SECURE_CSN",
            "RHOMBUS_SECURE_MOBILE",
            "WIEGAND_H10301",
            "WIEGAND_64BIT_RAW",
          ])
          .nullable()
      )
      .nullable(),
    lastUsedAccessControlledDoorUuidFilter: z.array(z.string().nullable()).nullable(),
    lastUsedAfterFilter: z.number().int().nullable(),
    lastUsedBeforeFilter: z.number().int().nullable(),
    lastUsedLocationUuidFilter: z.array(z.string().nullable()).nullable(),
    workflowStatusFilter: z
      .array(z.enum(["ACTIVE", "UNASSIGNED", "SUSPENDED", "REVOKED"]).nullable())
      .nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindAccessControlCredentialByOrgWSRequest = z
  .object({ filter: CredentialQueryFilter })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindAccessControlCredentialByOrgWSResponse = z
  .object({ credentials: z.array(AccessControlCredentialType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindAccessControlCredentialByUserWSRequest = z
  .object({ filter: CredentialQueryFilter, userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindAccessControlCredentialByUserWSResponse = z
  .object({ credentials: z.array(AccessControlCredentialType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindAccessControlCredentialByUsersWSRequest = z
  .object({ filter: CredentialQueryFilter, userUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindAccessControlCredentialByUsersWSResponse = z
  .object({
    userCredentialsMap: z.record(z.array(AccessControlCredentialType).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupsByExactNameWSRequest = z
  .object({ groupName: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupsByExactNameWSResponse = z
  .object({ group: OrgGroupType })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupMembershipsByUserWSRequest = z
  .object({ userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupMembershipsByUserWSResponse = z
  .object({ userGroupMemberships: z.array(OrgGroupMemberType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupMembershipsForCurrentUserWSRequest = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupMembershipsForCurrentUserWSResponse = z
  .object({ userGroupMemberships: z.array(OrgGroupMemberType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupsByNamePrefixWSRequest = z
  .object({ groupNamePrefix: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupsByNamePrefixWSResponse = z
  .object({ groups: z.array(OrgGroupType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupsByOrgWSRequest = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupsByOrgWSResponse = z
  .object({ groups: z.array(OrgGroupType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupsByUserMembershipWSRequest = z
  .object({ userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAccessControlGroupsByUserMembershipWSResponse = z
  .object({ groups: z.array(OrgGroupType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAllUsersForAccessControlGroupWSRequest = z
  .object({ groupUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_group_FindAllUsersForAccessControlGroupWSResponse = z
  .object({ groupMembers: z.array(OrgGroupMemberType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindCredentialHistoryByCredentialHexValueWSRequest = z
  .object({ credentialHexValue: z.string().nullable(), filter: CredentialQueryFilter })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindCredentialHistoryByCredentialHexValueWSResponse = z
  .object({ credentials: z.array(AccessControlCredentialType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindCredentialHistoryByCredentialValueWSRequest = z
  .object({
    credentialType: z
      .enum([
        "STANDARD_CSN",
        "RHOMBUS_SECURE_CSN",
        "RHOMBUS_SECURE_MOBILE",
        "WIEGAND_H10301",
        "WIEGAND_64BIT_RAW",
      ])
      .nullable(),
    credentialValue: z.string().nullable(),
    filter: CredentialQueryFilter,
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindCredentialHistoryByCredentialValueWSResponse = z
  .object({ credentials: z.array(AccessControlCredentialType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindCredentialHistoryByUserWSRequest = z
  .object({ filter: CredentialQueryFilter, userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindCredentialHistoryByUserWSResponse = z
  .object({ credentials: z.array(AccessControlCredentialType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByAccessControlledDoorWSRequest = z
  .object({ accessControlledDoorUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByAccessControlledDoorWSResponse = z
  .object({ accessGrants: z.array(LocationAccessGrantType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByDoorLabelWSRequest = z
  .object({ doorLabelId: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByDoorLabelWSResponse = z
  .object({ accessGrants: z.array(LocationAccessGrantType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByGroupWSRequest = z
  .object({ groupUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByGroupWSResponse = z
  .object({ accessGrants: z.array(LocationAccessGrantType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSResponse = z
  .object({ accessGrants: z.array(LocationAccessGrantType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationAndUserWSRequest = z
  .object({ locationUuid: z.string().nullable(), userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationAndUserWSResponse = z
  .object({ accessGrants: z.array(LocationAccessGrantType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSRequest = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSResponse = z
  .object({ accessGrants: z.array(LocationAccessGrantType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByUserWSRequest = z
  .object({ userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_FindLocationAccessGrantsByUserWSResponse = z
  .object({ accessGrants: z.array(LocationAccessGrantType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByAccessControlledDoorWSRequest =
  z.object({ accessControlledDoorUuid: z.string().nullable() }).partial().passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByAccessControlledDoorWSResponse =
  z
    .object({ accessRevocations: z.array(LocationAccessRevocationType).nullable() })
    .partial()
    .passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByDoorLabelWSRequest = z
  .object({ doorLabelId: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByDoorLabelWSResponse = z
  .object({ accessRevocations: z.array(LocationAccessRevocationType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByGroupWSRequest = z
  .object({ groupUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByGroupWSResponse = z
  .object({ accessRevocations: z.array(LocationAccessRevocationType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByOrgWSRequest = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByOrgWSResponse = z
  .object({ accessRevocations: z.array(LocationAccessRevocationType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByUserWSRequest = z
  .object({ userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByUserWSResponse = z
  .object({ accessRevocations: z.array(LocationAccessRevocationType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindRhombusSecureMobileCredentialsForCurrentUserWSRequest = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_credentials_FindRhombusSecureMobileCredentialsForCurrentUserWSResponse = z
  .object({ credentials: z.array(AccessControlCredentialType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_ForceRefreshAccessControlUnitConfigWSRequest = z
  .object({ accessControlUnitUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_ForceRefreshAccessControlUnitConfigWSResponse = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_GetLocationAccessGrantWSRequest = z
  .object({ accessGrantUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_GetLocationAccessGrantWSResponse = z
  .object({ accessGrant: LocationAccessGrantType })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_GetLocationAccessRevocationWSRequest = z
  .object({ accessRevocationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_GetLocationAccessRevocationWSResponse = z
  .object({ accessRevocation: LocationAccessRevocationType })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_GetLocationsByAccessGrantForCurrentUserWSRequest = z
  .object({})
  .partial()
  .passthrough();
const LockdownPlanScopeEnumType = z.enum(["ORG_LOCKDOWN", "LOCATION_LOCKDOWN"]);
const LockdownPlanReference = z
  .object({
    lockdownPlanUuid: z.string().nullable(),
    scope: LockdownPlanScopeEnumType,
    scopeUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const LocationLockdownStateEnumType = z.enum(["STANDARD_SECURITY", "LOCKED_DOWN"]);
const LocationLockdownStateType = z
  .object({
    activeLockdownPlans: z.array(LockdownPlanReference).nullable(),
    createdAtMillis: z.number().int().nullable(),
    followingTestPlan: z.boolean().nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    state: LocationLockdownStateEnumType,
    stateChangedAtMillis: z.number().int().nullable(),
    updatedAtMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const FloorPlanType = z
  .object({
    eastEdge: z.number().nullable(),
    floorLabel: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    imageUrl: z.string().nullable(),
    mediaUuid: z.string().nullable(),
    northEdge: z.number().nullable(),
    rotation: z.number().nullable(),
    southEdge: z.number().nullable(),
    westEdge: z.number().nullable(),
  })
  .partial()
  .passthrough();
const QualifiedAddressType = z
  .object({
    addressLine2: z.string().nullable(),
    addressline1: z.string().nullable(),
    administrativeArea: z.string().nullable(),
    locality: z.string().nullable(),
    postalCode: z.string().nullable(),
    regionCode: z.string().nullable(),
  })
  .partial()
  .passthrough();
const LocationType = z
  .object({
    address1: z.string().nullish(),
    address2: z.string().nullish(),
    countryCode: z.string().nullish(),
    floorPlans: z.array(FloorPlanType).nullish(),
    labels: z.array(z.string().nullable()).nullish(),
    latitude: z.number().nullish(),
    longitude: z.number().nullish(),
    name: z.string().nullish(),
    policyUuid: z.string().nullish(),
    postalCode: z.string().nullish(),
    qualifiedAddress: QualifiedAddressType.optional(),
    tz: z.string().nullish(),
    uuid: z.string().nullable(),
  })
  .passthrough();
const LockdownActivationPlanType = z
  .object({
    groupUuids: z.array(z.string().nullable()).nullable(),
    rhombusKeyNotificationMessage: z.string().nullable(),
    userUuids: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const LockdownDeactivationPlanType = z
  .object({
    groupUuids: z.array(z.string().nullable()).nullable(),
    rhombusKeyNotificationMessage: z.string().nullable(),
    userUuids: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const DoorLockdownStateEnumType = z.enum([
  "LOCKED_DOWN",
  "ACCESS_CONTROLLED",
  "UNLOCKED",
  "UNKNOWN",
]);
const LockdownPhysicalAccessType = z
  .object({
    groupUuids: z.array(z.string().nullable()).nullable(),
    userUuids: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const LockdownEventRuleTestPlanType = z
  .object({
    allAudioPlaybackRuleActionsAllowed: z.boolean().nullable(),
    allLiveNotificationRuleActionsAllowed: z.boolean().nullable(),
    allTriggerComponentRelayRuleActionsAllowed: z.boolean().nullable(),
    allWebhookRuleActionsAllowed: z.boolean().nullable(),
    allowedAudioPlaybackRuleUuids: z.array(z.string().nullable()).nullable(),
    allowedLiveNotificationRuleUuids: z.array(z.string().nullable()).nullable(),
    allowedTriggerComponentRelayRuleUuids: z.array(z.string().nullable()).nullable(),
    allowedWebhookRuleUuids: z.array(z.string().nullable()).nullable(),
    rhombusKeyNotificationEnabled: z.boolean().nullable(),
    rhombusKeyNotificationOverrideMessage: z.string().nullable(),
  })
  .partial()
  .passthrough();
const LockdownTestPlanType = z
  .object({
    doorStateOverrideEnabled: z.boolean().nullable(),
    lockdownActivatedEvent: LockdownEventRuleTestPlanType,
    lockdownDeactivatedEvent: LockdownEventRuleTestPlanType,
    userAccessOverrideEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const BaseLockdownPlanType = z
  .object({
    activationPlan: LockdownActivationPlanType,
    createdAtMillis: z.number().int().nullable(),
    deactivationPlan: LockdownDeactivationPlanType,
    defaultLockdownState: DoorLockdownStateEnumType,
    doorLockdownStateMap: z.record(DoorLockdownStateEnumType).nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    physicalAccess: LockdownPhysicalAccessType,
    scopeUuid: z.string().nullable(),
    testPlan: LockdownTestPlanType,
    type: LockdownPlanScopeEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_GetLocationsByAccessGrantForCurrentUserWSResponse = z
  .object({
    locationLockdownStates: z.array(LocationLockdownStateType).nullable(),
    locations: z.array(LocationType).nullable(),
    lockdownPlans: z.array(BaseLockdownPlanType).nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_GetMinimalAccessControlledDoorsByLocationForCurrentUserWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const ComponentReferenceType_Minimal = z
  .object({ componentUuid: z.string().nullable(), deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const ComponentCompositeEnumType_Minimal = z.literal("AccessControlledDoor");
const WaveToUnlockSettingsType_Minimal = z
  .object({ enabled: z.boolean().nullable(), minRSSIThreshold: z.number().int().nullable() })
  .partial()
  .passthrough();
const AccessControlledDoorType_Minimal = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    directionRadians: z.number().nullable(),
    dpiComponents: z.array(ComponentReferenceType_Minimal).nullable(),
    floorNumber: z.number().int().nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    readerComponents: z.array(ComponentReferenceType_Minimal).nullable(),
    relayComponents: z.array(ComponentReferenceType_Minimal).nullable(),
    remoteUnlockEnabled: z.boolean().nullable(),
    rexComponents: z.array(ComponentReferenceType_Minimal).nullable(),
    type: ComponentCompositeEnumType_Minimal,
    unlockTimeSec: z.number().int().nullable(),
    uuid: z.string().nullable(),
    waveToUnlockSettings: WaveToUnlockSettingsType_Minimal,
  })
  .partial()
  .passthrough();
const Accesscontrol_GetMinimalAccessControlledDoorsByLocationForCurrentUserWSResponse = z
  .object({ accessControlledDoors: z.array(AccessControlledDoorType_Minimal).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_GetRhombusKeyLocationLockdownDetailsForCurrentUserWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_GetRhombusKeyLocationLockdownDetailsForCurrentUserWSResponse = z
  .object({ locationLockdownState: LocationLockdownStateType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_GetRhombusSecureCsnCredentialDetailsWSRequest = z
  .object({ credentialUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_GetRhombusSecureCsnCredentialDetailsWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_GetStandardCsnCredentialDetailsWSRequest = z
  .object({ credentialUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_GetStandardCsnCredentialDetailsWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_ActivateLockdownForLocationWSRequest = z
  .object({
    locationUuid: z.string().nullable(),
    lockdownPlanUuids: z.array(z.string().nullable()).nullable(),
    stateUpdatedAtMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const LockdownActivationResultEnumType = z.enum([
  "SUCCESS",
  "INVALID_LOCKDOWN_PLANS",
  "OPTIMISTIC_CONCURRENCY",
]);
const Accesscontrol_lockdownplan_ActivateLockdownForLocationWSResponse = z
  .object({ result: LockdownActivationResultEnumType, state: LocationLockdownStateType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_ActivateLockdownForLocationViaRhombusKeyWSRequest = z
  .object({
    locationUuid: z.string().nullable(),
    lockdownPlanUuids: z.array(z.string().nullable()).nullable(),
    stateUpdatedAtMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_ActivateLockdownForLocationViaRhombusKeyWSResponse = z
  .object({ result: LockdownActivationResultEnumType, state: LocationLockdownStateType })
  .partial()
  .passthrough();
const LocationLockdownPlanType = z
  .object({
    activationPlan: LockdownActivationPlanType,
    createdAtMillis: z.number().int().nullable(),
    deactivationPlan: LockdownDeactivationPlanType,
    defaultLockdownState: DoorLockdownStateEnumType,
    doorLockdownStateMap: z.record(DoorLockdownStateEnumType).nullable(),
    locationUuid: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    physicalAccess: LockdownPhysicalAccessType,
    scopeUuid: z.string().nullable(),
    testPlan: LockdownTestPlanType,
    type: LockdownPlanScopeEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_CreateLocationLockdownPlanWSRequest = z
  .object({ lockdownPlan: LocationLockdownPlanType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_CreateLocationLockdownPlanWSResponse = z
  .object({ lockdownPlan: LocationLockdownPlanType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSRequest = z
  .object({
    locationUuid: z.string().nullable(),
    stateUpdatedAtMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const LockdownDeactivationResultEnumType = z.enum(["SUCCESS", "OPTIMISTIC_CONCURRENCY"]);
const Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSResponse = z
  .object({ result: LockdownDeactivationResultEnumType, state: LocationLockdownStateType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_DeactivateLockdownForLocationViaRhombusKeyWSRequest = z
  .object({
    locationUuid: z.string().nullable(),
    stateUpdatedAtMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_DeactivateLockdownForLocationViaRhombusKeyWSResponse = z
  .object({ result: LockdownDeactivationResultEnumType, state: LocationLockdownStateType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_DeleteLocationLockdownStateWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_DeleteLocationLockdownStateWSResponse = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_DeleteLockdownPlanWSRequest = z
  .object({ lockdownPlanUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_DeleteLockdownPlanWSResponse = z
  .object({ lockdownPlanUuid: z.string().nullable(), orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_DisableLockdownTestModeForLocationWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_DisableLockdownTestModeForLocationWSResponse = z
  .object({ state: LocationLockdownStateType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_EnableLockdownTestModeForLocationWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_EnableLockdownTestModeForLocationWSResponse = z
  .object({ state: LocationLockdownStateType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_FindLocationLockdownEventsWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const LockdownEventOriginatorEnumType = z.enum([
  "USER",
  "SUPPORT_AUTHORITY",
  "API_TOKEN",
  "RULE",
  "UNKNOWN",
]);
const BaseLocationLockdownEventOriginator = z
  .object({ type: LockdownEventOriginatorEnumType })
  .partial()
  .passthrough();
const LockdownStateEventEnumType = z.enum(["LOCKDOWN_ACTIVATED", "LOCKDOWN_DEACTIVATED"]);
const BaseLockdownStateEventType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    originator: BaseLocationLockdownEventOriginator,
    stateChangedAtMillis: z.number().int().nullable(),
    type: LockdownStateEventEnumType,
  })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_FindLocationLockdownEventsWSResponse = z
  .object({ events: z.array(BaseLockdownStateEventType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_FindLocationLockdownStatesWSRequest = z
  .object({ stateFilter: z.array(LocationLockdownStateEnumType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_FindLocationLockdownStatesWSResponse = z
  .object({ states: z.array(LocationLockdownStateType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_FindLockdownPlansWSRequest = z.object({}).partial().passthrough();
const Accesscontrol_lockdownplan_FindLockdownPlansWSResponse = z
  .object({ lockdownPlans: z.array(BaseLockdownPlanType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_FindLockdownPlansByLocationWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_FindLockdownPlansByLocationWSResponse = z
  .object({ lockdownPlans: z.array(BaseLockdownPlanType).nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_GetLockdownPlanWSRequest = z
  .object({ lockdownPlanUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_GetLockdownPlanWSResponse = z
  .object({ lockdownPlan: BaseLockdownPlanType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_GetOrCreateLocationLockdownStateWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_GetOrCreateLocationLockdownStateWSResponse = z
  .object({ state: LocationLockdownStateType })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSRequest = z
  .object({
    activationPlan: LockdownActivationPlanType,
    deactivationPlan: LockdownDeactivationPlanType,
    defaultLockdownState: DoorLockdownStateEnumType,
    doorLockdownStateMap: z.record(DoorLockdownStateEnumType).nullable(),
    lockdownPlanUuid: z.string().nullable(),
    name: z.string().nullable(),
    physicalAccess: LockdownPhysicalAccessType,
  })
  .partial()
  .passthrough();
const Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSResponse = z
  .object({ lockdownPlan: LocationLockdownPlanType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_ProvisionMobileAccessControlCredentialForCurrentUserWSRequest = z
  .object({
    appName: z.string().nullable(),
    appOS: z.string().nullable(),
    appVersion: z.string().nullable(),
    clientType: z.enum(["IOS", "ANDROID"]).nullable(),
    deviceModel: z.string().nullable(),
    installationId: z.string().nullable(),
  })
  .partial()
  .passthrough();
// Removed problematic schema
// Removed problematic schema
// Removed problematic schema
const Accesscontrol_group_RemoveUsersFromAccessControlGroupWSRequest = z
  .object({
    groupUuid: z.string().nullable(),
    userUuids: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_group_RemoveUsersFromAccessControlGroupWSResponse = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_credentials_RevokeAccessControlCredentialWSRequest = z
  .object({ credentialUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_RevokeAccessControlCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_RevokeRhombusSecureMobileCredentialForCurrentUserWSRequest = z
  .object({ credentialUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_RevokeRhombusSecureMobileCredentialForCurrentUserWSResponse = z
  .object({})
  .partial()
  .passthrough();
const Accesscontrol_SendUserPresenceForCurrentUserWSRequest_Destination = z
  .object({
    accessControlUnitUuid: z.string().nullable(),
    readerUuid: z.string().nullable(),
    rssi: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_SendUserPresenceForCurrentUserWSRequest = z
  .object({
    cmdVersion: z.string().nullable(),
    credentialValue: z.string().nullable(),
    destinations: z
      .array(Accesscontrol_SendUserPresenceForCurrentUserWSRequest_Destination)
      .nullable(),
  })
  .partial()
  .passthrough();
// Removed problematic schemas
const Accesscontrol_credentials_SuspendAccessControlCredentialWSRequest = z
  .object({ credentialUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_SuspendAccessControlCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_UnlockAccessControlledDoorWSRequest = z
  .object({ accessControlledDoorUuid: z.string().nullable() })
  .partial()
  .passthrough();
// Removed problematic schemas
const Accesscontrol_UnlockAccessControlledDoorForCurrentUserWSRequest = z
  .object({
    accessControlledDoorUuid: z.string().nullable(),
    cmdVersion: z.string().nullable(),
    credentialValue: z.string().nullable(),
    requestTimeMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
// Removed problematic schemas
const Accesscontrol_credentials_UnsuspendAccessControlCredentialWSRequest = z
  .object({ credentialUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Accesscontrol_credentials_UnsuspendAccessControlCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_UpdateAccessGrantWSRequest = z
  .object({ accessGrant: LocationAccessGrantType })
  .partial()
  .passthrough();
const Accesscontrol_accessgrant_UpdateAccessGrantWSResponse = z
  .object({ accessGrant: LocationAccessGrantType })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_UpdateAccessRevocationWSRequest = z
  .object({ accessRevocation: LocationAccessRevocationType })
  .partial()
  .passthrough();
const Accesscontrol_accessrevocation_UpdateAccessRevocationWSResponse = z
  .object({ accessRevocation: LocationAccessRevocationType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_UpdateRhombusSecureCsnCredentialWSRequest = z
  .object({
    credentialUuid: z.string().nullable(),
    endDateEpochSecExclusive: z.number().int().nullable(),
    startDateEpochSecInclusive: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_UpdateRhombusSecureCsnCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_UpdateRhombusSecureMobileCredentialWSRequest = z
  .object({
    credentialUuid: z.string().nullable(),
    endDateEpochSecExclusive: z.number().int().nullable(),
    startDateEpochSecInclusive: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_UpdateRhombusSecureMobileCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Accesscontrol_credentials_UpdateStandardCsnCredentialWSRequest = z
  .object({
    credentialUuid: z.string().nullable(),
    endDateEpochSecExclusive: z.number().int().nullable(),
    startDateEpochSecInclusive: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Accesscontrol_credentials_UpdateStandardCsnCredentialWSResponse = z
  .object({ credential: AccessControlCredentialType })
  .partial()
  .passthrough();
const Alertmonitoring_AcceptAlertMonitoringTermsOfServiceForLocationRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_AcceptAlertMonitoringTermsOfServiceResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_CancelThreatCaseWSRequest = z
  .object({ pin: z.string().nullable(), uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_CancelThreatCaseWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    success: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const EmergencyContact = z
  .object({ name: z.string().nullable(), phoneNumber: z.string().nullable() })
  .partial()
  .passthrough();
const NoonlightPromptTheme = z.enum(["THREAT", "HUMAN"]);
const EmergencyResponseContactsScheduleType = z
  .object({
    emergencyContactList: z.array(EmergencyContact).nullable(),
    scheduleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ActivityEnum = z.enum([
  "SOUND_LOUD",
  "SOUND_GUN_SHOT",
  "TAMPER",
  "VISUAL_TAMPER",
  "MOTION_TAMPER",
  "MOTION",
  "MOTION_HUMAN",
  "MOTION_CAR",
  "MOTION_ANIMAL",
  "FACE",
  "FACE_IDENTIFIED",
  "FACE_UNIDENTIFIED",
  "FACE_BLACKLISTED",
  "FACE_ALERT",
  "POSE_ANOMALOUS",
  "POSE_FALL",
  "LICENSEPLATE",
  "LICENSEPLATE_IDENTIFIED",
  "LICENSEPLATE_UNIDENTIFIED",
  "LICENSEPLATE_ALERT",
  "LICENSEPLATE_BLACKLISTED",
  "LICENSEPLATE_TRUSTED",
  "PEOPLECOUNT_HIGH",
  "PEOPLECOUNT_HIGH_RESET",
  "PEOPLECOUNT_LOW",
  "PEOPLECOUNT_LOW_RESET",
  "HUMAN_ENTER",
  "HUMAN_EXIT",
  "CAR_ENTER",
  "CAR_EXIT",
  "TEMPERATURE_EXCEEDED_HIGH",
  "TEMPERATURE_EXCEEDED_LOW",
  "HUMIDITY_EXCEEDED_HIGH",
  "HUMIDITY_EXCEEDED_LOW",
  "TVOC_EXCEEDED_HIGH",
  "PM25_EXCEEDED_HIGH",
  "ETOH_EXCEEDED_HIGH",
  "IAQ_EXCEEDED_HIGH",
  "CO2_EXCEEDED_HIGH",
  "PROBE_TEMPERATURE_EXCEEDED_HIGH",
  "PROBE_TEMPERATURE_EXCEEDED_LOW",
  "PROBE_DISCONNECTED",
  "PROBE_CONNECTED",
  "DOOR_AJAR",
  "DOOR_OPENED",
  "DOOR_CLOSED",
  "BUTTON_SINGLE_PRESSED",
  "BUTTON_DOUBLE_PRESSED",
  "BUTTON_LONG_PRESSED",
  "TAG_ARRIVED",
  "TAG_DEPARTED",
  "TAG_MOVED",
  "TAG_POSITIONING_CHANGED",
  "TAG_BOUNDARY_INGRESS",
  "TAG_BOUNDARY_EGRESS",
  "TAG_PANIC",
  "BADGE_AUTHORIZED",
  "BADGE_UNAUTHORIZED",
  "BADGE_UNAUTHORIZED_V2",
  "BADGE_AJAR",
  "BADGE_MANUAL",
  "BADGE_FORCED_OPEN",
  "BADGE_LOCKDOWN",
  "BADGE_FACE_MISMATCH",
  "POS_ORDER",
  "GUN_DETECT_EVENT",
  "IOT_SOUND_AGGRESSION",
  "IOT_SOUND_HELP",
  "IOT_AIR_CO",
  "IOT_AIR_CO2",
  "IOT_AIR_MASKING",
  "IOT_AIR_THC",
  "IOT_AIR_VAPE",
  "IOT_AIR_VOC",
  "IOT_AIR_TEMP",
  "IOT_TAMPER",
  "IOT_GUNSHOT",
  "AUDIO_SOUND_SIGNIFICANT",
  "AUDIO_SOUND_LOUD",
  "AUDIO_SOUND_ABUSIVE",
  "AUDIO_SOUND_GREETING",
  "AUDIO_SOUND_HELP",
  "AUDIO_SOUND_GUN",
  "AUDIO_SOUND_GLASS_BREAK",
  "AUDIO_SOUND_ALARM_SMOKE_FIRE",
  "AUDIO_SOUND_ALARM_CARBON_MONOXIDE",
  "AUDIO_SOUND_SIREN",
  "CLIMATE_VOC",
  "CLIMATE_VAPE",
  "CLIMATE_SMOKE",
  "CLIMATE_THC",
  "CLIMATE_CO2",
  "CLIMATE_ETOH",
  "CLIMATE_PM25",
  "CLIMATE_IAQ",
  "SOUND_AGGRESSION",
  "SOUND_HELP",
  "AIR_CO",
  "AIR_CO2",
  "AIR_MASKING",
  "AIR_THC",
  "AIR_VAPE",
  "AIR_VOC",
  "MASK_MISSING",
  "HELMET_MISSING",
  "GLOVES_MISSING",
  "PIR_OCCUPIED",
  "PIR_MOVEMENT",
  "PIR_VACANT",
  "CUSTOM",
  "VISITOR_ARRIVED",
  "VISITOR_DEPARTED",
  "AC_DR_CONNECTED",
  "AC_DR_DISCONNECTED",
  "AC_DPI_DOOR_OPEN",
  "AC_DPI_DOOR_CLOSED",
  "AC_DPI_DOOR_AJAR",
  "AC_DPI_DOOR_FORCED_OPEN",
  "AC_DSR_UNLOCKED",
  "AC_DSR_LOCKED",
  "AC_DB_TRIGGERED",
  "AC_REMOTE_UNLOCK",
  "AC_BADGE_AUTHORIZED",
  "AC_BADGE_UNAUTHORIZED",
  "AC_BADGE_FACE_MISMATCH",
  "AC_LOCKDOWN_ACTIVATED",
  "AC_LOCKDOWN_DEACTIVATED",
  "AC_TAMPER_PROX",
  "AC_TAMPER_ACCEL",
  "AC_TAMPER_SWITCH",
  "UNKNOWN",
]);
const NoonlightScheduleType = z
  .object({
    escalationDelayMinutes: z.number().int().nullable(),
    monitoredDevices: z.array(z.string().nullable()).nullable(),
    promptTheme: NoonlightPromptTheme,
    scheduleUuid: z.string().nullable(),
    triggerSet: z.array(ActivityEnum).nullable(),
  })
  .partial()
  .passthrough();
const AlertMonitoringPinType = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    pin: z.string().nullable(),
  })
  .partial()
  .passthrough();
const NoonlightSettingsType = z
  .object({
    acceptedTermsOfService: z.boolean().nullable(),
    defaultDelay: z.number().int().nullable(),
    defaultEmergencyContact: EmergencyContact,
    defaultPromptTheme: NoonlightPromptTheme,
    emergencyContacts: z.array(EmergencyResponseContactsScheduleType).nullable(),
    enabled: z.boolean().nullable(),
    entryInstructions: z.string().nullable(),
    locationUuid: z.string().nullable(),
    manualEscalationSettings: NoonlightScheduleType,
    monitoringMode: z.enum(["MANUAL", "SCHEDULED", "UNKNOWN"]).nullable(),
    oneTimePauses: z.array(NoonlightScheduleType).nullable(),
    oneTimeSchedules: z.array(NoonlightScheduleType).nullable(),
    orgUuid: z.string().nullable(),
    pins: z.array(AlertMonitoringPinType).nullable(),
    schedules: z.array(NoonlightScheduleType).nullable(),
  })
  .partial()
  .passthrough();
const Alertmonitoring_CreateNoonlightSettingsForLocationRequest = z
  .object({ noonlightSettings: NoonlightSettingsType })
  .partial()
  .passthrough();
const Alertmonitoring_CreateNoonlightSettingsForLocationResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_CreatePinForNoonlightWSRequest = z
  .object({
    description: z.string().nullable(),
    locationUuid: z.string().nullable(),
    name: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Alertmonitoring_CreatePinForNoonlightWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    pin: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Alertmonitoring_DeleteNoonlightSettingsForLocationRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_DeleteNoonlightSettingsForLocationResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_DeletePinForNoonlightWSRequest = z
  .object({ locationUuid: z.string().nullable(), pin: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_DeletePinForNoonlightWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_DismissThreatCaseWSRequest = z
  .object({
    orgUuid: z.string().nullable(),
    pin: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Alertmonitoring_DismissThreatCaseWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    success: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Alertmonitoring_EscalateThreatCaseToAlarmWSRequest = z
  .object({ orgUuid: z.string().nullable(), uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_EscalateThreatCaseToAlarmWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_GetNoonlightSettingsWSRequest = z.object({}).partial().passthrough();
const Alertmonitoring_GetNoonlightSettingsWSResponse = z
  .object({
    alertMonitoringSettings: z.record(NoonlightSettingsType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Alertmonitoring_GetNoonlightSettingsForLocationWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Alertmonitoring_GetNoonlightSettingsForLocationWSResponse = z
  .object({
    alertMonitoringSettings: NoonlightSettingsType,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Alertmonitoring_UpdateNoonlightSettingsForLocationRequest = z
  .object({ noonlightSettings: NoonlightSettingsType })
  .partial()
  .passthrough();
const Alertmonitoring_UpdateNoonlightSettingsForLocationResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Audiogateway_DeleteAudioGatewayWSRequest = z
  .object({ gatewayUuid: z.string().nullable(), mummify: z.boolean().nullable() })
  .partial()
  .passthrough();
const Audiogateway_DeleteAudioGatewayWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    responseStatus: z
      .enum([
        "BASIC_AUTH_FAILED",
        "PASSWORD_MISMATCH",
        "SAME_PASSWORD",
        "USER_EXISTS",
        "USER_NOT_FOUND",
        "DEVICE_NOT_FOUND",
        "POLICY_NOT_FOUND",
        "LOCATION_NOT_FOUND",
        "ORG_NOT_FOUND",
        "BAD_INPUT",
        "SUCCESS",
        "PASSWORD_TOO_SHORT",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_GetAudioSeekpointsWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    duration: z.number().int().nullable(),
    startTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const ToastCheckInfo = z.object({ totalAmount: z.number().nullable() }).partial().passthrough();
const ToastOrderIdType = z
  .object({
    employeeName: z.string().nullable(),
    guid: z.string().nullable(),
    toastCheckInfo: ToastCheckInfo,
  })
  .partial()
  .passthrough();
const FootageSeekPointV2Type = z
  .object({
    a: ActivityEnum,
    al: z.boolean().nullish(),
    cc: z.enum(["BLUE", "RED", "PURPLE", "TAN", "ORANGE", "TEAL", "GRAY", "BLACK"]).nullish(),
    cd: z.string().nullish(),
    cdn: z.string().nullish(),
    fn: z.string().nullish(),
    id: z.number().int().nullish(),
    loudness: z.number().int().nullish(),
    lp: z.string().nullish(),
    m: z.boolean().nullish(),
    p: z.string().nullish(),
    ro: z.array(z.string().nullable()).nullish(),
    toi: ToastOrderIdType.optional(),
    ts: z.number().int().nullable(),
    tu: z.string().nullish(),
    uf: z.string().nullish(),
    vn: z.string().nullish(),
  })
  .passthrough();
const Audiogateway_GetAudioSeekpointsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    footageSeekPoints: z.array(FootageSeekPointV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_GetAudioGatewayConfigWSRequest = z
  .object({ audioGatewayUuid: z.string().nullable() })
  .partial()
  .passthrough();
const AudioExpressionDetectionConfig = z
  .object({
    category: ActivityEnum,
    confidence_min: z.number().nullable(),
    expression: z.string().nullable(),
    loudness_min: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const AudioParamConfig = z
  .object({
    expressions: z.array(AudioExpressionDetectionConfig).nullable(),
    significant_loudness_min: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const WeeklyMinuteIntervalType = z
  .object({
    minuteOfWeekStart: z.number().int().nullable(),
    minuteOfWeekStop: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const IAudioUserConfig = z
  .object({
    audio_analysis_enabled: z.boolean().nullable(),
    audio_analysis_params: AudioParamConfig,
    audio_external_mic_boost: z.number().int().nullable(),
    audio_external_mic_volume: z.number().int().nullable(),
    audio_external_speaker_volume: z.number().int().nullable(),
    audio_internal_mic_aec_enabled: z.boolean().nullable(),
    audio_internal_mic_boost: z.number().int().nullable(),
    audio_internal_mic_volume: z.number().int().nullable(),
    audio_internal_speaker_volume: z.number().int().nullable(),
    audio_record: z.boolean().nullable(),
    audio_use_external_mic: z.boolean().nullable(),
    audio_use_external_speaker: z.boolean().nullable(),
    audio_use_internal_speaker: z.boolean().nullable(),
    bandwidth_reports_disabled: z.boolean().nullable(),
    cloud_archive_days: z.number().int().nullable(),
    cloud_archive_target: z.enum(["0", "1", "2"]).nullable(),
    cloud_archive_upload_schedule: z.array(WeeklyMinuteIntervalType).nullable(),
    cloud_archive_upload_schedule_inverted: z.boolean().nullable(),
    cloud_archive_upload_schedule_uuid: z.string().nullable(),
    deviceUuid: z.string().nullable(),
    device_mic_enabled: z.boolean().nullable(),
    device_speaker_enabled: z.boolean().nullable(),
    event_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
    lastModified: z.number().int().nullable(),
    led_stealth_mode: z.boolean().nullable(),
    max_event_duration_ms: z.number().int().nullable(),
    media_ttl_minutes: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    splice_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_GetAudioGatewayConfigWSResponse = z
  .object({
    config: IAudioUserConfig,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_GetFullAudioGatewayStateWSRequest = z
  .object({ deviceUuid: z.string().nullable(), force: z.boolean().nullable() })
  .partial()
  .passthrough();
const DeviceStatusEnum = z.enum(["RED", "ORANGE", "GREEN"]);
const DeviceHealthStatusDetailsEnum = z.enum([
  "DISCONNECTED",
  "FIRMWARE_BEHIND",
  "NOT_RECORDING",
  "NONE",
]);
const HardwareVariationEnum = z.enum([
  "RASPBERRY_PI_3",
  "CAMERA_R1",
  "CAMERA_R2",
  "CAMERA_R2_LONG_RANGE",
  "CAMERA_R2_180",
  "CAMERA_R3",
  "CAMERA_R4",
  "CAMERA_R100",
  "CAMERA_R120",
  "CAMERA_R170",
  "CAMERA_R200",
  "CAMERA_R500",
  "CAMERA_R510",
  "CAMERA_R550",
  "CAMERA_R600",
  "SENSOR_ASSET_TAG_T1",
  "SENSOR_DOOR_D1",
  "SENSOR_DOOR_D20",
  "SENSOR_ENVIRONMENTAL_E1",
  "SENSOR_ENVIRONMENTAL_E15",
  "SENSOR_ENVIRONMENTAL_E2",
  "SENSOR_MOTION_M1",
  "SENSOR_MOTION_M15",
  "GATEWAY_A1",
  "GATEWAY_A100",
  "GATEWAY_ENVIRONMENTAL_E50",
  "CAMERA_R220",
  "CAMERA_R230",
  "BADGE_READER_DR1",
  "BADGE_READER_DR40",
  "BADGE_READER_DR20",
  "DOOR_CONTROLLER_DC1",
  "DOOR_CONTROLLER_DC20",
  "ETHERNET_TESTER_ET1",
  "IO_BOARD_TB1",
  "BLE_BUTTON_B10",
  "UNSPECIFIED",
]);
const FullDeviceStateType = z
  .object({
    afSupport: z.boolean().nullable(),
    baseVideoOperationUri: z.string().nullable(),
    connectionStatus: DeviceStatusEnum,
    connectionTimestampMs: z.number().int().nullable(),
    createdAtMillis: z.number().int().nullable(),
    defaultInterface: z.string().nullable(),
    defaultInterfaceMac: z.string().nullable(),
    directionRadians: z.number().nullable(),
    externalIPAddress: z.string().nullable(),
    firmwareUpdateInProgress: z.boolean().nullable(),
    firmwareVersion: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    healthStatus: DeviceStatusEnum,
    healthStatusDetails: DeviceHealthStatusDetailsEnum,
    hwVariation: HardwareVariationEnum,
    lanAddresses: z.array(z.string().nullable()).nullable(),
    latestFirmwareVersion: z.string().nullable(),
    latitude: z.number().nullable(),
    liveStreamShared: z.boolean().nullable(),
    liveStreamsSharedCount: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    maxZoomPercent: z.number().int().nullable(),
    mediaRegion: z.string().nullable(),
    mummified: z.boolean().nullable(),
    name: z.string().nullable(),
    onCameraState: z.record(z.object({}).partial().passthrough().nullable()).nullable(),
    onCloudState: z.record(z.object({}).partial().passthrough().nullable()).nullable(),
    policyUuid: z.string().nullable(),
    region: z.string().nullable(),
    serialNumber: z.string().nullable(),
    ssid: z.string().nullable(),
    uuid: z.string().nullable(),
    versionsBehind: z.number().int().nullable(),
    wifiApMac: z.string().nullable(),
    wifiBars: z.number().int().nullable(),
    wifiSignalStrength: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_GetFullAudioGatewayStateWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    fullAudioGatewayState: FullDeviceStateType,
  })
  .partial()
  .passthrough();
const Audiogateway_GetMediaUrisWSRequest = z
  .object({ gatewayUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Audiogateway_GetMediaUrisWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    lanCheckUrls: z.array(z.string().nullable()).nullable(),
    lanLiveMpdUris: z.array(z.string().nullable()).nullable(),
    lanLiveOpusUris: z.array(z.string().nullable()).nullable(),
    lanVodMpdUrisTemplates: z.array(z.string().nullable()).nullable(),
    wanLiveMpdUri: z.string().nullable(),
    wanLiveOpusUri: z.string().nullable(),
    wanVodMpdUriTemplate: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_GetMinimalAudioGatewayStatesWSRequest = z.object({}).partial().passthrough();
const MinimalAudioGatewayStateType = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    connectionStatus: DeviceStatusEnum,
    createdAtMillis: z.number().int().nullable(),
    defaultInterface: z.string().nullable(),
    defaultInterfaceMac: z.string().nullable(),
    directionRadians: z.number().nullable(),
    externalIPAddress: z.string().nullable(),
    firmwareUpdateInProgress: z.boolean().nullable(),
    firmwareVersion: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    healthStatus: DeviceStatusEnum,
    healthStatusDetails: DeviceHealthStatusDetailsEnum,
    hwVariation: HardwareVariationEnum,
    lanAddresses: z.array(z.string().nullable()).nullable(),
    latitude: z.number().nullable(),
    liveStreamShared: z.boolean().nullable(),
    liveStreamsSharedCount: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    mediaRegion: z.string().nullable(),
    mummified: z.boolean().nullable(),
    name: z.string().nullable(),
    policyUuid: z.string().nullable(),
    region: z.string().nullable(),
    sensorUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    ssid: z.string().nullable(),
    uuid: z.string().nullable(),
    wifiApMac: z.string().nullable(),
    wifiBars: z.number().int().nullable(),
    wifiSignalStrength: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_GetMinimalAudioGatewayStatesWSResponse = z
  .object({
    audioGatewayStates: z.array(MinimalAudioGatewayStateType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetPresenceWindowsWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    durationSec: z.number().int().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const TimeWindowSeconds = z
  .object({
    durationSeconds: z.number().int().nullable(),
    startSeconds: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetPresenceWindowsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    presenceWindows: z.record(z.array(TimeWindowSeconds).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetUptimeWindowsWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    endTimeMs: z.number().int().nullable(),
    startTimeMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetUptimeWindowsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    uptimeWindows: z.array(TimeWindowSeconds).nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_UpdateAudioGatewayConfigWSRequest = z
  .object({
    audioExternalMicBoost: z.number().int().nullable(),
    audioExternalMicVolume: z.number().int().nullable(),
    audioExternalSpeakerVolume: z.number().int().nullable(),
    audioInternalMicAecEnabled: z.boolean().nullable(),
    audioInternalMicBoost: z.number().int().nullable(),
    audioInternalMicVolume: z.number().int().nullable(),
    audioInternalSpeakerVolume: z.number().int().nullable(),
    audioRecord: z.boolean().nullable(),
    audioUseExternalMic: z.boolean().nullable(),
    audioUseExternalSpeaker: z.boolean().nullable(),
    deviceMicEnabled: z.boolean().nullable(),
    deviceSpeakerEnabled: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_UpdateAudioGatewayConfigWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Audiogateway_UpdateAudioGatewayDetailsWSRequest = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    associatedCamerasUpdated: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    deletedUpdated: z.boolean().nullable(),
    description: z.string().nullable(),
    descriptionUpdated: z.boolean().nullable(),
    floorNumber: z.number().int().nullable(),
    floorNumberUpdated: z.boolean().nullable(),
    latitude: z.number().nullable(),
    latitudeUpdated: z.boolean().nullable(),
    locationUuid: z.string().nullable(),
    locationUuidUpdated: z.boolean().nullable(),
    longitude: z.number().nullable(),
    longitudeUpdated: z.boolean().nullable(),
    name: z.string().nullable(),
    nameUpdated: z.boolean().nullable(),
    policyUuid: z.string().nullable(),
    policyUuidUpdated: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audiogateway_UpdateAudioGatewayDetailsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Audioplayback_DeleteAudioUploadMetadataWSRequest = z
  .object({ audioUploadUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Audioplayback_DeleteAudioUploadMetadataWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Audioplayback_GetAudioUploadMetadataForOrgWSRequest = z.object({}).partial().passthrough();
const AudioUploadMetadataType = z
  .object({
    audioPlaintext: z.string().nullable(),
    audioSSML: z.string().nullable(),
    description: z.string().nullable(),
    displayName: z.string().nullable(),
    durationMs: z.number().int().nullable(),
    mutable: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    s3ObjectKey: z.string().nullable(),
    uuid: z.string().nullable(),
    voiceId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audioplayback_GetAudioUploadMetadataForOrgWSResponse = z
  .object({
    audioUploadMetadata: z.array(AudioUploadMetadataType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audioplayback_PlayAudioUploadWSRequest = z
  .object({
    audioGatewayUuids: z.array(z.string().nullable()).nullable(),
    audioUploadUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audioplayback_PlayAudioUploadWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    success: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Audioplayback_UpdateAudioUploadMetadataWSRequest = z
  .object({
    audioUploadUuid: z.string().nullable(),
    newDescription: z.string().nullable(),
    newDisplayName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audioplayback_UpdateAudioUploadMetadataWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const ContentDisposition = z
  .object({
    creationDate: z.string().datetime({ offset: true }).nullable(),
    fileName: z.string().nullable(),
    modificationDate: z.string().datetime({ offset: true }).nullable(),
    parameters: z.record(z.string().nullable()).nullable(),
    readDate: z.string().datetime({ offset: true }).nullable(),
    size: z.number().int().nullable(),
    type: z.string().nullable(),
  })
  .partial()
  .passthrough();
const MediaType = z
  .object({
    parameters: z.record(z.string().nullable()).nullable(),
    subtype: z.string().nullable(),
    type: z.string().nullable(),
    wildcardSubtype: z.boolean().nullable(),
    wildcardType: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const MessageBodyWorkers = z.object({}).partial().passthrough();
const ParameterizedHeader = z
  .object({ parameters: z.record(z.string().nullable()).nullable(), value: z.string().nullable() })
  .partial()
  .passthrough();
const Providers = z.object({}).partial().passthrough();
const MultiPart = z.any(); // Simplified to break circular dependency
const BodyPart = z.any(); // Simplified to break circular dependency
const FormDataContentDisposition = z
  .object({
    creationDate: z.string().datetime({ offset: true }).nullable(),
    fileName: z.string().nullable(),
    modificationDate: z.string().datetime({ offset: true }).nullable(),
    name: z.string().nullable(),
    parameters: z.record(z.string().nullable()).nullable(),
    readDate: z.string().datetime({ offset: true }).nullable(),
    size: z.number().int().nullable(),
    type: z.string().nullable(),
  })
  .partial()
  .passthrough();
const FormDataBodyPart = z
  .object({
    content: z.object({}).partial().passthrough().nullable(),
    contentDisposition: ContentDisposition,
    entity: z.object({}).partial().passthrough().nullable(),
    fileName: z.string().nullable(),
    formDataContentDisposition: FormDataContentDisposition,
    headers: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    mediaType: MediaType,
    messageBodyWorkers: MessageBodyWorkers,
    name: z.string().nullable(),
    parameterizedHeaders: z.record(z.array(ParameterizedHeader).nullable()).nullable(),
    parent: MultiPart,
    providers: Providers,
    simple: z.boolean().nullable(),
    value: z.string().nullable(),
  })
  .partial()
  .passthrough();
const FormDataMultiPart = z
  .object({
    bodyParts: z.array(BodyPart).nullable(),
    contentDisposition: ContentDisposition,
    entity: z.object({}).partial().passthrough().nullable(),
    fields: z.record(z.array(FormDataBodyPart).nullable()).nullable(),
    headers: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    mediaType: MediaType,
    messageBodyWorkers: MessageBodyWorkers,
    parameterizedHeaders: z.record(z.array(ParameterizedHeader).nullable()).nullable(),
    parent: MultiPart,
    providers: Providers,
  })
  .partial()
  .passthrough();
const Audioplayback_UploadAudioPcmWSResponse = z
  .object({
    encodingFailure: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audioplayback_UploadAudioTextWSRequest = z
  .object({
    audioPlaintext: z.string().nullable(),
    audioSSML: z.string().nullable(),
    description: z.string().nullable(),
    displayName: z.string().nullable(),
    voiceId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Audioplayback_UploadAudioTextWSResponse = z
  .object({
    encodingFailure: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    invalidSSML: z.boolean().nullable(),
    synthesisFailure: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Ble_GetBaseStationsWSRequest = z.object({}).partial().passthrough();
const Ble_GetBaseStationsWSResponse = z
  .object({
    baseStations: z.array(z.string().nullable()).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Ble_BleDeviceMap = z
  .object({ keyToSecureBeacon: z.record(z.array(z.string().nullable()).nullable()).nullable() })
  .partial()
  .passthrough();
const Ble_BleRegisteredDeviceWSType = z
  .object({
    deleted: z.boolean().nullable(),
    deviceUuid: z.string().nullable(),
    hwVariation: HardwareVariationEnum,
    name: z.string().nullable(),
    secret: z.array(z.string().nullable()).nullable(),
    updateToFirmwareVersion: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Ble_GetSecureSecretForRegisteredWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    hardwareVariationToFirmwareDownloadUrl: z
      .record(z.record(z.string().nullable()).nullable())
      .nullable(),
    keyToRegisteredDevice: z.record(Ble_BleRegisteredDeviceWSType).nullable(),
  })
  .partial()
  .passthrough();
const Ble_BleUnregisteredHardwareWSType = z
  .object({ mac: z.string().nullable(), secret: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Ble_GetSecureSecretForUnregisteredWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    keyToUnregisteredDevice: z.record(Ble_BleUnregisteredHardwareWSType).nullable(),
  })
  .partial()
  .passthrough();
const Ble_GetSensorHardwareFirmwareUpdateDetailsRequest = z.object({}).partial().passthrough();
const Ble_GetSensorHardwareFirmwareUpdateDetailsResponse = z
  .object({
    hardwareVariationToFirmwareDownloadUrl: z
      .record(z.record(z.string().nullable()).nullable())
      .nullable(),
  })
  .partial()
  .passthrough();
const Ble_RegisterSensorWSRequest = z
  .object({
    bleData: z.array(z.string().nullable()).nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    serialNum: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Ble_RegisterSensorWSResponse = z
  .object({
    deviceUuid: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Ble_UnregisterSensorWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Ble_UnregisterSensorWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    failureReason: z.string().nullable(),
    success: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const ActivateLocationLockdownActionType = z
  .object({ locationLockdownPlanUuid: z.string().nullable(), locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const AudioPlaybackActionType = z
  .object({
    audioClipUuid: z.string().nullable(),
    audioGateways: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const IntegrationEnum = z.enum([
  "WEBHOOKS",
  "OMNIALERT",
  "DEVICE_INTEGRATION",
  "GUEST_MANAGEMENT",
  "LUMEO",
  "MICROSOFT_TEAMS",
  "ENVOY",
  "INFORMACAST",
  "GOOGLE",
  "DICE",
  "ZAPIER",
  "OPENAI",
]);
const IntegrationNotificationActionType = z
  .object({
    integration: IntegrationEnum,
    notificationTarget: z.string().nullable(),
    subject: z.string().nullable(),
    subjectCustomizable: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const RemoteDoorUnlockSystemEnum = z.enum([
  "OPENPATH",
  "KISI",
  "PLACEOS",
  "GENEA",
  "PDK",
  "RHOMBUS",
  "UNKNOWN",
]);
const RemoteDoorUnlockActionType = z
  .object({
    doorId: z.string().nullable(),
    placeId: z.string().nullable(),
    system: RemoteDoorUnlockSystemEnum,
  })
  .partial()
  .passthrough();
const TriggerComponentRelayActionType = z
  .object({
    componentUuid: z.string().nullable(),
    overrideRelayDurationSec: z.number().int().nullable(),
    ownerDeviceUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const WebhookActionType = z.object({ webhookUrl: z.string().nullable() }).partial().passthrough();
const RuleActionType = z
  .object({
    activateLocationLockdown: ActivateLocationLockdownActionType,
    alertAction: z.boolean().nullable(),
    audioPlaybackActions: z.array(AudioPlaybackActionType).nullable(),
    integrationNotificationActions: z.array(IntegrationNotificationActionType).nullable(),
    liveNotificationAction: z.boolean().nullable(),
    remoteDoorUnlockActions: z.array(RemoteDoorUnlockActionType).nullable(),
    triggerComponentRelayActions: z.array(TriggerComponentRelayActionType).nullable(),
    webhookActions: z.array(WebhookActionType).nullable(),
  })
  .partial()
  .passthrough();
const RuleFilterType = z
  .object({
    scheduleUuids: z.array(z.string().nullable()).nullable(),
    triggerBackoffSecs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const ButtonPressEnum = z.enum([
  "NONE",
  "SINGLE",
  "DOUBLE",
  "LONG",
  "INITIAL_PRESS",
  "LONG_RELEASE",
]);
const Button_ExternalButtonRuleType = z
  .object({
    action: RuleActionType,
    ruleFilters: RuleFilterType,
    ruleName: z.string().nullable(),
    ruleUuid: z.string().nullable(),
    sensorUuid: z.string().nullable(),
    triggerPress: ButtonPressEnum,
  })
  .partial()
  .passthrough();
const Button_CreateRuleForButtonWSRequest = z
  .object({ rule: Button_ExternalButtonRuleType })
  .partial()
  .passthrough();
const Button_CreateRuleForButtonWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    ruleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Button_DeleteRuleForButtonWSRequest = z
  .object({ ruleUuid: z.string().nullable(), sensorUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Button_DeleteRuleForButtonWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Button_GetButtonPressEventsForSensorWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    sensorUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ButtonModeEnum = z.enum(["PANIC", "PROGRAMMABLE", "DOORBELL", "NONE"]);
const ButtonEventType = z
  .object({
    baseStationUuid: z.string().nullable(),
    batteryPercentage: z.number().int().nullable(),
    bleDeviceUuid: z.string().nullable(),
    bleRssi: z.number().int().nullable(),
    buttonMode: ButtonModeEnum,
    buttonPress: ButtonPressEnum,
    closeBaseStations: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    testModeEnabled: z.boolean().nullable(),
    timestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Button_GetButtonPressEventsForSensorWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    events: z.array(ButtonEventType).nullable(),
  })
  .partial()
  .passthrough();
const Button_GetButtonRulesForOrgWSRequest = z.object({}).partial().passthrough();
const Button_GetButtonRulesForOrgWSResponse = z
  .object({
    buttonUuidToRulesMap: z.record(z.array(Button_ExternalButtonRuleType).nullable()).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Button_GetMinimalButtonStatesWSRequest = z.object({}).partial().passthrough();
const Button_ButtonHealthEnum = z.enum(["GREEN", "RED"]);
const Button_ButtonHealthDetailsEnum = z.enum(["FIRMWARE_BEHIND", "NO_HEARTBEAT", "NONE"]);
const Button_MinimalButtonStateType = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    batteryPercent: z.number().int().nullable(),
    buttonEmergencyOnsiteContact: EmergencyContact,
    buttonMode: ButtonModeEnum,
    closestBaseStation: z.string().nullable(),
    createdAtMillis: z.number().int().nullable(),
    firmwareVersion: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    health: Button_ButtonHealthEnum,
    healthDetails: Button_ButtonHealthDetailsEnum,
    hwVariation: HardwareVariationEnum,
    lastSeenSec: z.number().int().nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    sensorUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    signalStrength: z.number().int().nullable(),
    testModeEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Button_GetMinimalButtonStatesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    states: z.array(Button_MinimalButtonStateType).nullable(),
  })
  .partial()
  .passthrough();
const Button_GetRulesForButtonWSRequest = z
  .object({ sensorUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Button_GetRulesForButtonWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    rules: z.array(Button_ExternalButtonRuleType).nullable(),
  })
  .partial()
  .passthrough();
const Deviceconfig_IExternalUpdateableButtonSettings = z
  .object({
    button_emergency_onsite_contact: EmergencyContact,
    button_test_mode_enabled: z.boolean().nullable(),
    deviceUuid: z.string().nullable(),
    lastModified: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Button_UpdateButtonConfigWSRequest = z
  .object({ configUpdate: Deviceconfig_IExternalUpdateableButtonSettings })
  .partial()
  .passthrough();
const Common_devices_UpdateConfigWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Button_UpdateButtonDetailsWSRequest = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    buttonMode: ButtonModeEnum,
    description: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    sensorUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_UpdateDeviceDetailsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Common_devices_CalibrateFloorplanProjectionWSRequest = z
  .object({
    cameraImagePointsPermyriad: z.array(z.array(z.number().int().nullable()).nullable()).nullable(),
    deviceUuid: z.string().nullable(),
    floorplanImagePointsPermyriad: z
      .array(z.array(z.number().int().nullable()).nullable())
      .nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_CalibrateFloorplanProjectionWSResponse = z
  .object({ homography: z.array(z.array(z.number().nullable()).nullable()).nullable() })
  .partial()
  .passthrough();
const CustomFootageSeekPointType = z
  .object({
    color: z.enum(["BLUE", "RED", "PURPLE", "TAN", "ORANGE", "TEAL", "GRAY", "BLACK"]).nullable(),
    description: z.string().nullable(),
    name: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_CreateCustomFootageSeekpointsWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    footageSeekPoints: z.array(CustomFootageSeekPointType).nullable(),
  })
  .partial()
  .passthrough();
const Camera_CreateFootageSeekpointsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const PointType = z
  .object({ x: z.number().int().nullable(), y: z.number().int().nullable() })
  .partial()
  .passthrough();
const FootageBoundingBoxType = z
  .object({
    a: ActivityEnum,
    al: z.boolean().nullish(),
    b: z.number().int().nullable(),
    cd: z.string().nullish(),
    cdn: z.string().nullish(),
    croppedImageLocator: z.string().nullish(),
    customActivityColor: z
      .enum(["BLUE", "RED", "PURPLE", "TAN", "ORANGE", "TEAL", "GRAY", "BLACK"])
      .nullish(),
    fn: z.string().nullish(),
    kp: z.record(PointType).nullish(),
    l: z.number().int().nullable(),
    loudness: z.number().int().nullish(),
    lp: z.string().nullish(),
    m: z.boolean().nullish(),
    objectId: z.number().int().nullish(),
    p: z.string().nullish(),
    r: z.number().int().nullable(),
    ro: z.array(z.string().nullable()).nullish(),
    t: z.number().int().nullable(),
    toastOrderIdInfo: ToastOrderIdType.optional(),
    ts: z.number().int().nullable(),
    uf: z.string().nullish(),
    vn: z.string().nullish(),
  })
  .passthrough();
const Camera_CreateFootageBoundingBoxesWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    footageBoundingBoxes: z.array(FootageBoundingBoxType).nullable(),
  })
  .partial()
  .passthrough();
const Camera_CreateFootageBoundingBoxesWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const StreamTypeEnum = z.enum(["USER", "ALARM_MONITORING", "DICE", "LUMEO", "UNKNOWN"]);
const Camera_CreateSharedLiveVideoStreamWSRequest = z
  .object({
    audioGatewayUuid: z.string().nullish(),
    cameraUuid: z.string().nullable(),
    expirationTimeSecs: z.number().int().nullish(),
    includeAudio: z.boolean().nullable(),
    invertSchedule: z.boolean().nullish(),
    name: z.string().nullish(),
    password: z.string().nullish(),
    scheduleUuid: z.string().nullish(),
    streamType: StreamTypeEnum,
    vodEnabled: z.boolean().nullable(),
  })
  .passthrough();
const Camera_CreateSharedLiveVideoStreamWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sharedLiveM3U8StreamUrl: z.string().nullable(),
    sharedLiveVideoStreamUrl: z.string().nullable(),
    sharedLiveVideoStreamUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_CreateSharedVideoWallWSRequest = z
  .object({
    expirationTimeSecs: z.number().int().nullable(),
    invertSchedule: z.boolean().nullable(),
    password: z.string().nullable(),
    scheduleUuid: z.string().nullable(),
    videoWallUuid: z.string().nullable(),
    vodEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Camera_CreateSharedVideoWallWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sharedLiveVideoStreamUrl: z.string().nullable(),
    sharedLiveVideoStreamUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_CreateRawHttpStreamWSRequest = z
  .object({ deviceUuid: z.string().nullable(), rawStreamName: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_CreateRawHttpStreamWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    lanAudioUrl: z.string().nullable(),
    lanVideoLowResUrl: z.string().nullable(),
    lanVideoUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const VideoWallType = z
  .object({
    deviceList: z.array(z.string().nullable()).nullable(),
    displayName: z.string().nullable(),
    orgUuid: z.string().nullable(),
    othersCanEdit: z.boolean().nullable(),
    ownerUserUuid: z.string().nullable(),
    settings: z.record(z.object({}).partial().passthrough().nullable()).nullable(),
    shared: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_CreateVideoWallWSRequest = z
  .object({ videoWall: VideoWallType })
  .partial()
  .passthrough();
const Camera_CreateVideoWallWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_DeleteCameraWSRequest = z
  .object({ cameraUuid: z.string().nullable(), mummify: z.boolean().nullable() })
  .partial()
  .passthrough();
const Camera_DeleteCameraWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    responseStatus: z
      .enum([
        "BASIC_AUTH_FAILED",
        "PASSWORD_MISMATCH",
        "SAME_PASSWORD",
        "USER_EXISTS",
        "USER_NOT_FOUND",
        "DEVICE_NOT_FOUND",
        "POLICY_NOT_FOUND",
        "LOCATION_NOT_FOUND",
        "ORG_NOT_FOUND",
        "BAD_INPUT",
        "SUCCESS",
        "PASSWORD_TOO_SHORT",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const Camera_DeleteCustomFootageSeekpointsWSRequest = z
  .object({
    cameraUuids: z.array(z.string().nullable()).nullable(),
    customName: z.string().nullish(),
    endTimestampMs: z.number().int().gte(0).nullable(),
    startTimestampMs: z.number().int().gte(0).nullable(),
  })
  .passthrough();
const Camera_DeleteCustomFootageSeekpointsWSResponse_SeekPointDeleteResponse = z
  .object({ err: z.boolean().nullable(), errMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_DeleteCustomFootageSeekpointsWSResponse = z
  .object({
    deleteSeekpointResponseMap: z
      .record(Camera_DeleteCustomFootageSeekpointsWSResponse_SeekPointDeleteResponse)
      .nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_DeleteRawHttpStreamWSRequest = z
  .object({ customPathPart: z.string().nullable(), deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_DeleteRawHttpStreamWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_DeleteSharedLiveVideoStreamWSRequest = z
  .object({ cameraUuid: z.string().nullable(), uuid: z.string().nullable() })
  .partial()
  .passthrough();
const DeleteSharedLiveVideoStreamForDeviceResponse = z.object({}).partial().passthrough();
const Camera_DeleteSharedVideoWallWSRequest = z
  .object({ uuid: z.string().nullable(), videoWallUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_DeleteSharedVideoWallWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_DeleteVideoWallWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_DeleteVideoWallWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_EraseCameraWSRequest = z
  .object({ cameraUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_EraseCameraWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_FindAllSharedLiveVideoStreamsWSRequest = z.object({}).partial().passthrough();
const Camera_SharedLiveVideoStreamWS = z
  .object({
    audioGatewayUuid: z.string().nullable(),
    audioPushToTalkEnabled: z.boolean().nullable(),
    cameraUuid: z.string().nullable(),
    deviceUuid: z.string().nullable(),
    expirationTime: z.number().int().nullable(),
    hideOverlay: z.boolean().nullable(),
    invertSchedule: z.boolean().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    passwordProtected: z.boolean().nullable(),
    scheduleUuid: z.string().nullable(),
    sharedLiveM3U8StreamUrl: z.string().nullable(),
    sharedLiveVideoStreamUrl: z.string().nullable(),
    ssoProtected: z.boolean().nullable(),
    streamType: StreamTypeEnum,
    timestampMs: z.number().int().nullable(),
    unscheduledMessage: z.string().nullable(),
    uuid: z.string().nullable(),
    vodEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Camera_FindAllSharedLiveVideoStreamsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sharedLiveVideoStreams: z.array(Camera_SharedLiveVideoStreamWS).nullable(),
  })
  .partial()
  .passthrough();
const Camera_FindSharedLiveVideoStreamsForWSRequest = z
  .object({ cameraUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_FindSharedLiveVideoStreamsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sharedLiveVideoStreams: z.array(Camera_SharedLiveVideoStreamWS).nullable(),
  })
  .partial()
  .passthrough();
const Camera_FindSharedVideoWallsWSRequest = z
  .object({ videoWallUuid: z.string().nullable() })
  .partial()
  .passthrough();
const DeviceSchedule = z
  .object({
    invertSchedule: z.boolean().nullable(),
    scheduleUuid: z.string().nullable(),
    unscheduledMessage: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_SharedVideoWallWS = z
  .object({
    deviceScheduleMap: z.record(DeviceSchedule).nullable(),
    expirationTime: z.number().int().nullable(),
    hideOverlay: z.boolean().nullable(),
    invertSchedule: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    passwordProtected: z.boolean().nullable(),
    permissionGroupUuid: z.string().nullable(),
    scheduleUuid: z.string().nullable(),
    sharedVideoWallUrl: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
    unscheduledMessage: z.string().nullable(),
    uuid: z.string().nullable(),
    videoWallUuid: z.string().nullable(),
    vodEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Camera_FindSharedVideoWallsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sharedVideoWalls: z.array(Camera_SharedVideoWallWS).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GenerateBatchRegistrationInfoRequest = z
  .object({
    adminUserPermissionGroups: z.array(z.string().nullable()).nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    policyUuid: z.string().nullable(),
    readOnlyUserPermissionGroups: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GenerateBatchRegistrationInfoResponse = z
  .object({ env: z.string().nullable(), token: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_GenerateWifiChangeAuthorizationTokenWSRequest = z
  .object({ perceivedIp: z.string().nullable(), ssid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_GenerateWifiChangeAuthorizationTokenWSResponse = z
  .object({
    authorizationToken: z.array(z.string().nullable()).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetBatchRegistrationTokenUsageRequest = z
  .object({ sinceMillis: z.number().int().nullable(), token: z.string().nullable() })
  .partial()
  .passthrough();
const BatchRegistrationTokenUsageResult = z
  .object({
    di: z.string().nullable(),
    hi: z.string().nullable(),
    rs: z.string().nullable(),
    ts: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetBatchRegistrationTokenUsageResponse = z
  .object({ usageList: z.array(BatchRegistrationTokenUsageResult).nullable() })
  .partial()
  .passthrough();
const Camera_GetCameraAIThresholdsWSRequest = z
  .object({ cameraUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_GetCameraAIThresholdsWSResponse = z
  .object({
    consecutiveHumanFilter: z.number().int().gte(1).lte(5).nullable(),
    consecutiveVehicleFilter: z.number().int().gte(1).lte(5).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceConfidenceThreshold: z.number().gte(0).lte(1).nullable(),
    faceMatchConfidenceThreshold: z.number().gte(0).lte(1).nullable(),
    humanConfidenceThreshold: z.number().gte(0).lte(1).nullable(),
    lprConfidenceThreshold: z.number().gte(0).lte(1).nullable(),
    maxEventDurationMs: z.number().int().gte(4000).lte(30000).nullable(),
    vehicleConfidenceThreshold: z.number().gte(0).lte(1).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetCloudArchivedMediaInfoWSRequest = z
  .object({ cameraUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_GetCloudArchivedMediaInfoWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    oldestArchivedVideoSegmentSecs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetCloudArchivingConfigWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const DeviceTargetScope = z.enum(["ORG", "LOCATION", "DEVICE"]);
const CloudArchivingStrategy = z.enum(["WEEKLY_SCHEDULED", "CONTINUOUS"]);
const ScopedCloudArchivingConfig = z
  .object({
    orgUuid: z.string().nullable(),
    scope: DeviceTargetScope,
    targetUuid: z.string().nullable(),
    uploadScheduleInverted: z.boolean().nullable(),
    uploadScheduleUuid: z.string().nullable(),
    uploadStrategy: CloudArchivingStrategy,
  })
  .partial()
  .passthrough();
const Camera_GetCloudArchivingConfigWSResponse = z
  .object({
    archivingConfig: ScopedCloudArchivingConfig,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetConfigWSRequest = z
  .object({ cameraUuid: z.string().nullable() })
  .partial()
  .passthrough();
const CameraAiDewarpConfigType = z
  .object({
    dewarp_tile_height: z.number().int().nullable(),
    dewarp_tile_width: z.number().int().nullable(),
    orientation: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const RegionCoordinateType = z
  .object({ x: z.number().nullable(), y: z.number().nullable() })
  .partial()
  .passthrough();
const RegionPolygonType = z
  .object({ coordinates: z.array(RegionCoordinateType).nullable() })
  .partial()
  .passthrough();
const CameraCrossCountingSettingsType = z
  .object({
    in_roi: z.array(RegionPolygonType).nullable(),
    out_roi: z.array(RegionPolygonType).nullable(),
  })
  .partial()
  .passthrough();
const CameraMeteringConfigType = z
  .object({ rotation: z.number().int().nullable(), table: z.string().nullable() })
  .partial()
  .passthrough();
const PermyriadRect = z
  .object({
    h: z.number().int().nullable(),
    w: z.number().int().nullable(),
    x: z.number().int().nullable(),
    y: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const CameraMotorConfigType = z
  .object({
    af_enabled: z.boolean().nullable(),
    af_region: PermyriadRect,
    focus: z.number().int().nullable(),
    piris: z.number().int().nullable(),
    zoom: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const CameraPTZConfigType = z
  .object({
    offset_x_percent: z.number().nullable(),
    offset_y_percent: z.number().nullable(),
    rotation: z.number().int().nullable(),
    size_percent: z.number().nullable(),
  })
  .partial()
  .passthrough();
const RegionConfigType = z
  .object({ inverted: z.boolean().nullable(), polygons: z.array(RegionPolygonType).nullable() })
  .partial()
  .passthrough();
const Deviceconfig_ExternalVideoResolution = z
  .object({ height: z.number().int().nullable(), width: z.number().int().nullable() })
  .partial()
  .passthrough();
const AspectRatio = z
  .object({ height: z.number().int().nullable(), width: z.number().int().nullable() })
  .partial()
  .passthrough();
const DewarpedView = z
  .object({
    aspectRatio: AspectRatio,
    pitchDegrees: z.number().nullable(),
    rollDegrees: z.number().nullable(),
    verticalFieldOfViewDegrees: z.number().int().nullable(),
    yawDegrees: z.number().nullable(),
  })
  .partial()
  .passthrough();
const CameraVisualTamperConfigType = z
  .object({
    analyze_fps: z.number().int().nullable(),
    analyze_res: z.number().int().nullable(),
    canny_thresh: z.number().nullable(),
    edge_cov_diff_thresh: z.number().nullable(),
    enabled: z.boolean().nullable(),
    long_buf_size: z.number().int().nullable(),
    short_buf_size: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_ExternalCameraUserConfigReadableType = z
  .object({
    accelerometer_change_tamper_threshold: z.number().nullable(),
    accelerometer_disabled: z.boolean().nullable(),
    ai_dewarp_config: CameraAiDewarpConfigType,
    audio_analysis_enabled: z.boolean().nullable(),
    audio_analysis_params: AudioParamConfig,
    audio_external_mic_boost: z.number().int().nullable(),
    audio_external_mic_volume: z.number().int().nullable(),
    audio_external_speaker_volume: z.number().int().nullable(),
    audio_internal_mic_aec_enabled: z.boolean().nullable(),
    audio_internal_mic_boost: z.number().int().nullable(),
    audio_internal_mic_volume: z.number().int().nullable(),
    audio_internal_speaker_volume: z.number().int().nullable(),
    audio_use_external_mic: z.boolean().nullable(),
    audio_use_external_speaker: z.boolean().nullable(),
    audio_use_internal_speaker: z.boolean().nullable(),
    bandwidth_reports_disabled: z.boolean().nullable(),
    behavior_detection: z.boolean().nullable(),
    blocked_debounce_time_ms: z.number().int().nullable(),
    blocked_threshold: z.number().nullable(),
    cloud_archive_days: z.number().int().nullable(),
    cloud_archive_upload_schedule: z.array(WeeklyMinuteIntervalType).nullable(),
    cloud_archive_upload_schedule_inverted: z.boolean().nullable(),
    cloud_archive_upload_schedule_uuid: z.string().nullable(),
    color_detection: z.boolean().nullable(),
    con_human_filter: z.number().int().nullable(),
    con_vehicle_filter: z.number().int().nullable(),
    cross_counting: z.boolean().nullable(),
    cross_counting_settings: CameraCrossCountingSettingsType,
    deviceUuid: z.string().nullable(),
    device_mic_enabled: z.boolean().nullable(),
    device_speaker_enabled: z.boolean().nullable(),
    dewarpMode: z
      .enum([
        "NO_TRANSFORM",
        "NORMAL",
        "PANORAMA",
        "SUB_REGION",
        "VERTICAL_PANORAMA",
        "TRANSVERSE_MERCATOR",
        "MERCATOR",
        "EQUIRECTANGULAR",
      ])
      .nullable(),
    engagement_counting: z.boolean().nullable(),
    event_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
    exposure_level: z.number().int().nullable(),
    face_ai_threshold: z.number().nullable(),
    face_counting: z.boolean().nullable(),
    face_counting_nonunique: z.boolean().nullable(),
    face_id_ai_threshold: z.number().nullable(),
    face_match_threshold: z.number().nullable(),
    face_recognition: z.boolean().nullable(),
    fisheye_display_mode: z.enum(["RAW", "IMMERSIVE", "TILES", "RAW_PANO"]).nullable(),
    hdr_enabled: z.boolean().nullable(),
    img_brightness: z.number().int().nullable(),
    img_contrast: z.number().int().nullable(),
    img_saturation: z.number().int().nullable(),
    img_sharpness: z.number().int().nullable(),
    ir_filter_mode: z.enum(["ON", "OFF", "AUTO"]).nullable(),
    ir_leds_mode: z.enum(["ON", "OFF", "AUTO"]).nullable(),
    lastModified: z.number().int().nullable(),
    led_stealth_mode: z.boolean().nullable(),
    licenseplate_detection: z.boolean().nullable(),
    lpr_ai_threshold: z.number().nullable(),
    max_event_duration_ms: z.number().int().nullable(),
    media_ttl_minutes: z.number().int().nullable(),
    metering_config: CameraMeteringConfigType,
    motion_grid_disabled: z.boolean().nullable(),
    motion_grid_window_sec: z.number().int().nullable(),
    motion_lightweight_disabled: z.boolean().nullable(),
    motion_threshold: z.number().nullable(),
    motor_config: CameraMotorConfigType,
    mounting_direction: z.enum(["DOWN", "UP", "SIDEWAYS", "UNKNOWN"]).nullable(),
    new_motion_feature_flag: z.boolean().nullable(),
    night_exposure_level: z.number().int().nullable(),
    night_img_brightness: z.number().int().nullable(),
    night_img_contrast: z.number().int().nullable(),
    night_img_saturation: z.number().int().nullable(),
    night_img_sharpness: z.number().int().nullable(),
    night_metering_config: CameraMeteringConfigType,
    night_sensor_gain_max: z.number().int().nullable(),
    night_shutter_time_max: z.number().int().nullable(),
    night_shutter_time_min: z.number().int().nullable(),
    obj_ai_threshold: z.number().nullable(),
    people_counting: z.boolean().nullable(),
    person_ai_threshold: z.number().nullable(),
    pose_detection: z.boolean().nullable(),
    ppe_detection: z.boolean().nullable(),
    pressure_switch_tamper_disabled: z.boolean().nullable(),
    privacy_windows: z.array(PermyriadRect).nullable(),
    ptz_config: CameraPTZConfigType,
    region_of_interest: RegionConfigType,
    resolution: Deviceconfig_ExternalVideoResolution,
    rotation: z.number().int().nullable(),
    segment_max_bytes: z.number().int().nullable(),
    sensor_gain_max: z.number().int().nullable(),
    shutter_time_max: z.number().int().nullable(),
    shutter_time_min: z.number().int().nullable(),
    snapshot_height: z.number().int().nullable(),
    snapshot_interval_secs: z.number().int().nullable(),
    splice_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
    target_ai_fps: z.number().int().nullable(),
    thumbstrip_disabled: z.boolean().nullable(),
    tile_views: z.array(DewarpedView).nullable(),
    timelapse: z.boolean().nullable(),
    use_onboard_ai: z.boolean().nullable(),
    use_pilot_face_id: z.boolean().nullable(),
    vehicle_ai_threshold: z.number().nullable(),
    vehicle_counting: z.boolean().nullable(),
    video_persist_disabled: z.boolean().nullable(),
    visual_tamper_config: CameraVisualTamperConfigType,
    wdr_strength: z.number().int().nullable(),
    zero_motion_video_quality: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetConfigWSResponse = z
  .object({
    config: Camera_ExternalCameraUserConfigReadableType,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetCustomFootageSeekpointsV2WSRequest = z
  .object({
    customDescription: z.string().nullish(),
    customDisplayName: z.string().nullish(),
    deviceUuids: z.array(z.string().nullable()).nullish(),
    duration: z.number().int().nullable(),
    locationUuids: z.array(z.string().nullable()).nullish(),
    startTime: z.number().int().nullable(),
  })
  .passthrough();
const SeekpointIndexType = z
  .object({
    customDescription: z.string().nullable(),
    customDisplayName: z.string().nullable(),
    deviceUuid: z.string().nullable(),
    locationUuid: z.string().nullable(),
    objectType: ActivityEnum,
    orgUuid: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetCustomFootageSeekpointsV2WSResponse = z
  .object({
    customFootageSeekPoints: z.array(SeekpointIndexType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetCameraDetailsWSRequest = z
  .object({ cameraUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const DeviceTypeEnum = z.enum([
  "BLE_TRACKER",
  "CAMERA",
  "DOOR_SENSOR",
  "ENVIRONMENTAL_SENSOR",
  "OCCUPANCY_SENSOR",
  "AUDIO_GATEWAY",
  "EXECUTABLE",
  "BADGE_READER",
  "DOOR_CONTROLLER",
  "BLE_BUTTON",
  "IO_BOARD",
  "UNKNOWN",
]);
const Camera_CameraExternalType = z
  .object({
    archiveRegion: z.string().nullable(),
    cameraFramerate: z.number().int().nullable(),
    createdAtMillis: z.number().int().nullable(),
    customData: z.string().nullable(),
    deleted: z.boolean().nullable(),
    description: z.string().nullable(),
    directionRadians: z.number().nullable(),
    floorNumber: z.number().int().nullable(),
    hwVariation: HardwareVariationEnum,
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    mummified: z.boolean().nullable(),
    name: z.string().nullable(),
    pending: z.boolean().nullable(),
    policyUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    type: DeviceTypeEnum,
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetCameraDetailsWSResponse = z
  .object({
    cameras: z.array(Camera_CameraExternalType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetFootageBoundingBoxesWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    duration: z.number().int().nullable(),
    startTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetFootageBoundingBoxesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    footageBoundingBoxes: z.array(FootageBoundingBoxType).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetFootageBoundingBoxesForMultipleWSRequest = z
  .object({
    cameraUuids: z.array(z.string().nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_FootageBoundingBoxSummaryType = z
  .object({ deviceMap: z.record(FootageBoundingBoxType).nullable() })
  .partial()
  .passthrough();
const Camera_GetFootageBoundingBoxesForMultipleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    footageBoundingBoxMap: z.record(Camera_FootageBoundingBoxSummaryType).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetFootageSeekpointsForMultipleWSRequest = z
  .object({
    cameraUuids: z.array(z.string().nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    includeAnyMotion: z.boolean().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_FootageSeekPointSummaryType = z
  .object({
    activityCountMap: z.record(z.record(z.number().int().nullable()).nullable()).nullable(),
    alert: z.boolean().nullable(),
    faceNames: z.array(z.string().nullable()).nullable(),
    poses: z.array(z.string().nullable()).nullable(),
    recognizedObjects: z.array(z.string().nullable()).nullable(),
    unidentifiedFaceIds: z.array(z.string().nullable()).nullable(),
    vehicleLicensePlates: z.array(z.string().nullable()).nullable(),
    vehicleNames: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetFootageSeekpointsForMultipleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    footageSeekPointMap: z.record(Camera_FootageSeekPointSummaryType).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetFootageSeekpointsV2WSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    duration: z.number().int().nullable(),
    includeAnyMotion: z.boolean().nullable(),
    startTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetFootageSeekpointsV2WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    footageSeekPoints: z.array(FootageSeekPointV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetFullCameraStateWSRequest = z
  .object({ cameraUuid: z.string().nullable(), force: z.boolean().nullable() })
  .partial()
  .passthrough();
const Camera_GetFullCameraStateWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    fullCameraState: FullDeviceStateType,
  })
  .partial()
  .passthrough();
const Camera_GetMediaUrisWSRequest = z
  .object({ cameraUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_GetMediaUrisWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    lanCheckUrls: z.array(z.string().nullable()).nullable(),
    lanLiveH264Uris: z.array(z.string().nullable()).nullable(),
    lanLiveM3u8Uris: z.array(z.string().nullable()).nullable(),
    lanLiveMpdUris: z.array(z.string().nullable()).nullable(),
    lanVodM3u8UrisTemplates: z.array(z.string().nullable()).nullable(),
    lanVodMpdUrisTemplates: z.array(z.string().nullable()).nullable(),
    wanLiveH264Uri: z.string().nullable(),
    wanLiveM3u8Uri: z.string().nullable(),
    wanLiveMpdUri: z.string().nullable(),
    wanVodM3u8UriTemplate: z.string().nullable(),
    wanVodMpdUriTemplate: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetMinimalCameraLocationMapWSRequest = z.object({}).partial().passthrough();
const Camera_GetMinimalCameraLocationMapWSResponse_CameraLocationInfo = z
  .object({
    cameraName: z.string().nullable(),
    locationName: z.string().nullable(),
    locationUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetMinimalCameraLocationMapWSResponse = z
  .object({
    cameraLocationMap: z
      .record(Camera_GetMinimalCameraLocationMapWSResponse_CameraLocationInfo)
      .nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetMinimalCameraStateListWSRequest = z
  .object({ includeMummified: z.boolean().nullable() })
  .partial()
  .passthrough();
const MinimalDeviceStateType = z
  .object({
    connectionStatus: DeviceStatusEnum,
    createdAtMillis: z.number().int().nullable(),
    defaultInterface: z.string().nullable(),
    defaultInterfaceMac: z.string().nullable(),
    directionRadians: z.number().nullable(),
    externalIPAddress: z.string().nullable(),
    firmwareUpdateInProgress: z.boolean().nullable(),
    firmwareVersion: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    healthStatus: DeviceStatusEnum,
    healthStatusDetails: DeviceHealthStatusDetailsEnum,
    hwVariation: HardwareVariationEnum,
    lanAddresses: z.array(z.string().nullable()).nullable(),
    latitude: z.number().nullable(),
    liveStreamShared: z.boolean().nullable(),
    liveStreamsSharedCount: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    mediaRegion: z.string().nullable(),
    mummified: z.boolean().nullable(),
    name: z.string().nullable(),
    policyUuid: z.string().nullable(),
    region: z.string().nullable(),
    serialNumber: z.string().nullable(),
    ssid: z.string().nullable(),
    uuid: z.string().nullable(),
    wifiApMac: z.string().nullable(),
    wifiBars: z.number().int().nullable(),
    wifiSignalStrength: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetMinimalCameraStateListWSResponse = z
  .object({
    cameraStates: z.array(MinimalDeviceStateType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetOfflineLanStreamingInfoWSRequest = z.object({}).partial().passthrough();
const Camera_CameraOfflineLanStreamingInfo = z
  .object({
    accessToken: z.string().nullable(),
    lanAddresses: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetOfflineLanStreamingInfoWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    info: z.record(Camera_CameraOfflineLanStreamingInfo).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetPresenceWindowsWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    durationSec: z.number().int().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetPresenceWindowsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    presenceWindows: z.record(z.array(TimeWindowSeconds).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetRawHttpStreamsWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_LanSpecificRawStreamType = z
  .object({
    audioPath: z.string().nullable(),
    createdAtMs: z.number().int().nullable(),
    createdBy: z.string().nullable(),
    customPathPart: z.string().nullable(),
    deviceUuid: z.string().nullable(),
    lanAudioUrl: z.string().nullable(),
    lanVideoLowResUrl: z.string().nullable(),
    lanVideoUrl: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    videoLowResPath: z.string().nullable(),
    videoPath: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetRawHttpStreamsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    rawHttpStreams: z.array(Camera_LanSpecificRawStreamType).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetStorageRecoveryFileWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_GetStorageRecoveryFileWSResponse = z
  .object({ fileContents: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Camera_GetUptimeWindowsWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    endTime: z.number().int().nullable(),
    startTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetUptimeWindowsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    uptimeWindows: z.array(TimeWindowSeconds).nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetVideoWallsWSRequest = z.object({}).partial().passthrough();
const Camera_VideoWallSummaryType = z
  .object({
    deviceList: z.array(z.string().nullable()).nullable(),
    displayName: z.string().nullable(),
    numShares: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    othersCanEdit: z.boolean().nullable(),
    ownerUserUuid: z.string().nullable(),
    settings: z.record(z.object({}).partial().passthrough().nullable()).nullable(),
    shared: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetVideoWallsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    userNameMap: z.record(z.string().nullable()).nullable(),
    videoWalls: z.array(Camera_VideoWallSummaryType).nullable(),
  })
  .partial()
  .passthrough();
const Camera_RebootCameraWSRequest = z
  .object({ cameraUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_RebootCameraWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    status: z
      .enum(["SUCCESS_REBOOT_SENT", "FAILED_CAMERA_OFFLINE", "FAILED_CAMERA_NOT_AUTHORIZED"])
      .nullable(),
  })
  .partial()
  .passthrough();
const Camera_UpdateCameraAIThresholdsWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    consecutiveHumanFilter: z.number().int().gte(1).lte(5).nullish(),
    consecutiveVehicleFilter: z.number().int().gte(1).lte(5).nullish(),
    faceConfidenceThreshold: z.number().gte(0).lte(1).nullish(),
    faceMatchConfidenceThreshold: z.number().gte(0).lte(1).nullish(),
    humanConfidenceThreshold: z.number().gte(0).lte(1).nullish(),
    lprConfidenceThreshold: z.number().gte(0).lte(1).nullish(),
    maxEventDurationMs: z.number().int().gte(4000).lte(30000).nullish(),
    vehicleConfidenceThreshold: z.number().gte(0).lte(1).nullish(),
  })
  .passthrough();
const Camera_UpdateCameraAIThresholdsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_ExternalCameraUserConfigUpdatableType = z
  .object({
    accelerometer_change_tamper_threshold: z.number().nullable(),
    accelerometer_disabled: z.boolean().nullable(),
    ai_dewarp_config: CameraAiDewarpConfigType,
    ambient_dtn_threshold: z.number().int().nullable(),
    ambient_ntd_threshold: z.number().int().nullable(),
    ambient_sole_determiner: z.boolean().nullable(),
    audio_analysis_enabled: z.boolean().nullable(),
    audio_analysis_params: AudioParamConfig,
    audio_external_mic_boost: z.number().int().nullable(),
    audio_external_mic_volume: z.number().int().nullable(),
    audio_external_speaker_volume: z.number().int().nullable(),
    audio_internal_mic_aec_enabled: z.boolean().nullable(),
    audio_internal_mic_boost: z.number().int().nullable(),
    audio_internal_mic_volume: z.number().int().nullable(),
    audio_internal_speaker_volume: z.number().int().nullable(),
    audio_record: z.boolean().nullable(),
    audio_use_external_mic: z.boolean().nullable(),
    audio_use_external_speaker: z.boolean().nullable(),
    audio_use_internal_speaker: z.boolean().nullable(),
    behavior_detection: z.boolean().nullable(),
    blocked_debounce_time_ms: z.number().int().nullable(),
    blocked_threshold: z.number().nullable(),
    cloud_archive_target: z.enum(["0", "1", "2"]).nullable(),
    cloud_archive_upload_schedule: z.array(WeeklyMinuteIntervalType).nullable(),
    cloud_archive_upload_schedule_inverted: z.boolean().nullable(),
    cloud_archive_upload_schedule_uuid: z.string().nullable(),
    con_human_filter: z.number().int().nullable(),
    con_vehicle_filter: z.number().int().nullable(),
    cross_counting: z.boolean().nullable(),
    cross_counting_settings: CameraCrossCountingSettingsType,
    deviceUuid: z.string().nullable(),
    device_mic_enabled: z.boolean().nullable(),
    device_speaker_enabled: z.boolean().nullable(),
    dewarpMode: z
      .enum([
        "NO_TRANSFORM",
        "NORMAL",
        "PANORAMA",
        "SUB_REGION",
        "VERTICAL_PANORAMA",
        "TRANSVERSE_MERCATOR",
        "MERCATOR",
        "EQUIRECTANGULAR",
      ])
      .nullable(),
    event_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
    exposure_level: z.number().int().nullable(),
    face_ai_threshold: z.number().nullable(),
    face_id_ai_threshold: z.number().nullable(),
    face_match_threshold: z.number().nullable(),
    fisheye_display_mode: z.enum(["RAW", "IMMERSIVE", "TILES", "RAW_PANO"]).nullable(),
    hdr_enabled: z.boolean().nullable(),
    img_brightness: z.number().int().nullable(),
    img_contrast: z.number().int().nullable(),
    img_saturation: z.number().int().nullable(),
    img_sharpness: z.number().int().nullable(),
    ir_filter_mode: z.enum(["ON", "OFF", "AUTO"]).nullable(),
    ir_leds_mode: z.enum(["ON", "OFF", "AUTO"]).nullable(),
    lastModified: z.number().int().nullable(),
    led_stealth_mode: z.boolean().nullable(),
    lpr_ai_threshold: z.number().nullable(),
    max_event_duration_ms: z.number().int().nullable(),
    media_ttl_minutes: z.number().int().nullable(),
    metering_config: CameraMeteringConfigType,
    motion_grid_window_sec: z.number().int().nullable(),
    motion_threshold: z.number().nullable(),
    motor_config: CameraMotorConfigType,
    mounting_direction: z.enum(["DOWN", "UP", "SIDEWAYS", "UNKNOWN"]).nullable(),
    new_motion_feature_flag: z.boolean().nullable(),
    night_exposure_level: z.number().int().nullable(),
    night_img_brightness: z.number().int().nullable(),
    night_img_contrast: z.number().int().nullable(),
    night_img_saturation: z.number().int().nullable(),
    night_img_sharpness: z.number().int().nullable(),
    night_metering_config: CameraMeteringConfigType,
    night_sensor_gain_max: z.number().int().nullable(),
    night_shutter_time_max: z.number().int().nullable(),
    night_shutter_time_min: z.number().int().nullable(),
    obj_ai_threshold: z.number().nullable(),
    orgUuid: z.string().nullable(),
    person_ai_threshold: z.number().nullable(),
    pressure_switch_tamper_disabled: z.boolean().nullable(),
    privacy_windows: z.array(PermyriadRect).nullable(),
    ptz_config: CameraPTZConfigType,
    region_of_interest: RegionConfigType,
    resolution: Deviceconfig_ExternalVideoResolution,
    rotation: z.number().int().nullable(),
    segment_max_bytes: z.number().int().nullable(),
    sensor_gain_max: z.number().int().nullable(),
    shutter_time_max: z.number().int().nullable(),
    shutter_time_min: z.number().int().nullable(),
    snapshot_height: z.number().int().nullable(),
    snapshot_interval_secs: z.number().int().nullable(),
    splice_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
    target_ai_fps: z.number().int().nullable(),
    tile_views: z.array(DewarpedView).nullable(),
    timelapse: z.boolean().nullable(),
    use_pilot_face_id: z.boolean().nullable(),
    vehicle_ai_threshold: z.number().nullable(),
    video_persist_disabled: z.boolean().nullable(),
    video_resolution: z.number().int().nullable(),
    video_target_quality: z.number().int().nullable(),
    wdr_strength: z.number().int().nullable(),
    zero_motion_video_quality: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Camera_UpdateConfigWSRequest = z
  .object({ config: Camera_ExternalCameraUserConfigUpdatableType })
  .partial()
  .passthrough();
const Camera_UpdateConfigWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_UpdateCameraV2WSRequest = z
  .object({
    customData: z.string().nullable(),
    customDataUpdated: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    deletedUpdated: z.boolean().nullable(),
    description: z.string().nullable(),
    descriptionUpdated: z.boolean().nullable(),
    directionRadians: z.number().nullable(),
    directionRadiansUpdated: z.boolean().nullable(),
    floorNumber: z.number().int().nullable(),
    floorNumberUpdated: z.boolean().nullable(),
    latitude: z.number().nullable(),
    latitudeUpdated: z.boolean().nullable(),
    locationUuid: z.string().nullable(),
    locationUuidUpdated: z.boolean().nullable(),
    longitude: z.number().nullable(),
    longitudeUpdated: z.boolean().nullable(),
    mummified: z.boolean().nullable(),
    mummifiedUpdated: z.boolean().nullable(),
    name: z.string().nullable(),
    nameUpdated: z.boolean().nullable(),
    policyUuid: z.string().nullable(),
    policyUuidUpdated: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_UpdateCamerasBulkV2WSRequest = z
  .object({ cameraBulkDetails: z.array(Camera_UpdateCameraV2WSRequest).nullable() })
  .partial()
  .passthrough();
const Camera_UpdateCameraV2WSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_UpdateCameraFirmwareWSRequest = z
  .object({ cameraUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_UpdateCameraFirmwareWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    status: z
      .enum([
        "ALREADY_ON_THE_LATEST_FIRMWARE",
        "DEVICE_ON_A_SPECIAL_FIRMWARE_AND_CANNOT_BE_UPDATED",
        "UPDATE_STARTED",
        "UNABLE_TO_REACH_DEVICE",
        "FIRMWARE_UPDATE_ALREADY_IN_PROGESS",
        "DEVICE_NOT_AUTHROIZED",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const Camera_UpdateVideoWallWSRequest = z
  .object({ videoWall: VideoWallType })
  .partial()
  .passthrough();
const Camera_UpdateVideoWallWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Camera_UpdateWifiWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    cameraUuids: z.array(z.string().nullable()).nullable(),
    password: z.string().nullable(),
    ssid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_UpdateWifiWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    status: z.record(z.boolean().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Climate_GetClimateEventsForSensorWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    sensorUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ClimateEventType = z
  .object({
    alertActivities: z.array(ActivityEnum).nullable(),
    baseStationUuid: z.string().nullable(),
    batteryPercentage: z.number().int().nullable(),
    bleDeviceUuid: z.string().nullable(),
    bleRssi: z.number().int().nullable(),
    closeBaseStations: z.array(z.string().nullable()).nullable(),
    co2: z.number().nullable(),
    ethanol: z.number().nullable(),
    humidity: z.number().nullable(),
    iaq: z.number().nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    pm25: z.number().nullable(),
    probeTempC: z.number().nullable(),
    tampered: z.boolean().nullable(),
    temp: z.number().nullable(),
    thcDetected: z.boolean().nullable(),
    thcPercent: z.number().nullable(),
    timestampMs: z.number().int().nullable(),
    tvoc: z.number().nullable(),
    vapeSmokeDetected: z.boolean().nullable(),
    vapeSmokePercent: z.number().nullable(),
  })
  .partial()
  .passthrough();
const Climate_GetClimateEventsForSensorWSResponse = z
  .object({
    climateEvents: z.array(ClimateEventType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Sensor_GetSensorPresenceWindowsWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    durationSec: z.number().int().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Sensor_GetSensorPresenceWindowsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    presenceWindows: z.array(TimeWindowSeconds).nullable(),
  })
  .partial()
  .passthrough();
const Climate_GetClimateSensorConfigWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const ClimateUserConfig = z
  .object({
    accelerometer_change_tamper_threshold: z.number().nullable(),
    accelerometer_disabled: z.boolean().nullable(),
    alert_window_minutes: z.number().int().nullable(),
    deviceUuid: z.string().nullable(),
    lastModified: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    pressure_switch_tamper_disabled: z.boolean().nullable(),
    smoke_ai_threshold: z.number().nullable(),
    thc_ai_threshold: z.number().nullable(),
    vape_ai_threshold: z.number().nullable(),
  })
  .partial()
  .passthrough();
const Climate_GetClimateSensorConfigWSResponse = z
  .object({
    config: ClimateUserConfig,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Climate_GetMinimalClimateStatesWSRequest = z.object({}).partial().passthrough();
const Climate_MinimalClimateStateType = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    batteryPercent: z.number().int().nullable(),
    calibrating: z.boolean().nullable(),
    co2: z.number().nullable(),
    createdAtMillis: z.number().int().nullable(),
    ethanol: z.number().nullable(),
    firmwareVersion: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    health: z.enum(["GREEN", "RED"]).nullable(),
    healthDetails: z.enum(["FIRMWARE_BEHIND", "NO_HEARTBEAT", "NONE"]).nullable(),
    humidity: z.number().nullable(),
    hwVariation: HardwareVariationEnum,
    iaq: z.number().nullable(),
    lastSeenSec: z.number().int().nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    pm25: z.number().nullable(),
    policyUuid: z.string().nullable(),
    probeConnected: z.boolean().nullable(),
    probeTempC: z.number().nullable(),
    sensorUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    signalStrength: z.number().int().nullable(),
    temperatureCelcius: z.number().nullable(),
    thcPercent: z.number().nullable(),
    tvoc: z.number().nullable(),
    vapePercent: z.number().nullable(),
  })
  .partial()
  .passthrough();
const Climate_GetMinimalClimateStatesWSResponse = z
  .object({
    climateStates: z.array(Climate_MinimalClimateStateType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Climate_UpdateClimateSensorDetailsWSRequest = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    associatedCamerasUpdated: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    deletedUpdated: z.boolean().nullable(),
    description: z.string().nullable(),
    descriptionUpdated: z.boolean().nullable(),
    floorNumber: z.number().int().nullable(),
    floorNumberUpdated: z.boolean().nullable(),
    latitude: z.number().nullable(),
    latitudeUpdated: z.boolean().nullable(),
    locationUuid: z.string().nullable(),
    locationUuidUpdated: z.boolean().nullable(),
    longitude: z.number().nullable(),
    longitudeUpdated: z.boolean().nullable(),
    name: z.string().nullable(),
    nameUpdated: z.boolean().nullable(),
    policyUuid: z.string().nullable(),
    policyUuidUpdated: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Climate_UpdateClimateSensorDetailsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Component_AddAccessControlledDoorLabelWSRequest = z
  .object({ accessControlledDoorUuid: z.string().nullable(), label: z.string().nullable() })
  .partial()
  .passthrough();
const Component_AddAccessControlledDoorLabelWSResponse = z.object({}).partial().passthrough();
const ComponentReferenceType = z
  .object({ componentUuid: z.string().nullable(), deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const ComponentCompositeEnumType = z.literal("AccessControlledDoor");
const WaveToUnlockSettingsType = z
  .object({
    awaitAuthDurationMs: z.number().int().nullable(),
    enabled: z.boolean().nullable(),
    minRSSIThreshold: z.number().int().nullable(),
    showAwaitIntentFeedback: z.boolean().nullable(),
    treatNfcAsIntent: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const AccessControlledDoorType = z
  .object({
    ajarTimeSec: z.number().int().nullable(),
    associatedCameras: z.array(z.string().nullable()).nullable(),
    createdAtMillis: z.number().int().nullable(),
    defaultState: AccessControlledDoorStateEnumType,
    directionRadians: z.number().nullable(),
    doorStateToScheduleUuidMap: z.record(z.string().nullable()).nullable(),
    dpiComponents: z.array(ComponentReferenceType).nullable(),
    floorNumber: z.number().int().nullable(),
    forcedOpenTimeSec: z.number().int().nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    policyUuid: z.string().nullable(),
    readerComponents: z.array(ComponentReferenceType).nullable(),
    relayComponents: z.array(ComponentReferenceType).nullable(),
    relockAfterOpenTimeMs: z.number().int().nullable(),
    remoteUnlockEnabled: z.boolean().nullable(),
    rexComponents: z.array(ComponentReferenceType).nullable(),
    type: ComponentCompositeEnumType,
    unlockTimeSec: z.number().int().nullable(),
    unlockTimeSecRex: z.number().int().nullable(),
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
    waveToUnlockSettings: WaveToUnlockSettingsType,
  })
  .partial()
  .passthrough();
const Component_CreateAccessControlledDoorWSRequest = z
  .object({
    accessControlledDoor: AccessControlledDoorType,
    accessControlledDoorLabels: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateAccessControlledDoorWSResponse = z
  .object({
    accessControlledDoor: AccessControlledDoorType,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const DoorPositionIndicatorPhysicalPortEnumType = z.enum(["GPIO_INPUT", "GPIO_INPUT_SUPERVISED"]);
const DoorPositionIndicatorPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: DoorPositionIndicatorPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedDoorPositionIndicatorWSRequest = z
  .object({
    name: z.string().nullable(),
    normalState: z.enum(["NO", "NC"]).nullable(),
    ownerDeviceUuid: z.string().nullable(),
    port: DoorPositionIndicatorPortType,
  })
  .partial()
  .passthrough();
const ComponentBaseEnumType = z.enum(["reader", "dpi", "relay", "rex", "aux", "button"]);
const DoorPositionIndicatorEnumType = z.enum(["integrated", "remote"]);
const NormalStateEnumType = z.enum(["NO", "NC"]);
const ComponentEnumType = z.enum([
  "RhombusOsdpDoorReader",
  "OsdpDoorReader",
  "WiegandDoorReader",
  "IntegratedDoorPositionIndicator",
  "IntegratedRequestToExit",
  "IntegratedDoorRelay",
  "IntegratedGenericRelay",
  "IntegratedGenericInput",
  "IntegratedGenericButton",
]);
const IntegratedDoorPositionIndicatorType = z
  .object({
    baseType: ComponentBaseEnumType,
    createdAtMillis: z.number().int().nullable(),
    dpiType: DoorPositionIndicatorEnumType,
    name: z.string().nullable(),
    normalState: NormalStateEnumType,
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    port: DoorPositionIndicatorPortType,
    portImmutable: z.boolean().nullable(),
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedDoorPositionIndicatorWSResponse = z
  .object({ component: IntegratedDoorPositionIndicatorType })
  .partial()
  .passthrough();
const DoorRelayPhysicalPortEnumType = z.literal("GPIO_OUTPUT");
const DoorRelayPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: DoorRelayPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedDoorRelayWSRequest = z
  .object({
    name: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    port: DoorRelayPortType,
  })
  .partial()
  .passthrough();
const DoorRelayEnumType = z.literal("integrated");
const IntegratedDoorRelayType = z
  .object({
    baseType: ComponentBaseEnumType,
    createdAtMillis: z.number().int().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    port: DoorRelayPortType,
    portImmutable: z.boolean().nullable(),
    relayType: DoorRelayEnumType,
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedDoorRelayWSResponse = z
  .object({ component: IntegratedDoorRelayType })
  .partial()
  .passthrough();
const ButtonPhysicalPortEnumType = z.enum(["GPIO_INPUT", "BUTTON_INPUT"]);
const ButtonPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: ButtonPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedGenericButtonWSRequest = z
  .object({
    mode: ButtonModeEnum,
    name: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    port: ButtonPortType,
  })
  .partial()
  .passthrough();
const ButtonEnumType = z.enum(["integrated_generic_button", "integrated_doorbell_button"]);
const IntegratedGenericButtonType = z
  .object({
    baseType: ComponentBaseEnumType,
    buttonType: ButtonEnumType,
    createdAtMillis: z.number().int().nullable(),
    mode: ButtonModeEnum,
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    port: ButtonPortType,
    portImmutable: z.boolean().nullable(),
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedGenericButtonWSResponse = z
  .object({ component: IntegratedGenericButtonType })
  .partial()
  .passthrough();
const AuxiliaryInputPhysicalPortEnumType = z.literal("GPIO_INPUT");
const AuxiliaryInputPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: AuxiliaryInputPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedGenericInputWSRequest = z
  .object({
    name: z.string().nullable(),
    normalState: z.enum(["NO", "NC"]).nullable(),
    ownerDeviceUuid: z.string().nullable(),
    port: AuxiliaryInputPortType,
  })
  .partial()
  .passthrough();
const AuxiliaryEnumType = z.enum(["integrated_generic_input", "integrated_generic_relay"]);
const IntegratedGenericInputType = z
  .object({
    auxType: AuxiliaryEnumType,
    baseType: ComponentBaseEnumType,
    createdAtMillis: z.number().int().nullable(),
    name: z.string().nullable(),
    normalState: NormalStateEnumType,
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    port: AuxiliaryInputPortType,
    portImmutable: z.boolean().nullable(),
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedGenericInputWSResponse = z
  .object({ component: IntegratedGenericInputType })
  .partial()
  .passthrough();
const AuxiliaryRelayPhysicalPortEnumType = z.literal("GPIO_OUTPUT");
const AuxiliaryRelayPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: AuxiliaryRelayPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedGenericRelayWSRequest = z
  .object({
    name: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    port: AuxiliaryRelayPortType,
    relayDurationSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const IntegratedGenericRelayType = z
  .object({
    auxType: AuxiliaryEnumType,
    baseType: ComponentBaseEnumType,
    createdAtMillis: z.number().int().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    port: AuxiliaryRelayPortType,
    portImmutable: z.boolean().nullable(),
    relayDurationSec: z.number().int().nullable(),
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedGenericRelayWSResponse = z
  .object({ component: IntegratedGenericRelayType })
  .partial()
  .passthrough();
const RequestToExitPhysicalPortEnumType = z.enum(["GPIO_INPUT", "GPIO_INPUT_SUPERVISED"]);
const RequestToExitPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: RequestToExitPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedRequestToExitWSRequest = z
  .object({
    name: z.string().nullable(),
    normalState: z.enum(["NO", "NC"]).nullable(),
    ownerDeviceUuid: z.string().nullable(),
    port: RequestToExitPortType,
  })
  .partial()
  .passthrough();
const RequestToExitEnumType = z.enum(["integrated", "remote"]);
const IntegratedRequestToExitType = z
  .object({
    baseType: ComponentBaseEnumType,
    createdAtMillis: z.number().int().nullable(),
    name: z.string().nullable(),
    normalState: NormalStateEnumType,
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    port: RequestToExitPortType,
    portImmutable: z.boolean().nullable(),
    rexType: RequestToExitEnumType,
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateIntegratedRequestToExitWSResponse = z
  .object({ component: IntegratedRequestToExitType })
  .partial()
  .passthrough();
const OsdpPhysicalPortEnumType = z.literal("RS485");
const OsdpReaderPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: OsdpPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const Component_CreateOsdpReaderWSRequest = z
  .object({
    name: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    port: OsdpReaderPortType,
  })
  .partial()
  .passthrough();
const DoorReaderEnumType = z.enum(["wiegand", "osdp", "rhombus_osdp"]);
const OsdpDoorReaderType = z
  .object({
    baseType: ComponentBaseEnumType,
    createdAtMillis: z.number().int().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    osdpAddress: z.number().int().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    port: OsdpReaderPortType,
    portImmutable: z.boolean().nullable(),
    readerType: DoorReaderEnumType,
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateOsdpReaderWSResponse = z
  .object({ component: OsdpDoorReaderType })
  .partial()
  .passthrough();
const Component_CreateRhombusOsdpReaderWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    name: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    port: OsdpReaderPortType,
  })
  .partial()
  .passthrough();
const RhombusOsdpDoorReaderType = z
  .object({
    baseType: ComponentBaseEnumType,
    createdAtMillis: z.number().int().nullable(),
    deviceUuid: z.string().nullable(),
    hardwareUuid: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    osdpAddress: z.number().int().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    port: OsdpReaderPortType,
    portImmutable: z.boolean().nullable(),
    readerType: DoorReaderEnumType,
    serialNumber: z.string().nullable(),
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateRhombusOsdpReaderWSResponse = z
  .object({ component: RhombusOsdpDoorReaderType })
  .partial()
  .passthrough();
const WiegandOutputPhysicalPortEnumType = z.literal("WIEGAND_OUTPUT");
const WiegandOutputPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: WiegandOutputPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const WiegandDataPhysicalPortEnumType = z.literal("WIEGAND_INPUT");
const WiegandDataPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: WiegandDataPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const WiegandInputPhysicalPortEnumType = z.enum(["WIEGAND_INPUT", "GPIO_INPUT"]);
const WiegandInputPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    portNum: z.number().int().nullable(),
    portType: WiegandInputPhysicalPortEnumType,
  })
  .partial()
  .passthrough();
const Component_CreateWiegandReaderWSRequest = z
  .object({
    buzzerPort: WiegandOutputPortType,
    d0Port: WiegandDataPortType,
    d1Port: WiegandDataPortType,
    gledPort: WiegandOutputPortType,
    name: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    rledPort: WiegandOutputPortType,
    tamperPort: WiegandInputPortType,
  })
  .partial()
  .passthrough();
const WiegandDoorReaderType = z
  .object({
    baseType: ComponentBaseEnumType,
    buzzerPort: WiegandOutputPortType,
    createdAtMillis: z.number().int().nullable(),
    d0Port: WiegandDataPortType,
    d1Port: WiegandDataPortType,
    gledPort: WiegandOutputPortType,
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    portImmutable: z.boolean().nullable(),
    readerType: DoorReaderEnumType,
    rledPort: WiegandOutputPortType,
    tamperPort: WiegandInputPortType,
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_CreateWiegandReaderWSResponse = z
  .object({ component: WiegandDoorReaderType })
  .partial()
  .passthrough();
const Component_DeleteAccessControlledDoorWSRequest = z
  .object({ accessControlledDoorUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Component_DeleteAccessControlledDoorWSResponse = z
  .object({ accessControlledDoor: AccessControlledDoorType })
  .partial()
  .passthrough();
const Component_DeleteComponentWSRequest = z
  .object({ componentUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Component_DeleteComponentWSResponse = z.object({}).partial().passthrough();
const Component_DeleteComponentsByOwnerDeviceWSRequest = z
  .object({ ownerDeviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Component_DeleteComponentsByOwnerDeviceWSResponse = z.object({}).partial().passthrough();
const Component_FindAccessControlledDoorsWSRequest = z.object({}).partial().passthrough();
const Component_FindAccessControlledDoorsWSResponse = z
  .object({ accessControlledDoors: z.array(AccessControlledDoorType).nullable() })
  .partial()
  .passthrough();
const Component_FindAccessControlledDoorsByLocationWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Component_FindAccessControlledDoorsByLocationWSResponse = z
  .object({ accessControlledDoors: z.array(AccessControlledDoorType).nullable() })
  .partial()
  .passthrough();
const Component_FindAccessControlledDoorsByOwnerDeviceWSRequest = z
  .object({ ownerDeviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Component_FindAccessControlledDoorsByOwnerDeviceWSResponse = z
  .object({ accessControlledDoors: z.array(AccessControlledDoorType).nullable() })
  .partial()
  .passthrough();
const Component_FindAllComponentShadowsWSRequest = z
  .object({ componentUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const ComponentShadowEnumType = z.enum([
  "DoorReaderShadow",
  "DoorRelayShadow",
  "DoorPositionIndicatorShadow",
  "RequestToExitShadow",
  "GenericRelayShadow",
  "GenericInputShadow",
]);
const ComponentShadowType = z
  .object({
    componentUuid: z.string().nullable(),
    createdAtMillis: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    type: ComponentShadowEnumType,
    updatedAtMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindAllComponentShadowsWSResponse = z
  .object({ acuComponentShadowMap: z.record(ComponentShadowType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByAccessControlledDoorWSRequest = z
  .object({
    accessControlledDoorUuid: z.string().nullable(),
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const ComponentEventEnumType = z.enum([
  "DoorbellEvent",
  "DoorReaderStateChangeEvent",
  "DoorRelayStateChangeEvent",
  "DoorPositionIndicatorStateChangeEvent",
  "RequestToExitStateChangeEvent",
  "CredentialReceivedEvent",
  "ButtonEvent",
  "GenericInputStateChangeEvent",
  "GenericRelayStateChangeEvent",
  "AccessControlUnitTamperEvent",
  "AccessControlUnitLocationLockdownStateEvent",
  "DoorLocationLockdownStateEvent",
]);
const ComponentEventType = z
  .object({
    componentUuid: z.string().nullable(),
    correlationId: z.string().nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
    type: ComponentEventEnumType,
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByAccessControlledDoorWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByApiTokenWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    tokenUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByApiTokenWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByComponentWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByComponentWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByCorrelationWSRequest = z
  .object({
    correlationId: z.string().nullable(),
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByCorrelationWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByCredentialHexValueWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    credentialHexValue: z.string().nullable(),
    limit: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByCredentialHexValueWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByCredentialUuidWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    credentialUuid: z.string().nullable(),
    limit: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByCredentialUuidWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByCredentialValueWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    credentialValue: z.string().nullable(),
    limit: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByCredentialValueWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByLocationWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByLocationWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByOwnerDeviceWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    ownerDeviceUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByOwnerDeviceWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsBySupportAuthorityWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    supportAuthorityUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsBySupportAuthorityWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsByUserWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsByUserWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentEventsForCurrentUserWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentEventsForCurrentUserWSResponse = z
  .object({ componentEvents: z.array(ComponentEventType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByAccessControlledDoorWSRequest = z
  .object({
    accessControlledDoorUuid: z.string().nullable(),
    durationSec: z.number().int().nullable(),
    startTimeSecEpochExclusive: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const ComponentSeekPointType = z
  .object({
    activity: ActivityEnum,
    componentCompositeUuid: z.string().nullable(),
    componentUuid: z.string().nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    originalEvent: z.object({}).partial().passthrough().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
    userUuid: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByAccessControlledDoorWSResponse = z
  .object({ seekpoints: z.array(ComponentSeekPointType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByComponentWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    durationSec: z.number().int().nullable(),
    startTimeSecEpochExclusive: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByComponentWSResponse = z
  .object({ seekpoints: z.array(ComponentSeekPointType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByLocationWSRequest = z
  .object({
    durationSec: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
    startTimeSecEpochExclusive: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByLocationWSResponse = z
  .object({ seekpoints: z.array(ComponentSeekPointType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByOwnerDeviceWSRequest = z
  .object({
    durationSec: z.number().int().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    startTimeSecEpochExclusive: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByOwnerDeviceWSResponse = z
  .object({ seekpoints: z.array(ComponentSeekPointType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByUserWSRequest = z
  .object({
    durationSec: z.number().int().nullable(),
    startTimeSecEpochExclusive: z.number().int().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentSeekPointsByUserWSResponse = z
  .object({ seekpoints: z.array(ComponentSeekPointType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentShadowsByOwnerDeviceWSRequest = z
  .object({ ownerDeviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Component_FindComponentShadowsByOwnerDeviceWSResponse = z
  .object({ componentShadows: z.array(ComponentShadowType).nullable() })
  .partial()
  .passthrough();
const Component_FindComponentsByOwnerDeviceWSRequest = z
  .object({ ownerDeviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const BaseComponentType = z
  .object({
    baseType: ComponentBaseEnumType,
    createdAtMillis: z.number().int().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    portImmutable: z.boolean().nullable(),
    type: ComponentEnumType,
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Component_FindComponentsByOwnerDeviceWSResponse = z
  .object({ components: z.array(BaseComponentType).nullable() })
  .partial()
  .passthrough();
const Component_GetAccessControlledDoorLabelsForOrgWSRequest = z.object({}).partial().passthrough();
const Component_GetAccessControlledDoorLabelsForOrgWSResponse = z
  .object({
    accessControlledDoorLabels: z.record(z.array(z.string().nullable()).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Component_GetOrCreateDevicePhysicalPortConfigWSRequest = z
  .object({ ownerDeviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const InvalidPhysicalPortConfigType = z
  .object({
    boardNum: z.number().int().nullable(),
    componentUuids: z.array(z.string().nullable()).nullable(),
    portNum: z.number().int().nullable(),
    reason: z
      .enum([
        "NON_EXISTANT_COMPONENT_BOARD_NUM",
        "NON_EXISTANT_COMPONENT_PORT_NUM",
        "CONFLICTING_COMPONENT_PORT_TYPES",
        "COMPONENT_PORT_TYPE_NOT_SUPPORTED_BY_PORT",
        "MAX_COMPONENTS_PER_PORT_TYPE_EXCEEDED",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const PhysicalPortType = z
  .object({
    boardNum: z.number().int().nullable(),
    componentPortTypeUsageMap: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    label: z.string().nullable(),
    portNum: z.number().int().nullable(),
    supportedPortTypes: z
      .array(
        z
          .enum([
            "GPIO_OUTPUT",
            "GPIO_INPUT",
            "GPIO_INPUT_SUPERVISED",
            "RS485",
            "WIEGAND_INPUT",
            "WIEGAND_OUTPUT",
            "BUTTON_INPUT",
          ])
          .nullable()
      )
      .nullable(),
  })
  .partial()
  .passthrough();
const BoardPhysicalPortConfigType = z
  .object({
    boardNum: z.number().int().nullable(),
    ownerHardwareType: HardwareVariationEnum,
    portMap: z.record(PhysicalPortType).nullable(),
  })
  .partial()
  .passthrough();
const DevicePhysicalPortConfigType = z
  .object({
    boardMap: z.record(BoardPhysicalPortConfigType).nullable(),
    createdAtMillis: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    updatedAtMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_GetOrCreateDevicePhysicalPortConfigWSResponse = z
  .object({
    detectedInvalidPortConfigs: z.array(InvalidPhysicalPortConfigType).nullable(),
    deviceComponents: z.array(BaseComponentType).nullable(),
    devicePhysicalPortConfig: DevicePhysicalPortConfigType,
  })
  .partial()
  .passthrough();
const Component_RemoveAccessControlledDoorLabelWSRequest = z
  .object({ accessControlledDoorUuid: z.string().nullable(), label: z.string().nullable() })
  .partial()
  .passthrough();
const Component_RemoveAccessControlledDoorLabelWSResponse = z.object({}).partial().passthrough();
const Component_UpdateAccessControlledDoorWSRequest = z
  .object({
    accessControlledDoorUuid: z.string().nullable(),
    ajarTimeSec: z.number().int().nullable(),
    associatedCameras: z.array(z.string().nullable()).nullable(),
    defaultState: AccessControlledDoorStateEnumType,
    directionRadians: z.number().nullable(),
    doorStateToScheduleUuidMap: z.record(z.string().nullable()).nullable(),
    dpiComponents: z.array(ComponentReferenceType).nullable(),
    floorNumber: z.number().int().nullable(),
    forcedOpenTimeSec: z.number().int().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    policyUuid: z.string().nullable(),
    readerComponents: z.array(ComponentReferenceType).nullable(),
    relayComponents: z.array(ComponentReferenceType).nullable(),
    relockAfterOpenTimeMs: z.number().int().nullable(),
    remoteUnlockEnabled: z.boolean().nullable(),
    rexComponents: z.array(ComponentReferenceType).nullable(),
    unlockTimeSec: z.number().int().nullable(),
    unlockTimeSecRex: z.number().int().nullable(),
    waveToUnlockSettings: WaveToUnlockSettingsType,
  })
  .partial()
  .passthrough();
const Component_UpdateAccessControlledDoorWSResponse = z
  .object({ accessControlledDoor: AccessControlledDoorType })
  .partial()
  .passthrough();
const Component_UpdateIntegratedDoorPositionIndicatorWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    name: z.string().nullable(),
    normalState: z.enum(["NO", "NC"]).nullable(),
    port: DoorPositionIndicatorPortType,
  })
  .partial()
  .passthrough();
const Component_UpdateIntegratedDoorPositionIndicatorWSResponse = z
  .object({ component: IntegratedDoorPositionIndicatorType })
  .partial()
  .passthrough();
const Component_UpdateIntegratedDoorRelayWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    name: z.string().nullable(),
    port: DoorRelayPortType,
  })
  .partial()
  .passthrough();
const Component_UpdateIntegratedDoorRelayWSResponse = z
  .object({ component: IntegratedDoorRelayType })
  .partial()
  .passthrough();
const Component_UpdateIntegratedGenericButtonWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    mode: ButtonModeEnum,
    name: z.string().nullable(),
    port: ButtonPortType,
  })
  .partial()
  .passthrough();
const Component_UpdateIntegratedGenericButtonWSResponse = z
  .object({ component: IntegratedGenericButtonType })
  .partial()
  .passthrough();
const Component_UpdateIntegratedGenericInputWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    name: z.string().nullable(),
    normalState: z.enum(["NO", "NC"]).nullable(),
    port: AuxiliaryInputPortType,
  })
  .partial()
  .passthrough();
const Component_UpdateIntegratedGenericInputWSResponse = z
  .object({ component: IntegratedGenericInputType })
  .partial()
  .passthrough();
const Component_UpdateIntegratedGenericRelayWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    name: z.string().nullable(),
    port: AuxiliaryRelayPortType,
    relayDurationSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Component_UpdateIntegratedGenericRelayWSResponse = z
  .object({ component: IntegratedGenericRelayType })
  .partial()
  .passthrough();
const Component_UpdateIntegratedRequestToExitWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    name: z.string().nullable(),
    normalState: z.enum(["NO", "NC"]).nullable(),
    port: RequestToExitPortType,
  })
  .partial()
  .passthrough();
const Component_UpdateIntegratedRequestToExitWSResponse = z
  .object({ component: IntegratedRequestToExitType })
  .partial()
  .passthrough();
const Component_UpdateOsdpReaderWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    name: z.string().nullable(),
    port: OsdpReaderPortType,
  })
  .partial()
  .passthrough();
const Component_UpdateOsdpReaderWSResponse = z
  .object({ component: OsdpDoorReaderType })
  .partial()
  .passthrough();
const Component_UpdateRhombusOsdpReaderWSRequest = z
  .object({
    componentUuid: z.string().nullable(),
    name: z.string().nullable(),
    port: OsdpReaderPortType,
  })
  .partial()
  .passthrough();
const Component_UpdateRhombusOsdpReaderWSResponse = z
  .object({ component: RhombusOsdpDoorReaderType })
  .partial()
  .passthrough();
const Component_UpdateWiegandReaderWSRequest = z
  .object({
    buzzerPort: WiegandOutputPortType,
    componentUuid: z.string().nullable(),
    d0Port: WiegandDataPortType,
    d1Port: WiegandDataPortType,
    gledPort: WiegandOutputPortType,
    name: z.string().nullable(),
    rledPort: WiegandOutputPortType,
    tamperPort: WiegandInputPortType,
  })
  .partial()
  .passthrough();
const Component_UpdateWiegandReaderWSResponse = z
  .object({ component: WiegandDoorReaderType })
  .partial()
  .passthrough();
const Customer_AcceptUsagePolicyRequest = z.object({}).partial().passthrough();
const Customer_AcceptUsagePolicyResponse = z.object({}).partial().passthrough();
const Customer_DeleteNotificationSnoozeSettingWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_DeleteNotificationSnoozeSettingWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_GetCurrentPartnerUserWSRequest = z.object({}).partial().passthrough();
const NotificationEnumType = z.enum([
  "SMS",
  "EMAIL",
  "APP",
  "SLACK",
  "MICROSOFT_TEAMS",
  "BROWSER",
  "UNKNOWN",
]);
const NotificationIntervalV2Type = z
  .object({
    activityTriggerMap: z.record(z.array(NotificationEnumType).nullable()).nullable(),
    deviceFilterSet: z.array(z.string().nullable()).nullable(),
    diagnosticTriggerMap: z.record(z.array(NotificationEnumType).nullable()).nullable(),
    locationFilterSet: z.array(z.string().nullable()).nullable(),
    minuteOfWeekStart: z.number().int().nullable(),
    minuteOfWeekStop: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const PartnerNotificationSettingsType = z
  .object({
    allClientsSelected: z.boolean().nullable(),
    clientNotificationIntervalsMap: z
      .record(z.array(NotificationIntervalV2Type).nullable())
      .nullable(),
    notificationIntervalsForAllClients: z.array(NotificationIntervalV2Type).nullable(),
    orgUuid: z.string().nullable(),
    smsPhoneNumbers: z.array(z.string().nullable()).nullable(),
    summaryEmailEnabled: z.boolean().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const User_WrappedRhombusOrgUserType = z
  .object({
    accessibleRhombusApps: z
      .array(z.enum(["PARTNER", "CONSOLE", "RHOMBUS_KEY", "UNKNOWN"]).nullable())
      .nullable(),
    accountOwner: z.boolean().nullable(),
    bypassSaml: z.boolean().nullable(),
    changePasswordOnLogin: z.boolean().nullable(),
    createdAtMillis: z.number().int().nullable(),
    deleted: z.boolean().nullable(),
    email: z.string().nullable(),
    emailCaseSensitive: z.string().nullable(),
    emailVerified: z.boolean().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    mfaEnabled: z.boolean().nullable(),
    mfaTokenType: z.enum(["EMAIL", "SMS", "VIRTUAL_MFA"]).nullable(),
    name: z.string().nullable(),
    orgUserCustomizationFlags: z.record(z.string().nullable()).nullable(),
    orgUuid: z.string().nullable(),
    passwordSet: z.boolean().nullable(),
    rhombusUserUuid: z.string().nullable(),
    status: z.enum(["JOINED", "PENDING", "INACTIVE", "UNKNOWN"]).nullable(),
    updatedAtMillis: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Customer_GetCurrentPartnerUserWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    flags: z.record(z.string().nullable()).nullable(),
    notificationSettings: PartnerNotificationSettingsType,
    permissionGroupUuid: z.string().nullable(),
    user: User_WrappedRhombusOrgUserType,
  })
  .partial()
  .passthrough();
const Customer_GetCurrentRhombusKeyUserWSRequest = z.object({}).partial().passthrough();
const User_RhombusKeyOrgDetailsType = z
  .object({
    companyLogoUrl: z.string().nullable(),
    name: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const RhombusKeyAppPreferencesType = z
  .object({ favoriteAccessControlledDoorUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
// Removed problematic schemas
const EpochSecondsProvisioner = z
  .object({ value: z.number().int().nullable() })
  .partial()
  .passthrough();
const StaticEpochSecondsProvisioner = EpochSecondsProvisioner;
const RhombusSecureMobileCredentialProvisioningRulesType = z
  .object({
    endDateProvisioner: EpochSecondsProvisioner,
    maxMobileCredsAllowed: z.number().int().nullable(),
    startDateProvisioner: EpochSecondsProvisioner,
  })
  .partial()
  .passthrough();
const RhombusKeyAppSettingsType = z
  .object({
    bypassSaml: z.boolean().nullable(),
    credentialProvisioningRules: RhombusSecureMobileCredentialProvisioningRulesType,
    remoteUnlockEnabled: z.boolean().nullable(),
    rhombusKeyAccessEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const RhombusKeyAppConfigType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    preferences: RhombusKeyAppPreferencesType,
    rhombusOrgUserUuid: z.string().nullable(),
    settings: RhombusKeyAppSettingsType,
    updatedAtMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Customer_GetCurrentRhombusKeyUserWSResponse = z
  .object({
    orgDetails: User_RhombusKeyOrgDetailsType,
    rhombusKeyConfig: RhombusKeyAppConfigType,
    user: User_WrappedRhombusOrgUserType,
  })
  .partial()
  .passthrough();
const Customer_GetCurrentUserWSRequest = z.object({}).partial().passthrough();
const DashboardCustomizations = z
  .object({
    fullCamera: z.string().nullable(),
    halfCamera: z.string().nullable(),
    layout: z.string().nullable(),
    rememberedLocation: z.string().nullable(),
    report: z.string().nullable(),
    videoWall: z.string().nullable(),
  })
  .partial()
  .passthrough();
const UserCustomizationsType = z
  .object({
    dashboard: DashboardCustomizations,
    frontend: z.record(z.string().nullable()).nullable(),
    orgUuid: z.string().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const UserNotificationSettingsV3Type = z
  .object({
    notificationIntervalsV2: z.array(NotificationIntervalV2Type).nullable(),
    orgUuid: z.string().nullable(),
    smsPhoneNumbers: z.array(z.string().nullable()).nullable(),
    summaryEmailEnabled: z.boolean().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Customer_GetCurrentUserWSResponse = z
  .object({
    customizations: UserCustomizationsType,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    flags: z.record(z.string().nullable()).nullable(),
    notificationSettings: UserNotificationSettingsV3Type,
    permissionGroupUuid: z.string().nullable(),
    user: User_WrappedRhombusOrgUserType,
  })
  .partial()
  .passthrough();
const Customer_GetCurrentUserConsoleOrgsForContextSwitchWSRequest = z
  .object({})
  .partial()
  .passthrough();
const Customer_SelectableOrgForContextSwitch = z
  .object({
    companyThumbnailLogoUrl: z.string().nullable(),
    orgName: z.string().nullable(),
    orgUuid: z.string().nullable(),
    userName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Customer_GetCurrentUserConsoleOrgsForContextSwitchWSResponse = z
  .object({ orgs: z.array(Customer_SelectableOrgForContextSwitch).nullable() })
  .partial()
  .passthrough();
const Customer_GetCurrentUserRhombusKeyOrgsForContextSwitchWSRequest = z
  .object({})
  .partial()
  .passthrough();
const Customer_GetCurrentUserRhombusKeyOrgsForContextSwitchWSResponse = z
  .object({ orgs: z.array(Customer_SelectableOrgForContextSwitch).nullable() })
  .partial()
  .passthrough();
const Customer_GetCurrentUserSessionsWSRequest = z.object({}).partial().passthrough();
const SessionClientInfoType = z
  .object({
    appName: z.string().nullable(),
    appOs: z.string().nullable(),
    appVersion: z.string().nullable(),
    userAgent: z.string().nullable(),
  })
  .partial()
  .passthrough();
const GeoIpLocationType = z
  .object({
    city_name: z.string().nullable(),
    country_code: z.string().nullable(),
    country_name: z.string().nullable(),
    region_name: z.string().nullable(),
  })
  .partial()
  .passthrough();
const SessionInfoWSType = z
  .object({
    clientInfo: SessionClientInfoType,
    clientType: z.enum(["MOBILE", "IOS", "ANDROID", "BROWSER"]).nullable(),
    currentSession: z.boolean().nullable(),
    lastActivityTimeMs: z.number().int().nullable(),
    lastIpAccessedFrom: z.string().nullable(),
    lastIpAccessedFromGeoLocation: GeoIpLocationType,
  })
  .partial()
  .passthrough();
const Customer_GetCurrentUserSessionsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sessions: z.array(SessionInfoWSType).nullable(),
  })
  .partial()
  .passthrough();
const Customer_GetDashboardstatusWSRequest = z.object({}).partial().passthrough();
const DashboardStatus = z
  .object({
    camerasDown: z.number().int().nullable(),
    camerasDownByLocation: z.record(z.number().int().nullable()).nullable(),
    camerasUp: z.number().int().nullable(),
    healthStatusIndicator: z.enum(["GREEN", "YELLOW", "RED"]).nullable(),
    healthStatusMsg: z.string().nullable(),
    locationCameraStatus: z.record(z.record(z.boolean().nullable()).nullable()).nullable(),
    totalCameras: z.number().int().nullable(),
    totalClimateSensors: z.number().int().nullable(),
    totalDoorSensors: z.number().int().nullable(),
    totalLocations: z.number().int().nullable(),
    totalProximitySensors: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Customer_GetDashboardStatusWSResponse = z
  .object({
    dashboardStatus: DashboardStatus,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Customer_GetRhombusKeyConfigForCurrentUserWSRequest = z.object({}).partial().passthrough();
const Customer_GetRhombusKeyConfigForCurrentUserWSResponse = z
  .object({ userRhombusKeyConfig: RhombusKeyAppConfigType })
  .partial()
  .passthrough();
const Customer_GetUserSnoozedNotificationSettingsWSRequest = z.object({}).partial().passthrough();
const ScheduledIntervalType = z
  .object({
    durationSecs: z.number().int().nullable(),
    timestampSec: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Customer_GetUserSnoozedNotificationSettingsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    snoozedForAllNotificationsIntervals: z.array(ScheduledIntervalType).nullable(),
    snoozedForDevicesMap: z.record(z.array(ScheduledIntervalType).nullable()).nullable(),
    snoozedForLocationsMap: z.record(z.array(ScheduledIntervalType).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Customer_LogoutAllOtherCurrentUserSessionsRequest = z.object({}).partial().passthrough();
const Customer_LogoutAllOtherCurrentUserSessionsResponse = z.object({}).partial().passthrough();
const Customer_SetFlagWSRequest = z
  .object({ flagName: z.string().nullable(), flagValue: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_SetFlagWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_SnoozeAllNotificationsWSRequest = z
  .object({
    durationSec: z.number().int().nullable(),
    scheduledTimestampSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Customer_SnoozeAllNotificationsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_SnoozeNotificationsWSRequest = z
  .object({
    deviceUuids: z.array(z.string().nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    locationUuids: z.array(z.string().nullable()).nullable(),
    scheduledTimestampSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Customer_SnoozeNotificationsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_UpdateCurrentPartnerWSRequest = z
  .object({
    bypassSaml: z.boolean().nullable(),
    mfaEnabled: z.boolean().nullable(),
    name: z.string().nullable(),
    notificationSettings: PartnerNotificationSettingsType,
    permissionGroupUuid: z.string().nullable(),
    smsPhoneNumbers: z.array(z.string().nullable()).nullable(),
    summaryEmailEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Customer_UpdateCurrentPartnerWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_UpdateCurrentUserWSRequest = z
  .object({
    dashboardCustomizations: DashboardCustomizations,
    mfaEnabled: z.boolean().nullable(),
    name: z.string().nullable(),
    notificationIntervalsV2: z.array(NotificationIntervalV2Type).nullable(),
    smsPhoneNumbers: z.array(z.string().nullable()).nullable(),
    summaryEmailEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Customer_UpdateCurrentUserWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_UpdateDashboardCustomizationsWSRequest = z
  .object({
    fullCamera: z.string().nullable(),
    fullCameraUpdated: z.boolean().nullable(),
    halfCamera: z.string().nullable(),
    halfCameraUpdated: z.boolean().nullable(),
    layout: z.string().nullable(),
    layoutUpdated: z.boolean().nullable(),
    rememberedLocation: z.string().nullable(),
    rememberedLocationUpdated: z.boolean().nullable(),
    report: z.string().nullable(),
    reportUpdated: z.boolean().nullable(),
    videoWall: z.string().nullable(),
    videoWallUpdated: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Customer_UpdateDashboardCustomizationsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_UpdateFrontendCustomizationsWSRequest = z
  .object({ customizations: z.record(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Customer_UpdateFrontendCustomizationsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Customer_UpdateRhombusKeyPreferencesForCurrentUserWSRequest = z
  .object({
    favoriteAccessControlledDoorUuids: z.array(z.string().nullable()).nullable(),
    favoriteAccessControlledDoorUuidsUpdated: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Customer_UpdateRhombusKeyPreferencesForCurrentUserWSResponse = z
  .object({ userRhombusKeyConfig: RhombusKeyAppConfigType })
  .partial()
  .passthrough();
const EventListenerType = z
  .object({
    activities: z.array(ActivityEnum).nullable(),
    clientCertificate: z.array(z.string().nullable()).nullable(),
    clientKey: z.array(z.string().nullable()).nullable(),
    deviceUuid: z.string().nullable(),
    hostname: z.string().nullable(),
    orgUuid: z.string().nullable(),
    trustedCertificate: z.array(z.string().nullable()).nullable(),
    uri: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Developer_CreateEventListenerWSRequest = z
  .object({ eventListner: EventListenerType })
  .partial()
  .passthrough();
const Developer_CreateEventListenerWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    eventListenerUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Developer_DeleteEventListenerWSRequest = z
  .object({ eventListenerUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Developer_DeleteEventListenerWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Developer_GetAllEventListenersWSRequest = z.object({}).partial().passthrough();
const Developer_GetAllEventListenersWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    eventListeners: z.array(EventListenerType).nullable(),
  })
  .partial()
  .passthrough();
const Developer_GetEventListenersForDeviceWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Developer_GetEventListenersForDeviceWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    eventListeners: z.array(EventListenerType).nullable(),
  })
  .partial()
  .passthrough();
const Door_GetDoorEventsForSensorWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    sensorUuid: z.string().nullable(),
    stateFilter: z.enum(["OPEN", "CLOSED", "AJAR"]).nullable(),
  })
  .partial()
  .passthrough();
const DoorEventType = z
  .object({
    baseStationUuid: z.string().nullable(),
    batteryPercentage: z.number().int().nullable(),
    bleDeviceUuid: z.string().nullable(),
    bleRssi: z.number().int().nullable(),
    closeBaseStations: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    state: z.enum(["OPEN", "CLOSED", "AJAR"]).nullable(),
    stateChanged: z.boolean().nullable(),
    timestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Door_GetDoorEventsForSensorWSResponse = z
  .object({
    doorEvents: z.array(DoorEventType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Door_GetMinimalDoorStatesWSRequest = z.object({}).partial().passthrough();
const Door_MinimalDoorStateType = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    batteryPercent: z.number().int().nullable(),
    createdAtMillis: z.number().int().nullable(),
    firmwareVersion: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    health: z.enum(["GREEN", "RED"]).nullable(),
    healthDetails: z.enum(["FIRMWARE_BEHIND", "NO_HEARTBEAT", "NONE"]).nullable(),
    hwVariation: HardwareVariationEnum,
    lastSeenSec: z.number().int().nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    policyUuid: z.string().nullable(),
    sensorUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    signalStrength: z.number().int().nullable(),
    status: z.enum(["OPEN", "CLOSED", "AJAR"]).nullable(),
  })
  .partial()
  .passthrough();
const Door_GetMinimalDoorStatesWSResponse = z
  .object({
    doorStates: z.array(Door_MinimalDoorStateType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Door_UpdateDoorSensorDetailsWSRequest = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    associatedCamerasUpdated: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    deletedUpdated: z.boolean().nullable(),
    description: z.string().nullable(),
    descriptionUpdated: z.boolean().nullable(),
    floorNumber: z.number().int().nullable(),
    floorNumberUpdated: z.boolean().nullable(),
    latitude: z.number().nullable(),
    latitudeUpdated: z.boolean().nullable(),
    locationUuid: z.string().nullable(),
    locationUuidUpdated: z.boolean().nullable(),
    longitude: z.number().nullable(),
    longitudeUpdated: z.boolean().nullable(),
    name: z.string().nullable(),
    nameUpdated: z.boolean().nullable(),
    policyUuid: z.string().nullable(),
    policyUuidUpdated: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Door_UpdateDoorSensorDetailsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Doorbellcamera_ExternalDoorbellCameraComponentRuleType = z
  .object({
    action: RuleActionType,
    doorbellCameraComponentUuid: z.string().nullable(),
    doorbellCameraUuid: z.string().nullable(),
    ruleFilters: RuleFilterType,
    ruleName: z.string().nullable(),
    ruleUuid: z.string().nullable(),
    triggerActivity: ActivityEnum,
  })
  .partial()
  .passthrough();
const Doorbellcamera_CreateRuleForDoorbellCameraWSRequest = z
  .object({ rule: Doorbellcamera_ExternalDoorbellCameraComponentRuleType })
  .partial()
  .passthrough();
const Doorbellcamera_CreateRuleForDoorbellCameraWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    ruleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Doorbellcamera_DeleteDoorbellCameraWSRequest = z
  .object({ doorbellCameraUuid: z.string().nullable(), mummify: z.boolean().nullable() })
  .passthrough();
const Doorbellcamera_DeleteDoorbellCameraWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    responseStatus: z
      .enum([
        "BASIC_AUTH_FAILED",
        "PASSWORD_MISMATCH",
        "SAME_PASSWORD",
        "USER_EXISTS",
        "USER_NOT_FOUND",
        "DEVICE_NOT_FOUND",
        "POLICY_NOT_FOUND",
        "LOCATION_NOT_FOUND",
        "ORG_NOT_FOUND",
        "BAD_INPUT",
        "SUCCESS",
        "PASSWORD_TOO_SHORT",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const Doorbellcamera_DeleteRuleForDoorbellCameraWSRequest = z
  .object({ doorbellCameraUuid: z.string().nullable(), ruleUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Doorbellcamera_DeleteRuleForDoorbellCameraWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Common_devices_GetBoundingBoxesWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    durationSecs: z.number().int().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetBoundingBoxesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    footageBoundingBoxes: z.array(FootageBoundingBoxType).nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetConfigWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Deviceconfig_IExternalReadableAudioVideoSettings = z
  .object({
    ai_dewarp_config: CameraAiDewarpConfigType,
    audio_analysis_enabled: z.boolean().nullable(),
    audio_external_mic_boost: z.number().int().nullable(),
    audio_external_mic_volume: z.number().int().nullable(),
    audio_external_speaker_volume: z.number().int().nullable(),
    audio_internal_mic_aec_enabled: z.boolean().nullable(),
    audio_internal_mic_boost: z.number().int().nullable(),
    audio_internal_mic_volume: z.number().int().nullable(),
    audio_internal_speaker_volume: z.number().int().nullable(),
    audio_record: z.boolean().nullable(),
    audio_use_external_mic: z.boolean().nullable(),
    audio_use_external_speaker: z.boolean().nullable(),
    audio_use_internal_speaker: z.boolean().nullable(),
    bandwidth_reports_disabled: z.boolean().nullable(),
    behavior_detection: z.boolean().nullable(),
    blocked_debounce_time_ms: z.number().int().nullable(),
    blocked_threshold: z.number().nullable(),
    cloud_archive_days: z.number().int().nullable(),
    cloud_archive_upload_schedule: z.array(WeeklyMinuteIntervalType).nullable(),
    cloud_archive_upload_schedule_inverted: z.boolean().nullable(),
    cloud_archive_upload_schedule_uuid: z.string().nullable(),
    color_detection: z.boolean().nullable(),
    con_human_filter: z.number().int().nullable(),
    con_vehicle_filter: z.number().int().nullable(),
    cross_counting: z.boolean().nullable(),
    cross_counting_settings: CameraCrossCountingSettingsType,
    deviceUuid: z.string().nullable(),
    device_mic_enabled: z.boolean().nullable(),
    device_speaker_enabled: z.boolean().nullable(),
    dewarpMode: z
      .enum([
        "NO_TRANSFORM",
        "NORMAL",
        "PANORAMA",
        "SUB_REGION",
        "VERTICAL_PANORAMA",
        "TRANSVERSE_MERCATOR",
        "MERCATOR",
        "EQUIRECTANGULAR",
      ])
      .nullable(),
    engagement_counting: z.boolean().nullable(),
    event_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
    exposure_level: z.number().int().nullable(),
    face_ai_threshold: z.number().nullable(),
    face_counting: z.boolean().nullable(),
    face_counting_nonunique: z.boolean().nullable(),
    face_id_ai_threshold: z.number().nullable(),
    face_match_threshold: z.number().nullable(),
    face_recognition: z.boolean().nullable(),
    fisheye_display_mode: z.enum(["RAW", "IMMERSIVE", "TILES", "RAW_PANO"]).nullable(),
    hdr_enabled: z.boolean().nullable(),
    img_brightness: z.number().int().nullable(),
    img_contrast: z.number().int().nullable(),
    img_saturation: z.number().int().nullable(),
    img_sharpness: z.number().int().nullable(),
    ir_filter_mode: z.enum(["ON", "OFF", "AUTO"]).nullable(),
    ir_leds_mode: z.enum(["ON", "OFF", "AUTO"]).nullable(),
    lastModified: z.number().int().nullable(),
    led_stealth_mode: z.boolean().nullable(),
    licenseplate_detection: z.boolean().nullable(),
    lpr_ai_threshold: z.number().nullable(),
    max_event_duration_ms: z.number().int().nullable(),
    media_ttl_minutes: z.number().int().nullable(),
    metering_config: CameraMeteringConfigType,
    motion_grid_disabled: z.boolean().nullable(),
    motion_grid_window_sec: z.number().int().nullable(),
    motion_lightweight_disabled: z.boolean().nullable(),
    motion_threshold: z.number().nullable(),
    motor_config: CameraMotorConfigType,
    mounting_direction: z.enum(["DOWN", "UP", "SIDEWAYS", "UNKNOWN"]).nullable(),
    new_motion_feature_flag: z.boolean().nullable(),
    night_exposure_level: z.number().int().nullable(),
    night_img_brightness: z.number().int().nullable(),
    night_img_contrast: z.number().int().nullable(),
    night_img_saturation: z.number().int().nullable(),
    night_img_sharpness: z.number().int().nullable(),
    night_metering_config: CameraMeteringConfigType,
    night_sensor_gain_max: z.number().int().nullable(),
    night_shutter_time_max: z.number().int().nullable(),
    night_shutter_time_min: z.number().int().nullable(),
    obj_ai_threshold: z.number().nullable(),
    orgUuid: z.string().nullable(),
    people_counting: z.boolean().nullable(),
    person_ai_threshold: z.number().nullable(),
    pose_detection: z.boolean().nullable(),
    ppe_detection: z.boolean().nullable(),
    privacy_windows: z.array(PermyriadRect).nullable(),
    ptz_config: CameraPTZConfigType,
    region_of_interest: RegionConfigType,
    resolution: Deviceconfig_ExternalVideoResolution,
    rotation: z.number().int().nullable(),
    segment_max_bytes: z.number().int().nullable(),
    sensor_gain_max: z.number().int().nullable(),
    shutter_time_max: z.number().int().nullable(),
    shutter_time_min: z.number().int().nullable(),
    snapshot_height: z.number().int().nullable(),
    snapshot_interval_secs: z.number().int().nullable(),
    splice_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
    target_ai_fps: z.number().int().nullable(),
    thumbstrip_disabled: z.boolean().nullable(),
    tile_views: z.array(DewarpedView).nullable(),
    timelapse: z.boolean().nullable(),
    use_onboard_ai: z.boolean().nullable(),
    use_pilot_face_id: z.boolean().nullable(),
    vehicle_ai_threshold: z.number().nullable(),
    vehicle_counting: z.boolean().nullable(),
    video_persist_disabled: z.boolean().nullable(),
    visual_tamper_config: CameraVisualTamperConfigType,
    wdr_strength: z.number().int().nullable(),
    zero_motion_video_quality: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Doorbellcamera_GetDoorbellCameraConfigWSResponse = z
  .object({
    config: Deviceconfig_IExternalReadableAudioVideoSettings,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Doorbellcamera_GetDoorbellCameraRulesForOrgWSRequest = z.object({}).partial().passthrough();
const Doorbellcamera_GetDoorbellCameraRulesForOrgWSResponse = z
  .object({
    doorbellCameraUuidToRulesMap: z
      .record(z.array(Doorbellcamera_ExternalDoorbellCameraComponentRuleType).nullable())
      .nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetFullDeviceStateWSRequest = z
  .object({ deviceUuid: z.string().nullable(), force: z.boolean().nullable() })
  .partial()
  .passthrough();
const Doorbellcamera_GetDoorbellCameraFullStateWSResponse = z
  .object({ fullState: FullDeviceStateType })
  .partial()
  .passthrough();
const Common_devices_GetMediaUrisWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Doorbellcamera_GetDoorbellCameraMediaUrisWSResponse = z
  .object({
    lanCheckUrls: z.array(z.string().nullable()).nullable(),
    lanLiveH264Uris: z.array(z.string().nullable()).nullable(),
    lanLiveMpdUris: z.array(z.string().nullable()).nullable(),
    lanLiveOpusUris: z.array(z.string().nullable()).nullable(),
    lanVodM3u8UrisTemplates: z.array(z.string().nullable()).nullable(),
    lanVodMpdUrisTemplates: z.array(z.string().nullable()).nullable(),
    wanLiveH264Uri: z.string().nullable(),
    wanLiveMpdUri: z.string().nullable(),
    wanLiveOpusUri: z.string().nullable(),
    wanVodM3u8UriTemplate: z.string().nullable(),
    wanVodMpdUriTemplate: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetMinimalDeviceStateListWSRequest = z
  .object({ includeMummified: z.boolean().nullable() })
  .partial()
  .passthrough();
const Doorbellcamera_GetDoorbellCameraMinimalStateListWSResponse = z
  .object({ minimalStates: z.array(MinimalDeviceStateType).nullable() })
  .partial()
  .passthrough();
const Doorbellcamera_GetRulesForDoorbellCameraWSRequest = z
  .object({ doorbellCameraUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Doorbellcamera_GetRulesForDoorbellCameraWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    rules: z.array(Doorbellcamera_ExternalDoorbellCameraComponentRuleType).nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetSeekpointsWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    durationSecs: z.number().int().nullable(),
    includeAnyMotion: z.boolean().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Common_devices_GetSeekpointsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    footageSeekPoints: z.array(FootageSeekPointV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Deviceconfig_IExternalUpdateableAudioVideoSettings = z
  .object({
    audio_external_mic_boost: z.number().int().nullable(),
    audio_external_mic_volume: z.number().int().nullable(),
    audio_external_speaker_volume: z.number().int().nullable(),
    audio_internal_mic_aec_enabled: z.boolean().nullable(),
    audio_internal_mic_boost: z.number().int().nullable(),
    audio_internal_mic_volume: z.number().int().nullable(),
    audio_internal_speaker_volume: z.number().int().nullable(),
    audio_record: z.boolean().nullable(),
    audio_use_external_mic: z.boolean().nullable(),
    audio_use_external_speaker: z.boolean().nullable(),
    audio_use_internal_speaker: z.boolean().nullable(),
    bandwidth_reports_disabled: z.boolean().nullable(),
    blocked_debounce_time_ms: z.number().int().nullable(),
    blocked_threshold: z.number().nullable(),
    deviceUuid: z.string().nullable(),
    device_mic_enabled: z.boolean().nullable(),
    device_speaker_enabled: z.boolean().nullable(),
    dewarpMode: z
      .enum([
        "NO_TRANSFORM",
        "NORMAL",
        "PANORAMA",
        "SUB_REGION",
        "VERTICAL_PANORAMA",
        "TRANSVERSE_MERCATOR",
        "MERCATOR",
        "EQUIRECTANGULAR",
      ])
      .nullable(),
    event_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
    exposure_level: z.number().int().nullable(),
    fisheye_display_mode: z.enum(["RAW", "IMMERSIVE", "TILES", "RAW_PANO"]).nullable(),
    hdr_enabled: z.boolean().nullable(),
    img_brightness: z.number().int().nullable(),
    img_contrast: z.number().int().nullable(),
    img_saturation: z.number().int().nullable(),
    img_sharpness: z.number().int().nullable(),
    ir_filter_mode: z.enum(["ON", "OFF", "AUTO"]).nullable(),
    ir_leds_mode: z.enum(["ON", "OFF", "AUTO"]).nullable(),
    lastModified: z.number().int().nullable(),
    led_stealth_mode: z.boolean().nullable(),
    media_ttl_minutes: z.number().int().nullable(),
    metering_config: CameraMeteringConfigType,
    motor_config: CameraMotorConfigType,
    mounting_direction: z.enum(["DOWN", "UP", "SIDEWAYS", "UNKNOWN"]).nullable(),
    night_exposure_level: z.number().int().nullable(),
    night_img_brightness: z.number().int().nullable(),
    night_img_contrast: z.number().int().nullable(),
    night_img_saturation: z.number().int().nullable(),
    night_img_sharpness: z.number().int().nullable(),
    night_metering_config: CameraMeteringConfigType,
    night_sensor_gain_max: z.number().int().nullable(),
    night_shutter_time_max: z.number().int().nullable(),
    night_shutter_time_min: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    privacy_windows: z.array(PermyriadRect).nullable(),
    ptz_config: CameraPTZConfigType,
    region_of_interest: RegionConfigType,
    resolution: Deviceconfig_ExternalVideoResolution,
    rotation: z.number().int().nullable(),
    segment_max_bytes: z.number().int().nullable(),
    sensor_gain_max: z.number().int().nullable(),
    shutter_time_max: z.number().int().nullable(),
    shutter_time_min: z.number().int().nullable(),
    snapshot_height: z.number().int().nullable(),
    snapshot_interval_secs: z.number().int().nullable(),
    splice_clip_upload_target: z.enum(["0", "1", "2"]).nullable(),
    tile_views: z.array(DewarpedView).nullable(),
    wdr_strength: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Doorbellcamera_UpdateDoorbellCameraConfigWSRequest = z
  .object({ configUpdate: Deviceconfig_IExternalUpdateableAudioVideoSettings })
  .partial()
  .passthrough();
const Doorbellcamera_UpdateDoorbellCameraDetailsWSRequest = z
  .object({
    description: z.string().nullable(),
    deviceUuid: z.string().nullable(),
    directionRadians: z.number().nullable(),
    floorNumber: z.number().int().nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Doorcontroller_DeleteDoorControllerWSRequest = z
  .object({ doorControllerUuid: z.string().nullable(), mummify: z.boolean().nullable() })
  .passthrough();
const Doorcontroller_DeleteDoorControllerWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    responseStatus: z
      .enum([
        "BASIC_AUTH_FAILED",
        "PASSWORD_MISMATCH",
        "SAME_PASSWORD",
        "USER_EXISTS",
        "USER_NOT_FOUND",
        "DEVICE_NOT_FOUND",
        "POLICY_NOT_FOUND",
        "LOCATION_NOT_FOUND",
        "ORG_NOT_FOUND",
        "BAD_INPUT",
        "SUCCESS",
        "PASSWORD_TOO_SHORT",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const Deviceconfig_IExternalReadableDoorControllerSettings = z
  .object({
    accelerometer_change_tamper_threshold: z.number().nullable(),
    accelerometer_disabled: z.boolean().nullable(),
    autocomponentize_readers: z.boolean().nullable(),
    autoregister_readers: z.boolean().nullable(),
    deviceUuid: z.string().nullable(),
    flip_display_orientation: z.boolean().nullable(),
    lastModified: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    pressure_switch_tamper_disabled: z.boolean().nullable(),
    pressure_switch_tamper_normally_open: z.boolean().nullable(),
    proximity_sensor_tamper_disabled: z.boolean().nullable(),
    proximity_sensor_tamper_distance_threshold: z.number().nullable(),
  })
  .partial()
  .passthrough();
const Doorcontroller_GetDoorControllerConfigWSResponse = z
  .object({
    config: Deviceconfig_IExternalReadableDoorControllerSettings,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Doorcontroller_GetDoorControllerStateListWSRequest = z.object({}).partial().passthrough();
const Doorcontroller_DoorControllerDiscoveredReaderType = z
  .object({
    boardNum: z.number().int().nullable(),
    lastSeenMs: z.number().int().nullable(),
    online: z.boolean().nullable(),
    portNum: z.number().int().nullable(),
    type: z.enum(["RHOMBUS", "THIRD_PARTY"]).nullable(),
  })
  .partial()
  .passthrough();
const Doorcontroller_DoorControllerStateType = z
  .object({
    configUpdatedAtMs: z.number().int().nullable(),
    connectionStatus: DeviceStatusEnum,
    deleted: z.boolean().nullable(),
    description: z.string().nullable(),
    directionRadians: z.number().nullable(),
    discoveredReaders: z.array(Doorcontroller_DoorControllerDiscoveredReaderType).nullable(),
    firmwareVersion: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    grantsUpdatedAtMs: z.number().int().nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    policyUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Doorcontroller_GetDoorControllerStateListWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    stateList: z.array(Doorcontroller_DoorControllerStateType).nullable(),
  })
  .partial()
  .passthrough();
const Doorcontroller_RegisterDiscoveredRhombusReaderWSRequest = z
  .object({
    boardNum: z.number().int().nullable(),
    doorControllerUuid: z.string().nullable(),
    portNum: z.number().int().nullable(),
    serialNumber: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Doorcontroller_RegisterDiscoveredRhombusReaderWSResponse = z
  .object({})
  .partial()
  .passthrough();
const Deviceconfig_IExternalUpdateableDoorControllerSettings = z
  .object({
    accelerometer_change_tamper_threshold: z.number().nullable(),
    accelerometer_disabled: z.boolean().nullable(),
    autocomponentize_readers: z.boolean().nullable(),
    autoregister_readers: z.boolean().nullable(),
    deviceUuid: z.string().nullable(),
    flip_display_orientation: z.boolean().nullable(),
    lastModified: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    pressure_switch_tamper_disabled: z.boolean().nullable(),
    pressure_switch_tamper_normally_open: z.boolean().nullable(),
    proximity_sensor_tamper_disabled: z.boolean().nullable(),
    proximity_sensor_tamper_distance_threshold: z.number().nullable(),
  })
  .partial()
  .passthrough();
const Doorcontroller_UpdateDoorControllerConfigWSRequest = z
  .object({ configUpdate: Deviceconfig_IExternalUpdateableDoorControllerSettings })
  .partial()
  .passthrough();
const Doorcontroller_UpdateDoorControllerDetailsWSRequest = z
  .object({
    description: z.string().nullable(),
    directionRadians: z.number().nullable(),
    floorNumber: z.number().int().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Doorcontroller_UpdateDoorControllerDetailsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Ethernettester_GetEthernetTesterConfigWSRequest = z
  .object({ version: z.string().nullable() })
  .partial()
  .passthrough();
const Ethernettester_GetEthernetTesterConfigWSResponse = z
  .object({
    configJson: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_CreateSharedClipGroupWSRequest_RuuidWrapper = z
  .object({ alertUuid: z.string().nullable(), eventUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Event_CreateSharedClipGroupWSRequest = z
  .object({
    description: z.string().nullable(),
    expirationTimeSecs: z.number().int().nullable(),
    plaintextPassword: z.string().nullable(),
    title: z.string().nullable(),
    uuids: z.array(Event_CreateSharedClipGroupWSRequest_RuuidWrapper).nullable(),
  })
  .partial()
  .passthrough();
const Event_CreateSharedClipGroupWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    shareUrl: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_DeleteAlertMonitoringThreatCaseWSRequest = z
  .object({ threatCaseUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Event_DeleteAlertMonitoringThreatCaseWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_DeleteSavedClipWSRequest = z
  .object({ savedClipUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Event_DeleteSavedClipWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_DeleteSharedClipGroupWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Event_DeleteSharedClipGroupWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_DismissAllPolicyAlertsForDeviceWSRequest = z
  .object({ deviceUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Event_DismissAllPolicyAlertsForDeviceWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_DismissAllPolicyAlertsWSRequest = z.object({}).partial().passthrough();
const Event_DismissAllPolicyAlertsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_DismissPolicyAlertWSRequest = z
  .object({ alertUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Event_DismissPolicyAlertWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_DismissPolicyAlertsWSRequest = z
  .object({ alertUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Event_DismissPolicyAlertsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_GetAlertMonitoringThreatCasesWSRequest = z
  .object({
    afterTimestampMs: z.number().int().nullable(),
    beforeTimestampMs: z.number().int().nullable(),
    lastTimestampMs: z.number().int().nullable(),
    lastUuid: z.string().nullable(),
    locationFilter: z.array(z.string().nullable()).nullable(),
    maxResults: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const ThreatCaseStatus = z.enum([
  "INITIATED",
  "REQUESTED",
  "FOLLOW_ON",
  "ESCALATED",
  "PSAP_CONTACTED",
  "VERIFIED",
  "DISMISSED",
  "CANCELLED",
  "UNVERIFIABLE",
  "TIMEOUT",
  "ERROR",
  "CLOSED",
]);
const ThreatCaseTimelineEventTypeEnum = z.enum([
  "ALERT",
  "DELAYED_ALERT",
  "USER",
  "SERVICE_PROVIDER",
  "ERROR",
  "PANIC_BUTTON",
  "UNKNOWN",
]);
const ThreatCaseTimelineEventType = z
  .object({
    alertUuid: z.string().nullable(),
    message: z.string().nullable(),
    timestampSec: z.number().int().nullable(),
    type: ThreatCaseTimelineEventTypeEnum,
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const AlertMonitoringThreatCaseType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    deleted: z.boolean().nullable(),
    locationName: z.string().nullable(),
    locationUuid: z.string().nullable(),
    noonlightAlarmId: z.string().nullable(),
    noonlightVerificationId: z.string().nullable(),
    orgUuid: z.string().nullable(),
    policyAlertUuid: z.string().nullable(),
    policyAlertUuids: z.array(z.string().nullable()).nullable(),
    promptTheme: NoonlightPromptTheme,
    sharedClipGroupUuid: z.string().nullable(),
    status: ThreatCaseStatus,
    submissionTimestampMs: z.number().int().nullable(),
    timelineEventList: z.array(ThreatCaseTimelineEventType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetAlertMonitoringThreatCasesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    threatCases: z.array(AlertMonitoringThreatCaseType).nullable(),
  })
  .partial()
  .passthrough();
const Event_GetClipsWithProgressWSRequest = z
  .object({
    deviceUuidFilters: z.array(z.string().nullable()).nullable(),
    maxPageSize: z.number().int().nullable(),
    pageTimestampMs: z.number().int().nullable(),
    searchFilter: z.string().nullable(),
    sortField: z.string().nullable(),
    sortOrder: z.string().nullable(),
    timestampFilterField: z.string().nullable(),
    timestampMsAfter: z.number().int().nullable(),
    timestampMsBefore: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const CroppedPermyriadRect = z
  .object({
    height: z.number().int().nullable(),
    width: z.number().int().nullable(),
    x: z.number().int().nullable(),
    y: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const AlteredView = z
  .object({ crop: CroppedPermyriadRect, dewarp: DewarpedView })
  .partial()
  .passthrough();
const MetaDataLocationType = z.object({ region: z.string().nullable() }).partial().passthrough();
const Resolution = z
  .object({ height: z.number().int().nullable(), width: z.number().int().nullable() })
  .partial()
  .passthrough();
const Event_SavedClipWithProgressType = z
  .object({
    alterMap: z.record(z.array(AlteredView).nullable()).nullable(),
    analyzed: z.boolean().nullable(),
    byteCount: z.number().int().nullable(),
    clipLocation: MetaDataLocationType,
    consoleDelete: z.boolean().nullable(),
    createdAtMs: z.number().int().nullable(),
    currentOperation: z.string().nullable(),
    description: z.string().nullable(),
    deviceUuid: z.string().nullable(),
    deviceUuidMap: z.record(MetaDataLocationType).nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    externalTransactionId: z.string().nullable(),
    fisheyeMap: z.record(z.array(DewarpedView).nullable()).nullable(),
    integrationUploadList: z.array(IntegrationEnum).nullable(),
    lastUpdatedSec: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    percentComplete: z.number().int().nullable(),
    saveToDrive: z.boolean().nullable(),
    sha256Hex: z.string().nullable(),
    sourceAlertUuid: z.string().nullable(),
    status: z
      .enum(["INITIATING", "UPLOADING", "RENDERING", "FAILED", "COMPLETE", "OFFLINE", "UNKNOWN"])
      .nullable(),
    thumbnailLocation: MetaDataLocationType,
    timestampMs: z.number().int().nullable(),
    title: z.string().nullable(),
    uuid: z.string().nullable(),
    videoResolution: Resolution,
  })
  .partial()
  .passthrough();
const Event_GetClipsWithProgressWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    savedClips: z.array(Event_SavedClipWithProgressType).nullable(),
  })
  .partial()
  .passthrough();
const Event_GetMotionGridWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    endTimeUtcSecs: z.number().int().nullable(),
    startTimeUtcSecs: z.number().int().nullable(),
  })
  .passthrough();
const Event_FrontendCell = z
  .object({ col: z.number().int().nullable(), row: z.number().int().nullable() })
  .partial()
  .passthrough();
const Event_GetMotionGridWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    motionCells: z.record(z.array(Event_FrontendCell).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Event_GetMotionGridCountsWSResponse = z
  .object({
    countGrid: z.array(z.array(z.number().int().nullable()).nullable()).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetPolicyAlertCountWSRequest = z
  .object({ maxResultsSize: z.number().int().nullable() })
  .partial()
  .passthrough();
const Event_GetPolicyAlertCountWSResponse = z
  .object({
    count: z.number().int().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetPolicyAlertDetailsWSRequest = z
  .object({ policyAlertUuid: z.string().nullable() })
  .partial()
  .passthrough();
const ClipBoundingBoxType = z
  .object({
    activity: ActivityEnum,
    alert: z.boolean().nullable(),
    bottom: z.number().int().nullable(),
    croppedImageLocator: z.string().nullable(),
    customActivityColor: z
      .enum(["BLUE", "RED", "PURPLE", "TAN", "ORANGE", "TEAL", "GRAY", "BLACK"])
      .nullable(),
    customActivityDescription: z.string().nullable(),
    customActivityDisplayName: z.string().nullable(),
    faceName: z.string().nullable(),
    inMotion: z.boolean().nullable(),
    keypointsV2: z.record(PointType).nullable(),
    left: z.number().int().nullable(),
    licensePlate: z.string().nullable(),
    loudness: z.number().int().nullable(),
    objectId: z.number().int().nullable(),
    pose: z.string().nullable(),
    relativeSecond: z.number().nullable(),
    right: z.number().int().nullable(),
    toastOrderIdInfo: ToastOrderIdType,
    top: z.number().int().nullable(),
    unidentifiedFaceId: z.string().nullable(),
    vehicleName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const PolicyEventFaceType = z
  .object({
    faceId: z.string().nullable(),
    faceName: z.string().nullable(),
    imageS3Bucket: z.string().nullable(),
    imageS3Key: z.string().nullable(),
    imageS3Region: z.string().nullable(),
  })
  .partial()
  .passthrough();
const PolicyEventVehicleType = z
  .object({
    imageS3Bucket: z.string().nullable(),
    imageS3Key: z.string().nullable(),
    imageS3Region: z.string().nullable(),
    licensePlateNumber: z.string().nullable(),
    vehicleName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ClipSeekPointV2Type = z
  .object({
    activity: ActivityEnum,
    alert: z.boolean().nullable(),
    customActivityColor: z
      .enum(["BLUE", "RED", "PURPLE", "TAN", "ORANGE", "TEAL", "GRAY", "BLACK"])
      .nullable(),
    customActivityDescription: z.string().nullable(),
    customActivityDisplayName: z.string().nullable(),
    faceName: z.string().nullable(),
    id: z.number().int().nullable(),
    inMotion: z.boolean().nullable(),
    licensePlate: z.string().nullable(),
    loudness: z.number().int().nullable(),
    pose: z.string().nullable(),
    relativeSecond: z.number().nullable(),
    toastOrderIdInfo: ToastOrderIdType,
    tu: z.string().nullable(),
    unidentifiedFaceId: z.string().nullable(),
    vehicleName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const PolicyAlertWithDetailsType = z
  .object({
    alertMonitoringThreatCaseUuid: z.string().nullable(),
    alertMonitoringVerified: z.boolean().nullable(),
    boundingBoxes: z.array(ClipBoundingBoxType).nullable(),
    boundingBoxesMap: z.record(z.array(ClipBoundingBoxType).nullable()).nullable(),
    clipLocationMap: z.record(MetaDataLocationType).nullable(),
    clipLocationMapV2: z.record(z.string().nullable()).nullable(),
    delayedProcessing: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    durationSec: z.number().int().nullable(),
    finalized: z.boolean().nullable(),
    locationUuid: z.string().nullable(),
    notificationSent: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    policyAlertTriggers: z.array(ActivityEnum).nullable(),
    recognizedEventFaces: z.array(PolicyEventFaceType).nullable(),
    recognizedEventVehicles: z.array(PolicyEventVehicleType).nullable(),
    saved: z.boolean().nullable(),
    seekPoints: z.array(ClipSeekPointV2Type).nullable(),
    seekPointsMap: z.record(z.array(ClipSeekPointV2Type).nullable()).nullable(),
    shared: z.boolean().nullable(),
    thumbnailLocation: MetaDataLocationType,
    thumbnailLocationV2: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
    type: z.enum(["POLICY_ALERT_V2", "ACCESS_CONTROLLED_DOOR_POLICY_ALERT"]).nullable(),
    unrecognizedEventFaces: z.array(PolicyEventFaceType).nullable(),
    unrecognizedEventVehicles: z.array(PolicyEventVehicleType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetPolicyAlertDetailsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyAlert: PolicyAlertWithDetailsType,
  })
  .partial()
  .passthrough();
const Event_GetPolicyAlertGroupsForDeviceWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    lastTimestampMs: z.number().int().nullable(),
    lastUuid: z.string().nullable(),
    maxResults: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const PolicyAlertV2Type = z
  .object({
    alertMonitoringThreatCaseUuid: z.string().nullable(),
    alertMonitoringVerified: z.boolean().nullable(),
    alertingEventFaces: z.array(PolicyEventFaceType).nullable(),
    alertingEventVehicles: z.array(PolicyEventVehicleType).nullable(),
    clipLocation: MetaDataLocationType,
    clipLocationMap: z.record(MetaDataLocationType).nullable(),
    clipLocationMapV2: z.record(z.string().nullable()).nullable(),
    co2: z.number().nullable(),
    co2Threshold: z.number().nullable(),
    delayedProcessing: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    deviceType: DeviceTypeEnum,
    deviceUuid: z.string().nullable(),
    durationSec: z.number().int().nullable(),
    egressBoundaryDevices: z.array(z.string().nullable()).nullable(),
    ethanol: z.number().nullable(),
    ethanolThreshold: z.number().nullable(),
    finalized: z.boolean().nullable(),
    humidityPercent1616: z.number().int().nullable(),
    humidityPercentThreshold1616: z.number().int().nullable(),
    humidityPermyriad: z.number().int().nullable(),
    humidityThresholdPermyriad: z.number().int().nullable(),
    iaq: z.number().nullable(),
    iaqThreshold: z.number().nullable(),
    ingressBoundaryDevices: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    maxLuf: z.number().int().nullable(),
    notificationSent: z.boolean().nullable(),
    numHumans: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    peopleCountHighThreshold: z.number().int().nullable(),
    peopleCountLowThreshold: z.number().int().nullable(),
    pm25: z.number().nullable(),
    pm25Threshold: z.number().nullable(),
    policyAlertTriggers: z.array(ActivityEnum).nullable(),
    probeTempC: z.number().nullable(),
    probeTempCThreshold: z.number().nullable(),
    saved: z.boolean().nullable(),
    shared: z.boolean().nullable(),
    tamperByMovementChange: z.number().nullable(),
    tampered: z.boolean().nullable(),
    temperatureCelsius1616: z.number().int().nullable(),
    temperatureCelsiusThreshold1616: z.number().int().nullable(),
    temperaturePermyriad: z.number().int().nullable(),
    temperatureThresholdPermyriad: z.number().int().nullable(),
    thcPercent: z.number().nullable(),
    thcPercentThreshold: z.number().nullable(),
    thumbnailLocation: MetaDataLocationType,
    thumbnailLocationV2: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
    tvoc: z.number().nullable(),
    tvocThreshold: z.number().nullable(),
    type: z.enum(["POLICY_ALERT_V2", "ACCESS_CONTROLLED_DOOR_POLICY_ALERT"]).nullable(),
    uuid: z.string().nullable(),
    vapeSmokePercent: z.number().nullable(),
    vapeSmokePercentThreshold: z.number().nullable(),
  })
  .partial()
  .passthrough();
const Event_PolicyAlertGroupV2 = z
  .object({
    endTime: z.number().int().nullable(),
    policyAlerts: z.array(PolicyAlertV2Type).nullable(),
    startTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetPolicyAlertGroupsForDeviceWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyAlertGroups: z.array(Event_PolicyAlertGroupV2).nullable(),
  })
  .partial()
  .passthrough();
const Event_GetPolicyAlertGroupsForLocationWSRequest = z
  .object({
    lastTimestampMs: z.number().int().nullable(),
    lastUuid: z.string().nullable(),
    locationUuid: z.string().nullable(),
    maxResults: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetPolicyAlertGroupsForLocationWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyAlertGroups: z.array(Event_PolicyAlertGroupV2).nullable(),
  })
  .partial()
  .passthrough();
const Event_GetPolicyAlertsWSRequest = z
  .object({
    accessControlledDoorFilter: z.array(z.string().nullable()).nullable(),
    afterTimestampMs: z.number().int().nullable(),
    beforeTimestampMs: z.number().int().nullable(),
    deviceFilter: z.array(z.string().nullable()).nullable(),
    lastTimestampMs: z.number().int().nullable(),
    lastUuid: z.string().nullable(),
    locationFilter: z.array(z.string().nullable()).nullable(),
    maxResults: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const BasePolicyAlertType = z
  .object({
    alertMonitoringThreatCaseUuid: z.string().nullable(),
    alertMonitoringVerified: z.boolean().nullable(),
    clipLocationMap: z.record(MetaDataLocationType).nullable(),
    clipLocationMapV2: z.record(z.string().nullable()).nullable(),
    delayedProcessing: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    durationSec: z.number().int().nullable(),
    finalized: z.boolean().nullable(),
    locationUuid: z.string().nullable(),
    notificationSent: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    policyAlertTriggers: z.array(ActivityEnum).nullable(),
    saved: z.boolean().nullable(),
    shared: z.boolean().nullable(),
    thumbnailLocation: MetaDataLocationType,
    thumbnailLocationV2: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
    type: z.enum(["POLICY_ALERT_V2", "ACCESS_CONTROLLED_DOOR_POLICY_ALERT"]).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetPolicyAlertsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyAlerts: z.array(BasePolicyAlertType).nullable(),
  })
  .partial()
  .passthrough();
const Event_GetSavedClipCountWSRequest = z
  .object({
    deviceFilter: z.array(z.string().nullable()).nullable(),
    endTimeMs: z.number().int().nullable(),
    locationFilter: z.array(z.string().nullable()).nullable(),
    startTimeMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetSavedClipCountWSResponse = z
  .object({
    count: z.number().int().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetSavedClipDetailsWSRequest = z
  .object({ clipUuid: z.string().nullable() })
  .partial()
  .passthrough();
const SavedClipWithDetailsType = z
  .object({
    alterMap: z.record(z.array(AlteredView).nullable()).nullable(),
    analyzed: z.boolean().nullable(),
    boundingBoxes: z.array(ClipBoundingBoxType).nullable(),
    byteCount: z.number().int().nullable(),
    clipLocation: MetaDataLocationType,
    consoleDelete: z.boolean().nullable(),
    createdAtMs: z.number().int().nullable(),
    description: z.string().nullable(),
    deviceUuid: z.string().nullable(),
    deviceUuidMap: z.record(MetaDataLocationType).nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    externalTransactionId: z.string().nullable(),
    fisheyeMap: z.record(z.array(DewarpedView).nullable()).nullable(),
    integrationUploadList: z.array(IntegrationEnum).nullable(),
    orgUuid: z.string().nullable(),
    saveToDrive: z.boolean().nullable(),
    seekPoints: z.array(ClipSeekPointV2Type).nullable(),
    sha256Hex: z.string().nullable(),
    sourceAlertUuid: z.string().nullable(),
    status: z
      .enum(["INITIATING", "UPLOADING", "RENDERING", "FAILED", "COMPLETE", "OFFLINE", "UNKNOWN"])
      .nullable(),
    thumbnailLocation: MetaDataLocationType,
    timestampMs: z.number().int().nullable(),
    title: z.string().nullable(),
    uuid: z.string().nullable(),
    videoResolution: Resolution,
  })
  .partial()
  .passthrough();
const Event_GetSavedClipDetailsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    savedClip: SavedClipWithDetailsType,
  })
  .partial()
  .passthrough();
const Event_GetSavedClipsByExternalTransactionIdWSRequest = z
  .object({ externalTransactionId: z.string().nullable() })
  .partial()
  .passthrough();
const SavedClipV2Type = z
  .object({
    alterMap: z.record(z.array(AlteredView).nullable()).nullable(),
    analyzed: z.boolean().nullable(),
    byteCount: z.number().int().nullable(),
    clipLocation: MetaDataLocationType,
    consoleDelete: z.boolean().nullable(),
    createdAtMs: z.number().int().nullable(),
    description: z.string().nullable(),
    deviceUuid: z.string().nullable(),
    deviceUuidMap: z.record(MetaDataLocationType).nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    externalTransactionId: z.string().nullable(),
    fisheyeMap: z.record(z.array(DewarpedView).nullable()).nullable(),
    integrationUploadList: z.array(IntegrationEnum).nullable(),
    orgUuid: z.string().nullable(),
    saveToDrive: z.boolean().nullable(),
    sha256Hex: z.string().nullable(),
    sourceAlertUuid: z.string().nullable(),
    status: z
      .enum(["INITIATING", "UPLOADING", "RENDERING", "FAILED", "COMPLETE", "OFFLINE", "UNKNOWN"])
      .nullable(),
    thumbnailLocation: MetaDataLocationType,
    timestampMs: z.number().int().nullable(),
    title: z.string().nullable(),
    uuid: z.string().nullable(),
    videoResolution: Resolution,
  })
  .partial()
  .passthrough();
const Event_GetSavedClipsByExternalTransactionIdWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    savedClips: z.array(SavedClipV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Event_GetSavedClipsV2WSRequest = z
  .object({
    maxPageSize: z.number().int().nullable(),
    pageTimestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetSavedClipsV2WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    savedClips: z.array(SavedClipV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Event_GetSharedClipGroupDetailsWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const SharedClipWithDetailsType = z
  .object({
    boundingBoxes: z.array(ClipBoundingBoxType).nullable(),
    clipLocation: MetaDataLocationType,
    deviceUuidMap: z.record(MetaDataLocationType).nullable(),
    durationSec: z.number().int().nullable(),
    seekPoints: z.array(ClipSeekPointV2Type).nullable(),
    startTime: z.number().int().nullable(),
    thumbnailLocation: MetaDataLocationType,
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const SharedClipGroupWithDetailsType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    description: z.string().nullable(),
    expirationTimeSecs: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    sharedClips: z.array(SharedClipWithDetailsType).nullable(),
    title: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetSharedClipGroupDetailsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sharedClipGroup: SharedClipGroupWithDetailsType,
  })
  .partial()
  .passthrough();
const Event_GetSharedClipGroupsV2WSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const SharedClipV2Type = z
  .object({
    clipLocation: MetaDataLocationType,
    deviceUuidMap: z.record(MetaDataLocationType).nullable(),
    durationSec: z.number().int().nullable(),
    startTime: z.number().int().nullable(),
    thumbnailLocation: MetaDataLocationType,
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const SharedClipGroupWrapperV2Type = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    description: z.string().nullable(),
    expirationTimeSecs: z.number().int().nullable(),
    isSecured: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    sharedClips: z.array(SharedClipV2Type).nullable(),
    title: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetSharedClipGroupsV2WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sharedClipGroups: z.array(SharedClipGroupWrapperV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Event_GetUnhealthyDeviceAlertsWSRequest = z.object({}).partial().passthrough();
const UnHealthyDeviceAlertType = z
  .object({
    deviceUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    symptom: z.enum(["POLICY_NOT_ASSIGNED", "DOWN", "SLOW_INTERNET"]).nullable(),
    timestamp: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_GetUnhealthyDeviceAlertsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    unhealthyDeviceAlerts: z.array(UnHealthyDeviceAlertType).nullable(),
  })
  .partial()
  .passthrough();
const Event_MuteNotificationsForDevicetWSRequest = z
  .object({ deviceUuid: z.string().nullable(), durationSec: z.number().int().nullable() })
  .partial()
  .passthrough();
const Event_MuteNotificationsForDevicetWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_ReportBadPolicyAlertWSRequest = z
  .object({ policyAlert: PolicyAlertV2Type })
  .partial()
  .passthrough();
const Event_ReportBadPolicyAlertWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_SavePolicyAlertWSRequest = z
  .object({
    alertUuid: z.string().nullable(),
    fisheyePresentationMap: z.record(z.array(DewarpedView).nullable()).nullable(),
    savedClipDescription: z.string().nullable(),
    savedClipTitle: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_SavePolicyAlertWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_SearchMotionGridWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    endTimeUtcSecs: z.number().int().nullable(),
    searchCells: z.array(Event_FrontendCell).nullable(),
    startTimeUtcSecs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Event_SearchMotionGridWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    timeUtcSecsList: z.array(z.number().int().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Event_SearchMotionGridWithActivitiesWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    endTimeUtcSecs: z.number().int().nullable(),
    searchCells: z.array(Event_FrontendCell).nullable(),
    startTimeUtcSecs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Event_SearchMotionGridWithActivitiesWSResponse_ActivityWithId = z
  .object({ activity: ActivityEnum, objectId: z.number().int().nullable() })
  .partial()
  .passthrough();
const Event_SearchMotionGridWithActivitiesWSResponse_MotionGridActivity = z
  .object({
    activities: z.array(ActivityEnum).nullable(),
    activitiesWithId: z
      .array(Event_SearchMotionGridWithActivitiesWSResponse_ActivityWithId)
      .nullable(),
    bestTimestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Event_SearchMotionGridWithActivitiesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    timeUtcSecsToActivityMap: z
      .record(Event_SearchMotionGridWithActivitiesWSResponse_MotionGridActivity)
      .nullable(),
  })
  .partial()
  .passthrough();
const Event_UpdateSavedClipWSRequest = z
  .object({
    description: z.string().nullable(),
    savedClipUuid: z.string().nullable(),
    title: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_UpdateSavedClipWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Event_UpdateSharedClipGroupWSRequest = z
  .object({
    description: z.string().nullable(),
    expirationTimeSecs: z.number().int().nullable(),
    plaintextPassword: z.string().nullable(),
    sharedClipUuid: z.string().nullable(),
    title: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Event_UpdateSharedClipGroupWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    shareUrl: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportAuditEventsWSRequest = z
  .object({
    endInterval: z.number().int().nullable(),
    excludeActions: z
      .array(
        z
          .enum([
            "THREAT_CASE_ESCALATED",
            "THREAT_CASE_CANCELLED",
            "THREAT_CASE_DISMISSED",
            "THREAT_CASE_DELETED",
            "PIN_CREATED",
            "PIN_DELETED",
            "BASIC_AUTH_SUCCESS",
            "BASIC_AUTH_FAILURE",
            "SAML_LOGIN_WEB",
            "LOGIN_WEB",
            "PASSWORDLESS_LOGIN_WEB",
            "PARTNER_LOGIN_WEB",
            "PARTNER_PASSWORDLESS_LOGIN_WEB",
            "SAML_LOGIN_FAILURE_WEB",
            "LOGIN_FAILURE_WEB",
            "RHOMBUS_KEY_LOGIN",
            "RHOMBUS_KEY_PASSWORDLESS_LOGIN",
            "RHOMBUS_KEY_SAML_LOGIN",
            "LOGOUT_WEB",
            "PARTNER_LOGOUT_WEB",
            "WEB_CONSOLE_ACCESS",
            "MOBILE_CONSOLE_ACCESS",
            "SAML_LOGIN_MOBILE",
            "PARTNER_LOGIN_MOBILE",
            "PARTNER_PASSWORDLESS_LOGIN_MOBILE",
            "LOGIN_MOBILE",
            "PASSWORDLESS_LOGIN_MOBILE",
            "SAML_LOGIN_FAILURE_MOBILE",
            "LOGIN_FAILURE_MOBILE",
            "LOGOUT_MOBILE",
            "PARTNER_LOGOUT_MOBILE",
            "MOBILE_ACCESS",
            "CAMERA_WIFI_NETWORK_CHANGED",
            "CAMERA_FORCED_REBOOT",
            "FIRMWARE_UPDATE_CAMERA",
            "DELETE_CAMERA",
            "DELETE_USER",
            "DELETE_LOCATION",
            "DELETE_ROLE",
            "ERASE_CAMERA",
            "POLICY_UPDATE",
            "POLICY_DELETE",
            "POLICY_PAUSED_LOCATION",
            "POLICY_PAUSED_DEVICE",
            "CREATE_POLICY_ADDENDUM",
            "DEVICE_REGISTERED",
            "DEVICE_UPDATE",
            "DEVICE_SETTINGS_UPDATE",
            "DEVICE_FEATURE_UPDATE",
            "DEVICE_ORG_REASSIGN",
            "LICENSE_ASSIGNED",
            "LICENSE_CREATED",
            "USER_UPDATE",
            "USER_CREATE",
            "USER_IMPORT",
            "ROLE_CREATE",
            "POLICY_CREATE",
            "PARTNER_CLIENT_CREATE",
            "PARTNER_CUSTOMIZE_CLIENT",
            "PARTNER_CUSTOMIZE_CLIENT_DEVICE",
            "ORG_UPDATE",
            "DELETE_ORG",
            "DISABLE_ORG",
            "CREATE_ORG",
            "ROLE_UPDATE",
            "USER_ROLE_UPDATE",
            "TIMELAPSE_CREATE",
            "TIMELAPSE_DELETE",
            "ALERT_DISMISS",
            "ALL_ALERT_DISMISS",
            "SAVED_CLIP_CREATE",
            "SAVED_CLIP_DELETE",
            "SHARED_CLIP_DELETE",
            "SHARED_CLIP_CREATE",
            "SHARED_LINK_SENT",
            "SHARED_LIVE_VIDEO_STREAM_WITH_PASSWORD_CREATE",
            "SHARED_LIVE_VIDEO_STREAM_WITHOUT_PASSWORD_CREATE",
            "SHARED_LIVE_VIDEO_STREAM_DELETE",
            "SHARED_VIDEOWALL_WITH_PASSWORD_CREATE",
            "SHARED_VIDEOWALL_WITHOUT_PASSWORD_CREATE",
            "SHARED_VIDEOWALL_DELETE",
            "RAW_HTTP_STREAM_CREATED",
            "RAW_HTTP_STREAM_DELETED",
            "SETUP_VIRTUAL_MFA_DEVICE",
            "DELETE_VIRTUAL_MFA_DEVICE",
            "SETUP_SCIM_API_ACCESS",
            "REVOKE_SCIM_API_ACCESS",
            "AUDIT_EXPORT",
            "COUNT_EXPORT",
            "DIAGNOSTIC_EXPORT",
            "INVENTORY_EXPORT",
            "USERS_EXPORT",
            "UPTIME_EXPORT",
            "SUPPORT_TICKET_OPEN",
            "RMA_OPEN",
            "FEEDBACK_CREATE",
            "SUPPORT_ACCESS_GRANT",
            "SUPPORT_ACCESS_REVOKE",
            "SUPPORT_SEARCH_TICKETS",
            "ACCEPT_UAP",
            "ACCEPT_RHOMBUS_UAP",
            "ACCEPT_ALERTMONITORING_UAP",
            "UPLOAD_FACES",
            "CREATE_SEEKPOINT",
            "DELETE_CUSTOM_SEEKPOINT",
            "UPDATE_INTEGRATION_SAML",
            "UPDATE_INTEGRATION_SLACK",
            "UPDATE_INTEGRATION_SLACK_V2",
            "DELETE_INTEGRATION_SLACK_V2",
            "UPDATE_INTEGRATION_BOX",
            "DELETE_INTEGRATION_BOX",
            "UPDATE_INTEGRATION_GOOGLE",
            "DELETE_INTEGRATION_GOOGLE",
            "UPDATE_INTEGRATION_GOOGLE_V2",
            "DELETE_INTEGRATION_GOOGLE_V2",
            "UPDATE_INTEGRATION_PAGERDUTY",
            "DELETE_INTEGRATION_PAGERDUTY",
            "UPDATE_INTEGRATION_SERVICENOW",
            "DELETE_INTEGRATION_SERVICENOW",
            "UPDATE_INTEGRATION_OFFICE365",
            "DELETE_INTEGRATION_OFFICE365",
            "UPDATE_INTEGRATION_DROPBOX",
            "DELETE_INTEGRATION_DROPBOX",
            "UPDATE_INTEGRATION_SQUARE",
            "DELETE_INTEGRATION_SQUARE",
            "UPDATE_INTEGRATION_AWS",
            "DELETE_INTEGRATION_AWS",
            "UPDATE_INTEGRATION_HALO",
            "DELETE_INTEGRATION_HALO",
            "UPDATE_INTEGRATION_WEBHOOK",
            "DELETE_INTEGRATION_WEBHOOK",
            "UPDATE_INTEGRATION_EMAIL",
            "DELETE_INTEGRATION_EMAIL",
            "UPDATE_INTEGRATION_MATTERMOST",
            "DELETE_INTEGRATION_MATTERMOST",
            "UPDATE_INTEGRATION_OPENPATH",
            "DELETE_INTEGRATION_OPENPATH",
            "UPDATE_INTEGRATION_DICE",
            "DELETE_INTEGRATION_DICE",
            "UPDATE_INTEGRATION_LUMEO",
            "DELETE_INTEGRATION_LUMEO",
            "UPDATE_INTEGRATION_DEVICE",
            "DELETE_INTEGRATION_DEVICE",
            "UPDATE_INTEGRATION_GUESTMANAGEMENT",
            "DELETE_INTEGRATION_GUESTMANAGEMENT",
            "UPDATE_GUEST",
            "DELETE_GUEST",
            "UPDATE_INTEGRATION_OMNIALERT",
            "DELETE_INTEGRATION_OMNIALERT",
            "UPDATE_INTEGRATION_OPENTECHALLIANCE",
            "DELETE_INTEGRATION_OPENTECHALLIANCE",
            "UPDATE_INTEGRATION_TOAST",
            "DELETE_INTEGRATION_TOAST",
            "UPDATE_INTEGRATION_KISI",
            "DELETE_INTEGRATION_KISI",
            "UPDATE_INTEGRATION_BRIVO",
            "DELETE_INTEGRATION_BRIVO",
            "UPDATE_INTEGRATION_BUTTERFLYMX",
            "DELETE_INTEGRATION_BUTTERFLYMX",
            "UPDATE_INTEGRATION_ENVOY",
            "DELETE_INTEGRATION_ENVOY",
            "CREATE_ENVOY_INVITE",
            "UPDATE_INTEGRATION_SALTO",
            "UPDATE_INTEGRATION_PDK",
            "DELETE_INTEGRATION_PDK",
            "UPDATE_INTEGRATION_GENEA",
            "DELETE_INTEGRATION_GENEA",
            "UPDATE_INTEGRATION_MICROSOFTTEAMS",
            "DELETE_INTEGRATION_MICROSOFTTEAMS",
            "UPDATE_INTEGRATION_AMT",
            "DELETE_INTEGRATION_AMT",
            "UPDATE_INTEGRATION_PLACEOS",
            "DELETE_INTEGRATION_PLACEOS",
            "UPDATE_INTEGRATION_INTUIFACE",
            "DELETE_INTEGRATION_INTUIFACE",
            "UPDATE_INTEGRATION_INFORMACAST",
            "DELETE_INTEGRATION_INFORMACAST",
            "UPDATE_INTEGRATION_NOONLIGHT",
            "UPDATE_INTEGRATION_ALARM_MONITORING",
            "ENABLE_LIVE_ALARM_MONITORING",
            "CREATE_ALARM_MONITORING_SETTINGS",
            "UPDATE_ALARM_MONITORING_SETTINGS",
            "DELETE_ALARM_MONITORING_SETTINGS",
            "UPDATE_FACE",
            "REPORT_FACE_EVENT",
            "REPORT_VEHICLE_EVENT",
            "API_TOKEN_REQUEST",
            "API_TOKEN_REVOKE",
            "API_INVOCATION",
            "VIDEO_WALL_CREATE",
            "VIDEO_WALL_UPDATE",
            "VIDEO_WALL_DELETE",
            "VIEW_SHARE_TIMELAPSE",
            "VIEW_SHARE_CLIP",
            "VIEW_SHARE_STREAM",
            "VIEW_SHARE_VIDEOWALL",
            "VIEW_CAMERA_VOD",
            "CAMERA_POLICY_UPDATE",
            "CAMERA_POLICY_CREATE",
            "CAMERA_POLICY_DELETE",
            "TAG_POLICY_UPDATE",
            "TAG_POLICY_CREATE",
            "TAG_POLICY_DELETE",
            "CLIMATE_POLICY_UPDATE",
            "CLIMATE_POLICY_CREATE",
            "CLIMATE_POLICY_DELETE",
            "DOOR_POLICY_UPDATE",
            "DOOR_POLICY_CREATE",
            "DOOR_POLICY_DELETE",
            "DOOR_SCHEDULE_EXCEPTION_UPDATE",
            "DOOR_SCHEDULE_EXCEPTION_CREATE",
            "DOOR_SCHEDULE_EXCEPTION_DELETE",
            "ACCESS_CONTROLLED_DOOR_POLICY_UPDATE",
            "ACCESS_CONTROLLED_DOOR_POLICY_CREATE",
            "ACCESS_CONTROLLED_DOOR_POLICY_DELETE",
            "OCCUPANCY_POLICY_UPDATE",
            "OCCUPANCY_POLICY_CREATE",
            "OCCUPANCY_POLICY_DELETE",
            "AUDIO_POLICY_UPDATE",
            "AUDIO_POLICY_CREATE",
            "AUDIO_POLICY_DELETE",
            "SCHEDULE_CREATE",
            "SCHEDULE_DELETE",
            "SCHEDULE_UPDATE",
            "UPLOAD_FLOORPLAN",
            "ORG_AUDIO_RECORD_UPDATE",
            "DOOR_ACCESS_UNLOCK",
            "RHOMBUS_KEY_DOOR_UNLOCK",
            "UPLOAD_ACCESS_CONTROLLED_DOOR",
            "UPLOAD_USER_PROFILE_PICTURE",
            "ACCESS_GRANT_CREATE",
            "ACCESS_GRANT_UPDATE",
            "ACCESS_GRANT_DELETE",
            "ACCESS_REVOCATION_CREATE",
            "ACCESS_REVOCATION_UPDATE",
            "ACCESS_REVOCATION_DELETE",
            "ACCESS_CONTROLLED_DOOR_CREATE",
            "ACCESS_CONTROLLED_DOOR_UPDATE",
            "ACCESS_CONTROLLED_DOOR_DELETE",
            "AC_CRED_RHOMBUS_SECURE_CSN_CREATE",
            "AC_CRED_RHOMBUS_SECURE_CSN_UPDATE",
            "AC_CRED_RHOMBUS_SECURE_CSN_DELETE",
            "AC_CRED_RHOMBUS_SECURE_CSN_REVOKED",
            "AC_CRED_STANDARD_CSN_CREATE",
            "AC_CRED_STANDARD_CSN_UPDATE",
            "AC_CRED_STANDARD_CSN_DELETE",
            "AC_CRED_STANDARD_CSN_REVOKED",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_CREATE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_UPDATE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_DELETE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_REVOKED",
            "AC_CRED_WIEGAND_CREATE",
            "AC_CRED_WIEGAND_UPDATE",
            "AC_CRED_WIEGAND_DELETE",
            "AC_CRED_WIEGAND_REVOKED",
            "AC_LOCKDOWN_PLAN_CREATED",
            "AC_LOCKDOWN_PLAN_UPDATED",
            "AC_LOCKDOWN_PLAN_DELETED",
            "AC_LOCKDOWN_ACTIVATED",
            "AC_LOCKDOWN_DEACTIVATED",
            "RULE_CREATE",
            "RULE_DELETE",
            "RULE_UPDATE",
            "RULE_PAUSE",
            "UNKNOWN",
          ])
          .nullable()
      )
      .max(50)
      .nullable(),
    includeActions: z
      .array(
        z
          .enum([
            "THREAT_CASE_ESCALATED",
            "THREAT_CASE_CANCELLED",
            "THREAT_CASE_DISMISSED",
            "THREAT_CASE_DELETED",
            "PIN_CREATED",
            "PIN_DELETED",
            "BASIC_AUTH_SUCCESS",
            "BASIC_AUTH_FAILURE",
            "SAML_LOGIN_WEB",
            "LOGIN_WEB",
            "PASSWORDLESS_LOGIN_WEB",
            "PARTNER_LOGIN_WEB",
            "PARTNER_PASSWORDLESS_LOGIN_WEB",
            "SAML_LOGIN_FAILURE_WEB",
            "LOGIN_FAILURE_WEB",
            "RHOMBUS_KEY_LOGIN",
            "RHOMBUS_KEY_PASSWORDLESS_LOGIN",
            "RHOMBUS_KEY_SAML_LOGIN",
            "LOGOUT_WEB",
            "PARTNER_LOGOUT_WEB",
            "WEB_CONSOLE_ACCESS",
            "MOBILE_CONSOLE_ACCESS",
            "SAML_LOGIN_MOBILE",
            "PARTNER_LOGIN_MOBILE",
            "PARTNER_PASSWORDLESS_LOGIN_MOBILE",
            "LOGIN_MOBILE",
            "PASSWORDLESS_LOGIN_MOBILE",
            "SAML_LOGIN_FAILURE_MOBILE",
            "LOGIN_FAILURE_MOBILE",
            "LOGOUT_MOBILE",
            "PARTNER_LOGOUT_MOBILE",
            "MOBILE_ACCESS",
            "CAMERA_WIFI_NETWORK_CHANGED",
            "CAMERA_FORCED_REBOOT",
            "FIRMWARE_UPDATE_CAMERA",
            "DELETE_CAMERA",
            "DELETE_USER",
            "DELETE_LOCATION",
            "DELETE_ROLE",
            "ERASE_CAMERA",
            "POLICY_UPDATE",
            "POLICY_DELETE",
            "POLICY_PAUSED_LOCATION",
            "POLICY_PAUSED_DEVICE",
            "CREATE_POLICY_ADDENDUM",
            "DEVICE_REGISTERED",
            "DEVICE_UPDATE",
            "DEVICE_SETTINGS_UPDATE",
            "DEVICE_FEATURE_UPDATE",
            "DEVICE_ORG_REASSIGN",
            "LICENSE_ASSIGNED",
            "LICENSE_CREATED",
            "USER_UPDATE",
            "USER_CREATE",
            "USER_IMPORT",
            "ROLE_CREATE",
            "POLICY_CREATE",
            "PARTNER_CLIENT_CREATE",
            "PARTNER_CUSTOMIZE_CLIENT",
            "PARTNER_CUSTOMIZE_CLIENT_DEVICE",
            "ORG_UPDATE",
            "DELETE_ORG",
            "DISABLE_ORG",
            "CREATE_ORG",
            "ROLE_UPDATE",
            "USER_ROLE_UPDATE",
            "TIMELAPSE_CREATE",
            "TIMELAPSE_DELETE",
            "ALERT_DISMISS",
            "ALL_ALERT_DISMISS",
            "SAVED_CLIP_CREATE",
            "SAVED_CLIP_DELETE",
            "SHARED_CLIP_DELETE",
            "SHARED_CLIP_CREATE",
            "SHARED_LINK_SENT",
            "SHARED_LIVE_VIDEO_STREAM_WITH_PASSWORD_CREATE",
            "SHARED_LIVE_VIDEO_STREAM_WITHOUT_PASSWORD_CREATE",
            "SHARED_LIVE_VIDEO_STREAM_DELETE",
            "SHARED_VIDEOWALL_WITH_PASSWORD_CREATE",
            "SHARED_VIDEOWALL_WITHOUT_PASSWORD_CREATE",
            "SHARED_VIDEOWALL_DELETE",
            "RAW_HTTP_STREAM_CREATED",
            "RAW_HTTP_STREAM_DELETED",
            "SETUP_VIRTUAL_MFA_DEVICE",
            "DELETE_VIRTUAL_MFA_DEVICE",
            "SETUP_SCIM_API_ACCESS",
            "REVOKE_SCIM_API_ACCESS",
            "AUDIT_EXPORT",
            "COUNT_EXPORT",
            "DIAGNOSTIC_EXPORT",
            "INVENTORY_EXPORT",
            "USERS_EXPORT",
            "UPTIME_EXPORT",
            "SUPPORT_TICKET_OPEN",
            "RMA_OPEN",
            "FEEDBACK_CREATE",
            "SUPPORT_ACCESS_GRANT",
            "SUPPORT_ACCESS_REVOKE",
            "SUPPORT_SEARCH_TICKETS",
            "ACCEPT_UAP",
            "ACCEPT_RHOMBUS_UAP",
            "ACCEPT_ALERTMONITORING_UAP",
            "UPLOAD_FACES",
            "CREATE_SEEKPOINT",
            "DELETE_CUSTOM_SEEKPOINT",
            "UPDATE_INTEGRATION_SAML",
            "UPDATE_INTEGRATION_SLACK",
            "UPDATE_INTEGRATION_SLACK_V2",
            "DELETE_INTEGRATION_SLACK_V2",
            "UPDATE_INTEGRATION_BOX",
            "DELETE_INTEGRATION_BOX",
            "UPDATE_INTEGRATION_GOOGLE",
            "DELETE_INTEGRATION_GOOGLE",
            "UPDATE_INTEGRATION_GOOGLE_V2",
            "DELETE_INTEGRATION_GOOGLE_V2",
            "UPDATE_INTEGRATION_PAGERDUTY",
            "DELETE_INTEGRATION_PAGERDUTY",
            "UPDATE_INTEGRATION_SERVICENOW",
            "DELETE_INTEGRATION_SERVICENOW",
            "UPDATE_INTEGRATION_OFFICE365",
            "DELETE_INTEGRATION_OFFICE365",
            "UPDATE_INTEGRATION_DROPBOX",
            "DELETE_INTEGRATION_DROPBOX",
            "UPDATE_INTEGRATION_SQUARE",
            "DELETE_INTEGRATION_SQUARE",
            "UPDATE_INTEGRATION_AWS",
            "DELETE_INTEGRATION_AWS",
            "UPDATE_INTEGRATION_HALO",
            "DELETE_INTEGRATION_HALO",
            "UPDATE_INTEGRATION_WEBHOOK",
            "DELETE_INTEGRATION_WEBHOOK",
            "UPDATE_INTEGRATION_EMAIL",
            "DELETE_INTEGRATION_EMAIL",
            "UPDATE_INTEGRATION_MATTERMOST",
            "DELETE_INTEGRATION_MATTERMOST",
            "UPDATE_INTEGRATION_OPENPATH",
            "DELETE_INTEGRATION_OPENPATH",
            "UPDATE_INTEGRATION_DICE",
            "DELETE_INTEGRATION_DICE",
            "UPDATE_INTEGRATION_LUMEO",
            "DELETE_INTEGRATION_LUMEO",
            "UPDATE_INTEGRATION_DEVICE",
            "DELETE_INTEGRATION_DEVICE",
            "UPDATE_INTEGRATION_GUESTMANAGEMENT",
            "DELETE_INTEGRATION_GUESTMANAGEMENT",
            "UPDATE_GUEST",
            "DELETE_GUEST",
            "UPDATE_INTEGRATION_OMNIALERT",
            "DELETE_INTEGRATION_OMNIALERT",
            "UPDATE_INTEGRATION_OPENTECHALLIANCE",
            "DELETE_INTEGRATION_OPENTECHALLIANCE",
            "UPDATE_INTEGRATION_TOAST",
            "DELETE_INTEGRATION_TOAST",
            "UPDATE_INTEGRATION_KISI",
            "DELETE_INTEGRATION_KISI",
            "UPDATE_INTEGRATION_BRIVO",
            "DELETE_INTEGRATION_BRIVO",
            "UPDATE_INTEGRATION_BUTTERFLYMX",
            "DELETE_INTEGRATION_BUTTERFLYMX",
            "UPDATE_INTEGRATION_ENVOY",
            "DELETE_INTEGRATION_ENVOY",
            "CREATE_ENVOY_INVITE",
            "UPDATE_INTEGRATION_SALTO",
            "UPDATE_INTEGRATION_PDK",
            "DELETE_INTEGRATION_PDK",
            "UPDATE_INTEGRATION_GENEA",
            "DELETE_INTEGRATION_GENEA",
            "UPDATE_INTEGRATION_MICROSOFTTEAMS",
            "DELETE_INTEGRATION_MICROSOFTTEAMS",
            "UPDATE_INTEGRATION_AMT",
            "DELETE_INTEGRATION_AMT",
            "UPDATE_INTEGRATION_PLACEOS",
            "DELETE_INTEGRATION_PLACEOS",
            "UPDATE_INTEGRATION_INTUIFACE",
            "DELETE_INTEGRATION_INTUIFACE",
            "UPDATE_INTEGRATION_INFORMACAST",
            "DELETE_INTEGRATION_INFORMACAST",
            "UPDATE_INTEGRATION_NOONLIGHT",
            "UPDATE_INTEGRATION_ALARM_MONITORING",
            "ENABLE_LIVE_ALARM_MONITORING",
            "CREATE_ALARM_MONITORING_SETTINGS",
            "UPDATE_ALARM_MONITORING_SETTINGS",
            "DELETE_ALARM_MONITORING_SETTINGS",
            "UPDATE_FACE",
            "REPORT_FACE_EVENT",
            "REPORT_VEHICLE_EVENT",
            "API_TOKEN_REQUEST",
            "API_TOKEN_REVOKE",
            "API_INVOCATION",
            "VIDEO_WALL_CREATE",
            "VIDEO_WALL_UPDATE",
            "VIDEO_WALL_DELETE",
            "VIEW_SHARE_TIMELAPSE",
            "VIEW_SHARE_CLIP",
            "VIEW_SHARE_STREAM",
            "VIEW_SHARE_VIDEOWALL",
            "VIEW_CAMERA_VOD",
            "CAMERA_POLICY_UPDATE",
            "CAMERA_POLICY_CREATE",
            "CAMERA_POLICY_DELETE",
            "TAG_POLICY_UPDATE",
            "TAG_POLICY_CREATE",
            "TAG_POLICY_DELETE",
            "CLIMATE_POLICY_UPDATE",
            "CLIMATE_POLICY_CREATE",
            "CLIMATE_POLICY_DELETE",
            "DOOR_POLICY_UPDATE",
            "DOOR_POLICY_CREATE",
            "DOOR_POLICY_DELETE",
            "DOOR_SCHEDULE_EXCEPTION_UPDATE",
            "DOOR_SCHEDULE_EXCEPTION_CREATE",
            "DOOR_SCHEDULE_EXCEPTION_DELETE",
            "ACCESS_CONTROLLED_DOOR_POLICY_UPDATE",
            "ACCESS_CONTROLLED_DOOR_POLICY_CREATE",
            "ACCESS_CONTROLLED_DOOR_POLICY_DELETE",
            "OCCUPANCY_POLICY_UPDATE",
            "OCCUPANCY_POLICY_CREATE",
            "OCCUPANCY_POLICY_DELETE",
            "AUDIO_POLICY_UPDATE",
            "AUDIO_POLICY_CREATE",
            "AUDIO_POLICY_DELETE",
            "SCHEDULE_CREATE",
            "SCHEDULE_DELETE",
            "SCHEDULE_UPDATE",
            "UPLOAD_FLOORPLAN",
            "ORG_AUDIO_RECORD_UPDATE",
            "DOOR_ACCESS_UNLOCK",
            "RHOMBUS_KEY_DOOR_UNLOCK",
            "UPLOAD_ACCESS_CONTROLLED_DOOR",
            "UPLOAD_USER_PROFILE_PICTURE",
            "ACCESS_GRANT_CREATE",
            "ACCESS_GRANT_UPDATE",
            "ACCESS_GRANT_DELETE",
            "ACCESS_REVOCATION_CREATE",
            "ACCESS_REVOCATION_UPDATE",
            "ACCESS_REVOCATION_DELETE",
            "ACCESS_CONTROLLED_DOOR_CREATE",
            "ACCESS_CONTROLLED_DOOR_UPDATE",
            "ACCESS_CONTROLLED_DOOR_DELETE",
            "AC_CRED_RHOMBUS_SECURE_CSN_CREATE",
            "AC_CRED_RHOMBUS_SECURE_CSN_UPDATE",
            "AC_CRED_RHOMBUS_SECURE_CSN_DELETE",
            "AC_CRED_RHOMBUS_SECURE_CSN_REVOKED",
            "AC_CRED_STANDARD_CSN_CREATE",
            "AC_CRED_STANDARD_CSN_UPDATE",
            "AC_CRED_STANDARD_CSN_DELETE",
            "AC_CRED_STANDARD_CSN_REVOKED",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_CREATE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_UPDATE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_DELETE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_REVOKED",
            "AC_CRED_WIEGAND_CREATE",
            "AC_CRED_WIEGAND_UPDATE",
            "AC_CRED_WIEGAND_DELETE",
            "AC_CRED_WIEGAND_REVOKED",
            "AC_LOCKDOWN_PLAN_CREATED",
            "AC_LOCKDOWN_PLAN_UPDATED",
            "AC_LOCKDOWN_PLAN_DELETED",
            "AC_LOCKDOWN_ACTIVATED",
            "AC_LOCKDOWN_DEACTIVATED",
            "RULE_CREATE",
            "RULE_DELETE",
            "RULE_UPDATE",
            "RULE_PAUSE",
            "UNKNOWN",
          ])
          .nullable()
      )
      .max(50)
      .nullable(),
    startInterval: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportClimateEventsWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    sensorUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportCountReportsWSRequest = z
  .object({
    endDate: z.string().nullable(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    scope: z.enum(["DEVICE", "LOCATION", "ORG"]).nullable(),
    startDate: z.string().nullable(),
    type: z
      .enum([
        "CROWD",
        "PEOPLE",
        "FACES",
        "MOTION",
        "BANDWIDTH",
        "VEHICLES",
        "LICENSEPLATES",
        "ALERTS",
      ])
      .nullable(),
    uuidList: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportDiagnosticEventsWSRequest = z
  .object({ endInterval: z.number().int().nullable(), startInterval: z.number().int().nullable() })
  .partial()
  .passthrough();
const Export_ExportDoorEventsWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    sensorUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const FaceFilter = z
  .object({
    detectionTypes: z.array(z.enum(["COUNTING", "RECOGNITION"]).nullable()).nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
    labels: z.array(z.string().nullable()).nullable(),
    types: z.array(z.enum(["alert", "trusted", "named", "other"]).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const TimeInterval = z
  .object({ endMs: z.number().int().nullable(), startMs: z.number().int().nullable() })
  .partial()
  .passthrough();
const Export_ExportFaceEventsWSRequest = z
  .object({
    endInterval: z.number().int().nullable(),
    filter: FaceFilter,
    interval: TimeInterval,
    startInterval: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportInventoryWSRequest = z
  .object({
    cameraUuids: z.array(z.string().nullable()).nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportMotionEventsWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    deviceUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportPeopleCountEventsWSRequest = z
  .object({ endInterval: z.number().int().nullable(), startInterval: z.number().int().nullable() })
  .partial()
  .passthrough();
const Export_ExportPeopleEventsWSRequest = z
  .object({ endInterval: z.number().int().nullable(), startInterval: z.number().int().nullable() })
  .partial()
  .passthrough();
const Export_ExportProximityEventsWSRequest = z
  .object({
    createBeforeMs: z.number().int().nullable(),
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    tagUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportProximityLocomotionEventsWSRequest = z
  .object({
    createBeforeMs: z.number().int().nullable(),
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    tagUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportUptimeWSRequest = z
  .object({
    cameraUuids: z.array(z.string().nullable()).nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
    endDateTime: z.string().nullable(),
    granularity: z
      .enum(["NANOSECONDS", "MICROSECONDS", "MILLISECONDS", "SECONDS", "MINUTES", "HOURS", "DAYS"])
      .nullable(),
    startDateTime: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Export_ExportUsersWSRequest = z
  .object({ userUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Vehicle_GetVehicleEventsWSRequest = z
  .object({
    deviceUuidFilter: z.array(z.string().nullable()).nullable(),
    endTimeMs: z.number().int().nullable(),
    licensePlateExactQuery: z.array(z.string().nullable()).nullable(),
    licensePlateFuzzyQuery: z.string().nullable(),
    locationUuidFilter: z.array(z.string().nullable()).nullable(),
    nameQuery: z.array(z.string().nullable()).nullable(),
    startTimeMs: z.number().int().nullable(),
    unnamedQuery: z.boolean().nullable(),
    vehicleLabelQuery: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Face_AddFaceLabelWSRequest = z
  .object({ faceIdentifier: z.string().nullable(), label: z.string().nullable() })
  .partial()
  .passthrough();
const Face_AddFaceLabelWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Face_DisassociateFaceEventsWSRequest = z
  .object({
    faceEventUuids: z.array(z.string().nullable()).nullable(),
    newFaceEventName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_DisassociateFaceEventsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_GetFaceWSRequest = z.object({ faceId: z.string().nullable() }).partial().passthrough();
const FaceType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    faceId: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    thumbnailS3Key: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_GetFaceWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable(), face: FaceType })
  .partial()
  .passthrough();
const Face_GetFaceLabelsForOrgWSRequest = z.object({}).partial().passthrough();
const Face_GetFaceLabelsForOrgWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceLabels: z.record(z.array(z.string().nullable()).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Face_GetFacesForNameWSRequest = z
  .object({ faceName: z.string().nullable(), orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Face_GetFacesForNameWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faces: z.array(FaceType).nullable(),
  })
  .partial()
  .passthrough();
const Face_GetFacesWSRequest = z
  .object({
    paginate: z.boolean().nullable(),
    paginationKey: z.string().nullable(),
    startWithName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_GetFacesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faces: z.array(FaceType).nullable(),
    paginationKey: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsWSRequest_Filter = z
  .object({
    detectionTypes: z.array(z.enum(["COUNTING", "RECOGNITION"]).nullable()).nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
    labels: z.array(z.string().nullable()).nullable(),
    types: z.array(z.enum(["named", "other"]).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsWSRequest_Interval = z
  .object({ end: z.number().int().nullable(), start: z.number().int().nullable() })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsByLocationWSRequest = z
  .object({
    exclusiveStartKey: z.number().int().nullable(),
    filter: Face_GetRecentFaceEventsWSRequest_Filter,
    interval: Face_GetRecentFaceEventsWSRequest_Interval,
    locationUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const FaceEventType = z
  .object({
    alternativeFaceIds: z.array(z.string().nullable()).nullable(),
    detectionType: z.enum(["COUNTING", "RECOGNITION"]).nullable(),
    deviceLabels: z.array(z.string().nullable()).nullable(),
    deviceUuid: z.string().nullable(),
    eventTimestamp: z.number().int().nullable(),
    faceId: z.string().nullable(),
    faceName: z.string().nullable(),
    imageS3Key: z.string().nullable(),
    indexed: z.boolean().nullable(),
    locationLabels: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    pitch: z.number().nullable(),
    roll: z.number().nullable(),
    thumbnailS3Key: z.string().nullable(),
    uuid: z.string().nullable(),
    yaw: z.number().nullable(),
  })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsByLocationWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceEvents: z.array(FaceEventType).nullable(),
  })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsForFaceWSRequest = z
  .object({
    afterMs: z.number().int().nullable(),
    beforeMs: z.number().int().nullable(),
    faceId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsForFaceWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceEvents: z.array(FaceEventType).nullable(),
  })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsForNameWSRequest = z
  .object({
    afterMs: z.number().int().nullable(),
    beforeMs: z.number().int().nullable(),
    faceName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsForNameWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceEvents: z.array(FaceEventType).nullable(),
  })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsWSRequest = z
  .object({
    exclusiveStartKey: z.number().int().nullable(),
    filter: Face_GetRecentFaceEventsWSRequest_Filter,
    interval: Face_GetRecentFaceEventsWSRequest_Interval,
  })
  .partial()
  .passthrough();
const Face_GetRecentFaceEventsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceEvents: z.array(FaceEventType).nullable(),
  })
  .partial()
  .passthrough();
const Face_GetUploadedFacesWSRequest = z.object({}).partial().passthrough();
const UploadFaceMetadataType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    errorMsg: z.string().nullable(),
    faceId: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    origS3Key: z.string().nullable(),
    success: z.boolean().nullable(),
    thumbnailKey: z.string().nullable(),
    transactionId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_GetUploadedFacesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    uploadedFaces: z.array(UploadFaceMetadataType).nullable(),
  })
  .partial()
  .passthrough();
const Face_GetUploadedFacesByTransactionIdWSRequest = z
  .object({ transactionId: z.string().nullable() })
  .partial()
  .passthrough();
const Face_RemoveFaceLabelWSRequest = z
  .object({ faceIdentifier: z.string().nullable(), label: z.string().nullable() })
  .partial()
  .passthrough();
const Face_RemoveFaceLabelWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Face_ReportFaceEventWSRequest = z
  .object({ eventUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Face_ReportFaceEventWSResponse = z
  .object({
    collectedMediaForTraining: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_UpdateFaceWSRequest_FaceUpdate = z
  .object({
    faceIds: z.array(z.string().nullable()).nullable(),
    name: z.string().nullable(),
    thumbnailS3Key: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Face_UpdateFaceWSRequest = z
  .object({ faceUpdates: z.array(Face_UpdateFaceWSRequest_FaceUpdate).nullable() })
  .partial()
  .passthrough();
const Face_UpdateFaceWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Feature_GetDeviceEventTypesWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Feature_GetDeviceEventTypesWSResponse = z
  .object({ eventTypes: z.array(ActivityEnum).nullable() })
  .partial()
  .passthrough();
const Feature_GetDeviceFeaturesWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Feature_DeviceFeaturesType = z
  .object({
    deviceUuid: z.string().nullable(),
    featureMap: z.record(z.boolean().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Feature_GetDeviceFeaturesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    features: Feature_DeviceFeaturesType,
  })
  .partial()
  .passthrough();
const Feature_GetDeviceFeaturesListWSRequest = z
  .object({ deviceUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Feature_GetDeviceFeaturesListWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    featureList: z.array(Feature_DeviceFeaturesType).nullable(),
  })
  .partial()
  .passthrough();
const Feature_GetFeatureCompatabilityMatrixWSRequest = z.object({}).partial().passthrough();
const DeviceFeatureEnum = z.enum([
  "COLOR_SEARCH",
  "FACE_RECOGNITION",
  "LICENSE_PLATE_RECOGNITION",
  "PEOPLE_COUNTING",
  "PPE_DETECTION",
  "UNUSUAL_BEHAVIOR_DETECTION",
  "VEHICLE_COUNTING",
  "CAMERA_ENTERPRISE_CLOUD_ARCHIVING",
  "TIMELAPSE",
  "VISUAL_TAMPER",
  "AUDIO_AI_ANALYTICS",
  "AUDIO_ENTERPRISE_CLOUD_ARCHIVING",
  "BADGE_READER_ENTERPRISE_CLOUD_ARCHIVING",
  "UNKNOWN",
]);
const License = z.enum(["STARTER", "STANDARD", "ENTERPRISE"]);
const FeatureCompatabilityType = z
  .object({
    deviceFeatureEnablement: DeviceFeatureEnum,
    featureName: z.string().nullable(),
    generatedActivities: z.array(ActivityEnum).nullable(),
    hardwareDefaultMap: z.record(z.boolean().nullable()).nullable(),
    requiredLicenses: z.array(License).nullable(),
    supportedHardware: z.array(HardwareVariationEnum).nullable(),
  })
  .partial()
  .passthrough();
const Feature_GetFeatureCompatabilityMatrixWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    featureCompatabilityMatrix: z.array(FeatureCompatabilityType).nullable(),
  })
  .partial()
  .passthrough();
const Feature_UpdateDeviceFeaturesWSRequest = z
  .object({
    deviceUuid: z.string().nullable(),
    featureMap: z.record(z.boolean().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Feature_UpdateDeviceFeaturesWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const GuestActivity = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    checked: z.enum(["CHECKED_IN", "CHECKED_OUT"]).nullable(),
    locationUuid: z.string().nullable(),
    timeMs: z.string().nullable(),
  })
  .partial()
  .passthrough();
const IGuest = z
  .object({
    accessEndTimeMs: z.string().nullable(),
    accessStartTimeMs: z.string().nullable(),
    activityList: z.array(GuestActivity).nullable(),
    address1: z.string().nullable(),
    address2: z.string().nullable(),
    city: z.string().nullable(),
    countryCode: z.string().nullable(),
    crime: z.string().nullable(),
    email: z.string().nullable(),
    faceImage: z.string().nullable(),
    firstName: z.string().nullable(),
    guestType: z.enum(["CONTRACTOR", "INTERVIEWER", "GENERAL_VISITOR", "PARTNER"]).nullable(),
    lastName: z.string().nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    postalCode: z.string().nullable(),
    state: z.string().nullable(),
    status: z.enum(["INVITED", "PENDING", "APPROVED", "DENIED"]).nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateGuestByTokenWSRequest = z
  .object({ fileName: z.string().nullable(), guest: IGuest, token: z.string().nullable() })
  .partial()
  .passthrough();
const BaseApiResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Help_SendFeedbackWSRequest = z
  .object({ feedback: z.string().nullable() })
  .partial()
  .passthrough();
const Help_SendFeedbackWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    failureReason: z.string().nullable(),
    success: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Help_GetOpenTicketsV2WSRequest = z
  .object({ endTimeMs: z.number().int().nullable(), startTimeMs: z.number().int().nullable() })
  .partial()
  .passthrough();
const Help_TicketInformation = z
  .object({
    createdAt: z.string().datetime({ offset: true }).nullable(),
    id: z.number().int().nullable(),
    status: z.string().nullable(),
    subject: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Help_GetOpenTicketsV2WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    tickets: z.array(Help_TicketInformation).nullable(),
  })
  .partial()
  .passthrough();
const Help_ProcessRMAWSRequest = z
  .object({
    deviceName: z.string().nullable(),
    problem: z.string().nullable(),
    returnAddress: z.string().nullable(),
    serialNumber: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Help_ProcessRMAWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    failureReason: z.string().nullable(),
    success: z.boolean().nullable(),
    ticketId: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Help_CreateTicketWSRequest = z
  .object({
    body: z.string().nullable(),
    collaborators: z.array(z.string().nullable()).nullable(),
    consoleAccessGranted: z.boolean().nullable(),
    productType: z.string().nullable(),
    serialNumbers: z.array(z.string().nullable()).nullable(),
    serviceType: z.string().nullable(),
    subject: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Help_CreateTicketWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    failureReason: z.string().nullable(),
    success: z.boolean().nullable(),
    ticketId: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const EnvoyCustomField = z
  .object({ field: z.string().nullable(), value: z.string().nullable() })
  .partial()
  .passthrough();
const EnvoyPersonInfo = z
  .object({
    email: z.string().nullable(),
    id: z.string().nullable(),
    locationIds: z.array(z.string().nullable()).nullable(),
    locations: z.array(z.string().nullable()).nullable(),
    name: z.string().nullable(),
    type: z.string().nullable(),
  })
  .partial()
  .passthrough();
const EnvoyInvite = z
  .object({
    customFields: z.array(EnvoyCustomField).nullable(),
    expectedArrivalAt: z.string().nullable(),
    expectedDepartureAt: z.string().nullable(),
    flowId: z.string().nullable(),
    hostEmployeeId: z.string().nullable(),
    inviteId: z.string().nullable(),
    invitee: EnvoyPersonInfo,
    locationId: z.string().nullable(),
    notes: z.string().nullable(),
    sendEmailToInvitee: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Integration_CreateEnvoyInviteWSRequest = z
  .object({ invitation: EnvoyInvite })
  .partial()
  .passthrough();
const Integration_BaseIntegrationWSRequest = z.object({}).partial().passthrough();
const Integration_UpdateOrgIntegrationsWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GuestWSRequest = z
  .object({
    email: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetAllGuestsWSResponse = z
  .object({
    allGuests: z.array(IGuest).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetAmtReadersWSRequest = z
  .object({ email: z.string().nullable(), password: z.string().nullable() })
  .partial()
  .passthrough();
const DoorType = z
  .object({ id: z.number().int().nullable(), name: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetBadgeIntegrationDoorsWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    doors: z.array(DoorType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetApiTokenApplicationsWSRequest = z.object({}).partial().passthrough();
const ApiTokenAuthTypeEnum = z.enum(["API_TOKEN", "CERT"]);
const ApiClientTypeEnum = z.enum([
  "PARTNER_DEVELOPER",
  "DEVELOPER",
  "INTERNAL_SALESFORCE",
  "TVOS",
  "KEYPAD",
  "SQUARE",
  "KISI",
  "OPENPATH",
  "TOAST",
  "BRIVO",
  "EXECUTABLE",
  "HALO",
  "SALTO",
  "BUTTERFLYMX",
  "GENEA",
  "PRODATAKEY",
  "ENVOY",
  "AMT",
  "PLACEOS",
  "OMNIALERT",
  "UNKNOWN",
]);
const ApiTokenApplicationType = z
  .object({
    authType: ApiTokenAuthTypeEnum,
    authenticationTokenHash: z.string().nullable(),
    clientDetails: z.record(z.string().nullable()).nullable(),
    clientType: ApiClientTypeEnum,
    csr: z.string().nullable(),
    displayName: z.string().nullable(),
    orgUuid: z.string().nullable(),
    permissionGroupUuid: z.string().nullable(),
    tokenUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetApiTokenApplicationsWSResponse = z
  .object({
    applications: z.array(ApiTokenApplicationType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetApiTokensWSRequest = z
  .object({ optionalFilter: z.array(ApiClientTypeEnum).nullable() })
  .partial()
  .passthrough();
const ApiTokenType = z
  .object({
    authType: ApiTokenAuthTypeEnum,
    authenticationTokenHash: z.string().nullable(),
    cert: z.string().nullable(),
    certFingerprint: z.string().nullable(),
    clientDetails: z.record(z.string().nullable()).nullable(),
    clientType: ApiClientTypeEnum,
    csr: z.string().nullable(),
    displayName: z.string().nullable(),
    orgUuid: z.string().nullable(),
    permissionGroupUuid: z.string().nullable(),
    tokenUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetApiTokensWSResponse = z
  .object({
    apiTokens: z.array(ApiTokenType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetBrivoDoorsWSRequest = z
  .object({ password: z.string().nullable(), username: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetBrivoDoorsWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    doors: z.array(DoorType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetButterflymxPanelsWSRequest = z
  .object({ email: z.string().nullable(), password: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_ButterflymxBuilding = z
  .object({
    id: z.number().int().nullable(),
    name: z.string().nullable(),
    panels: z.array(DoorType).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetButterflymxPanelsWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    buildings: z.array(Integration_ButterflymxBuilding).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const IntegrationAuditEventEnum = z.enum(["UPDATE", "DELETE"]);
const IntegrationAuditEvent = z
  .object({
    enabledTimestampMs: z.number().int().nullable(),
    integrationAuditEvent: IntegrationAuditEventEnum,
    user: z.string().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const IBaseIntegrationType = z
  .object({
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetOrgIntegrationsV2WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    orgIntegrationV2: IBaseIntegrationType,
  })
  .partial()
  .passthrough();
const Integration_GetGeneaDoorsWSRequest = z
  .object({ apiToken: z.string().nullable() })
  .partial()
  .passthrough();
const PanelType = z
  .object({ id: z.string().nullable(), name: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetGeneaDoorsWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    panelList: z.array(PanelType).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetGuestWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable(), guest: IGuest })
  .partial()
  .passthrough();
const InformacastMessageTemplate = z
  .object({
    bodyCustomizable: z.boolean().nullable(),
    id: z.string().nullable(),
    name: z.string().nullable(),
    subject: z.string().nullable(),
    subjectCustomizable: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetInformacastMessageTemplatesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    templates: z.array(InformacastMessageTemplate).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetKisiDoorsWSRequest = z
  .object({ apiSecretKey: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetKisiDoorsWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    placeToDoorMap: z.record(z.array(DoorType).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetKisiPlacesWSRequest = z
  .object({ apiSecretKey: z.string().nullable() })
  .partial()
  .passthrough();
const PlaceType = z
  .object({ id: z.number().int().nullable(), name: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetBadgeIntegrationPlacesWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    places: z.array(PlaceType).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetMicrosoftUsersJoinedTeamsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    teamsMap: z.record(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetOpenAIModelsWSRequest = z.object({}).partial().passthrough();
const OpenAIModel = z
  .object({
    created: z.string().nullable(),
    id: z.string().nullable(),
    object: z.string().nullable(),
    ownedBy: z.string().nullable(),
    owned_by: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetOpenAIModelsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    models: z.array(OpenAIModel).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetOpenpathDoorsWSRequest = z
  .object({ email: z.string().nullable(), password: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetOpentechAllianceFacilitiesWSRequest = z.object({}).partial().passthrough();
const OpentechAllianceActionGroupType = z
  .object({
    actionGroupId: z.string().nullable(),
    deviceId: z.string().nullable(),
    locationName: z.string().nullable(),
    name: z.string().nullable(),
  })
  .partial()
  .passthrough();
const OpentechAllianceFacilityType = z
  .object({
    actionGroups: z.array(OpentechAllianceActionGroupType).nullable(),
    deviceList: z.array(DoorType).nullable(),
    id: z.string().nullable(),
    name: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetOpentechAllianceFacilitiesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    facilities: z.array(OpentechAllianceFacilityType).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetOrgIntegrationsWSRequest = z.object({}).partial().passthrough();
const BadgeIntegrationDoorInfoType = z
  .object({
    assignedCameraList: z.array(z.string().nullable()).nullable(),
    doorName: z.string().nullable(),
    remoteUnlock: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const AmtSettings = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(BadgeIntegrationDoorInfoType).nullable(),
    email: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    password: z.string().nullable(),
    rhombusToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    webhookId: z.number().int().nullable(),
    webhookSignatureSecret: z.string().nullable(),
  })
  .partial()
  .passthrough();
const AwsSettings = z
  .object({
    accessKey: z.string().nullable(),
    bucketName: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    secretKey: z.string().nullable(),
  })
  .partial()
  .passthrough();
const BackblazeSettings = z
  .object({
    applicationKey: z.string().nullable(),
    applicationKeyId: z.string().nullable(),
    bucketName: z.string().nullable(),
    enabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const BoxSettings = z
  .object({
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    enterpriseId: z.string().nullable(),
    folderId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const BrivoSettings = z
  .object({
    accessToken: z.string().nullable(),
    alertUnauthorizedFaces: z.boolean().nullable(),
    clientId: z.string().nullable(),
    clientSecret: z.string().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(BadgeIntegrationDoorInfoType).nullable(),
    doorToCameraMap: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    password: z.string().nullable(),
    refreshToken: z.string().nullable(),
    rhombusToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    username: z.string().nullable(),
    webhookId: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const ButterflymxPanelInfoType = z
  .object({
    assignedCameraList: z.array(z.string().nullable()).nullable(),
    buildingId: z.number().int().nullable(),
    panelName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ButterflyMXSettings = z
  .object({
    buildingWebhookIdMap: z.record(z.string().nullable()).nullable(),
    createSeekPoints: z.boolean().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    indexFaces: z.boolean().nullable(),
    panelInfoMap: z.record(ButterflymxPanelInfoType).nullable(),
    refreshToken: z.string().nullable(),
    rhombusToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const DiceSettings = z
  .object({
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const DropboxSettingsV2 = z
  .object({
    accessToken: z.string().nullable(),
    accountEmail: z.string().nullable(),
    accountName: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const EmailSettings = z
  .object({
    emailAddresses: z.array(z.string().nullable()).nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const EnvoyLocationInfoType = z
  .object({
    assignedCameraList: z.array(z.string().nullable()).nullable(),
    locationName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const EnvoySettings = z
  .object({
    createSeekPoints: z.boolean().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    envoyIntegrationInstalled: z.boolean().nullable(),
    indexFaces: z.boolean().nullable(),
    locationInfoMap: z.record(EnvoyLocationInfoType).nullable(),
    refreshToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const GeneaSettings = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    apiToken: z.string().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(BadgeIntegrationDoorInfoType).nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    rhombusToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    webhookSignatureSecret: z.string().nullable(),
    webhookUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const GoogleSettings = z
  .object({
    accountUser: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    folderId: z.string().nullable(),
    teamDriveId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const GoogleSettingsV2 = z
  .object({
    defaultAlertFolderId: z.string().nullable(),
    defaultAlertFolderName: z.string().nullable(),
    defaultFolderId: z.string().nullable(),
    defaultFolderName: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    refreshToken: z.string().nullable(),
    saveAllAlerts: z.boolean().nullable(),
    saveClips: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const HaloSettings = z
  .object({
    alertAgression: z.boolean().nullable(),
    alertCO: z.boolean().nullable(),
    alertCO2: z.boolean().nullable(),
    alertGunshot: z.boolean().nullable(),
    alertHelp: z.boolean().nullable(),
    alertMasking: z.boolean().nullable(),
    alertTHC: z.boolean().nullable(),
    alertTamper: z.boolean().nullable(),
    alertTemp: z.boolean().nullable(),
    alertVOC: z.boolean().nullable(),
    alertVape: z.boolean().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    savedClipDurationMs: z.number().int().nullable(),
    sensorToCamerasMap: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    triggerNotification: z.boolean().nullable(),
    url: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ImmixSettings = z
  .object({
    deviceList: z.array(z.string().nullable()).nullable(),
    enabled: z.boolean().nullable(),
    serverUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const TriggerContent = z
  .object({
    apiKey: z.string().nullable(),
    experienceIds: z.array(z.string().nullable()).nullable(),
    experienceNames: z.array(z.string().nullable()).nullable(),
    message: z.string().nullable(),
    parameter1: z.string().nullable(),
    parameter2: z.string().nullable(),
    parameter3: z.string().nullable(),
    playerDeviceNames: z.array(z.string().nullable()).nullable(),
    playerIds: z.array(z.string().nullable()).nullable(),
    playerTags: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const IntuifaceSettings = z
  .object({
    deviceToTriggerMap: z.record(TriggerContent).nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const BadgeIntegrationSettings = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(BadgeIntegrationDoorInfoType).nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    placeId: z.number().int().nullable(),
    rhombusToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    webhookId: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const KisiSettings = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    apiSecretKey: z.string().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(BadgeIntegrationDoorInfoType).nullable(),
    doorToCameraMap: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    placeId: z.number().int().nullable(),
    placeToSettingsMap: z.record(BadgeIntegrationSettings).nullable(),
    rhombusToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    webhookId: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const LumeoSettings = z
  .object({
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const MattermostSettings = z
  .object({
    channel: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    webhookUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const MicrosoftTeamsSettings = z
  .object({
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    webhookUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const EmergencyResponseContactsIntervalType = z
  .object({
    emergencyContactList: z.array(EmergencyContact).nullable(),
    minuteOfWeekStart: z.number().int().nullable(),
    minuteOfWeekStop: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const AlertMonitoringSubmissionDelayIntervalType = z
  .object({
    escalationDelayMinutes: z.number().int().nullable(),
    minuteOfWeekStart: z.number().int().nullable(),
    minuteOfWeekStop: z.number().int().nullable(),
    promptTheme: NoonlightPromptTheme,
  })
  .partial()
  .passthrough();
const NoonlightSettings = z
  .object({
    acceptedTermsOfService: z.boolean().nullable(),
    defaultContactsByLocationMap: z.record(EmergencyContact).nullable(),
    defaultDelayByLocationsMap: z.record(z.number().int().nullable()).nullable(),
    defaultPromptByLocationsMap: z.record(NoonlightPromptTheme).nullable(),
    emergencyContactsByLocationsMap: z
      .record(z.array(EmergencyResponseContactsIntervalType).nullable())
      .nullable(),
    enabled: z.boolean().nullable(),
    escalationSettingsByLocationsMap: z
      .record(z.array(AlertMonitoringSubmissionDelayIntervalType).nullable())
      .nullable(),
    locationEntryInstructionsMap: z.record(z.string().nullable()).nullable(),
    pinsByLocationMap: z.record(z.array(AlertMonitoringPinType).nullable()).nullable(),
    verificationPrompt: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Office365Settings = z
  .object({
    driveId: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    tenantId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const WebhookMapEntry = z
  .object({ orgId: z.number().int().nullable(), webhookId: z.number().int().nullable() })
  .partial()
  .passthrough();
const OpenpathSettings = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(BadgeIntegrationDoorInfoType).nullable(),
    doorToCameraMap: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    email: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    eventToWebhookIdMap: z.record(z.number().int().nullable()).nullable(),
    eventToWebhookMap: z.record(WebhookMapEntry).nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    password: z.string().nullable(),
    rhombusToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    webhookId: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const OpentechAllianceDoorInfoType = z
  .object({
    actionGroupId: z.string().nullable(),
    assignedCameraList: z.array(z.string().nullable()).nullable(),
    doorName: z.string().nullable(),
    remoteUnlock: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const OpentechAllianceFacilitySettings = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(OpentechAllianceDoorInfoType).nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    saveClips: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const OpentechAllianceSettings = z
  .object({
    apiKey: z.string().nullable(),
    apiSecret: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    facilityToSettingsMap: z.record(OpentechAllianceFacilitySettings).nullable(),
  })
  .partial()
  .passthrough();
const PagerDutySettings = z
  .object({
    allLocationIntegrationKeys: z.array(z.string().nullable()).nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    integrationKey: z.string().nullable(),
    locationToIntegrationKeysMap: z.record(z.array(z.string().nullable()).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const PlaceOsSettings = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    apiUrl: z.string().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(BadgeIntegrationDoorInfoType).nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    rhombusToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    webhookSignatureSecret: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ProDataKeySettings = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(BadgeIntegrationDoorInfoType).nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    ouId: z.string().nullable(),
    rhombusToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    webhookId: z.string().nullable(),
    webhookSignatureSecret: z.string().nullable(),
  })
  .partial()
  .passthrough();
const SaltoSettings = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    createSeekPoints: z.boolean().nullable(),
    enabled: z.boolean().nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    saveClips: z.boolean().nullable(),
    tokenToCamerasMap: z.record(z.array(z.string().nullable()).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const ServiceNowSettings = z
  .object({
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    instanceUrl: z.string().nullable(),
    password: z.string().nullable(),
    username: z.string().nullable(),
  })
  .partial()
  .passthrough();
const SlackSettings = z
  .object({
    accessToken: z.string().nullable(),
    channel: z.string().nullable(),
    enabled: z.boolean().nullable(),
    webhookUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const UserInfo = z
  .object({ userAccessToken: z.string().nullable(), userId: z.string().nullable() })
  .partial()
  .passthrough();
const SlackSettingsV2 = z
  .object({
    channelId: z.string().nullable(),
    channelName: z.string().nullable(),
    code: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    orgAccessToken: z.string().nullable(),
    sendChannelNotifications: z.boolean().nullable(),
    sendUserNotifications: z.boolean().nullable(),
    userMap: z.record(UserInfo).nullable(),
    webhookUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const SquareSettings = z
  .object({
    enabled: z.boolean().nullable(),
    locationIdToDeviceUuidsMap: z.record(z.array(z.string().nullable()).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const PosIntegrationInfoType = z
  .object({
    assignedCameraList: z.array(z.string().nullable()).nullable(),
    posName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ToastRestaurantInfo = z
  .object({ locationName: z.string().nullable(), restaurantName: z.string().nullable() })
  .partial()
  .passthrough();
const ToastSettings = z
  .object({
    currentToastRestaurantGuid: z.string().nullable(),
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    posInfoMap: z.record(PosIntegrationInfoType).nullable(),
    toastRestaurantInfoMap: z.record(ToastRestaurantInfo).nullable(),
  })
  .partial()
  .passthrough();
const TPLinkSettings = z
  .object({
    cameraToSwitchMap: z.record(z.string().nullable()).nullable(),
    enabled: z.boolean().nullable(),
    password: z.string().nullable(),
    targetState: z.number().int().nullable(),
    url: z.string().nullable(),
    username: z.string().nullable(),
  })
  .partial()
  .passthrough();
const TwilioSettings = z
  .object({
    enabled: z.boolean().nullable(),
    phoneNumbers: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const WebhookSettings = z
  .object({
    enabled: z.boolean().nullable(),
    enabledTimestampMs: z.number().int().nullable(),
    enablingUser: z.string().nullable(),
    enablingUserUuid: z.string().nullable(),
    webhookSecret: z.string().nullable(),
    webhookUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const OrgIntegrationsType = z
  .object({
    amtSettings: AmtSettings,
    awsSettings: AwsSettings,
    backblazeSettings: BackblazeSettings,
    boxSettings: BoxSettings,
    brivoSettings: BrivoSettings,
    butterflymxSettings: ButterflyMXSettings,
    diceSettings: DiceSettings,
    dropboxSettingsV2: DropboxSettingsV2,
    emailSettings: EmailSettings,
    envoySettings: EnvoySettings,
    geneaSettings: GeneaSettings,
    googleSettings: GoogleSettings,
    googleSettingsV2: GoogleSettingsV2,
    haloSettings: HaloSettings,
    immixSettings: ImmixSettings,
    intuifaceSettings: IntuifaceSettings,
    kisiSettings: KisiSettings,
    lumeoSettings: LumeoSettings,
    mattermostSettings: MattermostSettings,
    microsoftTeamsSettings: MicrosoftTeamsSettings,
    noonlightSettings: NoonlightSettings,
    office365Settings: Office365Settings,
    openpathSettings: OpenpathSettings,
    opentechAllianceSettings: OpentechAllianceSettings,
    orgUuid: z.string().nullable(),
    pagerDutySettings: PagerDutySettings,
    placeOsSettings: PlaceOsSettings,
    proDataKeySettings: ProDataKeySettings,
    saltoSettings: SaltoSettings,
    serviceNowSettings: ServiceNowSettings,
    slackSettings: SlackSettings,
    slackSettingsV2: SlackSettingsV2,
    squareSettings: SquareSettings,
    toastSettings: ToastSettings,
    tpLinkSettings: TPLinkSettings,
    twilioSettings: TwilioSettings,
    webhookSettings: WebhookSettings,
  })
  .partial()
  .passthrough();
const Integration_GetOrgIntegrationsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    orgIntegrations: OrgIntegrationsType,
  })
  .partial()
  .passthrough();
const Integration_GetAllOrgIntegrationsV2WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    orgIntegrationsV2: z.record(IBaseIntegrationType).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetPdkDoorsWSRequest = z
  .object({ ouId: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetPdkDoorsWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    panelList: z.array(PanelType).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetPlaceOsDoorsWSRequest = z
  .object({ apiUrl: z.string().nullable() })
  .partial()
  .passthrough();
const GenericDoorType = z
  .object({ id: z.string().nullable(), name: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetBadgeIntegrationGenericDoorsWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    doors: z.array(GenericDoorType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetToastServiceAreasWSRequest = z.object({}).partial().passthrough();
const GenericPosType = z
  .object({ id: z.string().nullable(), name: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetToastServiceAreasWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    serviceAreas: z.array(GenericPosType).nullable(),
  })
  .partial()
  .passthrough();
const Integration_InitiateOAuthWSRequest = z
  .object({
    param: z.string().nullable(),
    requestUrl: z.string().nullable(),
    rhombusOrgUserUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_InitiateOAuthWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    redirectUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateMicrosoftTeamsBotForTeamWSRequest = z
  .object({ teamId: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_RefreshGoogleAccessTokenWSRequest = z.object({}).partial().passthrough();
const Integration_RefreshGoogleAccessTokenWSResponse = z
  .object({
    accessToken: z.string().nullable(),
    authError: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_RevokeApiTokenWSRequest = z
  .object({ tokenUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_RevokeApiTokenWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_SubmitApiTokenApplicationWSRequest = z
  .object({
    authType: ApiTokenAuthTypeEnum.optional(),
    csr: z.string().nullish(),
    displayName: z.string().nullish(),
    permissionGroupUuid: z.string().nullable(),
  })
  .passthrough();
const Integration_SubmitApiTokenApplicationWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    validCSR: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const ZapierEnum = z.enum([
  "BUTTON_EVENTS",
  "DOOR_SENSOR_EVENTS",
  "ENVIRONMENTAL_SENSOR_EVENTS",
  "RULE_EVENTS",
]);
const Integration_SubscribeZapierWebhookWSRequest = z
  .object({
    backoffSec: z.number().int().nullable(),
    doorState: z.enum(["OPEN", "CLOSED", "AJAR"]).nullable(),
    hookUrl: z.string().nullable(),
    humidityLowerThreshold: z.number().nullable(),
    humidityUpperThreshold: z.number().nullable(),
    tempLowerThreshold: z.number().nullable(),
    tempUpperThreshold: z.number().nullable(),
    uuids: z.array(z.string().nullable()).nullable(),
    zapEnum: ZapierEnum,
  })
  .partial()
  .passthrough();
const Integration_SubscribeZapierWebhookWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    webhookId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_TogglePowerWSRequest = z
  .object({ deviceId: z.string().nullable(), targetState: z.number().int().nullable() })
  .partial()
  .passthrough();
const Integration_TogglePowerWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    newState: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UnlockIntegrationGenericDoorWSRequest = z
  .object({ cameraUuid: z.string().nullable(), doorId: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_UnlockDoorWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_UnlockGeneaDoorWSRequest = z
  .object({ cameraUuid: z.string().nullable(), doorId: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_UnlockKisiDoorWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    doorId: z.number().int().nullable(),
    placeId: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UnlockOpenpathDoorWSRequest = z
  .object({ cameraUuid: z.string().nullable(), doorId: z.number().int().nullable() })
  .partial()
  .passthrough();
const Integration_UnsubscribeZapierWebhookWSRequest = z
  .object({ webhookId: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_UpdateAmtIntegrationWSRequest = z
  .object({ amtSettings: AmtSettings })
  .partial()
  .passthrough();
const Integration_UpdateApiTokenWSRequest = z
  .object({
    newDisplayName: z.string().nullable(),
    newPermissionGroupUuid: z.string().nullable(),
    tokenUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateApiTokenWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_UpdateAwsIntegrationWSRequest = z
  .object({ awsSettings: AwsSettings })
  .partial()
  .passthrough();
const Integration_UpdateBoxIntegrationWSRequest = z
  .object({ boxSettings: BoxSettings })
  .partial()
  .passthrough();
const Integration_UpdateBrivoIntegrationWSRequest = z
  .object({ brivoSettings: BrivoSettings })
  .partial()
  .passthrough();
const Integration_UpdateButterflymxIntegrationWSRequest = z
  .object({ settings: ButterflyMXSettings })
  .partial()
  .passthrough();
const DeviceIntegrationSettings = z
  .object({
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
  })
  .partial()
  .passthrough();
const IDeviceIntegrationType = z
  .object({
    deviceSettingsMap: z.record(DeviceIntegrationSettings).nullable(),
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateDeviceIntegrationWSRequest = z
  .object({
    createNewDevice: z.boolean().nullable(),
    deviceIntegrationSettings: IDeviceIntegrationType,
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    updateDevice: z.boolean().nullable(),
    updateDeviceUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const IDiceType = z
  .object({
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateDiceIntegrationWSRequest = z
  .object({ diceSettings: IDiceType })
  .partial()
  .passthrough();
const Integration_UpdateDropboxIntegrationWSRequest = z
  .object({ dropboxSettings: DropboxSettingsV2 })
  .partial()
  .passthrough();
const Integration_UpdateEmailIntegrationWSRequest = z
  .object({ emailSettings: EmailSettings })
  .partial()
  .passthrough();
const EnvoyUserSettings = z
  .object({ guestsEnabled: z.boolean().nullable(), packagesEnabled: z.boolean().nullable() })
  .partial()
  .passthrough();
const IEnvoyType = z
  .object({
    alertUnauthorizedFaces: z.boolean().nullable(),
    apiToken: z.string().nullable(),
    createSeekPoints: z.boolean().nullable(),
    doorInfoMap: z.record(BadgeIntegrationDoorInfoType).nullable(),
    enabled: z.boolean().nullable(),
    envoyIntegrationInstalled: z.boolean().nullable(),
    envoyUserSettingsMap: z.record(EnvoyUserSettings).nullable(),
    identifyFacesFromBadge: z.boolean().nullable(),
    indexFaces: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    locationInfoMap: z.record(EnvoyLocationInfoType).nullable(),
    orgUuid: z.string().nullable(),
    refreshToken: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    tokenValid: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateEnvoyIntegrationV2WSRequest = z
  .object({ envoySettings: IEnvoyType })
  .partial()
  .passthrough();
const Integration_UpdateGeneaIntegrationWSRequest = z
  .object({ geneaSettings: GeneaSettings })
  .partial()
  .passthrough();
const IGoogleType = z
  .object({
    apiToken: z.string().nullable(),
    defaultAlertFolderId: z.string().nullable(),
    defaultAlertFolderName: z.string().nullable(),
    defaultFolderId: z.string().nullable(),
    defaultFolderName: z.string().nullable(),
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    orgUuid: z.string().nullable(),
    refreshToken: z.string().nullable(),
    saveAllAlerts: z.boolean().nullable(),
    saveClips: z.boolean().nullable(),
    tokenValid: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateGoogleIntegrationV2WSRequest = z
  .object({ googleSettings: IGoogleType })
  .partial()
  .passthrough();
const Integration_UpdateGuestWSRequest = z
  .object({
    fileName: z.string().nullable(),
    guest: IGuest,
    sendGuestEmail: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const LocationSettings = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    printBadge: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const IGuestManagementType = z
  .object({
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    locationSettingsMap: z.record(LocationSettings).nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateGuestManagementIntegrationWSRequest = z
  .object({ guestManagementSettings: IGuestManagementType })
  .partial()
  .passthrough();
const Integration_UpdateHaloIntegrationWSRequest = z
  .object({ haloSettings: HaloSettings })
  .partial()
  .passthrough();
const IInformacastType = z
  .object({
    apiToken: z.string().nullable(),
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    orgUuid: z.string().nullable(),
    refreshToken: z.string().nullable(),
    tokenValid: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateInformacastIntegrationRequest = z
  .object({ informacastSettings: IInformacastType })
  .partial()
  .passthrough();
const Integration_UpdateIntuifaceIntegrationWSRequest = z
  .object({ settings: IntuifaceSettings })
  .partial()
  .passthrough();
const Integration_UpdateKisiIntegrationWSRequest = z
  .object({ kisiSettings: KisiSettings })
  .partial()
  .passthrough();
const ILumeoType = z
  .object({
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateLumeoIntegrationWSRequest = z
  .object({ lumeoSettings: ILumeoType })
  .partial()
  .passthrough();
const Integration_UpdateMattermostIntegrationWSRequest = z
  .object({ mattermostSettings: MattermostSettings })
  .partial()
  .passthrough();
const MicrosoftTeamsChannelSettings = z
  .object({
    botInstallationId: z.string().nullable(),
    channelId: z.string().nullable(),
    installingUserUuid: z.string().nullable(),
    sendChannelNotifications: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const MicrosoftTeamsUserSettings = z
  .object({
    botInstallationId: z.string().nullable(),
    chatId: z.string().nullable(),
    refreshToken: z.string().nullable(),
    sendUserNotifications: z.boolean().nullable(),
    teamIds: z.array(z.string().nullable()).nullable(),
    userId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const IMicrosoftTeamsType = z
  .object({
    adminConsent: z.boolean().nullable(),
    allowUserNotifications: z.boolean().nullable(),
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    microsoftTeamSettingsMap: z.record(MicrosoftTeamsChannelSettings).nullable(),
    microsoftTeamsUserSettingsMap: z.record(MicrosoftTeamsUserSettings).nullable(),
    orgUuid: z.string().nullable(),
    tenantId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateMicrosoftTeamsIntegrationV2WSRequest = z
  .object({
    microsoftTeamsSettings: IMicrosoftTeamsType,
    teamsToUpdate: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateOffice365IntegrationWSRequest = z
  .object({ office365Settings: Office365Settings })
  .partial()
  .passthrough();
const IOmnialertType = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    orgUuid: z.string().nullable(),
    saveClips: z.boolean().nullable(),
    triggerNotification: z.boolean().nullable(),
    webhookToken: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateOmnialertIntegrationWSRequest = z
  .object({ omnialertSettings: IOmnialertType })
  .partial()
  .passthrough();
const Integration_UpdateOmnialertIntegrationWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    webhookToken: z.string().nullable(),
  })
  .partial()
  .passthrough();
const IOpenAIType = z
  .object({
    apiToken: z.string().nullable(),
    enabled: z.boolean().nullable(),
    integration: IntegrationEnum,
    integrationAuditMap: z.record(IntegrationAuditEvent).nullable(),
    orgUuid: z.string().nullable(),
    refreshToken: z.string().nullable(),
    tokenValid: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateOpenAIIntegrationRequest = z
  .object({ openAISettings: IOpenAIType })
  .partial()
  .passthrough();
const Integration_UpdateOpenpathIntegrationWSRequest = z
  .object({ openpathSettings: OpenpathSettings })
  .partial()
  .passthrough();
const Integration_UpdateOpentechAllianceIntegrationWSRequest = z
  .object({ opentechAllianceSettings: OpentechAllianceSettings })
  .partial()
  .passthrough();
const Integration_UpdatePagerDutyIntegrationWSRequest = z
  .object({ pagerDutySettings: PagerDutySettings })
  .partial()
  .passthrough();
const Integration_UpdatePdkIntegrationWSRequest = z
  .object({ pdkSettings: ProDataKeySettings })
  .partial()
  .passthrough();
const Integration_UpdatePlaceOsSettingsWSRequest = z
  .object({ placeOsSettings: PlaceOsSettings })
  .partial()
  .passthrough();
const Integration_UpdateSaltoIntegrationWSRequest = z
  .object({ saltoSettings: SaltoSettings })
  .partial()
  .passthrough();
const OrgSamlSettingsType = z
  .object({
    addUsersOnRoleMismatch: z.boolean().nullable(),
    enabled: z.boolean().nullable(),
    enabledForRhombusKey: z.boolean().nullable(),
    idpMetaDataXml: z.string().nullable(),
    justInTimeAccountProvisioningEnabled: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    registrationUuid: z.string().nullable(),
    rhombusKeyAppSettings: RhombusKeyAppSettingsType,
    teamName: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateSamlIntegrationWSRequest = z
  .object({ samlSettings: OrgSamlSettingsType })
  .partial()
  .passthrough();
const Integration_UpdateServiceNowIntegrationWSRequest = z
  .object({ serviceNowSettings: ServiceNowSettings })
  .partial()
  .passthrough();
const Integration_UpdateSlackIntegrationWSRequest = z
  .object({ slackSettings: SlackSettings })
  .partial()
  .passthrough();
const Integration_UpdateSlackIntegrationV2WSRequest = z
  .object({
    adminRequest: z.boolean().nullable(),
    requestUrl: z.string().nullable(),
    revokeUserAccessToken: z.boolean().nullable(),
    rhombusOrgUserUuid: z.string().nullable(),
    slackSettingsV2: SlackSettingsV2,
    userAssociate: z.boolean().nullable(),
    userRequest: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateSquareIntegrationWSRequest = z
  .object({ squareSettings: SquareSettings })
  .partial()
  .passthrough();
const Integration_UpdateToastIntegrationWSRequest = z
  .object({ toastSettings: ToastSettings })
  .partial()
  .passthrough();
const Integration_UpdateWebhookIntegrationWSRequest = z
  .object({ webhookSettings: WebhookSettings })
  .partial()
  .passthrough();
const Integration_UpdateWebhookIntegrationV2WSRequest = z
  .object({
    createWebhook: z.boolean().nullable(),
    deleteWebhook: z.boolean().nullable(),
    isDiagnostic: z.boolean().nullable(),
    webhookUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_UpdateWebhookIntegrationV2WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    webhookSecret: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_ValidateKisiApiKeyWSRequest = z
  .object({ apiKey: z.string().nullable() })
  .partial()
  .passthrough();
const Internal_AddPartnerAsSuperAdminWSRequest = z
  .object({
    orgUuid: z.string().nullable(),
    partnerEmail: z.string().nullable(),
    partnerName: z.string().nullable(),
    partnerUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Internal_AddPartnerAsSuperAdminWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    superAdminGroupUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Internal_CreateOrgWSRequest = z
  .object({
    accountOwnerEmail: z.string().nullable(),
    accountOwnerName: z.string().nullable(),
    companyName: z.string().nullable(),
    salesforceId: z.string().nullable(),
    sendWelcomeEmail: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Internal_CreateOrgWSResponse = z
  .object({ orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Internal_CreatePartnerOrgWSRequest = z
  .object({
    accountOwnerEmail: z.string().nullable(),
    accountOwnerName: z.string().nullable(),
    companyName: z.string().nullable(),
    sendWelcomeEmail: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Internal_CreatePartnerOrgWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const SupportAuthorityType = z
  .object({
    authorityType: z.enum(["PARTNER_SUPPORT", "RHOMBUS_SUPPORT"]).nullable(),
    authorityUuid: z.string().nullable(),
    createdAtMillis: z.number().int().nullable(),
    description: z.string().nullable(),
    expirationTimestamp: z.number().int().nullable(),
    grantedByUsername: z.string().nullable(),
    grantedToEmail: z.string().nullable(),
    grantedToInternalEntityUuid: z.string().nullable(),
    grantedToName: z.string().nullable(),
    loginAccessAllowed: z.boolean().nullable(),
    managedByMsp: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    permissionGroupUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Internal_CreateSupportAuthorityWSRequest = z
  .object({ supportAuthority: SupportAuthorityType })
  .partial()
  .passthrough();
const Internal_CreateSupportAuthorityWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    supportAuthorityUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Internal_GetSuperAdminGroupUUIDWSRequest = z
  .object({ orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Internal_GetSuperAdminGroupUUIDWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    superAdminGroupUUID: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Consignee = z
  .object({
    address1: z.string().nullable(),
    address2: z.string().nullable(),
    address3: z.string().nullable(),
    city: z.string().nullable(),
    companyName: z.string().nullable(),
    contactName: z.string().nullable(),
    country: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    postalCode: z.string().nullable(),
    state: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Freight = z
  .object({ warehouse: z.enum(["AIT", "INVENTORY_RESERVATIONS"]).nullable() })
  .partial()
  .passthrough();
const Product = z
  .object({ productId: z.string().nullable(), quantity: z.number().int().nullable() })
  .partial()
  .passthrough();
const Shipment = z
  .object({
    notes: z.array(z.string().nullable()).nullable(),
    serviceLevel: z
      .enum([
        "NEXT_DAY",
        "SECOND_DAY",
        "THREE_DAY",
        "FOUR_DAY",
        "GROUND",
        "LOCAL",
        "NEXT_DAY_MORNING",
        "WAREHOUSE",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const Shipper = z
  .object({
    address1: z.string().nullable(),
    address2: z.string().nullable(),
    address3: z.string().nullable(),
    city: z.string().nullable(),
    companyName: z.string().nullable(),
    contactName: z.string().nullable(),
    country: z.string().nullable(),
    postalCode: z.string().nullable(),
    referenceId: z.string().nullable(),
    state: z.string().nullable(),
  })
  .partial()
  .passthrough();
const OutgoingShipmentInfoType = z
  .object({
    consignee: Consignee,
    freight: Freight,
    product: z.array(Product).nullable(),
    shipment: Shipment,
    shipper: Shipper,
  })
  .partial()
  .passthrough();
const Internal_InitiateShipmentWSRequest = z
  .object({ shipmentInfo: OutgoingShipmentInfoType })
  .partial()
  .passthrough();
const Internal_InitiateShipmentWSResponse = z
  .object({ trackingIdentifier: z.string().nullable() })
  .partial()
  .passthrough();
const Internal_ListOrgsWSRequest = z.object({}).partial().passthrough();
const FirmwareUpdateIntervalType = z
  .object({
    minuteOfWeekStart: z.number().int().nullable(),
    minuteOfWeekStop: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const FirmwareUpdateSettingsType = z
  .object({
    intervalsV2: z.array(FirmwareUpdateIntervalType).nullable(),
    mode: z.enum(["MANUAL", "SCHEDULED"]).nullable(),
  })
  .partial()
  .passthrough();
const UAPSettingsType = z
  .object({ enabled: z.boolean().nullable(), text: z.string().nullable() })
  .partial()
  .passthrough();
const OrgV2Type = z
  .object({
    accountBillingContactEmail: z.string().nullable(),
    accountOwnerEmail: z.string().nullable(),
    accountTechnicalContactEmail: z.string().nullable(),
    accountTechnicalContacts: z.array(z.string().nullable()).nullable(),
    address1: z.string().nullable(),
    address2: z.string().nullable(),
    audioRecordingEnabled: z.boolean().nullable(),
    companyLogoUrl: z.string().nullable(),
    countryCode: z.string().nullable(),
    createdAtMillis: z.number().int().nullable(),
    criticalStatusEnabled: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    firmwareUpdateSettings: FirmwareUpdateSettingsType.nullable(),
    inactivityTimeout: z.number().int().nullable(),
    itemizedInvoice: z.boolean().nullable(),
    maxAllowedSegmentMaxBytesMap: z.record(z.number().int().nullable()).nullable(),
    mfaEnabled: z.boolean().nullable(),
    name: z.string().nullable(),
    newCameraFramerateMap: z.record(z.number().int().nullable()).nullable(),
    newCameraResolutionMap: z.record(z.number().int().nullable()).nullable(),
    newCameraSegmentMaxBytesMap: z.record(z.number().int().nullable()).nullable(),
    newCameraVideoTargetQualityMap: z.record(z.number().int().nullable()).nullable(),
    newCameraZeroMotionVideoQualityMap: z.record(z.number().int().nullable()).nullable(),
    notifyForHardwareFailureTickets: z.boolean().nullable(),
    partnerAccessAllowedUntil: z.number().int().nullable(),
    postalCode: z.string().nullable(),
    salesforceAccountId: z.string().nullable(),
    shareAiTrainingMediaWithRhombus: z.boolean().nullable(),
    subscriptionEndDate: z.number().int().nullable(),
    subscriptionStatus: z.enum(["TRIAL", "PAID", "RESELLER", "LOST", "UNKNOWN"]).nullable(),
    subscriptionType: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE", "UNKNOWN"]).nullable(),
    supportAccessAllowedUntil: z.number().int().nullable(),
    type: z.enum(["PARTNER", "CUSTOMER", "UNKNOWN"]).nullable(),
    uapSettings: UAPSettingsType.nullable(),
    uuid: z.string().nullable(),
    v3AuthNumDaysSkip2FAForTrustedDevices: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Internal_ListOrgsWSResponse = z
  .object({ orgs: z.array(OrgV2Type).nullable() })
  .partial()
  .passthrough();
const Invoice_InvoiceChargeWSRequest = z
  .object({ invoiceUuid: z.string().nullable(), sourceToken: z.string().nullable() })
  .partial()
  .passthrough();
const Invoice_InvoiceChargeWSResponse = z
  .object({
    chargeSucceeded: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMessage: z.string().nullable(),
    errorMsg: z.string().nullable(),
    previouslyInitialized: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Invoice_InvoiceDetailsWSRequest = z
  .object({ invoiceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const AddOnLicense = z.enum([
  "CLOUD_ARCHIVING",
  "PERCEPTION",
  "POSE",
  "BEHAVIOR",
  "VEHICLE",
  "PEOPLE",
  "PPE",
  "PEOPLE_ANALYTICS",
  "UNKNOWN",
]);
const PerceptionType = z.enum([
  "PEOPLE_COUNTING",
  "FACE_COUNTING_UNIQUE",
  "FACE_COUNTING_NONUNIQUE",
  "ENGAGMENT_COUNTING",
  "FACE_RECOGNITION",
  "LICENSEPLATE_RECOGNITION",
  "VEHICLE_COUNTING",
  "OCCUPANCY_COUNTING",
  "UNKNOWN",
]);
const AddOnLicenseInvoiceType = z
  .object({
    cloudArchiveDays: z.number().int().nullable(),
    count: z.number().int().nullable(),
    description: z.string().nullable(),
    license: AddOnLicense,
    perceptionTypes: z.array(PerceptionType).nullable(),
    price: z.number().nullable(),
  })
  .partial()
  .passthrough();
const HardwareInvoiceSubItem = z
  .object({
    count: z.number().int().nullable(),
    description: z.string().nullable(),
    price: z.number().nullable(),
  })
  .partial()
  .passthrough();
const LicenseInvoiceSubItem = z
  .object({
    count: z.number().int().nullable(),
    description: z.string().nullable(),
    license: License,
    price: z.number().nullable(),
  })
  .partial()
  .passthrough();
const InvoiceType = z
  .object({
    addOnLicenseInvoices: z.array(AddOnLicenseInvoiceType).nullable(),
    additionalEmails: z.array(z.string().nullable()).nullable(),
    attachCsv: z.boolean().nullable(),
    cameraPurchaseCount: z.number().int().nullable(),
    cameraPurchasePrice: z.number().nullable(),
    clientOrgUuid: z.string().nullable(),
    companyName: z.string().nullable(),
    customerAddress: z.string().nullable(),
    customerEmail: z.string().nullable(),
    customerName: z.string().nullable(),
    date: z.number().int().nullable(),
    domePurchaseCount: z.number().int().nullable(),
    domePurchasePrice: z.number().nullable(),
    domeSubItems: z.array(HardwareInvoiceSubItem).nullable(),
    dueDate: z.number().int().nullable(),
    externalId: z.string().nullable(),
    installationPrice: z.number().nullable(),
    license: License,
    licenseCount: z.number().int().nullable(),
    licensePrice: z.number().nullable(),
    licenseSubItems: z.array(LicenseInvoiceSubItem).nullable(),
    notes: z.string().nullable(),
    partnerOrgUuid: z.string().nullable(),
    r1Camera1024: z.array(HardwareInvoiceSubItem).nullable(),
    r1Camera512: z.array(HardwareInvoiceSubItem).nullable(),
    r1CameraPurchaseCount: z.number().int().nullable(),
    r1CameraPurchasePrice: z.number().nullable(),
    r1CameraSubItems: z.array(HardwareInvoiceSubItem).nullable(),
    r1LargeCameraPurchaseCount: z.number().int().nullable(),
    r1LargeCameraPurchasePrice: z.number().nullable(),
    r1LargeSubItems: z.array(HardwareInvoiceSubItem).nullable(),
    r1MediumSubItems: z.array(HardwareInvoiceSubItem).nullable(),
    salespersonName: z.string().nullable(),
    shippingPrice: z.number().nullable(),
    status: z.enum(["PAID", "UNPAID_PENDING", "UNPAID_OVERDUE", "CANCELLED"]).nullable(),
    tax: z.number().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Invoice_InvoiceDetailsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable(), invoice: InvoiceType })
  .partial()
  .passthrough();
const Invoice_InvoiceV1LineItemType = z
  .object({
    description: z.string().nullable(),
    family: z.string().nullable(),
    name: z.string().nullable(),
    productCode: z.string().nullable(),
    quantity: z.number().nullable(),
    subtotal: z.number().nullable(),
    unitPrice: z.number().nullable(),
  })
  .partial()
  .passthrough();
const Invoice_InvoiceV1Type = z
  .object({
    billingContactEmail: z.string().nullable(),
    billingContactMailingCity: z.string().nullable(),
    billingContactMailingCountry: z.string().nullable(),
    billingContactMailingPostalCode: z.string().nullable(),
    billingContactMailingState: z.string().nullable(),
    billingContactMailingStreet: z.string().nullable(),
    billingContactName: z.string().nullable(),
    companyName: z.string().nullable(),
    dueDate: z.string().nullable(),
    grandTotal: z.number().nullable(),
    invoiceDate: z.string().nullable(),
    invoiceNumber: z.string().nullable(),
    lineItems: z.array(Invoice_InvoiceV1LineItemType).nullable(),
    notes: z.string().nullable(),
    partnerBillingCity: z.string().nullable(),
    partnerBillingCountry: z.string().nullable(),
    partnerBillingPostalCode: z.string().nullable(),
    partnerBillingState: z.string().nullable(),
    partnerBillingStreet: z.string().nullable(),
    partnerName: z.string().nullable(),
    salespersonName: z.string().nullable(),
    shipping: z.number().nullable(),
    status: z.string().nullable(),
    subtotal: z.number().nullable(),
    tax: z.number().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Invoice_InvoiceDetailsV1WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    invoice: Invoice_InvoiceV1Type,
  })
  .partial()
  .passthrough();
const License_AssignDeviceLicenseWSRequest = z
  .object({ deviceUuid: z.string().nullable(), licenseUuid: z.string().nullable() })
  .partial()
  .passthrough();
const License_AssignDeviceLicenseWSResponse = z
  .object({ error: z.string().nullable(), success: z.boolean().nullable() })
  .partial()
  .passthrough();
const License_AssignLicenseWSRequest = z
  .object({ deviceUuid: z.string().nullable(), licenseUuid: z.string().nullable() })
  .partial()
  .passthrough();
const License_AssignLicenseWSResponse = z
  .object({ error: z.string().nullable(), success: z.boolean().nullable() })
  .partial()
  .passthrough();
const License_CreateACUDoorLicenseWSRequest = z
  .object({ expiresInDays: z.number().int().nullable(), orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const License_CreateACUDoorLicenseWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const License_CreateAlertMonitoringLicenseWSRequest = z
  .object({
    allowedDeviceCount: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_CreateAlertMonitoringLicenseWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const License_CreateDeviceLicenseWSRequest = z
  .object({ deviceType: DeviceTypeEnum, licenseType: License, orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const License_CreateDeviceLicenseWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    licenseUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_CreateLicenseWSRequest = z
  .object({
    cloudArchiveDays: z.number().int().nullable(),
    deviceType: DeviceTypeEnum,
    license: AddOnLicense,
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_CreateLicenseWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    licenseUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_DeleteAlertMonitoringLicenseWSRequest = z
  .object({ locationUuid: z.string().nullable(), orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const License_DeleteAlertMonitoringLicenseWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const License_DeleteDeviceLicenseWSRequest = z
  .object({ licenseUuid: z.string().nullable(), orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const License_DeleteDeviceLicenseWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const License_DeleteLicenseWSRequest = z
  .object({ licenseUuid: z.string().nullable(), orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const License_DeleteLicenseWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const License_GetACUDoorLicensesWSRequest = z
  .object({ orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const ACUDoorLicenseType = z
  .object({
    createdAtTimestampMs: z.number().int().nullable(),
    expiresAtTimestampMs: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_GetACUDoorLicensesWSResponse = z
  .object({
    acuDoorLicenses: z.array(ACUDoorLicenseType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_GetAlertMonitoringLicensesWSRequest = z
  .object({ orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const AlertMonitoringLicenseType = z
  .object({
    allowedDeviceCount: z.number().int().nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_GetAlertMonitoringLicensesWSResponse = z
  .object({
    alertMonitoringLicenses: z.array(AlertMonitoringLicenseType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_GetDeviceLicensesWSRequest = z
  .object({ optionalDeviceTypeFilter: DeviceTypeEnum })
  .partial()
  .passthrough();
const DeviceLicenseType = z
  .object({
    deviceType: DeviceTypeEnum,
    deviceUuid: z.string().nullable(),
    licenseType: License,
    orgUuid: z.string().nullable(),
    trial: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_GetDeviceLicensesWSResponse = z
  .object({
    deviceLicenses: z.array(DeviceLicenseType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_GetLicensesWSRequest = z
  .object({ optionalDeviceTypeFilter: DeviceTypeEnum })
  .partial()
  .passthrough();
const LicenseUsageType = z
  .object({
    additionalPerceptionFeatures: z.array(PerceptionType).nullable(),
    cloudArchiveDays: z.number().int().nullable(),
    deviceType: DeviceTypeEnum,
    deviceUuid: z.string().nullable(),
    hidden: z.boolean().nullable(),
    license: AddOnLicense,
    orgUuid: z.string().nullable(),
    perceptionTypes: z.array(PerceptionType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_GetLicensesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    licenses: z.array(LicenseUsageType).nullable(),
  })
  .partial()
  .passthrough();
const License_UpdateAlertMonitoringLicenseWSRequest = z
  .object({
    deviceUuids: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const License_UpdateAlertMonitoringLicenseWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Location_CreateLocationWSRequest = z
  .object({ location: LocationType })
  .partial()
  .passthrough();
const Location_CreateLocationWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Location_DeleteLocationWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Location_DeleteLocationWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Location_GeoCodeWSRequest = z
  .object({ address: z.string().nullable() })
  .partial()
  .passthrough();
const Location_GeoCodeWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  })
  .partial()
  .passthrough();
const Location_GetLocationsWSRequest = z.object({}).partial().passthrough();
const Location_GetLocationsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    locations: z.array(LocationType).nullable(),
  })
  .partial()
  .passthrough();
const Location_GetLocationsByGeoRequest = z
  .object({ latitude: z.number().nullable(), longitude: z.number().nullable() })
  .partial()
  .passthrough();
const Location_GetLocationsByGeoResponse = z
  .object({ locations: z.array(LocationType).nullable() })
  .partial()
  .passthrough();
const Location_SelectiveUpdateLocationWSRequest = z
  .object({
    address1: z.string().nullish(),
    address2: z.string().nullish(),
    countryCode: z.string().nullish(),
    floorPlans: z.array(FloorPlanType).nullish(),
    labels: z.array(z.string().nullable()).nullish(),
    latitude: z.number().nullish(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullish(),
    name: z.string().nullish(),
    policyUuid: z.string().nullish(),
    postalCode: z.string().nullish(),
    timezoneId: z.string().nullish(),
    tz: z
      .object({
        displayName: z.string().nullable(),
        dstsavings: z.number().int().nullable(),
        id: z.string().nullable(),
        rawOffset: z.number().int().nullable(),
      })
      .partial()
      .passthrough()
      .nullish(),
  })
  .passthrough();
const Location_SelectiveUpdateLocationWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Location_UpdateLocationWSRequest = z
  .object({ location: LocationType })
  .partial()
  .passthrough();
const Location_UpdateLocationWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Location_ValidateLocationWSRequest = z
  .object({ locationUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Location_QualifiedAddressTypeWithValidation = z
  .object({
    addressComplete: z.boolean().nullable(),
    addressLine2: z.string().nullable(),
    addressline1: z.string().nullable(),
    administrativeArea: z.string().nullable(),
    locality: z.string().nullable(),
    postalCode: z.string().nullable(),
    regionCode: z.string().nullable(),
    validatedAddressline1: z.boolean().nullable(),
    validatedAdminestrativeArea: z.boolean().nullable(),
    validatedLocality: z.boolean().nullable(),
    validatedPostalCode: z.boolean().nullable(),
    validatedRegionCode: z.boolean().nullable(),
    validatedSubpremise: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Location_ValidateLocationWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    locationUuid: z.string().nullable(),
    qualifiedAddress: Location_QualifiedAddressTypeWithValidation,
  })
  .partial()
  .passthrough();
const Logistics_GetRMAsWSRequest = z.object({}).partial().passthrough();
const RMAType = z
  .object({
    address: z.string().nullable(),
    briefDescription: z.string().nullable(),
    costInDollars: z.number().nullable(),
    customerUnresponsive: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    deviceUuid: z.string().nullable(),
    errorCode: z
      .enum([
        "ERROR_2",
        "ERROR_4",
        "ERROR_5",
        "ERROR_24",
        "ERROR_28",
        "ERROR_30",
        "ERROR_84",
        "NEVER_LEFT_BUSY_STATE",
        "HARDWARE_DAMAGE",
        "WATER_DAMAGE",
        "VIDEO_HARDWARE_FAILURE",
        "ENCRYPTED_CONTAINER_FAILURE_CREATE",
        "ENCRYPTED_CONTAINER_FAILURE_OPEN",
        "ENCRYPTED_CONTAINER_FAILURE_MOUNT",
        "LIGHT_SENSOR",
        "SD_CARD_UNKOWN",
        "SD_CARD_READER_BROKEN",
        "POWER_ISSUES",
        "CUT_FILTER",
        "QUALITY_OR_PERFORMANCE",
        "NETWORK_ISSUES",
        "UNKNOWN",
      ])
      .nullable(),
    failureDiagnostics: z.array(z.string().nullable()).nullable(),
    finalNotes: z.string().nullable(),
    hardwareUuid: z.string().nullable(),
    inventoryNeeded: z.string().nullable(),
    isRefurbished: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    recipientName: z.string().nullable(),
    recipientPhoneNumber: z.string().nullable(),
    replacementCourier: z.string().nullable(),
    replacementHardwareUuid: z.string().nullable(),
    replacementTrackingNumber: z.string().nullable(),
    requesterEmailAddress: z.string().nullable(),
    returnTrackingNumber: z.string().nullable(),
    sdCardReplaced: z.boolean().nullable(),
    shipmentRequested: z.boolean().nullable(),
    shipmentRequestedUpdatedAtSec: z.number().int().nullable(),
    shipmentSent: z.boolean().nullable(),
    shipmentSentUpdatedAtSec: z.number().int().nullable(),
    skipAutoRegistration: z.boolean().nullable(),
    status: z
      .enum([
        "INITIATED",
        "PENDING",
        "APPROVED",
        "INPROGRESS",
        "COMPLETE",
        "RETURN",
        "STOLEN",
        "OPERATIONAL",
      ])
      .nullable(),
    storageCid: z.string().nullable(),
    timestampSec: z.number().int().nullable(),
    uuid: z.string().nullable(),
    zenDeskTicketSubject: z.string().nullable(),
    zendeskTicket: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Logistics_GetRMAsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    rmaList: z.array(RMAType).nullable(),
  })
  .partial()
  .passthrough();
const Logistics_GetShipmentsWSRequest = z
  .object({ endTimeSec: z.number().int().nullable(), startTimeSec: z.number().int().nullable() })
  .partial()
  .passthrough();
const ShippedItemType = z
  .object({
    partNumber: z.string().nullable(),
    quantityShipped: z.number().int().nullable(),
    serialNumber: z.string().nullable(),
  })
  .partial()
  .passthrough();
const CustomerShipmentType = z
  .object({
    "ait-aitTrackingNumber": z.string().nullable(),
    "ait-carrierTrackingNumber": z.string().nullable(),
    "ait-destinationAddress": z.string().nullable(),
    "ait-purchaseOrderNumber": z.string().nullable(),
    "ait-shipmentDate": z.string().datetime({ offset: true }).nullable(),
    "ait-shippedItems": z.array(ShippedItemType).nullable(),
    lastStateUpdateSec: z.number().int().nullable(),
    "rhombus-additionalEmails": z.string().nullable(),
    "rhombus-customerEmails": z.string().nullable(),
    "rhombus-customerName": z.string().nullable(),
    "rhombus-orgUuid": z.string().nullable(),
    "rhombus-partnerOrgUuid": z.string().nullable(),
    "rhombus-purchaseOrderNumber": z.string().nullable(),
    "rhombus-rmaReturnTrackingNumber": z.string().nullable(),
    "rhombus-rmaUuid": z.string().nullable(),
    "rhombus-rmaUuids": z.array(z.string().nullable()).nullable(),
    "rhombus-salesForceOpportunityId": z.string().nullable(),
    "rhombus-zendeskTicketNumber": z.string().nullable(),
    shipmentCategory: z.enum(["RMA", "PURCHASE_ORDER", "TRIAL", "UNKNOWN"]).nullable(),
    shipmentState: z
      .enum([
        "CREATED",
        "SHIPPED",
        "DELIVERED",
        "RETURN_REGISTERED",
        "RETURN_SENT",
        "RETURN_DELIVERED",
        "COMPLETE",
        "UNKNOWN",
      ])
      .nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Logistics_GetShipmentsWSResponse = z
  .object({
    customerShipmentList: z.array(CustomerShipmentType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Maps_GenerateMapUrlWSRequest = z
  .object({ baseUrl: z.string().nullable() })
  .partial()
  .passthrough();
const Maps_GenerateMapUrlWSResponse = z
  .object({ signedUrl: z.string().nullable() })
  .partial()
  .passthrough();
const Metric_LogEventWSRequest = z
  .object({ logMap: z.record(z.object({}).partial().passthrough().nullable()).nullable() })
  .partial()
  .passthrough();
const Metric_LogEventWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Metric_ReportErrorWSRequest = z
  .object({ errorMap: z.record(z.object({}).partial().passthrough().nullable()).nullable() })
  .partial()
  .passthrough();
const Metric_ReportErrorWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Mobile_LoginToOrgRequest = z
  .object({ csr: z.array(z.string().nullable()).nullable(), orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Mobile_LoginToOrgBaseResponse = z.object({ type: z.string() }).passthrough();
const Mobile_LoginVerifiedSupportAuthorityMobileRequest = z
  .object({
    authorityUuid: z.string().nullable(),
    clientType: z.enum(["MOBILE", "IOS", "ANDROID", "BROWSER"]).nullable(),
  })
  .partial()
  .passthrough();
const Mobile_LoginVerifiedSupportAuthorityMobileResponse = z
  .object({ supportAuthoritySessionUuid: z.string().nullable(), valid: z.boolean().nullable() })
  .partial()
  .passthrough();
const Mobile_LogoutMobileUserRequest = z.object({}).partial().passthrough();
const Mobile_LogoutMobileUserResponse = z.object({}).partial().passthrough();
const Mobile_UpdateMobileNotificationTokenRequest = z
  .object({ token: z.string().nullable() })
  .partial()
  .passthrough();
const Mobile_UpdateMobileNotificationTokenResponse = z.object({}).partial().passthrough();
const Mobile_UpdateRhombusKeyMobileNotificationTokenRequest = z
  .object({ token: z.string().nullable() })
  .partial()
  .passthrough();
const Mobile_UpdateRhombusKeyMobileNotificationTokenResponse = z.object({}).partial().passthrough();
const Occupancysensor_GetMinimalOccupancySensorStatesWSRequest = z
  .object({})
  .partial()
  .passthrough();
const Occupancysensor_MinimalOccupancySensorStateType = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    batteryPercent: z.number().int().nullable(),
    firmwareVersion: z.string().nullable(),
    floorNumber: z.number().int().nullable(),
    health: z.enum(["RED", "GREEN"]).nullable(),
    healthDetails: z.enum(["NO_HEARTBEAT", "FIRMWARE_BEHIND", "NONE"]).nullable(),
    hwVariation: HardwareVariationEnum,
    lastSeenSec: z.number().int().nullable(),
    latitude: z.number().nullable(),
    locationUuid: z.string().nullable(),
    longitude: z.number().nullable(),
    name: z.string().nullable(),
    normalizedLux: z.number().nullable(),
    policyUuid: z.string().nullable(),
    rawLux: z.number().int().nullable(),
    sensorUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    signalStrength: z.number().int().nullable(),
    status: z.enum(["VACANT", "MOVEMENT", "OCCUPIED"]).nullable(),
  })
  .partial()
  .passthrough();
const Occupancysensor_GetMinimalOccupancySensorStatesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    occupancySensorStates: z.array(Occupancysensor_MinimalOccupancySensorStateType).nullable(),
  })
  .partial()
  .passthrough();
const Occupancysensor_GetOccupancyEventsForSensorWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    sensorUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const OccupancyEventType = z
  .object({
    baseStationUuid: z.string().nullable(),
    batteryPercentage: z.number().int().nullable(),
    bleDeviceUuid: z.string().nullable(),
    bleRssi: z.number().int().nullable(),
    closeBaseStations: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    lux: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    state: z.enum(["VACANT", "MOVEMENT", "OCCUPIED"]).nullable(),
    stateChanged: z.boolean().nullable(),
    tampered: z.boolean().nullable(),
    timestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Occupancysensor_GetOccupancyEventsForSensorWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    events: z.array(OccupancyEventType).nullable(),
  })
  .partial()
  .passthrough();
const Occupancysensor_UpdateOccupancySensorDetailsWSRequest = z
  .object({
    associatedCameras: z.array(z.string().nullable()).nullable(),
    associatedCamerasUpdated: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    deletedUpdated: z.boolean().nullable(),
    description: z.string().nullable(),
    descriptionUpdated: z.boolean().nullable(),
    floorNumber: z.number().int().nullable(),
    floorNumberUpdated: z.boolean().nullable(),
    latitude: z.number().nullable(),
    latitudeUpdated: z.boolean().nullable(),
    locationUuid: z.string().nullable(),
    locationUuidUpdated: z.boolean().nullable(),
    longitude: z.number().nullable(),
    longitudeUpdated: z.boolean().nullable(),
    name: z.string().nullable(),
    nameUpdated: z.boolean().nullable(),
    policyUuid: z.string().nullable(),
    policyUuidUpdated: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Occupancysensor_UpdateOccupancySensorDetailsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_ClaimActivationTokenWSRequest = z
  .object({
    activationToken: z.string().nullable(),
    name: z.string().nullable(),
    permissionGroupUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Org_ClaimActivationTokenWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_DeviceRegistrationClaimType = z
  .object({
    deviceName: z.string().nullable(),
    hardwareUuid: z.string().nullable(),
    locationUuid: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Org_ClaimShipmentRegistrationTokenWSRequest = z
  .object({
    claimList: z.array(Org_DeviceRegistrationClaimType).nullable(),
    tokenUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Org_ClaimShipmentRegistrationTokenWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_CreatePendingRegistrationRequest = z
  .object({
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    wifiPsk: z.array(z.string().nullable()).nullable(),
    wifiSsid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Org_CreatePendingRegistrationResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_DeleteCloudArchivingConfigWSRequest = z
  .object({ scope: DeviceTargetScope, targetUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Org_DeleteCloudArchivingConfigWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_FindAllHardwareWithPendingRegistrationRequest = z.object({}).partial().passthrough();
const HardwareType = z
  .object({
    deviceUuid: z.string().nullable(),
    enforcedMinFirmwareVersion: z.string().nullable(),
    firmwareUpdateTimeMs: z.number().int().nullable(),
    firmwareVersion: z.string().nullable(),
    hwVariation: HardwareVariationEnum,
    mac: z.string().nullable(),
    manufacturedAtMillis: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    pendingRegistrationDeviceUuid: z.string().nullable(),
    pendingRegistrationOrgUuid: z.string().nullable(),
    pendingRegistrationToken: z.string().nullable(),
    sdSize: z.number().int().nullable(),
    serialNumber: z.string().nullable(),
    type: DeviceTypeEnum,
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Org_PendingRegistrationInfoType = z
  .object({
    licenseType: License,
    locationUuid: z.string().nullable(),
    name: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Org_HardwareWithPendingRegistrationInfoType = z
  .object({
    hardware: HardwareType,
    hwUuid: z.string().nullable(),
    pendingRegistrationInfo: Org_PendingRegistrationInfoType,
  })
  .partial()
  .passthrough();
const Org_FindAllHardwareWithPendingRegistrationResponse = z
  .object({
    hardwareList: z.array(HardwareType).nullable(),
    hardwareWithPendingRegistrationInfoList: z
      .array(Org_HardwareWithPendingRegistrationInfoType)
      .nullable(),
  })
  .partial()
  .passthrough();
const Org_FindHardwareAvailableForPendingRegistrationRequest = z.object({}).partial().passthrough();
const Org_FindHardwareAvailableForPendingRegistrationResponse = z
  .object({ hardwareList: z.array(HardwareType).nullable() })
  .partial()
  .passthrough();
const Org_FindIfTeamNameAvailableRequest = z
  .object({ teamName: z.string().nullable() })
  .partial()
  .passthrough();
const Org_FindIfTeamNameAvailableResponse = z
  .object({ available: z.boolean().nullable() })
  .partial()
  .passthrough();
const Org_FindSCIMSettingsForOrgWSRequest = z.object({}).partial().passthrough();
const SCIMSettingsType = z
  .object({
    addUsersOnRoleMismatch: z.boolean().nullable(),
    createdAtMillis: z.number().int().nullable(),
    orgUuid: z.string().nullable(),
    rhombusKeyAppSettings: RhombusKeyAppSettingsType,
    sendWelcomeEmailToNewRhombusKeyUsers: z.boolean().nullable(),
    sendWelcomeEmailToNewUsers: z.boolean().nullable(),
    updatedAtMillis: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Org_FindSCIMSettingsForOrgWSResponse = z
  .object({ scimSettings: SCIMSettingsType })
  .partial()
  .passthrough();
const Org_GenerateFederatedSessionTokenRequest = z
  .object({ durationSec: z.number().int().nullable() })
  .partial()
  .passthrough();
const Org_GenerateFederatedSessionTokenResponse = z
  .object({ federatedSessionToken: z.string().nullable() })
  .partial()
  .passthrough();
const Org_GetAwsIntCloudformationFileRequest = z.object({}).partial().passthrough();
const Org_GetAwsIntCloudformationFileResponse = z
  .object({ fileBase64: z.string().nullable() })
  .partial()
  .passthrough();
const Org_GetCloudArchivingConfigsWSRequest = z.object({}).partial().passthrough();
const Org_GetCloudArchivingConfigsWSResponse = z
  .object({
    archivingConfigs: z.array(ScopedCloudArchivingConfig).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Org_GetDeviceFlagsWSRequest = z
  .object({ deviceUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Org_GetDeviceFlagsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    flags: z.record(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Org_GetFeaturesWSRequest = z.object({}).partial().passthrough();
const Org_GetFeaturesWSResponse = z
  .object({
    behaviorDetection: z.boolean().nullable(),
    cloudArchiving: z.boolean().nullable(),
    engagementCounting: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceCounting: z.boolean().nullable(),
    faceCountingNonUnique: z.boolean().nullable(),
    faceRecognition: z.boolean().nullable(),
    licensePlateRecognition: z.boolean().nullable(),
    peopleCounting: z.boolean().nullable(),
    ppeDetection: z.boolean().nullable(),
    rulesEngine: z.boolean().nullable(),
    vehicleCounting: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Org_GetLocationFlagsWSRequest = z.object({}).partial().passthrough();
const Org_GetLocationFlagsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    flagsMap: z.record(z.record(z.string().nullable()).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Org_GetOrgNotificationTemplateWSRequest = z.object({}).partial().passthrough();
const Org_GetOrgNotificationTemplateWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    notificationSettings: UserNotificationSettingsV3Type,
  })
  .partial()
  .passthrough();
const Org_GetOrgV2WSRequest = z.object({}).partial().passthrough();
const Deviceconfig_VideoConfigurationDefault = z
  .object({
    resolution: Deviceconfig_ExternalVideoResolution,
    segmentMaxBytes: z.number().int().nullable(),
    sensorGainMax: z.number().int().nullable(),
    shutterTimeMin: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Deviceconfig_IntRange = z
  .object({ max: z.number().int().nullable(), min: z.number().int().nullable() })
  .partial()
  .passthrough();
const Deviceconfig_VideoConfigurationOption = z
  .object({
    maxBitrateRange: Deviceconfig_IntRange,
    maxZoomPercent: z.number().int().nullable(),
    resolution: Deviceconfig_ExternalVideoResolution,
    wdrRange: Deviceconfig_IntRange,
  })
  .partial()
  .passthrough();
const Org_GetOrgV2WSResponse = z
  .object({
    cameraConfigDefaults: z.record(Deviceconfig_VideoConfigurationDefault).nullable(),
    cameraConfigOptions: z
      .record(z.array(Deviceconfig_VideoConfigurationOption).nullable())
      .nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    featureFlags: z.record(z.string().nullable()).nullable(),
    org: OrgV2Type.nullable(),
  })
  .partial()
  .passthrough();
const Org_GetSAMLSettingsV2WSRequest = z.object({}).partial().passthrough();
const Org_GetSAMLSettingsV2WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    samlSettings: z.array(OrgSamlSettingsType).nullable(),
  })
  .partial()
  .passthrough();
const Org_GetScimDisplayInfoResponse = z
  .object({ azureScimEndpointUrl: z.string().nullable(), scimEndpointUrl: z.string().nullable() })
  .partial()
  .passthrough();
const Org_GetTemporaryOrgTokenWSRequest = z.object({}).partial().passthrough();
const GetTemporaryOrgTokenResponse = z
  .object({ tempOrgToken: z.string().nullable() })
  .partial()
  .passthrough();
const Org_PeekShipmentRegistrationTokenWSRequest = z
  .object({ tokenUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Org_PeekShipmentRegistrationTokenWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    hardwareUuidList: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Org_RemovePendingRegistrationRequest = z
  .object({ serialNumber: z.string().nullable() })
  .partial()
  .passthrough();
const Org_RemovePendingRegistrationResponse = z.object({}).partial().passthrough();
const Org_RevokeSCIMAccessForOrgWSRequest = z.object({}).partial().passthrough();
const Org_RevokeSCIMAccessForOrgWSResponse = z.object({}).partial().passthrough();
const Org_SetFlagWSRequest = z
  .object({ flagName: z.string().nullable(), flagValue: z.string().nullable() })
  .partial()
  .passthrough();
const Org_SetFlagWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_SetupSCIMAccessForOrgWSRequest = z
  .object({
    addUsersOnRoleMismatch: z.boolean().nullable(),
    rhombusKeyAppSettings: RhombusKeyAppSettingsType,
    sendWelcomeEmailToNewRhombusKeyUsers: z.boolean().nullable(),
    sendWelcomeEmailToNewUsers: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Org_SetupSCIMAccessForOrgWSResponse = z
  .object({ scimAccessAlreadySetupFailure: z.boolean().nullable(), token: z.string().nullable() })
  .partial()
  .passthrough();
const Org_UpdateAiTrainingSettingsWSRequest = z
  .object({ shareAiTrainingMediaWithRhombus: z.boolean().nullable() })
  .partial()
  .passthrough();
const Org_UpdateAiTrainingSettingsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_UpdateCloudArchivingConfigWSRequest = z
  .object({ archivingConfig: ScopedCloudArchivingConfig })
  .partial()
  .passthrough();
const Org_UpdateCloudArchivingConfigWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_UpdateFirmwareSettingsWSRequest = z
  .object({ firmwareSettings: FirmwareUpdateSettingsType.nullable() })
  .partial()
  .passthrough();
const Org_UpdateFirmwareSettingsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_UpdateGeneralSettingsWSRequest = z
  .object({
    accountBillingContactEmail: z.string().nullable(),
    accountOwnerEmail: z.string().nullable(),
    accountTechnicalContactEmail: z.string().nullable(),
    accountTechnicalContacts: z.array(z.string().nullable()).nullable(),
    inactivityTimeout: z.number().int().nullable(),
    name: z.string().nullable(),
    uapSettings: UAPSettingsType.nullable(),
  })
  .partial()
  .passthrough();
const Org_UpdateGeneralSettingsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_UpdateMFASettingsWSRequest = z
  .object({
    mfaEnabled: z.boolean().nullable(),
    v3AuthNumDaysSkip2FAForTrustedDevices: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Org_UpdateMFASettingsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    org: OrgV2Type.nullable(),
  })
  .partial()
  .passthrough();
const Org_UpdateOrgAudioRecordingPolicyWSRequest = z
  .object({ audioRecordingEnabled: z.boolean().nullable() })
  .partial()
  .passthrough();
const Org_UpdateOrgAudioRecordingPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_UpdateOrgNotificationTemplateWSRequest = z
  .object({
    notificationIntervalsV2: z.array(NotificationIntervalV2Type).nullable(),
    summaryEmailEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Org_UpdateOrgNotificationTemplateWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_UpdatePendingRegistrationRequest = z
  .object({
    hardwareUuid: z.string().nullable(),
    licenseType: License,
    locationUuid: z.string().nullable(),
    name: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Org_UpdatePendingRegistrationResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_UpdateSAMLSettingsV2WSRequest = z
  .object({ samlSettings: z.array(OrgSamlSettingsType).nullable() })
  .partial()
  .passthrough();
const Org_UpdateSAMLSettingsV2WSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Org_UpdateSCIMSettingsForOrgWSRequest = z
  .object({
    addUsersOnRoleMismatch: z.boolean().nullable(),
    rhombusKeyAppSettings: RhombusKeyAppSettingsType,
    sendWelcomeEmailToNewRhombusKeyUsers: z.boolean().nullable(),
    sendWelcomeEmailToNewUsers: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Org_UpdateSCIMSettingsForOrgWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_CreatePartnerClientWSRequest = z
  .object({
    clientContactEmail: z.string().nullable(),
    clientContactName: z.string().nullable(),
    clientOrgName: z.string().nullable(),
    suppressWelcomeEmail: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Partner_CreatePartnerClientWSResponse = z
  .object({
    clientOrgUuid: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    responseStatus: z
      .enum([
        "BASIC_AUTH_FAILED",
        "PASSWORD_MISMATCH",
        "USER_EXISTS",
        "CLIENT_EXISTS",
        "USER_NOT_FOUND",
        "BAD_INPUT",
        "SUCCESS",
        "PASSWORD_TOO_SHORT",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const Partner_ClientCustomizationsType = z
  .object({
    forceLowBandwidthOnAllCameras: z.boolean().nullable(),
    inactivityTimeout: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Partner_CustomizeClientWSRequest = z
  .object({
    clientOrgUuid: z.string().nullable(),
    customizations: Partner_ClientCustomizationsType,
  })
  .partial()
  .passthrough();
const Partner_CustomizeClientWSResponse = z
  .object({
    customizations: Partner_ClientCustomizationsType,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_ClientDeviceCustomizationsType = z
  .object({
    forceLowBandwidthOnAllCameras: z.boolean().nullable(),
    inactivityTimeout: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Partner_CustomizeClientDeviceWSRequest = z
  .object({
    clientDeviceUuid: z.string().nullable(),
    clientOrgUuid: z.string().nullable(),
    configUpdate: Camera_ExternalCameraUserConfigUpdatableType,
    customizations: Partner_ClientDeviceCustomizationsType,
  })
  .partial()
  .passthrough();
const Partner_CustomizeClientDeviceWSResponse = z
  .object({
    customizations: Partner_ClientCustomizationsType,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_DeleteClientWebRequest = z
  .object({ clientOrgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_DeleteClientWebResponse = z.object({}).partial().passthrough();
const Integration_GetPartnerApiTokensWSRequest = z.object({}).partial().passthrough();
const Partner_GetClientDevicesWSRequest = z
  .object({ orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const DeviceTypeV2 = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    customData: z.string().nullable(),
    deleted: z.boolean().nullable(),
    description: z.string().nullable(),
    hardwareId: z.string().nullable(),
    hwVariation: HardwareVariationEnum,
    mummified: z.boolean().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    pending: z.boolean().nullable(),
    policyUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    type: DeviceTypeEnum,
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_DeviceWithPartnerDetailsType = z
  .object({
    device: DeviceTypeV2,
    partnerControlledHardware: z.boolean().nullable(),
    reassignable: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetClientDevicesWSResponse = z
  .object({ devices: z.array(Partner_DeviceWithPartnerDetailsType).nullable() })
  .partial()
  .passthrough();
const Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSRequest = z
  .object({ token: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSBaseResponse = z
  .object({ type: z.string() })
  .passthrough();
const Partner_GetPartnerClientsStatusMapWSRequest = z.object({}).partial().passthrough();
const Partner_ConnectionCountType = z
  .object({
    connectedCount: z.number().int().nullable(),
    operationalCount: z.number().int().nullable(),
    totalCount: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetPartnerClientsStatusMapWSResponse = z
  .object({
    clientDeviceStatusMap: z.record(z.record(Partner_ConnectionCountType).nullable()).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetClientSummaryInfoWSRequest = z
  .object({ clientOrgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_GetClientSummaryInfoWSResponse = z
  .object({
    accountOwner: User_WrappedRhombusOrgUserType,
    clientDeviceStatusMap: z.record(Partner_ConnectionCountType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    locationCount: z.number().int().nullable(),
    recentPolicyAlertCount: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetPartnerClientsWSRequest = z.object({}).partial().passthrough();
const Partner_PartnerClientWebType = z
  .object({
    authorityUuid: z.string().nullable(),
    clientAccessAllowed: z.boolean().nullable(),
    clientAccountAccessUrl: z.string().nullable(),
    clientOrgName: z.string().nullable(),
    clientOrgUuid: z.string().nullable(),
    createdAtMillis: z.number().int().nullable(),
    totalAudioGateways: z.number().int().nullable(),
    totalBadgeReaders: z.number().int().nullable(),
    totalCameras: z.number().int().nullable(),
    totalClimateSensors: z.number().int().nullable(),
    totalDoorSensors: z.number().int().nullable(),
    totalLocations: z.number().int().nullable(),
    totalOccupancySensors: z.number().int().nullable(),
    totalProximitySensors: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetPartnerClientsWSResponse = z
  .object({
    clients: z.array(Partner_PartnerClientWebType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetDeviceLicensesForOrgWSRequest = z
  .object({ orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_GetDeviceLicensesForOrgWSResponse = z
  .object({
    deviceLicenses: z.array(DeviceLicenseType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetLicensesForOrgWSRequest = z
  .object({ orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_GetLicensesForOrgWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    licenses: z.array(LicenseUsageType).nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetListOfAllClientDevicesRequest = z.object({}).partial().passthrough();
const Partner_GetListOfAllClientDevicesResponse = z
  .object({ listOfAllClientDevices: z.array(DeviceTypeV2).nullable() })
  .partial()
  .passthrough();
const Partner_GetListOfControlledHardwareRequest = z.object({}).partial().passthrough();
const Partner_UnregisteredControlledHardwareType = z
  .object({
    deviceModel: HardwareVariationEnum,
    deviceType: DeviceTypeEnum,
    macAddress: z.string().nullable(),
    serialNumber: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetListOfControlledHardwareResponse = z
  .object({
    controlledHardwareList: z.array(Partner_UnregisteredControlledHardwareType).nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetPartnerClientMobileAccountAccessRequest = z
  .object({ authorityUuid: z.string().nullable(), clientOrgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_GetPartnerClientMobileAccountAccessResponse = z
  .object({ clientAccountAccessSessionId: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_GetShipmentsWSRequest = z
  .object({
    clientOrgUuid: z.string().nullable(),
    endTimeSec: z.number().int().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetShipmentsWSResponse = z
  .object({
    customerShipmentList: z.array(CustomerShipmentType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GrantSupportAccessToClientWSRequest = z
  .object({ clientOrgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_GrantSupportAccessToClientWSResponse = z
  .object({
    errMessage: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_ReassignDeviceOrgWSRequest = z
  .object({
    serialNumbers: z.array(z.string().nullable()).max(50).nullish(),
    sourceOrgUuid: z.string().nullable(),
    targetOrgUuid: z.string().nullable(),
  })
  .passthrough();
const OperationStatus = z
  .object({ message: z.string().nullable(), status: z.enum(["SUCCESS", "FAILURE"]).nullable() })
  .partial()
  .passthrough();
const Partner_ReassignDeviceOrgWSResponse = z
  .object({ statuses: z.record(OperationStatus).nullable() })
  .partial()
  .passthrough();
const Partner_RegisterDealWSRequest = z
  .object({ details: z.record(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Partner_RegisterDealWSResponse = z
  .object({
    clients: z.array(Partner_PartnerClientWebType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_RequestAccessToClientAccountV2Request = z
  .object({ clientEmail: z.string().nullable() })
  .partial()
  .passthrough();
const Partner_RequestAccessToClientAccountV2Response = z
  .object({ success: z.boolean().nullable() })
  .partial()
  .passthrough();
const Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSRequest = z
  .object({
    accessGrantedByClient: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    token: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSBaseResponse = z
  .object({ type: z.string() })
  .passthrough();
const Password_ForgotPasswordWSRequest = z
  .object({ email: z.string().nullable(), googlesCaptchaResponse: z.string().nullable() })
  .partial()
  .passthrough();
const Password_ForgotPasswordWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    failureReason: z.string().nullable(),
    success: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Password_ResetPasswordWSRequest = z
  .object({ password: z.string().nullable(), token: z.string().nullable() })
  .partial()
  .passthrough();
const Password_ResetPasswordWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    failureReason: z.string().nullable(),
    failureReasonType: z
      .enum([
        "RHOMBUS_USER_NOT_FOUND",
        "RHOMBUS_ORG_USER_NOT_FOUND",
        "PASSWORD_RESET_TOKEN_EXPIRED",
        "INVALID_CURRENT_PASSWORD",
      ])
      .nullable(),
    success: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Password_UserSignupWSRequest = z
  .object({
    eulaAccepted: z.boolean().nullable(),
    password: z.string().nullable(),
    token: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Password_UserSignupWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    failureReason: z.string().nullable(),
    success: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Functionality = z.enum([
  "DEVICE_ADMINISTRATION",
  "ORG_ADMINISTRATION",
  "AUTH_ADMINISTRATION",
  "FIRMWARE_ADMINISTRATION",
  "DOOR_ACCESS_ADMINISTRATION",
  "CAMERA_ADMINISTRATION",
  "REGISTER_DEVICES",
  "DELETE_DEVICES",
  "LOCATION_ADMINISTRATION",
  "POLICY_ADMINISTRATION",
  "USER_ADMINISTRATION",
  "REPORT_ADMINISTRATION",
  "NOTIFICATION_ADMINISTRATION",
  "LICENSE_ADMINISTRATION",
  "RECEIVE_EMAILS",
  "MANAGE_FACES",
  "MANAGE_LICENSEPLATES",
  "API_ADMINISTRATION",
  "INTEGRATION_ADMINISTRATION",
  "DATA_EXFILTRATION",
  "ALERT_MONITORING_ADMINISTRATION",
  "ALERT_MONITORING_VIEWONLY",
  "UNKNOWN",
]);
const PartnerPermission = z.enum(["DEFAULT", "CUSTOM"]);
const PartnerFunctionality = z.enum([
  "CREATE_CLIENT",
  "DELETE_CLIENT",
  "DEAL_ADMINISTRATION",
  "REMOTE_REGISTER_DEVICE",
  "ORG_ADMINISTRATION",
  "AUTH_ADMINISTRATION",
  "DOOR_ACCESS_ADMINISTRATION",
  "USER_ADMINISTRATION",
  "REPORT_ADMINISTRATION",
  "NOTIFICATION_ADMINISTRATION",
  "LICENSE_ADMINISTRATION",
  "RECEIVE_EMAILS",
  "API_ADMINISTRATION",
  "INTEGRATION_ADMINISTRATION",
  "DATA_EXFILTRATION",
  "UNKNOWN",
]);
const PartnerUserPermissionGroupType = z
  .object({
    assignablePermissionGroups: z.array(z.string().nullable()).nullable(),
    clientAssignablePermissionGroupsMap: z
      .record(z.array(z.string().nullable()).nullable())
      .nullable(),
    clientFunctionalityList: z.array(Functionality).nullable(),
    clientPermissionMap: z.record(PartnerPermission).nullable(),
    description: z.string().nullable(),
    functionalityList: z.array(PartnerFunctionality).nullable(),
    mutable: z.boolean().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    superAdmin: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Permission_CreatePartnerPermissionGroupWSRequest = z
  .object({ partnerPermissionGroup: PartnerUserPermissionGroupType })
  .partial()
  .passthrough();
const Permission_CreatePartnerPermissionGroupWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Permission = z.enum(["READONLY", "ADMIN", "LIVEONLY"]);
const UserPermissionGroupType = z
  .object({
    accessControlLocationAccessMap: z.record(Permission).nullable(),
    accessibleLocations: z.array(z.string().nullable()).nullable(),
    assignablePermissionGroups: z.array(z.string().nullable()).nullable(),
    defaultAccessControlPermissionForNewLocations: Permission,
    defaultPermissionForNewLocations: Permission,
    description: z.string().nullable(),
    deviceAccessMap: z.record(Permission).nullable(),
    functionalityList: z.array(Functionality).nullable(),
    inLine: z.boolean().nullable(),
    installer: z.boolean().nullable(),
    locationAccessMap: z.record(Permission).nullable(),
    mutable: z.boolean().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    storedInS3: z.boolean().nullable(),
    superAdmin: z.boolean().nullable(),
    userPermissionGroupAccessMap: z.record(Permission).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Permission_CreatePermissionGroupWSRequest = z
  .object({ userPermissionGroup: UserPermissionGroupType })
  .partial()
  .passthrough();
const Permission_CreatePermissionGroupWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Permission_DeletePartnerPermissionGroupWSRequest = z
  .object({ groupUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Permission_DeletePartnerPermissionGroupWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Permission_DeletePermissionGroupWSRequest = z
  .object({ groupUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Permission_DeletePermissionGroupWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Permission_GetPartnerPermissionGroupsWSRequest = z.object({}).partial().passthrough();
const Permission_GetPartnerPermissionGroupWSResponse = z
  .object({
    clientPermissionGroupMap: z.record(UserPermissionGroupType).nullable(),
    clientPermissionsGroupMap: z.record(UserPermissionGroupType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    groupMembership: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    permissionGroups: z.array(PartnerUserPermissionGroupType).nullable(),
  })
  .partial()
  .passthrough();
const Permission_GetPermissionGroupsWSRequest = z.object({}).partial().passthrough();
const Permission_GetPermissionGroupsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    groupMembership: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    partnerMembership: z.record(z.array(z.string().nullable()).nullable()).nullable(),
    permissionGroups: z.array(UserPermissionGroupType).nullable(),
  })
  .partial()
  .passthrough();
const Permission_GetPermissionGroupsForOrgWSRequest = z
  .object({ orgUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Permission_GetPermissionGroupsForOrgWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    permissionGroups: z.array(UserPermissionGroupType).nullable(),
  })
  .partial()
  .passthrough();
const Permission_GetPermissionsForCurrentPartnerWSRequest = z.object({}).partial().passthrough();
const Permission_GetPermissionsForCurrentPartnerWSResponse = z
  .object({
    assignablePermissionGroups: z.array(z.string().nullable()).nullable(),
    clientFunctionalityList: z.array(Functionality).nullable(),
    clientPermissionMap: z.record(PartnerPermission).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    functionalityList: z.array(PartnerFunctionality).nullable(),
    permissionGroupName: z.string().nullable(),
    superAdmin: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Permission_GetPermissionsForCurrentUserWSRequest = z.object({}).partial().passthrough();
const Permission_GetPermissionsForCurrentUserWSResponse = z
  .object({
    accessControlLocationAccessMap: z.record(Permission).nullable(),
    accessMap: z.record(Permission).nullable(),
    assignablePermissionGroups: z.array(z.string().nullable()).nullable(),
    deviceAccessMap: z.record(Permission).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    functionalityList: z.array(Functionality).nullable(),
    installer: z.boolean().nullable(),
    locationAccessMap: z.record(Permission).nullable(),
    permissionGroupName: z.string().nullable(),
    superAdmin: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Permission_UpdatePartnerPermissionGroupWSRequest = z
  .object({ partnerPermissionGroup: PartnerUserPermissionGroupType })
  .partial()
  .passthrough();
const Permission_UpdatePartnerPermissionGroupWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Permission_UpdatePermissionGroupWSRequest = z
  .object({ userPermissionGroup: UserPermissionGroupType })
  .partial()
  .passthrough();
const Permission_UpdatePermissionGroupWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_MinimalAccessControlledDoorScheduledTriggerType = z
  .object({ scheduleUuid: z.string().nullable(), triggerSet: z.array(ActivityEnum).nullable() })
  .partial()
  .passthrough();
const Policy_MinimalAccessControlledDoorPolicyType = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(Policy_MinimalAccessControlledDoorScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreateAccessControlledDoorPolicyWSRequest = z
  .object({ policy: Policy_MinimalAccessControlledDoorPolicyType })
  .partial()
  .passthrough();
const Policy_CreateAccessControlledDoorPolicyWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_ExternalAudioTriggerType = z
  .object({ activity: ActivityEnum, threshold: z.number().nullable() })
  .partial()
  .passthrough();
const Policy_MinimalAudioScheduledTriggerType = z
  .object({
    scheduleUuid: z.string().nullable(),
    triggerSet: z.array(Policy_ExternalAudioTriggerType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_MinimalAudioPolicyType = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(Policy_MinimalAudioScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreateAudioPolicyWSRequest = z
  .object({ policy: Policy_MinimalAudioPolicyType })
  .partial()
  .passthrough();
const Policy_CreateAudioPolicyWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const CameraTriggerType = z
  .object({
    activity: ActivityEnum,
    faceAlertLabelSet: z.array(z.string().nullable()).nullable(),
    faceAlertUnidentified: z.boolean().nullable(),
    faceAllowedLabelSet: z.array(z.string().nullable()).nullable(),
    threshold: z.number().int().nullable(),
    vehicleAlertLabelSet: z.array(z.string().nullable()).nullable(),
    vehicleAlertUnidentified: z.boolean().nullable(),
    vehicleAllowedLabelSet: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Policy_MinimalCameraScheduledTriggerType = z
  .object({
    scheduleUuid: z.string().nullable(),
    triggerSet: z.array(CameraTriggerType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_MinimalCameraPolicyV2Type = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(Policy_MinimalCameraScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreateCameraPolicyWSRequest = z
  .object({ policy: Policy_MinimalCameraPolicyV2Type })
  .partial()
  .passthrough();
const Policy_CreateCameraPolicyWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ClimateTriggerType = z
  .object({ activity: ActivityEnum, threshold: z.number().nullable() })
  .partial()
  .passthrough();
const Policy_MinimalClimateScheduledTriggerType = z
  .object({
    scheduleUuid: z.string().nullable(),
    triggerSet: z.array(ClimateTriggerType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_MinimalClimatePolicyType = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(Policy_MinimalClimateScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreateClimatePolicyWSRequest = z
  .object({ policy: Policy_MinimalClimatePolicyType })
  .partial()
  .passthrough();
const Policy_CreateClimatePolicyWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_MinimalDoorScheduledTriggerType = z
  .object({
    ajarThresholdSec: z.number().int().nullable(),
    scheduleUuid: z.string().nullable(),
    triggerSet: z.array(ActivityEnum).nullable(),
  })
  .partial()
  .passthrough();
const Policy_MinimalDoorPolicyType = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(Policy_MinimalDoorScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreateDoorPolicyWSRequest = z
  .object({ policy: Policy_MinimalDoorPolicyType })
  .partial()
  .passthrough();
const Policy_CreateDoorPolicyWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_MinimalOccupancyScheduledTriggerType = z
  .object({
    occupancyThresholdSec: z.number().int().nullable(),
    scheduleUuid: z.string().nullable(),
    triggerSet: z.array(ActivityEnum).nullable(),
    vacancyThresholdSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Policy_MinimalOccupancyPolicyType = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(Policy_MinimalOccupancyScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreateOccupancyPolicyWSRequest = z
  .object({ policy: Policy_MinimalOccupancyPolicyType })
  .partial()
  .passthrough();
const Policy_CreateOccupancyPolicyWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreatePolicyAddendumForLocationRequest = z
  .object({
    activities: z.array(ActivityEnum).nullable(),
    durationSec: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
    scheduledTimestampSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreatePolicyAddendumForLocationResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_CreatePolicyAddendumsForDevicesRequest = z
  .object({
    activities: z.array(ActivityEnum).nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    scheduledTimestampSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreatePolicyAddendumsForDevicesResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const ProximityTriggerType = z
  .object({ activity: ActivityEnum, locationUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Policy_MinimalProximityScheduledTriggerType = z
  .object({
    departureThresholdSec: z.number().int().nullable(),
    scheduleUuid: z.string().nullable(),
    triggerSet: z.array(ProximityTriggerType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_MinimalProximityPolicyType = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(Policy_MinimalProximityScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_CreateProximityPolicyWSRequest = z
  .object({ policy: Policy_MinimalProximityPolicyType })
  .partial()
  .passthrough();
const Policy_CreateProximityPolicyWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policyUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const BaseSavedScheduleType = z
  .object({
    mutable: z.boolean().nullable(),
    name: z.string().nullable(),
    oneTimeUse: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    strategy: z
      .enum([
        "WEEKLY_REPEATING_MINUTES",
        "ABSOLUTE_SECONDS",
        "REALTIME_RELATIVE_SECONDS",
        "RELATIVE_DATETIME_INTERVALS",
      ])
      .nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const WeeklyRepeatingScheduleType = BaseSavedScheduleType.and(
  z
    .object({ intervalList: z.array(WeeklyMinuteIntervalType).nullable() })
    .partial()
    .passthrough()
);
const Policy_CreateScheduleWSRequest = z
  .object({ schedule: WeeklyRepeatingScheduleType.nullable() })
  .partial()
  .passthrough();
const Policy_CreateScheduleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    scheduleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_DeleteAccessControlledDoorPolicyWSRequest = z
  .object({ policyUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteAccessControlledDoorPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteAudioPolicyWSRequest = z
  .object({ policyUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteAudioPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteCameraPolicyWSRequest = z
  .object({ policyUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteCameraPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteClimatePolicyWSRequest = z
  .object({ policyUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteClimatePolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteDevicePolicyAddendumsWSRequest = z
  .object({ uuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Policy_DeleteDevicePolicyAddendumsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteDoorPolicyWSRequest = z
  .object({ policyUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteDoorPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteLocationPolicyAddendumWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteLocationPolicyAddendumWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteOccupancyPolicyWSRequest = z
  .object({ policyUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteOccupancyPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeletePolicyPauseSettingWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeletePolicyPauseSettingWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteProximityPolicyWSRequest = z
  .object({ policyUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteProximityPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteScheduleWSRequest = z
  .object({ scheduleUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_DeleteScheduleWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_FindSchedulesWSRequest = z.object({}).partial().passthrough();
const Policy_FindSchedulesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    schedules: z.array(WeeklyRepeatingScheduleType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetAccessControlledDoorPoliciesWSRequest = z.object({}).partial().passthrough();
const AccessControlledDoorScheduledTriggerType = z
  .object({
    schedule: WeeklyRepeatingScheduleType.nullable(),
    triggerSet: z.array(ActivityEnum).nullable(),
  })
  .partial()
  .passthrough();
const AccessControlledDoorPolicyType = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(AccessControlledDoorScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetAccessControlledDoorPoliciesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policies: z.array(AccessControlledDoorPolicyType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetAudioPoliciesWSRequest = z.object({}).partial().passthrough();
const Policy_ExternalAudioScheduledTriggerType = z
  .object({
    schedule: WeeklyRepeatingScheduleType.nullable(),
    triggerSet: z.array(Policy_ExternalAudioTriggerType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_ExternalAudioPolicyType = z
  .object({
    defaultTriggers: z.array(Policy_ExternalAudioTriggerType).nullable(),
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(Policy_ExternalAudioScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetAudioPoliciesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policies: z.array(Policy_ExternalAudioPolicyType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetCameraPoliciesWSRequest = z.object({}).partial().passthrough();
const CameraScheduledTriggerType = z
  .object({
    schedule: WeeklyRepeatingScheduleType.nullable(),
    triggerSet: z.array(CameraTriggerType).nullable(),
  })
  .partial()
  .passthrough();
const CameraPolicyV2Type = z
  .object({
    defaultTriggers: z.array(CameraTriggerType).nullable(),
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(CameraScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetCameraPoliciesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policies: z.array(CameraPolicyV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetClimatePoliciesWSRequest = z.object({}).partial().passthrough();
const ClimateScheduledTriggerType = z
  .object({
    schedule: WeeklyRepeatingScheduleType.nullable(),
    triggerSet: z.array(ClimateTriggerType).nullable(),
  })
  .partial()
  .passthrough();
const ClimatePolicyType = z
  .object({
    defaultTriggers: z.array(ClimateTriggerType).nullable(),
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(ClimateScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetClimatePoliciesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policies: z.array(ClimatePolicyType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetDoorPoliciesWSRequest = z.object({}).partial().passthrough();
const DoorScheduledTriggerType = z
  .object({
    ajarThresholdSec: z.number().int().nullable(),
    schedule: WeeklyRepeatingScheduleType.nullable(),
    triggerSet: z.array(ActivityEnum).nullable(),
  })
  .partial()
  .passthrough();
const DoorPolicyType = z
  .object({
    defaultAjarThresholdSec: z.number().int().nullable(),
    defaultTriggers: z.array(ActivityEnum).nullable(),
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(DoorScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetDoorPoliciesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policies: z.array(DoorPolicyType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetOccupancyPoliciesWSRequest = z.object({}).partial().passthrough();
const OccupancyScheduledTriggerType = z
  .object({
    occupancyThresholdSec: z.number().int().nullable(),
    schedule: WeeklyRepeatingScheduleType.nullable(),
    triggerSet: z.array(ActivityEnum).nullable(),
    vacancyThresholdSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const OccupancyPolicyType = z
  .object({
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(OccupancyScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetOccupancyPoliciesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policies: z.array(OccupancyPolicyType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetPoliciesUsingScheduleWSRequest = z
  .object({ scheduleUuid: z.string().nullable() })
  .partial()
  .passthrough();
const AudioTriggerType = z
  .object({ activity: ActivityEnum, threshold: z.number().int().nullable() })
  .partial()
  .passthrough();
const AudioScheduledTriggerType = z
  .object({
    schedule: WeeklyRepeatingScheduleType.nullable(),
    triggerSet: z.array(AudioTriggerType).nullable(),
  })
  .partial()
  .passthrough();
const AudioPolicyType = z
  .object({
    defaultTriggers: z.array(AudioTriggerType).nullable(),
    description: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(AudioScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ProximityScheduledTriggerType = z
  .object({
    departureThresholdSec: z.number().int().nullable(),
    egressThresholdMetersMap: z.record(z.number().nullable()).nullable(),
    ingressThresholdMetersMap: z.record(z.number().nullable()).nullable(),
    schedule: WeeklyRepeatingScheduleType.nullable(),
    triggerSet: z.array(ProximityTriggerType).nullable(),
  })
  .partial()
  .passthrough();
const ProximityPolicyType = z
  .object({
    defaultDepartureThresholdSec: z.number().int().nullable(),
    defaultTriggers: z.array(ProximityTriggerType).nullable(),
    description: z.string().nullable(),
    egressThresholdMetersMap: z.record(z.number().nullable()).nullable(),
    ingressThresholdMetersMap: z.record(z.number().nullable()).nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    scheduledTriggers: z.array(ProximityScheduledTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetPoliciesUsingScheduleWSResponse = z
  .object({
    audioPolicyList: z.array(AudioPolicyType).nullable(),
    cameraPolicyList: z.array(CameraPolicyV2Type).nullable(),
    climatePolicyList: z.array(ClimatePolicyType).nullable(),
    doorPolicyList: z.array(DoorPolicyType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    occupancyPolicyList: z.array(OccupancyPolicyType).nullable(),
    proximityPolicyList: z.array(ProximityPolicyType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetPolicyAddendumsWSRequest = z.object({}).partial().passthrough();
const Policy_GetPolicyAddendumsWSResponse = z
  .object({
    deviceAddendumsMap: z.record(z.array(ScheduledIntervalType).nullable()).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    locationAddendumsMap: z.record(z.array(ScheduledIntervalType).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetPolicyPauseSettingsWSRequest = z.object({}).partial().passthrough();
const Policy_GetPolicyPauseSettingsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policiesPausedForDevicesMap: z.record(z.array(ScheduledIntervalType).nullable()).nullable(),
    policiesPausedForLocationsMap: z.record(z.array(ScheduledIntervalType).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Policy_GetProximityPoliciesWSRequest = z.object({}).partial().passthrough();
const Policy_GetProximityPoliciesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    policies: z.array(ProximityPolicyType).nullable(),
  })
  .partial()
  .passthrough();
const Policy_PauseAlertPolicyWSRequest = z
  .object({
    deviceUuids: z.array(z.string().nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    locationUuids: z.array(z.string().nullable()).nullable(),
    scheduledTimestampSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Policy_PauseAlertPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_UpdateAccessControlledDoorPolicyWSRequest = z
  .object({ policy: Policy_MinimalAccessControlledDoorPolicyType })
  .partial()
  .passthrough();
const Policy_UpdateAccessControlledDoorPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_UpdateAudioPolicyWSRequest = z
  .object({ policy: Policy_MinimalAudioPolicyType })
  .partial()
  .passthrough();
const Policy_UpdateAudioPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_UpdateCameraPolicyWSRequest = z
  .object({ policy: Policy_MinimalCameraPolicyV2Type })
  .partial()
  .passthrough();
const Policy_UpdateCameraPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_UpdateClimatePolicyWSRequest = z
  .object({ policy: Policy_MinimalClimatePolicyType })
  .partial()
  .passthrough();
const Policy_UpdateClimatePolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_UpdateDoorPolicyWSRequest = z
  .object({ policy: Policy_MinimalDoorPolicyType })
  .partial()
  .passthrough();
const Policy_UpdateDoorPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_UpdateOccupancyPolicyWSRequest = z
  .object({ policy: Policy_MinimalOccupancyPolicyType })
  .partial()
  .passthrough();
const Policy_UpdateOccupancyPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_UpdateProximityPolicyWSRequest = z
  .object({ policy: Policy_MinimalProximityPolicyType })
  .partial()
  .passthrough();
const Policy_UpdateProximityPolicyWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Policy_UpdateScheduleWSRequest = z
  .object({ schedule: WeeklyRepeatingScheduleType.nullable() })
  .partial()
  .passthrough();
const Policy_UpdateScheduleWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Proximity_GetLocomotionEventsForTagWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    movementFilter: z.enum(["ARRIVAL", "DEPARTURE", "MOVED_SIGNIFICANTLY", "UNKNOWN"]).nullable(),
    tagUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const GpsError = z
  .object({
    majorAxis: z.number().nullable(),
    minorAxis: z.number().nullable(),
    rotation: z.number().nullable(),
  })
  .partial()
  .passthrough();
const GeodeticCoordinates = z
  .object({
    error: GpsError,
    floor: z.number().int().nullable(),
    lat: z.number().nullable(),
    lon: z.number().nullable(),
  })
  .partial()
  .passthrough();
const ProximityTagLocomotionEventType = z
  .object({
    baseStationUuid: z.string().nullable(),
    gpsLocation: GeodeticCoordinates,
    locationUuid: z.string().nullable(),
    movement: z.enum(["ARRIVAL", "DEPARTURE", "MOVED_SIGNIFICANTLY", "UNKNOWN"]).nullable(),
    orgUuid: z.string().nullable(),
    tagUuid: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Proximity_GetLocomotionEventsForTagWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    locomotionEvents: z.array(ProximityTagLocomotionEventType).nullable(),
  })
  .partial()
  .passthrough();
const Proximity_GetMinimalProximityStatesWSRequest = z.object({}).partial().passthrough();
const Proximity_MinimalProximityStateType = z
  .object({
    batteryPercent: z.number().int().nullable(),
    createdAtMillis: z.number().int().nullable(),
    firmwareVersion: z.string().nullable(),
    gpsLocation: GeodeticCoordinates,
    health: z.literal("GREEN").nullable(),
    healthDetails: z.enum(["FIRMWARE_BEHIND", "NONE"]).nullable(),
    hwVariation: HardwareVariationEnum,
    imageUrl: z.string().nullable(),
    lastSeenSec: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
    name: z.string().nullable(),
    policyUuid: z.string().nullable(),
    serialNumber: z.string().nullable(),
    signalStrength: z.number().int().nullable(),
    status: z.enum(["ACTIVE", "STATIONARY", "OFFLINE"]).nullable(),
    tagUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Proximity_GetMinimalProximityStatesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    proximityStates: z.array(Proximity_MinimalProximityStateType).nullable(),
  })
  .partial()
  .passthrough();
const Proximity_GetProximityEventsForTagWSRequest = z
  .object({
    createdAfterMs: z.number().int().nullable(),
    createdBeforeMs: z.number().int().nullable(),
    limit: z.number().int().nullable(),
    statusFilter: z.enum(["ACTIVE", "STATIONARY", "OFFLINE"]).nullable(),
    tagUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ProximityEventType = z
  .object({
    baseStationUuid: z.string().nullable(),
    batteryPercentage: z.number().int().nullable(),
    bleDeviceUuid: z.string().nullable(),
    bleRssi: z.number().int().nullable(),
    closeBaseStations: z.array(z.string().nullable()).nullable(),
    endTimeMs: z.number().int().nullable(),
    gpsLocation: GeodeticCoordinates,
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    startTimeMs: z.number().int().nullable(),
    status: z.enum(["ACTIVE", "STATIONARY", "OFFLINE"]).nullable(),
  })
  .partial()
  .passthrough();
const Proximity_GetProximityEventsForTagWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    proximityEvents: z.array(ProximityEventType).nullable(),
  })
  .partial()
  .passthrough();
const Proximity_UpdateProximitySensorDetailsWSRequest = z
  .object({
    deletedUpdated: z.boolean().nullable(),
    description: z.string().nullable(),
    descriptionUpdated: z.boolean().nullable(),
    imageUrl: z.string().nullable(),
    imageUrlUpdated: z.boolean().nullable(),
    name: z.string().nullable(),
    nameUpdated: z.boolean().nullable(),
    policyUuid: z.string().nullable(),
    policyUuidUpdated: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Proximity_UpdateProximitySensorDetailsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Report_GetAuditFeedWSRequest = z
  .object({
    excludeActions: z
      .array(
        z
          .enum([
            "THREAT_CASE_ESCALATED",
            "THREAT_CASE_CANCELLED",
            "THREAT_CASE_DISMISSED",
            "THREAT_CASE_DELETED",
            "PIN_CREATED",
            "PIN_DELETED",
            "BASIC_AUTH_SUCCESS",
            "BASIC_AUTH_FAILURE",
            "SAML_LOGIN_WEB",
            "LOGIN_WEB",
            "PASSWORDLESS_LOGIN_WEB",
            "PARTNER_LOGIN_WEB",
            "PARTNER_PASSWORDLESS_LOGIN_WEB",
            "SAML_LOGIN_FAILURE_WEB",
            "LOGIN_FAILURE_WEB",
            "RHOMBUS_KEY_LOGIN",
            "RHOMBUS_KEY_PASSWORDLESS_LOGIN",
            "RHOMBUS_KEY_SAML_LOGIN",
            "LOGOUT_WEB",
            "PARTNER_LOGOUT_WEB",
            "WEB_CONSOLE_ACCESS",
            "MOBILE_CONSOLE_ACCESS",
            "SAML_LOGIN_MOBILE",
            "PARTNER_LOGIN_MOBILE",
            "PARTNER_PASSWORDLESS_LOGIN_MOBILE",
            "LOGIN_MOBILE",
            "PASSWORDLESS_LOGIN_MOBILE",
            "SAML_LOGIN_FAILURE_MOBILE",
            "LOGIN_FAILURE_MOBILE",
            "LOGOUT_MOBILE",
            "PARTNER_LOGOUT_MOBILE",
            "MOBILE_ACCESS",
            "CAMERA_WIFI_NETWORK_CHANGED",
            "CAMERA_FORCED_REBOOT",
            "FIRMWARE_UPDATE_CAMERA",
            "DELETE_CAMERA",
            "DELETE_USER",
            "DELETE_LOCATION",
            "DELETE_ROLE",
            "ERASE_CAMERA",
            "POLICY_UPDATE",
            "POLICY_DELETE",
            "POLICY_PAUSED_LOCATION",
            "POLICY_PAUSED_DEVICE",
            "CREATE_POLICY_ADDENDUM",
            "DEVICE_REGISTERED",
            "DEVICE_UPDATE",
            "DEVICE_SETTINGS_UPDATE",
            "DEVICE_FEATURE_UPDATE",
            "DEVICE_ORG_REASSIGN",
            "LICENSE_ASSIGNED",
            "LICENSE_CREATED",
            "USER_UPDATE",
            "USER_CREATE",
            "USER_IMPORT",
            "ROLE_CREATE",
            "POLICY_CREATE",
            "PARTNER_CLIENT_CREATE",
            "PARTNER_CUSTOMIZE_CLIENT",
            "PARTNER_CUSTOMIZE_CLIENT_DEVICE",
            "ORG_UPDATE",
            "DELETE_ORG",
            "DISABLE_ORG",
            "CREATE_ORG",
            "ROLE_UPDATE",
            "USER_ROLE_UPDATE",
            "TIMELAPSE_CREATE",
            "TIMELAPSE_DELETE",
            "ALERT_DISMISS",
            "ALL_ALERT_DISMISS",
            "SAVED_CLIP_CREATE",
            "SAVED_CLIP_DELETE",
            "SHARED_CLIP_DELETE",
            "SHARED_CLIP_CREATE",
            "SHARED_LINK_SENT",
            "SHARED_LIVE_VIDEO_STREAM_WITH_PASSWORD_CREATE",
            "SHARED_LIVE_VIDEO_STREAM_WITHOUT_PASSWORD_CREATE",
            "SHARED_LIVE_VIDEO_STREAM_DELETE",
            "SHARED_VIDEOWALL_WITH_PASSWORD_CREATE",
            "SHARED_VIDEOWALL_WITHOUT_PASSWORD_CREATE",
            "SHARED_VIDEOWALL_DELETE",
            "RAW_HTTP_STREAM_CREATED",
            "RAW_HTTP_STREAM_DELETED",
            "SETUP_VIRTUAL_MFA_DEVICE",
            "DELETE_VIRTUAL_MFA_DEVICE",
            "SETUP_SCIM_API_ACCESS",
            "REVOKE_SCIM_API_ACCESS",
            "AUDIT_EXPORT",
            "COUNT_EXPORT",
            "DIAGNOSTIC_EXPORT",
            "INVENTORY_EXPORT",
            "USERS_EXPORT",
            "UPTIME_EXPORT",
            "SUPPORT_TICKET_OPEN",
            "RMA_OPEN",
            "FEEDBACK_CREATE",
            "SUPPORT_ACCESS_GRANT",
            "SUPPORT_ACCESS_REVOKE",
            "SUPPORT_SEARCH_TICKETS",
            "ACCEPT_UAP",
            "ACCEPT_RHOMBUS_UAP",
            "ACCEPT_ALERTMONITORING_UAP",
            "UPLOAD_FACES",
            "CREATE_SEEKPOINT",
            "DELETE_CUSTOM_SEEKPOINT",
            "UPDATE_INTEGRATION_SAML",
            "UPDATE_INTEGRATION_SLACK",
            "UPDATE_INTEGRATION_SLACK_V2",
            "DELETE_INTEGRATION_SLACK_V2",
            "UPDATE_INTEGRATION_BOX",
            "DELETE_INTEGRATION_BOX",
            "UPDATE_INTEGRATION_GOOGLE",
            "DELETE_INTEGRATION_GOOGLE",
            "UPDATE_INTEGRATION_GOOGLE_V2",
            "DELETE_INTEGRATION_GOOGLE_V2",
            "UPDATE_INTEGRATION_PAGERDUTY",
            "DELETE_INTEGRATION_PAGERDUTY",
            "UPDATE_INTEGRATION_SERVICENOW",
            "DELETE_INTEGRATION_SERVICENOW",
            "UPDATE_INTEGRATION_OFFICE365",
            "DELETE_INTEGRATION_OFFICE365",
            "UPDATE_INTEGRATION_DROPBOX",
            "DELETE_INTEGRATION_DROPBOX",
            "UPDATE_INTEGRATION_SQUARE",
            "DELETE_INTEGRATION_SQUARE",
            "UPDATE_INTEGRATION_AWS",
            "DELETE_INTEGRATION_AWS",
            "UPDATE_INTEGRATION_HALO",
            "DELETE_INTEGRATION_HALO",
            "UPDATE_INTEGRATION_WEBHOOK",
            "DELETE_INTEGRATION_WEBHOOK",
            "UPDATE_INTEGRATION_EMAIL",
            "DELETE_INTEGRATION_EMAIL",
            "UPDATE_INTEGRATION_MATTERMOST",
            "DELETE_INTEGRATION_MATTERMOST",
            "UPDATE_INTEGRATION_OPENPATH",
            "DELETE_INTEGRATION_OPENPATH",
            "UPDATE_INTEGRATION_DICE",
            "DELETE_INTEGRATION_DICE",
            "UPDATE_INTEGRATION_LUMEO",
            "DELETE_INTEGRATION_LUMEO",
            "UPDATE_INTEGRATION_DEVICE",
            "DELETE_INTEGRATION_DEVICE",
            "UPDATE_INTEGRATION_GUESTMANAGEMENT",
            "DELETE_INTEGRATION_GUESTMANAGEMENT",
            "UPDATE_GUEST",
            "DELETE_GUEST",
            "UPDATE_INTEGRATION_OMNIALERT",
            "DELETE_INTEGRATION_OMNIALERT",
            "UPDATE_INTEGRATION_OPENTECHALLIANCE",
            "DELETE_INTEGRATION_OPENTECHALLIANCE",
            "UPDATE_INTEGRATION_TOAST",
            "DELETE_INTEGRATION_TOAST",
            "UPDATE_INTEGRATION_KISI",
            "DELETE_INTEGRATION_KISI",
            "UPDATE_INTEGRATION_BRIVO",
            "DELETE_INTEGRATION_BRIVO",
            "UPDATE_INTEGRATION_BUTTERFLYMX",
            "DELETE_INTEGRATION_BUTTERFLYMX",
            "UPDATE_INTEGRATION_ENVOY",
            "DELETE_INTEGRATION_ENVOY",
            "CREATE_ENVOY_INVITE",
            "UPDATE_INTEGRATION_SALTO",
            "UPDATE_INTEGRATION_PDK",
            "DELETE_INTEGRATION_PDK",
            "UPDATE_INTEGRATION_GENEA",
            "DELETE_INTEGRATION_GENEA",
            "UPDATE_INTEGRATION_MICROSOFTTEAMS",
            "DELETE_INTEGRATION_MICROSOFTTEAMS",
            "UPDATE_INTEGRATION_AMT",
            "DELETE_INTEGRATION_AMT",
            "UPDATE_INTEGRATION_PLACEOS",
            "DELETE_INTEGRATION_PLACEOS",
            "UPDATE_INTEGRATION_INTUIFACE",
            "DELETE_INTEGRATION_INTUIFACE",
            "UPDATE_INTEGRATION_INFORMACAST",
            "DELETE_INTEGRATION_INFORMACAST",
            "UPDATE_INTEGRATION_NOONLIGHT",
            "UPDATE_INTEGRATION_ALARM_MONITORING",
            "ENABLE_LIVE_ALARM_MONITORING",
            "CREATE_ALARM_MONITORING_SETTINGS",
            "UPDATE_ALARM_MONITORING_SETTINGS",
            "DELETE_ALARM_MONITORING_SETTINGS",
            "UPDATE_FACE",
            "REPORT_FACE_EVENT",
            "REPORT_VEHICLE_EVENT",
            "API_TOKEN_REQUEST",
            "API_TOKEN_REVOKE",
            "API_INVOCATION",
            "VIDEO_WALL_CREATE",
            "VIDEO_WALL_UPDATE",
            "VIDEO_WALL_DELETE",
            "VIEW_SHARE_TIMELAPSE",
            "VIEW_SHARE_CLIP",
            "VIEW_SHARE_STREAM",
            "VIEW_SHARE_VIDEOWALL",
            "VIEW_CAMERA_VOD",
            "CAMERA_POLICY_UPDATE",
            "CAMERA_POLICY_CREATE",
            "CAMERA_POLICY_DELETE",
            "TAG_POLICY_UPDATE",
            "TAG_POLICY_CREATE",
            "TAG_POLICY_DELETE",
            "CLIMATE_POLICY_UPDATE",
            "CLIMATE_POLICY_CREATE",
            "CLIMATE_POLICY_DELETE",
            "DOOR_POLICY_UPDATE",
            "DOOR_POLICY_CREATE",
            "DOOR_POLICY_DELETE",
            "DOOR_SCHEDULE_EXCEPTION_UPDATE",
            "DOOR_SCHEDULE_EXCEPTION_CREATE",
            "DOOR_SCHEDULE_EXCEPTION_DELETE",
            "ACCESS_CONTROLLED_DOOR_POLICY_UPDATE",
            "ACCESS_CONTROLLED_DOOR_POLICY_CREATE",
            "ACCESS_CONTROLLED_DOOR_POLICY_DELETE",
            "OCCUPANCY_POLICY_UPDATE",
            "OCCUPANCY_POLICY_CREATE",
            "OCCUPANCY_POLICY_DELETE",
            "AUDIO_POLICY_UPDATE",
            "AUDIO_POLICY_CREATE",
            "AUDIO_POLICY_DELETE",
            "SCHEDULE_CREATE",
            "SCHEDULE_DELETE",
            "SCHEDULE_UPDATE",
            "UPLOAD_FLOORPLAN",
            "ORG_AUDIO_RECORD_UPDATE",
            "DOOR_ACCESS_UNLOCK",
            "RHOMBUS_KEY_DOOR_UNLOCK",
            "UPLOAD_ACCESS_CONTROLLED_DOOR",
            "UPLOAD_USER_PROFILE_PICTURE",
            "ACCESS_GRANT_CREATE",
            "ACCESS_GRANT_UPDATE",
            "ACCESS_GRANT_DELETE",
            "ACCESS_REVOCATION_CREATE",
            "ACCESS_REVOCATION_UPDATE",
            "ACCESS_REVOCATION_DELETE",
            "ACCESS_CONTROLLED_DOOR_CREATE",
            "ACCESS_CONTROLLED_DOOR_UPDATE",
            "ACCESS_CONTROLLED_DOOR_DELETE",
            "AC_CRED_RHOMBUS_SECURE_CSN_CREATE",
            "AC_CRED_RHOMBUS_SECURE_CSN_UPDATE",
            "AC_CRED_RHOMBUS_SECURE_CSN_DELETE",
            "AC_CRED_RHOMBUS_SECURE_CSN_REVOKED",
            "AC_CRED_STANDARD_CSN_CREATE",
            "AC_CRED_STANDARD_CSN_UPDATE",
            "AC_CRED_STANDARD_CSN_DELETE",
            "AC_CRED_STANDARD_CSN_REVOKED",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_CREATE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_UPDATE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_DELETE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_REVOKED",
            "AC_CRED_WIEGAND_CREATE",
            "AC_CRED_WIEGAND_UPDATE",
            "AC_CRED_WIEGAND_DELETE",
            "AC_CRED_WIEGAND_REVOKED",
            "AC_LOCKDOWN_PLAN_CREATED",
            "AC_LOCKDOWN_PLAN_UPDATED",
            "AC_LOCKDOWN_PLAN_DELETED",
            "AC_LOCKDOWN_ACTIVATED",
            "AC_LOCKDOWN_DEACTIVATED",
            "RULE_CREATE",
            "RULE_DELETE",
            "RULE_UPDATE",
            "RULE_PAUSE",
            "UNKNOWN",
          ])
          .nullable()
      )
      .max(50)
      .nullable(),
    includeActions: z
      .array(
        z
          .enum([
            "THREAT_CASE_ESCALATED",
            "THREAT_CASE_CANCELLED",
            "THREAT_CASE_DISMISSED",
            "THREAT_CASE_DELETED",
            "PIN_CREATED",
            "PIN_DELETED",
            "BASIC_AUTH_SUCCESS",
            "BASIC_AUTH_FAILURE",
            "SAML_LOGIN_WEB",
            "LOGIN_WEB",
            "PASSWORDLESS_LOGIN_WEB",
            "PARTNER_LOGIN_WEB",
            "PARTNER_PASSWORDLESS_LOGIN_WEB",
            "SAML_LOGIN_FAILURE_WEB",
            "LOGIN_FAILURE_WEB",
            "RHOMBUS_KEY_LOGIN",
            "RHOMBUS_KEY_PASSWORDLESS_LOGIN",
            "RHOMBUS_KEY_SAML_LOGIN",
            "LOGOUT_WEB",
            "PARTNER_LOGOUT_WEB",
            "WEB_CONSOLE_ACCESS",
            "MOBILE_CONSOLE_ACCESS",
            "SAML_LOGIN_MOBILE",
            "PARTNER_LOGIN_MOBILE",
            "PARTNER_PASSWORDLESS_LOGIN_MOBILE",
            "LOGIN_MOBILE",
            "PASSWORDLESS_LOGIN_MOBILE",
            "SAML_LOGIN_FAILURE_MOBILE",
            "LOGIN_FAILURE_MOBILE",
            "LOGOUT_MOBILE",
            "PARTNER_LOGOUT_MOBILE",
            "MOBILE_ACCESS",
            "CAMERA_WIFI_NETWORK_CHANGED",
            "CAMERA_FORCED_REBOOT",
            "FIRMWARE_UPDATE_CAMERA",
            "DELETE_CAMERA",
            "DELETE_USER",
            "DELETE_LOCATION",
            "DELETE_ROLE",
            "ERASE_CAMERA",
            "POLICY_UPDATE",
            "POLICY_DELETE",
            "POLICY_PAUSED_LOCATION",
            "POLICY_PAUSED_DEVICE",
            "CREATE_POLICY_ADDENDUM",
            "DEVICE_REGISTERED",
            "DEVICE_UPDATE",
            "DEVICE_SETTINGS_UPDATE",
            "DEVICE_FEATURE_UPDATE",
            "DEVICE_ORG_REASSIGN",
            "LICENSE_ASSIGNED",
            "LICENSE_CREATED",
            "USER_UPDATE",
            "USER_CREATE",
            "USER_IMPORT",
            "ROLE_CREATE",
            "POLICY_CREATE",
            "PARTNER_CLIENT_CREATE",
            "PARTNER_CUSTOMIZE_CLIENT",
            "PARTNER_CUSTOMIZE_CLIENT_DEVICE",
            "ORG_UPDATE",
            "DELETE_ORG",
            "DISABLE_ORG",
            "CREATE_ORG",
            "ROLE_UPDATE",
            "USER_ROLE_UPDATE",
            "TIMELAPSE_CREATE",
            "TIMELAPSE_DELETE",
            "ALERT_DISMISS",
            "ALL_ALERT_DISMISS",
            "SAVED_CLIP_CREATE",
            "SAVED_CLIP_DELETE",
            "SHARED_CLIP_DELETE",
            "SHARED_CLIP_CREATE",
            "SHARED_LINK_SENT",
            "SHARED_LIVE_VIDEO_STREAM_WITH_PASSWORD_CREATE",
            "SHARED_LIVE_VIDEO_STREAM_WITHOUT_PASSWORD_CREATE",
            "SHARED_LIVE_VIDEO_STREAM_DELETE",
            "SHARED_VIDEOWALL_WITH_PASSWORD_CREATE",
            "SHARED_VIDEOWALL_WITHOUT_PASSWORD_CREATE",
            "SHARED_VIDEOWALL_DELETE",
            "RAW_HTTP_STREAM_CREATED",
            "RAW_HTTP_STREAM_DELETED",
            "SETUP_VIRTUAL_MFA_DEVICE",
            "DELETE_VIRTUAL_MFA_DEVICE",
            "SETUP_SCIM_API_ACCESS",
            "REVOKE_SCIM_API_ACCESS",
            "AUDIT_EXPORT",
            "COUNT_EXPORT",
            "DIAGNOSTIC_EXPORT",
            "INVENTORY_EXPORT",
            "USERS_EXPORT",
            "UPTIME_EXPORT",
            "SUPPORT_TICKET_OPEN",
            "RMA_OPEN",
            "FEEDBACK_CREATE",
            "SUPPORT_ACCESS_GRANT",
            "SUPPORT_ACCESS_REVOKE",
            "SUPPORT_SEARCH_TICKETS",
            "ACCEPT_UAP",
            "ACCEPT_RHOMBUS_UAP",
            "ACCEPT_ALERTMONITORING_UAP",
            "UPLOAD_FACES",
            "CREATE_SEEKPOINT",
            "DELETE_CUSTOM_SEEKPOINT",
            "UPDATE_INTEGRATION_SAML",
            "UPDATE_INTEGRATION_SLACK",
            "UPDATE_INTEGRATION_SLACK_V2",
            "DELETE_INTEGRATION_SLACK_V2",
            "UPDATE_INTEGRATION_BOX",
            "DELETE_INTEGRATION_BOX",
            "UPDATE_INTEGRATION_GOOGLE",
            "DELETE_INTEGRATION_GOOGLE",
            "UPDATE_INTEGRATION_GOOGLE_V2",
            "DELETE_INTEGRATION_GOOGLE_V2",
            "UPDATE_INTEGRATION_PAGERDUTY",
            "DELETE_INTEGRATION_PAGERDUTY",
            "UPDATE_INTEGRATION_SERVICENOW",
            "DELETE_INTEGRATION_SERVICENOW",
            "UPDATE_INTEGRATION_OFFICE365",
            "DELETE_INTEGRATION_OFFICE365",
            "UPDATE_INTEGRATION_DROPBOX",
            "DELETE_INTEGRATION_DROPBOX",
            "UPDATE_INTEGRATION_SQUARE",
            "DELETE_INTEGRATION_SQUARE",
            "UPDATE_INTEGRATION_AWS",
            "DELETE_INTEGRATION_AWS",
            "UPDATE_INTEGRATION_HALO",
            "DELETE_INTEGRATION_HALO",
            "UPDATE_INTEGRATION_WEBHOOK",
            "DELETE_INTEGRATION_WEBHOOK",
            "UPDATE_INTEGRATION_EMAIL",
            "DELETE_INTEGRATION_EMAIL",
            "UPDATE_INTEGRATION_MATTERMOST",
            "DELETE_INTEGRATION_MATTERMOST",
            "UPDATE_INTEGRATION_OPENPATH",
            "DELETE_INTEGRATION_OPENPATH",
            "UPDATE_INTEGRATION_DICE",
            "DELETE_INTEGRATION_DICE",
            "UPDATE_INTEGRATION_LUMEO",
            "DELETE_INTEGRATION_LUMEO",
            "UPDATE_INTEGRATION_DEVICE",
            "DELETE_INTEGRATION_DEVICE",
            "UPDATE_INTEGRATION_GUESTMANAGEMENT",
            "DELETE_INTEGRATION_GUESTMANAGEMENT",
            "UPDATE_GUEST",
            "DELETE_GUEST",
            "UPDATE_INTEGRATION_OMNIALERT",
            "DELETE_INTEGRATION_OMNIALERT",
            "UPDATE_INTEGRATION_OPENTECHALLIANCE",
            "DELETE_INTEGRATION_OPENTECHALLIANCE",
            "UPDATE_INTEGRATION_TOAST",
            "DELETE_INTEGRATION_TOAST",
            "UPDATE_INTEGRATION_KISI",
            "DELETE_INTEGRATION_KISI",
            "UPDATE_INTEGRATION_BRIVO",
            "DELETE_INTEGRATION_BRIVO",
            "UPDATE_INTEGRATION_BUTTERFLYMX",
            "DELETE_INTEGRATION_BUTTERFLYMX",
            "UPDATE_INTEGRATION_ENVOY",
            "DELETE_INTEGRATION_ENVOY",
            "CREATE_ENVOY_INVITE",
            "UPDATE_INTEGRATION_SALTO",
            "UPDATE_INTEGRATION_PDK",
            "DELETE_INTEGRATION_PDK",
            "UPDATE_INTEGRATION_GENEA",
            "DELETE_INTEGRATION_GENEA",
            "UPDATE_INTEGRATION_MICROSOFTTEAMS",
            "DELETE_INTEGRATION_MICROSOFTTEAMS",
            "UPDATE_INTEGRATION_AMT",
            "DELETE_INTEGRATION_AMT",
            "UPDATE_INTEGRATION_PLACEOS",
            "DELETE_INTEGRATION_PLACEOS",
            "UPDATE_INTEGRATION_INTUIFACE",
            "DELETE_INTEGRATION_INTUIFACE",
            "UPDATE_INTEGRATION_INFORMACAST",
            "DELETE_INTEGRATION_INFORMACAST",
            "UPDATE_INTEGRATION_NOONLIGHT",
            "UPDATE_INTEGRATION_ALARM_MONITORING",
            "ENABLE_LIVE_ALARM_MONITORING",
            "CREATE_ALARM_MONITORING_SETTINGS",
            "UPDATE_ALARM_MONITORING_SETTINGS",
            "DELETE_ALARM_MONITORING_SETTINGS",
            "UPDATE_FACE",
            "REPORT_FACE_EVENT",
            "REPORT_VEHICLE_EVENT",
            "API_TOKEN_REQUEST",
            "API_TOKEN_REVOKE",
            "API_INVOCATION",
            "VIDEO_WALL_CREATE",
            "VIDEO_WALL_UPDATE",
            "VIDEO_WALL_DELETE",
            "VIEW_SHARE_TIMELAPSE",
            "VIEW_SHARE_CLIP",
            "VIEW_SHARE_STREAM",
            "VIEW_SHARE_VIDEOWALL",
            "VIEW_CAMERA_VOD",
            "CAMERA_POLICY_UPDATE",
            "CAMERA_POLICY_CREATE",
            "CAMERA_POLICY_DELETE",
            "TAG_POLICY_UPDATE",
            "TAG_POLICY_CREATE",
            "TAG_POLICY_DELETE",
            "CLIMATE_POLICY_UPDATE",
            "CLIMATE_POLICY_CREATE",
            "CLIMATE_POLICY_DELETE",
            "DOOR_POLICY_UPDATE",
            "DOOR_POLICY_CREATE",
            "DOOR_POLICY_DELETE",
            "DOOR_SCHEDULE_EXCEPTION_UPDATE",
            "DOOR_SCHEDULE_EXCEPTION_CREATE",
            "DOOR_SCHEDULE_EXCEPTION_DELETE",
            "ACCESS_CONTROLLED_DOOR_POLICY_UPDATE",
            "ACCESS_CONTROLLED_DOOR_POLICY_CREATE",
            "ACCESS_CONTROLLED_DOOR_POLICY_DELETE",
            "OCCUPANCY_POLICY_UPDATE",
            "OCCUPANCY_POLICY_CREATE",
            "OCCUPANCY_POLICY_DELETE",
            "AUDIO_POLICY_UPDATE",
            "AUDIO_POLICY_CREATE",
            "AUDIO_POLICY_DELETE",
            "SCHEDULE_CREATE",
            "SCHEDULE_DELETE",
            "SCHEDULE_UPDATE",
            "UPLOAD_FLOORPLAN",
            "ORG_AUDIO_RECORD_UPDATE",
            "DOOR_ACCESS_UNLOCK",
            "RHOMBUS_KEY_DOOR_UNLOCK",
            "UPLOAD_ACCESS_CONTROLLED_DOOR",
            "UPLOAD_USER_PROFILE_PICTURE",
            "ACCESS_GRANT_CREATE",
            "ACCESS_GRANT_UPDATE",
            "ACCESS_GRANT_DELETE",
            "ACCESS_REVOCATION_CREATE",
            "ACCESS_REVOCATION_UPDATE",
            "ACCESS_REVOCATION_DELETE",
            "ACCESS_CONTROLLED_DOOR_CREATE",
            "ACCESS_CONTROLLED_DOOR_UPDATE",
            "ACCESS_CONTROLLED_DOOR_DELETE",
            "AC_CRED_RHOMBUS_SECURE_CSN_CREATE",
            "AC_CRED_RHOMBUS_SECURE_CSN_UPDATE",
            "AC_CRED_RHOMBUS_SECURE_CSN_DELETE",
            "AC_CRED_RHOMBUS_SECURE_CSN_REVOKED",
            "AC_CRED_STANDARD_CSN_CREATE",
            "AC_CRED_STANDARD_CSN_UPDATE",
            "AC_CRED_STANDARD_CSN_DELETE",
            "AC_CRED_STANDARD_CSN_REVOKED",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_CREATE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_UPDATE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_DELETE",
            "AC_CRED_RHOMBUS_SECURE_MOBILE_REVOKED",
            "AC_CRED_WIEGAND_CREATE",
            "AC_CRED_WIEGAND_UPDATE",
            "AC_CRED_WIEGAND_DELETE",
            "AC_CRED_WIEGAND_REVOKED",
            "AC_LOCKDOWN_PLAN_CREATED",
            "AC_LOCKDOWN_PLAN_UPDATED",
            "AC_LOCKDOWN_PLAN_DELETED",
            "AC_LOCKDOWN_ACTIVATED",
            "AC_LOCKDOWN_DEACTIVATED",
            "RULE_CREATE",
            "RULE_DELETE",
            "RULE_UPDATE",
            "RULE_PAUSE",
            "UNKNOWN",
          ])
          .nullable()
      )
      .max(50)
      .nullable(),
    timestampMsAfter: z.number().int().nullable(),
    timestampMsBefore: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Report_AuditEventWeb = z
  .object({
    FOOBAR: z.string().nullable(),
    action: z
      .enum([
        "THREAT_CASE_ESCALATED",
        "THREAT_CASE_CANCELLED",
        "THREAT_CASE_DISMISSED",
        "THREAT_CASE_DELETED",
        "PIN_CREATED",
        "PIN_DELETED",
        "BASIC_AUTH_SUCCESS",
        "BASIC_AUTH_FAILURE",
        "SAML_LOGIN_WEB",
        "LOGIN_WEB",
        "PASSWORDLESS_LOGIN_WEB",
        "PARTNER_LOGIN_WEB",
        "PARTNER_PASSWORDLESS_LOGIN_WEB",
        "SAML_LOGIN_FAILURE_WEB",
        "LOGIN_FAILURE_WEB",
        "RHOMBUS_KEY_LOGIN",
        "RHOMBUS_KEY_PASSWORDLESS_LOGIN",
        "RHOMBUS_KEY_SAML_LOGIN",
        "LOGOUT_WEB",
        "PARTNER_LOGOUT_WEB",
        "WEB_CONSOLE_ACCESS",
        "MOBILE_CONSOLE_ACCESS",
        "SAML_LOGIN_MOBILE",
        "PARTNER_LOGIN_MOBILE",
        "PARTNER_PASSWORDLESS_LOGIN_MOBILE",
        "LOGIN_MOBILE",
        "PASSWORDLESS_LOGIN_MOBILE",
        "SAML_LOGIN_FAILURE_MOBILE",
        "LOGIN_FAILURE_MOBILE",
        "LOGOUT_MOBILE",
        "PARTNER_LOGOUT_MOBILE",
        "MOBILE_ACCESS",
        "CAMERA_WIFI_NETWORK_CHANGED",
        "CAMERA_FORCED_REBOOT",
        "FIRMWARE_UPDATE_CAMERA",
        "DELETE_CAMERA",
        "DELETE_USER",
        "DELETE_LOCATION",
        "DELETE_ROLE",
        "ERASE_CAMERA",
        "POLICY_UPDATE",
        "POLICY_DELETE",
        "POLICY_PAUSED_LOCATION",
        "POLICY_PAUSED_DEVICE",
        "CREATE_POLICY_ADDENDUM",
        "DEVICE_REGISTERED",
        "DEVICE_UPDATE",
        "DEVICE_SETTINGS_UPDATE",
        "DEVICE_FEATURE_UPDATE",
        "DEVICE_ORG_REASSIGN",
        "LICENSE_ASSIGNED",
        "LICENSE_CREATED",
        "USER_UPDATE",
        "USER_CREATE",
        "USER_IMPORT",
        "ROLE_CREATE",
        "POLICY_CREATE",
        "PARTNER_CLIENT_CREATE",
        "PARTNER_CUSTOMIZE_CLIENT",
        "PARTNER_CUSTOMIZE_CLIENT_DEVICE",
        "ORG_UPDATE",
        "DELETE_ORG",
        "DISABLE_ORG",
        "CREATE_ORG",
        "ROLE_UPDATE",
        "USER_ROLE_UPDATE",
        "TIMELAPSE_CREATE",
        "TIMELAPSE_DELETE",
        "ALERT_DISMISS",
        "ALL_ALERT_DISMISS",
        "SAVED_CLIP_CREATE",
        "SAVED_CLIP_DELETE",
        "SHARED_CLIP_DELETE",
        "SHARED_CLIP_CREATE",
        "SHARED_LINK_SENT",
        "SHARED_LIVE_VIDEO_STREAM_WITH_PASSWORD_CREATE",
        "SHARED_LIVE_VIDEO_STREAM_WITHOUT_PASSWORD_CREATE",
        "SHARED_LIVE_VIDEO_STREAM_DELETE",
        "SHARED_VIDEOWALL_WITH_PASSWORD_CREATE",
        "SHARED_VIDEOWALL_WITHOUT_PASSWORD_CREATE",
        "SHARED_VIDEOWALL_DELETE",
        "RAW_HTTP_STREAM_CREATED",
        "RAW_HTTP_STREAM_DELETED",
        "SETUP_VIRTUAL_MFA_DEVICE",
        "DELETE_VIRTUAL_MFA_DEVICE",
        "SETUP_SCIM_API_ACCESS",
        "REVOKE_SCIM_API_ACCESS",
        "AUDIT_EXPORT",
        "COUNT_EXPORT",
        "DIAGNOSTIC_EXPORT",
        "INVENTORY_EXPORT",
        "USERS_EXPORT",
        "UPTIME_EXPORT",
        "SUPPORT_TICKET_OPEN",
        "RMA_OPEN",
        "FEEDBACK_CREATE",
        "SUPPORT_ACCESS_GRANT",
        "SUPPORT_ACCESS_REVOKE",
        "SUPPORT_SEARCH_TICKETS",
        "ACCEPT_UAP",
        "ACCEPT_RHOMBUS_UAP",
        "ACCEPT_ALERTMONITORING_UAP",
        "UPLOAD_FACES",
        "CREATE_SEEKPOINT",
        "DELETE_CUSTOM_SEEKPOINT",
        "UPDATE_INTEGRATION_SAML",
        "UPDATE_INTEGRATION_SLACK",
        "UPDATE_INTEGRATION_SLACK_V2",
        "DELETE_INTEGRATION_SLACK_V2",
        "UPDATE_INTEGRATION_BOX",
        "DELETE_INTEGRATION_BOX",
        "UPDATE_INTEGRATION_GOOGLE",
        "DELETE_INTEGRATION_GOOGLE",
        "UPDATE_INTEGRATION_GOOGLE_V2",
        "DELETE_INTEGRATION_GOOGLE_V2",
        "UPDATE_INTEGRATION_PAGERDUTY",
        "DELETE_INTEGRATION_PAGERDUTY",
        "UPDATE_INTEGRATION_SERVICENOW",
        "DELETE_INTEGRATION_SERVICENOW",
        "UPDATE_INTEGRATION_OFFICE365",
        "DELETE_INTEGRATION_OFFICE365",
        "UPDATE_INTEGRATION_DROPBOX",
        "DELETE_INTEGRATION_DROPBOX",
        "UPDATE_INTEGRATION_SQUARE",
        "DELETE_INTEGRATION_SQUARE",
        "UPDATE_INTEGRATION_AWS",
        "DELETE_INTEGRATION_AWS",
        "UPDATE_INTEGRATION_HALO",
        "DELETE_INTEGRATION_HALO",
        "UPDATE_INTEGRATION_WEBHOOK",
        "DELETE_INTEGRATION_WEBHOOK",
        "UPDATE_INTEGRATION_EMAIL",
        "DELETE_INTEGRATION_EMAIL",
        "UPDATE_INTEGRATION_MATTERMOST",
        "DELETE_INTEGRATION_MATTERMOST",
        "UPDATE_INTEGRATION_OPENPATH",
        "DELETE_INTEGRATION_OPENPATH",
        "UPDATE_INTEGRATION_DICE",
        "DELETE_INTEGRATION_DICE",
        "UPDATE_INTEGRATION_LUMEO",
        "DELETE_INTEGRATION_LUMEO",
        "UPDATE_INTEGRATION_DEVICE",
        "DELETE_INTEGRATION_DEVICE",
        "UPDATE_INTEGRATION_GUESTMANAGEMENT",
        "DELETE_INTEGRATION_GUESTMANAGEMENT",
        "UPDATE_GUEST",
        "DELETE_GUEST",
        "UPDATE_INTEGRATION_OMNIALERT",
        "DELETE_INTEGRATION_OMNIALERT",
        "UPDATE_INTEGRATION_OPENTECHALLIANCE",
        "DELETE_INTEGRATION_OPENTECHALLIANCE",
        "UPDATE_INTEGRATION_TOAST",
        "DELETE_INTEGRATION_TOAST",
        "UPDATE_INTEGRATION_KISI",
        "DELETE_INTEGRATION_KISI",
        "UPDATE_INTEGRATION_BRIVO",
        "DELETE_INTEGRATION_BRIVO",
        "UPDATE_INTEGRATION_BUTTERFLYMX",
        "DELETE_INTEGRATION_BUTTERFLYMX",
        "UPDATE_INTEGRATION_ENVOY",
        "DELETE_INTEGRATION_ENVOY",
        "CREATE_ENVOY_INVITE",
        "UPDATE_INTEGRATION_SALTO",
        "UPDATE_INTEGRATION_PDK",
        "DELETE_INTEGRATION_PDK",
        "UPDATE_INTEGRATION_GENEA",
        "DELETE_INTEGRATION_GENEA",
        "UPDATE_INTEGRATION_MICROSOFTTEAMS",
        "DELETE_INTEGRATION_MICROSOFTTEAMS",
        "UPDATE_INTEGRATION_AMT",
        "DELETE_INTEGRATION_AMT",
        "UPDATE_INTEGRATION_PLACEOS",
        "DELETE_INTEGRATION_PLACEOS",
        "UPDATE_INTEGRATION_INTUIFACE",
        "DELETE_INTEGRATION_INTUIFACE",
        "UPDATE_INTEGRATION_INFORMACAST",
        "DELETE_INTEGRATION_INFORMACAST",
        "UPDATE_INTEGRATION_NOONLIGHT",
        "UPDATE_INTEGRATION_ALARM_MONITORING",
        "ENABLE_LIVE_ALARM_MONITORING",
        "CREATE_ALARM_MONITORING_SETTINGS",
        "UPDATE_ALARM_MONITORING_SETTINGS",
        "DELETE_ALARM_MONITORING_SETTINGS",
        "UPDATE_FACE",
        "REPORT_FACE_EVENT",
        "REPORT_VEHICLE_EVENT",
        "API_TOKEN_REQUEST",
        "API_TOKEN_REVOKE",
        "API_INVOCATION",
        "VIDEO_WALL_CREATE",
        "VIDEO_WALL_UPDATE",
        "VIDEO_WALL_DELETE",
        "VIEW_SHARE_TIMELAPSE",
        "VIEW_SHARE_CLIP",
        "VIEW_SHARE_STREAM",
        "VIEW_SHARE_VIDEOWALL",
        "VIEW_CAMERA_VOD",
        "CAMERA_POLICY_UPDATE",
        "CAMERA_POLICY_CREATE",
        "CAMERA_POLICY_DELETE",
        "TAG_POLICY_UPDATE",
        "TAG_POLICY_CREATE",
        "TAG_POLICY_DELETE",
        "CLIMATE_POLICY_UPDATE",
        "CLIMATE_POLICY_CREATE",
        "CLIMATE_POLICY_DELETE",
        "DOOR_POLICY_UPDATE",
        "DOOR_POLICY_CREATE",
        "DOOR_POLICY_DELETE",
        "DOOR_SCHEDULE_EXCEPTION_UPDATE",
        "DOOR_SCHEDULE_EXCEPTION_CREATE",
        "DOOR_SCHEDULE_EXCEPTION_DELETE",
        "ACCESS_CONTROLLED_DOOR_POLICY_UPDATE",
        "ACCESS_CONTROLLED_DOOR_POLICY_CREATE",
        "ACCESS_CONTROLLED_DOOR_POLICY_DELETE",
        "OCCUPANCY_POLICY_UPDATE",
        "OCCUPANCY_POLICY_CREATE",
        "OCCUPANCY_POLICY_DELETE",
        "AUDIO_POLICY_UPDATE",
        "AUDIO_POLICY_CREATE",
        "AUDIO_POLICY_DELETE",
        "SCHEDULE_CREATE",
        "SCHEDULE_DELETE",
        "SCHEDULE_UPDATE",
        "UPLOAD_FLOORPLAN",
        "ORG_AUDIO_RECORD_UPDATE",
        "DOOR_ACCESS_UNLOCK",
        "RHOMBUS_KEY_DOOR_UNLOCK",
        "UPLOAD_ACCESS_CONTROLLED_DOOR",
        "UPLOAD_USER_PROFILE_PICTURE",
        "ACCESS_GRANT_CREATE",
        "ACCESS_GRANT_UPDATE",
        "ACCESS_GRANT_DELETE",
        "ACCESS_REVOCATION_CREATE",
        "ACCESS_REVOCATION_UPDATE",
        "ACCESS_REVOCATION_DELETE",
        "ACCESS_CONTROLLED_DOOR_CREATE",
        "ACCESS_CONTROLLED_DOOR_UPDATE",
        "ACCESS_CONTROLLED_DOOR_DELETE",
        "AC_CRED_RHOMBUS_SECURE_CSN_CREATE",
        "AC_CRED_RHOMBUS_SECURE_CSN_UPDATE",
        "AC_CRED_RHOMBUS_SECURE_CSN_DELETE",
        "AC_CRED_RHOMBUS_SECURE_CSN_REVOKED",
        "AC_CRED_STANDARD_CSN_CREATE",
        "AC_CRED_STANDARD_CSN_UPDATE",
        "AC_CRED_STANDARD_CSN_DELETE",
        "AC_CRED_STANDARD_CSN_REVOKED",
        "AC_CRED_RHOMBUS_SECURE_MOBILE_CREATE",
        "AC_CRED_RHOMBUS_SECURE_MOBILE_UPDATE",
        "AC_CRED_RHOMBUS_SECURE_MOBILE_DELETE",
        "AC_CRED_RHOMBUS_SECURE_MOBILE_REVOKED",
        "AC_CRED_WIEGAND_CREATE",
        "AC_CRED_WIEGAND_UPDATE",
        "AC_CRED_WIEGAND_DELETE",
        "AC_CRED_WIEGAND_REVOKED",
        "AC_LOCKDOWN_PLAN_CREATED",
        "AC_LOCKDOWN_PLAN_UPDATED",
        "AC_LOCKDOWN_PLAN_DELETED",
        "AC_LOCKDOWN_ACTIVATED",
        "AC_LOCKDOWN_DEACTIVATED",
        "RULE_CREATE",
        "RULE_DELETE",
        "RULE_UPDATE",
        "RULE_PAUSE",
        "UNKNOWN",
      ])
      .nullable(),
    asi: z.string().nullable(),
    clientType: z
      .enum([
        "DEVICE",
        "MOBILE",
        "BROWSER",
        "BROWSER_V2",
        "BROWSER_PARTNER",
        "MOBILE_PARTNER",
        "ANONYMOUS",
        "SHARE_ANONYMOUS",
        "SHARE_ANONYMOUS_V2",
        "SHARE_RAW",
        "TV_API",
        "API",
        "API_TOKEN",
        "PARTNER_API",
        "PARTNER_API_TOKEN",
        "KEYPAD_API",
        "INTERNAL_SALESFORCE",
        "RHOMBUS_KEY_MOBILE",
      ])
      .nullable(),
    displayText: z.string().nullable(),
    failure: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    principalName: z.string().nullable(),
    principalType: z
      .enum(["USER", "DEVICE", "PARTNER", "RHOMBUS_SUPPORT", "API_TOKEN", "UNKNOWN"])
      .nullable(),
    principalUuid: z.string().nullable(),
    sourceCity: z.string().nullable(),
    sourceCountry: z.string().nullable(),
    sourceIp: z.string().nullable(),
    sourceState: z.string().nullable(),
    targetName: z.string().nullable(),
    targetUuid: z.string().nullable(),
    timestamp: z.string().datetime({ offset: true }).nullable(),
    userAgent: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetAuditFeedWSResponse = z
  .object({
    auditEvents: z.array(Report_AuditEventWeb).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetAverageReportWSRequest = z
  .object({
    endDate: z.string().nullable(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    scope: z.enum(["DEVICE", "LOCATION", "ORG"]).nullable(),
    startDate: z.string().nullable(),
    type: z
      .enum([
        "CROWD",
        "PEOPLE",
        "FACES",
        "MOTION",
        "BANDWIDTH",
        "VEHICLES",
        "LICENSEPLATES",
        "ALERTS",
      ])
      .nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetAverageReportWSResponse = z
  .object({
    average: z.number().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    groupAverageMap: z.record(z.number().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetAverageReportsWSRequest = z
  .object({
    endDate: z.string().nullable(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    scope: z.enum(["DEVICE", "LOCATION", "ORG"]).nullable(),
    startDate: z.string().nullable(),
    type: z
      .enum([
        "CROWD",
        "PEOPLE",
        "FACES",
        "MOTION",
        "BANDWIDTH",
        "VEHICLES",
        "LICENSEPLATES",
        "ALERTS",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const Report_GetAverageReportsWSResponse = z
  .object({
    averageMap: z.record(z.number().nullable()).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    groupAverageMap: z.record(z.record(z.number().nullable()).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetCountReportV2WSRequest = z
  .object({
    endDate: z.string().nullish(),
    endTimeMs: z.number().int().gte(0).nullish(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    scope: z.enum(["DEVICE", "LOCATION", "ORG"]).nullable(),
    startDate: z.string().nullish(),
    startTimeMs: z.number().int().gte(0).nullish(),
    types: z
      .array(
        z
          .enum([
            "CROWD",
            "PEOPLE",
            "FACES",
            "MOTION",
            "BANDWIDTH",
            "VEHICLES",
            "LICENSEPLATES",
            "ALERTS",
          ])
          .nullable()
      )
      .nullable(),
    uuid: z.string().nullish(),
  })
  .passthrough();
const TimeSeriesDataPointV2Type = z
  .object({
    dateLocal: z.string().nullable(),
    dateUtc: z.string().nullable(),
    eventCountMap: z.record(z.number().int().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetCountReportWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    timeSeriesDataPoints: z.array(TimeSeriesDataPointV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetCountReportsWSRequest = z
  .object({
    endDate: z.string().nullish(),
    endTimeMs: z.number().int().gte(0).nullish(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    scope: z.enum(["DEVICE", "LOCATION", "ORG"]).nullable(),
    startDate: z.string().nullish(),
    startTimeMs: z.number().int().gte(0).nullish(),
    type: z
      .enum([
        "CROWD",
        "PEOPLE",
        "FACES",
        "MOTION",
        "BANDWIDTH",
        "VEHICLES",
        "LICENSEPLATES",
        "ALERTS",
      ])
      .nullable(),
  })
  .passthrough();
const Report_GetCountReportsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    timeSeriesDataPointsMap: z.record(z.array(TimeSeriesDataPointV2Type).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetDiagnosticFeedWSRequest = z
  .object({
    timestampMsAfter: z.number().int().nullable(),
    timestampMsBefore: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const DiagnosticEventType = z
  .object({
    activity: z
      .enum([
        "CAMERA_CONNECTED",
        "CAMERA_DISCONNECTED",
        "STARTUP",
        "UPDATE_STARTED",
        "UPDATE_FIRMWARE_DOWNLOADED",
        "UPDATE_FIRMWARE_APPLIED",
        "UPDATE_STARTING_REBOOT",
        "UPDATE_FAILED_MD5_MISMATCH",
        "UPDATE_FAILED_ACCESS_DENIED",
        "UPDATE_FAILED_MITM",
        "UPDATE_FAILED_CONNNECTION_REFUSED",
        "UPDATE_FAILED_CONNNECTION_TIMEOUT",
        "UPDATE_FAILED_CONNECTION_REFUSED",
        "UPDATE_FAILED_CONNECTION_TIMEOUT",
        "UPDATE_FAILED_DNS_FAILURE",
        "UPDATE_RUNNING",
        "BLE_CONNECTED",
        "BLE_CONNECTION_FAILED",
        "BLE_DISCONNECTED",
        "BLE_OP_SUCCESS",
        "BLE_OP_FAILURE",
        "UPLOAD_CLIP_SUCCESS",
        "UPLOAD_CLIP_FAILURE",
        "NOTIFICATION_FAILURE",
        "USB_FAILURE_REBOOT",
        "PERSISTENT_STORAGE_FAILURE",
        "PING",
        "FORCED_REBOOT",
        "AUTO_REBOOT",
        "AUDIO_HARDWARE_NOT_DETECTED",
        "ENCRYPTED_CONTAINER_FAILURE_CREATE",
        "ENCRYPTED_CONTAINER_FAILURE_OPEN",
        "ENCRYPTED_CONTAINER_FAILURE_MOUNT",
        "VIDEO_HARDWARE_FAILURE",
        "WIFI_NETWORK_CHANGED",
        "AI_ENGINE_DOWNLOADED",
        "AI_ENGINE_DOWNLOAD_FAILED_MD5_MISMATCH",
        "AI_ENGINE_CONFIGURED",
        "AI_ENGINE_CONFIGURATION_FAILED",
        "MITM_FAILURE",
        "SERVER_RECONNECT",
        "AP_CHANGED",
        "WATCHDOG_KILLED_AGENT",
        "WATCHDOG_DID_RESET",
        "CLIMATE_OFFLINE",
        "CLIMATE_ONLINE",
        "CLIMATE_LOW_BATTERY",
        "CLIMATE_PROBE_CONNECTED",
        "CLIMATE_PROBE_DISCONNECTED",
        "DOOR_OFFLINE",
        "DOOR_ONLINE",
        "DOOR_LOW_BATTERY",
        "OCCUPANCY_SENSOR_ONLINE",
        "OCCUPANCY_SENSOR_OFFLINE",
        "OCCUPANCY_SENSOR_LOW_BATTERY",
        "BUTTON_OFFLINE",
        "BUTTON_ONLINE",
        "BUTTON_LOW_BATTERY",
        "PROXIMITY_LOW_BATTERY",
        "DOOR_CONTROLLER_CONNECTED",
        "DOOR_CONTROLLER_DISCONNECTED",
        "BADGE_READER_CONNECTED",
        "BADGE_READER_DISCONNECTED",
        "REBOOT",
        "NETWORK_INTERRUPTION",
        "OPENPATH_WEBHOOK_FAILURE",
        "TOAST_WEBHOOK_FAILURE",
        "KISI_WEBHOOK_FAILURE",
        "BRIVO_WEBHOOK_FAILURE",
        "HALO_WEBHOOK_FAILURE",
        "SALTO_WEBHOOK_FAILURE",
        "SQUARE_WEBHOOK_FAILURE",
        "BUTTERFLYMX_WEBHOOK_FAILURE",
        "GENEA_WEBHOOK_FAILURE",
        "PRODATAKEY_WEBHOOK_FAILURE",
        "AMT_WEBHOOK_FAILURE",
        "PLACEOS_WEBHOOK_FAILURE",
        "OMNIALERT_WEBHOOK_FAILURE",
        "CV_FAILURE",
        "KEYPAD_ONLINE",
        "KEYPAD_OFFLINE",
        "TUNNELED_DEVICE_CONNECTED",
        "TUNNELED_DEVICE_DISCONNECTED",
        "UNKNOWN",
      ])
      .nullable(),
    apMac: z.string().nullable(),
    asi: z.string().nullable(),
    connectionUuid: z.string().nullable(),
    defaultInterface: z.string().nullable(),
    defaultInterfaceMac: z.string().nullable(),
    deviceName: z.string().nullable(),
    deviceType: DeviceTypeEnum,
    deviceUuid: z.string().nullable(),
    firmwareVersion: z.string().nullable(),
    orgUuid: z.string().nullable(),
    reportingDeviceUuid: z.string().nullable(),
    rssi: z.number().int().nullable(),
    ssid: z.string().nullable(),
    timestamp: z.string().datetime({ offset: true }).nullable(),
    uuid: z.string().nullable(),
    wifiSignalStrength: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetDiagnosticFeedWSResponse = z
  .object({
    diagnosticEvents: z.array(DiagnosticEventType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetEnvoyDeliveriesWSRequest = z
  .object({
    endTimestampMs: z.number().int().nullable(),
    locationIds: z.array(z.string().nullable()).nullable(),
    startTimestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const EnvoyDeliveryInfo = z.object({ name: z.string().nullable() }).partial().passthrough();
const EnvoyDelivery = z
  .object({
    carrier: EnvoyDeliveryInfo,
    carrierInfo: EnvoyDeliveryInfo,
    deliveryArea: EnvoyDeliveryInfo,
    deliveryAreaInfo: EnvoyDeliveryInfo,
    locationId: z.string().nullable(),
    pickedUpAt: z.string().nullable(),
    pickedUpBy: EnvoyPersonInfo,
    receivedTimestampMs: z.number().int().nullable(),
    recipient: EnvoyPersonInfo,
    status: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetEnvoyDeliveriesWSResponse = z
  .object({
    collectedDeliveries: z.array(EnvoyDelivery).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    pendingDeliveries: z.array(EnvoyDelivery).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetEnvoyEmployeesWSRequest = z
  .object({ locationIds: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Integration_GetEnvoyEmployeesWSResponse = z
  .object({
    employees: z.array(EnvoyPersonInfo).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetEnvoyLocationsWSRequest = z.object({}).partial().passthrough();
const EnvoyLocation = z
  .object({ id: z.number().int().nullable(), name: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetEnvoyLocationsWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    locationList: z.array(EnvoyLocation).nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetEnvoyVisitorsWSRequest = z
  .object({
    endTimestampMs: z.number().int().nullable(),
    includeSignedOutVisitors: z.boolean().nullable(),
    locationIds: z.array(z.string().nullable()).nullable(),
    startTimestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const EnvoyExpectedGuest = z
  .object({
    expectedArrivalAt: z.string().nullable(),
    expectedArrivalTimestampMs: z.number().int().nullable(),
    host: EnvoyPersonInfo,
    invitee: EnvoyPersonInfo,
    locationId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const EnvoyGuest = z
  .object({
    agreementsStatus: z.string().nullable(),
    email: z.string().nullable(),
    fullName: z.string().nullable(),
    host: EnvoyPersonInfo,
    locationId: z.string().nullable(),
    notes: z.string().nullable(),
    signedInAt: z.string().nullable(),
    signedInTimestampMs: z.number().int().nullable(),
    signedOutAt: z.string().nullable(),
    signedOutTimestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetEnvoyVisitorsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    invites: z.array(EnvoyExpectedGuest).nullable(),
    visitors: z.array(EnvoyGuest).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetFacesByDeviceWSRequest = z
  .object({
    dateLocal: z.string().nullish(),
    deviceUuid: z.string().nullable(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    timestampMs: z.number().int().gte(0).nullish(),
  })
  .passthrough();
const Report_GetFacesByDeviceWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceEvents: z.array(FaceEventType).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetFacesByLocationWSRequest = z
  .object({
    dateLocal: z.string().nullish(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    locationUuid: z.string().nullable(),
    timestampMs: z.number().int().gte(0).nullish(),
  })
  .passthrough();
const Report_GetFacesByLocationWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faceEvents: z.array(FaceEventType).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetLicensePlatesByDeviceWSRequest = z
  .object({
    dateLocal: z.string().nullish(),
    deviceUuid: z.string().nullable(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    timestampMs: z.number().int().gte(0).nullish(),
  })
  .passthrough();
const VehicleEventIndexType = z
  .object({
    deviceUuid: z.string().nullable(),
    eventTimestamp: z.number().int().nullable(),
    imageS3Key: z.string().nullable(),
    locationUuid: z.string().nullable(),
    matchingLicensePlates: z.array(z.string().nullable()).nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    partialLicensePlates: z.array(z.string().nullable()).nullable(),
    thumbnailS3Key: z.string().nullable(),
    uuid: z.string().nullable(),
    vehicleLicensePlate: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetLicensePlatesByDeviceWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    licensePlateEvents: z.array(VehicleEventIndexType).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetMostRecentPeopleCountWSRequest = z
  .object({ deviceUuid: z.string().nullable(), numMostRecent: z.number().int().nullable() })
  .partial()
  .passthrough();
const BoundingBoxType = z
  .object({
    bottom: z.number().nullable(),
    left: z.number().nullable(),
    right: z.number().nullable(),
    top: z.number().nullable(),
  })
  .partial()
  .passthrough();
const PeopleCountEventType = z
  .object({
    boundingBoxes: z.array(BoundingBoxType).nullable(),
    deviceLabels: z.array(z.string().nullable()).nullable(),
    deviceUuid: z.string().nullable(),
    eventTimestamp: z.number().int().nullable(),
    imageS3Key: z.string().nullable(),
    locationLabels: z.array(z.string().nullable()).nullable(),
    locationUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    peopleCount: z.number().int().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetMostRecentPeopleCountWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    events: z.array(PeopleCountEventType).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetProximityTagLocationsByDateWSRequest = z
  .object({
    endDateStr: z.string().nullish(),
    endTimeMs: z.number().int().gte(0).nullish(),
    startDateStr: z.string().nullish(),
    startTimeMs: z.number().int().gte(0).nullish(),
    tagUuid: z.string().nullable(),
  })
  .passthrough();
const ProximityTagTimeSeriesDataPointType = z
  .object({
    dateLocal: z.string().nullable(),
    tagUuid: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetProximityTagLocationsByDateWSResponse = z
  .object({
    dataPoints: z.array(ProximityTagTimeSeriesDataPointType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetRunningAverageWSRequest = z
  .object({
    endDate: z.string().nullish(),
    endTimeMs: z.number().int().gte(0).nullish(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    scope: z.enum(["DEVICE", "LOCATION", "ORG"]).nullable(),
    startDate: z.string().nullish(),
    startTimeMs: z.number().int().gte(0).nullish(),
    uuid: z.string().nullish(),
  })
  .passthrough();
const Stats = z
  .object({ avg: z.number().nullable(), stddev: z.number().nullable() })
  .partial()
  .passthrough();
const WeeklyStatisticsDataPoint = z
  .object({ date: z.string().nullable(), stats: z.record(Stats).nullable() })
  .partial()
  .passthrough();
const Report_GetRunningAverageWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    statsDataPoints: z.array(WeeklyStatisticsDataPoint).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetSummaryCountReportWSRequest = z
  .object({
    endDate: z.string().nullish(),
    endTimeMs: z.number().int().gte(0).nullish(),
    interval: z
      .enum(["MINUTELY", "QUARTERHOURLY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY"])
      .nullable(),
    scope: z.enum(["DEVICE", "LOCATION", "ORG"]).nullable(),
    startDate: z.string().nullish(),
    startTimeMs: z.number().int().gte(0).nullish(),
    type: z
      .enum([
        "CROWD",
        "PEOPLE",
        "FACES",
        "MOTION",
        "BANDWIDTH",
        "VEHICLES",
        "LICENSEPLATES",
        "ALERTS",
      ])
      .nullable(),
  })
  .passthrough();
const EventCount = z
  .object({ count: z.number().nullable(), uuid: z.string().nullable() })
  .partial()
  .passthrough();
const SummaryCountTimeSeriesDataPointType = z
  .object({
    avgEventCountMap: z.record(EventCount).nullable(),
    dateLocal: z.string().nullable(),
    dateUtc: z.string().nullable(),
    maxEventCountMap: z.record(EventCount).nullable(),
    minEventCountMap: z.record(EventCount).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetSummaryCountReportWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    timeSeriesDataPoints: z.array(SummaryCountTimeSeriesDataPointType).nullable(),
  })
  .partial()
  .passthrough();
const Report_GetThresholdCrossingCountsWSRequest = z
  .object({
    crossingObject: z.enum(["HUMAN", "VEHICLE", "UNKNOWN"]).nullable(),
    dailyResetTimeMinute: z.number().int().nullable(),
    devices: z.array(z.string().nullable()).nullable(),
    endTimeMs: z.number().int().nullable(),
    startTimeMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetThresholdCrossingCountsWSResponse_ThresholdCrossingCountType = z
  .object({ count: z.number().int().nullable(), timestampMs: z.number().int().nullable() })
  .partial()
  .passthrough();
const Report_GetThresholdCrossingCountsWSResponse = z
  .object({
    counts: z
      .array(Report_GetThresholdCrossingCountsWSResponse_ThresholdCrossingCountType)
      .nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetThresholdCrossingEventsWSRequest = z
  .object({
    crossingObject: z.enum(["HUMAN", "VEHICLE", "UNKNOWN"]).nullable(),
    devices: z.array(z.string().nullable()).nullable(),
    endTimeMs: z.number().int().nullable(),
    startTimeMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const MinimalThresholdEventType = z
  .object({
    crossingObject: z.enum(["HUMAN", "VEHICLE", "UNKNOWN"]).nullable(),
    direction: z.enum(["INGRESS", "EGRESS"]).nullable(),
    timestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Report_GetThresholdCrossingEventsWSResponse = z
  .object({
    deviceToThresholdCrossingEventMap: z
      .record(z.array(MinimalThresholdEventType).nullable())
      .nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetToastEventsTableWSRequest = z
  .object({ businessDate: z.string().nullable() })
  .partial()
  .passthrough();
const Integration_GetToastEventsTableWSResponse_EventTableRow = z
  .object({
    assignedCameraList: z.array(z.string().nullable()).nullable(),
    employeeName: z.string().nullable(),
    orderGuid: z.string().nullable(),
    paymentType: z.string().nullable(),
    restaurantName: z.string().nullable(),
    revenueCenterName: z.string().nullable(),
    serviceAreaName: z.string().nullable(),
    timestamp: z.string().nullable(),
    tipAmount: z.string().nullable(),
    totalAmount: z.string().nullable(),
    totalDiscountAmount: z.string().nullable(),
    voided: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Integration_GetToastEventsTableWSResponse = z
  .object({
    authError: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    eventTable: z.array(Integration_GetToastEventsTableWSResponse_EventTableRow).nullable(),
  })
  .partial()
  .passthrough();
const Report_ResetRunningAverageWSRequest = z
  .object({ scope: z.enum(["DEVICE", "LOCATION", "ORG"]).nullable(), uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Report_ResetRunningAverageWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const RuleTriggerConjunctionEnum = z.enum(["AND", "OR", "UNKNOWN"]);
const RuleTypeEnum = z.enum([
  "BUTTON_DEFINED",
  "USER_DEFINED",
  "DOORBELL_CAMERA_DEFINED",
  "DOOR_CONTROLLER_DEFINED",
  "LOCKDOWN_PLAN_DEFINED",
]);
const RuleTriggerTypeEnum = z.enum([
  "DEVICE_ACTIVITY_EVENT",
  "AUDIT_EVENT",
  "DIAGNOSTIC_EVENT",
  "ALERT_MONITORING_EVENT",
  "BADGE_INTEGRATION_EVENT",
  "SCHEDULED_EVENT",
  "VISION_LLM_EVENT",
  "UNKNOWN",
]);
const BaseRuleTriggerType = z.object({ type: RuleTriggerTypeEnum }).partial().passthrough();
const RuleType = z
  .object({
    action: RuleActionType,
    conjunction: RuleTriggerConjunctionEnum,
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    ownerDeviceUuid: z.string().nullable(),
    ruleFilters: RuleFilterType,
    ruleType: RuleTypeEnum,
    triggers: z.array(BaseRuleTriggerType).nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Rules_CreateRuleWSRequest = z.object({ rule: RuleType }).partial().passthrough();
const Rules_CreateRuleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    ruleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Rules_DeleteRuleWSRequest = z
  .object({ ruleUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Rules_DeleteRuleWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Rules_DeleteRulePauseSettingWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Rules_DeleteRulePauseSettingWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Rules_GetRulePauseSettingsWSRequest = z.object({}).partial().passthrough();
const Rules_GetRulePauseSettingsResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    rulesPausedMap: z.record(z.array(ScheduledIntervalType).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Rules_records_GetRulesFilteredWSRequest = z
  .object({
    associatedUuids: z.array(z.string().nullable()).nullable(),
    ruleTypeFilter: z.array(RuleTypeEnum).nullable(),
  })
  .partial()
  .passthrough();
const Rules_GetRulesForOrgWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    rules: z.array(RuleType).nullable(),
  })
  .partial()
  .passthrough();
const Rules_GetRulesForOrgWSRequest = z.object({}).partial().passthrough();
const Rules_PauseRuleWSRequest = z
  .object({
    durationSec: z.number().int().nullable(),
    ruleUuid: z.string().nullable(),
    scheduledTimestampSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Rules_PauseRuleWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Rules_UpdateRuleWSRequest = z.object({ ruleUpdate: RuleType }).partial().passthrough();
const Rules_UpdateRuleWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Rules_records_DeleteRulesEventRecordWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Rules_records_DeleteRulesEventRecordWSResponse = z.object({}).partial().passthrough();
const Rules_records_GetLatestRulesEventRecordsWSRequest = z
  .object({
    associatedUuids: z.array(z.string().nullable()).nullable(),
    n: z.number().int().nullable(),
    ruleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ActivateLocationLockdownActionRecordType = z
  .object({
    locationUuid: z.string().nullable(),
    lockdownPlanUuid: z.string().nullable(),
    succeeded: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const AlertActionStatusEnum = z.enum([
  "SUCCESS",
  "ERROR",
  "PAUSED",
  "IGNORED",
  "MUTED",
  "BACKOFF",
  "UNKNOWN",
]);
const AlertActionRecordType = z
  .object({ policyAlertUuid: z.string().nullable(), status: AlertActionStatusEnum })
  .partial()
  .passthrough();
const AlertMonitoringRulesEventTypeEnum = z.enum(["ALARM_CREATED", "ALARM_CANCELED", "UNKNOWN"]);
const AlertMonitoringEventRecordType = z
  .object({
    alertMonitoringEventType: AlertMonitoringRulesEventTypeEnum,
    locationUuid: z.string().nullable(),
    threatCaseUuid: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const AudioGatewayStatusEnum = z.enum(["SUCCESS", "ERROR", "BACKOFF", "IGNORED", "UNKNOWN"]);
const AudioPlaybackActionRecordType = z
  .object({
    audioClipUuid: z.string().nullable(),
    audioGatewayStatuses: z.record(AudioGatewayStatusEnum).nullable(),
  })
  .partial()
  .passthrough();
const DeviceEventRecordType = z
  .object({
    activities: z.array(ActivityEnum).nullable(),
    componentCompositeUuid: z.string().nullable(),
    componentUuid: z.string().nullable(),
    deviceType: DeviceTypeEnum,
    deviceUuid: z.string().nullable(),
    eventUuid: z.string().nullable(),
    hardwareVariation: HardwareVariationEnum,
    locationUuid: z.string().nullable(),
    timestampMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const IntegrationActionStatusEnum = z.enum(["SUCCESS", "ERROR", "BACKOFF", "IGNORED", "UNKNOWN"]);
const LiveNotificationActionStatusEnum = z.enum([
  "SUCCESS",
  "ERROR",
  "IGNORED",
  "MUTED",
  "BACKOFF",
  "UNKNOWN",
]);
const LiveNotificationActionRecordType = z
  .object({ status: LiveNotificationActionStatusEnum })
  .partial()
  .passthrough();
const ScheduledEventRecordType = z
  .object({ timestampMs: z.number().int().nullable() })
  .partial()
  .passthrough();
const UnlockDoorActionRecordType = z
  .object({
    doorId: z.string().nullable(),
    placeId: z.string().nullable(),
    succeeded: z.boolean().nullable(),
    system: z.string().nullable(),
  })
  .partial()
  .passthrough();
const RulesEventRecordType = z
  .object({
    activatedLocationLockdownRecord: ActivateLocationLockdownActionRecordType,
    alertActionRecord: AlertActionRecordType,
    alertMonitoringEventRecords: z.array(AlertMonitoringEventRecordType).nullable(),
    audioPlaybackActionRecords: z.array(AudioPlaybackActionRecordType).nullable(),
    deviceEventRecords: z.array(DeviceEventRecordType).nullable(),
    integrationActionStatuses: z.record(IntegrationActionStatusEnum).nullable(),
    liveNotificationActionRecord: LiveNotificationActionRecordType,
    orgUuid: z.string().nullable(),
    ruleUuid: z.string().nullable(),
    scheduledEventRecords: z.array(ScheduledEventRecordType).nullable(),
    triggeredTimestampMs: z.number().int().nullable(),
    unlockDoorActionRecords: z.array(UnlockDoorActionRecordType).nullable(),
    uuid: z.string().nullable(),
    webhookActionStatuses: z.record(z.boolean().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Rules_records_GetLatestRulesEventRecordsWSResponse = z
  .object({ rulesEventRecords: z.array(RulesEventRecordType).nullable() })
  .partial()
  .passthrough();
const Rules_records_GetRulesEventRecordsWSRequest = z
  .object({
    associatedUuids: z.array(z.string().nullable()).nullable(),
    endTime: z.number().int().nullable(),
    startTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Rules_records_GetRulesEventRecordsWSResponse = z
  .object({ rulesEventRecords: z.array(RulesEventRecordType).nullable() })
  .partial()
  .passthrough();
const AbsoluteSecondsIntervalType = z
  .object({ b: z.number().int().nullable(), e: z.number().int().nullable() })
  .partial()
  .passthrough();
const AbsoluteSecondsScheduleType = BaseSavedScheduleType.and(
  z
    .object({ intervalList: z.array(AbsoluteSecondsIntervalType).nullable() })
    .partial()
    .passthrough()
);
const Schedule_CreateAbsoluteScheduleWSRequest = z
  .object({ schedule: AbsoluteSecondsScheduleType.nullable() })
  .partial()
  .passthrough();
const Schedule_CreateAbsoluteScheduleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    scheduleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const LocalDateTimeIntervalType = z
  .object({ localEndDateTime: z.string().nullable(), localStartDateTime: z.string().nullable() })
  .passthrough();
const RelativeDateTimeIntervalsScheduleType = BaseSavedScheduleType.and(
  z
    .object({ intervals: z.array(LocalDateTimeIntervalType).nullable() })
    .partial()
    .passthrough()
);
const Schedule_CreateRelativeDateTimeIntervalsScheduleWSRequest = z
  .object({ schedule: RelativeDateTimeIntervalsScheduleType.nullable() })
  .partial()
  .passthrough();
const Schedule_CreateRelativeDateTimeIntervalsScheduleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    scheduleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const RealtimeRelativeSecondsScheduleType = BaseSavedScheduleType.and(
  z.object({ pastSeconds: z.number().int().nullable() }).partial().passthrough()
);
const Schedule_CreateRelativeScheduleWSRequest = z
  .object({ schedule: RealtimeRelativeSecondsScheduleType.nullable() })
  .partial()
  .passthrough();
const Schedule_CreateRelativeScheduleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    scheduleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Schedule_CreateWeeklyScheduleWSRequest = z
  .object({ schedule: WeeklyRepeatingScheduleType.nullable() })
  .partial()
  .passthrough();
const Schedule_CreateWeeklyScheduleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    scheduleUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Schedule_FindAbsoluteScheduleWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Schedule_FindAbsoluteScheduleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    schedule: AbsoluteSecondsScheduleType.nullable(),
  })
  .partial()
  .passthrough();
const Schedule_FindRelativeDateTimeIntervalsScheduleWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Schedule_FindRelativeDateTimeIntervalsScheduleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    schedule: RelativeDateTimeIntervalsScheduleType.nullable(),
  })
  .partial()
  .passthrough();
const Schedule_FindRelativeScheduleWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Schedule_FindRelativeScheduleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    schedule: RealtimeRelativeSecondsScheduleType.nullable(),
  })
  .partial()
  .passthrough();
const Schedule_FindWeeklyScheduleWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Schedule_FindWeeklyScheduleWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    schedule: WeeklyRepeatingScheduleType.nullable(),
  })
  .partial()
  .passthrough();
const Schedule_GetSchedulesWSRequest = z.object({}).partial().passthrough();
const Schedule_GetSchedulesWSResponse = z
  .object({
    absoluteSchedules: z.array(AbsoluteSecondsScheduleType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    relativeDatetimeSchedules: z.array(RelativeDateTimeIntervalsScheduleType).nullable(),
    relativeSchedules: z.array(RealtimeRelativeSecondsScheduleType).nullable(),
    weeklySchedules: z.array(WeeklyRepeatingScheduleType).nullable(),
  })
  .partial()
  .passthrough();
const Search_SearchObjectsByColorWSRequest = z
  .object({
    colorFilter: z
      .array(
        z
          .enum([
            "BLACK",
            "BLUE",
            "BROWN",
            "GRAYWHITE",
            "GREEN",
            "ORANGE",
            "PINK",
            "PURPLE",
            "RED",
            "YELLOW",
            "UNKNOWN",
          ])
          .nullable()
      )
      .nullable(),
    deviceFilter: z.array(z.string().nullable()).nullable(),
    endTimeMs: z.number().int().nullable(),
    objectTypeFilter: z.array(ActivityEnum).nullable(),
    startTimeMs: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Search_SearchObjectsByColorWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    objects: z.array(FootageBoundingBoxType).nullable(),
  })
  .partial()
  .passthrough();
const Sensor_GetFootageSensorSeekpointsForCameraWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    durationSec: z.number().int().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Sensor_FootageSensorSeekPointDisplayType = z
  .object({
    a: ActivityEnum,
    al: z.boolean().nullish(),
    cd: z.string().nullish(),
    cdn: z.string().nullish(),
    co2: z.number().nullish(),
    cu: z.array(z.string().nullable()).nullish(),
    ethanol: z.number().nullish(),
    h: z.number().int().nullish(),
    hp: z.number().int().nullish(),
    iaq: z.number().nullish(),
    lu: z.string().nullish(),
    pm25: z.number().nullish(),
    probeTempC: z.number().nullish(),
    sn: z.string().nullish(),
    su: z.string().nullish(),
    t: z.number().int().nullish(),
    tc: z.number().int().nullish(),
    thcPercent: z.number().nullish(),
    ts: z.number().int().nullable(),
    tvoc: z.number().nullish(),
    vapeSmokePercent: z.number().nullish(),
  })
  .passthrough();
const Sensor_GetFootageSensorSeekpointsForCameraWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    seekPoints: z.array(Sensor_FootageSensorSeekPointDisplayType).nullable(),
  })
  .partial()
  .passthrough();
const Sensor_GetFootageSensorSeekpointsForLocationWSRequest = z
  .object({
    durationSec: z.number().int().nullable(),
    locationUuid: z.string().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Sensor_GetFootageSensorSeekpointsForLocationWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    seekPoints: z.array(Sensor_FootageSensorSeekPointDisplayType).nullable(),
  })
  .partial()
  .passthrough();
const Sensor_GetFootageSensorSeekpointsForSensorWSRequest = z
  .object({
    durationSec: z.number().int().nullable(),
    sensorUuid: z.string().nullable(),
    startTimeSec: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Sensor_GetFootageSensorSeekpointsForSensorWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    seekPoints: z.array(Sensor_FootageSensorSeekPointDisplayType).nullable(),
  })
  .partial()
  .passthrough();
const Camera_SharedCameraCurrentStateType = z
  .object({
    baseVideoOperationUrl: z.string().nullable(),
    connectionStatus: z.enum(["GREEN", "RED"]).nullable(),
    oldestArchivedMediaSeconds: z.number().int().nullable(),
    onCameraState: z.record(z.object({}).partial().passthrough().nullable()).nullable(),
    onCloudState: z.record(z.object({}).partial().passthrough().nullable()).nullable(),
    region: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Camera_GetSharedCameraCurrentStateWSResponse = z
  .object({
    cameraState: Camera_SharedCameraCurrentStateType,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedFootageBoundingBoxesWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    duration: z.number().int().nullable(),
    startTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedFootageBoundingBoxesWSResponse = z
  .object({
    boundingBoxes: z.array(FootageBoundingBoxType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedFootageSeekpointsV2WSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    duration: z.number().int().nullable(),
    startTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedFootageSeekpointsV2WSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    footageSeekPoints: z.array(FootageSeekPointV2Type).nullable(),
    seekPoints: z.array(FootageSeekPointV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedMediaUrisWSRequest = z.object({}).partial().passthrough();
const Share_GetSharedMediaUrisWSResponse = z
  .object({
    audioWanLiveMpdUri: z.string().nullable(),
    audioWanLiveOpusUri: z.string().nullable(),
    audioWanVodMpdUriTemplate: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    wanLiveH264Uri: z.string().nullable(),
    wanLiveM3u8Uri: z.string().nullable(),
    wanLiveMpdUri: z.string().nullable(),
    wanVodM3u8UriTemplate: z.string().nullable(),
    wanVodMpdUriTemplate: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedPresenceWindowsWSRequest = z
  .object({ durationSec: z.number().int().nullable(), startTimeSec: z.number().int().nullable() })
  .partial()
  .passthrough();
const Share_GetSharedPresenceWindowsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    presenceWindows: z.record(z.array(TimeWindowSeconds).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedVideoWallMediaUrisWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Share_GetSharedVideoWallMediaUrisWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    wanLiveH264Uri: z.string().nullable(),
    wanLiveM3u8Uri: z.string().nullable(),
    wanLiveMpdUri: z.string().nullable(),
    wanVodM3u8UriTemplate: z.string().nullable(),
    wanVodMpdUriTemplate: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedClipDataWSRequest = z.object({}).partial().passthrough();
const Share_SharedClipPublicType = z
  .object({
    boundingBoxes: z.array(ClipBoundingBoxType).nullable(),
    clipLocation: MetaDataLocationType,
    deviceBoundingBoxMap: z.record(z.array(ClipBoundingBoxType).nullable()).nullable(),
    deviceMap: z.record(MetaDataLocationType).nullable(),
    deviceSeekPointMap: z.record(z.array(ClipSeekPointV2Type).nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    locationNameMap: z.record(z.string().nullable()).nullable(),
    locationTimeZoneMap: z
      .record(
        z
          .object({
            displayName: z.string().nullable(),
            dstsavings: z.number().int().nullable(),
            id: z.string().nullable(),
            rawOffset: z.number().int().nullable(),
          })
          .partial()
          .passthrough()
          .nullable()
      )
      .nullable(),
    publicClipUuid: z.string().nullable(),
    seekPoints: z.array(ClipSeekPointV2Type).nullable(),
    startTime: z.number().int().nullable(),
    thumbnailLocation: MetaDataLocationType,
  })
  .partial()
  .passthrough();
const Share_GetSharedClipDataWSResponse = z
  .object({
    description: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    orgName: z.string().nullable(),
    sharedWebClips: z.array(Share_SharedClipPublicType).nullable(),
    title: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Share_SharedFaceType = z
  .object({ faceId: z.string().nullable(), name: z.string().nullable() })
  .partial()
  .passthrough();
const Share_GetSharedFacesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    faces: z.array(Share_SharedFaceType).nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedLiveStreamInfoWSResponse = z
  .object({
    aecEnabled: z.boolean().nullable(),
    audioPushToTalkEnabled: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    fisheyeDisplayMode: z.enum(["RAW", "IMMERSIVE", "TILES", "RAW_PANO"]).nullable(),
    hideOverlay: z.boolean().nullable(),
    hwVariation: HardwareVariationEnum,
    locationName: z.string().nullable(),
    mountingDirection: z.enum(["DOWN", "UP", "SIDEWAYS", "UNKNOWN"]).nullable(),
    name: z.string().nullable(),
    oldestSegmentSeconds: z.number().int().nullable(),
    schedule: BaseSavedScheduleType,
    tileViews: z.array(DewarpedView).nullable(),
    tz: z
      .object({
        displayName: z.string().nullable(),
        dstsavings: z.number().int().nullable(),
        id: z.string().nullable(),
        rawOffset: z.number().int().nullable(),
      })
      .partial()
      .passthrough()
      .nullable(),
    vodEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Share_SharedVideoWallDeviceType = z
  .object({
    fisheyeDisplayMode: z.enum(["RAW", "IMMERSIVE", "TILES", "RAW_PANO"]).nullable(),
    hwVariation: HardwareVariationEnum,
    locationName: z.string().nullable(),
    mountingDirection: z.enum(["DOWN", "UP", "SIDEWAYS", "UNKNOWN"]).nullable(),
    name: z.string().nullable(),
    tileViews: z.array(DewarpedView).nullable(),
    tz: z
      .object({
        displayName: z.string().nullable(),
        dstsavings: z.number().int().nullable(),
        id: z.string().nullable(),
        rawOffset: z.number().int().nullable(),
      })
      .partial()
      .passthrough()
      .nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedVideoWallInfoWSResponse = z
  .object({
    deviceList: z.array(Share_SharedVideoWallDeviceType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    name: z.string().nullable(),
    settings: z.record(z.object({}).partial().passthrough().nullable()).nullable(),
    vodEnabled: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Share_GetSharedFootageSensorSeekpointsForCameraWSRequest = z
  .object({ durationSec: z.number().int().nullable(), startTimeSec: z.number().int().nullable() })
  .partial()
  .passthrough();
const Share_GetSharedFootageSensorSeekpointsForCameraWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    seekPoints: z.array(Sensor_FootageSensorSeekPointDisplayType).nullable(),
  })
  .partial()
  .passthrough();
const Share_ShareLinkWSRequest = z
  .object({
    emailAddresses: z.array(z.string().nullable()).nullable(),
    link: z.string().nullable(),
    phoneNumbers: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Share_ShareLinkWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Share_GetSharedTimelapseDataWSRequest = z.object({}).partial().passthrough();
const Share_GetSharedTimelapseDataV2WSResponse = z
  .object({
    description: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    orgName: z.string().nullable(),
    publicTimelapseUuids: z.array(z.string().nullable()).nullable(),
    title: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Support_AddSupportAuthorityWSRequest = z
  .object({ authority: SupportAuthorityType })
  .partial()
  .passthrough();
const Support_AddSupportAuthorityWSResponse = z
  .object({
    authorityUuid: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Support_AlllowSupportAuthorityAccessWSRequest = z
  .object({ authorityUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Support_AlllowSupportAuthorityAccessWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Support_FindSupportAuthoritySessionsWSRequest = z
  .object({ authorityUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Support_FindSupportAuthoritySessionsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sessions: z.array(SessionInfoWSType).nullable(),
  })
  .partial()
  .passthrough();
const Support_GetSupportAuthoritiesWSRequest = z.object({}).partial().passthrough();
const Support_SupportAuthorityWSType = z
  .object({
    authorityType: z.enum(["PARTNER_SUPPORT", "RHOMBUS_SUPPORT"]).nullable(),
    authorityUuid: z.string().nullable(),
    createdAtMillis: z.number().int().nullable(),
    description: z.string().nullable(),
    expirationTimestamp: z.number().int().nullable(),
    grantedByUsername: z.string().nullable(),
    grantedToEmail: z.string().nullable(),
    grantedToInternalEntityUuid: z.string().nullable(),
    grantedToName: z.string().nullable(),
    loginAccessAllowed: z.boolean().nullable(),
    managedByMsp: z.boolean().nullable(),
    mobileAccessUrl: z.string().nullable(),
    orgUuid: z.string().nullable(),
    permissionGroupUuid: z.string().nullable(),
    webAccessUrl: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Support_GetSupportAuthoritiesWSResponse = z
  .object({
    authorities: z.array(Support_SupportAuthorityWSType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Support_LogoutAllSupportAuthoritySessionsWSRequest = z
  .object({ authorityUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Support_LogoutAllSupportAuthoritySessionsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Support_LookupSupportPartnerAuthoritiesWSRequest = z
  .object({ lookupKeyword: z.string().nullable() })
  .partial()
  .passthrough();
const Support_SupportPartnerAuthorityWSType = z
  .object({
    contactEmail: z.string().nullable(),
    contactName: z.string().nullable(),
    name: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Support_LookupSupportPartnerAuthoritiesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    supportPartnerAuthorities: z.array(Support_SupportPartnerAuthorityWSType).nullable(),
  })
  .partial()
  .passthrough();
const Support_RemoveSupportAuthorityWSRequest = z
  .object({ authorityUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Support_RemoveSupportAuthorityWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Support_RevokeSupportAuthorityAccessWSRequest = z
  .object({ authorityUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Support_RevokeSupportAuthorityAccessWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Support_SupportAuthoritySelectiveUpdateWSType = z
  .object({
    authorityUuid: z.string().nullable(),
    description: z.string().nullable(),
    expirationTimestamp: z.number().int().nullable(),
    grantedToEmail: z.string().nullable(),
    grantedToName: z.string().nullable(),
    loginAccessAllowed: z.boolean().nullable(),
    permissionGroupUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Support_UpdateSupportAuthorityWSRequest = z
  .object({ update: Support_SupportAuthoritySelectiveUpdateWSType })
  .partial()
  .passthrough();
const Support_UpdateSupportAuthorityWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Tvos_GetTvOsConfigWsRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const TvOsConfigType = z
  .object({
    limitedVideoWallUuids: z.array(z.string().nullable()).nullable(),
    orgUuid: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Tvos_GetTvOsConfigWsResponse = z
  .object({
    config: TvOsConfigType,
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Tvos_GetTvOsConfigsForOrgWsRequest = z.object({}).partial().passthrough();
const Tvos_GetTvOsConfigsForOrgWsResponse = z
  .object({
    configs: z.array(TvOsConfigType).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Tvos_UpdateTvOsConfigWsRequest = z.object({ config: TvOsConfigType }).partial().passthrough();
const Tvos_UpdateTvOsConfigWsResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const User_ChangeUserPasswordWSRequest = z
  .object({ currentPassword: z.string().nullable(), newPassword: z.string().nullable() })
  .partial()
  .passthrough();
const User_ChangeUserPasswordWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    responseStatus: z
      .enum([
        "BASIC_AUTH_FAILED",
        "PASSWORD_MISMATCH",
        "SAME_PASSWORD",
        "USER_EXISTS",
        "USER_NOT_FOUND",
        "DEVICE_NOT_FOUND",
        "POLICY_NOT_FOUND",
        "LOCATION_NOT_FOUND",
        "ORG_NOT_FOUND",
        "BAD_INPUT",
        "SUCCESS",
        "PASSWORD_TOO_SHORT",
      ])
      .nullable(),
  })
  .partial()
  .passthrough();
const User_CreateUserWSRequest = z
  .object({
    accessibleRhombusApps: z
      .array(z.enum(["PARTNER", "CONSOLE", "RHOMBUS_KEY", "UNKNOWN"]).nullable())
      .nullable(),
    email: z.string().nullable(),
    name: z.string().nullable(),
    permissionGroupUuid: z.string().nullable(),
    rhombusKeySettings: RhombusKeyAppSettingsType,
    suppressRhombusKeyWelcomeEmail: z.boolean().nullable(),
    suppressWelcomeEmail: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const User_CreateUserWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    responseStatus: z
      .enum([
        "BASIC_AUTH_FAILED",
        "PASSWORD_MISMATCH",
        "SAME_PASSWORD",
        "USER_EXISTS",
        "USER_NOT_FOUND",
        "DEVICE_NOT_FOUND",
        "POLICY_NOT_FOUND",
        "LOCATION_NOT_FOUND",
        "ORG_NOT_FOUND",
        "BAD_INPUT",
        "SUCCESS",
        "PASSWORD_TOO_SHORT",
      ])
      .nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const User_DeleteUserWSRequest = z
  .object({ userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const User_DeleteUserWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const User_DeleteVirtualMfaDeviceForCurrentUserWSRequest = z.object({}).partial().passthrough();
const User_DeleteVirtualMfaDeviceForCurrentUserWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const User_GetImportUsersFormatWSResponse = z
  .object({
    accessControlEnabled: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    example: z.string().nullable(),
    explanation: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetPartnerUsersInOrgWSRequest = z.object({}).partial().passthrough();
const PartnerPermissionType = z
  .object({
    groupUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Partner_GetPartnerUsersInOrgWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    notificationSettings: z.array(PartnerNotificationSettingsType).nullable(),
    partnerPermissions: z.array(PartnerPermissionType).nullable(),
    partnerUsers: z.array(User_WrappedRhombusOrgUserType).nullable(),
  })
  .partial()
  .passthrough();
const User_GetRhombusKeyConfigForUserWSRequest = z
  .object({ userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const User_GetRhombusKeyConfigForUserWSResponse = z
  .object({ userRhombusKeyConfig: RhombusKeyAppConfigType })
  .partial()
  .passthrough();
const User_GetUserCustomizationFlagsWSRequest = z
  .object({ userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const User_GetUserCustomizationFlagsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    userCustomizations: z.record(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const User_GetUsersInOrgWSRequest = z.object({}).partial().passthrough();
const User_UserSnoozeNotificationSettingsType = z
  .object({
    snoozedForAllNotificationsIntervals: z.array(ScheduledIntervalType).nullable(),
    snoozedForDevicesMap: z.record(z.array(ScheduledIntervalType).nullable()).nullable(),
    snoozedForLocationsMap: z.record(z.array(ScheduledIntervalType).nullable()).nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const UserPermissionType = z
  .object({
    groupUuid: z.string().nullable(),
    orgUuid: z.string().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const User_GetUsersInOrgWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    notificationSettings: z.array(UserNotificationSettingsV3Type).nullable(),
    partners: z.array(User_WrappedRhombusOrgUserType).nullable(),
    snoozeSettings: z.array(User_UserSnoozeNotificationSettingsType).nullable(),
    userPermissions: z.array(UserPermissionType).nullable(),
    users: z.array(User_WrappedRhombusOrgUserType).nullable(),
  })
  .partial()
  .passthrough();
const User_GetVirtualMfaDeviceForCurrentUserWSRequest = z.object({}).partial().passthrough();
const UserVirtualMfaDeviceType = z
  .object({ createdAtMillis: z.number().int().nullable() })
  .partial()
  .passthrough();
const User_GetVirtualMfaDeviceForCurrentUserWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    virtualMfaDevice: UserVirtualMfaDeviceType,
  })
  .partial()
  .passthrough();
const User_ImportUsersWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    messages: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const User_SendMobileDownloadSMSWSRequest = z
  .object({ phoneNumber: z.string().nullable() })
  .partial()
  .passthrough();
const User_SendMobileDownloadSMSWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const User_SendPartnerAccessGrantedEmailWSRequest = z
  .object({
    loginLink: z.string().nullable(),
    partnerEmailAddress: z.string().nullable(),
    partnerFullName: z.string().nullable(),
    phoneNumber: z.string().nullable(),
  })
  .partial()
  .passthrough();
const User_SendPartnerAccessGrantedEmailWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const User_SendRhombusKeyUserWelcomeEmailWSRequest = z
  .object({ userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const User_SendRhombusKeyUserWelcomeEmailWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const User_SendUserWelcomeEmailWSRequest = z
  .object({ userUuid: z.string().nullable() })
  .partial()
  .passthrough();
const User_SendUserWelcomeEmailWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const User_SetupVirtualMfaDeviceForCurrentUserWSRequest = z.object({}).partial().passthrough();
const User_SetupVirtualMfaDeviceForCurrentUserWSResponse = z
  .object({
    alreadyExists: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    qrCodeSetupData: z.string().nullable(),
    success: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const User_UpdatePartnerWSRequest = z
  .object({
    bypassSaml: z.boolean().nullable(),
    mfaEnabled: z.boolean().nullable(),
    name: z.string().nullable(),
    notificationSettings: PartnerNotificationSettingsType,
    permissionGroupUuid: z.string().nullable(),
    smsPhoneNumbers: z.array(z.string().nullable()).nullable(),
    summaryEmailEnabled: z.boolean().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const User_UpdatePartnerWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const User_UpdateRhombusKeySettingsForUserWSRequest = z
  .object({
    bypassSaml: z.boolean().nullable(),
    endDateProvisioner: EpochSecondsProvisioner,
    maxMobileCredsAllowed: z.number().int().nullable(),
    remoteUnlockEnabled: z.boolean().nullable(),
    rhombusKeyAccessEnabled: z.boolean().nullable(),
    startDateProvisioner: EpochSecondsProvisioner,
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const User_UpdateRhombusKeySettingsForUserWSResponse = z
  .object({ userRhombusKeyConfig: RhombusKeyAppConfigType })
  .partial()
  .passthrough();
const User_UpdateUserWSRequest = z
  .object({
    bypassSaml: z.boolean().nullable(),
    mfaEnabled: z.boolean().nullable(),
    name: z.string().nullable(),
    notificationIntervalsV2: z.array(NotificationIntervalV2Type).nullable(),
    permissionGroupUuid: z.string().nullable(),
    smsPhoneNumbers: z.array(z.string().nullable()).nullable(),
    summaryEmailEnabled: z.boolean().nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const User_UpdateUserWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const User_UpdateUserCustomizationFlagsWSRequest = z
  .object({
    userCustomizationFlags: z.record(z.string().nullable()).nullable(),
    userUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const User_UpdateUserCustomizationFlagsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Vehicle_AddVehicleLabelWSRequest = z
  .object({ label: z.string().nullable(), vehicleLicensePlate: z.string().nullable() })
  .partial()
  .passthrough();
const Vehicle_AddVehicleLabelWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Vehicle_AssociateEventsToVehicleWSRequest = z
  .object({
    eventUuids: z.array(z.string().nullable()).nullable(),
    vehicleLicensePlate: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Vehicle_AssociateEventsToVehicleWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Vehicle_DeleteVehicleWSRequest = z
  .object({ vehicleLicensePlate: z.string().nullable() })
  .partial()
  .passthrough();
const Vehicle_DeleteVehicleWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Vehicle_GetVehicleEventsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    events: z.array(VehicleEventIndexType).nullable(),
  })
  .partial()
  .passthrough();
const Vehicle_GetVehicleLabelsForOrgWSRequest = z.object({}).partial().passthrough();
const Vehicle_GetVehicleLabelsForOrgWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    vehicleLabels: z.record(z.array(z.string().nullable()).nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Vehicle_GetVehiclesWSRequest = z.object({}).partial().passthrough();
const VehicleV2Type = z
  .object({
    alert: z.boolean().nullable(),
    createdAtMillis: z.number().int().nullable(),
    description: z.string().nullable(),
    licensePlate: z.string().nullable(),
    name: z.string().nullable(),
    orgUuid: z.string().nullable(),
    thumbnailS3Key: z.string().nullable(),
    trust: z.boolean().nullable(),
  })
  .partial()
  .passthrough();
const Vehicle_GetVehiclesWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    vehicles: z.array(VehicleV2Type).nullable(),
  })
  .partial()
  .passthrough();
const Vehicle_RemoveVehicleLabelWSRequest = z
  .object({ label: z.string().nullable(), vehicleLicensePlate: z.string().nullable() })
  .partial()
  .passthrough();
const Vehicle_RemoveVehicleLabelWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Vehicle_ReportVehicleEventRequest = z
  .object({ eventUuid: z.string().nullable() })
  .partial()
  .passthrough();
const Vehicle_ReportVehicleEventResponse = z
  .object({
    collectedMediaForTraining: z.boolean().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Vehicle_SaveVehicleWSRequest = z
  .object({
    alert: z.boolean().nullable(),
    createdAtMillis: z.number().int().nullable(),
    description: z.string().nullable(),
    name: z.string().nullable(),
    thumbnailS3Key: z.string().nullable(),
    trust: z.boolean().nullable(),
    vehicleLicensePlate: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Vehicle_SaveVehicleWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Video_CancelSpliceV2WSRequest = z
  .object({
    clipUuid: z.string().nullable(),
    clipUuidList: z.array(z.string().nullable()).nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
  })
  .partial()
  .passthrough();
const Video_CancelSpliceV2WSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Video_CreateSharedTimelapseGroupWSRequest = z
  .object({
    description: z.string().nullable(),
    expirationTimeSecs: z.number().int().nullable(),
    plaintextPassword: z.string().nullable(),
    timelapseUuids: z.array(z.string().nullable()).nullable(),
    title: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_CreateSharedTimelapseGroupWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    shareUrl: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_DeleteSharedTimelapseGroupWSRequest = z
  .object({ uuid: z.string().nullable() })
  .partial()
  .passthrough();
const Video_DeleteSharedTimelapseGroupWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Video_DeleteTimelapseClipsWSRequest = z
  .object({ clipUuids: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Video_DeleteTimelapseClipsWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Video_GenerateTimelapseClipWSRequest = z
  .object({
    deviceUuids: z.array(z.string().nullable()).nullable(),
    drawCameraDetails: z.boolean().nullable(),
    drawTimestamp: z.boolean().nullable(),
    skipNights: z.boolean().nullable(),
    skipWeekends: z.boolean().nullable(),
    startTime: z.number().int().nullable(),
    stopTime: z.number().int().nullable(),
    videoDuration: z.number().int().nullable(),
    videoFormat: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_GenerateTimelapseClipWSResponse = z
  .object({
    clipUuid: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_GetExactFrameUriWSRequest = z
  .object({
    cameraUuid: z.string().nullable(),
    downscaleFactor: z.number().int().gte(1).nullish(),
    jpgQuality: z.number().int().gte(0).lte(100).nullish(),
    permyriadCropHeight: z.number().int().gte(0).lte(10000).nullish(),
    permyriadCropWidth: z.number().int().gte(0).lte(10000).nullish(),
    permyriadCropX: z.number().int().gte(0).lte(10000).nullish(),
    permyriadCropY: z.number().int().gte(0).lte(10000).nullish(),
    timestampMs: z.number().int().nullable(),
  })
  .passthrough();
const Video_GetExactFrameUriWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    frameUri: z.string().nullable(),
    responseMessage: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_GetMaxSpliceDurationWSRequest = z.object({}).partial().passthrough();
const Video_GetMaxSpliceDurationWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    maxDuration: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Video_GetSharedTimelapseGroupsWSRequest = z.object({}).partial().passthrough();
const TimelapseSource = z.object({ deviceUuid: z.string().nullable() }).partial().passthrough();
const SharedTimelapseClipType = z
  .object({
    clipDuration: z.number().int().nullable(),
    clipFormat: z.enum(["MPEG", "GIF"]).nullable(),
    sources: z.array(TimelapseSource).nullable(),
    uuid: z.string().nullable(),
    videoStartTime: z.number().int().nullable(),
    videoStopTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const SharedTimelapseGroupWrapperType = z
  .object({
    createdAtMillis: z.number().int().nullable(),
    description: z.string().nullable(),
    expirationTimeSecs: z.number().int().nullable(),
    isSecured: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    sharedTimelapses: z.array(SharedTimelapseClipType).nullable(),
    title: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_GetSharedTimelapseGroupsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    sharedTimelapses: z.array(SharedTimelapseGroupWrapperType).nullable(),
  })
  .partial()
  .passthrough();
const Video_GetSplicedClipsInProgressWSRequest = z.object({}).partial().passthrough();
const SplicedClipProgress = z
  .object({
    region: z.string().nullable(),
    segmentsUploaded: z.number().int().nullable(),
    totalSegments: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const SplicedClipType = z
  .object({
    analyzeClip: z.boolean().nullable(),
    clipTargetLocation: MetaDataLocationType,
    clipUuid: z.string().nullable(),
    consoleDelete: z.boolean().nullable(),
    deleted: z.boolean().nullable(),
    description: z.string().nullable(),
    deviceMap: z.record(SplicedClipProgress).nullable(),
    deviceUuid: z.string().nullable(),
    deviceUuidMap: z.record(SplicedClipProgress).nullable(),
    deviceUuidToAlteredViewMap: z.record(z.array(AlteredView).nullable()).nullable(),
    deviceUuidToFisheyePresentationMap: z.record(z.array(DewarpedView).nullable()).nullable(),
    duration: z.number().int().nullable(),
    integrationUploadList: z.array(IntegrationEnum).nullable(),
    isPolicyEvent: z.boolean().nullable(),
    metadataBucketRegion: z.string().nullable(),
    orgUuid: z.string().nullable(),
    saveClip: z.boolean().nullable(),
    saveFrame: z.boolean().nullable(),
    saveToDrive: z.boolean().nullable(),
    segmentsUploaded: z.number().int().nullable(),
    startTime: z.number().int().nullable(),
    status: z
      .enum(["INITIATING", "UPLOADING", "RENDERING", "FAILED", "COMPLETE", "OFFLINE", "UNKNOWN"])
      .nullable(),
    thumbnailRelativeSecond: z.number().nullable(),
    timestampMs: z.number().int().nullable(),
    title: z.string().nullable(),
    totalSegments: z.number().int().nullable(),
    transactionUuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_GetSplicedClipsInProgressWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    splicedClips: z.array(SplicedClipType).nullable(),
  })
  .partial()
  .passthrough();
const Video_GetTimelapseClipsWSRequest = z.object({}).partial().passthrough();
const TimelapseStatus = z
  .object({
    percentComplete: z.number().int().nullable(),
    state: z.enum(["INITIATED", "INPROGRESS", "COMPLETE", "FAILED"]).nullable(),
  })
  .partial()
  .passthrough();
const TimelapseClipType = z
  .object({
    clipCreationTime: z.number().int().nullable(),
    clipDuration: z.number().int().nullable(),
    clipFormat: z.enum(["MPEG", "GIF"]).nullable(),
    clipUuid: z.string().nullable(),
    description: z.string().nullable(),
    drawCameraDetails: z.boolean().nullable(),
    drawTimestamp: z.boolean().nullable(),
    drawWatermark: z.boolean().nullable(),
    orgUuid: z.string().nullable(),
    passwordDigest: z.string().nullable(),
    shared: z.boolean().nullable(),
    skipNights: z.boolean().nullable(),
    skipNonBusinessHours: z.boolean().nullable(),
    skipWeekends: z.boolean().nullable(),
    sources: z.array(TimelapseSource).nullable(),
    status: TimelapseStatus,
    videoStartTime: z.number().int().nullable(),
    videoStopTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Video_GetTimelapseClipsWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    timelapseClips: z.array(TimelapseClipType).nullable(),
  })
  .partial()
  .passthrough();
const Video_GetTimelapseMetadataWSRequest = z
  .object({ deviceUuidList: z.array(z.string().nullable()).nullable() })
  .partial()
  .passthrough();
const Video_GetTimelapseMetadataWSResponse = z
  .object({
    earliestTimestampMap: z.record(z.string().nullable()).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_RetrySpliceWSRequest = z
  .object({
    clipUuid: z.string().nullable(),
    deviceUuid: z.string().nullable(),
    duration: z.number().int().nullable(),
    startTime: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const Video_RetrySpliceWSResponse = z
  .object({ error: z.boolean().nullable(), errorMsg: z.string().nullable() })
  .partial()
  .passthrough();
const Video_SpliceFrameWSRequest = z
  .object({ deviceUuid: z.string().nullable(), timestampMs: z.number().int().nullable() })
  .partial()
  .passthrough();
const Video_SpliceFrameWSResponse = z
  .object({
    clipUuid: z.string().nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    region: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_SpliceV3WSRequest = z
  .object({
    alteredViewMap: z.record(z.array(AlteredView).nullable()).nullable(),
    audioIncluded: z.boolean().nullable(),
    description: z.string().nullable(),
    deviceUuids: z.array(z.string().nullable()).nullable(),
    durationSec: z.number().int().nullable(),
    integrationUploadMap: z.record(z.boolean().nullable()).nullable(),
    saveToConsole: z.boolean().nullable(),
    startTimeMillis: z.number().int().nullable(),
    title: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_SpliceV3WSResponse = z
  .object({
    clipUuid: z.string().nullable(),
    clipUuidList: z.array(z.string().nullable()).nullable(),
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_UpdateSharedTimelapseGroupWSRequest = z
  .object({
    description: z.string().nullable(),
    descriptionUpdate: z.boolean().nullable(),
    expirationTimeSecs: z.number().int().nullable(),
    expirationTimeUpdate: z.boolean().nullable(),
    passwordUpdate: z.boolean().nullable(),
    plaintextPassword: z.string().nullable(),
    title: z.string().nullable(),
    titleUpdate: z.boolean().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();
const Video_UpdateSharedTimelapseGroupWSResponse = z
  .object({
    error: z.boolean().nullable(),
    errorMsg: z.string().nullable(),
    shareUrl: z.string().nullable(),
    uuid: z.string().nullable(),
  })
  .partial()
  .passthrough();

export const schemas = {
  Accesscontrol_group_AddUsersToAccessControlGroupWSRequest,
  OrgGroupMemberType,
  Accesscontrol_group_AddUsersToAccessControlGroupWSResponse,
  Accesscontrol_credentials_AssignAccessControlCredentialWSRequest,
  AccessControlCredentialEnumType,
  AccessControlCredentialWorkflowStatusEnumType,
  AccessControlCredentialType,
  Accesscontrol_credentials_AssignAccessControlCredentialWSResponse,
  Accesscontrol_credentials_CreateAccessControlGroupWSRequest,
  OrgGroupType,
  Accesscontrol_credentials_CreateAccessControlGroupWSResponse,
  LocationAccessGrantType,
  Accesscontrol_accessgrant_CreateAccessGrantWSRequest,
  Accesscontrol_accessgrant_CreateAccessGrantWSResponse,
  LocationAccessRevocationType,
  Accesscontrol_accessrevocation_CreateAccessRevocationWSRequest,
  Accesscontrol_accessrevocation_CreateAccessRevocationWSResponse,
  Accesscontrol_credentials_CreateAppleWalletPassWSRequest,
  Accesscontrol_credentials_CreateRhombusSecureCsnCredentialWSRequest,
  Accesscontrol_credentials_CreateRhombusSecureCsnCredentialWSResponse,
  Accesscontrol_credentials_CreateStandardCsnCredentialWSRequest,
  Accesscontrol_credentials_CreateStandardCsnCredentialWSResponse,
  Accesscontrol_credentials_CreateWiegandCredentialWSRequest,
  Accesscontrol_credentials_CreateWiegandCredentialWSResponse,
  Accesscontrol_credentials_DeleteAccessControlCredentialWSRequest,
  Accesscontrol_credentials_DeleteAccessControlCredentialWSResponse,
  Accesscontrol_group_DeleteAccessControlGroupWSRequest,
  Accesscontrol_group_DeleteAccessControlGroupWSResponse,
  Accesscontrol_accessgrant_DeleteLocationAccessGrantWSRequest,
  Accesscontrol_accessgrant_DeleteLocationAccessGrantWSResponse,
  Accesscontrol_accessrevocation_DeleteLocationAccessRevocationWSRequest,
  Accesscontrol_accessrevocation_DeleteLocationAccessRevocationWSResponse,
  Accesscontrol_credentials_DeleteUnassignedAccessControlCredentialWSRequest,
  Accesscontrol_credentials_DeleteUnassignedAccessControlCredentialWSResponse,
  AccessControlledDoorStateEnumType,
  LocalInterval,
  DoorScheduleExceptionType,
  Accesscontrol_doorexception_CreateDoorScheduleExceptionWSRequest,
  Accesscontrol_doorexception_CreateDoorScheduleExceptionWSResponse,
  Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSRequest,
  Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSResponse,
  DateRangeFilter,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsWSRequest,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsWSResponse,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSRequest,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSResponse,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSRequest,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSResponse,
  Accesscontrol_doorexception_GetDoorScheduleExceptionWSRequest,
  Accesscontrol_doorexception_GetDoorScheduleExceptionWSResponse,
  Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSRequest,
  Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSResponse,
  CredentialQueryFilter,
  Accesscontrol_credentials_FindAccessControlCredentialByOrgWSRequest,
  Accesscontrol_credentials_FindAccessControlCredentialByOrgWSResponse,
  Accesscontrol_credentials_FindAccessControlCredentialByUserWSRequest,
  Accesscontrol_credentials_FindAccessControlCredentialByUserWSResponse,
  Accesscontrol_credentials_FindAccessControlCredentialByUsersWSRequest,
  Accesscontrol_credentials_FindAccessControlCredentialByUsersWSResponse,
  Accesscontrol_group_FindAccessControlGroupsByExactNameWSRequest,
  Accesscontrol_group_FindAccessControlGroupsByExactNameWSResponse,
  Accesscontrol_group_FindAccessControlGroupMembershipsByUserWSRequest,
  Accesscontrol_group_FindAccessControlGroupMembershipsByUserWSResponse,
  Accesscontrol_group_FindAccessControlGroupMembershipsForCurrentUserWSRequest,
  Accesscontrol_group_FindAccessControlGroupMembershipsForCurrentUserWSResponse,
  Accesscontrol_group_FindAccessControlGroupsByNamePrefixWSRequest,
  Accesscontrol_group_FindAccessControlGroupsByNamePrefixWSResponse,
  Accesscontrol_group_FindAccessControlGroupsByOrgWSRequest,
  Accesscontrol_group_FindAccessControlGroupsByOrgWSResponse,
  Accesscontrol_group_FindAccessControlGroupsByUserMembershipWSRequest,
  Accesscontrol_group_FindAccessControlGroupsByUserMembershipWSResponse,
  Accesscontrol_group_FindAllUsersForAccessControlGroupWSRequest,
  Accesscontrol_group_FindAllUsersForAccessControlGroupWSResponse,
  Accesscontrol_credentials_FindCredentialHistoryByCredentialHexValueWSRequest,
  Accesscontrol_credentials_FindCredentialHistoryByCredentialHexValueWSResponse,
  Accesscontrol_credentials_FindCredentialHistoryByCredentialValueWSRequest,
  Accesscontrol_credentials_FindCredentialHistoryByCredentialValueWSResponse,
  Accesscontrol_credentials_FindCredentialHistoryByUserWSRequest,
  Accesscontrol_credentials_FindCredentialHistoryByUserWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByAccessControlledDoorWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByAccessControlledDoorWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByDoorLabelWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByDoorLabelWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByGroupWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByGroupWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationAndUserWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationAndUserWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByUserWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByUserWSResponse,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByAccessControlledDoorWSRequest,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByAccessControlledDoorWSResponse,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByDoorLabelWSRequest,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByDoorLabelWSResponse,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByGroupWSRequest,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByGroupWSResponse,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByOrgWSRequest,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByOrgWSResponse,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByUserWSRequest,
  Accesscontrol_accessrevocation_FindLocationAccessRevocationsByUserWSResponse,
  Accesscontrol_credentials_FindRhombusSecureMobileCredentialsForCurrentUserWSRequest,
  Accesscontrol_credentials_FindRhombusSecureMobileCredentialsForCurrentUserWSResponse,
  Accesscontrol_ForceRefreshAccessControlUnitConfigWSRequest,
  Accesscontrol_ForceRefreshAccessControlUnitConfigWSResponse,
  Accesscontrol_accessgrant_GetLocationAccessGrantWSRequest,
  Accesscontrol_accessgrant_GetLocationAccessGrantWSResponse,
  Accesscontrol_accessrevocation_GetLocationAccessRevocationWSRequest,
  Accesscontrol_accessrevocation_GetLocationAccessRevocationWSResponse,
  Accesscontrol_accessgrant_GetLocationsByAccessGrantForCurrentUserWSRequest,
  LockdownPlanScopeEnumType,
  LockdownPlanReference,
  LocationLockdownStateEnumType,
  LocationLockdownStateType,
  FloorPlanType,
  QualifiedAddressType,
  LocationType,
  LockdownActivationPlanType,
  LockdownDeactivationPlanType,
  DoorLockdownStateEnumType,
  LockdownPhysicalAccessType,
  LockdownEventRuleTestPlanType,
  LockdownTestPlanType,
  BaseLockdownPlanType,
  Accesscontrol_accessgrant_GetLocationsByAccessGrantForCurrentUserWSResponse,
  Accesscontrol_GetMinimalAccessControlledDoorsByLocationForCurrentUserWSRequest,
  ComponentReferenceType_Minimal,
  ComponentCompositeEnumType_Minimal,
  WaveToUnlockSettingsType_Minimal,
  AccessControlledDoorType_Minimal,
  Accesscontrol_GetMinimalAccessControlledDoorsByLocationForCurrentUserWSResponse,
  Accesscontrol_accessgrant_GetRhombusKeyLocationLockdownDetailsForCurrentUserWSRequest,
  Accesscontrol_accessgrant_GetRhombusKeyLocationLockdownDetailsForCurrentUserWSResponse,
  Accesscontrol_credentials_GetRhombusSecureCsnCredentialDetailsWSRequest,
  Accesscontrol_credentials_GetRhombusSecureCsnCredentialDetailsWSResponse,
  Accesscontrol_credentials_GetStandardCsnCredentialDetailsWSRequest,
  Accesscontrol_credentials_GetStandardCsnCredentialDetailsWSResponse,
  Accesscontrol_lockdownplan_ActivateLockdownForLocationWSRequest,
  LockdownActivationResultEnumType,
  Accesscontrol_lockdownplan_ActivateLockdownForLocationWSResponse,
  Accesscontrol_lockdownplan_ActivateLockdownForLocationViaRhombusKeyWSRequest,
  Accesscontrol_lockdownplan_ActivateLockdownForLocationViaRhombusKeyWSResponse,
  LocationLockdownPlanType,
  Accesscontrol_lockdownplan_CreateLocationLockdownPlanWSRequest,
  Accesscontrol_lockdownplan_CreateLocationLockdownPlanWSResponse,
  Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSRequest,
  LockdownDeactivationResultEnumType,
  Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSResponse,
  Accesscontrol_lockdownplan_DeactivateLockdownForLocationViaRhombusKeyWSRequest,
  Accesscontrol_lockdownplan_DeactivateLockdownForLocationViaRhombusKeyWSResponse,
  Accesscontrol_lockdownplan_DeleteLocationLockdownStateWSRequest,
  Accesscontrol_lockdownplan_DeleteLocationLockdownStateWSResponse,
  Accesscontrol_lockdownplan_DeleteLockdownPlanWSRequest,
  Accesscontrol_lockdownplan_DeleteLockdownPlanWSResponse,
  Accesscontrol_lockdownplan_DisableLockdownTestModeForLocationWSRequest,
  Accesscontrol_lockdownplan_DisableLockdownTestModeForLocationWSResponse,
  Accesscontrol_lockdownplan_EnableLockdownTestModeForLocationWSRequest,
  Accesscontrol_lockdownplan_EnableLockdownTestModeForLocationWSResponse,
  Accesscontrol_lockdownplan_FindLocationLockdownEventsWSRequest,
  LockdownEventOriginatorEnumType,
  BaseLocationLockdownEventOriginator,
  LockdownStateEventEnumType,
  BaseLockdownStateEventType,
  Accesscontrol_lockdownplan_FindLocationLockdownEventsWSResponse,
  Accesscontrol_lockdownplan_FindLocationLockdownStatesWSRequest,
  Accesscontrol_lockdownplan_FindLocationLockdownStatesWSResponse,
  Accesscontrol_lockdownplan_FindLockdownPlansWSRequest,
  Accesscontrol_lockdownplan_FindLockdownPlansWSResponse,
  Accesscontrol_lockdownplan_FindLockdownPlansByLocationWSRequest,
  Accesscontrol_lockdownplan_FindLockdownPlansByLocationWSResponse,
  Accesscontrol_lockdownplan_GetLockdownPlanWSRequest,
  Accesscontrol_lockdownplan_GetLockdownPlanWSResponse,
  Accesscontrol_lockdownplan_GetOrCreateLocationLockdownStateWSRequest,
  Accesscontrol_lockdownplan_GetOrCreateLocationLockdownStateWSResponse,
  Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSRequest,
  Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSResponse,
  Accesscontrol_credentials_ProvisionMobileAccessControlCredentialForCurrentUserWSRequest,
  // Removed problematic schemas
  Accesscontrol_group_RemoveUsersFromAccessControlGroupWSRequest,
  Accesscontrol_group_RemoveUsersFromAccessControlGroupWSResponse,
  Accesscontrol_credentials_RevokeAccessControlCredentialWSRequest,
  Accesscontrol_credentials_RevokeAccessControlCredentialWSResponse,
  Accesscontrol_credentials_RevokeRhombusSecureMobileCredentialForCurrentUserWSRequest,
  Accesscontrol_credentials_RevokeRhombusSecureMobileCredentialForCurrentUserWSResponse,
  Accesscontrol_SendUserPresenceForCurrentUserWSRequest_Destination,
  Accesscontrol_SendUserPresenceForCurrentUserWSRequest,
  // Removed problematic schemas
  Accesscontrol_credentials_SuspendAccessControlCredentialWSRequest,
  Accesscontrol_credentials_SuspendAccessControlCredentialWSResponse,
  Accesscontrol_UnlockAccessControlledDoorWSRequest,
  // Removed problematic schemas
  Accesscontrol_UnlockAccessControlledDoorForCurrentUserWSRequest,
  // Removed problematic schemas
  Accesscontrol_credentials_UnsuspendAccessControlCredentialWSRequest,
  Accesscontrol_credentials_UnsuspendAccessControlCredentialWSResponse,
  Accesscontrol_accessgrant_UpdateAccessGrantWSRequest,
  Accesscontrol_accessgrant_UpdateAccessGrantWSResponse,
  Accesscontrol_accessrevocation_UpdateAccessRevocationWSRequest,
  Accesscontrol_accessrevocation_UpdateAccessRevocationWSResponse,
  Accesscontrol_credentials_UpdateRhombusSecureCsnCredentialWSRequest,
  Accesscontrol_credentials_UpdateRhombusSecureCsnCredentialWSResponse,
  Accesscontrol_credentials_UpdateRhombusSecureMobileCredentialWSRequest,
  Accesscontrol_credentials_UpdateRhombusSecureMobileCredentialWSResponse,
  Accesscontrol_credentials_UpdateStandardCsnCredentialWSRequest,
  Accesscontrol_credentials_UpdateStandardCsnCredentialWSResponse,
  Alertmonitoring_AcceptAlertMonitoringTermsOfServiceForLocationRequest,
  Alertmonitoring_AcceptAlertMonitoringTermsOfServiceResponse,
  Alertmonitoring_CancelThreatCaseWSRequest,
  Alertmonitoring_CancelThreatCaseWSResponse,
  EmergencyContact,
  NoonlightPromptTheme,
  EmergencyResponseContactsScheduleType,
  ActivityEnum,
  NoonlightScheduleType,
  AlertMonitoringPinType,
  NoonlightSettingsType,
  Alertmonitoring_CreateNoonlightSettingsForLocationRequest,
  Alertmonitoring_CreateNoonlightSettingsForLocationResponse,
  Alertmonitoring_CreatePinForNoonlightWSRequest,
  Alertmonitoring_CreatePinForNoonlightWSResponse,
  Alertmonitoring_DeleteNoonlightSettingsForLocationRequest,
  Alertmonitoring_DeleteNoonlightSettingsForLocationResponse,
  Alertmonitoring_DeletePinForNoonlightWSRequest,
  Alertmonitoring_DeletePinForNoonlightWSResponse,
  Alertmonitoring_DismissThreatCaseWSRequest,
  Alertmonitoring_DismissThreatCaseWSResponse,
  Alertmonitoring_EscalateThreatCaseToAlarmWSRequest,
  Alertmonitoring_EscalateThreatCaseToAlarmWSResponse,
  Alertmonitoring_GetNoonlightSettingsWSRequest,
  Alertmonitoring_GetNoonlightSettingsWSResponse,
  Alertmonitoring_GetNoonlightSettingsForLocationWSRequest,
  Alertmonitoring_GetNoonlightSettingsForLocationWSResponse,
  Alertmonitoring_UpdateNoonlightSettingsForLocationRequest,
  Alertmonitoring_UpdateNoonlightSettingsForLocationResponse,
  Audiogateway_DeleteAudioGatewayWSRequest,
  Audiogateway_DeleteAudioGatewayWSResponse,
  Audiogateway_GetAudioSeekpointsWSRequest,
  ToastCheckInfo,
  ToastOrderIdType,
  FootageSeekPointV2Type,
  Audiogateway_GetAudioSeekpointsWSResponse,
  Audiogateway_GetAudioGatewayConfigWSRequest,
  AudioExpressionDetectionConfig,
  AudioParamConfig,
  WeeklyMinuteIntervalType,
  IAudioUserConfig,
  Audiogateway_GetAudioGatewayConfigWSResponse,
  Audiogateway_GetFullAudioGatewayStateWSRequest,
  DeviceStatusEnum,
  DeviceHealthStatusDetailsEnum,
  HardwareVariationEnum,
  FullDeviceStateType,
  Audiogateway_GetFullAudioGatewayStateWSResponse,
  Audiogateway_GetMediaUrisWSRequest,
  Audiogateway_GetMediaUrisWSResponse,
  Audiogateway_GetMinimalAudioGatewayStatesWSRequest,
  MinimalAudioGatewayStateType,
  Audiogateway_GetMinimalAudioGatewayStatesWSResponse,
  Common_devices_GetPresenceWindowsWSRequest,
  TimeWindowSeconds,
  Common_devices_GetPresenceWindowsWSResponse,
  Common_devices_GetUptimeWindowsWSRequest,
  Common_devices_GetUptimeWindowsWSResponse,
  Audiogateway_UpdateAudioGatewayConfigWSRequest,
  Audiogateway_UpdateAudioGatewayConfigWSResponse,
  Audiogateway_UpdateAudioGatewayDetailsWSRequest,
  Audiogateway_UpdateAudioGatewayDetailsWSResponse,
  Audioplayback_DeleteAudioUploadMetadataWSRequest,
  Audioplayback_DeleteAudioUploadMetadataWSResponse,
  Audioplayback_GetAudioUploadMetadataForOrgWSRequest,
  AudioUploadMetadataType,
  Audioplayback_GetAudioUploadMetadataForOrgWSResponse,
  Audioplayback_PlayAudioUploadWSRequest,
  Audioplayback_PlayAudioUploadWSResponse,
  Audioplayback_UpdateAudioUploadMetadataWSRequest,
  Audioplayback_UpdateAudioUploadMetadataWSResponse,
  ContentDisposition,
  MediaType,
  MessageBodyWorkers,
  ParameterizedHeader,
  Providers,
  MultiPart,
  BodyPart,
  FormDataContentDisposition,
  FormDataBodyPart,
  FormDataMultiPart,
  Audioplayback_UploadAudioPcmWSResponse,
  Audioplayback_UploadAudioTextWSRequest,
  Audioplayback_UploadAudioTextWSResponse,
  Ble_GetBaseStationsWSRequest,
  Ble_GetBaseStationsWSResponse,
  Ble_BleDeviceMap,
  Ble_BleRegisteredDeviceWSType,
  Ble_GetSecureSecretForRegisteredWSResponse,
  Ble_BleUnregisteredHardwareWSType,
  Ble_GetSecureSecretForUnregisteredWSResponse,
  Ble_GetSensorHardwareFirmwareUpdateDetailsRequest,
  Ble_GetSensorHardwareFirmwareUpdateDetailsResponse,
  Ble_RegisterSensorWSRequest,
  Ble_RegisterSensorWSResponse,
  Ble_UnregisterSensorWSRequest,
  Ble_UnregisterSensorWSResponse,
  ActivateLocationLockdownActionType,
  AudioPlaybackActionType,
  IntegrationEnum,
  IntegrationNotificationActionType,
  RemoteDoorUnlockSystemEnum,
  RemoteDoorUnlockActionType,
  TriggerComponentRelayActionType,
  WebhookActionType,
  RuleActionType,
  RuleFilterType,
  ButtonPressEnum,
  Button_ExternalButtonRuleType,
  Button_CreateRuleForButtonWSRequest,
  Button_CreateRuleForButtonWSResponse,
  Button_DeleteRuleForButtonWSRequest,
  Button_DeleteRuleForButtonWSResponse,
  Button_GetButtonPressEventsForSensorWSRequest,
  ButtonModeEnum,
  ButtonEventType,
  Button_GetButtonPressEventsForSensorWSResponse,
  Button_GetButtonRulesForOrgWSRequest,
  Button_GetButtonRulesForOrgWSResponse,
  Button_GetMinimalButtonStatesWSRequest,
  Button_ButtonHealthEnum,
  Button_ButtonHealthDetailsEnum,
  Button_MinimalButtonStateType,
  Button_GetMinimalButtonStatesWSResponse,
  Button_GetRulesForButtonWSRequest,
  Button_GetRulesForButtonWSResponse,
  Deviceconfig_IExternalUpdateableButtonSettings,
  Button_UpdateButtonConfigWSRequest,
  Common_devices_UpdateConfigWSResponse,
  Button_UpdateButtonDetailsWSRequest,
  Common_devices_UpdateDeviceDetailsWSResponse,
  Common_devices_CalibrateFloorplanProjectionWSRequest,
  Common_devices_CalibrateFloorplanProjectionWSResponse,
  CustomFootageSeekPointType,
  Camera_CreateCustomFootageSeekpointsWSRequest,
  Camera_CreateFootageSeekpointsWSResponse,
  PointType,
  FootageBoundingBoxType,
  Camera_CreateFootageBoundingBoxesWSRequest,
  Camera_CreateFootageBoundingBoxesWSResponse,
  StreamTypeEnum,
  Camera_CreateSharedLiveVideoStreamWSRequest,
  Camera_CreateSharedLiveVideoStreamWSResponse,
  Camera_CreateSharedVideoWallWSRequest,
  Camera_CreateSharedVideoWallWSResponse,
  Camera_CreateRawHttpStreamWSRequest,
  Camera_CreateRawHttpStreamWSResponse,
  VideoWallType,
  Camera_CreateVideoWallWSRequest,
  Camera_CreateVideoWallWSResponse,
  Camera_DeleteCameraWSRequest,
  Camera_DeleteCameraWSResponse,
  Camera_DeleteCustomFootageSeekpointsWSRequest,
  Camera_DeleteCustomFootageSeekpointsWSResponse_SeekPointDeleteResponse,
  Camera_DeleteCustomFootageSeekpointsWSResponse,
  Camera_DeleteRawHttpStreamWSRequest,
  Camera_DeleteRawHttpStreamWSResponse,
  Camera_DeleteSharedLiveVideoStreamWSRequest,
  DeleteSharedLiveVideoStreamForDeviceResponse,
  Camera_DeleteSharedVideoWallWSRequest,
  Camera_DeleteSharedVideoWallWSResponse,
  Camera_DeleteVideoWallWSRequest,
  Camera_DeleteVideoWallWSResponse,
  Camera_EraseCameraWSRequest,
  Camera_EraseCameraWSResponse,
  Camera_FindAllSharedLiveVideoStreamsWSRequest,
  Camera_SharedLiveVideoStreamWS,
  Camera_FindAllSharedLiveVideoStreamsWSResponse,
  Camera_FindSharedLiveVideoStreamsForWSRequest,
  Camera_FindSharedLiveVideoStreamsWSResponse,
  Camera_FindSharedVideoWallsWSRequest,
  DeviceSchedule,
  Camera_SharedVideoWallWS,
  Camera_FindSharedVideoWallsWSResponse,
  Camera_GenerateBatchRegistrationInfoRequest,
  Camera_GenerateBatchRegistrationInfoResponse,
  Camera_GenerateWifiChangeAuthorizationTokenWSRequest,
  Camera_GenerateWifiChangeAuthorizationTokenWSResponse,
  Camera_GetBatchRegistrationTokenUsageRequest,
  BatchRegistrationTokenUsageResult,
  Camera_GetBatchRegistrationTokenUsageResponse,
  Camera_GetCameraAIThresholdsWSRequest,
  Camera_GetCameraAIThresholdsWSResponse,
  Camera_GetCloudArchivedMediaInfoWSRequest,
  Camera_GetCloudArchivedMediaInfoWSResponse,
  Camera_GetCloudArchivingConfigWSRequest,
  DeviceTargetScope,
  CloudArchivingStrategy,
  ScopedCloudArchivingConfig,
  Camera_GetCloudArchivingConfigWSResponse,
  Camera_GetConfigWSRequest,
  CameraAiDewarpConfigType,
  RegionCoordinateType,
  RegionPolygonType,
  CameraCrossCountingSettingsType,
  CameraMeteringConfigType,
  PermyriadRect,
  CameraMotorConfigType,
  CameraPTZConfigType,
  RegionConfigType,
  Deviceconfig_ExternalVideoResolution,
  AspectRatio,
  DewarpedView,
  CameraVisualTamperConfigType,
  Camera_ExternalCameraUserConfigReadableType,
  Camera_GetConfigWSResponse,
  Camera_GetCustomFootageSeekpointsV2WSRequest,
  SeekpointIndexType,
  Camera_GetCustomFootageSeekpointsV2WSResponse,
  Camera_GetCameraDetailsWSRequest,
  DeviceTypeEnum,
  Camera_CameraExternalType,
  Camera_GetCameraDetailsWSResponse,
  Camera_GetFootageBoundingBoxesWSRequest,
  Camera_GetFootageBoundingBoxesWSResponse,
  Camera_GetFootageBoundingBoxesForMultipleWSRequest,
  Camera_FootageBoundingBoxSummaryType,
  Camera_GetFootageBoundingBoxesForMultipleWSResponse,
  Camera_GetFootageSeekpointsForMultipleWSRequest,
  Camera_FootageSeekPointSummaryType,
  Camera_GetFootageSeekpointsForMultipleWSResponse,
  Camera_GetFootageSeekpointsV2WSRequest,
  Camera_GetFootageSeekpointsV2WSResponse,
  Camera_GetFullCameraStateWSRequest,
  Camera_GetFullCameraStateWSResponse,
  Camera_GetMediaUrisWSRequest,
  Camera_GetMediaUrisWSResponse,
  Camera_GetMinimalCameraLocationMapWSRequest,
  Camera_GetMinimalCameraLocationMapWSResponse_CameraLocationInfo,
  Camera_GetMinimalCameraLocationMapWSResponse,
  Camera_GetMinimalCameraStateListWSRequest,
  MinimalDeviceStateType,
  Camera_GetMinimalCameraStateListWSResponse,
  Camera_GetOfflineLanStreamingInfoWSRequest,
  Camera_CameraOfflineLanStreamingInfo,
  Camera_GetOfflineLanStreamingInfoWSResponse,
  Camera_GetPresenceWindowsWSRequest,
  Camera_GetPresenceWindowsWSResponse,
  Camera_GetRawHttpStreamsWSRequest,
  Camera_LanSpecificRawStreamType,
  Camera_GetRawHttpStreamsWSResponse,
  Camera_GetStorageRecoveryFileWSRequest,
  Camera_GetStorageRecoveryFileWSResponse,
  Camera_GetUptimeWindowsWSRequest,
  Camera_GetUptimeWindowsWSResponse,
  Camera_GetVideoWallsWSRequest,
  Camera_VideoWallSummaryType,
  Camera_GetVideoWallsWSResponse,
  Camera_RebootCameraWSRequest,
  Camera_RebootCameraWSResponse,
  Camera_UpdateCameraAIThresholdsWSRequest,
  Camera_UpdateCameraAIThresholdsWSResponse,
  Camera_ExternalCameraUserConfigUpdatableType,
  Camera_UpdateConfigWSRequest,
  Camera_UpdateConfigWSResponse,
  Camera_UpdateCameraV2WSRequest,
  Camera_UpdateCamerasBulkV2WSRequest,
  Camera_UpdateCameraV2WSResponse,
  Camera_UpdateCameraFirmwareWSRequest,
  Camera_UpdateCameraFirmwareWSResponse,
  Camera_UpdateVideoWallWSRequest,
  Camera_UpdateVideoWallWSResponse,
  Camera_UpdateWifiWSRequest,
  Camera_UpdateWifiWSResponse,
  Climate_GetClimateEventsForSensorWSRequest,
  ClimateEventType,
  Climate_GetClimateEventsForSensorWSResponse,
  Sensor_GetSensorPresenceWindowsWSRequest,
  Sensor_GetSensorPresenceWindowsWSResponse,
  Climate_GetClimateSensorConfigWSRequest,
  ClimateUserConfig,
  Climate_GetClimateSensorConfigWSResponse,
  Climate_GetMinimalClimateStatesWSRequest,
  Climate_MinimalClimateStateType,
  Climate_GetMinimalClimateStatesWSResponse,
  Climate_UpdateClimateSensorDetailsWSRequest,
  Climate_UpdateClimateSensorDetailsWSResponse,
  Component_AddAccessControlledDoorLabelWSRequest,
  Component_AddAccessControlledDoorLabelWSResponse,
  ComponentReferenceType,
  ComponentCompositeEnumType,
  WaveToUnlockSettingsType,
  AccessControlledDoorType,
  Component_CreateAccessControlledDoorWSRequest,
  Component_CreateAccessControlledDoorWSResponse,
  DoorPositionIndicatorPhysicalPortEnumType,
  DoorPositionIndicatorPortType,
  Component_CreateIntegratedDoorPositionIndicatorWSRequest,
  ComponentBaseEnumType,
  DoorPositionIndicatorEnumType,
  NormalStateEnumType,
  ComponentEnumType,
  IntegratedDoorPositionIndicatorType,
  Component_CreateIntegratedDoorPositionIndicatorWSResponse,
  DoorRelayPhysicalPortEnumType,
  DoorRelayPortType,
  Component_CreateIntegratedDoorRelayWSRequest,
  DoorRelayEnumType,
  IntegratedDoorRelayType,
  Component_CreateIntegratedDoorRelayWSResponse,
  ButtonPhysicalPortEnumType,
  ButtonPortType,
  Component_CreateIntegratedGenericButtonWSRequest,
  ButtonEnumType,
  IntegratedGenericButtonType,
  Component_CreateIntegratedGenericButtonWSResponse,
  AuxiliaryInputPhysicalPortEnumType,
  AuxiliaryInputPortType,
  Component_CreateIntegratedGenericInputWSRequest,
  AuxiliaryEnumType,
  IntegratedGenericInputType,
  Component_CreateIntegratedGenericInputWSResponse,
  AuxiliaryRelayPhysicalPortEnumType,
  AuxiliaryRelayPortType,
  Component_CreateIntegratedGenericRelayWSRequest,
  IntegratedGenericRelayType,
  Component_CreateIntegratedGenericRelayWSResponse,
  RequestToExitPhysicalPortEnumType,
  RequestToExitPortType,
  Component_CreateIntegratedRequestToExitWSRequest,
  RequestToExitEnumType,
  IntegratedRequestToExitType,
  Component_CreateIntegratedRequestToExitWSResponse,
  OsdpPhysicalPortEnumType,
  OsdpReaderPortType,
  Component_CreateOsdpReaderWSRequest,
  DoorReaderEnumType,
  OsdpDoorReaderType,
  Component_CreateOsdpReaderWSResponse,
  Component_CreateRhombusOsdpReaderWSRequest,
  RhombusOsdpDoorReaderType,
  Component_CreateRhombusOsdpReaderWSResponse,
  WiegandOutputPhysicalPortEnumType,
  WiegandOutputPortType,
  WiegandDataPhysicalPortEnumType,
  WiegandDataPortType,
  WiegandInputPhysicalPortEnumType,
  WiegandInputPortType,
  Component_CreateWiegandReaderWSRequest,
  WiegandDoorReaderType,
  Component_CreateWiegandReaderWSResponse,
  Component_DeleteAccessControlledDoorWSRequest,
  Component_DeleteAccessControlledDoorWSResponse,
  Component_DeleteComponentWSRequest,
  Component_DeleteComponentWSResponse,
  Component_DeleteComponentsByOwnerDeviceWSRequest,
  Component_DeleteComponentsByOwnerDeviceWSResponse,
  Component_FindAccessControlledDoorsWSRequest,
  Component_FindAccessControlledDoorsWSResponse,
  Component_FindAccessControlledDoorsByLocationWSRequest,
  Component_FindAccessControlledDoorsByLocationWSResponse,
  Component_FindAccessControlledDoorsByOwnerDeviceWSRequest,
  Component_FindAccessControlledDoorsByOwnerDeviceWSResponse,
  Component_FindAllComponentShadowsWSRequest,
  ComponentShadowEnumType,
  ComponentShadowType,
  Component_FindAllComponentShadowsWSResponse,
  Component_FindComponentEventsByAccessControlledDoorWSRequest,
  ComponentEventEnumType,
  ComponentEventType,
  Component_FindComponentEventsByAccessControlledDoorWSResponse,
  Component_FindComponentEventsByApiTokenWSRequest,
  Component_FindComponentEventsByApiTokenWSResponse,
  Component_FindComponentEventsByComponentWSRequest,
  Component_FindComponentEventsByComponentWSResponse,
  Component_FindComponentEventsByCorrelationWSRequest,
  Component_FindComponentEventsByCorrelationWSResponse,
  Component_FindComponentEventsByCredentialHexValueWSRequest,
  Component_FindComponentEventsByCredentialHexValueWSResponse,
  Component_FindComponentEventsByCredentialUuidWSRequest,
  Component_FindComponentEventsByCredentialUuidWSResponse,
  Component_FindComponentEventsByCredentialValueWSRequest,
  Component_FindComponentEventsByCredentialValueWSResponse,
  Component_FindComponentEventsByLocationWSRequest,
  Component_FindComponentEventsByLocationWSResponse,
  Component_FindComponentEventsByOwnerDeviceWSRequest,
  Component_FindComponentEventsByOwnerDeviceWSResponse,
  Component_FindComponentEventsBySupportAuthorityWSRequest,
  Component_FindComponentEventsBySupportAuthorityWSResponse,
  Component_FindComponentEventsByUserWSRequest,
  Component_FindComponentEventsByUserWSResponse,
  Component_FindComponentEventsForCurrentUserWSRequest,
  Component_FindComponentEventsForCurrentUserWSResponse,
  Component_FindComponentSeekPointsByAccessControlledDoorWSRequest,
  ComponentSeekPointType,
  Component_FindComponentSeekPointsByAccessControlledDoorWSResponse,
  Component_FindComponentSeekPointsByComponentWSRequest,
  Component_FindComponentSeekPointsByComponentWSResponse,
  Component_FindComponentSeekPointsByLocationWSRequest,
  Component_FindComponentSeekPointsByLocationWSResponse,
  Component_FindComponentSeekPointsByOwnerDeviceWSRequest,
  Component_FindComponentSeekPointsByOwnerDeviceWSResponse,
  Component_FindComponentSeekPointsByUserWSRequest,
  Component_FindComponentSeekPointsByUserWSResponse,
  Component_FindComponentShadowsByOwnerDeviceWSRequest,
  Component_FindComponentShadowsByOwnerDeviceWSResponse,
  Component_FindComponentsByOwnerDeviceWSRequest,
  BaseComponentType,
  Component_FindComponentsByOwnerDeviceWSResponse,
  Component_GetAccessControlledDoorLabelsForOrgWSRequest,
  Component_GetAccessControlledDoorLabelsForOrgWSResponse,
  Component_GetOrCreateDevicePhysicalPortConfigWSRequest,
  InvalidPhysicalPortConfigType,
  PhysicalPortType,
  BoardPhysicalPortConfigType,
  DevicePhysicalPortConfigType,
  Component_GetOrCreateDevicePhysicalPortConfigWSResponse,
  Component_RemoveAccessControlledDoorLabelWSRequest,
  Component_RemoveAccessControlledDoorLabelWSResponse,
  Component_UpdateAccessControlledDoorWSRequest,
  Component_UpdateAccessControlledDoorWSResponse,
  Component_UpdateIntegratedDoorPositionIndicatorWSRequest,
  Component_UpdateIntegratedDoorPositionIndicatorWSResponse,
  Component_UpdateIntegratedDoorRelayWSRequest,
  Component_UpdateIntegratedDoorRelayWSResponse,
  Component_UpdateIntegratedGenericButtonWSRequest,
  Component_UpdateIntegratedGenericButtonWSResponse,
  Component_UpdateIntegratedGenericInputWSRequest,
  Component_UpdateIntegratedGenericInputWSResponse,
  Component_UpdateIntegratedGenericRelayWSRequest,
  Component_UpdateIntegratedGenericRelayWSResponse,
  Component_UpdateIntegratedRequestToExitWSRequest,
  Component_UpdateIntegratedRequestToExitWSResponse,
  Component_UpdateOsdpReaderWSRequest,
  Component_UpdateOsdpReaderWSResponse,
  Component_UpdateRhombusOsdpReaderWSRequest,
  Component_UpdateRhombusOsdpReaderWSResponse,
  Component_UpdateWiegandReaderWSRequest,
  Component_UpdateWiegandReaderWSResponse,
  Customer_AcceptUsagePolicyRequest,
  Customer_AcceptUsagePolicyResponse,
  Customer_DeleteNotificationSnoozeSettingWSRequest,
  Customer_DeleteNotificationSnoozeSettingWSResponse,
  Customer_GetCurrentPartnerUserWSRequest,
  NotificationEnumType,
  NotificationIntervalV2Type,
  PartnerNotificationSettingsType,
  User_WrappedRhombusOrgUserType,
  Customer_GetCurrentPartnerUserWSResponse,
  Customer_GetCurrentRhombusKeyUserWSRequest,
  User_RhombusKeyOrgDetailsType,
  RhombusKeyAppPreferencesType,
  // Removed problematic schemas
  StaticEpochSecondsProvisioner,
  EpochSecondsProvisioner,
  RhombusSecureMobileCredentialProvisioningRulesType,
  RhombusKeyAppSettingsType,
  RhombusKeyAppConfigType,
  Customer_GetCurrentRhombusKeyUserWSResponse,
  Customer_GetCurrentUserWSRequest,
  DashboardCustomizations,
  UserCustomizationsType,
  UserNotificationSettingsV3Type,
  Customer_GetCurrentUserWSResponse,
  Customer_GetCurrentUserConsoleOrgsForContextSwitchWSRequest,
  Customer_SelectableOrgForContextSwitch,
  Customer_GetCurrentUserConsoleOrgsForContextSwitchWSResponse,
  Customer_GetCurrentUserRhombusKeyOrgsForContextSwitchWSRequest,
  Customer_GetCurrentUserRhombusKeyOrgsForContextSwitchWSResponse,
  Customer_GetCurrentUserSessionsWSRequest,
  SessionClientInfoType,
  GeoIpLocationType,
  SessionInfoWSType,
  Customer_GetCurrentUserSessionsWSResponse,
  Customer_GetDashboardstatusWSRequest,
  DashboardStatus,
  Customer_GetDashboardStatusWSResponse,
  Customer_GetRhombusKeyConfigForCurrentUserWSRequest,
  Customer_GetRhombusKeyConfigForCurrentUserWSResponse,
  Customer_GetUserSnoozedNotificationSettingsWSRequest,
  ScheduledIntervalType,
  Customer_GetUserSnoozedNotificationSettingsWSResponse,
  Customer_LogoutAllOtherCurrentUserSessionsRequest,
  Customer_LogoutAllOtherCurrentUserSessionsResponse,
  Customer_SetFlagWSRequest,
  Customer_SetFlagWSResponse,
  Customer_SnoozeAllNotificationsWSRequest,
  Customer_SnoozeAllNotificationsWSResponse,
  Customer_SnoozeNotificationsWSRequest,
  Customer_SnoozeNotificationsWSResponse,
  Customer_UpdateCurrentPartnerWSRequest,
  Customer_UpdateCurrentPartnerWSResponse,
  Customer_UpdateCurrentUserWSRequest,
  Customer_UpdateCurrentUserWSResponse,
  Customer_UpdateDashboardCustomizationsWSRequest,
  Customer_UpdateDashboardCustomizationsWSResponse,
  Customer_UpdateFrontendCustomizationsWSRequest,
  Customer_UpdateFrontendCustomizationsWSResponse,
  Customer_UpdateRhombusKeyPreferencesForCurrentUserWSRequest,
  Customer_UpdateRhombusKeyPreferencesForCurrentUserWSResponse,
  EventListenerType,
  Developer_CreateEventListenerWSRequest,
  Developer_CreateEventListenerWSResponse,
  Developer_DeleteEventListenerWSRequest,
  Developer_DeleteEventListenerWSResponse,
  Developer_GetAllEventListenersWSRequest,
  Developer_GetAllEventListenersWSResponse,
  Developer_GetEventListenersForDeviceWSRequest,
  Developer_GetEventListenersForDeviceWSResponse,
  Door_GetDoorEventsForSensorWSRequest,
  DoorEventType,
  Door_GetDoorEventsForSensorWSResponse,
  Door_GetMinimalDoorStatesWSRequest,
  Door_MinimalDoorStateType,
  Door_GetMinimalDoorStatesWSResponse,
  Door_UpdateDoorSensorDetailsWSRequest,
  Door_UpdateDoorSensorDetailsWSResponse,
  Doorbellcamera_ExternalDoorbellCameraComponentRuleType,
  Doorbellcamera_CreateRuleForDoorbellCameraWSRequest,
  Doorbellcamera_CreateRuleForDoorbellCameraWSResponse,
  Doorbellcamera_DeleteDoorbellCameraWSRequest,
  Doorbellcamera_DeleteDoorbellCameraWSResponse,
  Doorbellcamera_DeleteRuleForDoorbellCameraWSRequest,
  Doorbellcamera_DeleteRuleForDoorbellCameraWSResponse,
  Common_devices_GetBoundingBoxesWSRequest,
  Common_devices_GetBoundingBoxesWSResponse,
  Common_devices_GetConfigWSRequest,
  Deviceconfig_IExternalReadableAudioVideoSettings,
  Doorbellcamera_GetDoorbellCameraConfigWSResponse,
  Doorbellcamera_GetDoorbellCameraRulesForOrgWSRequest,
  Doorbellcamera_GetDoorbellCameraRulesForOrgWSResponse,
  Common_devices_GetFullDeviceStateWSRequest,
  Doorbellcamera_GetDoorbellCameraFullStateWSResponse,
  Common_devices_GetMediaUrisWSRequest,
  Doorbellcamera_GetDoorbellCameraMediaUrisWSResponse,
  Common_devices_GetMinimalDeviceStateListWSRequest,
  Doorbellcamera_GetDoorbellCameraMinimalStateListWSResponse,
  Doorbellcamera_GetRulesForDoorbellCameraWSRequest,
  Doorbellcamera_GetRulesForDoorbellCameraWSResponse,
  Common_devices_GetSeekpointsWSRequest,
  Common_devices_GetSeekpointsWSResponse,
  Deviceconfig_IExternalUpdateableAudioVideoSettings,
  Doorbellcamera_UpdateDoorbellCameraConfigWSRequest,
  Doorbellcamera_UpdateDoorbellCameraDetailsWSRequest,
  Doorcontroller_DeleteDoorControllerWSRequest,
  Doorcontroller_DeleteDoorControllerWSResponse,
  Deviceconfig_IExternalReadableDoorControllerSettings,
  Doorcontroller_GetDoorControllerConfigWSResponse,
  Doorcontroller_GetDoorControllerStateListWSRequest,
  Doorcontroller_DoorControllerDiscoveredReaderType,
  Doorcontroller_DoorControllerStateType,
  Doorcontroller_GetDoorControllerStateListWSResponse,
  Doorcontroller_RegisterDiscoveredRhombusReaderWSRequest,
  Doorcontroller_RegisterDiscoveredRhombusReaderWSResponse,
  Deviceconfig_IExternalUpdateableDoorControllerSettings,
  Doorcontroller_UpdateDoorControllerConfigWSRequest,
  Doorcontroller_UpdateDoorControllerDetailsWSRequest,
  Doorcontroller_UpdateDoorControllerDetailsWSResponse,
  Ethernettester_GetEthernetTesterConfigWSRequest,
  Ethernettester_GetEthernetTesterConfigWSResponse,
  Event_CreateSharedClipGroupWSRequest_RuuidWrapper,
  Event_CreateSharedClipGroupWSRequest,
  Event_CreateSharedClipGroupWSResponse,
  Event_DeleteAlertMonitoringThreatCaseWSRequest,
  Event_DeleteAlertMonitoringThreatCaseWSResponse,
  Event_DeleteSavedClipWSRequest,
  Event_DeleteSavedClipWSResponse,
  Event_DeleteSharedClipGroupWSRequest,
  Event_DeleteSharedClipGroupWSResponse,
  Event_DismissAllPolicyAlertsForDeviceWSRequest,
  Event_DismissAllPolicyAlertsForDeviceWSResponse,
  Event_DismissAllPolicyAlertsWSRequest,
  Event_DismissAllPolicyAlertsWSResponse,
  Event_DismissPolicyAlertWSRequest,
  Event_DismissPolicyAlertWSResponse,
  Event_DismissPolicyAlertsWSRequest,
  Event_DismissPolicyAlertsWSResponse,
  Event_GetAlertMonitoringThreatCasesWSRequest,
  ThreatCaseStatus,
  ThreatCaseTimelineEventTypeEnum,
  ThreatCaseTimelineEventType,
  AlertMonitoringThreatCaseType,
  Event_GetAlertMonitoringThreatCasesWSResponse,
  Event_GetClipsWithProgressWSRequest,
  CroppedPermyriadRect,
  AlteredView,
  MetaDataLocationType,
  Resolution,
  Event_SavedClipWithProgressType,
  Event_GetClipsWithProgressWSResponse,
  Event_GetMotionGridWSRequest,
  Event_FrontendCell,
  Event_GetMotionGridWSResponse,
  Event_GetMotionGridCountsWSResponse,
  Event_GetPolicyAlertCountWSRequest,
  Event_GetPolicyAlertCountWSResponse,
  Event_GetPolicyAlertDetailsWSRequest,
  ClipBoundingBoxType,
  PolicyEventFaceType,
  PolicyEventVehicleType,
  ClipSeekPointV2Type,
  PolicyAlertWithDetailsType,
  Event_GetPolicyAlertDetailsWSResponse,
  Event_GetPolicyAlertGroupsForDeviceWSRequest,
  PolicyAlertV2Type,
  Event_PolicyAlertGroupV2,
  Event_GetPolicyAlertGroupsForDeviceWSResponse,
  Event_GetPolicyAlertGroupsForLocationWSRequest,
  Event_GetPolicyAlertGroupsForLocationWSResponse,
  Event_GetPolicyAlertsWSRequest,
  BasePolicyAlertType,
  Event_GetPolicyAlertsWSResponse,
  Event_GetSavedClipCountWSRequest,
  Event_GetSavedClipCountWSResponse,
  Event_GetSavedClipDetailsWSRequest,
  SavedClipWithDetailsType,
  Event_GetSavedClipDetailsWSResponse,
  Event_GetSavedClipsByExternalTransactionIdWSRequest,
  SavedClipV2Type,
  Event_GetSavedClipsByExternalTransactionIdWSResponse,
  Event_GetSavedClipsV2WSRequest,
  Event_GetSavedClipsV2WSResponse,
  Event_GetSharedClipGroupDetailsWSRequest,
  SharedClipWithDetailsType,
  SharedClipGroupWithDetailsType,
  Event_GetSharedClipGroupDetailsWSResponse,
  Event_GetSharedClipGroupsV2WSRequest,
  SharedClipV2Type,
  SharedClipGroupWrapperV2Type,
  Event_GetSharedClipGroupsV2WSResponse,
  Event_GetUnhealthyDeviceAlertsWSRequest,
  UnHealthyDeviceAlertType,
  Event_GetUnhealthyDeviceAlertsWSResponse,
  Event_MuteNotificationsForDevicetWSRequest,
  Event_MuteNotificationsForDevicetWSResponse,
  Event_ReportBadPolicyAlertWSRequest,
  Event_ReportBadPolicyAlertWSResponse,
  Event_SavePolicyAlertWSRequest,
  Event_SavePolicyAlertWSResponse,
  Event_SearchMotionGridWSRequest,
  Event_SearchMotionGridWSResponse,
  Event_SearchMotionGridWithActivitiesWSRequest,
  Event_SearchMotionGridWithActivitiesWSResponse_ActivityWithId,
  Event_SearchMotionGridWithActivitiesWSResponse_MotionGridActivity,
  Event_SearchMotionGridWithActivitiesWSResponse,
  Event_UpdateSavedClipWSRequest,
  Event_UpdateSavedClipWSResponse,
  Event_UpdateSharedClipGroupWSRequest,
  Event_UpdateSharedClipGroupWSResponse,
  Export_ExportAuditEventsWSRequest,
  Export_ExportClimateEventsWSRequest,
  Export_ExportCountReportsWSRequest,
  Export_ExportDiagnosticEventsWSRequest,
  Export_ExportDoorEventsWSRequest,
  FaceFilter,
  TimeInterval,
  Export_ExportFaceEventsWSRequest,
  Export_ExportInventoryWSRequest,
  Export_ExportMotionEventsWSRequest,
  Export_ExportPeopleCountEventsWSRequest,
  Export_ExportPeopleEventsWSRequest,
  Export_ExportProximityEventsWSRequest,
  Export_ExportProximityLocomotionEventsWSRequest,
  Export_ExportUptimeWSRequest,
  Export_ExportUsersWSRequest,
  Vehicle_GetVehicleEventsWSRequest,
  Face_AddFaceLabelWSRequest,
  Face_AddFaceLabelWSResponse,
  Face_DisassociateFaceEventsWSRequest,
  Face_DisassociateFaceEventsWSResponse,
  Face_GetFaceWSRequest,
  FaceType,
  Face_GetFaceWSResponse,
  Face_GetFaceLabelsForOrgWSRequest,
  Face_GetFaceLabelsForOrgWSResponse,
  Face_GetFacesForNameWSRequest,
  Face_GetFacesForNameWSResponse,
  Face_GetFacesWSRequest,
  Face_GetFacesWSResponse,
  Face_GetRecentFaceEventsWSRequest_Filter,
  Face_GetRecentFaceEventsWSRequest_Interval,
  Face_GetRecentFaceEventsByLocationWSRequest,
  FaceEventType,
  Face_GetRecentFaceEventsByLocationWSResponse,
  Face_GetRecentFaceEventsForFaceWSRequest,
  Face_GetRecentFaceEventsForFaceWSResponse,
  Face_GetRecentFaceEventsForNameWSRequest,
  Face_GetRecentFaceEventsForNameWSResponse,
  Face_GetRecentFaceEventsWSRequest,
  Face_GetRecentFaceEventsWSResponse,
  Face_GetUploadedFacesWSRequest,
  UploadFaceMetadataType,
  Face_GetUploadedFacesWSResponse,
  Face_GetUploadedFacesByTransactionIdWSRequest,
  Face_RemoveFaceLabelWSRequest,
  Face_RemoveFaceLabelWSResponse,
  Face_ReportFaceEventWSRequest,
  Face_ReportFaceEventWSResponse,
  Face_UpdateFaceWSRequest_FaceUpdate,
  Face_UpdateFaceWSRequest,
  Face_UpdateFaceWSResponse,
  Feature_GetDeviceEventTypesWSRequest,
  Feature_GetDeviceEventTypesWSResponse,
  Feature_GetDeviceFeaturesWSRequest,
  Feature_DeviceFeaturesType,
  Feature_GetDeviceFeaturesWSResponse,
  Feature_GetDeviceFeaturesListWSRequest,
  Feature_GetDeviceFeaturesListWSResponse,
  Feature_GetFeatureCompatabilityMatrixWSRequest,
  DeviceFeatureEnum,
  License,
  FeatureCompatabilityType,
  Feature_GetFeatureCompatabilityMatrixWSResponse,
  Feature_UpdateDeviceFeaturesWSRequest,
  Feature_UpdateDeviceFeaturesWSResponse,
  GuestActivity,
  IGuest,
  Integration_UpdateGuestByTokenWSRequest,
  BaseApiResponse,
  Help_SendFeedbackWSRequest,
  Help_SendFeedbackWSResponse,
  Help_GetOpenTicketsV2WSRequest,
  Help_TicketInformation,
  Help_GetOpenTicketsV2WSResponse,
  Help_ProcessRMAWSRequest,
  Help_ProcessRMAWSResponse,
  Help_CreateTicketWSRequest,
  Help_CreateTicketWSResponse,
  EnvoyCustomField,
  EnvoyPersonInfo,
  EnvoyInvite,
  Integration_CreateEnvoyInviteWSRequest,
  Integration_BaseIntegrationWSRequest,
  Integration_UpdateOrgIntegrationsWSResponse,
  Integration_GuestWSRequest,
  Integration_GetAllGuestsWSResponse,
  Integration_GetAmtReadersWSRequest,
  DoorType,
  Integration_GetBadgeIntegrationDoorsWSResponse,
  Integration_GetApiTokenApplicationsWSRequest,
  ApiTokenAuthTypeEnum,
  ApiClientTypeEnum,
  ApiTokenApplicationType,
  Integration_GetApiTokenApplicationsWSResponse,
  Integration_GetApiTokensWSRequest,
  ApiTokenType,
  Integration_GetApiTokensWSResponse,
  Integration_GetBrivoDoorsWSRequest,
  Integration_GetBrivoDoorsWSResponse,
  Integration_GetButterflymxPanelsWSRequest,
  Integration_ButterflymxBuilding,
  Integration_GetButterflymxPanelsWSResponse,
  IntegrationAuditEventEnum,
  IntegrationAuditEvent,
  IBaseIntegrationType,
  Integration_GetOrgIntegrationsV2WSResponse,
  Integration_GetGeneaDoorsWSRequest,
  PanelType,
  Integration_GetGeneaDoorsWSResponse,
  Integration_GetGuestWSResponse,
  InformacastMessageTemplate,
  Integration_GetInformacastMessageTemplatesWSResponse,
  Integration_GetKisiDoorsWSRequest,
  Integration_GetKisiDoorsWSResponse,
  Integration_GetKisiPlacesWSRequest,
  PlaceType,
  Integration_GetBadgeIntegrationPlacesWSResponse,
  Integration_GetMicrosoftUsersJoinedTeamsWSResponse,
  Integration_GetOpenAIModelsWSRequest,
  OpenAIModel,
  Integration_GetOpenAIModelsWSResponse,
  Integration_GetOpenpathDoorsWSRequest,
  Integration_GetOpentechAllianceFacilitiesWSRequest,
  OpentechAllianceActionGroupType,
  OpentechAllianceFacilityType,
  Integration_GetOpentechAllianceFacilitiesWSResponse,
  Integration_GetOrgIntegrationsWSRequest,
  BadgeIntegrationDoorInfoType,
  AmtSettings,
  AwsSettings,
  BackblazeSettings,
  BoxSettings,
  BrivoSettings,
  ButterflymxPanelInfoType,
  ButterflyMXSettings,
  DiceSettings,
  DropboxSettingsV2,
  EmailSettings,
  EnvoyLocationInfoType,
  EnvoySettings,
  GeneaSettings,
  GoogleSettings,
  GoogleSettingsV2,
  HaloSettings,
  ImmixSettings,
  TriggerContent,
  IntuifaceSettings,
  BadgeIntegrationSettings,
  KisiSettings,
  LumeoSettings,
  MattermostSettings,
  MicrosoftTeamsSettings,
  EmergencyResponseContactsIntervalType,
  AlertMonitoringSubmissionDelayIntervalType,
  NoonlightSettings,
  Office365Settings,
  WebhookMapEntry,
  OpenpathSettings,
  OpentechAllianceDoorInfoType,
  OpentechAllianceFacilitySettings,
  OpentechAllianceSettings,
  PagerDutySettings,
  PlaceOsSettings,
  ProDataKeySettings,
  SaltoSettings,
  ServiceNowSettings,
  SlackSettings,
  UserInfo,
  SlackSettingsV2,
  SquareSettings,
  PosIntegrationInfoType,
  ToastRestaurantInfo,
  ToastSettings,
  TPLinkSettings,
  TwilioSettings,
  WebhookSettings,
  OrgIntegrationsType,
  Integration_GetOrgIntegrationsWSResponse,
  Integration_GetAllOrgIntegrationsV2WSResponse,
  Integration_GetPdkDoorsWSRequest,
  Integration_GetPdkDoorsWSResponse,
  Integration_GetPlaceOsDoorsWSRequest,
  GenericDoorType,
  Integration_GetBadgeIntegrationGenericDoorsWSResponse,
  Integration_GetToastServiceAreasWSRequest,
  GenericPosType,
  Integration_GetToastServiceAreasWSResponse,
  Integration_InitiateOAuthWSRequest,
  Integration_InitiateOAuthWSResponse,
  Integration_UpdateMicrosoftTeamsBotForTeamWSRequest,
  Integration_RefreshGoogleAccessTokenWSRequest,
  Integration_RefreshGoogleAccessTokenWSResponse,
  Integration_RevokeApiTokenWSRequest,
  Integration_RevokeApiTokenWSResponse,
  Integration_SubmitApiTokenApplicationWSRequest,
  Integration_SubmitApiTokenApplicationWSResponse,
  ZapierEnum,
  Integration_SubscribeZapierWebhookWSRequest,
  Integration_SubscribeZapierWebhookWSResponse,
  Integration_TogglePowerWSRequest,
  Integration_TogglePowerWSResponse,
  Integration_UnlockIntegrationGenericDoorWSRequest,
  Integration_UnlockDoorWSResponse,
  Integration_UnlockGeneaDoorWSRequest,
  Integration_UnlockKisiDoorWSRequest,
  Integration_UnlockOpenpathDoorWSRequest,
  Integration_UnsubscribeZapierWebhookWSRequest,
  Integration_UpdateAmtIntegrationWSRequest,
  Integration_UpdateApiTokenWSRequest,
  Integration_UpdateApiTokenWSResponse,
  Integration_UpdateAwsIntegrationWSRequest,
  Integration_UpdateBoxIntegrationWSRequest,
  Integration_UpdateBrivoIntegrationWSRequest,
  Integration_UpdateButterflymxIntegrationWSRequest,
  DeviceIntegrationSettings,
  IDeviceIntegrationType,
  Integration_UpdateDeviceIntegrationWSRequest,
  IDiceType,
  Integration_UpdateDiceIntegrationWSRequest,
  Integration_UpdateDropboxIntegrationWSRequest,
  Integration_UpdateEmailIntegrationWSRequest,
  EnvoyUserSettings,
  IEnvoyType,
  Integration_UpdateEnvoyIntegrationV2WSRequest,
  Integration_UpdateGeneaIntegrationWSRequest,
  IGoogleType,
  Integration_UpdateGoogleIntegrationV2WSRequest,
  Integration_UpdateGuestWSRequest,
  LocationSettings,
  IGuestManagementType,
  Integration_UpdateGuestManagementIntegrationWSRequest,
  Integration_UpdateHaloIntegrationWSRequest,
  IInformacastType,
  Integration_UpdateInformacastIntegrationRequest,
  Integration_UpdateIntuifaceIntegrationWSRequest,
  Integration_UpdateKisiIntegrationWSRequest,
  ILumeoType,
  Integration_UpdateLumeoIntegrationWSRequest,
  Integration_UpdateMattermostIntegrationWSRequest,
  MicrosoftTeamsChannelSettings,
  MicrosoftTeamsUserSettings,
  IMicrosoftTeamsType,
  Integration_UpdateMicrosoftTeamsIntegrationV2WSRequest,
  Integration_UpdateOffice365IntegrationWSRequest,
  IOmnialertType,
  Integration_UpdateOmnialertIntegrationWSRequest,
  Integration_UpdateOmnialertIntegrationWSResponse,
  IOpenAIType,
  Integration_UpdateOpenAIIntegrationRequest,
  Integration_UpdateOpenpathIntegrationWSRequest,
  Integration_UpdateOpentechAllianceIntegrationWSRequest,
  Integration_UpdatePagerDutyIntegrationWSRequest,
  Integration_UpdatePdkIntegrationWSRequest,
  Integration_UpdatePlaceOsSettingsWSRequest,
  Integration_UpdateSaltoIntegrationWSRequest,
  OrgSamlSettingsType,
  Integration_UpdateSamlIntegrationWSRequest,
  Integration_UpdateServiceNowIntegrationWSRequest,
  Integration_UpdateSlackIntegrationWSRequest,
  Integration_UpdateSlackIntegrationV2WSRequest,
  Integration_UpdateSquareIntegrationWSRequest,
  Integration_UpdateToastIntegrationWSRequest,
  Integration_UpdateWebhookIntegrationWSRequest,
  Integration_UpdateWebhookIntegrationV2WSRequest,
  Integration_UpdateWebhookIntegrationV2WSResponse,
  Integration_ValidateKisiApiKeyWSRequest,
  Internal_AddPartnerAsSuperAdminWSRequest,
  Internal_AddPartnerAsSuperAdminWSResponse,
  Internal_CreateOrgWSRequest,
  Internal_CreateOrgWSResponse,
  Internal_CreatePartnerOrgWSRequest,
  Internal_CreatePartnerOrgWSResponse,
  SupportAuthorityType,
  Internal_CreateSupportAuthorityWSRequest,
  Internal_CreateSupportAuthorityWSResponse,
  Internal_GetSuperAdminGroupUUIDWSRequest,
  Internal_GetSuperAdminGroupUUIDWSResponse,
  Consignee,
  Freight,
  Product,
  Shipment,
  Shipper,
  OutgoingShipmentInfoType,
  Internal_InitiateShipmentWSRequest,
  Internal_InitiateShipmentWSResponse,
  Internal_ListOrgsWSRequest,
  FirmwareUpdateIntervalType,
  FirmwareUpdateSettingsType,
  UAPSettingsType,
  OrgV2Type,
  Internal_ListOrgsWSResponse,
  Invoice_InvoiceChargeWSRequest,
  Invoice_InvoiceChargeWSResponse,
  Invoice_InvoiceDetailsWSRequest,
  AddOnLicense,
  PerceptionType,
  AddOnLicenseInvoiceType,
  HardwareInvoiceSubItem,
  LicenseInvoiceSubItem,
  InvoiceType,
  Invoice_InvoiceDetailsWSResponse,
  Invoice_InvoiceV1LineItemType,
  Invoice_InvoiceV1Type,
  Invoice_InvoiceDetailsV1WSResponse,
  License_AssignDeviceLicenseWSRequest,
  License_AssignDeviceLicenseWSResponse,
  License_AssignLicenseWSRequest,
  License_AssignLicenseWSResponse,
  License_CreateACUDoorLicenseWSRequest,
  License_CreateACUDoorLicenseWSResponse,
  License_CreateAlertMonitoringLicenseWSRequest,
  License_CreateAlertMonitoringLicenseWSResponse,
  License_CreateDeviceLicenseWSRequest,
  License_CreateDeviceLicenseWSResponse,
  License_CreateLicenseWSRequest,
  License_CreateLicenseWSResponse,
  License_DeleteAlertMonitoringLicenseWSRequest,
  License_DeleteAlertMonitoringLicenseWSResponse,
  License_DeleteDeviceLicenseWSRequest,
  License_DeleteDeviceLicenseWSResponse,
  License_DeleteLicenseWSRequest,
  License_DeleteLicenseWSResponse,
  License_GetACUDoorLicensesWSRequest,
  ACUDoorLicenseType,
  License_GetACUDoorLicensesWSResponse,
  License_GetAlertMonitoringLicensesWSRequest,
  AlertMonitoringLicenseType,
  License_GetAlertMonitoringLicensesWSResponse,
  License_GetDeviceLicensesWSRequest,
  DeviceLicenseType,
  License_GetDeviceLicensesWSResponse,
  License_GetLicensesWSRequest,
  LicenseUsageType,
  License_GetLicensesWSResponse,
  License_UpdateAlertMonitoringLicenseWSRequest,
  License_UpdateAlertMonitoringLicenseWSResponse,
  Location_CreateLocationWSRequest,
  Location_CreateLocationWSResponse,
  Location_DeleteLocationWSRequest,
  Location_DeleteLocationWSResponse,
  Location_GeoCodeWSRequest,
  Location_GeoCodeWSResponse,
  Location_GetLocationsWSRequest,
  Location_GetLocationsWSResponse,
  Location_GetLocationsByGeoRequest,
  Location_GetLocationsByGeoResponse,
  Location_SelectiveUpdateLocationWSRequest,
  Location_SelectiveUpdateLocationWSResponse,
  Location_UpdateLocationWSRequest,
  Location_UpdateLocationWSResponse,
  Location_ValidateLocationWSRequest,
  Location_QualifiedAddressTypeWithValidation,
  Location_ValidateLocationWSResponse,
  Logistics_GetRMAsWSRequest,
  RMAType,
  Logistics_GetRMAsWSResponse,
  Logistics_GetShipmentsWSRequest,
  ShippedItemType,
  CustomerShipmentType,
  Logistics_GetShipmentsWSResponse,
  Maps_GenerateMapUrlWSRequest,
  Maps_GenerateMapUrlWSResponse,
  Metric_LogEventWSRequest,
  Metric_LogEventWSResponse,
  Metric_ReportErrorWSRequest,
  Metric_ReportErrorWSResponse,
  Mobile_LoginToOrgRequest,
  Mobile_LoginToOrgBaseResponse,
  Mobile_LoginVerifiedSupportAuthorityMobileRequest,
  Mobile_LoginVerifiedSupportAuthorityMobileResponse,
  Mobile_LogoutMobileUserRequest,
  Mobile_LogoutMobileUserResponse,
  Mobile_UpdateMobileNotificationTokenRequest,
  Mobile_UpdateMobileNotificationTokenResponse,
  Mobile_UpdateRhombusKeyMobileNotificationTokenRequest,
  Mobile_UpdateRhombusKeyMobileNotificationTokenResponse,
  Occupancysensor_GetMinimalOccupancySensorStatesWSRequest,
  Occupancysensor_MinimalOccupancySensorStateType,
  Occupancysensor_GetMinimalOccupancySensorStatesWSResponse,
  Occupancysensor_GetOccupancyEventsForSensorWSRequest,
  OccupancyEventType,
  Occupancysensor_GetOccupancyEventsForSensorWSResponse,
  Occupancysensor_UpdateOccupancySensorDetailsWSRequest,
  Occupancysensor_UpdateOccupancySensorDetailsWSResponse,
  Org_ClaimActivationTokenWSRequest,
  Org_ClaimActivationTokenWSResponse,
  Org_DeviceRegistrationClaimType,
  Org_ClaimShipmentRegistrationTokenWSRequest,
  Org_ClaimShipmentRegistrationTokenWSResponse,
  Org_CreatePendingRegistrationRequest,
  Org_CreatePendingRegistrationResponse,
  Org_DeleteCloudArchivingConfigWSRequest,
  Org_DeleteCloudArchivingConfigWSResponse,
  Org_FindAllHardwareWithPendingRegistrationRequest,
  HardwareType,
  Org_PendingRegistrationInfoType,
  Org_HardwareWithPendingRegistrationInfoType,
  Org_FindAllHardwareWithPendingRegistrationResponse,
  Org_FindHardwareAvailableForPendingRegistrationRequest,
  Org_FindHardwareAvailableForPendingRegistrationResponse,
  Org_FindIfTeamNameAvailableRequest,
  Org_FindIfTeamNameAvailableResponse,
  Org_FindSCIMSettingsForOrgWSRequest,
  SCIMSettingsType,
  Org_FindSCIMSettingsForOrgWSResponse,
  Org_GenerateFederatedSessionTokenRequest,
  Org_GenerateFederatedSessionTokenResponse,
  Org_GetAwsIntCloudformationFileRequest,
  Org_GetAwsIntCloudformationFileResponse,
  Org_GetCloudArchivingConfigsWSRequest,
  Org_GetCloudArchivingConfigsWSResponse,
  Org_GetDeviceFlagsWSRequest,
  Org_GetDeviceFlagsWSResponse,
  Org_GetFeaturesWSRequest,
  Org_GetFeaturesWSResponse,
  Org_GetLocationFlagsWSRequest,
  Org_GetLocationFlagsWSResponse,
  Org_GetOrgNotificationTemplateWSRequest,
  Org_GetOrgNotificationTemplateWSResponse,
  Org_GetOrgV2WSRequest,
  Deviceconfig_VideoConfigurationDefault,
  Deviceconfig_IntRange,
  Deviceconfig_VideoConfigurationOption,
  Org_GetOrgV2WSResponse,
  Org_GetSAMLSettingsV2WSRequest,
  Org_GetSAMLSettingsV2WSResponse,
  Org_GetScimDisplayInfoResponse,
  Org_GetTemporaryOrgTokenWSRequest,
  GetTemporaryOrgTokenResponse,
  Org_PeekShipmentRegistrationTokenWSRequest,
  Org_PeekShipmentRegistrationTokenWSResponse,
  Org_RemovePendingRegistrationRequest,
  Org_RemovePendingRegistrationResponse,
  Org_RevokeSCIMAccessForOrgWSRequest,
  Org_RevokeSCIMAccessForOrgWSResponse,
  Org_SetFlagWSRequest,
  Org_SetFlagWSResponse,
  Org_SetupSCIMAccessForOrgWSRequest,
  Org_SetupSCIMAccessForOrgWSResponse,
  Org_UpdateAiTrainingSettingsWSRequest,
  Org_UpdateAiTrainingSettingsWSResponse,
  Org_UpdateCloudArchivingConfigWSRequest,
  Org_UpdateCloudArchivingConfigWSResponse,
  Org_UpdateFirmwareSettingsWSRequest,
  Org_UpdateFirmwareSettingsWSResponse,
  Org_UpdateGeneralSettingsWSRequest,
  Org_UpdateGeneralSettingsWSResponse,
  Org_UpdateMFASettingsWSRequest,
  Org_UpdateMFASettingsWSResponse,
  Org_UpdateOrgAudioRecordingPolicyWSRequest,
  Org_UpdateOrgAudioRecordingPolicyWSResponse,
  Org_UpdateOrgNotificationTemplateWSRequest,
  Org_UpdateOrgNotificationTemplateWSResponse,
  Org_UpdatePendingRegistrationRequest,
  Org_UpdatePendingRegistrationResponse,
  Org_UpdateSAMLSettingsV2WSRequest,
  Org_UpdateSAMLSettingsV2WSResponse,
  Org_UpdateSCIMSettingsForOrgWSRequest,
  Org_UpdateSCIMSettingsForOrgWSResponse,
  Partner_CreatePartnerClientWSRequest,
  Partner_CreatePartnerClientWSResponse,
  Partner_ClientCustomizationsType,
  Partner_CustomizeClientWSRequest,
  Partner_CustomizeClientWSResponse,
  Partner_ClientDeviceCustomizationsType,
  Partner_CustomizeClientDeviceWSRequest,
  Partner_CustomizeClientDeviceWSResponse,
  Partner_DeleteClientWebRequest,
  Partner_DeleteClientWebResponse,
  Integration_GetPartnerApiTokensWSRequest,
  Partner_GetClientDevicesWSRequest,
  DeviceTypeV2,
  Partner_DeviceWithPartnerDetailsType,
  Partner_GetClientDevicesWSResponse,
  Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSRequest,
  Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSBaseResponse,
  Partner_GetPartnerClientsStatusMapWSRequest,
  Partner_ConnectionCountType,
  Partner_GetPartnerClientsStatusMapWSResponse,
  Partner_GetClientSummaryInfoWSRequest,
  Partner_GetClientSummaryInfoWSResponse,
  Partner_GetPartnerClientsWSRequest,
  Partner_PartnerClientWebType,
  Partner_GetPartnerClientsWSResponse,
  Partner_GetDeviceLicensesForOrgWSRequest,
  Partner_GetDeviceLicensesForOrgWSResponse,
  Partner_GetLicensesForOrgWSRequest,
  Partner_GetLicensesForOrgWSResponse,
  Partner_GetListOfAllClientDevicesRequest,
  Partner_GetListOfAllClientDevicesResponse,
  Partner_GetListOfControlledHardwareRequest,
  Partner_UnregisteredControlledHardwareType,
  Partner_GetListOfControlledHardwareResponse,
  Partner_GetPartnerClientMobileAccountAccessRequest,
  Partner_GetPartnerClientMobileAccountAccessResponse,
  Partner_GetShipmentsWSRequest,
  Partner_GetShipmentsWSResponse,
  Partner_GrantSupportAccessToClientWSRequest,
  Partner_GrantSupportAccessToClientWSResponse,
  Partner_ReassignDeviceOrgWSRequest,
  OperationStatus,
  Partner_ReassignDeviceOrgWSResponse,
  Partner_RegisterDealWSRequest,
  Partner_RegisterDealWSResponse,
  Partner_RequestAccessToClientAccountV2Request,
  Partner_RequestAccessToClientAccountV2Response,
  Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSRequest,
  Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSBaseResponse,
  Password_ForgotPasswordWSRequest,
  Password_ForgotPasswordWSResponse,
  Password_ResetPasswordWSRequest,
  Password_ResetPasswordWSResponse,
  Password_UserSignupWSRequest,
  Password_UserSignupWSResponse,
  Functionality,
  PartnerPermission,
  PartnerFunctionality,
  PartnerUserPermissionGroupType,
  Permission_CreatePartnerPermissionGroupWSRequest,
  Permission_CreatePartnerPermissionGroupWSResponse,
  Permission,
  UserPermissionGroupType,
  Permission_CreatePermissionGroupWSRequest,
  Permission_CreatePermissionGroupWSResponse,
  Permission_DeletePartnerPermissionGroupWSRequest,
  Permission_DeletePartnerPermissionGroupWSResponse,
  Permission_DeletePermissionGroupWSRequest,
  Permission_DeletePermissionGroupWSResponse,
  Permission_GetPartnerPermissionGroupsWSRequest,
  Permission_GetPartnerPermissionGroupWSResponse,
  Permission_GetPermissionGroupsWSRequest,
  Permission_GetPermissionGroupsWSResponse,
  Permission_GetPermissionGroupsForOrgWSRequest,
  Permission_GetPermissionGroupsForOrgWSResponse,
  Permission_GetPermissionsForCurrentPartnerWSRequest,
  Permission_GetPermissionsForCurrentPartnerWSResponse,
  Permission_GetPermissionsForCurrentUserWSRequest,
  Permission_GetPermissionsForCurrentUserWSResponse,
  Permission_UpdatePartnerPermissionGroupWSRequest,
  Permission_UpdatePartnerPermissionGroupWSResponse,
  Permission_UpdatePermissionGroupWSRequest,
  Permission_UpdatePermissionGroupWSResponse,
  Policy_MinimalAccessControlledDoorScheduledTriggerType,
  Policy_MinimalAccessControlledDoorPolicyType,
  Policy_CreateAccessControlledDoorPolicyWSRequest,
  Policy_CreateAccessControlledDoorPolicyWSResponse,
  Policy_ExternalAudioTriggerType,
  Policy_MinimalAudioScheduledTriggerType,
  Policy_MinimalAudioPolicyType,
  Policy_CreateAudioPolicyWSRequest,
  Policy_CreateAudioPolicyWSResponse,
  CameraTriggerType,
  Policy_MinimalCameraScheduledTriggerType,
  Policy_MinimalCameraPolicyV2Type,
  Policy_CreateCameraPolicyWSRequest,
  Policy_CreateCameraPolicyWSResponse,
  ClimateTriggerType,
  Policy_MinimalClimateScheduledTriggerType,
  Policy_MinimalClimatePolicyType,
  Policy_CreateClimatePolicyWSRequest,
  Policy_CreateClimatePolicyWSResponse,
  Policy_MinimalDoorScheduledTriggerType,
  Policy_MinimalDoorPolicyType,
  Policy_CreateDoorPolicyWSRequest,
  Policy_CreateDoorPolicyWSResponse,
  Policy_MinimalOccupancyScheduledTriggerType,
  Policy_MinimalOccupancyPolicyType,
  Policy_CreateOccupancyPolicyWSRequest,
  Policy_CreateOccupancyPolicyWSResponse,
  Policy_CreatePolicyAddendumForLocationRequest,
  Policy_CreatePolicyAddendumForLocationResponse,
  Policy_CreatePolicyAddendumsForDevicesRequest,
  Policy_CreatePolicyAddendumsForDevicesResponse,
  ProximityTriggerType,
  Policy_MinimalProximityScheduledTriggerType,
  Policy_MinimalProximityPolicyType,
  Policy_CreateProximityPolicyWSRequest,
  Policy_CreateProximityPolicyWSResponse,
  BaseSavedScheduleType,
  WeeklyRepeatingScheduleType,
  Policy_CreateScheduleWSRequest,
  Policy_CreateScheduleWSResponse,
  Policy_DeleteAccessControlledDoorPolicyWSRequest,
  Policy_DeleteAccessControlledDoorPolicyWSResponse,
  Policy_DeleteAudioPolicyWSRequest,
  Policy_DeleteAudioPolicyWSResponse,
  Policy_DeleteCameraPolicyWSRequest,
  Policy_DeleteCameraPolicyWSResponse,
  Policy_DeleteClimatePolicyWSRequest,
  Policy_DeleteClimatePolicyWSResponse,
  Policy_DeleteDevicePolicyAddendumsWSRequest,
  Policy_DeleteDevicePolicyAddendumsWSResponse,
  Policy_DeleteDoorPolicyWSRequest,
  Policy_DeleteDoorPolicyWSResponse,
  Policy_DeleteLocationPolicyAddendumWSRequest,
  Policy_DeleteLocationPolicyAddendumWSResponse,
  Policy_DeleteOccupancyPolicyWSRequest,
  Policy_DeleteOccupancyPolicyWSResponse,
  Policy_DeletePolicyPauseSettingWSRequest,
  Policy_DeletePolicyPauseSettingWSResponse,
  Policy_DeleteProximityPolicyWSRequest,
  Policy_DeleteProximityPolicyWSResponse,
  Policy_DeleteScheduleWSRequest,
  Policy_DeleteScheduleWSResponse,
  Policy_FindSchedulesWSRequest,
  Policy_FindSchedulesWSResponse,
  Policy_GetAccessControlledDoorPoliciesWSRequest,
  AccessControlledDoorScheduledTriggerType,
  AccessControlledDoorPolicyType,
  Policy_GetAccessControlledDoorPoliciesWSResponse,
  Policy_GetAudioPoliciesWSRequest,
  Policy_ExternalAudioScheduledTriggerType,
  Policy_ExternalAudioPolicyType,
  Policy_GetAudioPoliciesWSResponse,
  Policy_GetCameraPoliciesWSRequest,
  CameraScheduledTriggerType,
  CameraPolicyV2Type,
  Policy_GetCameraPoliciesWSResponse,
  Policy_GetClimatePoliciesWSRequest,
  ClimateScheduledTriggerType,
  ClimatePolicyType,
  Policy_GetClimatePoliciesWSResponse,
  Policy_GetDoorPoliciesWSRequest,
  DoorScheduledTriggerType,
  DoorPolicyType,
  Policy_GetDoorPoliciesWSResponse,
  Policy_GetOccupancyPoliciesWSRequest,
  OccupancyScheduledTriggerType,
  OccupancyPolicyType,
  Policy_GetOccupancyPoliciesWSResponse,
  Policy_GetPoliciesUsingScheduleWSRequest,
  AudioTriggerType,
  AudioScheduledTriggerType,
  AudioPolicyType,
  ProximityScheduledTriggerType,
  ProximityPolicyType,
  Policy_GetPoliciesUsingScheduleWSResponse,
  Policy_GetPolicyAddendumsWSRequest,
  Policy_GetPolicyAddendumsWSResponse,
  Policy_GetPolicyPauseSettingsWSRequest,
  Policy_GetPolicyPauseSettingsWSResponse,
  Policy_GetProximityPoliciesWSRequest,
  Policy_GetProximityPoliciesWSResponse,
  Policy_PauseAlertPolicyWSRequest,
  Policy_PauseAlertPolicyWSResponse,
  Policy_UpdateAccessControlledDoorPolicyWSRequest,
  Policy_UpdateAccessControlledDoorPolicyWSResponse,
  Policy_UpdateAudioPolicyWSRequest,
  Policy_UpdateAudioPolicyWSResponse,
  Policy_UpdateCameraPolicyWSRequest,
  Policy_UpdateCameraPolicyWSResponse,
  Policy_UpdateClimatePolicyWSRequest,
  Policy_UpdateClimatePolicyWSResponse,
  Policy_UpdateDoorPolicyWSRequest,
  Policy_UpdateDoorPolicyWSResponse,
  Policy_UpdateOccupancyPolicyWSRequest,
  Policy_UpdateOccupancyPolicyWSResponse,
  Policy_UpdateProximityPolicyWSRequest,
  Policy_UpdateProximityPolicyWSResponse,
  Policy_UpdateScheduleWSRequest,
  Policy_UpdateScheduleWSResponse,
  Proximity_GetLocomotionEventsForTagWSRequest,
  GpsError,
  GeodeticCoordinates,
  ProximityTagLocomotionEventType,
  Proximity_GetLocomotionEventsForTagWSResponse,
  Proximity_GetMinimalProximityStatesWSRequest,
  Proximity_MinimalProximityStateType,
  Proximity_GetMinimalProximityStatesWSResponse,
  Proximity_GetProximityEventsForTagWSRequest,
  ProximityEventType,
  Proximity_GetProximityEventsForTagWSResponse,
  Proximity_UpdateProximitySensorDetailsWSRequest,
  Proximity_UpdateProximitySensorDetailsWSResponse,
  Report_GetAuditFeedWSRequest,
  Report_AuditEventWeb,
  Report_GetAuditFeedWSResponse,
  Report_GetAverageReportWSRequest,
  Report_GetAverageReportWSResponse,
  Report_GetAverageReportsWSRequest,
  Report_GetAverageReportsWSResponse,
  Report_GetCountReportV2WSRequest,
  TimeSeriesDataPointV2Type,
  Report_GetCountReportWSResponse,
  Report_GetCountReportsWSRequest,
  Report_GetCountReportsWSResponse,
  Report_GetDiagnosticFeedWSRequest,
  DiagnosticEventType,
  Report_GetDiagnosticFeedWSResponse,
  Integration_GetEnvoyDeliveriesWSRequest,
  EnvoyDeliveryInfo,
  EnvoyDelivery,
  Integration_GetEnvoyDeliveriesWSResponse,
  Integration_GetEnvoyEmployeesWSRequest,
  Integration_GetEnvoyEmployeesWSResponse,
  Integration_GetEnvoyLocationsWSRequest,
  EnvoyLocation,
  Integration_GetEnvoyLocationsWSResponse,
  Integration_GetEnvoyVisitorsWSRequest,
  EnvoyExpectedGuest,
  EnvoyGuest,
  Integration_GetEnvoyVisitorsWSResponse,
  Report_GetFacesByDeviceWSRequest,
  Report_GetFacesByDeviceWSResponse,
  Report_GetFacesByLocationWSRequest,
  Report_GetFacesByLocationWSResponse,
  Report_GetLicensePlatesByDeviceWSRequest,
  VehicleEventIndexType,
  Report_GetLicensePlatesByDeviceWSResponse,
  Report_GetMostRecentPeopleCountWSRequest,
  BoundingBoxType,
  PeopleCountEventType,
  Report_GetMostRecentPeopleCountWSResponse,
  Report_GetProximityTagLocationsByDateWSRequest,
  ProximityTagTimeSeriesDataPointType,
  Report_GetProximityTagLocationsByDateWSResponse,
  Report_GetRunningAverageWSRequest,
  Stats,
  WeeklyStatisticsDataPoint,
  Report_GetRunningAverageWSResponse,
  Report_GetSummaryCountReportWSRequest,
  EventCount,
  SummaryCountTimeSeriesDataPointType,
  Report_GetSummaryCountReportWSResponse,
  Report_GetThresholdCrossingCountsWSRequest,
  Report_GetThresholdCrossingCountsWSResponse_ThresholdCrossingCountType,
  Report_GetThresholdCrossingCountsWSResponse,
  Report_GetThresholdCrossingEventsWSRequest,
  MinimalThresholdEventType,
  Report_GetThresholdCrossingEventsWSResponse,
  Integration_GetToastEventsTableWSRequest,
  Integration_GetToastEventsTableWSResponse_EventTableRow,
  Integration_GetToastEventsTableWSResponse,
  Report_ResetRunningAverageWSRequest,
  Report_ResetRunningAverageWSResponse,
  RuleTriggerConjunctionEnum,
  RuleTypeEnum,
  RuleTriggerTypeEnum,
  BaseRuleTriggerType,
  RuleType,
  Rules_CreateRuleWSRequest,
  Rules_CreateRuleWSResponse,
  Rules_DeleteRuleWSRequest,
  Rules_DeleteRuleWSResponse,
  Rules_DeleteRulePauseSettingWSRequest,
  Rules_DeleteRulePauseSettingWSResponse,
  Rules_GetRulePauseSettingsWSRequest,
  Rules_GetRulePauseSettingsResponse,
  Rules_records_GetRulesFilteredWSRequest,
  Rules_GetRulesForOrgWSResponse,
  Rules_GetRulesForOrgWSRequest,
  Rules_PauseRuleWSRequest,
  Rules_PauseRuleWSResponse,
  Rules_UpdateRuleWSRequest,
  Rules_UpdateRuleWSResponse,
  Rules_records_DeleteRulesEventRecordWSRequest,
  Rules_records_DeleteRulesEventRecordWSResponse,
  Rules_records_GetLatestRulesEventRecordsWSRequest,
  ActivateLocationLockdownActionRecordType,
  AlertActionStatusEnum,
  AlertActionRecordType,
  AlertMonitoringRulesEventTypeEnum,
  AlertMonitoringEventRecordType,
  AudioGatewayStatusEnum,
  AudioPlaybackActionRecordType,
  DeviceEventRecordType,
  IntegrationActionStatusEnum,
  LiveNotificationActionStatusEnum,
  LiveNotificationActionRecordType,
  ScheduledEventRecordType,
  UnlockDoorActionRecordType,
  RulesEventRecordType,
  Rules_records_GetLatestRulesEventRecordsWSResponse,
  Rules_records_GetRulesEventRecordsWSRequest,
  Rules_records_GetRulesEventRecordsWSResponse,
  AbsoluteSecondsIntervalType,
  AbsoluteSecondsScheduleType,
  Schedule_CreateAbsoluteScheduleWSRequest,
  Schedule_CreateAbsoluteScheduleWSResponse,
  LocalDateTimeIntervalType,
  RelativeDateTimeIntervalsScheduleType,
  Schedule_CreateRelativeDateTimeIntervalsScheduleWSRequest,
  Schedule_CreateRelativeDateTimeIntervalsScheduleWSResponse,
  RealtimeRelativeSecondsScheduleType,
  Schedule_CreateRelativeScheduleWSRequest,
  Schedule_CreateRelativeScheduleWSResponse,
  Schedule_CreateWeeklyScheduleWSRequest,
  Schedule_CreateWeeklyScheduleWSResponse,
  Schedule_FindAbsoluteScheduleWSRequest,
  Schedule_FindAbsoluteScheduleWSResponse,
  Schedule_FindRelativeDateTimeIntervalsScheduleWSRequest,
  Schedule_FindRelativeDateTimeIntervalsScheduleWSResponse,
  Schedule_FindRelativeScheduleWSRequest,
  Schedule_FindRelativeScheduleWSResponse,
  Schedule_FindWeeklyScheduleWSRequest,
  Schedule_FindWeeklyScheduleWSResponse,
  Schedule_GetSchedulesWSRequest,
  Schedule_GetSchedulesWSResponse,
  Search_SearchObjectsByColorWSRequest,
  Search_SearchObjectsByColorWSResponse,
  Sensor_GetFootageSensorSeekpointsForCameraWSRequest,
  Sensor_FootageSensorSeekPointDisplayType,
  Sensor_GetFootageSensorSeekpointsForCameraWSResponse,
  Sensor_GetFootageSensorSeekpointsForLocationWSRequest,
  Sensor_GetFootageSensorSeekpointsForLocationWSResponse,
  Sensor_GetFootageSensorSeekpointsForSensorWSRequest,
  Sensor_GetFootageSensorSeekpointsForSensorWSResponse,
  Camera_SharedCameraCurrentStateType,
  Camera_GetSharedCameraCurrentStateWSResponse,
  Share_GetSharedFootageBoundingBoxesWSRequest,
  Share_GetSharedFootageBoundingBoxesWSResponse,
  Share_GetSharedFootageSeekpointsV2WSRequest,
  Share_GetSharedFootageSeekpointsV2WSResponse,
  Share_GetSharedMediaUrisWSRequest,
  Share_GetSharedMediaUrisWSResponse,
  Share_GetSharedPresenceWindowsWSRequest,
  Share_GetSharedPresenceWindowsWSResponse,
  Share_GetSharedVideoWallMediaUrisWSRequest,
  Share_GetSharedVideoWallMediaUrisWSResponse,
  Share_GetSharedClipDataWSRequest,
  Share_SharedClipPublicType,
  Share_GetSharedClipDataWSResponse,
  Share_SharedFaceType,
  Share_GetSharedFacesWSResponse,
  Share_GetSharedLiveStreamInfoWSResponse,
  Share_SharedVideoWallDeviceType,
  Share_GetSharedVideoWallInfoWSResponse,
  Share_GetSharedFootageSensorSeekpointsForCameraWSRequest,
  Share_GetSharedFootageSensorSeekpointsForCameraWSResponse,
  Share_ShareLinkWSRequest,
  Share_ShareLinkWSResponse,
  Share_GetSharedTimelapseDataWSRequest,
  Share_GetSharedTimelapseDataV2WSResponse,
  Support_AddSupportAuthorityWSRequest,
  Support_AddSupportAuthorityWSResponse,
  Support_AlllowSupportAuthorityAccessWSRequest,
  Support_AlllowSupportAuthorityAccessWSResponse,
  Support_FindSupportAuthoritySessionsWSRequest,
  Support_FindSupportAuthoritySessionsWSResponse,
  Support_GetSupportAuthoritiesWSRequest,
  Support_SupportAuthorityWSType,
  Support_GetSupportAuthoritiesWSResponse,
  Support_LogoutAllSupportAuthoritySessionsWSRequest,
  Support_LogoutAllSupportAuthoritySessionsWSResponse,
  Support_LookupSupportPartnerAuthoritiesWSRequest,
  Support_SupportPartnerAuthorityWSType,
  Support_LookupSupportPartnerAuthoritiesWSResponse,
  Support_RemoveSupportAuthorityWSRequest,
  Support_RemoveSupportAuthorityWSResponse,
  Support_RevokeSupportAuthorityAccessWSRequest,
  Support_RevokeSupportAuthorityAccessWSResponse,
  Support_SupportAuthoritySelectiveUpdateWSType,
  Support_UpdateSupportAuthorityWSRequest,
  Support_UpdateSupportAuthorityWSResponse,
  Tvos_GetTvOsConfigWsRequest,
  TvOsConfigType,
  Tvos_GetTvOsConfigWsResponse,
  Tvos_GetTvOsConfigsForOrgWsRequest,
  Tvos_GetTvOsConfigsForOrgWsResponse,
  Tvos_UpdateTvOsConfigWsRequest,
  Tvos_UpdateTvOsConfigWsResponse,
  User_ChangeUserPasswordWSRequest,
  User_ChangeUserPasswordWSResponse,
  User_CreateUserWSRequest,
  User_CreateUserWSResponse,
  User_DeleteUserWSRequest,
  User_DeleteUserWSResponse,
  User_DeleteVirtualMfaDeviceForCurrentUserWSRequest,
  User_DeleteVirtualMfaDeviceForCurrentUserWSResponse,
  User_GetImportUsersFormatWSResponse,
  Partner_GetPartnerUsersInOrgWSRequest,
  PartnerPermissionType,
  Partner_GetPartnerUsersInOrgWSResponse,
  User_GetRhombusKeyConfigForUserWSRequest,
  User_GetRhombusKeyConfigForUserWSResponse,
  User_GetUserCustomizationFlagsWSRequest,
  User_GetUserCustomizationFlagsWSResponse,
  User_GetUsersInOrgWSRequest,
  User_UserSnoozeNotificationSettingsType,
  UserPermissionType,
  User_GetUsersInOrgWSResponse,
  User_GetVirtualMfaDeviceForCurrentUserWSRequest,
  UserVirtualMfaDeviceType,
  User_GetVirtualMfaDeviceForCurrentUserWSResponse,
  User_ImportUsersWSResponse,
  User_SendMobileDownloadSMSWSRequest,
  User_SendMobileDownloadSMSWSResponse,
  User_SendPartnerAccessGrantedEmailWSRequest,
  User_SendPartnerAccessGrantedEmailWSResponse,
  User_SendRhombusKeyUserWelcomeEmailWSRequest,
  User_SendRhombusKeyUserWelcomeEmailWSResponse,
  User_SendUserWelcomeEmailWSRequest,
  User_SendUserWelcomeEmailWSResponse,
  User_SetupVirtualMfaDeviceForCurrentUserWSRequest,
  User_SetupVirtualMfaDeviceForCurrentUserWSResponse,
  User_UpdatePartnerWSRequest,
  User_UpdatePartnerWSResponse,
  User_UpdateRhombusKeySettingsForUserWSRequest,
  User_UpdateRhombusKeySettingsForUserWSResponse,
  User_UpdateUserWSRequest,
  User_UpdateUserWSResponse,
  User_UpdateUserCustomizationFlagsWSRequest,
  User_UpdateUserCustomizationFlagsWSResponse,
  Vehicle_AddVehicleLabelWSRequest,
  Vehicle_AddVehicleLabelWSResponse,
  Vehicle_AssociateEventsToVehicleWSRequest,
  Vehicle_AssociateEventsToVehicleWSResponse,
  Vehicle_DeleteVehicleWSRequest,
  Vehicle_DeleteVehicleWSResponse,
  Vehicle_GetVehicleEventsWSResponse,
  Vehicle_GetVehicleLabelsForOrgWSRequest,
  Vehicle_GetVehicleLabelsForOrgWSResponse,
  Vehicle_GetVehiclesWSRequest,
  VehicleV2Type,
  Vehicle_GetVehiclesWSResponse,
  Vehicle_RemoveVehicleLabelWSRequest,
  Vehicle_RemoveVehicleLabelWSResponse,
  Vehicle_ReportVehicleEventRequest,
  Vehicle_ReportVehicleEventResponse,
  Vehicle_SaveVehicleWSRequest,
  Vehicle_SaveVehicleWSResponse,
  Video_CancelSpliceV2WSRequest,
  Video_CancelSpliceV2WSResponse,
  Video_CreateSharedTimelapseGroupWSRequest,
  Video_CreateSharedTimelapseGroupWSResponse,
  Video_DeleteSharedTimelapseGroupWSRequest,
  Video_DeleteSharedTimelapseGroupWSResponse,
  Video_DeleteTimelapseClipsWSRequest,
  Video_DeleteTimelapseClipsWSResponse,
  Video_GenerateTimelapseClipWSRequest,
  Video_GenerateTimelapseClipWSResponse,
  Video_GetExactFrameUriWSRequest,
  Video_GetExactFrameUriWSResponse,
  Video_GetMaxSpliceDurationWSRequest,
  Video_GetMaxSpliceDurationWSResponse,
  Video_GetSharedTimelapseGroupsWSRequest,
  TimelapseSource,
  SharedTimelapseClipType,
  SharedTimelapseGroupWrapperType,
  Video_GetSharedTimelapseGroupsWSResponse,
  Video_GetSplicedClipsInProgressWSRequest,
  SplicedClipProgress,
  SplicedClipType,
  Video_GetSplicedClipsInProgressWSResponse,
  Video_GetTimelapseClipsWSRequest,
  TimelapseStatus,
  TimelapseClipType,
  Video_GetTimelapseClipsWSResponse,
  Video_GetTimelapseMetadataWSRequest,
  Video_GetTimelapseMetadataWSResponse,
  Video_RetrySpliceWSRequest,
  Video_RetrySpliceWSResponse,
  Video_SpliceFrameWSRequest,
  Video_SpliceFrameWSResponse,
  Video_SpliceV3WSRequest,
  Video_SpliceV3WSResponse,
  Video_UpdateSharedTimelapseGroupWSRequest,
  Video_UpdateSharedTimelapseGroupWSResponse,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/api/accesscontrol/addUsersToAccessControlGroup",
    alias: "addUsersToAccessControlGroup",
    description: `Adds specified users to an access control group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_group_AddUsersToAccessControlGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/assignAccessControlCredential",
    alias: "assignAccessControlCredential",
    description: `Assign a currently unassigned credential to a user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_AssignAccessControlCredentialWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/createAccessControlGroup",
    alias: "createAccessControlGroup",
    description: `Creates an access control group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_CreateAccessControlGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/createAccessGrant",
    alias: "createAccessGrant",
    description: `Create a location access grant`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_accessgrant_CreateAccessGrantWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/createAccessRevocation",
    alias: "createAccessRevocation",
    description: `Create a location access revocation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_accessrevocation_CreateAccessRevocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/createAppleWalletPass",
    alias: "createAppleWalletPass",
    description: `Get credentials to generate Apple Wallet pass for user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ credUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/createRhombusSecureCsnCredential",
    alias: "createRhombusSecureCsnCredential",
    description: `Create a rhombus secure csn credential (Rhombus Badge)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_CreateRhombusSecureCsnCredentialWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/createStandardCsnCredential",
    alias: "createStandardCsnCredential",
    description: `Create a standard csn credential (Third Party Badge)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_CreateStandardCsnCredentialWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/createWiegandCredential",
    alias: "createWiegandCredential",
    description: `Create a wiegand credential`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_CreateWiegandCredentialWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/deleteAccessControlCredential",
    alias: "deleteAccessControlCredential",
    description: `Delete an access control credential. It is recommended to revoke a credential rather than delete it to preserve credential history`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ credentialUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/deleteAccessControlGroup",
    alias: "deleteAccessControlGroup",
    description: `Delete an access control group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ groupUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/deleteLocationAccessGrant",
    alias: "deleteLocationAccessGrant",
    description: `Deletes a location access grant`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ accessGrantUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/deleteLocationAccessRevocation",
    alias: "deleteLocationAccessRevocation",
    description: `Deletes a location access revocation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ accessRevocationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/deleteUnassignedAccessControlCredential",
    alias: "deleteUnassignedAccessControlCredential",
    description: `Delete an unassigned access control credential. The credential must be unassigned (revoked) before this method can be called. History of the credential is maintained but it will no longer be returned as an unassigned credential.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ credentialHexValue: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/doorScheduleException/createException",
    alias: "createException",
    description: `Create door schedule exception`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_doorexception_CreateDoorScheduleExceptionWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/doorScheduleException/deleteException",
    alias: "deleteException",
    description: `Delete door schedule exception`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ exceptionUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/doorScheduleException/findExceptions",
    alias: "findExceptions",
    description: `Find door schedule exceptions`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_doorexception_FindDoorScheduleExceptionsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/doorScheduleException/findExceptionsForDoor",
    alias: "findExceptionsForDoor",
    description: `Find door schedule exceptions for a specific door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/doorScheduleException/findExceptionsForLocation",
    alias: "findExceptionsForLocation",
    description: `Find door schedule exceptions for a specific location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/doorScheduleException/getException",
    alias: "getException",
    description: `Get door schedule exception`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ exceptionUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/doorScheduleException/updateException",
    alias: "updateException",
    description: `Update door schedule exception`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAccessControlCredentialByOrg",
    alias: "findAccessControlCredentialByOrg",
    description: `Find all access control credentials in the org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_FindAccessControlCredentialByOrgWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAccessControlCredentialByUser",
    alias: "findAccessControlCredentialByUser",
    description: `Find all access control credentials for the specified user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_FindAccessControlCredentialByUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAccessControlCredentialByUsers",
    alias: "findAccessControlCredentialByUsers",
    description: `Find all access control credentials for the specified users`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_FindAccessControlCredentialByUsersWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAccessControlGroupByExactName",
    alias: "findAccessControlGroupByExactName",
    description: `Retrieve the access control group with the specified name`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ groupName: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAccessControlGroupMembershipsByUser",
    alias: "findAccessControlGroupMembershipsByUser",
    description: `Find all access control group memberships by user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ userUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAccessControlGroupMembershipsForCurrentUser",
    alias: "findAccessControlGroupMembershipsForCurrentUser",
    description: `Find all access control group memberships for the current Rhombus Key user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAccessControlGroupsByNamePrefix",
    alias: "findAccessControlGroupsByNamePrefix",
    description: `Retrieve all access control groups with a name starting with the specified prefix`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ groupNamePrefix: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAccessControlGroupsByOrg",
    alias: "findAccessControlGroupsByOrg",
    description: `Retrieve all access control groups defined in the org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAccessControlGroupsByUserMembership",
    alias: "findAccessControlGroupsByUserMembership",
    description: `Find all access control groups a user belongs to`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ userUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findAllUsersForAccessControlGroup",
    alias: "findAllUsersForAccessControlGroup",
    description: `Find all users belonging to an access control group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ groupUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findCredentialHistoryByCredentialHexValue",
    alias: "findCredentialHistoryByCredentialHexValue",
    description: `Retrieves all credentials that have owned the credential hex value. Expect at most 1 valid/active credential and the rest are revoked`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_FindCredentialHistoryByCredentialHexValueWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findCredentialHistoryByCredentialValue",
    alias: "findCredentialHistoryByCredentialValue",
    description: `Retrieves all credentials that have owned the credential value.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_FindCredentialHistoryByCredentialValueWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findCredentialHistoryByUser",
    alias: "findCredentialHistoryByUser",
    description: `Retrieves all credentials both current and revoked that were at some point assigned to the specified user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_FindCredentialHistoryByUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessGrantsByAccessControlledDoor",
    alias: "findLocationAccessGrantsByAccessControlledDoor",
    description: `Finds location access grants by the specified access controlled door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ accessControlledDoorUuid: z.string().nullable() })
          .partial()
          .passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessGrantsByDoorLabel",
    alias: "findLocationAccessGrantsByDoorLabel",
    description: `Finds location access grants by the specified door label`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ doorLabelId: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessGrantsByGroup",
    alias: "findLocationAccessGrantsByGroup",
    description: `Finds location access grants by the specified group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ groupUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessGrantsByLocation",
    alias: "findLocationAccessGrantsByLocation",
    description: `Finds location access grants by the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessGrantsByLocationAndUser",
    alias: "findLocationAccessGrantsByLocationAndUser",
    description: `Finds location access grants by the specified location and user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationAndUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessGrantsByOrg",
    alias: "findLocationAccessGrantsByOrg",
    description: `Finds all location access grants in the org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessGrantsByUser",
    alias: "findLocationAccessGrantsByUser",
    description: `Finds location access grants by the specified user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ userUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessRevocationsByAccessControlledDoor",
    alias: "findLocationAccessRevocationsByAccessControlledDoor",
    description: `Finds location access revocations by the specified access controlled door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ accessControlledDoorUuid: z.string().nullable() })
          .partial()
          .passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessRevocationsByDoorLabel",
    alias: "findLocationAccessRevocationsByDoorLabel",
    description: `Finds location access revocation by the specified door label`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ doorLabelId: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessRevocationsByGroup",
    alias: "findLocationAccessRevocationsByGroup",
    description: `Finds location access revocations by the specified group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ groupUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessRevocationsByOrg",
    alias: "findLocationAccessRevocationsByOrg",
    description: `Finds all location access revocations in the org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findLocationAccessRevocationsByUser",
    alias: "findLocationAccessRevocationsByUser",
    description: `Finds location access revocations by the specified user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ userUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/findRhombusSecureMobileCredentialsForCurrentUser",
    alias: "findRhombusSecureMobileCredentialsForCurrentUser",
    description: `Find all rhombus secure mobile credentials for the current user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/forceRefreshAccessControlUnitConfig",
    alias: "forceRefreshAccessControlUnitConfig",
    description: `Send a command to the access control unit so it refreshes its complete configuration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ accessControlUnitUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/getLocationAccessGrant",
    alias: "getLocationAccessGrant",
    description: `Retrieve a location access grant by id`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ accessGrantUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/getLocationAccessRevocation",
    alias: "getLocationAccessRevocation",
    description: `Retrieve a location access revocation by id`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ accessRevocationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/getLocationsByAccessGrantForCurrentUser",
    alias: "getLocationsByAccessGrantForCurrentUser",
    description: `Get locations for which the current user is associated with 1 or more access grants`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/getMinimalAccessControlledDoorsByLocationForCurrentUser",
    alias: "getMinimalAccessControlledDoorsByLocationForCurrentUser",
    description: `Get access controlled doors for the specified location for which the current user is associated with 1 or more access grants`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/getRhombusKeyLocationLockdownDetailsForCurrentUser",
    alias: "getRhombusKeyLocationLockdownDetailsForCurrentUser",
    description: `Get the current state of a location lockdown and messages that should be displayed`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/getRhombusSecureCsnCredentialDetails",
    alias: "getRhombusSecureCsnCredentialDetails",
    description: `Retrieves a rhombus secure csn credential including sensitive details`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ credentialUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/getStandardCsnCredentialDetails",
    alias: "getStandardCsnCredentialDetails",
    description: `Retrieves a standard csn credential including sensitive details`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ credentialUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/activateLockdownForLocation",
    alias: "activateLockdownForLocation",
    description: `Activate lockdown for the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_lockdownplan_ActivateLockdownForLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/activateLockdownForLocationViaRhombusKey",
    alias: "activateLockdownForLocationViaRhombusKey",
    description: `Activate lockdown for the specified location from Rhombus Key`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_lockdownplan_ActivateLockdownForLocationViaRhombusKeyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/createLocationLockdownPlan",
    alias: "createLocationLockdownPlan",
    description: `Create location lockdown plan`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_lockdownplan_CreateLocationLockdownPlanWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/deactivateLockdownForLocation",
    alias: "deactivateLockdownForLocation",
    description: `Deactivate lockdown for the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/deactivateLockdownForLocationViaRhombusKey",
    alias: "deactivateLockdownForLocationViaRhombusKey",
    description: `Deactivate lockdown for the specified location from Rhombus Key`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_lockdownplan_DeactivateLockdownForLocationViaRhombusKeyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/deleteLocationLockdownState",
    alias: "deleteLocationLockdownState",
    description: `Disables tracking lockdown state for the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/deleteLockdownPlan",
    alias: "deleteLockdownPlan",
    description: `Delete lockdown plan`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ lockdownPlanUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/disableLockdownTestModeForLocation",
    alias: "disableLockdownTestModeForLocation",
    description: `Disable test mode of lockdown for the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/enableLockdownTestModeForLocation",
    alias: "enableLockdownTestModeForLocation",
    description: `Enable test mode of lockdown for the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/findLocationLockdownEvents",
    alias: "findLocationLockdownEvents",
    description: `Retrieve a list of lockdown events for the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_lockdownplan_FindLocationLockdownEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/findLocationLockdownStates",
    alias: "findLocationLockdownStates",
    description: `Finds the state of all lockdowns for the org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_lockdownplan_FindLocationLockdownStatesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/findLockdownPlans",
    alias: "findLockdownPlans",
    description: `Find lockdown plans in the org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/findLockdownPlansByLocation",
    alias: "findLockdownPlansByLocation",
    description: `Find lockdown plans for the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/getLockdownPlan",
    alias: "getLockdownPlan",
    description: `Get lockdown plan`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ lockdownPlanUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/getOrCreateLocationLockdownState",
    alias: "getOrCreateLocationLockdownState",
    description: `Retrieves an existing lockdown state or creates one for the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/lockdownPlan/updateLocationLockdownPlan",
    alias: "updateLocationLockdownPlan",
    description: `Update location lockdown plan`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/provisionMobileAccessControlCredentialForCurrentUser",
    alias: "provisionMobileAccessControlCredentialForCurrentUser",
    description: `Creates a mobile access control credential. Store the private key securely, there is no other way to retrieve it other then generating a new cred.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema:
          Accesscontrol_credentials_ProvisionMobileAccessControlCredentialForCurrentUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/removeUsersFromAccessControlGroup",
    alias: "removeUsersFromAccessControlGroup",
    description: `Removes specified users from an access control group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_group_RemoveUsersFromAccessControlGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/revokeAccessControlCredential",
    alias: "revokeAccessControlCredential",
    description: `Revokes an access control credential. Unlike suspension this will give up its claim on the credential value allowing another cred to claim it as its identifier`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ credentialUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/revokeRhombusSecureMobileCredentialForCurrentUser",
    alias: "revokeRhombusSecureMobileCredentialForCurrentUser",
    description: `Revoke user&#x27;s rhombus secure mobile credential`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ credentialUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/sendUserPresenceForCurrentUser",
    alias: "sendUserPresenceForCurrentUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_SendUserPresenceForCurrentUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/suspendAccessControlCredential",
    alias: "suspendAccessControlCredential",
    description: `Mark an access control credential as suspended`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ credentialUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/unlockAccessControlledDoor",
    alias: "unlockAccessControlledDoor",
    description: `Unlock an access controlled door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ accessControlledDoorUuid: z.string().nullable() })
          .partial()
          .passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/unlockAccessControlledDoorForCurrentUser",
    alias: "unlockAccessControlledDoorForCurrentUser",
    description: `Unlock an access controlled door using authorization of supplied user token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_UnlockAccessControlledDoorForCurrentUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/unsuspendAccessControlCredential",
    alias: "unsuspendAccessControlCredential",
    description: `Mark an access control credential as no longer suspended`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ credentialUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/updateAccessGrant",
    alias: "updateAccessGrant",
    description: `Updates a location access grant`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_accessgrant_UpdateAccessGrantWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/updateAccessRevocation",
    alias: "updateAccessRevocation",
    description: `Updates a location access revocation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_accessrevocation_UpdateAccessRevocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/updateRhombusSecureCsnCredential",
    alias: "updateRhombusSecureCsnCredential",
    description: `Update a rhombus secure csn credential (Rhombus Badge)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_UpdateRhombusSecureCsnCredentialWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/updateRhombusSecureMobileCredential",
    alias: "updateRhombusSecureMobileCredential",
    description: `Update a rhombus secure mobile credential (RhombusKey App w/ BLE or NFC)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_UpdateRhombusSecureMobileCredentialWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/accesscontrol/updateStandardCsnCredential",
    alias: "updateStandardCsnCredential",
    description: `Update a standard csn credential (Third Party Badge)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Accesscontrol_credentials_UpdateStandardCsnCredentialWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/acceptAlertMonitoringTermsOfServiceForLocation",
    alias: "acceptAlertMonitoringTermsOfServiceForLocation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/cancelThreatCase",
    alias: "cancelThreatCase",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Alertmonitoring_CancelThreatCaseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/createAlertMonitoringSettings",
    alias: "createAlertMonitoringSettings",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Alertmonitoring_CreateNoonlightSettingsForLocationRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/createPinForLocation",
    alias: "createPinForLocation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Alertmonitoring_CreatePinForNoonlightWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/deleteAlertMonitoringSettings",
    alias: "deleteAlertMonitoringSettings",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/deletePinForLocation",
    alias: "deletePinForLocation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Alertmonitoring_DeletePinForNoonlightWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/dismissThreatCase",
    alias: "dismissThreatCase",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Alertmonitoring_DismissThreatCaseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/escalateThreatCaseToAlarm",
    alias: "escalateThreatCaseToAlarm",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Alertmonitoring_EscalateThreatCaseToAlarmWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/getAlertMonitoringSettings",
    alias: "getAlertMonitoringSettings",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/getAlertMonitoringSettingsForLocation",
    alias: "getAlertMonitoringSettingsForLocation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/alertmonitoring/updateAlertMonitoringSettings",
    alias: "updateAlertMonitoringSettings",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Alertmonitoring_UpdateNoonlightSettingsForLocationRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/delete",
    alias: "deleteAudioGateway",
    description: `Remove an audio gateway from organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Audiogateway_DeleteAudioGatewayWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/getAudioSeekpoints",
    alias: "getAudioSeekpoints",
    description: `Get audio seek points`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Audiogateway_GetAudioSeekpointsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/getConfig",
    alias: "getAudioGatewayConfig",
    description: `Get an audio gateway config`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ audioGatewayUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/getFullAudioGatewayState",
    alias: "getFullAudioGatewayState",
    description: `Get detailed information about state of specified audio gateway`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Audiogateway_GetFullAudioGatewayStateWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/getMediaUris",
    alias: "getAudioGatewayMediaUris",
    description: `Get media uris for audio gateway to retrieve footage`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ gatewayUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/getMinimalAudioGatewayStateList",
    alias: "getMinimalAudioGatewayStateList",
    description: `Get basic state information for all audio gateways`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/getPresenceWindows",
    alias: "getAudioGatewayPresenceWindows",
    description: `Get stored video information for an audio gateway`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Common_devices_GetPresenceWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/getUptimeWindows",
    alias: "getAudioGatewayUptimeWindows",
    description: `Get uptime information for an audio gateway`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Common_devices_GetUptimeWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/updateConfig",
    alias: "updateAudioGatewayConfig",
    description: `Update config for audio gateway`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Audiogateway_UpdateAudioGatewayConfigWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audiogateway/updateDetails",
    alias: "updateAudioGatewayDetails",
    description: `Update details for audio gateway. Note: uuid is a required field`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Audiogateway_UpdateAudioGatewayDetailsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audioplayback/deleteAudioUploadMetadata",
    alias: "deleteAudioUploadMetadata",
    description: `Delete an uploaded audio clip metadata`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ audioUploadUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audioplayback/getAudioUploadMetadataForOrg",
    alias: "getAudioUploadMetadataForOrg",
    description: `Get list of uploaded audio clip metadata`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audioplayback/playAudioUpload",
    alias: "playAudioUpload",
    description: `Play an uploaded audio clip through an AudioGateway`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Audioplayback_PlayAudioUploadWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audioplayback/updateAudioUploadMetadata",
    alias: "updateAudioUploadMetadata",
    description: `Update an uploaded audio clip metadata`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Audioplayback_UpdateAudioUploadMetadataWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audioplayback/uploadAudioPcm/:audioClipName",
    alias: "uploadAudioPcm",
    description: `Upload PCM audio clip`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormDataMultiPart,
      },
      {
        name: "audioClipName",
        type: "Path",
        schema: z.string().nullable(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/audioplayback/uploadAudioText",
    alias: "uploadAudioText",
    description: `Upload text to synthesize audio`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Audioplayback_UploadAudioTextWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/ble/getBaseStations",
    alias: "getBaseStations",
    description: `Retrieve list of available base stations for BLE sensors`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/ble/getSecureSecretForRegistered",
    alias: "getSecureSecretForRegistered",
    description: `Get secure secret for registered sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Ble_BleDeviceMap,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/ble/getSecureSecretForUnregistered",
    alias: "getSecureSecretForUnregistered",
    description: `Get secure secret to register an unregistered sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Ble_BleDeviceMap,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/ble/getSecureSecretOfRegisteredDeviceForRhombusKey",
    alias: "getSecureSecretOfRegisteredDeviceForRhombusKey",
    description: `Equivalent to getSecureSecretForRegistered but for RhombusKey mobile app`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Ble_BleDeviceMap,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/ble/getSensorHardwareFirmwareUpdateDetails",
    alias: "getSensorHardwareFirmwareUpdateDetails",
    description: `Get latest firmware update details for all sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/ble/registerSensor",
    alias: "registerSensor",
    description: `Register a sensor to an organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Ble_RegisterSensorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/ble/unregisterSensor",
    alias: "unregisterSensor",
    description: `Unregister a sensor from account`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/button/createRuleForButton",
    alias: "createRuleForButton",
    description: `Create rule for a button sensor.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Button_CreateRuleForButtonWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/button/deleteRuleForButton",
    alias: "deleteRuleForButton",
    description: `Delete rule for a button sensor.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Button_DeleteRuleForButtonWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/button/getButtonPressEventsForSensor",
    alias: "getButtonPressEventsForSensor",
    description: `Get list of button press events for button sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Button_GetButtonPressEventsForSensorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/button/getButtonRulesForOrg",
    alias: "getButtonRulesForOrg",
    description: `Get rules for all buttons in an org.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/button/getMinimalButtonStateList",
    alias: "getMinimalButtonStateList",
    description: `Get basic state information for all button sensors`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/button/getRulesForButton",
    alias: "getRulesForButton",
    description: `Get all rules for a button sensor.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ sensorUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/button/updateConfig",
    alias: "updateButtonConfig",
    description: `Update config for a button sensor.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Button_UpdateButtonConfigWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/button/updateDetails",
    alias: "updateButtonDetails",
    description: `Update details for a button sensor.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Button_UpdateButtonDetailsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/calibrateFloorplanProjection",
    alias: "cameraCalibrateFloorplanProjection",
    description: `Generate the homography to project detections onto a floorplan.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Common_devices_CalibrateFloorplanProjectionWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/createCustomFootageSeekpoints",
    alias: "createCustomFootageSeekpoints",
    description: `Create custom activity seekpoints for a specified camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_CreateCustomFootageSeekpointsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/createFootageBoundingBoxes",
    alias: "createFootageBoundingBoxes",
    description: `Create an activity bounding box for specified camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_CreateFootageBoundingBoxesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/createProtectedSharedLiveVideoStream",
    alias: "createProtectedSharedLiveVideoStream",
    description: `Share a password protected live video stream for a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_CreateSharedLiveVideoStreamWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/createProtectedSharedVideoWall",
    alias: "createProtectedSharedVideoWall",
    description: `Share a password protected video wall`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_CreateSharedVideoWallWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/createRawHttpStream",
    alias: "createRawHttpStream",
    description: `Create a raw HTTP stream for a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_CreateRawHttpStreamWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/createSharedLiveVideoStream",
    alias: "createSharedLiveVideoStream",
    description: `Share an unprotected live video stream for a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_CreateSharedLiveVideoStreamWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/createSharedVideoWall",
    alias: "createSharedVideoWall",
    description: `Share an unprotected video wall`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_CreateSharedVideoWallWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/createVideoWall",
    alias: "createVideoWall",
    description: `Create a video wall for user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_CreateVideoWallWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/delete",
    alias: "deleteCamera",
    description: `Remove a camera from organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_DeleteCameraWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/deleteCustomFootageSeekpoints",
    alias: "deleteCustomFootageSeekpoints",
    description: `Delete custom seekpoints for specified cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_DeleteCustomFootageSeekpointsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/deleteRawHttpStream",
    alias: "deleteRawHttpStream",
    description: `Delete a raw HTTP stream for a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_DeleteRawHttpStreamWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/deleteSharedLiveVideoStream",
    alias: "deleteSharedLiveVideoStream",
    description: `Remove a shared live stream from camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_DeleteSharedLiveVideoStreamWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/deleteSharedVideoWall",
    alias: "deleteSharedVideoWall",
    description: `Remove a shared video wall`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_DeleteSharedVideoWallWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/deleteVideoWall",
    alias: "deleteVideoWall",
    description: `Delete a video wall`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/erase",
    alias: "eraseCamera",
    description: `Wipes the SD card on a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ cameraUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/findAllSharedLiveVideoStreams",
    alias: "findAllSharedLiveVideoStreams",
    description: `Get list of all shared live streams`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/findSharedLiveVideoStreams",
    alias: "findSharedLiveVideoStreams",
    description: `Get list of all shared live streams for camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ cameraUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/findSharedVideoWalls",
    alias: "findSharedVideoWalls",
    description: `Get list of all shares for a video wall`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ videoWallUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/generateBatchRegistrationInfo",
    alias: "generateBatchRegistrationInfo",
    description: `Create camera registration information for QR code generation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GenerateBatchRegistrationInfoRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/generateWifiChangeAuthorizationToken",
    alias: "generateWifiChangeAuthorizationToken",
    description: `Create a change wifi request for QR code generation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GenerateWifiChangeAuthorizationTokenWSRequest,
      },
      {
        name: "RHOMBUS_MY_IP",
        type: "Header",
        schema: z.string().nullish().default(""),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getBatchRegistrationUsage",
    alias: "getBatchRegistrationUsage",
    description: `Get detailed usage information for a registration token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetBatchRegistrationTokenUsageRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getCameraAIThresholds",
    alias: "getCameraAIThresholds",
    description: `Get AI normalized confidence thresholds for a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ cameraUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getCloudArchivedMediaInfo",
    alias: "getCloudArchivedMediaInfo",
    description: `Get information on archived video for specified camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ cameraUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getCloudArchivingConfig",
    alias: "getCloudArchivingConfig",
    description: `Get the cloud archiving scheduling config applicable to a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getConfig",
    alias: "getCameraConfig",
    description: `Get a camera&#x27;s config`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ cameraUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getCustomFootageSeekpointsV2",
    alias: "getCustomFootageSeekpointsV2",
    description: `Get activity seekpoints for specified camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetCustomFootageSeekpointsV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getDetails",
    alias: "getCameraDetails",
    description: `Get hardware details of multiple cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetCameraDetailsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getFootageBoundingBoxes",
    alias: "getFootageBoundingBoxes",
    description: `Get object bounding boxes for a specified camera. Note: bounding box values are given as permyriad shorts relative to image.  To convert to absolute pixel values, use the following: abs_pix &#x3D; (rel_permyriad / 10000) * image_dim`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetFootageBoundingBoxesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getFootageBoundingBoxesForMultiple",
    alias: "getFootageBoundingBoxesForMultiple",
    description: `Get object bounding boxes for multiple cameras. Note: bounding box values are given as permyriad shorts relative to image.  To convert to absolute pixel values, use the following: abs_pix &#x3D; (rel_permyriad / 10000) * image_dim`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetFootageBoundingBoxesForMultipleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getFootageSeekpointsForMultiple",
    alias: "getFootageSeekpointsForMultiple",
    description: `Get activity seekpoints for multiple cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetFootageSeekpointsForMultipleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getFootageSeekpointsV2",
    alias: "getFootageSeekpointsV2",
    description: `Get activity seekpoints for specified camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetFootageSeekpointsV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getFullCameraState",
    alias: "getFullCameraState",
    description: `Get detailed information about state of specified camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetFullCameraStateWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getMediaUris",
    alias: "getCameraMediaUris",
    description: `Get media uris for camera to retrieve footage`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ cameraUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getMinimalCameraLocationMap",
    alias: "getMinimalCameraLocationMap",
    description: `Get basic information about all cameras and their locations in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getMinimalCameraStateList",
    alias: "getMinimalCameraStateList",
    description: `Get basic state information about all cameras in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ includeMummified: z.boolean().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getOfflineLanStreamingInfo",
    alias: "getOfflineLanStreamingInfo",
    description: `Get required information for offline lan streaming on all cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getPresenceWindows",
    alias: "getPresenceWindows",
    description: `Get stored video information for camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetPresenceWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getRawHttpStreams",
    alias: "getRawHttpStreams",
    description: `Get info for all raw HTTP streams from a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getStorageRecoveryFile",
    alias: "getStorageRecoveryFile",
    description: `Get a file that contains information required to recover the media from the SD card of a damaged camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getUptimeWindows",
    alias: "getUptimeWindows",
    description: `Get uptime information for camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_GetUptimeWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/getVideoWalls",
    alias: "getVideoWalls",
    description: `Get list of video walls available for client`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/reboot",
    alias: "rebootCamera",
    description: `Send reboot command to camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ cameraUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/updateCameraAIThresholds",
    alias: "updateCameraAIThresholds",
    description: `Update AI confidence thresholds for a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_UpdateCameraAIThresholdsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/updateConfig",
    alias: "updateCameraConfig",
    description: `Update a camera&#x27;s config`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_UpdateConfigWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/updateDetailsBulkV2",
    alias: "updateDetailsBulkV2",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_UpdateCamerasBulkV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/updateDetailsV2",
    alias: "updateCameraDetailsV2",
    description: `Update hardware details of camera.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_UpdateCameraV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/updateFirmware",
    alias: "updateFirmware",
    description: `Send command to update firmware to camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ cameraUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/updateVideoWalls",
    alias: "updateVideoWalls",
    description: `Update a video wall`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_UpdateVideoWallWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/camera/updateWifi",
    alias: "updateCameraWifi",
    description: `Send a command to update wifi on specified connected cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Camera_UpdateWifiWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/climate/getClimateEventsForSensor",
    alias: "getClimateEventsForSensor",
    description: `Get list of climate events for environmental sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Climate_GetClimateEventsForSensorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/climate/getClimatePresenceWindows",
    alias: "getClimatePresenceWindows",
    description: `Get stored video information for sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Sensor_GetSensorPresenceWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/climate/getConfig",
    alias: "getConfig",
    description: `Get the config for a climate sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/climate/getMinimalClimateStateList",
    alias: "getMinimalClimateStateList",
    description: `Get basic state information of all environmental sensors`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/climate/updateDetails",
    alias: "updateClimateSensorDetails",
    description: `Update details for environmental sensor. Note: uuid is a required field`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Climate_UpdateClimateSensorDetailsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/addAccessControlledDoorLabel",
    alias: "addAccessControlledDoorLabel",
    description: `Create a label that can be assigned to an access controlled door and referenced by an access grant or access revocation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_AddAccessControlledDoorLabelWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createAccessControlledDoor",
    alias: "createAccessControlledDoor",
    description: `Create an access controlled door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateAccessControlledDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createIntegratedDoorPositionIndicator",
    alias: "createIntegratedDoorPositionIndicator",
    description: `Create a door position indicator component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateIntegratedDoorPositionIndicatorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createIntegratedDoorRelay",
    alias: "createIntegratedDoorRelay",
    description: `Create a door relay component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateIntegratedDoorRelayWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createIntegratedGenericButton",
    alias: "createIntegratedGenericButton",
    description: `Create a generic button component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateIntegratedGenericButtonWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createIntegratedGenericInput",
    alias: "createIntegratedGenericInput",
    description: `Create a generic input component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateIntegratedGenericInputWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createIntegratedGenericRelay",
    alias: "createIntegratedGenericRelay",
    description: `Create a generic relay component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateIntegratedGenericRelayWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createIntegratedRequestToExit",
    alias: "createIntegratedRequestToExit",
    description: `Create a request to exit component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateIntegratedRequestToExitWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createOsdpDoorReader",
    alias: "createOsdpDoorReader",
    description: `Create a third party OSDP Reader component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateOsdpReaderWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createRhombusOsdpDoorReader",
    alias: "createRhombusOsdpDoorReader",
    description: `Create a Rhombus OSDP Reader component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateRhombusOsdpReaderWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/createWiegandReader",
    alias: "createWiegandReader",
    description: `Create a third party Wiegand Reader component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_CreateWiegandReaderWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/deleteAccessControlledDoor",
    alias: "deleteAccessControlledDoor",
    description: `Delete the specified access controlled door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ accessControlledDoorUuid: z.string().nullable() })
          .partial()
          .passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/deleteComponent",
    alias: "deleteComponent",
    description: `Delete a component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ componentUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/deleteComponentsByOwnerDevice",
    alias: "deleteComponentsByOwnerDevice",
    description: `Delete all components owned by the specified device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ ownerDeviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findAccessControlledDoors",
    alias: "findAccessControlledDoors",
    description: `Find access controlled doors within the org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findAccessControlledDoorsByLocation",
    alias: "findAccessControlledDoorsByLocation",
    description: `Find access controlled doors within the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findAccessControlledDoorsByOwnerDevice",
    alias: "findAccessControlledDoorsByOwnerDevice",
    description: `Find access controlled doors for the specified owner device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ ownerDeviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findAllComponentShadows",
    alias: "findAllComponentShadows",
    description: `Retrieve all component shadows for the specified component uuids`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindAllComponentShadowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByAccessControlledDoor",
    alias: "findComponentEventsByAccessControlledDoor",
    description: `Retrieve all component events relevant to the specified AccessControlledDoor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByAccessControlledDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByApiToken",
    alias: "findComponentEventsByApiToken",
    description: `Retrieve all component events relevant to the specified api token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByApiTokenWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByComponent",
    alias: "findComponentEventsByComponent",
    description: `Retrieve all component events relevant to the specified component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByComponentWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByCorrelation",
    alias: "findComponentEventsByCorrelation",
    description: `Retrieve all component events relevant to the specified correlation id`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByCorrelationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByCredentialHexValue",
    alias: "findComponentEventsByCredentialHexValue",
    description: `Retrieve all component events relevant to the specified credential hex value`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByCredentialHexValueWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByCredentialUuid",
    alias: "findComponentEventsByCredentialUuid",
    description: `Retrieve all component events relevant to the specified credential uuid`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByCredentialUuidWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByCredentialValue",
    alias: "findComponentEventsByCredentialValue",
    description: `Retrieve all component events relevant to the specified credential value`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByCredentialValueWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByLocation",
    alias: "findComponentEventsByLocation",
    description: `Retrieve all component events relevant to the specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByOwnerDevice",
    alias: "findComponentEventsByOwnerDevice",
    description: `Retrieve all component events relevant to the specified owner device (i.e. DC20&#x27;s device uuid)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByOwnerDeviceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsBySupportAuthority",
    alias: "findComponentEventsBySupportAuthority",
    description: `Retrieve all component events relevant to the specified api token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsBySupportAuthorityWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsByUser",
    alias: "findComponentEventsByUser",
    description: `Retrieve all component events relevant to the specified User`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsByUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentEventsForCurrentUser",
    alias: "findComponentEventsForCurrentUser",
    description: `Retrieve all component events relevant to the rhombus key user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentEventsForCurrentUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentsByOwnerDevice",
    alias: "findComponentsByOwnerDevice",
    description: `Retrieve a list of components owned by a Rhombus device (i.e. DC20&#x27;s device uuid)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ ownerDeviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentSeekPointsByAccessControlledDoor",
    alias: "findComponentSeekPointsByAccessControlledDoor",
    description: `Find component seekpoints by access controlled door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentSeekPointsByAccessControlledDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentSeekPointsByComponent",
    alias: "findComponentSeekPointsByComponent",
    description: `Find component seekpoints by component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentSeekPointsByComponentWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentSeekPointsByLocation",
    alias: "findComponentSeekPointsByLocation",
    description: `Find component seekpoints by location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentSeekPointsByLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentSeekPointsByOwnerDevice",
    alias: "findComponentSeekPointsByOwnerDevice",
    description: `Find component seekpoints by owner device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentSeekPointsByOwnerDeviceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentSeekPointsByUser",
    alias: "findComponentSeekPointsByUser",
    description: `Find component seekpoints by user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_FindComponentSeekPointsByUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/findComponentShadowsByOwnerDevice",
    alias: "findComponentShadowsByOwnerDevice",
    description: `Retrieve component shadows by the specified owner device uuid`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ ownerDeviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/getAccessControlledDoorLabelsForOrg",
    alias: "getAccessControlledDoorLabelsForOrg",
    description: `Get all access controlled door labels for the organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/getOrCreateDevicePhysicalPortConfig",
    alias: "getOrCreateDevicePhysicalPortConfig",
    description: `Gets a physical port layout for the specified device, components owned by that device and details about the port configuration validity. Map is instantiated if it doesn&#x27;t currently exist as part of the call.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ ownerDeviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/removeAccessControlledDoorLabel",
    alias: "removeAccessControlledDoorLabel",
    description: `Remove a label to an access controlled door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_RemoveAccessControlledDoorLabelWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateAccessControlledDoor",
    alias: "updateAccessControlledDoor",
    description: `Updates an access controlled door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateAccessControlledDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateIntegratedDoorPositionIndicator",
    alias: "updateIntegratedDoorPositionIndicator",
    description: `Update a door position indicator component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateIntegratedDoorPositionIndicatorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateIntegratedDoorRelay",
    alias: "updateIntegratedDoorRelay",
    description: `Update a door relay component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateIntegratedDoorRelayWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateIntegratedGenericButton",
    alias: "updateIntegratedGenericButton",
    description: `Update a generic button component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateIntegratedGenericButtonWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateIntegratedGenericInput",
    alias: "updateIntegratedGenericInput",
    description: `Update a generic input component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateIntegratedGenericInputWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateIntegratedGenericRelay",
    alias: "updateIntegratedGenericRelay",
    description: `Update a generic relay component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateIntegratedGenericRelayWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateIntegratedRequestToExit",
    alias: "updateIntegratedRequestToExit",
    description: `Update a request to exit component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateIntegratedRequestToExitWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateOsdpDoorReader",
    alias: "updateOsdpDoorReader",
    description: `Update a third party OSDP Reader component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateOsdpReaderWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateRhombusOsdpDoorReader",
    alias: "updateRhombusOsdpDoorReader",
    description: `Update a Rhombus OSDP Reader component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateRhombusOsdpReaderWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/component/updateWiegandDoorReader",
    alias: "updateWiegandDoorReader",
    description: `Update a third party Wiegand Reader component`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Component_UpdateWiegandReaderWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/acceptUsagePolicy",
    alias: "acceptUsagePolicy",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/deleteAllNotificationSnoozeSettings",
    alias: "deleteAllNotificationSnoozeSettings",
    description: `Delete a policy pause setting for a device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/deleteNotificationSnoozeSettingForDevice",
    alias: "deleteNotificationSnoozeSettingForDevice",
    description: `Delete a policy pause setting for a device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/deleteNotificationSnoozeSettingForLocation",
    alias: "deleteNotificationSnoozeSettingForLocation",
    description: `Delete a policy pause setting for a location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/getCurrentPartnerUser",
    alias: "getCurrentPartnerUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/getCurrentRhombusKeyUser",
    alias: "getCurrentRhombusKeyUser",
    description: `Retrieve the RhombusKey User config, user details and org summary details for the current rhombus key user.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/getCurrentUser",
    alias: "getCurrentUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/getCurrentUserConsoleOrgsForContextSwitch",
    alias: "getCurrentUserConsoleOrgsForContextSwitch",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/getCurrentUserRhombusKeyOrgsForContextSwitch",
    alias: "getCurrentUserRhombusKeyOrgsForContextSwitch",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/getCurrentUserSessions",
    alias: "getCurrentUserSessions",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/getDashboardStatus",
    alias: "getDashboardStatus",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/getRhombusKeyConfigForCurrentUser",
    alias: "getRhombusKeyConfigForCurrentUser",
    description: `Retrieve the RhombusKey mobile app config for a user. If it does not exist a default one is created and returned.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/getUserSnoozedNotificationSettings",
    alias: "getUserSnoozedNotificationSettings",
    description: `Get the current and planned user notification snooze details`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/logoutAllOtherCurrentUserSessions",
    alias: "logoutAllOtherCurrentUserSessions",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/setFlag",
    alias: "setCustomerFlag",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Customer_SetFlagWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/snoozeAllNotifications",
    alias: "snoozeAllUserNotifications",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Customer_SnoozeAllNotificationsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/snoozeDeviceNotifications",
    alias: "snoozeUserNotificationsForDevice",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Customer_SnoozeNotificationsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/snoozeLocationNotifications",
    alias: "snoozeUserNotificationsForLocation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Customer_SnoozeNotificationsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/updateCurrentPartnerUser",
    alias: "updateCurrentPartnerUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Customer_UpdateCurrentPartnerWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/updateCurrentUser",
    alias: "updateCurrentUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Customer_UpdateCurrentUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/updateDashboardCustomizations",
    alias: "updateDashboardCustomizations",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Customer_UpdateDashboardCustomizationsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/updateFrontendCustomizations",
    alias: "updateFrontendCustomizations",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Customer_UpdateFrontendCustomizationsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/customer/updateRhombusKeyPreferencesForCurrentUser",
    alias: "updateRhombusKeyPreferencesForCurrentUser",
    description: `Update the RhombusKey mobile app preferences for the current user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Customer_UpdateRhombusKeyPreferencesForCurrentUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/developer/createEventListener",
    alias: "createEventListener",
    description: `Create an event listener`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Developer_CreateEventListenerWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/developer/deleteEventListener",
    alias: "deleteEventListener",
    description: `Delete an event listener`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ eventListenerUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/developer/getAllEventListeners",
    alias: "getAllEventListeners",
    description: `Get a list of all event listeners`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/developer/getEventListenersForDevice",
    alias: "getEventListenersForDevice",
    description: `Get a list of event listeners for a device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/door/getDoorEventsForSensor",
    alias: "getDoorEventsForSensor",
    description: `Get list of door open/close events for door sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Door_GetDoorEventsForSensorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/door/getDoorPresenceWindows",
    alias: "getDoorPresenceWindows",
    description: `Get stored video information for sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Sensor_GetSensorPresenceWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/door/getMinimalDoorStateList",
    alias: "getMinimalDoorStateList",
    description: `Get basic state information for all door sensors`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/door/updateDetails",
    alias: "updateDoorSensorDetails",
    description: `Update details for door sensor. Note: uuid is a required field`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Door_UpdateDoorSensorDetailsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/calibrateFloorplanProjection",
    alias: "doorbellCameraCalibrateFloorplanProjection",
    description: `Generate the homography to project detections onto a floorplan.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Common_devices_CalibrateFloorplanProjectionWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/createRuleForDoorbellCamera",
    alias: "createRuleForDoorbellCamera",
    description: `Create rule for a doorbell camera.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Doorbellcamera_CreateRuleForDoorbellCameraWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/delete",
    alias: "deleteDoorbellCamera",
    description: `Remove the doorbell camera from the organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Doorbellcamera_DeleteDoorbellCameraWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/deleteRuleForDoorbellCamera",
    alias: "deleteRuleForDoorbellCamera",
    description: `Delete rule for a doorbell camera.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Doorbellcamera_DeleteRuleForDoorbellCameraWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getBoundingBoxes",
    alias: "getDoorbellCameraBoundingBoxes",
    description: `Get object bounding boxes for a specified doorbell camera. Note: bounding box values are given as permyriad shorts relative to image.  To convert to absolute pixel values, use the following: abs_pix &#x3D; (rel_permyriad / 10000) * image_dim`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Common_devices_GetBoundingBoxesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getConfig",
    alias: "getDoorbellCameraConfig",
    description: `Get a doorbell camera&#x27;s config`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getDoorbellCameraRulesForOrg",
    alias: "getDoorbellCameraRulesForOrg",
    description: `Get rules for all doorbell cameras in an org.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getFullState",
    alias: "getDoorbellCameraFullState",
    description: `Get detailed information about state of specified doorbell camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Common_devices_GetFullDeviceStateWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getMediaUris",
    alias: "getDoorbellCameraMediaUris",
    description: `Get media uris for doorbell camera to retrieve footage and audio`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getMinimalStateList",
    alias: "getDoorbellCameraMinimalStateList",
    description: `Get basic state information about all doorbell cameras in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ includeMummified: z.boolean().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getPresenceWindows",
    alias: "getDoorbellCameraPresenceWindows",
    description: `Get stored video information for a doorbell camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Common_devices_GetPresenceWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getRulesForDoorbellCamera",
    alias: "getRulesForDoorbellCamera",
    description: `Get all rules for a doorbell camera.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ doorbellCameraUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getSeekpoints",
    alias: "getDoorbellCameraSeekpoints",
    description: `Get activity seekpoints for specified doorbell camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Common_devices_GetSeekpointsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/getUptimeWindows",
    alias: "getDoorbellCameraUptimeWindows",
    description: `Get uptime information for a doorbell camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Common_devices_GetUptimeWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/updateConfig",
    alias: "updateDoorbellCameraConfig",
    description: `Update a doorbell camera&#x27;s config`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Doorbellcamera_UpdateDoorbellCameraConfigWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorbellcamera/updateDetails",
    alias: "updateDoorbellCameraDetails",
    description: `Update hardware details of doorbell camera.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Doorbellcamera_UpdateDoorbellCameraDetailsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorcontroller/delete",
    alias: "deleteDoorController",
    description: `Remove the door controller from the organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Doorcontroller_DeleteDoorControllerWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorcontroller/getConfig",
    alias: "getDoorControllerConfig",
    description: `Get a door controller&#x27;s config`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorcontroller/getDoorControllerStateList",
    alias: "getDoorControllerStateList",
    description: `Get state information about all door controllers in an organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorcontroller/registerDiscoveredRhombusReader",
    alias: "registerDiscoveredRhombusReader",
    description: `Register a Rhombus reader that a Door Controller has discovered`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Doorcontroller_RegisterDiscoveredRhombusReaderWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorcontroller/updateConfig",
    alias: "updateDoorControllerConfig",
    description: `Update a door controller&#x27;s config`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Doorcontroller_UpdateDoorControllerConfigWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/doorcontroller/updateDetails",
    alias: "updateDoorControllerDetails",
    description: `Update details for door controller. Note: uuid is a required field`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Doorcontroller_UpdateDoorControllerDetailsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/ethernettester/getEthernetTesterConfig",
    alias: "getEthernetTesterConfig",
    description: `Get test configuration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ version: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/createSharedClipGroupV3",
    alias: "createSharedClipGroupV3",
    description: `Share multiple clips in a single page`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_CreateSharedClipGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/deleteAlertMonitoringThreatCase",
    alias: "deleteAlertMonitoringThreatCase",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_DeleteAlertMonitoringThreatCaseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/deleteSavedClip",
    alias: "deleteSavedClip",
    description: `Delete all types of saved clips (splices in progress, completed splices, saved alerts)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ savedClipUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/deleteSharedClipGroupV2",
    alias: "deleteSharedClipGroupV2",
    description: `Delete a shared clip page`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/dismissAllPolicyAlertsForDevice",
    alias: "dismissAllPolicyAlertsForDevice",
    description: `Dismiss all policy alerts for each specified device(s)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_DismissAllPolicyAlertsForDeviceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/dismissAllPolicyAlertsV2",
    alias: "dismissAllPolicyAlertsV2",
    description: `Dismiss all policy alerts in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/dismissPolicyAlertsV2",
    alias: "dismissPolicyAlertsV2",
    description: `Dismiss multiple policy alerts`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_DismissPolicyAlertsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/dismissPolicyAlertV2",
    alias: "dismissPolicyAlertV2",
    description: `Dismiss a policy alert`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ alertUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getAlertMonitoringThreatCases",
    alias: "getAlertMonitoringThreatCases",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetAlertMonitoringThreatCasesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getClipsWithProgress",
    alias: "getClipsWithProgress",
    description: `Get list of saved clips in organization, with current progress`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetClipsWithProgressWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getMotionGrid",
    alias: "getMotionGrid",
    description: `Get motion data for specified camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetMotionGridWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getMotionHeatMap",
    alias: "getMotionHeatMap",
    description: `Get aggregated motion heatmap for specified time period and camera. Divides a camera&#x27;s resolution into a 36x64 grid and counts the number of motion events that occurred in each cell.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetMotionGridWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getPolicyAlertCount",
    alias: "getPolicyAlertCount",
    description: `Get count of policy alerts`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ maxResultsSize: z.number().int().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getPolicyAlertDetails",
    alias: "getPolicyAlertDetails",
    description: `Get detailed information about policy alert, including seekpoints and bounding boxes`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ policyAlertUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getPolicyAlertGroupsForDevice",
    alias: "getPolicyAlertGroupsForDevice",
    description: `Get recent policy alerts for device, grouped by time. Groups are constructed of alerts that occur within 2 minutes of the previous alert, up to a maximum of 50. Results are returned in reverse-chronological order, so all fields are relative to that ordering.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetPolicyAlertGroupsForDeviceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getPolicyAlertGroupsForLocation",
    alias: "getPolicyAlertGroupsForLocation",
    description: `Get recent policy alerts for a location, grouped by time. Groups are constructed of alerts that occur within 2 minutes of the previous alert, up to a maximum of 50. Results are returned in reverse-chronological order, so all fields are relative to that ordering.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetPolicyAlertGroupsForLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getPolicyAlerts",
    alias: "getPolicyAlerts",
    description: `Get recent policy alerts for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetPolicyAlertsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getSavedClipCount",
    alias: "getSavedClipCount",
    description: `Get a count of saved clips in and organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetSavedClipCountWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getSavedClipDetails",
    alias: "getSavedClipDetails",
    description: `Get detailed information about a saved clip, including seekpoints and bounding boxes`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ clipUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getSavedClipsByExternalTransactionId",
    alias: "getSavedClipsByExternalTransactionId",
    description: `Get list of saved clips matching the external transaction id`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ externalTransactionId: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getSavedClipsV2",
    alias: "getSavedClipsV2",
    description: `Get list of saved clips in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetSavedClipsV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getSharedClipGroupDetails",
    alias: "getSharedClipGroupDetails",
    description: `Get detailed information about a shared clip page, including seekpoints and bounding boxes`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getSharedClipGroupsV2",
    alias: "getSharedClipGroupsV2",
    description: `Get list of shared clip pages in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_GetSharedClipGroupsV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/getUnhealthyDeviceAlerts",
    alias: "getUnhealthyDeviceAlerts",
    description: `Get list of unhealthy devices in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/muteNotificationsForDevice",
    alias: "muteNotificationsForDevice",
    description: `Mute notifications from a device for specified number of seconds`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_MuteNotificationsForDevicetWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/reportBadPolicyAlert",
    alias: "reportBadPolicyAlert",
    description: `Report a bad policy event (AI false positive) and send information for feedback. Note: this adds the clip to our AI training data set`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_ReportBadPolicyAlertWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/savePolicyAlertV2",
    alias: "savePolicyAlertV2",
    description: `Save a policy alert as a saved clip`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_SavePolicyAlertWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/searchMotionGrid",
    alias: "searchMotionGrid",
    description: `Search motion grid for motion events occuring in specified grid cells. Note: motion grid is a 64x36 grid of cells with the upper left hand corner being (0, 0)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_SearchMotionGridWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/searchMotionGridWithActivities",
    alias: "searchMotionGridWithActivities",
    description: `Search motion grid for motion events occuring in specified grid cells. Note: motion grid is a 64x36 grid of cells with the upper left hand corner being (0, 0)`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_SearchMotionGridWithActivitiesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/updateSavedClip",
    alias: "updateSavedClip",
    description: `Update saved clip title or summary`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_UpdateSavedClipWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/event/updateSharedClipGroupV2",
    alias: "updateSharedClipGroupV2",
    description: `Update shared clip page title, description, password, or expiration time`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Event_UpdateSharedClipGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/audit",
    alias: "exportAudit",
    description: `Download audit log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportAuditEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/climateEvents",
    alias: "exportClimateEvents",
    description: `Download climate event log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportClimateEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/countReports",
    alias: "exportCountReports",
    description: `Download count report`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportCountReportsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/diagnostic",
    alias: "exportDiagnostic",
    description: `Download diagnostic log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportDiagnosticEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/doorEvents",
    alias: "exportDoorEvents",
    description: `Download door event log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportDoorEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/faceEvents",
    alias: "exportFaceEvents",
    description: `Download face event log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportFaceEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/inventory",
    alias: "exportInventory",
    description: `Download device inventory`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportInventoryWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/motionEvents",
    alias: "exportMotionEvents",
    description: `Download motion event log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportMotionEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/peopleCountEvents",
    alias: "exportPeopleCountEvents",
    description: `Download people count report`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportPeopleCountEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/peopleEvents",
    alias: "exportPeopleEvents",
    description: `Download people event log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportPeopleEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/proximityEvents",
    alias: "exportProximityEvents",
    description: `Download proximity tag event log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportProximityEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/proximityLocomotionEvents",
    alias: "exportProximityLocomotionEvents",
    description: `Download proximity tag event log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportProximityLocomotionEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/uptime",
    alias: "exportUptime",
    description: `Download device uptime reports`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportUptimeWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/users",
    alias: "exportUsers",
    description: `Download org users`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Export_ExportUsersWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/export/vehicleEventsV2",
    alias: "exportVehicleEventsV2",
    description: `Download vehicle event log`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Vehicle_GetVehicleEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/addFaceLabel",
    alias: "addFaceLabel",
    description: `Add a label to a face`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_AddFaceLabelWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/disassociateFaceEvents",
    alias: "disassociateFaceEvents",
    description: `Disassociate face events from known face`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_DisassociateFaceEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getFace",
    alias: "getFace",
    description: `Get stored details for known face by face ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ faceId: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getFaceLabelsForOrg",
    alias: "getFaceLabelsForOrg",
    description: `Get all face labels for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getFacesForName",
    alias: "getFacesForName",
    description: `Get all faces for a given name`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_GetFacesForNameWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getFacesV2",
    alias: "getFacesV2",
    description: `Get stored details for all known faces in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_GetFacesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getRecentFaceEventsByLocation",
    alias: "getRecentFaceEventsByLocation",
    description: `Get recent face sightings for a location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_GetRecentFaceEventsByLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getRecentFaceEventsForFace",
    alias: "getRecentFaceEventsForFace",
    description: `Get recent face sightings for a known face ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_GetRecentFaceEventsForFaceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getRecentFaceEventsForName",
    alias: "getRecentFaceEventsForName",
    description: `Get recent face sightings for a known face name`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_GetRecentFaceEventsForNameWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getRecentFaceEventsV2",
    alias: "getRecentFaceEventsV2",
    description: `Get recent face sightings across organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_GetRecentFaceEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getUploadedFaces",
    alias: "getUploadedFaceMetadata",
    description: `Get metadata of uploaded faces`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/getUploadedFacesByTransactionId",
    alias: "getUploadedFaceMetadataByTransactionId",
    description: `Get metadata of uploaded faces by transaction id`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ transactionId: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/removeFaceLabel",
    alias: "removeFaceLabel",
    description: `Remove a label from a face`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_RemoveFaceLabelWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/reportFaceEvent",
    alias: "reportFaceEvent",
    description: `Report a mis-detected face event.  This sends the image/clip to Rhombus to better train AI models and removes the event`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ eventUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/face/updateFace",
    alias: "updateFace",
    description: `Update face details, including alert, trust, name, thumbnail`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Face_UpdateFaceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/feature/getDeviceEventTypes",
    alias: "getDeviceEventTypes",
    description: `Get possible event types for specified device dependent on features enabled`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/feature/getDeviceFeatures",
    alias: "getDeviceFeatures",
    description: `Get enabled features for a device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/feature/getDeviceFeaturesList",
    alias: "getDeviceFeaturesList",
    description: `Get enabled features for all devices in an org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Feature_GetDeviceFeaturesListWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/feature/getFeatureCompatabilityMatrix",
    alias: "getFeatureCompatabilityMatrix",
    description: `Get feature compatability matrix`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/feature/updateDeviceFeatures",
    alias: "updateDeviceFeatures",
    description: `Update enabled features for a device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Feature_UpdateDeviceFeaturesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/guestExternal/updateGuestByToken",
    alias: "updateGuestByToken",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateGuestByTokenWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/help/feedback",
    alias: "sendFeedback",
    description: `Leave feedback of our system`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ feedback: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/help/openTicketsV2",
    alias: "getOpenTicketsV2",
    description: `Get Open Support Tickets For A Client Organization. Tickets are associated to an organziation based on the requester&#x27;s organization association.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Help_GetOpenTicketsV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/help/rma",
    alias: "processRMA",
    description: `Open an RMA for a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Help_ProcessRMAWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/help/ticket",
    alias: "createTicket",
    description: `Open a support ticket`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Help_CreateTicketWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/help/ticketWithFile",
    alias: "createTicketWithFile",
    description: `Open a support ticket and optionally include a file upload. Uploading multiple Files are not supported throught this call.`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        description: `multipart/form-data with field &#x27;file&#x27; for the file and &#x27;request&#x27; for the CreateTicketWSRequest(see &#x27;/ticket&#x27; for details on CreateTicketWSRequest)`,
        type: "Body",
        schema: FormDataMultiPart,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/createEnvoyInvite",
    alias: "createEnvoyInvite",
    description: `Create an invite with Envoy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_CreateEnvoyInviteWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteAmtIntegration",
    alias: "deleteAmtIntegration",
    description: `Delete Amt badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteAwsIntegration",
    alias: "deleteAwsIntegration",
    description: `Delete AWS S3 clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteBoxIntegration",
    alias: "deleteBoxIntegration",
    description: `Delete Box clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteBrivoIntegration",
    alias: "deleteBrivoIntegration",
    description: `Delete Brivo badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteButterflymxIntegration",
    alias: "deleteButterflymxIntegration",
    description: `Delete ButterflyMX badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteDeviceIntegration",
    alias: "deleteDeviceIntegration",
    description: `Delete Device integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteDiceIntegration",
    alias: "deleteDiceIntegration",
    description: `Delete Dice integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteDropboxIntegration",
    alias: "deleteDropboxIntegration",
    description: `Delete Dropbox clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteEmailIntegration",
    alias: "deleteEmailIntegration",
    description: `Delete email alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteEnvoyIntegrationV2",
    alias: "deleteEnvoyIntegrationV2",
    description: `Delete Envoy badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteGeneaIntegration",
    alias: "deleteGeneaIntegration",
    description: `Delete Genea badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteGoogleIntegrationV2",
    alias: "deleteGoogleIntegrationV2",
    description: `Delete Google drive clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteGuest",
    alias: "deleteGuest",
    description: `Delete Guest`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GuestWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteGuestManagementIntegration",
    alias: "deleteGuestManagementIntegration",
    description: `Delete Device integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteHaloIntegration",
    alias: "deleteHaloIntegration",
    description: `Delete Halo Smart Sensor integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteInformacastIntegration",
    alias: "deleteInformacastIntegration",
    description: `Delete Informacast integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteIntuifaceIntegration",
    alias: "deleteIntuifaceIntegration",
    description: `Delete Intuiface integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteKisiIntegration",
    alias: "deleteKisiIntegration",
    description: `Delete Kisi badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteLumeoIntegration",
    alias: "deleteLumeoIntegration",
    description: `Delete Lumeo integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteMattermostIntegration",
    alias: "deleteMattermostIntegration",
    description: `Delete Mattermost alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteMicrosoftTeamsIntegrationV2",
    alias: "deleteMicrosoftTeamsIntegrationV2",
    description: `Delete Microsoft Teams alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteMicrosoftTeamsUser",
    alias: "deleteMicrosoftTeamsUser",
    description: `Remove configurations for Microsoft Teams user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteOffice365Integration",
    alias: "deleteOffice365Integration",
    description: `Delete Office365 Sharepoint clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteOmnialertIntegration",
    alias: "deleteOmnialertIntegration",
    description: `Delete Omnialert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteOpenAIIntegration",
    alias: "deleteOpenAIIntegration",
    description: `Delete OpenAI integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteOpenpathIntegration",
    alias: "deleteOpenpathIntegration",
    description: `Delete Openpath badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteOpentechAllianceIntegration",
    alias: "deleteOpentechAllianceIntegration",
    description: `Delete Opentech Alliance integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deletePagerDutyIntegration",
    alias: "deletePagerDutyIntegration",
    description: `Delete PagerDuty alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deletePdkIntegration",
    alias: "deletePdkIntegration",
    description: `Delete ProDataKey badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deletePlaceOsIntegration",
    alias: "deletePlaceOsIntegration",
    description: `Delete PlaceOs badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteServiceNowIntegration",
    alias: "deleteServiceNowIntegration",
    description: `Delete ServiceNow alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteSlackIntegrationV2",
    alias: "deleteSlackIntegrationV2",
    description: `Delete Slack alert integration v2`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteToastIntegration",
    alias: "deleteToastIntegration",
    description: `Delete Toast integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteWebhookIntegration",
    alias: "deleteWebhookIntegration",
    description: `Delete outbound webhook alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/deleteWebhookIntegrationV2",
    alias: "deleteWebhookIntegrationV2",
    description: `Delete entire webhook integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getAllGuestsByOrg",
    alias: "getAllGuestsByOrg",
    description: `Get All Guests by Org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getAmtReaders",
    alias: "getAmtReaders",
    description: `Get list of AMT readers to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GetAmtReadersWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getApiTokenApplications",
    alias: "getApiTokenApplications",
    description: `Get details of all open api token requests for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getApiTokens",
    alias: "getApiTokens",
    description: `Get list of all api tokens for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GetApiTokensWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getBrivoDoors",
    alias: "getBrivoDoors",
    description: `Get list of available Brivo doors to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GetBrivoDoorsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getButterflymxPanels",
    alias: "getButterflymxPanels",
    description: `Get list of available ButterflyMX panels to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GetButterflymxPanelsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getDeviceIntegration",
    alias: "getDeviceIntegration",
    description: `Get Device integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getDiceIntegration",
    alias: "getDiceIntegration",
    description: `Get Dice integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getEnvoyIntegration",
    alias: "getEnvoyIntegration",
    description: `Get Envoy integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getGeneaDoors",
    alias: "getGeneaDoors",
    description: `Get list of Genea doors to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ apiToken: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getGoogleIntegration",
    alias: "getGoogleIntegration",
    description: `Get Google drive clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getGuest",
    alias: "getGuest",
    description: `Get Guest`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GuestWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getGuestManagementIntegration",
    alias: "getGuestManagementIntegration",
    description: `Get Guest Management integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getInformacastIntegration",
    alias: "getInformacastIntegration",
    description: `Get Informacast integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getInformacastMessageTemplates",
    alias: "getInformacastMessageTemplates",
    description: `Get Informacast message templates`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getKisiDoors",
    alias: "getKisiDoors",
    description: `Get list of Kisi doors to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ apiSecretKey: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getKisiPlaces",
    alias: "getKisiPlaces",
    description: `Get list of Kisi places to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ apiSecretKey: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getLumeoIntegration",
    alias: "getLumeoIntegration",
    description: `Get Lumeo integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getMicrosoftTeamsIntegration",
    alias: "getMicrosoftTeamsIntegration",
    description: `Get Microsoft Teams alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getMicrosoftUsersJoinedTeams",
    alias: "getMicrosoftUsersJoinedTeams",
    description: `Get a list of teams a Microsoft Teams user joined`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getOmnialertIntegration",
    alias: "getOmnialertIntegration",
    description: `Get Omnialert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getOpenAIIntegration",
    alias: "getOpenAIIntegration",
    description: `Get OpenAI integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getOpenAIModels",
    alias: "getOpenAIModels",
    description: `Get list of OpenAI models`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getOpenpathDoors",
    alias: "getOpenpathDoors",
    description: `Get list of Openpath doors to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GetOpenpathDoorsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getOpentechAllianceFacilities",
    alias: "getOpentechAllianceFacilities",
    description: `Get list of Opentech Alliance facilities`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getOrgIntegrations",
    alias: "getOrgIntegrations",
    description: `Get details of all third-party integrations for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getOrgIntegrationsV2",
    alias: "getOrgIntegrationsV2",
    description: `Get details of all V2 third-party integrations for an organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getPdkDoors",
    alias: "getPdkDoors",
    description: `Get list of ProdataKey doors to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ ouId: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getPlaceOsDoors",
    alias: "getPlaceOsDoors",
    description: `Get list of PlaceOs doors to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ apiUrl: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getToastServiceAreas",
    alias: "getToastServiceAreas",
    description: `Get list of Toast service areas to assign cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/getWebhookIntegration",
    alias: "getWebhookIntegration",
    description: `Get webhook integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/initiateDropboxOAuth",
    alias: "initiateDropboxOAuth",
    description: `Initiate the Dropbox OAuth Process`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_InitiateOAuthWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/initiateEnvoyOAuth",
    alias: "initiateEnvoyOAuth",
    description: `Initiate the Envoy OAuth Process`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_InitiateOAuthWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/initiateGoogleOAuth",
    alias: "initiateGoogleOAuth",
    description: `Initiate the Google OAuth Process`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_InitiateOAuthWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/initiateMicrosoftTeamsOAuth",
    alias: "initiateMicrosoftTeamsOAuth",
    description: `Initiate the Microsoft Teams OAuth Process`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_InitiateOAuthWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/initiateOffice365OAuth",
    alias: "initiateOffice365OAuth",
    description: `Initiate the Office365 OAuth Process`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_InitiateOAuthWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/initiateSlackOAuth",
    alias: "initiateSlackOAuth",
    description: `Initiate the Slack OAuth Process`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_InitiateOAuthWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/installMicrosoftTeamsBotForTeam",
    alias: "installMicrosoftTeamsBotForTeam",
    description: `Install notification bot for Microsoft Teams team`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ teamId: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/installMicrosoftTeamsBotForUser",
    alias: "installMicrosoftTeamsBotForUser",
    description: `Install notification bot for Microsoft Teams user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/migrateGoogleIntegration",
    alias: "migrateGoogleIntegration",
    description: `Migrate Google drive settings from the V1 table to the V2 table`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/refreshGoogleAccessToken",
    alias: "refreshGoogleAccessToken",
    description: `Refresh Google access token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/revokeApiToken",
    alias: "revokeApiToken",
    description: `Remove an api token from organization. Note: this is irreversible`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ tokenUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/submitApiTokenApplication",
    alias: "submitApiTokenApplication",
    description: `Request an api token for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_SubmitApiTokenApplicationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/subscribeZapierWebhook",
    alias: "subscribeZapierWebhook",
    description: `Setup a Zapier webhook`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_SubscribeZapierWebhookWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/togglePower",
    alias: "togglePower",
    description: `Toggle power for a managed power switch`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_TogglePowerWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/uninstallMicrosoftTeamsBotForTeam",
    alias: "uninstallMicrosoftTeamsBotForTeam",
    description: `Uninstall notification bot for Microsoft Teams team`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ teamId: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/uninstallMicrosoftTeamsBotForUser",
    alias: "uninstallMicrosoftTeamsBotForUser",
    description: `Uninstall notification bot for Microsoft Teams user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/unlockBrivoDoor",
    alias: "unlockBrivoDoor",
    description: `Unlock Brivo door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UnlockIntegrationGenericDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/unlockGeneaDoor",
    alias: "unlockGeneaDoor",
    description: `Unlock Genea door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UnlockGeneaDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/unlockKisiDoor",
    alias: "unlockKisiDoor",
    description: `Unlock Kisi door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UnlockKisiDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/unlockOpenpathDoor",
    alias: "unlockOpenpathDoor",
    description: `Unlock Openpath door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UnlockOpenpathDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/unlockOpentechAllianceDoor",
    alias: "unlockOpentechAllianceDoor",
    description: `Unlock Opentech Alliance door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UnlockIntegrationGenericDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/unlockPdkDoor",
    alias: "unlockPdkDoor",
    description: `Unlock ProdataKey door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UnlockIntegrationGenericDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/unlockPlaceOsDoor",
    alias: "unlockPlaceOsDoor",
    description: `Unlock PlaceOs door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UnlockIntegrationGenericDoorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/unsubscribeZapierWebhook",
    alias: "unsubscribeZapierWebhook",
    description: `Delete a Zapier webhook`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ webhookId: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateAmtIntegration",
    alias: "updateAmtIntegration",
    description: `Update Amt badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateAmtIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateApiToken",
    alias: "updateApiToken",
    description: `Update display name and permissions of an api token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateApiTokenWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateAwsIntegration",
    alias: "updateAwsIntegration",
    description: `Update AWS S3 clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateAwsIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateBoxIntegration",
    alias: "updateBoxIntegration",
    description: `Update Box clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateBoxIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateBrivoIntegration",
    alias: "updateBrivoIntegration",
    description: `Update Brivo badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateBrivoIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateButterflymxIntegration",
    alias: "updateButterflymxIntegration",
    description: `Update ButterflyMX badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateButterflymxIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateDeviceIntegration",
    alias: "updateDeviceIntegration",
    description: `Update Device integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateDeviceIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateDiceIntegration",
    alias: "updateDiceIntegration",
    description: `Update Dice integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateDiceIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateDropboxIntegration",
    alias: "updateDropboxIntegration",
    description: `Update Dropbox clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateDropboxIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateEmailIntegration",
    alias: "updateEmailIntegration",
    description: `Update email alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateEmailIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateEnvoyIntegrationV2",
    alias: "updateEnvoyIntegrationV2",
    description: `Update Envoy badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateEnvoyIntegrationV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateGeneaIntegration",
    alias: "updateGeneaIntegration",
    description: `Update Genea badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateGeneaIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateGoogleIntegrationV2",
    alias: "updateGoogleIntegrationV2",
    description: `Update Google drive clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateGoogleIntegrationV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateGuest",
    alias: "updateGuest",
    description: `Update Guest`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateGuestWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateGuestManagementIntegration",
    alias: "updateGuestManagementIntegration",
    description: `Update Device integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateGuestManagementIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateHaloIntegration",
    alias: "updateHaloIntegration",
    description: `Update Halo Smart Sensor integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateHaloIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateInformacastIntegration",
    alias: "updateInformacastIntegration",
    description: `Update Informacast rules engine integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateInformacastIntegrationRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateIntuifaceIntegration",
    alias: "updateIntuifaceIntegration",
    description: `Update Intuiface integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateIntuifaceIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateKisiIntegration",
    alias: "updateKisiIntegration",
    description: `Update Kisi badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateKisiIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateLumeoIntegration",
    alias: "updateLumeoIntegration",
    description: `Update Lumeo integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateLumeoIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateMattermostIntegration",
    alias: "updateMattermostIntegration",
    description: `Update Mattermost alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateMattermostIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateMicrosoftTeamsIntegrationV2",
    alias: "updateMicrosoftTeamsIntegrationV2",
    description: `Update Microsoft Teams alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateMicrosoftTeamsIntegrationV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateOffice365Integration",
    alias: "updateOffice365Integration",
    description: `Update Office365 Sharepoint clip storage integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateOffice365IntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateOmnialertIntegration",
    alias: "updateOmnialertIntegration",
    description: `Update Omnialert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateOmnialertIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateOpenAIIntegration",
    alias: "updateOpenAIIntegration",
    description: `Update OpenAI integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateOpenAIIntegrationRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateOpenpathIntegration",
    alias: "updateOpenpathIntegration",
    description: `Update Openpath badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateOpenpathIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateOpentechAllianceIntegration",
    alias: "updateOpentechAllianceIntegration",
    description: `Update Opentech Alliance integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateOpentechAllianceIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updatePagerDutyIntegration",
    alias: "updatePagerDutyIntegration",
    description: `Update PagerDuty alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdatePagerDutyIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updatePdkIntegration",
    alias: "updatePdkIntegration",
    description: `Update ProdataKey badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdatePdkIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updatePlaceOsSettings",
    alias: "updatePlaceOsSettings",
    description: `Update PlaceOs badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdatePlaceOsSettingsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateSaltoIntegration",
    alias: "updateSaltoIntegration",
    description: `Update Salto badge integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateSaltoIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateSamlIntegration",
    alias: "updateSamlIntegration",
    description: `Update SAML sign-on integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateSamlIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateServiceNowIntegration",
    alias: "updateServiceNowIntegration",
    description: `Update ServiceNow alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateServiceNowIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateSlackIntegration",
    alias: "updateSlackIntegration",
    description: `Update Slack alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateSlackIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateSlackIntegrationV2",
    alias: "updateSlackIntegrationV2",
    description: `Update Slack alert integration v2`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateSlackIntegrationV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateSquareIntegration",
    alias: "updateSquareIntegration",
    description: `Update Square POS integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateSquareIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateToastIntegration",
    alias: "updateToastIntegration",
    description: `Update Toast integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateToastIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateWebhookIntegration",
    alias: "updateWebhookIntegration",
    description: `Update outbound webhook alert integration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateWebhookIntegrationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/updateWebhookIntegrationV2",
    alias: "updateWebhookIntegrationV2",
    description: `Update preexisting webhooks`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateWebhookIntegrationV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/integrations/validateKisiApiKey",
    alias: "validateKisiApiKey",
    description: `Validate Kisi api key`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ apiKey: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/internal/addPartnerAsSuperAdmin",
    alias: "addPartnerAsSuperAdmin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Internal_AddPartnerAsSuperAdminWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/internal/createOrg",
    alias: "createOrg",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Internal_CreateOrgWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/internal/createPartnerOrg",
    alias: "createPartnerOrg",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Internal_CreatePartnerOrgWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/internal/createSupportAuthority",
    alias: "createSupportAuthority",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Internal_CreateSupportAuthorityWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/internal/getSuperAdminGroupUUID",
    alias: "getSuperAdminGroupUUID",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ orgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/internal/initiateShipment",
    alias: "initiateShipment",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Internal_InitiateShipmentWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/internal/listOrgs",
    alias: "listOrgs",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/invoice/charge",
    alias: "invoiceCharge",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Invoice_InvoiceChargeWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/invoice/chargeV1",
    alias: "invoiceChargeV1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Invoice_InvoiceChargeWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/invoice/details",
    alias: "invoiceDetails",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ invoiceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/invoice/detailsV1",
    alias: "invoiceDetailsV1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ invoiceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/assignDeviceLicense",
    alias: "assignDeviceLicense",
    description: `Assign or unassign a license (Enterprise/Professional) to a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_AssignDeviceLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/assignLicense",
    alias: "assignLicense",
    description: `Assign an add-on license to a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_AssignLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/createACUDoorLicense",
    alias: "createACUDoorLicense",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_CreateACUDoorLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/createAlertMonitoringLicense",
    alias: "createAlertMonitoringLicense",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_CreateAlertMonitoringLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/createDeviceLicense",
    alias: "createDeviceLicense",
    description: `Create a device license (Enterprise/Professional) for an organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_CreateDeviceLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/createLicense",
    alias: "createLicense",
    description: `Create an add-on license for an organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_CreateLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/deleteAlertMonitoringLicense",
    alias: "deleteAlertMonitoringLicense",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_DeleteAlertMonitoringLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/deleteDeviceLicense",
    alias: "deleteDeviceLicense",
    description: `Delete an unassigned license (Enterprise/Professional) from an organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_DeleteDeviceLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/deleteLicense",
    alias: "deleteLicense",
    description: `Delete an unassigned add-on license from an organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_DeleteLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/getACUDoorLicenses",
    alias: "getACUDoorLicenses",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ orgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/getAlertMonitoringLicenses",
    alias: "getAlertMonitoringLicenses",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ orgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/getDeviceLicenses",
    alias: "getDeviceLicenses",
    description: `Get list of licenses (Enterprise/Professional) available in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_GetDeviceLicensesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/getLicenses",
    alias: "getLicenses",
    description: `Get list of add-on licenses available in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_GetLicensesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/license/updateAlertMonitoringLicense",
    alias: "updateAlertMonitoringLicense",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: License_UpdateAlertMonitoringLicenseWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/location/createLocation",
    alias: "createlocation",
    description: `Create a location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Location_CreateLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/location/deleteLocation",
    alias: "deleteLocation",
    description: `Remove a location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/location/geoCode",
    alias: "geoCode",
    description: `Get the latitude and longitude of an address`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ address: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/location/getLocations",
    alias: "getLocations",
    description: `Get list of locations in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/location/getLocationsByGeo",
    alias: "getLocationsByGeo",
    description: `Get list of locations given latitude and longitude`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Location_GetLocationsByGeoRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/location/selectiveUpdateLocation",
    alias: "selectiveUpdateLocation",
    description: `Selectively update a location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Location_SelectiveUpdateLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/location/updateLocation",
    alias: "updateLocation",
    description: `Update a location **NOTE: This will replace old settings meaning if you leave a field blank it will be overrode to blank. For selective field updates use the endpoint /selectiveUpdateLocation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Location_UpdateLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/location/validateLocation",
    alias: "validateLocation",
    description: `Validate a location address for Alarm Monitoring`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ locationUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/logistics/getRMAs",
    alias: "getRMAs",
    description: `Get RMAs`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/logistics/getShipments",
    alias: "getShipments",
    description: `Get shipments`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Logistics_GetShipmentsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/maps/generateMapUrl",
    alias: "generateMapUrl",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ baseUrl: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/metric/logEvents",
    alias: "logEvent",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Metric_LogEventWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/metric/reportError",
    alias: "reportError",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Metric_ReportErrorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/mobile/loginToOrg",
    alias: "loginToOrg",
    description: `Allows a multi-org user on mobile to login to a different org they are able to access.`,
    requestFormat: "text",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Mobile_LoginToOrgRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/mobile/loginVerifiedSupportAuthority",
    alias: "loginVerifiedSupportAuthority",
    description: `Mobile login of partner to client org.`,
    requestFormat: "text",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Mobile_LoginVerifiedSupportAuthorityMobileRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/mobile/logout",
    alias: "logoutMobileUser",
    description: `Ends a mobile session.`,
    requestFormat: "text",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/mobile/updateNotificationToken",
    alias: "updateNotificationToken",
    description: `Updates a mobile notification token for the Console mobile app`,
    requestFormat: "text",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ token: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/mobile/updateRhombusKeyNotificationToken",
    alias: "updateRhombusKeyNotificationToken",
    description: `Updates a mobile notification token for the Rhombus Key mobile app`,
    requestFormat: "text",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ token: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/occupancy/getMinimalOccupancySensorStateList",
    alias: "getMinimalOccupancySensorStateList",
    description: `Get basic state information about all proximity tags in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/occupancy/getOccupancyEventsForSensor",
    alias: "getOccupancyEventsForSensor",
    description: `Get recent events for specified proximity tag`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Occupancysensor_GetOccupancyEventsForSensorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/occupancy/getOccupancyPresenceWindows",
    alias: "getOccupancyPresenceWindows",
    description: `Get stored video information for sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Sensor_GetSensorPresenceWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/occupancy/updateDetails",
    alias: "updateOccupancySensorDetails",
    description: `Update the details of an occupancy sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Occupancysensor_UpdateOccupancySensorDetailsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/claimActivationToken",
    alias: "claimActivationToken",
    description: `Claim activation token for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_ClaimActivationTokenWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/claimShipmentRegistrationToken",
    alias: "claimShipmentRegistrationToken",
    description: `Claim shipment registration token for an organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_ClaimShipmentRegistrationTokenWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/createPendingRegistration",
    alias: "createPendingRegistration",
    description: `Create a pending registration. Registration will be completed when the hardware establishes connectivity`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_CreatePendingRegistrationRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/deleteCloudArchivingConfig",
    alias: "deleteCloudArchivingConfig",
    description: `Delete scoped cloud archiving config.  Note that the priority of scoping is Org &gt; Location &gt; Device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_DeleteCloudArchivingConfigWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/findAllHardwareWithPendingRegistration",
    alias: "findAllHardwareWithPendingRegistration",
    description: `Find all hardware for which a pending registrations exists`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/findHardwareAvailableForPendingRegistration",
    alias: "findHardwareAvailableForPendingRegistration",
    description: `Find hardware for which pending registrations can be created`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/findIfTeamNameAvailable",
    alias: "findIfTeamNameAvailable",
    description: `Get organization team name if it is available`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ teamName: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/findSCIMSettingsForOrg",
    alias: "findSCIMSettingsForOrg",
    description: `Get SCIM configuration for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/generateFederatedSessionToken",
    alias: "generateFederatedSessionToken",
    description: `Generate a federated session token login for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ durationSec: z.number().int().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getAwsIntCloudformationFile",
    alias: "getAwsIntCloudFormationFile",
    description: `Get AWS integration cloudformation file`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getCloudArchivingConfigs",
    alias: "getCloudArchivingConfigs",
    description: `Get scoped cloud archiving configs.  Note that the priority of scoping is Org &gt; Location &gt; Device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getDeviceFlags",
    alias: "getDeviceFlags",
    description: `Get flags for a device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ deviceUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getFeatures",
    alias: "getFeatures",
    description: `Get organization wide features`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getLocationFlags",
    alias: "getLocationFlags",
    description: `Get flags for all locations`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getOrgNotificationTemplate",
    alias: "getOrgNotificationTemplate",
    description: `Get organization&#x27;s default notification schedule template`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getOrgV2",
    alias: "getOrgV2",
    description: `Get details about organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getSAMLSettingsV2",
    alias: "getSAMLSettingsV2",
    description: `Get details about organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getScimDisplayInfo",
    alias: "getScimDisplayInfo",
    description: `Get SCIM display info for organization`,
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/getTemporaryOrgToken",
    alias: "getTemporaryOrgToken",
    description: `Generate a temporary org token for use in OAuth flows`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/peekShipmentRegistrationToken",
    alias: "peekShipmentRegistrationToken",
    description: `Peek at a shipping registration token for an organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ tokenUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/removePendingRegistration",
    alias: "removePendingRegistration",
    description: `Remove a pending registration`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ serialNumber: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/revokeSCIMAccessForOrg",
    alias: "revokeSCIMAccessForOrg",
    description: `Revoke SCIM access for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/setFlag",
    alias: "setOrgFlag",
    description: `Store a flag for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_SetFlagWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/setupSCIMAccessForOrg",
    alias: "setupSCIMAccessForOrg",
    description: `Initially configure SCIM access for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_SetupSCIMAccessForOrgWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updateAiTrainingSettings",
    alias: "updateAiTrainingSettings",
    description: `Update organization AI training settings`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ shareAiTrainingMediaWithRhombus: z.boolean().nullable() })
          .partial()
          .passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updateCloudArchivingConfig",
    alias: "updateCloudArchivingConfig",
    description: `Update scoped cloud archiving config.  Note that the priority of scoping is Org &gt; Location &gt; Device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_UpdateCloudArchivingConfigWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updateFirmwareSettings",
    alias: "updateFirmwareSettings",
    description: `Update organization firmware settings`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_UpdateFirmwareSettingsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updateGeneralSettings",
    alias: "updateGeneralSettings",
    description: `Update organization General settings`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_UpdateGeneralSettingsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updateMFASettings",
    alias: "updateMFASettings",
    description: `Update organization MFA settings`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_UpdateMFASettingsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updateOrgAudioRecordingPolicy",
    alias: "updateOrgAudioRecordingPolicy",
    description: `Update organization audio recording policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ audioRecordingEnabled: z.boolean().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updateOrgNotificationTemplate",
    alias: "updateOrgNotificationTemplate",
    description: `Update default notification schedule template for newly created Users in Org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_UpdateOrgNotificationTemplateWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updatePendingRegistration",
    alias: "updatePendingRegistration",
    description: `Update pending registration for hardware`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_UpdatePendingRegistrationRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updateSAMLSettingsV2",
    alias: "updateSAMLSettingsV2",
    description: `Update organization SAML settings`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_UpdateSAMLSettingsV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/org/updateSCIMSettingsForOrg",
    alias: "updateSCIMSettingsForOrg",
    description: `Update SCIM configuration for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_UpdateSCIMSettingsForOrgWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/createPartnerClient",
    alias: "createPartnerClient",
    description: `Create a client account`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Partner_CreatePartnerClientWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/customizeClient",
    alias: "customizeClient",
    description: `Customize a client account`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Partner_CustomizeClientWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/customizeClientDevice",
    alias: "customizeClientDevice",
    description: `Customize a client device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Partner_CustomizeClientDeviceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/deleteClient",
    alias: "deletePartnerClient",
    description: `Delete a client account`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ clientOrgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getApiTokenApplications",
    alias: "partner_getApiTokenApplications",
    description: `Get details of all open api token requests for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getApiTokens",
    alias: "partner_getApiTokens",
    description: `Get list of all api tokens for a partner`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getClientDevices",
    alias: "getClientDevices",
    description: `Retrieve a list of devices for a specific client.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ orgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getClientRhombusOrgUsersForPartnerActivationTokenV2",
    alias: "getClientRhombusOrgUsersForPartnerActivationTokenV2",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ token: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getClients",
    alias: "getPartnerClients",
    description: `Get a list of all client accounts`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getClientStatusMap",
    alias: "getPartnerClientsStatusMap",
    description: `Get a map of all client accounts to device and location info`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getClientSummaryInfo",
    alias: "getClientSummaryInfo",
    description: `Get information about a client`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ clientOrgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getClientsV2",
    alias: "getPartnerClientsV2",
    description: `Get a list of all client accounts. NOTICE: This is the same as getPartnerClients, but only returns the basic info so partners can login to clients quickly. The other info will be returned by getPartnerClientsStatusMap.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getDeviceLicensesForOrg",
    alias: "getDeviceLicensesForOrg",
    description: `Get a list of licenses available for a client organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ orgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getLicensesForOrg",
    alias: "getLicensesForOrg",
    description: `Get a list of licenses available for a client organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ orgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getListOfAllClientDevices",
    alias: "getListOfAllClientDevices",
    description: `Retrieve list of all devices registered across all clients`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getListOfAvailableHardware",
    alias: "getListOfControlledHardware",
    description: `Retrieve a list of hardware available for remote registration. Any hardware originally registered by a Partner is available for re-registration after being removed from an active client account.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getPartnerClientMobileAccountAccess",
    alias: "getPartnerClientMobileAccountAccess",
    description: `Get client mobile account access as partner`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Partner_GetPartnerClientMobileAccountAccessRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/getShipments",
    alias: "PartnerGetShipments",
    description: `Get client shipments`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Partner_GetShipmentsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/grantSupportAccessToClient",
    alias: "grantSupportAccessToClient",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ clientOrgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/reassignDeviceOrg",
    alias: "reassignDeviceOrg",
    description: `Reassign device(s) to a different organization. Only devices which hardware is controlled by the partner can be reassigned`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Partner_ReassignDeviceOrgWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/registerCameraToClient",
    alias: "registerCameraToClient",
    description: `Register a controlled camera to a client`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Org_CreatePendingRegistrationRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/registerDeal",
    alias: "registerDeal",
    description: `Register a deal`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Partner_RegisterDealWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/requestAccessToClientAccountV2",
    alias: "requestAccessToClientAccountV2",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ clientEmail: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/revokeApiToken",
    alias: "partner_revokeApiToken",
    description: `Remove an api token from organization. Note: this is irreversible`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ tokenUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/submitApiTokenApplication",
    alias: "partner_submitApiTokenApplication",
    description: `Request a partner api token for 1 or more organizations`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_SubmitApiTokenApplicationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/submitSupportAccessDecisionForPartnerActivationTokenV2",
    alias: "submitSupportAccessDecisionForPartnerActivationTokenV2",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/partner/updateApiToken",
    alias: "partner_updateApiToken",
    description: `Update display name and permissions of an api token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_UpdateApiTokenWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/password/forgot",
    alias: "forgotPassword",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Password_ForgotPasswordWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/password/reset",
    alias: "resetPassword",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Password_ResetPasswordWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/password/user/signup",
    alias: "userSignup",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Password_UserSignupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/createPartnerPermissionGroup",
    alias: "createPartnerPermissionGroup",
    description: `Create a permission group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Permission_CreatePartnerPermissionGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/createPermissionGroup",
    alias: "createPermissionGroup",
    description: `Create a permission group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Permission_CreatePermissionGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/deletePartnerPermissionGroup",
    alias: "deletePartnerPermissionGroup",
    description: `Delete a permission group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ groupUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/deletePermissionGroup",
    alias: "deletePermissionGroup",
    description: `Delete a permission group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ groupUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/getPartnerPermissionGroups",
    alias: "getPartnerPermissionGroups",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/getPermissionGroups",
    alias: "getPermissionGroups",
    description: `Get details about all permission groups in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/getPermissionGroupsForOrg",
    alias: "getPermissionGroupsForOrg",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ orgUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/getPermissionsForCurrentPartner",
    alias: "getPermissionsForCurrentPartner",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/getPermissionsForCurrentUser",
    alias: "getPermissionsForCurrentUser",
    description: `Get device and functionality permissions for user or API token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/updatePartnerPermissionGroup",
    alias: "updatePartnerPermissionGroup",
    description: `Update a partner permission group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Permission_UpdatePartnerPermissionGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/permission/updatePermissionGroup",
    alias: "updatePermissionGroup",
    description: `Update a permission group`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Permission_UpdatePermissionGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createAccessControlledDoorPolicy",
    alias: "createAccessControlledDoorPolicy",
    description: `Create a policy to be assigned to a access controlled door`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreateAccessControlledDoorPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createAudioPolicy",
    alias: "createAudioPolicy",
    description: `Create a policy to be assigned to audio gateways`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreateAudioPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createCameraPolicy",
    alias: "createCameraPolicy",
    description: `Create a policy to be assigned to cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreateCameraPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createClimatePolicy",
    alias: "createClimatePolicy",
    description: `Create a policy to be assigned to a climate sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreateClimatePolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createDoorPolicy",
    alias: "createDoorPolicy",
    description: `Create a policy to be assigned to a door sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreateDoorPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createOccupancyPolicy",
    alias: "createOccupancyPolicy",
    description: `Create a policy to be assigned to a occupancy sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreateOccupancyPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createPolicyAddendumForLocation",
    alias: "createPolicyAddendumForLocation",
    description: `Create policy addendum for location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreatePolicyAddendumForLocationRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createPolicyAddendumsForDevices",
    alias: "createPolicyAddendumsForDevices",
    description: `Create policy addendums for devices`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreatePolicyAddendumsForDevicesRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createProximityPolicy",
    alias: "createProximityPolicy",
    description: `Create a policy to be assigned to an asset tag`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreateProximityPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/createSchedule",
    alias: "createSchedule",
    description: `Create a schedule to be used for policy creation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_CreateScheduleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteAccessControlledDoorPolicy",
    alias: "deleteAccessControlledDoorPolicy",
    description: `Delete an access controlled door policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ policyUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteAudioPolicy",
    alias: "deleteAudioPolicy",
    description: `Delete a audio gateway policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ policyUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteCameraPolicy",
    alias: "deleteCameraPolicy",
    description: `Delete a camera policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ policyUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteClimatePolicy",
    alias: "deleteClimatePolicy",
    description: `Delete a climate policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ policyUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteDevicePolicyAddendums",
    alias: "deleteDevicePolicyAddendums",
    description: `Delete a policy addendums`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_DeleteDevicePolicyAddendumsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteDoorPolicy",
    alias: "deleteDoorPolicy",
    description: `Delete a door sensor policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ policyUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteLocationPolicyAddendum",
    alias: "deleteLocationPolicyAddendum",
    description: `Delete a policy addendums`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteOccupancyPolicy",
    alias: "deleteOccupancyPolicy",
    description: `Delete an Occupancy policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ policyUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deletePolicyPauseSettingForDevice",
    alias: "deletePolicyPauseSettingForDevice",
    description: `Delete a policy pause setting for a device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deletePolicyPauseSettingForLocation",
    alias: "deletePolicyPauseSettingForLocation",
    description: `Delete a policy pause setting for a location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteProximityPolicy",
    alias: "deleteProximityPolicy",
    description: `Delete an asset tag policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ policyUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/deleteSchedule",
    alias: "deleteSchedule",
    description: `Delete a schedule used for policy creation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ scheduleUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/findSchedules",
    alias: "findSchedules",
    description: `Find all schedules in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getAccessControlledDoorPolicies",
    alias: "getAccessControlledDoorPolicies",
    description: `Get details about all access controlled door policies in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getAudioPolicies",
    alias: "getAudioPolicies",
    description: `Get details about all audio gateway policies in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getCameraPolicies",
    alias: "getCameraPolicies",
    description: `Get details about all camera policies in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getClimatePolicies",
    alias: "getClimatePolicies",
    description: `Get details about all climate policies in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getDoorPolicies",
    alias: "getDoorPolicies",
    description: `Get details about all door sensor policies in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getOccupancyPolicies",
    alias: "getOccupancyPolicies",
    description: `Get details about all occupancy policies in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getPoliciesUsingSchedule",
    alias: "getPoliciesUsingSchedule",
    description: `Get details about all climate policies in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ scheduleUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getPolicyAddendums",
    alias: "getPolicyAddendums",
    description: `Get the current and planned policy alert addendums`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getPolicyPauseSettings",
    alias: "getPolicyPauseSettings",
    description: `Get the current and planned policy alert pause details`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/getProximityPolicies",
    alias: "getProximityPolicies",
    description: `Get details about all asset tag policies in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/pauseAlertPolicyForDevice",
    alias: "pauseAlertPolicyForDevice",
    description: `Pause alert policy policy for for device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_PauseAlertPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/pauseAlertPolicyForLocation",
    alias: "pauseAlertPolicyForLocation",
    description: `Pause alert policy policy for for location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_PauseAlertPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/updateAccessControlledDoorPolicy",
    alias: "updateAccessControlledDoorPolicy",
    description: `Update an access controlled door policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_UpdateAccessControlledDoorPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/updateAudioPolicy",
    alias: "updateAudioPolicy",
    description: `Update a audio gateway policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_UpdateAudioPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/updateCameraPolicy",
    alias: "updateCameraPolicy",
    description: `Update a camera policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_UpdateCameraPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/updateClimatePolicy",
    alias: "updateClimatePolicy",
    description: `Update a climate policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_UpdateClimatePolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/updateDoorPolicy",
    alias: "updateDoorPolicy",
    description: `Update a door sensor policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_UpdateDoorPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/updateOccupancyPolicy",
    alias: "updateOccupancyPolicy",
    description: `Update an occupancy policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_UpdateOccupancyPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/updateProximityPolicy",
    alias: "updateProximityPolicy",
    description: `Update an asset tag policy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_UpdateProximityPolicyWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/policy/updateSchedule",
    alias: "updateSchedule",
    description: `Update a schedule to be used for policy creation`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Policy_UpdateScheduleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/proximity/getLocomotionEventsForTag",
    alias: "getLocomotionEventsForTag",
    description: `Get locomotion events for specified proximity tag`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Proximity_GetLocomotionEventsForTagWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/proximity/getMinimalProximityStateList",
    alias: "getMinimalProximityStateList",
    description: `Get basic state information about all proximity tags in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/proximity/getProximityEventsForTag",
    alias: "getProximityEventsForTags",
    description: `Get recent events for specified proximity tag`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Proximity_GetProximityEventsForTagWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/proximity/updateDetails",
    alias: "updateProximitySensorDetails",
    description: `Update details for a proximity tag`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Proximity_UpdateProximitySensorDetailsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getAuditFeed",
    alias: "getAuditFeed",
    description: `Get the latest audit logs for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetAuditFeedWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getAverageReport",
    alias: "getAverageReport",
    description: `Get the average report if it is available for the specified count report`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetAverageReportWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getAverageReports",
    alias: "getAverageReports",
    description: `Get the average reports if they are available for the specified count report`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetAverageReportsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getCountReports",
    alias: "getCountReports",
    description: `Get multiple specified count reports`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetCountReportsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getCountReportV2",
    alias: "getCountReportV2",
    description: `Get the specified count reports`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetCountReportV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getDiagnosticFeed",
    alias: "getDiagnosticFeed",
    description: `Get the latest diagnostic logs for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetDiagnosticFeedWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getEnvoyDeliveries",
    alias: "getEnvoyDeliveries",
    description: `Get a list of deliveries from Envoy to populate reporting logs`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GetEnvoyDeliveriesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getEnvoyEmployees",
    alias: "getEnvoyEmployees",
    description: `Get a list of employees from Envoy`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GetEnvoyEmployeesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getEnvoyLocations",
    alias: "getEnvoyLocations",
    description: `Get list of Envoy locations`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getEnvoyVisitors",
    alias: "getEnvoyVisitors",
    description: `Get a list of visitors from Envoy to populate reporting logs`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Integration_GetEnvoyVisitorsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getFacesByDevice",
    alias: "getFacesByDevice",
    description: `Get face counting events for a specified camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetFacesByDeviceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getFacesByLocation",
    alias: "getFacesByLocation",
    description: `Get face counting events for a specified location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetFacesByLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getLicensePlatesByDevice",
    alias: "getLicensePlatesByDevice",
    description: `Get license plate counting events for a specified camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetLicensePlatesByDeviceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getMostRecentPeopleCountEvents",
    alias: "getMostRecentPeopleCountEvents",
    description: `Get the X most recent people counting events for a specified device`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetMostRecentPeopleCountWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getProximityTagLocationsByDate",
    alias: "getProximityTagLocationsByDate",
    description: `Get proximity tag locations by date`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetProximityTagLocationsByDateWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getRunningAverage",
    alias: "getRunningAverage",
    description: `Get the running average for the specified count report if it is available, based on recent data`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetRunningAverageWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getSummaryCountReport",
    alias: "getSummaryCountReport",
    description: `Get a summary report for a camera, location, or organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetSummaryCountReportWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getThresholdCrossingCounts",
    alias: "getThresholdCrossingCounts",
    description: `Get the occupancy counts from threshold crossing for a group of cameras over a period of time`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetThresholdCrossingCountsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getThresholdCrossingEvents",
    alias: "getThresholdCrossingEvents",
    description: `Get the raw threshold crossing events for a group of cameras over a period of time`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_GetThresholdCrossingEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/getToastEventsTable",
    alias: "getToastEventsTable",
    description: `Get list of Toast orders to populate events table`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ businessDate: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/report/resetRunningAverage",
    alias: "resetRunningAverage",
    description: `Reset the running average for the specified count report`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Report_ResetRunningAverageWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rules/createRule",
    alias: "createRule",
    description: `Create a rule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Rules_CreateRuleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rules/deleteRule",
    alias: "deleteRule",
    description: `Delete a rule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ ruleUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rules/deleteRulePauseSetting",
    alias: "deleteRulePauseSetting",
    description: `Delete a rule pause setting`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rules/getRulePauseSettings",
    alias: "getRulePauseSettings",
    description: `Get the current and planned rule pause details`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rules/getRulesFiltered",
    alias: "getRulesFiltered",
    description: `Get rules with Uuid and Type filtering`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Rules_records_GetRulesFilteredWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rules/getRulesForOrg",
    alias: "getRulesForOrg",
    description: `List rules for org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rules/pauseRule",
    alias: "pauseRule",
    description: `Pause rule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Rules_PauseRuleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rules/updateRule",
    alias: "updateRule",
    description: `Update a rule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Rules_UpdateRuleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rulesRecords/deleteRulesEventRecord",
    alias: "deleteRulesEventRecord",
    description: `Delete a rules event historical record`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rulesRecords/getLatestRulesEventRecords",
    alias: "getLatestRulesEventRecords",
    description: `Get N latest rules event historical records`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Rules_records_GetLatestRulesEventRecordsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/rulesRecords/getRulesEventRecords",
    alias: "getRulesEventRecords",
    description: `Find rules event historical records`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Rules_records_GetRulesEventRecordsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/createAbsoluteSchedule",
    alias: "createAbsoluteSchedule",
    description: `Create a absolute schedule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Schedule_CreateAbsoluteScheduleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/createRelativeDateTimeIntervalsSchedule",
    alias: "createRelativeDateTimeIntervalsSchedule",
    description: `Create a one-time relative datetime schedule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Schedule_CreateRelativeDateTimeIntervalsScheduleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/createRelativeSchedule",
    alias: "createRelativeSchedule",
    description: `Create a realtime relative schedule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Schedule_CreateRelativeScheduleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/createWeeklySchedule",
    alias: "createWeeklySchedule",
    description: `Create a weekly schedule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Schedule_CreateWeeklyScheduleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/deleteSchedule",
    alias: "deleteScheduleV2",
    description: `Delete a schedule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ scheduleUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/findAbsoluteSchedule",
    alias: "findAbsoluteSchedule",
    description: `Find an absolute schedule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/findRelativeDateTimeIntervalsSchedule",
    alias: "findRelativeDateTimeIntervalsSchedule",
    description: `Find a one-time relative datetime schedule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/findRelativeSchedule",
    alias: "findRelativeSchedule",
    description: `Find a relative schedule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/findWeeklySchedule",
    alias: "findWeeklySchedule",
    description: `Find a weekly schedule`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/schedule/getSchedules",
    alias: "getSchedules",
    description: `Get schedules in org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/search/searchObjectsByColor",
    alias: "searchObjectsByColor",
    description: `Search for objects by color`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Search_SearchObjectsByColorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/sensors/getFootageSensorSeekpointsForCamera",
    alias: "getFootageSensorSeekpointsForCamera",
    description: `Get sensor activity seekpoints for camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Sensor_GetFootageSensorSeekpointsForCameraWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/sensors/getFootageSensorSeekpointsForLocation",
    alias: "getFootageSensorSeekpointsForLocation",
    description: `Get sensor activity seekpoints for a location`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Sensor_GetFootageSensorSeekpointsForLocationWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/sensors/getFootageSensorSeekpointsForSensor",
    alias: "getFootageSensorSeekpointsForSensor",
    description: `Get sensor activity seekpoints for a sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Sensor_GetFootageSensorSeekpointsForSensorWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/camera/getCurrentState",
    alias: "getCurrentState",
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/camera/getFootageBoundingBoxes",
    alias: "getSharedFootageBoundingBoxes",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Share_GetSharedFootageBoundingBoxesWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/camera/getFootageSeekpointsV2",
    alias: "getSharedFootageSeekpointsV2",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Share_GetSharedFootageSeekpointsV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/camera/getMediaUris",
    alias: "getMediaUris",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/camera/getPresenceWindows",
    alias: "getSharedPresenceWindows",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Share_GetSharedPresenceWindowsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/camera/getSharedVideoWallMediaUris",
    alias: "getSharedVideoWallMediaUris",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/clips/getSharedClipData",
    alias: "getSharedClipData",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/face/getFacesV2",
    alias: "getSharedFacesV2",
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/getSharedLiveStreamInfo",
    alias: "getSharedLiveStreamInfo",
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/getSharedVideoWallInfo",
    alias: "getSharedVideoWallInfo",
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/sensors/getFootageSensorSeekpointsForCamera",
    alias: "getSharedFootageSensorSeekpointsForCamera",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Share_GetSharedFootageSensorSeekpointsForCameraWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/shareLink",
    alias: "shareLink",
    description: `Send an email or sms message containing the shared media link`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Share_ShareLinkWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/share/timelapse/getSharedTimelapseClipDataV2",
    alias: "getSharedTimelapseClipDataV2",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/supportAuthority/addSupportAuthority",
    alias: "addSupportAuthority",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Support_AddSupportAuthorityWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/supportAuthority/allowSupportAuthorityAccess",
    alias: "allowSupportAuthorityAccess",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ authorityUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/supportAuthority/findSupportAuthoritySessions",
    alias: "findSupportAuthoritySessions",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ authorityUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/supportAuthority/getSupportAuthorities",
    alias: "getSupportAuthorities",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/supportAuthority/logoutAllSupportAuthoritySessions",
    alias: "logoutAllSupportAuthoritySessions",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ authorityUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/supportAuthority/lookupSupportPartnerAuthorities",
    alias: "lookupSupportPartnerAuthorities",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ lookupKeyword: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/supportAuthority/removeSupportAuthority",
    alias: "removeSupportAuthority",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ authorityUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/supportAuthority/revokeSupportAuthorityAccess",
    alias: "revokeSupportAuthorityAccess",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ authorityUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/supportAuthority/updateSupportAuthority",
    alias: "updateSupportAuthority",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Support_UpdateSupportAuthorityWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/tvos/getTvOsConfig",
    alias: "getTvOsConfig",
    description: `get specific tvOs config`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/tvos/getTvOsConfigsForOrg",
    alias: "getTvOsConfigsForOrg",
    description: `get tvOs configs for org`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/tvos/updateTvOsConfig",
    alias: "updateTvOsConfig",
    description: `Update tvOs config`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Tvos_UpdateTvOsConfigWsRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/upload/accessControlledDoor/:accessControlledDoorUuidStr",
    alias: "uploadAccessControlledDoorPicture",
    description: `Upload an image of the specified AccessControlledDoor`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormDataMultiPart,
      },
      {
        name: "accessControlledDoorUuidStr",
        type: "Path",
        schema: z.string().nullable(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/upload/errors/:fileName",
    alias: "uploadErrors",
    description: `Upload error logs`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormDataMultiPart,
      },
      {
        name: "fileName",
        type: "Path",
        schema: z.string().nullable(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/upload/faces",
    alias: "uploadFaces",
    description: `Upload and index a face for facial recognition`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        description: `multipart/form-data with .jpg file`,
        type: "Body",
        schema: FormDataMultiPart,
      },
      {
        name: "transaction",
        type: "Query",
        schema: z.string().nullish(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/upload/floorplan",
    alias: "uploadFloorPlan",
    description: `Upload a new floorplan for a location`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormDataMultiPart,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/upload/floorplan/:floorPlanUuid",
    alias: "updateFloorPlan",
    description: `Update an existing floorplan for a location`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormDataMultiPart,
      },
      {
        name: "floorPlanUuid",
        type: "Path",
        schema: z.string().nullable(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/upload/sensor/:sensorUuid/thumbnail",
    alias: "uploadSensorThumbnails",
    description: `Upload an image to be associated with a sensor`,
    requestFormat: "json",
    parameters: [
      {
        name: "sensorUuid",
        type: "Path",
        schema: z.string().nullable(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/upload/user/:userUuidStr",
    alias: "uploadUserProfilePicture",
    description: `Upload user profile picture`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FormDataMultiPart,
      },
      {
        name: "userUuidStr",
        type: "Path",
        schema: z.string().nullable(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/upload/user/deleteProfile/:userUuidStr",
    alias: "deleteUserProfilePicture",
    description: `Delete user profile picture`,
    requestFormat: "json",
    parameters: [
      {
        name: "userUuidStr",
        type: "Path",
        schema: z.string().nullable(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/changePassword",
    alias: "changePassword",
    description: `Change a user&#x27;s password`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: User_ChangeUserPasswordWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/createUser",
    alias: "createUser",
    description: `Create a user for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: User_CreateUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/deleteUser",
    alias: "deleteUser",
    description: `Delete a user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ userUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/deleteVirtualMfaDeviceForCurrentUser",
    alias: "deleteVirtualMfaDeviceForCurrentUser",
    description: `Remove MFA for current user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/getImportUsersFormat",
    alias: "getImportUsersFormat",
    description: `Returns format for importing users.`,
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/getPartnerUsersInOrg",
    alias: "getPartnerUsersInOrg",
    description: `Get list of all partners in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/getRhombusKeyConfigForUser",
    alias: "getRhombusKeyConfigForUser",
    description: `Retrieve the RhombusKey mobile app config for a user. If it does not exist a default one is created and returned.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ userUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/getUserCustomizationFlags",
    alias: "getUserCustomizationFlags",
    description: `Get user&#x27;s customization flags`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ userUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/getUsersInOrg",
    alias: "getUsersInOrg",
    description: `Get list of all users in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/getVirtualMfaDeviceForCurrentUser",
    alias: "getVirtualMfaDeviceForCurrentUser",
    description: `Get details about MFA for current user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/importUsers",
    alias: "importUsers",
    description: `Imports users in csv format`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ file: z.object({}).partial().passthrough().nullable() })
          .partial()
          .passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/sendMobileDownloadSMS",
    alias: "sendMobileDownloadSMS",
    description: `Send SMS with link to download mobile app`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ phoneNumber: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/sendPartnerAccessGranted",
    alias: "sendPartnerAccessGrantedEmail",
    description: `Send partner an email to access client account`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: User_SendPartnerAccessGrantedEmailWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/sendRhombusKeyUserWelcomeEmail",
    alias: "sendRhombusKeyUserWelcomeEmail",
    description: `Send a rhombus key welcome email to a user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ userUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/sendUserWelcomeEmail",
    alias: "sendUserWelcomeEmail",
    description: `Send a welcome email to a user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ userUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/setupVirtualMfaDeviceForCurrentUser",
    alias: "setupVirtualMfaDeviceForCurrentUser",
    description: `Configure MFA for current user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/updatePartnerUser",
    alias: "updatePartnerUser",
    description: `Update a partner&#x27;s details`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: User_UpdatePartnerWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/updateRhombusKeySettingsForUser",
    alias: "updateRhombusKeySettingsForUser",
    description: `Update the RhombusKey mobile app settings for the user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: User_UpdateRhombusKeySettingsForUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/updateUser",
    alias: "updateUser",
    description: `Update a user&#x27;s details`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: User_UpdateUserWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/user/updateUserCustomizationFlags",
    alias: "updateUserCustomizationFlags",
    description: `Update user&#x27;s customization flags`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: User_UpdateUserCustomizationFlagsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/vehicle/addVehicleLabel",
    alias: "addVehicleLabel",
    description: `Add a label to a vehicle`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Vehicle_AddVehicleLabelWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/vehicle/associateEventsToVehicle",
    alias: "associateEventsToVehicle",
    description: `Associate vehicle events to a saved vehicle`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Vehicle_AssociateEventsToVehicleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/vehicle/deleteVehicle",
    alias: "deleteVehicle",
    description: `Delete a saved vehicle`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ vehicleLicensePlate: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/vehicle/getVehicleEvents",
    alias: "getVehicleEvents",
    description: `Get vehicle events with filters and additive queries`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Vehicle_GetVehicleEventsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/vehicle/getVehicleLabelsForOrg",
    alias: "getVehicleLabelsForOrg",
    description: `Get all vehicle labels for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/vehicle/getVehicles",
    alias: "getVehicles",
    description: `Get details of all saved vehicles in organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/vehicle/removeVehicleLabel",
    alias: "removeVehicleLabel",
    description: `Remove a label to a vehicle`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Vehicle_RemoveVehicleLabelWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/vehicle/reportVehicleEvent",
    alias: "reportVehicleEvent",
    description: `Report a mis-detected license plate event.  This sends the image/clip to Rhombus to better train AI models and removes the event`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ eventUuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/vehicle/saveVehicle",
    alias: "saveVehicle",
    description: `Name and save a vehicle based on license plate number`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Vehicle_SaveVehicleWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/cancelSpliceV2",
    alias: "cancelSpliceV2",
    description: `Cancel a spliced clip request`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_CancelSpliceV2WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/createSharedTimelapseGroup",
    alias: "createSharedTimelapseGroup",
    description: `Share multiple timelapses in one link`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_CreateSharedTimelapseGroupWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/deleteSharedTimelapseGroup",
    alias: "deleteSharedTimelapseGroup",
    description: `Delete a shared timelapse link`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ uuid: z.string().nullable() }).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/deleteTimelapseClips",
    alias: "deleteTimelapseClips",
    description: `Delete a timelapse`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_DeleteTimelapseClipsWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/generateTimelapseClip",
    alias: "generateTimelapseClip",
    description: `Generate a timelapse`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_GenerateTimelapseClipWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/getExactFrameUri",
    alias: "getExactFrameUri",
    description: `Generate URL to get an exact frame with optional crop from a camera`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_GetExactFrameUriWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/getMaxSpliceDuration",
    alias: "getMaxSpliceDuration",
    description: `Get the max splice duration an organization can set`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/getSharedTimelapseGroups",
    alias: "getSharedTimelapseGroups",
    description: `Get details of all shared timelapse links for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/getSplicedClipsInProgress",
    alias: "getSplicedClipsInProgress",
    description: `Get all spliced clips in progress`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/getTimelapseClips",
    alias: "getTimelapseClips",
    description: `Get all timelapse clips for organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/getTimelapseMetadata",
    alias: "getTimelapseMetadata",
    description: `Get information about earliest available timelapse images for cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_GetTimelapseMetadataWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/retrySplice",
    alias: "retrySplice",
    description: `Send a request to retry splicing a clip`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_RetrySpliceWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/spliceFrame",
    alias: "spliceFrame",
    description: `Send a request to create a single image from a point in time`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_SpliceFrameWSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/spliceV3",
    alias: "spliceV3",
    description: `Send a request to create an arbitrary clip for multiple cameras`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_SpliceV3WSRequest,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/video/updateSharedTimelapseGroup",
    alias: "updateSharedTimelapseGroup",
    description: `Update title, description, or expiration on a shared timelapse link`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: Video_UpdateSharedTimelapseGroupWSRequest,
      },
    ],
    response: z.void(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
