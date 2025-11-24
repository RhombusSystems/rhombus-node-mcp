import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

// Auto-generated from OpenAPI spec
// Some complex schemas may need manual adjustment

const BodyPart: z.ZodObject<any> = z.object({
  contentDisposition: z.lazy(() => ContentDisposition).optional(),
  entity: z.record(z.unknown()).optional(),
  headers: z.object({
  empty: z.boolean().optional()
}).optional(),
  mediaType: z.lazy(() => MediaType).optional(),
  messageBodyWorkers: z.lazy(() => MessageBodyWorkers).optional(),
  parameterizedHeaders: z.object({
  empty: z.boolean().optional()
}).optional(),
  parent: z.lazy(() => MultiPart).optional(),
  providers: z.lazy(() => Providers).optional()
});
const MultiPart: z.ZodObject<any> = z.object({
  bodyParts: z.array(BodyPart).optional(),
  contentDisposition: z.lazy(() => ContentDisposition).optional(),
  entity: z.record(z.unknown()).optional(),
  headers: z.object({
  empty: z.boolean().optional()
}).optional(),
  mediaType: z.lazy(() => MediaType).optional(),
  messageBodyWorkers: z.lazy(() => MessageBodyWorkers).optional(),
  parameterizedHeaders: z.object({
  empty: z.boolean().optional()
}).optional(),
  providers: z.lazy(() => Providers).optional()
});
const LocationType: z.ZodObject<any> = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  countryCode: z.string().optional(),
  floorPlans: z.array(z.lazy(() => FloorPlanType)).optional(),
  labels: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  postalCode: z.string().optional(),
  qualifiedAddress: z.lazy(() => QualifiedAddressType).optional(),
  subLocations: z.array(z.lazy(() => LocationType)).optional(),
  tz: z.string().optional(),
  uuid: z.string().optional()
});
const ACUDoorCatalogItem: z.ZodObject<any> = z.object({
  durationMonths: z.number().int().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional()
});
const ACUDoorLicenseType: z.ZodObject<any> = z.object({
  claimKeyUuid: z.string().optional(),
  createdOn: z.string().datetime({ offset: true }).optional(),
  doorUuid: z.string().optional(),
  firstAssignedDate: z.string().datetime({ offset: true }).optional(),
  licenseToUnassignEmailState: z.string().optional(),
  maxDeleteDate: z.string().datetime({ offset: true }).optional(),
  orgUuid: z.string().optional(),
  priorClaimKeyUuid: z.string().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional(),
  state: z.string().optional(),
  trial: z.boolean().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional()
});
const ShippedItemType: z.ZodObject<any> = z.object({
  partNumber: z.string().optional(),
  quantityShipped: z.number().int().optional(),
  serialNumber: z.string().optional()
});
const AITShipmentInfoType: z.ZodObject<any> = z.object({
  aitTrackingNumber: z.string().optional(),
  carrierTrackingNumber: z.string().optional(),
  depositorOrderNumber: z.string().optional(),
  destinationAddress: z.string().optional(),
  isIngramDistributorShipment: z.boolean().optional(),
  shipmentDate: z.string().datetime({ offset: true }).optional(),
  shippedItems: z.array(ShippedItemType).optional()
});
const AMSirenSettingsType: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional(),
  durationSeconds: z.number().int().optional(),
  playCount: z.number().int().optional()
});
const AbsoluteSecondsIntervalType: z.ZodObject<any> = z.object({
  b: z.number().int().optional(),
  e: z.number().int().optional()
});
const AbsoluteSecondsScheduleType: z.ZodObject<any> = z.object({
  mutable: z.boolean().optional(),
  name: z.string().optional(),
  oneTimeUse: z.boolean().optional(),
  orgUuid: z.string().optional(),
  strategy: z.string().optional(),
  uuid: z.string().optional()
});
const AccessControlAuthenticationResultEnumType = z.string();
const AccessControlAuthorizationResultEnumType = z.string();
const AccessControlCredentialEnumType = z.string();
const AccessControlCredentialWorkflowStatusEnumType = z.string();
const StandardCsnType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  lastUsedAccessControlledDoorUuid: z.string().optional(),
  lastUsedAtMillis: z.number().int().optional(),
  lastUsedLocationUuid: z.string().optional(),
  lowercaseHexValue: z.string().optional(),
  managedCredUuid: z.string().optional(),
  note: z.string().optional(),
  orgUuid: z.string().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  type: AccessControlCredentialEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  value: z.string().optional(),
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType.optional()
});
const SecureTokenAlgorithm = z.string();
const RhombusSecureCsnType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  lastUsedAccessControlledDoorUuid: z.string().optional(),
  lastUsedAtMillis: z.number().int().optional(),
  lastUsedLocationUuid: z.string().optional(),
  lowercaseHexValue: z.string().optional(),
  managedCredUuid: z.string().optional(),
  note: z.string().optional(),
  orgUuid: z.string().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  type: AccessControlCredentialEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  value: z.string().optional(),
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType.optional()
});
const RhombusSecureMobileFeatureSettingStatus = z.string();
const RhombusSecureMobileFeatureSetting: z.ZodObject<any> = z.object({
  name: z.string().optional(),
  status: RhombusSecureMobileFeatureSettingStatus.optional(),
  value: z.string().optional()
});
const RhombusSecureMobileFeatureStatus = z.string();
const RhombusSecureMobileFeature: z.ZodObject<any> = z.object({
  settings: z.array(RhombusSecureMobileFeatureSetting).optional(),
  status: RhombusSecureMobileFeatureStatus.optional()
});
const MobileTokenOSEnum = z.string();
const RhombusSecureMobileType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  lastUsedAccessControlledDoorUuid: z.string().optional(),
  lastUsedAtMillis: z.number().int().optional(),
  lastUsedLocationUuid: z.string().optional(),
  lowercaseHexValue: z.string().optional(),
  managedCredUuid: z.string().optional(),
  note: z.string().optional(),
  orgUuid: z.string().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  type: AccessControlCredentialEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  value: z.string().optional(),
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType.optional()
});
const PinCredential: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  lastUsedAccessControlledDoorUuid: z.string().optional(),
  lastUsedAtMillis: z.number().int().optional(),
  lastUsedLocationUuid: z.string().optional(),
  lowercaseHexValue: z.string().optional(),
  managedCredUuid: z.string().optional(),
  note: z.string().optional(),
  orgUuid: z.string().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  type: AccessControlCredentialEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  value: z.string().optional(),
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType.optional()
});
const WiegandFormatEnumType = z.string();
const WiegandH10301CredentialType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  lastUsedAccessControlledDoorUuid: z.string().optional(),
  lastUsedAtMillis: z.number().int().optional(),
  lastUsedLocationUuid: z.string().optional(),
  lowercaseHexValue: z.string().optional(),
  managedCredUuid: z.string().optional(),
  note: z.string().optional(),
  orgUuid: z.string().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  type: AccessControlCredentialEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  value: z.string().optional(),
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType.optional()
});
const WiegandH10304Credential: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  lastUsedAccessControlledDoorUuid: z.string().optional(),
  lastUsedAtMillis: z.number().int().optional(),
  lastUsedLocationUuid: z.string().optional(),
  lowercaseHexValue: z.string().optional(),
  managedCredUuid: z.string().optional(),
  note: z.string().optional(),
  orgUuid: z.string().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  type: AccessControlCredentialEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  value: z.string().optional(),
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType.optional()
});
const WiegandD10202Credential: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  lastUsedAccessControlledDoorUuid: z.string().optional(),
  lastUsedAtMillis: z.number().int().optional(),
  lastUsedLocationUuid: z.string().optional(),
  lowercaseHexValue: z.string().optional(),
  managedCredUuid: z.string().optional(),
  note: z.string().optional(),
  orgUuid: z.string().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  type: AccessControlCredentialEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  value: z.string().optional(),
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType.optional()
});
const Wiegand64BitRawCredentialType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  lastUsedAccessControlledDoorUuid: z.string().optional(),
  lastUsedAtMillis: z.number().int().optional(),
  lastUsedLocationUuid: z.string().optional(),
  lowercaseHexValue: z.string().optional(),
  managedCredUuid: z.string().optional(),
  note: z.string().optional(),
  orgUuid: z.string().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  type: AccessControlCredentialEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  value: z.string().optional(),
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType.optional()
});
const AccessControlCredentialType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  lastUsedAccessControlledDoorUuid: z.string().optional(),
  lastUsedAtMillis: z.number().int().optional(),
  lastUsedLocationUuid: z.string().optional(),
  lowercaseHexValue: z.string().optional(),
  managedCredUuid: z.string().optional(),
  note: z.string().optional(),
  orgUuid: z.string().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  type: AccessControlCredentialEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  value: z.string().optional(),
  workflowStatus: AccessControlCredentialWorkflowStatusEnumType.optional()
});
const ComponentEventEnumType = z.string();
const AccessControlUnitBatteryStateChangeEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const FirstInFirmwareStatus = z.string();
const EventOriginatorEnum = z.string();
const SupportAuthorityEventOriginator: z.ZodObject<any> = z.object({
  type: EventOriginatorEnum.optional()
});
const ApiTokenEventOriginator: z.ZodObject<any> = z.object({
  type: EventOriginatorEnum.optional()
});
const UserEventOriginator: z.ZodObject<any> = z.object({
  type: EventOriginatorEnum.optional()
});
const RuleEventOriginator: z.ZodObject<any> = z.object({
  type: EventOriginatorEnum.optional()
});
const ComponentCompositeEventOriginator: z.ZodObject<any> = z.object({
  type: EventOriginatorEnum.optional()
});
const BaseEventOriginator: z.ZodObject<any> = z.object({
  type: EventOriginatorEnum.optional()
});
const FirstInSourceEnum = z.string();
const DoorFirstInStateChangeEventReference: z.ZodObject<any> = z.object({
  doorUuidToEventUuidMap: z.record(z.unknown()).optional(),
  newState: FirstInFirmwareStatus.optional(),
  originatingDoorUuid: z.string().optional(),
  originatingUserUuid: z.string().optional(),
  originator: BaseEventOriginator.optional(),
  source: FirstInSourceEnum.optional(),
  stateChangedAtMs: z.number().int().optional()
});
const AccessControlUnitDoorFirstInStateEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const LockdownPlanScopeEnumType = z.string();
const LockdownPlanReference: z.ZodObject<any> = z.object({
  lockdownPlanUuid: z.string().optional(),
  scope: LockdownPlanScopeEnumType.optional(),
  scopeUuid: z.string().optional()
});
const LocationLockdownStateEnumType = z.string();
const AccessControlUnitLocationLockdownStateEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const AccessControlUnitTamperSourceEnumType = z.string();
const AccessControlUnitTamperEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const ActivityEnum = z.string();
const SubLocationsHierarchyKey: z.ZodObject<any> = z.object({
  locationUuids: z.array(z.string()).optional()
});
const MetaDataLocationType: z.ZodObject<any> = z.object({
  region: z.string().optional()
});
const AccessControlledDoorPolicyAlertType: z.ZodObject<any> = z.object({
  alertMonitoringThreatCaseUuid: z.string().optional(),
  alertMonitoringVerified: z.boolean().optional(),
  clipLocationMap: z.record(z.unknown()).optional(),
  clipLocationMapV2: z.record(z.unknown()).optional(),
  delayedProcessing: z.boolean().optional(),
  deleted: z.boolean().optional(),
  durationSec: z.number().int().optional(),
  finalized: z.boolean().optional(),
  locationUuid: z.string().optional(),
  notificationSent: z.boolean().optional(),
  orgUuid: z.string().optional(),
  policyAlertTriggers: z.array(ActivityEnum).optional(),
  policyUuid: z.string().optional(),
  saved: z.boolean().optional(),
  shared: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  textDescription: z.string().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  thumbnailLocationV2: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: z.string().optional(),
  uuid: z.string().optional()
});
const WeeklyMinuteIntervalType: z.ZodObject<any> = z.object({
  minuteOfWeekStart: z.number().int().optional(),
  minuteOfWeekStop: z.number().int().optional()
});
const WeeklyRepeatingScheduleType: z.ZodObject<any> = z.object({
  mutable: z.boolean().optional(),
  name: z.string().optional(),
  oneTimeUse: z.boolean().optional(),
  orgUuid: z.string().optional(),
  strategy: z.string().optional(),
  uuid: z.string().optional()
});
const AccessControlledDoorScheduledTriggerType: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(ActivityEnum).optional()
});
const AccessControlledDoorPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(AccessControlledDoorScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const FirstInShadow: z.ZodObject<any> = z.object({
  originator: BaseEventOriginator.optional(),
  source: FirstInSourceEnum.optional(),
  state: FirstInFirmwareStatus.optional(),
  stateUpdateEventTimestampMs: z.number().int().optional()
});
const DoorStateSourceEnum = z.string();
const AccessControlledDoorStateEnumType = z.string();
const DoorStateShadow: z.ZodObject<any> = z.object({
  source: DoorStateSourceEnum.optional(),
  state: AccessControlledDoorStateEnumType.optional(),
  stateUpdateEventTimestampMs: z.number().int().optional()
});
const ComponentCompositeShadowEnum = z.string();
const AccessControlledDoorShadow: z.ZodObject<any> = z.object({
  authFirstIn: FirstInShadow.optional(),
  componentCompositeUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  scheduleFirstIn: FirstInShadow.optional(),
  state: DoorStateShadow.optional(),
  type: ComponentCompositeShadowEnum.optional(),
  updatedAtMillis: z.number().int().optional()
});
const ComponentReferenceType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  deviceUuid: z.string().optional()
});
const FirstInStatus = z.string();
const FirstInState: z.ZodObject<any> = z.object({
  originator: BaseEventOriginator.optional(),
  requestedAtMillis: z.number().int().optional(),
  state: FirstInStatus.optional()
});
const ManualDoorStateChangeEnum = z.string();
const BaseDoorStateOverride: z.ZodObject<any> = z.object({
  originator: BaseEventOriginator.optional(),
  requestedAtMillis: z.number().int().optional(),
  type: ManualDoorStateChangeEnum.optional()
});
const ProximityUnlockSettingsType: z.ZodObject<any> = z.object({
  credCooldownSec: z.number().int().optional(),
  enabled: z.boolean().optional(),
  exitResetsCooldown: z.boolean().optional(),
  holdUnlocked: z.boolean().optional(),
  holdUnlockedEventIntervalSec: z.number().int().optional(),
  maxHoldUnlockedTimeSec: z.number().int().optional(),
  minHoldUnlockedTimeSec: z.number().int().optional(),
  minRSSIThreshold: z.number().int().optional()
});
const ComponentCompositeEnumType = z.string();
const WaveToUnlockSettingsType: z.ZodObject<any> = z.object({
  awaitAuthDurationMs: z.number().int().optional(),
  enabled: z.boolean().optional(),
  minRSSIThreshold: z.number().int().optional(),
  showAwaitIntentFeedback: z.boolean().optional(),
  treatNfcAsIntent: z.boolean().optional()
});
const AccessControlledDoorType: z.ZodObject<any> = z.object({
  ajarTimeSec: z.number().int().optional(),
  aperioDoorExtensionComponent: ComponentReferenceType.optional(),
  aperioDoorId: z.string().optional(),
  aperioGatewayComponent: ComponentReferenceType.optional(),
  associatedCameras: z.array(z.string()).optional(),
  associatedFaceDetectionCameras: z.array(z.string()).optional(),
  createdAtMillis: z.number().int().optional(),
  defaultState: AccessControlledDoorStateEnumType.optional(),
  directionRadians: z.number().optional(),
  doorAuthFirstInStateOverride: FirstInState.optional(),
  doorScheduleFirstInStateOverride: FirstInState.optional(),
  doorStateOverride: BaseDoorStateOverride.optional(),
  doorStateToScheduleUuidMap: z.record(z.unknown()).optional(),
  dpiComponents: z.array(ComponentReferenceType).optional(),
  floorNumber: z.number().int().optional(),
  forceAllReadersFirstInAuthRequiredLedFeedbackEnabled: z.boolean().optional(),
  forceAllReadersFirstInUnlockPendingLedFeedbackEnabled: z.boolean().optional(),
  forceAllReadersOtherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  forceAllReadersRemoteUnlockAudioFeedbackEnabled: z.boolean().optional(),
  forcedOpenEnabled: z.boolean().optional(),
  forcedOpenTimeSec: z.number().int().optional(),
  geofenceEnabled: z.boolean().optional(),
  geofenceRadius: z.number().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  nfcSecureDowngradeEnabled: z.boolean().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  policyUuid: z.string().optional(),
  privacyModeSupportEnabled: z.boolean().optional(),
  proximityUnlockSettings: ProximityUnlockSettingsType.optional(),
  readerComponents: z.array(ComponentReferenceType).optional(),
  relayComponents: z.array(ComponentReferenceType).optional(),
  relockAfterOpenTimeMs: z.number().int().optional(),
  remoteUnlockEnabled: z.boolean().optional(),
  rexComponents: z.array(ComponentReferenceType).optional(),
  sendExpiredIntentEvents: z.boolean().optional(),
  subType: z.string().optional(),
  type: ComponentCompositeEnumType.optional(),
  unlockTimeSec: z.number().int().optional(),
  unlockTimeSecRex: z.number().int().optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional(),
  waveToUnlockSettings: WaveToUnlockSettingsType.optional()
});
const ComponentReferenceType_Minimal: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  deviceUuid: z.string().optional()
});
const EventOriginatorEnum_Minimal = z.string();
const BaseEventOriginator_Minimal: z.ZodObject<any> = z.object({
  type: EventOriginatorEnum_Minimal.optional()
});
const FirstInStatus_Minimal = z.string();
const FirstInState_Minimal: z.ZodObject<any> = z.object({
  originator: BaseEventOriginator_Minimal.optional(),
  requestedAtMillis: z.number().int().optional(),
  state: FirstInStatus_Minimal.optional()
});
const ManualDoorStateChangeEnum_Minimal = z.string();
const BaseDoorStateOverride_Minimal: z.ZodObject<any> = z.object({
  originator: BaseEventOriginator_Minimal.optional(),
  requestedAtMillis: z.number().int().optional(),
  type: ManualDoorStateChangeEnum_Minimal.optional()
});
const ProximityUnlockSettingsType_Minimal: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  minRSSIThreshold: z.number().int().optional()
});
const ComponentCompositeEnumType_Minimal = z.string();
const WaveToUnlockSettingsType_Minimal: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  minRSSIThreshold: z.number().int().optional()
});
const AccessControlledDoorType_Minimal: z.ZodObject<any> = z.object({
  aperioDoorExtensionComponent: ComponentReferenceType_Minimal.optional(),
  aperioDoorId: z.string().optional(),
  aperioGatewayComponent: ComponentReferenceType_Minimal.optional(),
  directionRadians: z.number().optional(),
  doorAuthFirstInStateOverride: FirstInState_Minimal.optional(),
  doorScheduleFirstInStateOverride: FirstInState_Minimal.optional(),
  doorStateOverride: BaseDoorStateOverride_Minimal.optional(),
  dpiComponents: z.array(ComponentReferenceType_Minimal).optional(),
  floorNumber: z.number().int().optional(),
  geofenceEnabled: z.boolean().optional(),
  geofenceRadius: z.number().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  nfcSecureDowngradeEnabled: z.boolean().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  privacyModeSupportEnabled: z.boolean().optional(),
  proximityUnlockSettings: ProximityUnlockSettingsType_Minimal.optional(),
  readerComponents: z.array(ComponentReferenceType_Minimal).optional(),
  relayComponents: z.array(ComponentReferenceType_Minimal).optional(),
  remoteUnlockEnabled: z.boolean().optional(),
  rexComponents: z.array(ComponentReferenceType_Minimal).optional(),
  subType: z.string().optional(),
  type: ComponentCompositeEnumType_Minimal.optional(),
  unlockTimeSec: z.number().int().optional(),
  uuid: z.string().optional(),
  waveToUnlockSettings: WaveToUnlockSettingsType_Minimal.optional()
});
const Accesscontrol_SendUserPresenceForCurrentUserSuccessWsResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_SendUserPresenceForCurrentUserErrorWsResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_BaseSendUserPresenceForCurrentUserWsResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_DeviceUnlockableAccessControlledDoorType: z.ZodObject<any> = z.object({
  name: z.string().optional(),
  uuid: z.string().optional()
});
const Accesscontrol_FindUnlockableAccessControlledDoorsByDeviceWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Accesscontrol_FindUnlockableAccessControlledDoorsByDeviceWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoors: z.array(Accesscontrol_DeviceUnlockableAccessControlledDoorType).optional()
});
const Accesscontrol_ForceRefreshAccessControlUnitConfigWSRequest: z.ZodObject<any> = z.object({
  accessControlUnitUuid: z.string().optional()
});
const Accesscontrol_ForceRefreshAccessControlUnitConfigWSResponse = z.record(z.unknown());
const Accesscontrol_GetMinimalAccessControlledDoorsByLocationForCurrentUserWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Accesscontrol_UserAccessGrant: z.ZodObject<any> = z.object({
  accessControlledDoorUuids: z.array(z.string()).optional(),
  scheduleUuid: z.string().optional()
});
const Accesscontrol_UserAccessRevocation: z.ZodObject<any> = z.object({
  accessControlledDoorUuids: z.array(z.string()).optional(),
  scheduleUuid: z.string().optional()
});
const RealtimeRelativeSecondsScheduleType: z.ZodObject<any> = z.object({
  mutable: z.boolean().optional(),
  name: z.string().optional(),
  oneTimeUse: z.boolean().optional(),
  orgUuid: z.string().optional(),
  strategy: z.string().optional(),
  uuid: z.string().optional()
});
const LocalDateTimeIntervalType: z.ZodObject<any> = z.object({
  localEndDateTime: z.string(),
  localStartDateTime: z.string()
});
const RelativeDateTimeIntervalsScheduleType: z.ZodObject<any> = z.object({
  mutable: z.boolean().optional(),
  name: z.string().optional(),
  oneTimeUse: z.boolean().optional(),
  orgUuid: z.string().optional(),
  strategy: z.string().optional(),
  uuid: z.string().optional()
});
const BaseSavedScheduleType_Minimal: z.ZodObject<any> = z.object({
  mutable: z.boolean().optional(),
  name: z.string().optional(),
  oneTimeUse: z.boolean().optional(),
  orgUuid: z.string().optional(),
  strategy: z.string().optional(),
  uuid: z.string().optional()
});
const Accesscontrol_GetMinimalAccessControlledDoorsByLocationForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoors: z.array(AccessControlledDoorType_Minimal).optional(),
  accessGrants: z.array(Accesscontrol_UserAccessGrant).optional(),
  accessRevocations: z.array(Accesscontrol_UserAccessRevocation).optional(),
  schedules: z.array(BaseSavedScheduleType_Minimal).optional()
});
const Accesscontrol_SendUserPresenceForCurrentUserWSRequest_Destination: z.ZodObject<any> = z.object({
  accessControlUnitUuid: z.string().optional(),
  beaconIdentifier: z.array(z.string()).optional(),
  readerUuid: z.string().optional(),
  rssi: z.string().optional()
});
const Accesscontrol_SendUserPresenceForCurrentUserWSRequest: z.ZodObject<any> = z.object({
  cmdVersion: z.string().optional(),
  credentialValue: z.string().optional(),
  destinations: z.array(Accesscontrol_SendUserPresenceForCurrentUserWSRequest_Destination).optional()
});
const Accesscontrol_UnlockAccessControlledDoorErrorWSResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_UnlockAccessControlledDoorForCurrentUserErrorWSResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_UnlockAccessControlledDoorForCurrentUserSuccessWSResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_UnlockAccessControlledDoorForCurrentUserWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  cmdVersion: z.string().optional(),
  credentialValue: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  requestTimeMillis: z.number().int().optional()
});
const Accesscontrol_UnlockAccessControlledDoorSuccessWSResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_UnlockAccessControlledDoorWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional()
});
const LocationAccessGrantType: z.ZodObject<any> = z.object({
  accessControlledDoorUuids: z.array(z.string()).optional(),
  createdAtMillis: z.number().int().optional(),
  doorLabelIds: z.array(z.string()).optional(),
  groupUuids: z.array(z.string()).optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduleUuid: z.string().optional(),
  sortKey: z.string().optional(),
  storedInS3: z.boolean().optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuids: z.array(z.string()).optional(),
  uuid: z.string().optional()
});
const Accesscontrol_accessgrant_CreateAccessGrantWSRequest: z.ZodObject<any> = z.object({
  accessGrant: LocationAccessGrantType.optional()
});
const Accesscontrol_accessgrant_CreateAccessGrantWSResponse: z.ZodObject<any> = z.object({
  accessGrant: LocationAccessGrantType.optional()
});
const Accesscontrol_accessgrant_DeleteLocationAccessGrantWSRequest: z.ZodObject<any> = z.object({
  accessGrantUuid: z.string().optional()
});
const Accesscontrol_accessgrant_DeleteLocationAccessGrantWSResponse = z.record(z.unknown());
const Accesscontrol_accessgrant_FindLocationAccessGrantsByAccessControlledDoorWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByAccessControlledDoorWSResponse: z.ZodObject<any> = z.object({
  accessGrants: z.array(LocationAccessGrantType).optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByDoorLabelWSRequest: z.ZodObject<any> = z.object({
  doorLabelId: z.string().optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByDoorLabelWSResponse: z.ZodObject<any> = z.object({
  accessGrants: z.array(LocationAccessGrantType).optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByGroupWSRequest: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByGroupWSResponse: z.ZodObject<any> = z.object({
  accessGrants: z.array(LocationAccessGrantType).optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationAndUserWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationAndUserWSResponse: z.ZodObject<any> = z.object({
  accessGrants: z.array(LocationAccessGrantType).optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSResponse: z.ZodObject<any> = z.object({
  accessGrants: z.array(LocationAccessGrantType).optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSRequest = z.record(z.unknown());
const Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSResponse: z.ZodObject<any> = z.object({
  accessGrants: z.array(LocationAccessGrantType).optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByUserWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const Accesscontrol_accessgrant_FindLocationAccessGrantsByUserWSResponse: z.ZodObject<any> = z.object({
  accessGrants: z.array(LocationAccessGrantType).optional()
});
const Accesscontrol_accessgrant_GetLocationAccessGrantWSRequest: z.ZodObject<any> = z.object({
  accessGrantUuid: z.string().optional()
});
const Accesscontrol_accessgrant_GetLocationAccessGrantWSResponse: z.ZodObject<any> = z.object({
  accessGrant: LocationAccessGrantType.optional()
});
const Accesscontrol_accessgrant_GetLocationsByAccessGrantForCurrentUserWSRequest = z.record(z.unknown());
const LocationLockdownStateType: z.ZodObject<any> = z.object({
  activeLockdownPlans: z.array(LockdownPlanReference).optional(),
  createdAtMillis: z.number().int().optional(),
  followingTestPlan: z.boolean().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  state: LocationLockdownStateEnumType.optional(),
  stateChangedAtMillis: z.number().int().optional(),
  updatedAtMillis: z.number().int().optional()
});
const FloorPlanType: z.ZodObject<any> = z.object({
  eastEdge: z.number().optional(),
  floorLabel: z.string().optional(),
  floorNumber: z.number().int().optional(),
  imageUrl: z.string().optional(),
  mediaUuid: z.string().optional(),
  northEdge: z.number().optional(),
  rotation: z.number().optional(),
  southEdge: z.number().optional(),
  westEdge: z.number().optional()
});
const QualifiedAddressType: z.ZodObject<any> = z.object({
  addressLine2: z.string().optional(),
  addressline1: z.string().optional(),
  administrativeArea: z.string().optional(),
  locality: z.string().optional(),
  postalCode: z.string().optional(),
  regionCode: z.string().optional()
});
const LockdownActivationPlanType: z.ZodObject<any> = z.object({
  groupUuids: z.array(z.string()).optional(),
  rhombusKeyNotificationMessage: z.string().optional(),
  userUuids: z.array(z.string()).optional()
});
const LockdownDeactivationPlanType: z.ZodObject<any> = z.object({
  groupUuids: z.array(z.string()).optional(),
  rhombusKeyNotificationMessage: z.string().optional(),
  userUuids: z.array(z.string()).optional()
});
const DoorLockdownStateEnumType = z.string();
const LockdownPhysicalAccessType: z.ZodObject<any> = z.object({
  groupUuids: z.array(z.string()).optional(),
  userUuids: z.array(z.string()).optional()
});
const LockdownTestPlanType: z.ZodObject<any> = z.object({
  doorStateOverrideEnabled: z.boolean().optional(),
  userAccessOverrideEnabled: z.boolean().optional()
});
const LocationLockdownPlanType: z.ZodObject<any> = z.object({
  activationPlan: LockdownActivationPlanType.optional(),
  createdAtMillis: z.number().int().optional(),
  deactivationPlan: LockdownDeactivationPlanType.optional(),
  defaultLockdownState: DoorLockdownStateEnumType.optional(),
  doorLockdownStateMap: z.record(z.unknown()).optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  physicalAccess: LockdownPhysicalAccessType.optional(),
  scopeUuid: z.string().optional(),
  testPlan: LockdownTestPlanType.optional(),
  type: LockdownPlanScopeEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const BaseLockdownPlanType: z.ZodObject<any> = z.object({
  activationPlan: LockdownActivationPlanType.optional(),
  createdAtMillis: z.number().int().optional(),
  deactivationPlan: LockdownDeactivationPlanType.optional(),
  defaultLockdownState: DoorLockdownStateEnumType.optional(),
  doorLockdownStateMap: z.record(z.unknown()).optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  physicalAccess: LockdownPhysicalAccessType.optional(),
  scopeUuid: z.string().optional(),
  testPlan: LockdownTestPlanType.optional(),
  type: LockdownPlanScopeEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const Accesscontrol_accessgrant_GetLocationsByAccessGrantForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  locationLockdownStates: z.array(LocationLockdownStateType).optional(),
  locations: z.array(LocationType).optional(),
  lockdownPlans: z.array(BaseLockdownPlanType).optional()
});
const Accesscontrol_accessgrant_GetRhombusKeyLocationLockdownDetailsForCurrentUserWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Accesscontrol_accessgrant_GetRhombusKeyLocationLockdownDetailsForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  locationLockdownState: LocationLockdownStateType.optional()
});
const Accesscontrol_accessgrant_UpdateAccessGrantWSRequest: z.ZodObject<any> = z.object({
  accessGrant: LocationAccessGrantType.optional()
});
const Accesscontrol_accessgrant_UpdateAccessGrantWSResponse: z.ZodObject<any> = z.object({
  accessGrant: LocationAccessGrantType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  expiredACDLicensesDoorUuids: z.array(z.string()).optional(),
  unassignedACDLicensesDoorUuids: z.array(z.string()).optional()
});
const LocationAccessRevocationType: z.ZodObject<any> = z.object({
  accessControlledDoorUuids: z.array(z.string()).optional(),
  createdAtMillis: z.number().int().optional(),
  doorLabelIds: z.array(z.string()).optional(),
  groupUuids: z.array(z.string()).optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduleUuid: z.string().optional(),
  sortKey: z.string().optional(),
  storedInS3: z.boolean().optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuids: z.array(z.string()).optional(),
  uuid: z.string().optional()
});
const Accesscontrol_accessrevocation_CreateAccessRevocationWSRequest: z.ZodObject<any> = z.object({
  accessRevocation: LocationAccessRevocationType.optional()
});
const Accesscontrol_accessrevocation_CreateAccessRevocationWSResponse: z.ZodObject<any> = z.object({
  accessRevocation: LocationAccessRevocationType.optional()
});
const Accesscontrol_accessrevocation_DeleteLocationAccessRevocationWSRequest: z.ZodObject<any> = z.object({
  accessRevocationUuid: z.string().optional()
});
const Accesscontrol_accessrevocation_DeleteLocationAccessRevocationWSResponse = z.record(z.unknown());
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByAccessControlledDoorWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional()
});
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByAccessControlledDoorWSResponse: z.ZodObject<any> = z.object({
  accessRevocations: z.array(LocationAccessRevocationType).optional()
});
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByDoorLabelWSRequest: z.ZodObject<any> = z.object({
  doorLabelId: z.string().optional()
});
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByDoorLabelWSResponse: z.ZodObject<any> = z.object({
  accessRevocations: z.array(LocationAccessRevocationType).optional()
});
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByGroupWSRequest: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional()
});
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByGroupWSResponse: z.ZodObject<any> = z.object({
  accessRevocations: z.array(LocationAccessRevocationType).optional()
});
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByOrgWSRequest = z.record(z.unknown());
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByOrgWSResponse: z.ZodObject<any> = z.object({
  accessRevocations: z.array(LocationAccessRevocationType).optional()
});
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByUserWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const Accesscontrol_accessrevocation_FindLocationAccessRevocationsByUserWSResponse: z.ZodObject<any> = z.object({
  accessRevocations: z.array(LocationAccessRevocationType).optional()
});
const Accesscontrol_accessrevocation_GetLocationAccessRevocationWSRequest: z.ZodObject<any> = z.object({
  accessRevocationUuid: z.string().optional()
});
const Accesscontrol_accessrevocation_GetLocationAccessRevocationWSResponse: z.ZodObject<any> = z.object({
  accessRevocation: LocationAccessRevocationType.optional()
});
const Accesscontrol_accessrevocation_UpdateAccessRevocationWSRequest: z.ZodObject<any> = z.object({
  accessRevocation: LocationAccessRevocationType.optional()
});
const Accesscontrol_accessrevocation_UpdateAccessRevocationWSResponse: z.ZodObject<any> = z.object({
  accessRevocation: LocationAccessRevocationType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  expiredACDLicensesDoorUuids: z.array(z.string()).optional(),
  unassignedACDLicensesDoorUuids: z.array(z.string()).optional()
});
const BadgeTemplateElementEnum = z.string();
const CustomTextElement: z.ZodObject<any> = z.object({
  type: BadgeTemplateElementEnum.optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional()
});
const UserMetadataEnum = z.string();
const UserMetadataTextElement: z.ZodObject<any> = z.object({
  type: BadgeTemplateElementEnum.optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional()
});
const UserCustomMetadataTextElement: z.ZodObject<any> = z.object({
  type: BadgeTemplateElementEnum.optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional()
});
const CustomImageElement: z.ZodObject<any> = z.object({
  type: BadgeTemplateElementEnum.optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional()
});
const UserProfilePhotoElement: z.ZodObject<any> = z.object({
  type: BadgeTemplateElementEnum.optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional()
});
const BaseBadgeTemplateElement: z.ZodObject<any> = z.object({
  type: BadgeTemplateElementEnum.optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional()
});
const BadgeTemplate: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  elements: z.array(BaseBadgeTemplateElement).optional(),
  front: z.boolean().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  portrait: z.boolean().optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional(),
  version: z.string().optional()
});
const Accesscontrol_badgetemplate_CreateBadgeTemplateWSRequest: z.ZodObject<any> = z.object({
  template: BadgeTemplate.optional()
});
const Accesscontrol_badgetemplate_CreateBadgeTemplateWSResponse: z.ZodObject<any> = z.object({
  template: BadgeTemplate.optional()
});
const Accesscontrol_badgetemplate_DeleteBadgeTemplateImageWSRequest: z.ZodObject<any> = z.object({
  imageUuid: z.string().optional()
});
const BadgeTemplateImage: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  imageS3Key: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  originalFileName: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const Accesscontrol_badgetemplate_DeleteBadgeTemplateImageWSResponse: z.ZodObject<any> = z.object({
  image: BadgeTemplateImage.optional()
});
const Accesscontrol_badgetemplate_DeleteBadgeTemplateWSRequest: z.ZodObject<any> = z.object({
  templateUuid: z.string().optional()
});
const Accesscontrol_badgetemplate_DeleteBadgeTemplateWSResponse: z.ZodObject<any> = z.object({
  template: BadgeTemplate.optional()
});
const Accesscontrol_badgetemplate_FindBadgeTemplateImagesWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Accesscontrol_badgetemplate_FindBadgeTemplateImagesWSResponse: z.ZodObject<any> = z.object({
  images: z.array(BadgeTemplateImage).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Accesscontrol_badgetemplate_FindBadgeTemplatesWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Accesscontrol_badgetemplate_FindBadgeTemplatesWSResponse: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  templates: z.array(BadgeTemplate).optional()
});
const Accesscontrol_badgetemplate_GetBadgeTemplateImageWSRequest: z.ZodObject<any> = z.object({
  imageUuid: z.string().optional()
});
const Accesscontrol_badgetemplate_GetBadgeTemplateImageWSResponse: z.ZodObject<any> = z.object({
  image: BadgeTemplateImage.optional()
});
const Accesscontrol_badgetemplate_GetBadgeTemplateWSRequest: z.ZodObject<any> = z.object({
  templateUuid: z.string().optional()
});
const Accesscontrol_badgetemplate_GetBadgeTemplateWSResponse: z.ZodObject<any> = z.object({
  template: BadgeTemplate.optional()
});
const BadgeTemplateImageSelectiveUpdate: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  imageS3Key: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  originalFileName: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  uuid: z.string().optional()
});
const Accesscontrol_badgetemplate_UpdateBadgeTemplateImageWSRequest: z.ZodObject<any> = z.object({
  selectiveUpdate: BadgeTemplateImageSelectiveUpdate.optional()
});
const Accesscontrol_badgetemplate_UpdateBadgeTemplateImageWSResponse: z.ZodObject<any> = z.object({
  image: BadgeTemplateImage.optional()
});
const BadgeTemplateSelectiveUpdate: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  elements: z.array(BaseBadgeTemplateElement).optional(),
  front: z.boolean().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  portrait: z.boolean().optional(),
  updatedAtMillis: z.number().int().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  uuid: z.string().optional(),
  version: z.string().optional()
});
const Accesscontrol_badgetemplate_UpdateBadgeTemplateWSRequest: z.ZodObject<any> = z.object({
  selectiveUpdate: BadgeTemplateSelectiveUpdate.optional()
});
const Accesscontrol_badgetemplate_UpdateBadgeTemplateWSResponse: z.ZodObject<any> = z.object({
  template: BadgeTemplate.optional()
});
const Accesscontrol_credentials_AssignAccessControlCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialHexValue: z.string().optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_credentials_AssignAccessControlCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_ProvisionMobileAccessControlCredentialForCurrentUserSuccessWSResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_credentials_ProvisionMobileAccessControlCredentialForCurrentUserErrorWSResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_credentials_BaseProvisionMobileAccessControlCredentialForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_credentials_BaseUnlockAccessControlledDoorForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_credentials_BaseUnlockAccessControlledDoorWSResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Accesscontrol_credentials_BulkProvisionPinCredentialsWSRequest: z.ZodObject<any> = z.object({
  endDateEpochSecExclusive: z.number().int().min(0).optional(),
  notifyUsers: z.boolean().optional(),
  pinLength: z.number().int().min(4).max(16).optional(),
  startDateEpochSecInclusive: z.number().int().min(0).optional(),
  userUuids: z.array(z.string()).optional()
});
const Accesscontrol_credentials_BulkProvisionPinCredentialsWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedUsers: z.array(z.string()).optional()
});
const Accesscontrol_credentials_BulkRotatePinCredentialsWSRequest: z.ZodObject<any> = z.object({
  credentialUuids: z.array(z.string()),
  endDateEpochSecExclusive: z.number().int().min(0).optional(),
  notifyUsers: z.boolean().optional(),
  pinLength: z.number().int().min(4).max(16).optional(),
  startDateEpochSecInclusive: z.number().int().min(0).optional()
});
const Accesscontrol_credentials_BulkRotatePinCredentialsWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Accesscontrol_credentials_CreateAccessControlCredentialByHexValueAndTypeWSRequest: z.ZodObject<any> = z.object({
  credentialType: AccessControlCredentialEnumType.optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  hexValue: z.string().optional(),
  littleEndian: z.boolean().optional(),
  numValueBits: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_credentials_CreateAccessControlCredentialByHexValueAndTypeWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_CreateAppleWalletPassWSRequest: z.ZodObject<any> = z.object({
  credUuid: z.string().optional()
});
const Accesscontrol_credentials_CreateAppleWalletPassWSResponse = z.record(z.unknown());
const Accesscontrol_credentials_CreatePinCredentialWSRequest: z.ZodObject<any> = z.object({
  endDateEpochSecExclusive: z.number().int().min(0).optional(),
  notifyUser: z.boolean().optional(),
  pinCode: z.string().min(4).max(16).optional(),
  pinLength: z.number().int().min(4).max(16).optional(),
  startDateEpochSecInclusive: z.number().int().min(0).optional(),
  userUuid: z.string()
});
const Accesscontrol_credentials_CreatePinCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Accesscontrol_credentials_CreateRhombusSecureCsnCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialValue: z.string().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_credentials_CreateRhombusSecureCsnCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_CreateStandardCsnCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialValue: z.string().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_credentials_CreateStandardCsnCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_CreateWiegand64BitRawCredentialWSRequest: z.ZodObject<any> = z.object({
  endDateEpochSecExclusive: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  userUuid: z.string().optional(),
  value: z.string().optional()
});
const Accesscontrol_credentials_CreateWiegand64BitRawCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_CreateWiegandCredentialWSRequest: z.ZodObject<any> = z.object({
  cardNumber: z.number().int().optional(),
  companyId: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  facilityCode: z.number().int().optional(),
  siteCode: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  userUuid: z.string().optional(),
  value: z.string().optional(),
  wiegandFormat: WiegandFormatEnumType.optional()
});
const Accesscontrol_credentials_CreateWiegandCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_CreateWiegandD10202CredentialWSRequest: z.ZodObject<any> = z.object({
  cardNumber: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  facilityCode: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_credentials_CreateWiegandD10202CredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_CreateWiegandH10301CredentialWSRequest: z.ZodObject<any> = z.object({
  cardNumber: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  facilityCode: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_credentials_CreateWiegandH10301CredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_CreateWiegandH10304CredentialWSRequest: z.ZodObject<any> = z.object({
  cardNumber: z.number().int().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  facilityCode: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_credentials_CreateWiegandH10304CredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_DeleteAccessControlCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional()
});
const Accesscontrol_credentials_DeleteAccessControlCredentialWSResponse = z.record(z.unknown());
const Accesscontrol_credentials_DeletePinCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string()
});
const Accesscontrol_credentials_DeletePinCredentialWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Accesscontrol_credentials_DeleteUnassignedAccessControlCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialHexValue: z.string().optional()
});
const Accesscontrol_credentials_DeleteUnassignedAccessControlCredentialWSResponse = z.record(z.unknown());
const CredentialQueryFilter: z.ZodObject<any> = z.object({
  credTypeFilter: z.array(AccessControlCredentialEnumType).optional(),
  lastUsedAccessControlledDoorUuidFilter: z.array(z.string()).optional(),
  lastUsedAfterFilter: z.number().int().optional(),
  lastUsedBeforeFilter: z.number().int().optional(),
  lastUsedLocationUuidFilter: z.array(z.string()).optional(),
  workflowStatusFilter: z.array(AccessControlCredentialWorkflowStatusEnumType).optional()
});
const Accesscontrol_credentials_FindAccessControlCredentialByOrgWSRequest: z.ZodObject<any> = z.object({
  filter: CredentialQueryFilter.optional()
});
const Accesscontrol_credentials_FindAccessControlCredentialByOrgWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional()
});
const Accesscontrol_credentials_FindAccessControlCredentialByUserWSRequest: z.ZodObject<any> = z.object({
  filter: CredentialQueryFilter.optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_credentials_FindAccessControlCredentialByUserWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional()
});
const Accesscontrol_credentials_FindAccessControlCredentialByUsersWSRequest: z.ZodObject<any> = z.object({
  filter: CredentialQueryFilter.optional(),
  userUuids: z.array(z.string()).optional()
});
const Accesscontrol_credentials_FindAccessControlCredentialByUsersWSResponse: z.ZodObject<any> = z.object({
  userCredentialsMap: z.record(z.unknown()).optional()
});
const Accesscontrol_credentials_FindCredentialHistoryByCredentialHexValueWSRequest: z.ZodObject<any> = z.object({
  credentialHexValue: z.string().optional(),
  filter: CredentialQueryFilter.optional()
});
const Accesscontrol_credentials_FindCredentialHistoryByCredentialHexValueWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional()
});
const Accesscontrol_credentials_FindCredentialHistoryByCredentialValueWSRequest: z.ZodObject<any> = z.object({
  credentialType: AccessControlCredentialEnumType.optional(),
  credentialValue: z.string().optional(),
  filter: CredentialQueryFilter.optional()
});
const Accesscontrol_credentials_FindCredentialHistoryByCredentialValueWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional()
});
const Accesscontrol_credentials_FindCredentialHistoryByUserWSRequest: z.ZodObject<any> = z.object({
  filter: CredentialQueryFilter.optional(),
  userUuid: z.string().optional()
});
const Accesscontrol_credentials_FindCredentialHistoryByUserWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional()
});
const Accesscontrol_credentials_FindCredentialHistoryWSRequest: z.ZodObject<any> = z.object({
  filter: CredentialQueryFilter.optional()
});
const Accesscontrol_credentials_FindCredentialHistoryWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional()
});
const Accesscontrol_credentials_FindPinCredentialsByOrgWSRequest: z.ZodObject<any> = z.object({
  filter: CredentialQueryFilter.optional()
});
const Accesscontrol_credentials_FindPinCredentialsByOrgWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Accesscontrol_credentials_FindRhombusSecureMobileCredentialsForCurrentUserWSRequest = z.record(z.unknown());
const Accesscontrol_credentials_FindRhombusSecureMobileCredentialsForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  credentials: z.array(AccessControlCredentialType).optional()
});
const Accesscontrol_credentials_GetAvailablePinCodeWSRequest: z.ZodObject<any> = z.object({
  pinLength: z.number().int()
});
const Accesscontrol_credentials_GetAvailablePinCodeWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  pinCode: z.string().optional()
});
const Accesscontrol_credentials_GetPinCredentialDetailsWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string()
});
const Accesscontrol_credentials_GetPinCredentialDetailsWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Accesscontrol_credentials_GetRhombusSecureCsnCredentialDetailsWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional()
});
const Accesscontrol_credentials_GetRhombusSecureCsnCredentialDetailsWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_GetRhombusSecureMobileAppStateStatsForOrgWSRequest = z.record(z.unknown());
const RhombusSecureMobileCredStatRhombusSecureMobileFeatureStatus: z.ZodObject<any> = z.object({
  androidCredRefMap: z.record(z.unknown()).optional(),
  androidTotal: z.number().int().optional(),
  androidTotalMap: z.record(z.unknown()).optional(),
  iphoneCredRefMap: z.record(z.unknown()).optional(),
  iphoneTotal: z.number().int().optional(),
  iphoneTotalMap: z.record(z.unknown()).optional(),
  total: z.number().int().optional()
});
const RhombusSecureMobileCredStatString: z.ZodObject<any> = z.object({
  androidCredRefMap: z.record(z.unknown()).optional(),
  androidTotal: z.number().int().optional(),
  androidTotalMap: z.record(z.unknown()).optional(),
  iphoneCredRefMap: z.record(z.unknown()).optional(),
  iphoneTotal: z.number().int().optional(),
  iphoneTotalMap: z.record(z.unknown()).optional(),
  total: z.number().int().optional()
});
const RhombusSecureMobileAppStateStats: z.ZodObject<any> = z.object({
  tapToUnlockStats: RhombusSecureMobileCredStatRhombusSecureMobileFeatureStatus.optional(),
  versionStats: RhombusSecureMobileCredStatString.optional(),
  waveToUnlockStats: RhombusSecureMobileCredStatRhombusSecureMobileFeatureStatus.optional()
});
const Accesscontrol_credentials_GetRhombusSecureMobileAppStateStatsForOrgWSResponse: z.ZodObject<any> = z.object({
  appStateStats: RhombusSecureMobileAppStateStats.optional()
});
const Accesscontrol_credentials_GetStandardCsnCredentialDetailsWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional()
});
const Accesscontrol_credentials_GetStandardCsnCredentialDetailsWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_ProvisionMobileAccessControlCredentialForCurrentUserWSRequest: z.ZodObject<any> = z.object({
  appName: z.string().optional(),
  appNotifications: RhombusSecureMobileFeature.optional(),
  appOS: z.string().optional(),
  appVersion: z.string().optional(),
  clientType: MobileTokenOSEnum.optional(),
  deviceModel: z.string().optional(),
  installationId: z.string().optional(),
  tapToUnlock: RhombusSecureMobileFeature.optional(),
  waveToUnlock: RhombusSecureMobileFeature.optional()
});
const Accesscontrol_credentials_RevokeAccessControlCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional()
});
const Accesscontrol_credentials_RevokeAccessControlCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_RevokePinCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string()
});
const Accesscontrol_credentials_RevokePinCredentialWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Accesscontrol_credentials_RevokeRhombusSecureMobileCredentialForCurrentUserWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional()
});
const Accesscontrol_credentials_RevokeRhombusSecureMobileCredentialForCurrentUserWSResponse = z.record(z.unknown());
const Accesscontrol_credentials_RotatePinCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string(),
  endDateEpochSecExclusive: z.number().int().min(0).optional(),
  notifyUser: z.boolean().optional(),
  pinCode: z.string().min(4).max(16).optional(),
  pinLength: z.number().int().min(4).max(16).optional(),
  startDateEpochSecInclusive: z.number().int().min(0).optional()
});
const Accesscontrol_credentials_RotatePinCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Accesscontrol_credentials_SuspendAccessControlCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional()
});
const Accesscontrol_credentials_SuspendAccessControlCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_UnsuspendAccessControlCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional()
});
const Accesscontrol_credentials_UnsuspendAccessControlCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_UpdateAccessControlCredentialNoteWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional(),
  note: z.string().optional()
});
const Accesscontrol_credentials_UpdateAccessControlCredentialNoteWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_UpdatePinCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional()
});
const Accesscontrol_credentials_UpdatePinCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Accesscontrol_credentials_UpdateRhombusKeyMobileAppStateForCurrentUserWSRequest: z.ZodObject<any> = z.object({
  appName: z.string().optional(),
  appNotifications: RhombusSecureMobileFeature.optional(),
  appOS: z.string().optional(),
  appVersion: z.string().optional(),
  clientType: MobileTokenOSEnum.optional(),
  credentialUuid: z.string().optional(),
  deviceModel: z.string().optional(),
  tapToUnlock: RhombusSecureMobileFeature.optional(),
  waveToUnlock: RhombusSecureMobileFeature.optional()
});
const RhombusSecureMobileAppState: z.ZodObject<any> = z.object({
  appName: z.string().optional(),
  appNotifications: RhombusSecureMobileFeature.optional(),
  appOS: z.string().optional(),
  appStatusUpdatedAtMillis: z.number().int().optional(),
  appVersion: z.string().optional(),
  clientType: MobileTokenOSEnum.optional(),
  credentialUuid: z.string().optional(),
  deviceModel: z.string().optional(),
  installationId: z.string().optional(),
  orgUuid: z.string().optional(),
  tapToUnlock: RhombusSecureMobileFeature.optional(),
  userAgent: z.string().optional(),
  userUuid: z.string().optional(),
  waveToUnlock: RhombusSecureMobileFeature.optional()
});
const Accesscontrol_credentials_UpdateRhombusKeyMobileAppStateForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  appState: RhombusSecureMobileAppState.optional()
});
const Accesscontrol_credentials_UpdateRhombusSecureCsnCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional()
});
const Accesscontrol_credentials_UpdateRhombusSecureCsnCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_UpdateRhombusSecureMobileCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional()
});
const Accesscontrol_credentials_UpdateRhombusSecureMobileCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_UpdateStandardCsnCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional()
});
const Accesscontrol_credentials_UpdateStandardCsnCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const Accesscontrol_credentials_UpdateWiegandCredentialWSRequest: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  startDateEpochSecInclusive: z.number().int().optional()
});
const Accesscontrol_credentials_UpdateWiegandCredentialWSResponse: z.ZodObject<any> = z.object({
  credential: AccessControlCredentialType.optional()
});
const LocalInterval: z.ZodObject<any> = z.object({
  localEndDateTime: z.string(),
  localStartDateTime: z.string(),
  state: AccessControlledDoorStateEnumType
});
const DoorScheduleExceptionType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  defaultState: AccessControlledDoorStateEnumType.optional(),
  description: z.string().optional(),
  doorUuids: z.array(z.string()).optional(),
  intervals: z.array(LocalInterval),
  localEndDate: z.string(),
  localStartDate: z.string(),
  locationToDoorsMap: z.record(z.unknown()).optional(),
  locationUuid: z.string().optional(),
  name: z.string(),
  orgUuid: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const Accesscontrol_doorexception_CreateDoorScheduleExceptionWSRequest: z.ZodObject<any> = z.object({
  exception: DoorScheduleExceptionType.optional()
});
const Accesscontrol_doorexception_CreateDoorScheduleExceptionWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  exception: DoorScheduleExceptionType.optional()
});
const Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSRequest: z.ZodObject<any> = z.object({
  exceptionUuid: z.string().optional()
});
const Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const DateRangeFilter: z.ZodObject<any> = z.object({
  localEndDateRangeEnd: z.string().optional(),
  localEndDateRangeStart: z.string().optional(),
  localStartDateRangeEnd: z.string().optional(),
  localStartDateRangeStart: z.string().optional()
});
const Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSRequest: z.ZodObject<any> = z.object({
  dateRangeFilter: DateRangeFilter.optional(),
  doorUuid: z.string().optional()
});
const Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  exceptions: z.array(DoorScheduleExceptionType).optional()
});
const Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSRequest: z.ZodObject<any> = z.object({
  dateRangeFilter: DateRangeFilter.optional(),
  locationUuid: z.string().optional()
});
const Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  exceptions: z.array(DoorScheduleExceptionType).optional()
});
const Accesscontrol_doorexception_FindDoorScheduleExceptionsWSRequest: z.ZodObject<any> = z.object({
  dateRangeFilter: DateRangeFilter.optional()
});
const Accesscontrol_doorexception_FindDoorScheduleExceptionsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  exceptions: z.array(DoorScheduleExceptionType).optional()
});
const Accesscontrol_doorexception_GetDoorScheduleExceptionWSRequest: z.ZodObject<any> = z.object({
  exceptionUuid: z.string().optional()
});
const Accesscontrol_doorexception_GetDoorScheduleExceptionWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  exception: DoorScheduleExceptionType.optional()
});
const Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSRequest: z.ZodObject<any> = z.object({
  exception: DoorScheduleExceptionType.optional()
});
const Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  exception: DoorScheduleExceptionType.optional(),
  expiredACDLicensesDoorUuids: z.array(z.string()).optional(),
  unassignedACDLicensesDoorUuids: z.array(z.string()).optional()
});
const Accesscontrol_firstin_ApplyDoorAuthFirstInGroupStateWSRequest: z.ZodObject<any> = z.object({
  settingsUuid: z.string().optional(),
  state: FirstInStatus.optional()
});
const FirstInResetEnum = z.string();
const DailyFirstInReset: z.ZodObject<any> = z.object({
  type: FirstInResetEnum.optional()
});
const BaseFirstInReset: z.ZodObject<any> = z.object({
  type: FirstInResetEnum.optional()
});
const LocationFirstInSettings: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  doorAuthFirstInOutOfSync: z.boolean().optional(),
  doorAuthFirstInState: FirstInState.optional(),
  doorAuthRequirementEnabled: z.boolean().optional(),
  doorScheduleFirstInOutOfSync: z.boolean().optional(),
  doorScheduleFirstInState: FirstInState.optional(),
  doorScheduleRequirementEnabled: z.boolean().optional(),
  doorUuids: z.array(z.string()).optional(),
  groupUuids: z.array(z.string()).optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  resets: z.array(BaseFirstInReset).optional(),
  settingsUuid: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuids: z.array(z.string()).optional()
});
const Accesscontrol_firstin_ApplyDoorAuthFirstInGroupStateWSResponse: z.ZodObject<any> = z.object({
  settings: LocationFirstInSettings.optional()
});
const Accesscontrol_firstin_ApplyDoorAuthFirstInStateWSRequest: z.ZodObject<any> = z.object({
  doorUuid: z.string().optional(),
  state: FirstInStatus.optional()
});
const Accesscontrol_firstin_ApplyDoorAuthFirstInStateWSResponse: z.ZodObject<any> = z.object({
  door: AccessControlledDoorType.optional()
});
const Accesscontrol_firstin_ApplyDoorScheduleFirstInGroupStateWSRequest: z.ZodObject<any> = z.object({
  settingsUuid: z.string().optional(),
  state: FirstInStatus.optional()
});
const Accesscontrol_firstin_ApplyDoorScheduleFirstInGroupStateWSResponse: z.ZodObject<any> = z.object({
  settings: LocationFirstInSettings.optional()
});
const Accesscontrol_firstin_ApplyDoorScheduleFirstInStateWSRequest: z.ZodObject<any> = z.object({
  doorUuid: z.string().optional(),
  state: FirstInStatus.optional()
});
const Accesscontrol_firstin_ApplyDoorScheduleFirstInStateWSResponse: z.ZodObject<any> = z.object({
  door: AccessControlledDoorType.optional()
});
const Accesscontrol_firstin_CreateLocationFirstInSettingsWSRequest: z.ZodObject<any> = z.object({
  settings: LocationFirstInSettings.optional()
});
const Accesscontrol_firstin_CreateLocationFirstInSettingsWSResponse: z.ZodObject<any> = z.object({
  settings: LocationFirstInSettings.optional()
});
const Accesscontrol_firstin_DeleteLocationFirstInSettingsWSRequest: z.ZodObject<any> = z.object({
  settingsUuid: z.string().optional()
});
const Accesscontrol_firstin_DeleteLocationFirstInSettingsWSResponse: z.ZodObject<any> = z.object({
  settings: LocationFirstInSettings.optional()
});
const Accesscontrol_firstin_FindLocationFirstInSettingsByLocationWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  locationUuid: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Accesscontrol_firstin_FindLocationFirstInSettingsByLocationWSResponse: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  settingsList: z.array(LocationFirstInSettings).optional()
});
const Accesscontrol_firstin_FindLocationFirstInSettingsByOrgWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Accesscontrol_firstin_FindLocationFirstInSettingsByOrgWSResponse: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  settingsList: z.array(LocationFirstInSettings).optional()
});
const Accesscontrol_firstin_GetLocationFirstInSettingsForDoorWSRequest: z.ZodObject<any> = z.object({
  doorUuid: z.string().optional()
});
const Accesscontrol_firstin_GetLocationFirstInSettingsForDoorWSResponse: z.ZodObject<any> = z.object({
  settings: LocationFirstInSettings.optional()
});
const Accesscontrol_firstin_GetLocationFirstInSettingsWSRequest: z.ZodObject<any> = z.object({
  settingsUuid: z.string().optional()
});
const Accesscontrol_firstin_GetLocationFirstInSettingsWSResponse: z.ZodObject<any> = z.object({
  settings: LocationFirstInSettings.optional()
});
const Accesscontrol_firstin_RemoveDoorLocationFirstInSettingsWSRequest: z.ZodObject<any> = z.object({
  doorUuid: z.string().optional()
});
const Accesscontrol_firstin_RemoveDoorLocationFirstInSettingsWSResponse: z.ZodObject<any> = z.object({
  settings: LocationFirstInSettings.optional()
});
const Accesscontrol_firstin_UpdateLocationFirstInSettingsWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  doorAuthRequirementEnabled: z.boolean().optional(),
  doorScheduleRequirementEnabled: z.boolean().optional(),
  doorUuids: z.array(z.string()).optional(),
  groupUuids: z.array(z.string()).optional(),
  name: z.string().optional(),
  resets: z.array(BaseFirstInReset).optional(),
  settingsUuid: z.string().optional(),
  userUuids: z.array(z.string()).optional()
});
const Accesscontrol_firstin_UpdateLocationFirstInSettingsWSResponse: z.ZodObject<any> = z.object({
  settings: LocationFirstInSettings.optional()
});
const Accesscontrol_lockdownplan_ActivateLockdownForLocationViaRhombusKeyWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  lockdownPlanUuids: z.array(z.string()).optional(),
  stateUpdatedAtMillis: z.number().int().optional()
});
const LockdownActivationResultEnumType = z.string();
const Accesscontrol_lockdownplan_ActivateLockdownForLocationViaRhombusKeyWSResponse: z.ZodObject<any> = z.object({
  result: LockdownActivationResultEnumType.optional(),
  state: LocationLockdownStateType.optional()
});
const Accesscontrol_lockdownplan_ActivateLockdownForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  lockdownPlanUuids: z.array(z.string()).optional(),
  stateUpdatedAtMillis: z.number().int().optional()
});
const Accesscontrol_lockdownplan_ActivateLockdownForLocationWSResponse: z.ZodObject<any> = z.object({
  result: LockdownActivationResultEnumType.optional(),
  state: LocationLockdownStateType.optional()
});
const Accesscontrol_lockdownplan_CreateLocationLockdownPlanWSRequest: z.ZodObject<any> = z.object({
  lockdownPlan: LocationLockdownPlanType.optional()
});
const Accesscontrol_lockdownplan_CreateLocationLockdownPlanWSResponse: z.ZodObject<any> = z.object({
  lockdownPlan: LocationLockdownPlanType.optional()
});
const ActivateLocationLockdownActionType: z.ZodObject<any> = z.object({
  locationLockdownPlanUuid: z.string().optional(),
  locationUuid: z.string().optional()
});
const AudioPlaybackActionType: z.ZodObject<any> = z.object({
  audioClipUuid: z.string().optional(),
  audioGateways: z.array(z.string()).optional(),
  loopDurationSec: z.number().int().optional(),
  playCount: z.number().int().optional()
});
const CancelLoopingAudioPlaybackActionType: z.ZodObject<any> = z.object({
  _audioDevices: z.array(z.string()).optional(),
  audioDevices: z.array(z.string()).optional()
});
const ConnectAudioDeviceToPhoneNumberActionType: z.ZodObject<any> = z.object({
  audioDeviceUuid: z.string().optional(),
  doorUuid: z.string().optional(),
  phoneNumber: z.string().optional()
});
const CustomLLMActionType: z.ZodObject<any> = z.object({
  deviceFacetUuids: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  promptUuid: z.string().optional(),
  timestampMs: z.number().int().optional()
});
const IntegrationEnum = z.string();
const IntegrationCommandActionType: z.ZodObject<any> = z.object({
  commandPayload: z.string().optional(),
  delaySecs: z.number().int().optional(),
  integration: IntegrationEnum.optional()
});
const IntegrationNotificationActionType: z.ZodObject<any> = z.object({
  integration: IntegrationEnum.optional(),
  notificationEntity: z.string().optional(),
  notificationTarget: z.string().optional()
});
const RemoteDoorUnlockSystemEnum = z.string();
const RemoteDoorUnlockActionType: z.ZodObject<any> = z.object({
  doorId: z.string().optional(),
  placeId: z.string().optional(),
  system: RemoteDoorUnlockSystemEnum.optional()
});
const ComponentRelayOutputType = z.string();
const GenericRelayStateEnumType = z.string();
const TriggerComponentRelayActionType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  outputType: ComponentRelayOutputType.optional(),
  overrideRelayDurationMs: z.number().int().optional(),
  overrideRelayDurationSec: z.number().int().optional(),
  ownerDeviceUuid: z.string().optional(),
  state: GenericRelayStateEnumType.optional(),
  version: z.number().int().optional()
});
const WebhookActionType: z.ZodObject<any> = z.object({
  webhookUrl: z.string().optional()
});
const RuleActionType: z.ZodObject<any> = z.object({
  activateLocationLockdown: ActivateLocationLockdownActionType.optional(),
  alertAction: z.boolean().optional(),
  audioPlaybackActions: z.array(AudioPlaybackActionType).optional(),
  cancelLoopingAudioPlaybackAction: CancelLoopingAudioPlaybackActionType.optional(),
  connectAudioDeviceToPhoneNumberAction: ConnectAudioDeviceToPhoneNumberActionType.optional(),
  customLLMActions: z.array(CustomLLMActionType).optional(),
  integrationCommandActions: z.array(IntegrationCommandActionType).optional(),
  integrationNotificationActions: z.array(IntegrationNotificationActionType).optional(),
  liveNotificationAction: z.boolean().optional(),
  remoteDoorUnlockActions: z.array(RemoteDoorUnlockActionType).optional(),
  triggerComponentRelayActions: z.array(TriggerComponentRelayActionType).optional(),
  webhookActions: z.array(WebhookActionType).optional()
});
const RuleFilterType: z.ZodObject<any> = z.object({
  scheduleUuids: z.array(z.string()).optional(),
  triggerBackoffSecs: z.number().int().optional()
});
const Accesscontrol_lockdownplan_ExternalLockdownPlanRuleType: z.ZodObject<any> = z.object({
  action: RuleActionType.optional(),
  locationUuid: z.string().optional(),
  ruleFilters: RuleFilterType.optional(),
  ruleName: z.string().optional(),
  ruleUuid: z.string().optional(),
  triggerActivity: ActivityEnum.optional()
});
const Accesscontrol_lockdownplan_CreateLockdownRuleForLocationWSRequest: z.ZodObject<any> = z.object({
  rule: Accesscontrol_lockdownplan_ExternalLockdownPlanRuleType.optional()
});
const Accesscontrol_lockdownplan_CreateLockdownRuleForLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  ruleUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_DeactivateLockdownForLocationViaRhombusKeyWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  stateUpdatedAtMillis: z.number().int().optional()
});
const LockdownDeactivationResultEnumType = z.string();
const Accesscontrol_lockdownplan_DeactivateLockdownForLocationViaRhombusKeyWSResponse: z.ZodObject<any> = z.object({
  result: LockdownDeactivationResultEnumType.optional(),
  state: LocationLockdownStateType.optional()
});
const Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  stateUpdatedAtMillis: z.number().int().optional()
});
const Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSResponse: z.ZodObject<any> = z.object({
  result: LockdownDeactivationResultEnumType.optional(),
  state: LocationLockdownStateType.optional()
});
const Accesscontrol_lockdownplan_DeleteLocationLockdownStateWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_DeleteLocationLockdownStateWSResponse = z.record(z.unknown());
const Accesscontrol_lockdownplan_DeleteLockdownPlanWSRequest: z.ZodObject<any> = z.object({
  lockdownPlanUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_DeleteLockdownPlanWSResponse: z.ZodObject<any> = z.object({
  lockdownPlanUuid: z.string().optional(),
  orgUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_DeleteLockdownRuleForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  ruleUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_DeleteLockdownRuleForLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Accesscontrol_lockdownplan_DisableLockdownTestModeForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_DisableLockdownTestModeForLocationWSResponse: z.ZodObject<any> = z.object({
  state: LocationLockdownStateType.optional()
});
const Accesscontrol_lockdownplan_EnableLockdownTestModeForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_EnableLockdownTestModeForLocationWSResponse: z.ZodObject<any> = z.object({
  state: LocationLockdownStateType.optional()
});
const Accesscontrol_lockdownplan_FindLocationLockdownEventsWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  locationUuid: z.string()
});
const LockdownEventOriginatorEnumType = z.string();
const BaseLocationLockdownEventOriginator: z.ZodObject<any> = z.object({
  type: LockdownEventOriginatorEnumType.optional()
});
const LockdownStateEventEnumType = z.string();
const BaseLockdownStateEventType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  followingTestPlan: z.boolean().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  originator: BaseLocationLockdownEventOriginator.optional(),
  stateChangedAtMillis: z.number().int().optional(),
  type: LockdownStateEventEnumType.optional()
});
const Accesscontrol_lockdownplan_FindLocationLockdownEventsWSResponse: z.ZodObject<any> = z.object({
  events: z.array(BaseLockdownStateEventType).optional()
});
const Accesscontrol_lockdownplan_FindLocationLockdownStatesWSRequest: z.ZodObject<any> = z.object({
  stateFilter: z.array(LocationLockdownStateEnumType).optional()
});
const Accesscontrol_lockdownplan_FindLocationLockdownStatesWSResponse: z.ZodObject<any> = z.object({
  states: z.array(LocationLockdownStateType).optional()
});
const Accesscontrol_lockdownplan_FindLockdownPlansByLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_FindLockdownPlansByLocationWSResponse: z.ZodObject<any> = z.object({
  lockdownPlans: z.array(BaseLockdownPlanType).optional()
});
const Accesscontrol_lockdownplan_FindLockdownPlansWSRequest = z.record(z.unknown());
const Accesscontrol_lockdownplan_FindLockdownPlansWSResponse: z.ZodObject<any> = z.object({
  lockdownPlans: z.array(BaseLockdownPlanType).optional()
});
const Accesscontrol_lockdownplan_GetLockdownPlanWSRequest: z.ZodObject<any> = z.object({
  lockdownPlanUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_GetLockdownPlanWSResponse: z.ZodObject<any> = z.object({
  lockdownPlan: BaseLockdownPlanType.optional()
});
const Accesscontrol_lockdownplan_GetLockdownRulesForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_GetLockdownRulesForLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rules: z.array(Accesscontrol_lockdownplan_ExternalLockdownPlanRuleType).optional()
});
const Accesscontrol_lockdownplan_GetOrCreateLocationLockdownStateWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Accesscontrol_lockdownplan_GetOrCreateLocationLockdownStateWSResponse: z.ZodObject<any> = z.object({
  state: LocationLockdownStateType.optional()
});
const Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSRequest: z.ZodObject<any> = z.object({
  activationPlan: LockdownActivationPlanType.optional(),
  deactivationPlan: LockdownDeactivationPlanType.optional(),
  defaultLockdownState: DoorLockdownStateEnumType.optional(),
  doorLockdownStateMap: z.record(z.unknown()).optional(),
  lockdownPlanUuid: z.string().optional(),
  name: z.string().optional(),
  physicalAccess: LockdownPhysicalAccessType.optional(),
  testPlan: LockdownTestPlanType.optional()
});
const Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSResponse: z.ZodObject<any> = z.object({
  lockdownPlan: LocationLockdownPlanType.optional()
});
const Accesscontrol_qr_GenerateQRAccessCodeWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  auditPrincipal: z.string().optional(),
  validDurationSec: z.number().int().optional()
});
const Accesscontrol_qr_GenerateQRAccessCodeWSResponse: z.ZodObject<any> = z.object({
  accessTokenUuid: z.string().optional(),
  qrCode: z.array(z.string()).optional()
});
const Accesscontrol_qr_GetQRAccessCodesWSRequest = z.record(z.unknown());
const Accesscontrol_qr_QRAccessCodeType: z.ZodObject<any> = z.object({
  accesTokenUuid: z.string().optional(),
  auditPrincipal: z.string().optional(),
  doorUuid: z.string().optional(),
  expirationTimeSec: z.number().int().optional()
});
const Accesscontrol_qr_GetQRAccessCodesWSResponse: z.ZodObject<any> = z.object({
  qrAccessCodes: z.array(Accesscontrol_qr_QRAccessCodeType).optional()
});
const Action = z.string();
const ActivateLocationLockdownActionRecordType: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  lockdownPlanUuid: z.string().optional(),
  succeeded: z.boolean().optional()
});
const AddOnLicense = z.string();
const PerceptionType = z.string();
const AddOnLicenseInvoiceType: z.ZodObject<any> = z.object({
  cloudArchiveDays: z.number().int().optional(),
  count: z.number().int().optional(),
  description: z.string().optional(),
  license: AddOnLicense.optional(),
  perceptionTypes: z.array(PerceptionType).optional(),
  price: z.number().optional()
});
const LicenseStateStats: z.ZodObject<any> = z.object({
  claimedCount: z.number().int().optional(),
  expiredCount: z.number().int().optional(),
  notRenewedCount: z.number().int().optional(),
  pendingReturnCount: z.number().int().optional(),
  permanentlyExpiredCount: z.number().int().optional(),
  renewedCount: z.number().int().optional()
});
const DeviceLicenseFamilyStats: z.ZodObject<any> = z.object({
  assignedCount: z.number().int().optional(),
  deviceLicenseFamily: z.string().optional(),
  lastEndDate: z.string().datetime({ offset: true }).optional(),
  nearExpirationCount: z.number().int().optional(),
  nextEndDate: z.string().datetime({ offset: true }).optional(),
  stateStats: LicenseStateStats.optional(),
  totalCount: z.number().int().optional()
});
const AddOnLicenseStats: z.ZodObject<any> = z.object({
  addOnLicenseType: AddOnLicense.optional(),
  assignedCount: z.number().int().optional(),
  deviceLicenseFamilyStats: z.array(DeviceLicenseFamilyStats).optional(),
  lastEndDate: z.string().datetime({ offset: true }).optional(),
  nearExpirationCount: z.number().int().optional(),
  nextEndDate: z.string().datetime({ offset: true }).optional(),
  stateStats: LicenseStateStats.optional(),
  totalCount: z.number().int().optional()
});
const rctpRMAType: z.ZodObject<any> = z.object({
  falseReport: z.boolean().optional(),
  rectified: z.boolean().optional(),
  rmauuid: z.string().optional()
});
const AdvancedRMAType: z.ZodObject<any> = z.object({
  invoiceNeeded: z.boolean().optional(),
  knownIssue: z.boolean().optional(),
  managerialApproved: z.boolean().optional(),
  managerialApprovedRMAs: rctpRMAType.optional(),
  rctpPartnerRequested: z.boolean().optional(),
  rctpPartnerUuid: z.string().optional(),
  rctpRMAs: rctpRMAType.optional()
});
const AirQualityIndexPollutantEnum = z.string();
const AlertActionStatusEnum = z.string();
const AlertActionRecordType: z.ZodObject<any> = z.object({
  policyAlertUuid: z.string().optional(),
  status: AlertActionStatusEnum.optional()
});
const AlertMonitoringCatalogItem: z.ZodObject<any> = z.object({
  durationMonths: z.number().int().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional()
});
const AlertMonitoringRulesEventTypeEnum = z.string();
const AlertMonitoringEventRecordType: z.ZodObject<any> = z.object({
  alertMonitoringEventType: AlertMonitoringRulesEventTypeEnum.optional(),
  locationUuid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  threatCaseUuid: z.string().optional(),
  timestampMs: z.number().int().optional()
});
const License = z.string();
const AlertMonitoringLicenseType: z.ZodObject<any> = z.object({
  allowedDeviceCount: z.number().int().optional(),
  claimKeyUuid: z.string().optional(),
  createdOn: z.string().datetime({ offset: true }).optional(),
  deviceUuids: z.array(z.string()).optional(),
  firstAssignedDate: z.string().datetime({ offset: true }).optional(),
  licenseToUnassignEmailState: z.string().optional(),
  licenseType: License.optional(),
  locationUuid: z.string().optional(),
  maxDeleteDate: z.string().datetime({ offset: true }).optional(),
  monthlyVerificationLimit: z.number().int().optional(),
  monthsReset: z.number().int().optional(),
  orgUuid: z.string().optional(),
  percentUsage: z.number().optional(),
  priorClaimKeyUuid: z.string().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional(),
  remainingAlarms: z.number().int().optional(),
  remainingVerifications: z.number().int().optional(),
  state: z.string().optional(),
  trial: z.boolean().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional(),
  warningStage: z.number().int().optional()
});
const AlertMonitoringPIN: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  description: z.string().max(255).optional(),
  endDateEpochSecExclusive: z.number().int().optional(),
  locationUuids: z.array(z.string()),
  name: z.string().max(64).optional(),
  orgUuid: z.string().optional(),
  rotatedAtMillis: z.number().int().optional(),
  rotationPeriodDays: z.number().int().min(1).optional(),
  shared: z.boolean().optional(),
  startDateEpochSecInclusive: z.number().int().optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuids: z.array(z.string()).optional(),
  uuid: z.string().optional(),
  value: z.string().min(4).max(16)
});
const AlertMonitoringPinType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  pin: z.string().optional()
});
const RuleTriggerTypeEnum = z.string();
const AlertMonitoringRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const NoonlightPromptTheme = z.string();
const AlertMonitoringSubmissionDelayIntervalType: z.ZodObject<any> = z.object({
  escalationDelayMinutes: z.number().int().optional(),
  minuteOfWeekStart: z.number().int().optional(),
  minuteOfWeekStop: z.number().int().optional(),
  promptTheme: NoonlightPromptTheme.optional()
});
const ThreatCaseStatus = z.string();
const ThreatCaseTimelineEventTypeEnum = z.string();
const ThreatCaseTimelineEventType: z.ZodObject<any> = z.object({
  alertUuid: z.string().optional(),
  message: z.string().optional(),
  noonlightVerificationId: z.string().optional(),
  timestampSec: z.number().int().optional(),
  type: ThreatCaseTimelineEventTypeEnum.optional(),
  userUuid: z.string().optional()
});
const VerificationRecord: z.ZodObject<any> = z.object({
  alertUuid: z.string().optional(),
  clipVerificationId: z.string().optional(),
  failedAsClip: z.boolean().optional(),
  failedAsStream: z.boolean().optional(),
  sentAsClip: z.boolean().optional(),
  sentAsClipAtMs: z.number().int().optional(),
  sentAsWindowedStream: z.boolean().optional(),
  sentAsWindowedStreamAtMs: z.number().int().optional(),
  streamVerificationId: z.string().optional()
});
const VerificationHistory: z.ZodObject<any> = z.object({
  alertIndex: z.number().int().optional(),
  currentVerification: VerificationRecord.optional(),
  verificationRecords: z.array(VerificationRecord).optional()
});
const AlertMonitoringThreatCaseType: z.ZodObject<any> = z.object({
  associatedDeviceUuids: z.record(z.unknown()).optional(),
  createdAtMillis: z.number().int().optional(),
  deleted: z.boolean().optional(),
  deviceUuid: z.string().optional(),
  locationName: z.string().optional(),
  locationUuid: z.string().optional(),
  noonlightAlarmId: z.string().optional(),
  noonlightVerificationId: z.string().optional(),
  orgUuid: z.string().optional(),
  policyAlertUuid: z.string().optional(),
  policyAlertUuids: z.array(z.string()).optional(),
  promptTheme: NoonlightPromptTheme.optional(),
  promptTitle: z.string().optional(),
  sharedClipGroupUuid: z.string().optional(),
  sirenSettings: AMSirenSettingsType.optional(),
  status: ThreatCaseStatus.optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  submissionTimestampMs: z.number().int().optional(),
  submitDelayExpireTimestampMs: z.number().int().optional(),
  timelineEventList: z.array(ThreatCaseTimelineEventType).optional(),
  uuid: z.string().optional(),
  verificationHistory: VerificationHistory.optional()
});
const Alertmonitoring_AMDeviceHistogramItem: z.ZodObject<any> = z.object({
  count: z.number().int().optional(),
  deviceName: z.string().optional(),
  deviceUuid: z.string().optional()
});
const Alertmonitoring_AcceptAlertMonitoringTermsOfServiceForLocationRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Alertmonitoring_AcceptAlertMonitoringTermsOfServiceRequest = z.record(z.unknown());
const Alertmonitoring_AcceptAlertMonitoringTermsOfServiceResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const NoonlightPromptSelection: z.ZodObject<any> = z.object({
  mutable: z.boolean().optional(),
  orgUuid: z.string().optional(),
  reasons: z.array(z.string()).optional(),
  title: z.string().optional()
});
const Alertmonitoring_AddPromptThreatQualificationsWSRequest: z.ZodObject<any> = z.object({
  threatQualification: NoonlightPromptSelection.optional()
});
const Alertmonitoring_AddPromptThreatQualificationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_AmModifiedBy: z.ZodObject<any> = z.object({
  armed: z.boolean().optional(),
  email: z.string().optional(),
  event: z.string().optional(),
  timestamp: z.number().int().optional(),
  userUuid: z.string().optional()
});
const Alertmonitoring_CancelThreatCaseWSRequest: z.ZodObject<any> = z.object({
  pin: z.string().optional(),
  uuid: z.string().optional()
});
const Alertmonitoring_CancelThreatCaseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  success: z.boolean().optional()
});
const Alertmonitoring_CountType: z.ZodObject<any> = z.object({
  dayOfMonth: z.number().int().optional(),
  deactivated: z.number().int().optional(),
  month: z.number().int().optional(),
  value: z.number().int().optional()
});
const Alertmonitoring_CreateCustomPinForNoonlightWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  pin: z.string().optional()
});
const Alertmonitoring_CreateCustomPinForNoonlightWSResponse: z.ZodObject<any> = z.object({
  alreadyExists: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const EmergencyContact: z.ZodObject<any> = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional()
});
const EmergencyResponseContactsScheduleType: z.ZodObject<any> = z.object({
  deviceUuids: z.array(z.string()).optional(),
  emergencyContactList: z.array(EmergencyContact).optional(),
  scheduleUuid: z.string().optional()
});
const TripwireSettingsType: z.ZodObject<any> = z.object({
  intervalSeconds: z.number().int().optional(),
  threshold: z.number().int().optional()
});
const NoonlightScheduleType: z.ZodObject<any> = z.object({
  audioGateways: z.array(z.string()).optional(),
  escalationDelayMinutes: z.number().int().optional(),
  monitoredDevices: z.array(z.string()).optional(),
  promptTheme: NoonlightPromptTheme.optional(),
  promptTitle: z.string().optional(),
  scheduleUuid: z.string().optional(),
  sirenSettings: z.record(z.unknown()).optional(),
  triggerSet: z.array(ActivityEnum).optional(),
  tripwire: TripwireSettingsType.optional(),
  uuid: z.string().optional(),
  verifiedThreatSiren: AMSirenSettingsType.optional()
});
const NoonlightVersionedSettingsType: z.ZodObject<any> = z.object({
  acceptedTermsOfService: z.boolean().optional(),
  badgeAuthDisablesMonitoring: z.boolean().optional(),
  defaultDelay: z.number().int().optional(),
  defaultEmergencyContact: EmergencyContact.optional(),
  defaultPromptTheme: NoonlightPromptTheme.optional(),
  deleted: z.boolean().optional(),
  emergencyContacts: z.array(EmergencyResponseContactsScheduleType).optional(),
  enabled: z.boolean().optional(),
  entryInstructions: z.string().optional(),
  locationUuid: z.string().optional(),
  manualEscalationSettings: NoonlightScheduleType.optional(),
  modifiedByEmail: z.string().optional(),
  modifiedByIntegration: z.boolean().optional(),
  modifiedByMetadata: z.string().optional(),
  modifiedByUuid: z.string().optional(),
  modifiedTimeMs: z.number().int().optional(),
  monitoringMode: z.string().optional(),
  oneTimePauses: z.array(NoonlightScheduleType).optional(),
  oneTimeSchedules: z.array(NoonlightScheduleType).optional(),
  orgUuid: z.string().optional(),
  pins: z.array(AlertMonitoringPinType).optional(),
  rules: z.array(z.string()).optional(),
  schedules: z.array(NoonlightScheduleType).optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  talkdownEnabled: z.boolean().optional()
});
const Alertmonitoring_CreateNoonlightSettingsForLocationRequest: z.ZodObject<any> = z.object({
  noonlightSettings: NoonlightVersionedSettingsType.optional()
});
const Alertmonitoring_CreateNoonlightSettingsForLocationResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_CreatePinForNoonlightWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional()
});
const Alertmonitoring_CreatePinForNoonlightWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  pin: z.string().optional()
});
const Alertmonitoring_CumulativeChartData: z.ZodObject<any> = z.object({
  cumulativeMonthlyVerifications: z.array(Alertmonitoring_CountType).optional(),
  dailyVerifications: z.array(Alertmonitoring_CountType).optional()
});
const Alertmonitoring_DeleteNoonlightSettingsForLocationRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Alertmonitoring_DeleteNoonlightSettingsForLocationResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_DeletePinForNoonlightWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  pin: z.string().optional()
});
const Alertmonitoring_DeletePinForNoonlightWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_DeletePromptThreatQualificationByTitleWSRequest: z.ZodObject<any> = z.object({
  title: z.string().optional()
});
const Alertmonitoring_DeletePromptThreatQualificationByTitleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_DisableLocationRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  pin: z.string().optional()
});
const Alertmonitoring_DisableLocationResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_DismissThreatCaseWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional(),
  pin: z.string().optional(),
  uuid: z.string().optional()
});
const Alertmonitoring_DismissThreatCaseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  success: z.boolean().optional()
});
const Alertmonitoring_EnableLocationRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  pin: z.string().optional()
});
const Alertmonitoring_EnableLocationResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_EscalateThreatCaseToAlarmWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional(),
  uuid: z.string().optional()
});
const Alertmonitoring_EscalateThreatCaseToAlarmWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_GenerateMonthlyVerificationsForYearReportForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuids: z.array(z.string()).optional()
});
const Alertmonitoring_GenerateMonthlyVerificationsForYearReportForLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  verificationsPerMonthPerLocation: z.record(z.unknown()).optional()
});
const Alertmonitoring_GenerateReportDataForLocationWSRequest: z.ZodObject<any> = z.object({
  endTimeMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  startTimeMs: z.number().int().optional()
});
const DeviceTypeEnum = z.string();
const Alertmonitoring_ThreatCaseReportItem: z.ZodObject<any> = z.object({
  alertNotFound: z.boolean().optional(),
  alertTypes: z.array(ActivityEnum).optional(),
  associatedDeviceUuids: z.record(z.unknown()).optional(),
  createdAtMillis: z.number().int().optional(),
  deleted: z.boolean().optional(),
  deviceName: z.string().optional(),
  deviceNotFound: z.boolean().optional(),
  deviceType: DeviceTypeEnum.optional(),
  deviceUuid: z.string().optional(),
  locationName: z.string().optional(),
  locationUuid: z.string().optional(),
  noonlightAlarmId: z.string().optional(),
  noonlightVerificationId: z.string().optional(),
  orgUuid: z.string().optional(),
  policyAlertUuid: z.string().optional(),
  policyAlertUuids: z.array(z.string()).optional(),
  promptTheme: NoonlightPromptTheme.optional(),
  promptTitle: z.string().optional(),
  reason: z.string().optional(),
  result: z.string().optional(),
  sharedClipGroupUuid: z.string().optional(),
  sirenSettings: AMSirenSettingsType.optional(),
  status: ThreatCaseStatus.optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  submissionTimestampMs: z.number().int().optional(),
  submitDelayExpireTimestampMs: z.number().int().optional(),
  timelineEventList: z.array(ThreatCaseTimelineEventType).optional(),
  uuid: z.string().optional(),
  verificationHistory: VerificationHistory.optional()
});
const Alertmonitoring_GenerateReportDataForLocationWSResponse: z.ZodObject<any> = z.object({
  cumulativeChartData: Alertmonitoring_CumulativeChartData.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  modifiedBy: z.array(Alertmonitoring_AmModifiedBy).optional(),
  threatCaseReportItems: z.array(Alertmonitoring_ThreatCaseReportItem).optional(),
  threatCases: z.array(z.string()).optional(),
  verificationsByDevice: z.array(Alertmonitoring_AMDeviceHistogramItem).optional()
});
const Alertmonitoring_GetAlertMonitoringTripwireGroupCountWSRequest: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional()
});
const Alertmonitoring_GetAlertMonitoringTripwireGroupCountWSResponse: z.ZodObject<any> = z.object({
  count: z.number().int().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_GetMonitoredDoorSensorsForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string()
});
const HardwareVariationEnum = z.string();
const Door_MinimalDoorStateType: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  batteryPercent: z.number().int().optional(),
  closestBaseStation: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  health: z.string().optional(),
  healthDetails: z.string().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lastSeenSec: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  sensorUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  signalStrength: z.number().int().optional(),
  status: z.string().optional()
});
const Alertmonitoring_GetMonitoredDoorSensorsForLocationWSResponse: z.ZodObject<any> = z.object({
  doorStates: z.array(Door_MinimalDoorStateType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_GetNoonlightSettingsForLocationWSRequest: z.ZodObject<any> = z.object({
  includePreviousVersions: z.boolean().optional(),
  locationUuid: z.string().optional()
});
const MonitoringEnableStatus: z.ZodObject<any> = z.object({
  devicesWithActiveSirens: z.record(z.unknown()).optional(),
  disabledOnMs: z.number().int().optional(),
  enabled: z.boolean().optional(),
  enabledOnMs: z.number().int().optional(),
  noNextTimestampReason: z.string().optional(),
  notEnabledReason: z.string().optional(),
  recentlyActivatedSirensTimestampMs: z.record(z.unknown()).optional()
});
const Alertmonitoring_NoonlightWSSettings: z.ZodObject<any> = z.object({
  acceptedTermsOfService: z.boolean().optional(),
  badgeAuthDisablesMonitoring: z.boolean().optional(),
  defaultDelay: z.number().int().optional(),
  defaultEmergencyContact: EmergencyContact.optional(),
  defaultPromptTheme: NoonlightPromptTheme.optional(),
  deleted: z.boolean().optional(),
  disabledOnMs: z.number().int().optional(),
  emergencyContacts: z.array(EmergencyResponseContactsScheduleType).optional(),
  enabled: z.boolean().optional(),
  enabledOnMs: z.number().int().optional(),
  entryInstructions: z.string().optional(),
  locationUuid: z.string().optional(),
  manualEscalationSettings: NoonlightScheduleType.optional(),
  modifiedByEmail: z.string().optional(),
  modifiedByIntegration: z.boolean().optional(),
  modifiedByMetadata: z.string().optional(),
  modifiedByUuid: z.string().optional(),
  modifiedTimeMs: z.number().int().optional(),
  monitoringMode: z.string().optional(),
  oneTimePauses: z.array(NoonlightScheduleType).optional(),
  oneTimeSchedules: z.array(NoonlightScheduleType).optional(),
  orgUuid: z.string().optional(),
  pins: z.array(AlertMonitoringPinType).optional(),
  rules: z.array(z.string()).optional(),
  schedules: z.array(NoonlightScheduleType).optional(),
  status: MonitoringEnableStatus.optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  talkdownEnabled: z.boolean().optional()
});
const Alertmonitoring_GetNoonlightSettingsForLocationWSResponse: z.ZodObject<any> = z.object({
  alertMonitoringSettings: Alertmonitoring_NoonlightWSSettings.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  previousVersions: z.array(NoonlightVersionedSettingsType).optional()
});
const Alertmonitoring_GetNoonlightSettingsWSRequest = z.record(z.unknown());
const Alertmonitoring_GetNoonlightSettingsWSResponse: z.ZodObject<any> = z.object({
  alertMonitoringSettings: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_GetPromptThreatQualificationsWSRequest = z.record(z.unknown());
const Alertmonitoring_GetPromptThreatQualificationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  threatQualifications: z.array(NoonlightPromptSelection).optional()
});
const Alertmonitoring_LocationStatusWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Alertmonitoring_LocationStatusWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  status: MonitoringEnableStatus.optional()
});
const Alertmonitoring_OrgStatusWSRequest: z.ZodObject<any> = z.object({
  includeDeleted: z.boolean().optional()
});
const Alertmonitoring_OrgStatusWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  locationStatuses: z.record(z.unknown()).optional()
});
const Alertmonitoring_ResetAlertMonitoringTripwireGroupCountWSRequest: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional(),
  timestampMs: z.number().int().optional()
});
const Alertmonitoring_ResetAlertMonitoringTripwireGroupCountWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_UpdateNoonlightSettingsForLocationRequest: z.ZodObject<any> = z.object({
  noonlightSettings: NoonlightVersionedSettingsType.optional()
});
const Alertmonitoring_UpdateNoonlightSettingsForLocationResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_UpdatePromptThreatQualificationWSRequest: z.ZodObject<any> = z.object({
  promptSelection: NoonlightPromptSelection.optional()
});
const Alertmonitoring_UpdatePromptThreatQualificationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Alertmonitoring_pin_BasePinWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  pin: AlertMonitoringPIN.optional()
});
const Alertmonitoring_pin_BulkPinsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedUsers: z.array(z.string()).optional(),
  pins: z.array(AlertMonitoringPIN).optional()
});
const Alertmonitoring_pin_BulkProvisionPinsWSRequest: z.ZodObject<any> = z.object({
  endDateEpochSecExclusive: z.number().int().min(0).optional(),
  locationUuids: z.array(z.string()),
  notifyUsers: z.boolean().optional(),
  pinLength: z.number().int().min(4).max(16),
  rotationPeriodDays: z.number().int().min(1).optional(),
  startDateEpochSecInclusive: z.number().int().min(0).optional(),
  userUuids: z.array(z.string())
});
const Alertmonitoring_pin_BulkRotatePinsWSRequest: z.ZodObject<any> = z.object({
  notifyUsers: z.boolean().optional(),
  pinLength: z.number().int().min(4).max(16),
  pinUuids: z.array(z.string())
});
const Alertmonitoring_pin_CreatePinWSRequest: z.ZodObject<any> = z.object({
  notifyUser: z.boolean().optional(),
  pin: AlertMonitoringPIN
});
const Alertmonitoring_pin_DeletePinWSRequest: z.ZodObject<any> = z.object({
  pinUuid: z.string()
});
const Alertmonitoring_pin_FindPinsByLocationAndUserWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const PinStatus = z.string();
const PinQueryFilter: z.ZodObject<any> = z.object({
  statusFilter: z.array(PinStatus).optional()
});
const DynamoPageRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Alertmonitoring_pin_FindPinsByOrgWSRequest: z.ZodObject<any> = z.object({
  filter: PinQueryFilter.optional(),
  pageRequest: DynamoPageRequest.optional()
});
const Alertmonitoring_pin_FindPinsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lastEvaluatedKey: z.string().optional(),
  pins: z.array(AlertMonitoringPIN).optional()
});
const Alertmonitoring_pin_GetAvailableALMPinCodeWSRequest: z.ZodObject<any> = z.object({
  pinLength: z.number().int()
});
const Alertmonitoring_pin_GetAvailableALMPinCodeWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  pinCode: z.string().optional()
});
const Alertmonitoring_pin_GetPinWSRequest: z.ZodObject<any> = z.object({
  pinUuid: z.string()
});
const Alertmonitoring_pin_RotatePinWSRequest: z.ZodObject<any> = z.object({
  notifyUser: z.boolean().optional(),
  pinUuid: z.string()
});
const Alertmonitoring_pin_UpdatePinWSRequest: z.ZodObject<any> = z.object({
  notifyUser: z.boolean().optional(),
  pin: AlertMonitoringPIN,
  selectiveUpdate: z.boolean().optional()
});
const CroppedPermyriadRect: z.ZodObject<any> = z.object({
  height: z.number().int().optional(),
  width: z.number().int().optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional()
});
const AspectRatio: z.ZodObject<any> = z.object({
  height: z.number().int().optional(),
  width: z.number().int().optional()
});
const DewarpedView: z.ZodObject<any> = z.object({
  aspectRatio: AspectRatio.optional(),
  pitchDegrees: z.number().optional(),
  rollDegrees: z.number().optional(),
  verticalFieldOfViewDegrees: z.number().int().optional(),
  yawDegrees: z.number().optional()
});
const AlteredView: z.ZodObject<any> = z.object({
  crop: CroppedPermyriadRect.optional(),
  dewarp: DewarpedView.optional()
});
const AmtSettings: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  email: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  password: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  webhookId: z.number().int().optional(),
  webhookSignatureSecret: z.string().optional()
});
const AperioActivatorStateEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const ComponentBaseEnumType = z.string();
const ComponentEnumType = z.string();
const AperioDoorExtension: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const ComponentShadowEnumType = z.string();
const DtcInfo: z.ZodObject<any> = z.object({
  code: z.array(z.string()).optional(),
  failing: z.boolean().optional(),
  hasFailed: z.boolean().optional(),
  testCompleted: z.boolean().optional(),
  time: z.number().int().optional()
});
const AperioDoorExtensionShadow: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const AperioDoorExtensionStateEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const AperioDoorHandleStateEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const AperioDoorModeEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const DoorPositionIndicatorEnumType = z.string();
const NormalStateEnumType = z.string();
const AperioDoorPositionIndicator: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const DoorReaderEnumType = z.string();
const AperioDoorReader: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const DoorRelayEnumType = z.string();
const AperioDoorRelay: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const RequestToExitEnumType = z.string();
const AperioDoorRequestToExit: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const AperioDtcEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const AperioGateway: z.ZodObject<any> = z.object({
  aperioGatewayId: z.array(z.string()).optional(),
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  hwVersion: z.array(z.string()).optional(),
  name: z.string().optional(),
  oemCode: z.string().optional(),
  oemGeneratedAtMs: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const AperioGatewayConnectionStateChangeEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const AperioGatewayShadow: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const AperioGatewayStateEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const AperioKeyCylinderStateEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const AperioTamperStateEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const AperioType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const ApiClientTypeEnum = z.string();
const ApiTokenAuthTypeEnum = z.string();
const ApiTokenApplicationType: z.ZodObject<any> = z.object({
  authType: ApiTokenAuthTypeEnum.optional(),
  authenticationTokenHash: z.string().optional(),
  clientDetails: z.record(z.unknown()).optional(),
  clientType: ApiClientTypeEnum.optional(),
  csr: z.string().optional(),
  displayName: z.string().optional(),
  orgUuid: z.string().optional(),
  permissionGroupUuid: z.string().optional(),
  tokenUuid: z.string().optional()
});
const ApiTokenLockdownEventOriginator: z.ZodObject<any> = z.object({
  type: LockdownEventOriginatorEnumType.optional()
});
const ApiTokenType: z.ZodObject<any> = z.object({
  allowedRequetsPerSecond: z.number().int().optional(),
  authType: ApiTokenAuthTypeEnum.optional(),
  authenticationTokenHash: z.string().optional(),
  cert: z.string().optional(),
  certFingerprint: z.string().optional(),
  clientDetails: z.record(z.unknown()).optional(),
  clientType: ApiClientTypeEnum.optional(),
  csr: z.string().optional(),
  displayName: z.string().optional(),
  hashed: z.boolean().optional(),
  orgUuid: z.string().optional(),
  permissionGroupUuid: z.string().optional(),
  tokenUuid: z.string().optional()
});
const AudioExpressionDetectionConfig: z.ZodObject<any> = z.object({
  category: ActivityEnum.optional(),
  confidence_min: z.number().optional(),
  expression: z.string().optional(),
  loudness_min: z.number().int().optional()
});
const AudioGatewayStatusEnum = z.string();
const AudioLoudActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const AudioParamConfig: z.ZodObject<any> = z.object({
  expressions: z.array(AudioExpressionDetectionConfig).optional(),
  significant_loudness_min: z.number().int().optional()
});
const AudioPlaybackActionRecordType: z.ZodObject<any> = z.object({
  audioClipUuid: z.string().optional(),
  audioGatewayStatuses: z.record(z.unknown()).optional()
});
const AudioTriggerType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  threshold: z.number().int().optional()
});
const AudioScheduledTriggerType: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(AudioTriggerType).optional()
});
const AudioPolicyType: z.ZodObject<any> = z.object({
  defaultTriggers: z.array(AudioTriggerType).optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(AudioScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const AudioUploadMetadataType: z.ZodObject<any> = z.object({
  audioPlaintext: z.string().optional(),
  audioSSML: z.string().optional(),
  description: z.string().optional(),
  displayName: z.string().optional(),
  durationMs: z.number().int().optional(),
  mutable: z.boolean().optional(),
  orgUuid: z.string().optional(),
  s3ObjectKey: z.string().optional(),
  uuid: z.string().optional(),
  voiceId: z.string().optional()
});
const Audiogateway_AudioGatewayOfflineLanStreamingInfo: z.ZodObject<any> = z.object({
  accessToken: z.string().optional(),
  lanAddresses: z.array(z.string()).optional()
});
const Audiogateway_DeleteAudioGatewayWSRequest: z.ZodObject<any> = z.object({
  gatewayUuid: z.string().optional(),
  mummify: z.boolean().optional()
});
const Audiogateway_DeleteAudioGatewayWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: z.string().optional()
});
const Audiogateway_GetAudioGatewayConfigWSRequest: z.ZodObject<any> = z.object({
  audioGatewayUuid: z.string().optional()
});
const FrontendEqualizerSettings: z.ZodObject<any> = z.object({
  frequency: z.number().int().optional(),
  gain: z.number().int().optional(),
  q: z.number().int().optional()
});
const IAudioUserConfig: z.ZodObject<any> = z.object({
  audio_aec_via_software: z.boolean().optional(),
  audio_analysis_enabled: z.boolean().optional(),
  audio_analysis_params: AudioParamConfig.optional(),
  audio_external_mic_boost: z.number().int().optional(),
  audio_external_mic_volume: z.number().int().optional(),
  audio_external_speaker_volume: z.number().int().optional(),
  audio_internal_mic_aec_enabled: z.boolean().optional(),
  audio_internal_mic_boost: z.number().int().optional(),
  audio_internal_mic_volume: z.number().int().optional(),
  audio_internal_speaker_volume: z.number().int().optional(),
  audio_min_echo_amplitude: z.number().int().optional(),
  audio_playback_gain_percent: z.number().int().optional(),
  audio_record: z.boolean().optional(),
  audio_supported: z.boolean().optional(),
  audio_use_external_mic: z.boolean().optional(),
  audio_use_external_speaker: z.boolean().optional(),
  audio_use_internal_speaker: z.boolean().optional(),
  bandwidth_reports_disabled: z.boolean().optional(),
  cloud_archive_days: z.number().int().optional(),
  cloud_archive_target: z.string().optional(),
  cloud_archive_upload_schedule: z.array(WeeklyMinuteIntervalType).optional(),
  cloud_archive_upload_schedule_inverted: z.boolean().optional(),
  cloud_archive_upload_schedule_uuid: z.string().optional(),
  deviceUuid: z.string().optional(),
  device_mic_enabled: z.boolean().optional(),
  device_near_audio_silenced: z.boolean().optional(),
  device_speaker_enabled: z.boolean().optional(),
  event_clip_upload_target: z.string().optional(),
  firmware_dev_settings: z.record(z.unknown()).optional(),
  frontendEqualizerHighShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerLowShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking1: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking2: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking3: FrontendEqualizerSettings.optional(),
  frontendNoiseSuppression: z.boolean().optional(),
  lastModified: z.number().int().optional(),
  led_mode_blink_period_ms: z.number().int().optional(),
  led_mode_when_active: z.string().optional(),
  led_mode_when_inactive: z.string().optional(),
  led_stealth_mode: z.boolean().optional(),
  lightweight_detection_disabled: z.boolean().optional(),
  live_license_invalid: z.boolean().optional(),
  max_event_duration_ms: z.number().int().optional(),
  media_ttl_minutes: z.number().int().optional(),
  on_demand_license_invalid: z.boolean().optional(),
  orgUuid: z.string().optional(),
  snapshot_upload_target: z.string().optional(),
  splice_clip_upload_target: z.string().optional(),
  storage_target_free_megabytes: z.number().int().optional(),
  storage_target_free_space_permyriad: z.number().int().optional(),
  thumbstrip_upload_target: z.string().optional()
});
const Audiogateway_GetAudioGatewayConfigWSResponse: z.ZodObject<any> = z.object({
  config: IAudioUserConfig.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Audiogateway_GetAudioGatewayOfflineLanStreamingInfoWSRequest = z.record(z.unknown());
const Audiogateway_GetAudioGatewayOfflineLanStreamingInfoWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  info: z.record(z.unknown()).optional()
});
const Audiogateway_GetAudioSeekpointsWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  duration: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const SensorValType: z.ZodObject<any> = z.object({
  sensorBoolean: z.boolean().optional(),
  sensorDouble: z.number().optional(),
  sensorLong: z.number().int().optional()
});
const ToastCheckInfo: z.ZodObject<any> = z.object({
  totalAmount: z.number().optional()
});
const ToastOrderIdType: z.ZodObject<any> = z.object({
  employeeName: z.string().optional(),
  guid: z.string().optional(),
  locationName: z.string().optional(),
  restaurantName: z.string().optional(),
  toastCheckInfo: ToastCheckInfo.optional()
});
const FootageSeekPointV2Type: z.ZodObject<any> = z.object({
  a: ActivityEnum,
  al: z.boolean().optional(),
  cc: z.string().optional(),
  cd: z.string().optional(),
  cdn: z.string().optional(),
  dcao: z.boolean().optional(),
  fn: z.string().optional(),
  id: z.number().int().optional(),
  loudness: z.number().int().optional(),
  lp: z.string().optional(),
  m: z.boolean().optional(),
  p: z.string().optional(),
  ro: z.array(z.string()).optional(),
  sensorValType: SensorValType.optional(),
  toi: ToastOrderIdType.optional(),
  ts: z.number().int(),
  tu: z.string().optional(),
  uf: z.string().optional(),
  vn: z.string().optional()
});
const Audiogateway_GetAudioSeekpointsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageSeekPoints: z.array(FootageSeekPointV2Type).optional()
});
const Audiogateway_GetFullAudioGatewayStateWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  force: z.boolean().optional()
});
const DeviceStatusEnum = z.string();
const DeviceHealthStatusDetailsEnum = z.string();
const DeviceFacet = z.string();
const FullDeviceStateType: z.ZodObject<any> = z.object({
  afSupport: z.boolean().optional(),
  audioSupported: z.boolean().optional(),
  baseVideoOperationUri: z.string().optional(),
  connectionStatus: DeviceStatusEnum.optional(),
  connectionTimestampMs: z.number().int().optional(),
  createdAtMillis: z.number().int().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  directionRadians: z.number().optional(),
  externalIPAddress: z.string().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  firmwareUpdateInProgress: z.boolean().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  healthStatus: DeviceStatusEnum.optional(),
  healthStatusDetails: DeviceHealthStatusDetailsEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lanAddresses: z.array(z.string()).optional(),
  latestFirmwareVersion: z.string().optional(),
  latitude: z.number().optional(),
  liveStreamShared: z.boolean().optional(),
  liveStreamsSharedCount: z.number().int().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  maxZoomPercent: z.number().int().optional(),
  mediaRegion: z.string().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  onCameraState: z.record(z.unknown()).optional(),
  onCloudState: z.record(z.unknown()).optional(),
  policyUuid: z.string().optional(),
  region: z.string().optional(),
  secondaryLanAddresses: z.array(z.string()).optional(),
  serialNumber: z.string().optional(),
  ssid: z.string().optional(),
  stateUpdatedTimestampMs: z.number().int().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  supportedFacets: z.array(DeviceFacet).optional(),
  uuid: z.string().optional(),
  versionsBehind: z.number().int().optional(),
  wifiApMac: z.string().optional(),
  wifiBars: z.number().int().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const Audiogateway_GetFullAudioGatewayStateWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  fullAudioGatewayState: FullDeviceStateType.optional()
});
const Audiogateway_GetMediaUrisWSRequest: z.ZodObject<any> = z.object({
  gatewayUuid: z.string().optional()
});
const Audiogateway_GetMediaUrisWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lanCheckUrls: z.array(z.string()).optional(),
  lanLiveMpdUris: z.array(z.string()).optional(),
  lanLiveOpusUris: z.array(z.string()).optional(),
  lanVodMpdUrisTemplates: z.array(z.string()).optional(),
  wanLiveMpdUri: z.string().optional(),
  wanLiveOpusUri: z.string().optional(),
  wanVodMpdUriTemplate: z.string().optional()
});
const Audiogateway_GetMinimalAudioGatewayStatesWSRequest = z.record(z.unknown());
const MinimalAudioGatewayStateType: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  connectionStatus: DeviceStatusEnum.optional(),
  createdAtMillis: z.number().int().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  directionRadians: z.number().optional(),
  externalIPAddress: z.string().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  firmwareUpdateInProgress: z.boolean().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  healthStatus: DeviceStatusEnum.optional(),
  healthStatusDetails: DeviceHealthStatusDetailsEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lanAddresses: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  liveStreamShared: z.boolean().optional(),
  liveStreamsSharedCount: z.number().int().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mediaRegion: z.string().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  region: z.string().optional(),
  secondaryLanAddresses: z.array(z.string()).optional(),
  sensorUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  ssid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  supportedFacets: z.array(DeviceFacet).optional(),
  uuid: z.string().optional(),
  wifiApMac: z.string().optional(),
  wifiBars: z.number().int().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const Audiogateway_GetMinimalAudioGatewayStatesWSResponse: z.ZodObject<any> = z.object({
  audioGatewayStates: z.array(MinimalAudioGatewayStateType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Audiogateway_RebootAudioGatewayWSRequest: z.ZodObject<any> = z.object({
  audioGatewayUuid: z.string()
});
const Audiogateway_UpdateAudioGatewayConfigWSRequest: z.ZodObject<any> = z.object({
  audioExternalMicBoost: z.number().int().optional(),
  audioExternalMicVolume: z.number().int().optional(),
  audioExternalSpeakerVolume: z.number().int().optional(),
  audioInternalMicAecEnabled: z.boolean().optional(),
  audioInternalMicBoost: z.number().int().optional(),
  audioInternalMicVolume: z.number().int().optional(),
  audioInternalSpeakerVolume: z.number().int().optional(),
  audioRecord: z.boolean().optional(),
  audioUseExternalMic: z.boolean().optional(),
  audioUseExternalSpeaker: z.boolean().optional(),
  deviceMicEnabled: z.boolean().optional(),
  deviceSpeakerEnabled: z.boolean().optional(),
  frontendEqualizerHighShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerLowShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking1: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking2: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking3: FrontendEqualizerSettings.optional(),
  frontendNoiseSuppression: z.boolean().optional(),
  uuid: z.string().optional()
});
const Audiogateway_UpdateAudioGatewayConfigWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Audiogateway_UpdateAudioGatewayDetailsWSRequest: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  associatedCamerasUpdated: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedUpdated: z.boolean().optional(),
  description: z.string().optional(),
  descriptionUpdated: z.boolean().optional(),
  floorNumber: z.number().int().optional(),
  floorNumberUpdated: z.boolean().optional(),
  latitude: z.number().optional(),
  latitudeUpdated: z.boolean().optional(),
  locationUuid: z.string().optional(),
  locationUuidUpdated: z.boolean().optional(),
  longitude: z.number().optional(),
  longitudeUpdated: z.boolean().optional(),
  name: z.string().optional(),
  nameUpdated: z.boolean().optional(),
  policyUuid: z.string().optional(),
  policyUuidUpdated: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  subLocationsHierarchyKeyUpdated: z.boolean().optional(),
  uuid: z.string().optional()
});
const Audiogateway_UpdateAudioGatewayDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Audioplayback_CancelLoopingAudioPlaybackWSRequest: z.ZodObject<any> = z.object({
  audioDevices: z.array(z.string()).optional()
});
const Audioplayback_CancelLoopingAudioPlaybackWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  successMap: z.record(z.unknown()).optional()
});
const Audioplayback_DeleteAudioUploadMetadataWSRequest: z.ZodObject<any> = z.object({
  audioUploadUuid: z.string().optional()
});
const Audioplayback_DeleteAudioUploadMetadataWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Audioplayback_GetAudioUploadMetadataForOrgWSRequest = z.record(z.unknown());
const Audioplayback_GetAudioUploadMetadataForOrgWSResponse: z.ZodObject<any> = z.object({
  audioUploadMetadata: z.array(AudioUploadMetadataType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Audioplayback_PlayAudioUploadWSRequest: z.ZodObject<any> = z.object({
  audioGatewayUuids: z.array(z.string()).optional(),
  audioUploadUuid: z.string().optional(),
  loopDurationSec: z.number().int().optional(),
  playCount: z.number().int().optional()
});
const Audioplayback_PlayAudioUploadWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  success: z.boolean().optional()
});
const Audioplayback_UpdateAudioUploadMetadataWSRequest: z.ZodObject<any> = z.object({
  audioUploadUuid: z.string().optional(),
  newDescription: z.string().optional(),
  newDisplayName: z.string().optional()
});
const Audioplayback_UpdateAudioUploadMetadataWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Audioplayback_UploadAudioPcmWSResponse: z.ZodObject<any> = z.object({
  encodingFailure: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const Audioplayback_UploadAudioTextWSRequest: z.ZodObject<any> = z.object({
  audioPlaintext: z.string().optional(),
  audioSSML: z.string().optional(),
  description: z.string().optional(),
  displayName: z.string().optional(),
  voiceId: z.string().optional()
});
const Audioplayback_UploadAudioTextWSResponse: z.ZodObject<any> = z.object({
  encodingFailure: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  invalidSSML: z.boolean().optional(),
  synthesisFailure: z.boolean().optional(),
  uuid: z.string().optional()
});
const SimpleAuditEventType: z.ZodObject<any> = z.object({
  auditEvent: z.string().optional()
});
const AuditRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const AuthDecisionSourceEnum = z.string();
const NotificationFollowUp: z.ZodObject<any> = z.object({
  type: Action.optional()
});
const FollowUpAction: z.ZodObject<any> = z.object({
  type: Action.optional()
});
const FrequencyUnit = z.string();
const PromptFrequency: z.ZodObject<any> = z.object({
  frequency: z.number().int().optional(),
  unit: FrequencyUnit.optional()
});
const AutomatedPrompt: z.ZodObject<any> = z.object({
  apiKey: z.string().optional(),
  followUpActions: z.array(FollowUpAction).optional(),
  frequency: PromptFrequency.optional(),
  invokeAtMs: z.number().int().optional(),
  orgUuid: z.string().optional(),
  permissionGroupUuid: z.string().optional(),
  prompt: z.string().optional(),
  scheduleUuid: z.string().optional(),
  tokenUuid: z.string().optional(),
  uuid: z.string().optional()
});
const AuxiliaryEnumType = z.string();
const AuxiliaryInputPhysicalPortEnumType = z.string();
const SupervisionModeEnumType = z.string();
const PortSupervisionConfigurationType: z.ZodObject<any> = z.object({
  mode: SupervisionModeEnumType.optional()
});
const AuxiliaryInputPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: AuxiliaryInputPhysicalPortEnumType.optional(),
  supervisionConfiguration: PortSupervisionConfigurationType.optional()
});
const AuxiliaryRelayPhysicalPortEnumType = z.string();
const AuxiliaryRelayPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: AuxiliaryRelayPhysicalPortEnumType.optional()
});
const AvigilonAltaType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const AwsSettings: z.ZodObject<any> = z.object({
  accessKey: z.string().optional(),
  bucketName: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  secretKey: z.string().optional()
});
const BackblazeSettings: z.ZodObject<any> = z.object({
  applicationKey: z.string().optional(),
  applicationKeyId: z.string().optional(),
  bucketName: z.string().optional(),
  enabled: z.boolean().optional()
});
const BadgeIntegrationDefaultOptions: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  defaultOptionsEnabled: z.boolean().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  saveClips: z.boolean().optional()
});
const BadgeIntegrationDoorInfoType: z.ZodObject<any> = z.object({
  assignedCameraList: z.array(z.string()).optional(),
  clipDuration: z.number().int().optional(),
  doorName: z.string().optional(),
  leadingSeconds: z.number().int().optional(),
  locationUuid: z.string().optional(),
  remoteUnlock: z.boolean().optional()
});
const BadgeIntegrationRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const BadgeIntegrationSettings: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  misconfiguredDoors: z.array(z.number().int()).optional(),
  placeId: z.number().int().optional(),
  placeName: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  webhookId: z.number().int().optional()
});
const Badgereader_DeleteBadgeReaderWSRequest: z.ZodObject<any> = z.object({
  badgeReaderUuid: z.string(),
  mummify: z.boolean()
});
const Badgereader_DeleteBadgeReaderWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: z.string().optional()
});
const Deviceconfig_settings_ExternalReadableButtonSettings: z.ZodObject<any> = z.object({
  button_emergency_onsite_contact: EmergencyContact.optional(),
  button_test_mode_enabled: z.boolean().optional()
});
const ClimateSettings: z.ZodObject<any> = z.object({
  alert_window_minutes: z.number().int().optional(),
  smoke_ai_threshold: z.number().optional(),
  thc_ai_threshold: z.number().optional(),
  vape_ai_threshold: z.number().optional()
});
const Deviceconfig_settings_ExternalReadableDeviceSettings: z.ZodObject<any> = z.object({
  bandwidth_reports_disabled: z.boolean().optional(),
  cloud_archive_days: z.number().int().optional(),
  cloud_archive_upload_schedule: z.array(WeeklyMinuteIntervalType).optional(),
  cloud_archive_upload_schedule_inverted: z.boolean().optional(),
  cloud_archive_upload_schedule_uuid: z.string().optional(),
  firmware_dev_settings: z.record(z.unknown()).optional(),
  led_mode_blink_period_ms: z.number().int().optional(),
  led_mode_when_active: z.string().optional(),
  led_mode_when_inactive: z.string().optional(),
  led_stealth_mode: z.boolean().optional(),
  lightweight_detection_disabled: z.boolean().optional(),
  live_license_invalid: z.boolean().optional(),
  max_event_duration_ms: z.number().int().optional(),
  media_ttl_minutes: z.number().int().optional(),
  on_demand_license_invalid: z.boolean().optional(),
  snapshot_upload_target: z.string().optional(),
  storage_target_free_megabytes: z.number().int().optional(),
  storage_target_free_space_permyriad: z.number().int().optional(),
  thumbstrip_upload_target: z.string().optional()
});
const BurstyRateLimit: z.ZodObject<any> = z.object({
  base_interval_ms: z.number().int().optional(),
  burst_token_generation_ms: z.number().int().optional(),
  burst_token_initial_count: z.number().int().optional(),
  burst_token_max_count: z.number().int().optional()
});
const Deviceconfig_settings_ExternalReadableDeviceVideoSettings: z.ZodObject<any> = z.object({
  alert_rate_limit_human_only: BurstyRateLimit.optional(),
  alert_rate_limit_motion_only: BurstyRateLimit.optional(),
  alert_rate_limit_vehicle_only: BurstyRateLimit.optional(),
  ir_double_tap: z.boolean().optional(),
  ir_filter_mode: z.string().optional(),
  ir_leds_mode: z.string().optional()
});
const Deviceconfig_settings_ExternalReadableDoorControllerSettings: z.ZodObject<any> = z.object({
  autocomponentize_readers: z.boolean().optional(),
  autoregister_readers: z.boolean().optional(),
  flip_display_orientation: z.boolean().optional(),
  pressure_switch_tamper_normally_open: z.boolean().optional(),
  proximity_sensor_tamper_disabled: z.boolean().optional(),
  proximity_sensor_tamper_distance_threshold: z.number().optional()
});
const DoorReaderSettings: z.ZodObject<any> = z.object({
  dr_enable_audio_feedback: z.boolean().optional(),
  tof_max_distance: z.number().optional(),
  tof_min_distance: z.number().optional(),
  tof_min_signal_over_noise: z.number().optional()
});
const DoorSensorSettings: z.ZodObject<any> = z.object({
  ajar_threshold_enabled: z.boolean().optional(),
  ajar_threshold_sec: z.number().int().optional()
});
const EnvironmentalGatewaySettings: z.ZodObject<any> = z.object({
  data_measurement_interval_sec: z.number().int().optional(),
  data_upload_interval_sec: z.number().int().optional(),
  false_positive_confidence_threshold: z.number().optional(),
  leak_detection_threshold: z.number().optional(),
  leak_detector_present: z.boolean().optional(),
  moist_detection_threshold: z.number().optional(),
  smoke_confidence_threshold: z.number().optional(),
  smoke_thc_confidence_threshold: z.number().optional(),
  smoke_tobacco_confidence_threshold: z.number().optional(),
  vape_alert_backoff_sec: z.number().int().optional(),
  vape_confidence_threshold: z.number().optional(),
  vape_thc_confidence_threshold: z.number().optional()
});
const TamperSettings: z.ZodObject<any> = z.object({
  accelerometer_change_tamper_threshold: z.number().optional(),
  accelerometer_disabled: z.boolean().optional(),
  pressure_switch_tamper_disabled: z.boolean().optional()
});
const ThirdPartyCameraSettings: z.ZodObject<any> = z.object({
  onvif_ip: z.string().optional(),
  onvif_password: z.string().optional(),
  onvif_profiletoken: z.string().optional(),
  onvif_ptz_servicepath: z.string().optional(),
  onvif_username: z.string().optional(),
  ptz_engine: z.string().optional(),
  ptz_movement: z.string().optional(),
  ptz_translation_space: z.string().optional()
});
const VideoDoorbellSettings: z.ZodObject<any> = z.object({
  standalone_doorbell_mode: z.boolean().optional()
});
const Deviceconfig_userconfig_ExternalReadableFacetedUserConfig: z.ZodObject<any> = z.object({
  audioFacetSettings: z.record(z.unknown()).optional(),
  buttonSettings: Deviceconfig_settings_ExternalReadableButtonSettings.optional(),
  climateSettings: ClimateSettings.optional(),
  deviceSettings: Deviceconfig_settings_ExternalReadableDeviceSettings.optional(),
  deviceUuid: z.string().optional(),
  deviceVideoSettings: Deviceconfig_settings_ExternalReadableDeviceVideoSettings.optional(),
  doorControllerSettings: Deviceconfig_settings_ExternalReadableDoorControllerSettings.optional(),
  doorReaderSettings: DoorReaderSettings.optional(),
  doorSensorSettings: DoorSensorSettings.optional(),
  environmentalGatewaySettings: EnvironmentalGatewaySettings.optional(),
  lastModified: z.number().int().optional(),
  orgUuid: z.string().optional(),
  tamperSettings: TamperSettings.optional(),
  thirdPartyCameraSettings: ThirdPartyCameraSettings.optional(),
  videoDoorbellSettings: VideoDoorbellSettings.optional(),
  videoFacetSettings: z.record(z.unknown()).optional()
});
const Badgereader_GetBadgeReaderConfigWSResponse: z.ZodObject<any> = z.object({
  config: Deviceconfig_userconfig_ExternalReadableFacetedUserConfig.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Badgereader_GetBadgeReaderFullStateWSResponse: z.ZodObject<any> = z.object({
  fullState: FullDeviceStateType.optional()
});
const MinimalDeviceStateType: z.ZodObject<any> = z.object({
  connectionStatus: DeviceStatusEnum.optional(),
  createdAtMillis: z.number().int().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  directionRadians: z.number().optional(),
  externalIPAddress: z.string().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  firmwareUpdateInProgress: z.boolean().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  healthStatus: DeviceStatusEnum.optional(),
  healthStatusDetails: DeviceHealthStatusDetailsEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lanAddresses: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  liveStreamShared: z.boolean().optional(),
  liveStreamsSharedCount: z.number().int().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mediaRegion: z.string().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  region: z.string().optional(),
  secondaryLanAddresses: z.array(z.string()).optional(),
  serialNumber: z.string().optional(),
  ssid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  supportedFacets: z.array(DeviceFacet).optional(),
  uuid: z.string().optional(),
  wifiApMac: z.string().optional(),
  wifiBars: z.number().int().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const Badgereader_GetBadgeReaderMinimalStateListWSResponse: z.ZodObject<any> = z.object({
  minimalStates: z.array(MinimalDeviceStateType).optional()
});
const Badgereader_RebootBadgeReaderWSRequest: z.ZodObject<any> = z.object({
  badgeReaderUuid: z.string()
});
const ButtonSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  button_emergency_onsite_contact: EmergencyContact.optional(),
  button_test_mode_enabled: z.boolean().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const ClimateSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  alert_window_minutes: z.number().int().optional(),
  smoke_ai_threshold: z.number().optional(),
  thc_ai_threshold: z.number().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  vape_ai_threshold: z.number().optional()
});
const Deviceconfig_settings_ExternalDeviceSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  bandwidth_reports_disabled: z.boolean().optional(),
  firmware_dev_settings: z.record(z.unknown()).optional(),
  led_mode_blink_period_ms: z.number().int().optional(),
  led_mode_when_active: z.string().optional(),
  led_mode_when_inactive: z.string().optional(),
  led_stealth_mode: z.boolean().optional(),
  lightweight_detection_disabled: z.boolean().optional(),
  live_license_invalid: z.boolean().optional(),
  media_ttl_minutes: z.number().int().optional(),
  on_demand_license_invalid: z.boolean().optional(),
  snapshot_upload_target: z.string().optional(),
  storage_target_free_megabytes: z.number().int().optional(),
  storage_target_free_space_permyriad: z.number().int().optional(),
  thumbstrip_upload_target: z.string().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const DeviceVideoSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  alert_rate_limit_human_only: BurstyRateLimit.optional(),
  alert_rate_limit_motion_only: BurstyRateLimit.optional(),
  alert_rate_limit_vehicle_only: BurstyRateLimit.optional(),
  ir_double_tap: z.boolean().optional(),
  ir_filter_mode: z.string().optional(),
  ir_leds_mode: z.string().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const Deviceconfig_settings_ExternalDoorControllerSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  autocomponentize_readers: z.boolean().optional(),
  autoregister_readers: z.boolean().optional(),
  flip_display_orientation: z.boolean().optional(),
  pressure_switch_tamper_normally_open: z.boolean().optional(),
  proximity_sensor_tamper_disabled: z.boolean().optional(),
  proximity_sensor_tamper_distance_threshold: z.number().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const DoorReaderSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  dr_enable_audio_feedback: z.boolean().optional(),
  tof_max_distance: z.number().optional(),
  tof_min_distance: z.number().optional(),
  tof_min_signal_over_noise: z.number().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const DoorSensorSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  ajar_threshold_enabled: z.boolean().optional(),
  ajar_threshold_sec: z.number().int().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const EnvironmentalGatewaySettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  data_measurement_interval_sec: z.number().int().optional(),
  data_upload_interval_sec: z.number().int().optional(),
  false_positive_confidence_threshold: z.number().optional(),
  leak_detection_threshold: z.number().optional(),
  leak_detector_present: z.boolean().optional(),
  moist_detection_threshold: z.number().optional(),
  smoke_confidence_threshold: z.number().optional(),
  smoke_thc_confidence_threshold: z.number().optional(),
  smoke_tobacco_confidence_threshold: z.number().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  vape_alert_backoff_sec: z.number().int().optional(),
  vape_confidence_threshold: z.number().optional(),
  vape_thc_confidence_threshold: z.number().optional()
});
const TamperSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  accelerometer_change_tamper_threshold: z.number().optional(),
  accelerometer_disabled: z.boolean().optional(),
  pressure_switch_tamper_disabled: z.boolean().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const VideoDoorbellSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  standalone_doorbell_mode: z.boolean().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const Deviceconfig_userconfig_ExternalUpdateableFacetedUserConfig: z.ZodObject<any> = z.object({
  audioFacetSettings: z.record(z.unknown()).optional(),
  buttonSettings: ButtonSettingsSelectiveUpdate.optional(),
  climateSettings: ClimateSettingsSelectiveUpdate.optional(),
  deviceSettings: Deviceconfig_settings_ExternalDeviceSettingsSelectiveUpdate.optional(),
  deviceUuid: z.string().optional(),
  deviceVideoSettings: DeviceVideoSettingsSelectiveUpdate.optional(),
  doorControllerSettings: Deviceconfig_settings_ExternalDoorControllerSettingsSelectiveUpdate.optional(),
  doorReaderSettings: DoorReaderSettingsSelectiveUpdate.optional(),
  doorSensorSettings: DoorSensorSettingsSelectiveUpdate.optional(),
  environmentalGatewaySettings: EnvironmentalGatewaySettingsSelectiveUpdate.optional(),
  tamperSettings: TamperSettingsSelectiveUpdate.optional(),
  videoDoorbellSettings: VideoDoorbellSettingsSelectiveUpdate.optional(),
  videoFacetSettings: z.record(z.unknown()).optional()
});
const Badgereader_UpdateBadgeReaderConfigWSRequest: z.ZodObject<any> = z.object({
  configUpdate: Deviceconfig_userconfig_ExternalUpdateableFacetedUserConfig.optional()
});
const Badgereader_UpdateBadgeReaderDetailsWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  deviceUuid: z.string().optional(),
  directionRadians: z.number().optional(),
  floorNumber: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional()
});
const BaseApiResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const BaseCatalogItem: z.ZodObject<any> = z.object({
  durationMonths: z.number().int().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional()
});
const ClaimKeyReturnEvent: z.ZodObject<any> = z.object({
  returnedProductQuantities: z.record(z.unknown()).optional(),
  timestamp: z.string().datetime({ offset: true }).optional()
});
const BaseClaimKey: z.ZodObject<any> = z.object({
  claimEndDate: z.string().datetime({ offset: true }).optional(),
  claimStartDate: z.string().datetime({ offset: true }).optional(),
  createdOn: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  expirationEmailState: z.string().optional(),
  gracePeriodEndDate: z.string().datetime({ offset: true }).optional(),
  maskedClaimCode: z.string().optional(),
  orgUuid: z.string().optional(),
  renewedByClaimKeyUuid: z.string().optional(),
  requestId: z.string().optional(),
  returnHistory: z.array(ClaimKeyReturnEvent).optional(),
  state: z.string().optional(),
  trial: z.boolean().optional(),
  type: z.string().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional()
});
const OsdpPhysicalPortEnumType = z.string();
const OsdpReaderPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: OsdpPhysicalPortEnumType.optional()
});
const RhombusOsdpDoorReaderType: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  deviceUuid: z.string().optional(),
  disableCardReader: z.boolean().optional(),
  disableKeypad: z.boolean().optional(),
  disableWaveToUnlock: z.boolean().optional(),
  hardwareUuid: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  osdpAddress: z.number().int().optional(),
  otherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  port: OsdpReaderPortType.optional(),
  portImmutable: z.boolean().optional(),
  readerType: DoorReaderEnumType.optional(),
  remoteUnlockAudioFeedbackEnabled: z.boolean().optional(),
  serialNumber: z.string().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const OsdpDoorReaderType: z.ZodObject<any> = z.object({
  allowUnencrypted: z.boolean().optional(),
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  disableCardReader: z.boolean().optional(),
  disableKeypad: z.boolean().optional(),
  disableWaveToUnlock: z.boolean().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  osdpAddress: z.number().int().optional(),
  otherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  port: OsdpReaderPortType.optional(),
  portImmutable: z.boolean().optional(),
  readerType: DoorReaderEnumType.optional(),
  remoteUnlockAudioFeedbackEnabled: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const WiegandOutputPhysicalPortEnumType = z.string();
const WiegandOutputPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: WiegandOutputPhysicalPortEnumType.optional()
});
const WiegandDataPhysicalPortEnumType = z.string();
const WiegandDataPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: WiegandDataPhysicalPortEnumType.optional()
});
const WiegandInputPhysicalPortEnumType = z.string();
const WiegandInputPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: WiegandInputPhysicalPortEnumType.optional()
});
const WiegandDoorReaderType: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  buzzerPort: WiegandOutputPortType.optional(),
  createdAtMillis: z.number().int().optional(),
  d0Port: WiegandDataPortType.optional(),
  d1Port: WiegandDataPortType.optional(),
  disableCardReader: z.boolean().optional(),
  disableKeypad: z.boolean().optional(),
  disableWaveToUnlock: z.boolean().optional(),
  gledPort: WiegandOutputPortType.optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  otherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  portImmutable: z.boolean().optional(),
  readerType: DoorReaderEnumType.optional(),
  remoteUnlockAudioFeedbackEnabled: z.boolean().optional(),
  rledPort: WiegandOutputPortType.optional(),
  tamperPort: WiegandInputPortType.optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const DoorPositionIndicatorPhysicalPortEnumType = z.string();
const DoorPositionIndicatorPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: DoorPositionIndicatorPhysicalPortEnumType.optional(),
  supervisionConfiguration: PortSupervisionConfigurationType.optional()
});
const IntegratedDoorPositionIndicatorType: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  dpiType: DoorPositionIndicatorEnumType.optional(),
  name: z.string().optional(),
  normalState: NormalStateEnumType.optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  port: DoorPositionIndicatorPortType.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const RequestToExitPhysicalPortEnumType = z.string();
const RequestToExitPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: RequestToExitPhysicalPortEnumType.optional(),
  supervisionConfiguration: PortSupervisionConfigurationType.optional()
});
const IntegratedRequestToExitType: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  intentOnly: z.boolean().optional(),
  intentOnlyEvents: z.boolean().optional(),
  name: z.string().optional(),
  normalState: NormalStateEnumType.optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  port: RequestToExitPortType.optional(),
  portImmutable: z.boolean().optional(),
  rexType: RequestToExitEnumType.optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const DoorRelayPhysicalPortEnumType = z.string();
const DoorRelayPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: DoorRelayPhysicalPortEnumType.optional()
});
const IntegratedDoorRelayType: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  port: DoorRelayPortType.optional(),
  portImmutable: z.boolean().optional(),
  rateLimitingEnabled: z.boolean().optional(),
  relayType: DoorRelayEnumType.optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const IntegratedGenericRelayType: z.ZodObject<any> = z.object({
  auxType: AuxiliaryEnumType.optional(),
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  originator: BaseEventOriginator.optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  port: AuxiliaryRelayPortType.optional(),
  portImmutable: z.boolean().optional(),
  relayDurationSec: z.number().int().optional(),
  stateChangedAtMillis: z.number().int().optional(),
  steadyState: GenericRelayStateEnumType.optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const IntegratedGenericInputType: z.ZodObject<any> = z.object({
  auxType: AuxiliaryEnumType.optional(),
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  name: z.string().optional(),
  normalState: NormalStateEnumType.optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  port: AuxiliaryInputPortType.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const ButtonEnumType = z.string();
const ButtonModeEnum = z.string();
const ButtonPhysicalPortEnumType = z.string();
const ButtonPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  portNum: z.number().int().optional(),
  portType: ButtonPhysicalPortEnumType.optional()
});
const IntegratedGenericButtonType: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  buttonType: ButtonEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  mode: ButtonModeEnum.optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  port: ButtonPortType.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const BaseComponentType: z.ZodObject<any> = z.object({
  baseType: ComponentBaseEnumType.optional(),
  createdAtMillis: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  portImmutable: z.boolean().optional(),
  type: ComponentEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const BaseLicenseType: z.ZodObject<any> = z.object({
  claimKeyUuid: z.string().optional(),
  createdOn: z.string().datetime({ offset: true }).optional(),
  firstAssignedDate: z.string().datetime({ offset: true }).optional(),
  licenseToUnassignEmailState: z.string().optional(),
  maxDeleteDate: z.string().datetime({ offset: true }).optional(),
  orgUuid: z.string().optional(),
  priorClaimKeyUuid: z.string().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional(),
  state: z.string().optional(),
  trial: z.boolean().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional()
});
const PolicyEventFaceType: z.ZodObject<any> = z.object({
  faceId: z.string().optional(),
  faceName: z.string().optional(),
  imageS3Bucket: z.string().optional(),
  imageS3Key: z.string().optional(),
  imageS3Region: z.string().optional(),
  labels: z.array(z.string()).optional(),
  personUuid: z.string().optional()
});
const PolicyEventVehicleType: z.ZodObject<any> = z.object({
  imageS3Bucket: z.string().optional(),
  imageS3Key: z.string().optional(),
  imageS3Region: z.string().optional(),
  labels: z.array(z.string()).optional(),
  licensePlateNumber: z.string().optional(),
  vehicleName: z.string().optional()
});
const CheckCondition: z.ZodObject<any> = z.object({
  operator: z.string().optional(),
  value: z.string().optional()
});
const PolicyAlertV2Type: z.ZodObject<any> = z.object({
  airQualityIndex: z.number().int().optional(),
  airQualityIndexThreshold: z.number().int().optional(),
  alertMonitoringThreatCaseUuid: z.string().optional(),
  alertMonitoringVerified: z.boolean().optional(),
  alertingEventFaces: z.array(PolicyEventFaceType).optional(),
  alertingEventVehicles: z.array(PolicyEventVehicleType).optional(),
  cd: z.string().optional(),
  cdn: z.string().optional(),
  ch2oPpb: z.number().optional(),
  ch2oPpbThreshold: z.number().optional(),
  clipLocation: MetaDataLocationType.optional(),
  clipLocationMap: z.record(z.unknown()).optional(),
  clipLocationMapV2: z.record(z.unknown()).optional(),
  cllmBooleanValue: z.boolean().optional(),
  cllmCheckCondition: CheckCondition.optional(),
  cllmIntegerValue: z.number().int().optional(),
  cllmPromptTypeEnum: z.string().optional(),
  cllmPromptUuid: z.string().optional(),
  co2: z.number().optional(),
  co2Ppm: z.number().int().optional(),
  co2PpmThreshold: z.number().int().optional(),
  co2Threshold: z.number().optional(),
  coConcentration: z.number().optional(),
  coConcentrationThreshold: z.number().optional(),
  componentUuid: z.string().optional(),
  delayedProcessing: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deviceType: DeviceTypeEnum.optional(),
  deviceUuid: z.string().optional(),
  durationSec: z.number().int().optional(),
  egressBoundaryDevices: z.array(z.string()).optional(),
  ethanol: z.number().optional(),
  ethanolThreshold: z.number().optional(),
  finalized: z.boolean().optional(),
  heatIndexDegF: z.number().optional(),
  heatIndexDegFThreshold: z.number().optional(),
  humidityPercent1616: z.number().int().optional(),
  humidityPercentThreshold1616: z.number().int().optional(),
  humidityPermyriad: z.number().int().optional(),
  humidityThresholdPermyriad: z.number().int().optional(),
  iaq: z.number().optional(),
  iaqThreshold: z.number().optional(),
  ingressBoundaryDevices: z.array(z.string()).optional(),
  leakDetected: z.boolean().optional(),
  locationUuid: z.string().optional(),
  maxLuf: z.number().int().optional(),
  notificationSent: z.boolean().optional(),
  noxIdx: z.number().optional(),
  noxIdxThreshold: z.number().optional(),
  numHumans: z.number().int().optional(),
  orgUuid: z.string().optional(),
  peopleCountHighThreshold: z.number().int().optional(),
  peopleCountLowThreshold: z.number().int().optional(),
  pm10p0: z.number().optional(),
  pm10p0Threshold: z.number().optional(),
  pm1p0: z.number().optional(),
  pm1p0Threshold: z.number().optional(),
  pm25: z.number().optional(),
  pm25Threshold: z.number().optional(),
  pm4p0: z.number().optional(),
  pm4p0Threshold: z.number().optional(),
  policyAlertTriggers: z.array(ActivityEnum).optional(),
  policyUuid: z.string().optional(),
  pressure: z.number().optional(),
  pressureThreshold: z.number().optional(),
  probeTempC: z.number().optional(),
  probeTempCThreshold: z.number().optional(),
  probeTempThreshold: z.number().optional(),
  relHumid: z.number().optional(),
  relHumidThreshold: z.number().optional(),
  saved: z.boolean().optional(),
  shared: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  tamperByMovementChange: z.number().optional(),
  tampered: z.boolean().optional(),
  tempC: z.number().optional(),
  tempCThreshold: z.number().optional(),
  tempProbePresent: z.boolean().optional(),
  temperatureCelsius1616: z.number().int().optional(),
  temperatureCelsiusThreshold1616: z.number().int().optional(),
  temperaturePermyriad: z.number().int().optional(),
  temperatureThresholdPermyriad: z.number().int().optional(),
  textDescription: z.string().optional(),
  thcPercent: z.number().optional(),
  thcPercentThreshold: z.number().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  thumbnailLocationV2: z.string().optional(),
  timestampMs: z.number().int().optional(),
  tvoc: z.number().optional(),
  tvocThreshold: z.number().optional(),
  type: z.string().optional(),
  uuid: z.string().optional(),
  vapeDetected: z.boolean().optional(),
  vapeSmokePercent: z.number().optional(),
  vapeSmokePercentThreshold: z.number().optional(),
  vocIdx: z.number().optional(),
  vocIdxThreshold: z.number().optional()
});
const BasePolicyAlertType: z.ZodObject<any> = z.object({
  alertMonitoringThreatCaseUuid: z.string().optional(),
  alertMonitoringVerified: z.boolean().optional(),
  clipLocationMap: z.record(z.unknown()).optional(),
  clipLocationMapV2: z.record(z.unknown()).optional(),
  delayedProcessing: z.boolean().optional(),
  deleted: z.boolean().optional(),
  durationSec: z.number().int().optional(),
  finalized: z.boolean().optional(),
  locationUuid: z.string().optional(),
  notificationSent: z.boolean().optional(),
  orgUuid: z.string().optional(),
  policyAlertTriggers: z.array(ActivityEnum).optional(),
  policyUuid: z.string().optional(),
  saved: z.boolean().optional(),
  shared: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  textDescription: z.string().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  thumbnailLocationV2: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: z.string().optional(),
  uuid: z.string().optional()
});
const SimpleDeviceActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const DeviceActivityRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const SimpleDiagnosticEventType: z.ZodObject<any> = z.object({
  diagnosticEvent: z.string().optional()
});
const DiagnosticRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const ScheduledRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const VisionLLMRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const RecurringTimeUnit = z.string();
const RecurringRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const LocationLockdownActivatedRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const LocationLockdownDeactivatedRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const CustomLLMEventRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const ButtonIntegrationRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const BaseRuleTriggerType: z.ZodObject<any> = z.object({
  type: RuleTriggerTypeEnum.optional()
});
const BaseSavedScheduleType: z.ZodObject<any> = z.object({
  mutable: z.boolean().optional(),
  name: z.string().optional(),
  oneTimeUse: z.boolean().optional(),
  orgUuid: z.string().optional(),
  strategy: z.string().optional(),
  uuid: z.string().optional()
});
const BatchRegistrationTokenUsageResult: z.ZodObject<any> = z.object({
  di: z.string().optional(),
  hi: z.string().optional(),
  rs: z.string().optional(),
  ts: z.number().int().optional()
});
const BinaryAggregationValue: z.ZodObject<any> = z.object({
  eventCount: z.number().int().optional(),
  false: z.number().int().optional(),
  localDate: z.string().optional(),
  maxValueTimestampMs: z.number().int().optional(),
  minValueTimestampMs: z.number().int().optional(),
  timestampMs: z.number().int().optional(),
  true: z.number().int().optional(),
  utcDate: z.string().optional()
});
const Ble_BleDeviceMap: z.ZodObject<any> = z.object({
  keyToSecureBeacon: z.record(z.unknown()).optional()
});
const Ble_BleRegisteredDeviceWSType: z.ZodObject<any> = z.object({
  deleted: z.boolean().optional(),
  deviceUuid: z.string().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  name: z.string().optional(),
  secret: z.array(z.string()).optional(),
  updateToFirmwareVersion: z.string().optional()
});
const Ble_BleUnregisteredHardwareWSType: z.ZodObject<any> = z.object({
  mac: z.string().optional(),
  secret: z.array(z.string()).optional()
});
const Ble_GetBaseStationsWSRequest = z.record(z.unknown());
const Ble_GetBaseStationsWSResponse: z.ZodObject<any> = z.object({
  baseStations: z.array(z.string()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Ble_GetSecureSecretForRegisteredWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  hardwareVariationToFirmwareDownloadUrl: z.record(z.unknown()).optional(),
  keyToRegisteredDevice: z.record(z.unknown()).optional()
});
const Ble_GetSecureSecretForUnregisteredWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  keyToUnregisteredDevice: z.record(z.unknown()).optional()
});
const Ble_GetSensorHardwareFirmwareUpdateDetailsRequest = z.record(z.unknown());
const Ble_GetSensorHardwareFirmwareUpdateDetailsResponse: z.ZodObject<any> = z.object({
  hardwareVariationToFirmwareDownloadUrl: z.record(z.unknown()).optional()
});
const Ble_RegisterSensorWSRequest: z.ZodObject<any> = z.object({
  bleData: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  serialNum: z.string().optional()
});
const Ble_RegisterSensorWSResponse: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Ble_UnregisterSensorWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Ble_UnregisterSensorWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failureReason: z.string().optional(),
  success: z.boolean().optional()
});
const BoardPhysicalPortConfigType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  ownerHardwareType: HardwareVariationEnum.optional(),
  portMap: z.record(z.unknown()).optional()
});
const ContentDisposition: z.ZodObject<any> = z.object({
  attachment: z.boolean().optional(),
  charset: z.object({
  registered: z.boolean().optional()
}).optional(),
  creationDate: z.string().datetime({ offset: true }).optional(),
  filename: z.string().optional(),
  formData: z.boolean().optional(),
  inline: z.boolean().optional(),
  modificationDate: z.string().datetime({ offset: true }).optional(),
  name: z.string().optional(),
  readDate: z.string().datetime({ offset: true }).optional(),
  size: z.number().int().optional(),
  type: z.string().optional()
});
const MediaType: z.ZodObject<any> = z.object({
  charset: z.object({
  registered: z.boolean().optional()
}).optional(),
  concrete: z.boolean().optional(),
  parameters: z.record(z.unknown()).optional(),
  qualityValue: z.number().optional(),
  subtype: z.string().optional(),
  subtypeSuffix: z.string().optional(),
  type: z.string().optional(),
  wildcardSubtype: z.boolean().optional(),
  wildcardType: z.boolean().optional()
});
const MessageBodyWorkers = z.record(z.unknown());
const Providers = z.record(z.unknown());
const BoundingBoxType: z.ZodObject<any> = z.object({
  bottom: z.number().optional(),
  left: z.number().optional(),
  right: z.number().optional(),
  top: z.number().optional()
});
const BoxSettings: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  enterpriseId: z.string().optional(),
  folderId: z.string().optional()
});
const BrivoSettings: z.ZodObject<any> = z.object({
  accessToken: z.string().optional(),
  alertUnauthorizedFaces: z.boolean().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorToCameraMap: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  migrated: z.boolean().optional(),
  password: z.string().optional(),
  refreshToken: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  username: z.string().optional(),
  webhookId: z.number().int().optional()
});
const BrivoType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const ButterflyMXSettings: z.ZodObject<any> = z.object({
  buildingWebhookIdMap: z.record(z.unknown()).optional(),
  createSeekPoints: z.boolean().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  indexFaces: z.boolean().optional(),
  migrated: z.boolean().optional(),
  panelInfoMap: z.record(z.unknown()).optional(),
  refreshToken: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional()
});
const ButterflyMXType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const DoorType: z.ZodObject<any> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional()
});
const ButterflymxBuilding: z.ZodObject<any> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
  panels: z.array(DoorType).optional()
});
const ButterflymxPanelInfoType: z.ZodObject<any> = z.object({
  assignedCameraList: z.array(z.string()).optional(),
  buildingId: z.number().int().optional(),
  locationUuid: z.string().optional(),
  panelName: z.string().optional()
});
const ButtonPressEnum = z.string();
const SupervisionStateEnumType = z.string();
const ButtonEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const Button_ButtonHealthDetailsEnum = z.string();
const Button_ButtonHealthEnum = z.string();
const Button_ExternalButtonRuleType: z.ZodObject<any> = z.object({
  action: RuleActionType.optional(),
  ruleFilters: RuleFilterType.optional(),
  ruleName: z.string().optional(),
  ruleUuid: z.string().optional(),
  sensorUuid: z.string().optional(),
  triggerPress: ButtonPressEnum.optional()
});
const Button_CreateRuleForButtonWSRequest: z.ZodObject<any> = z.object({
  rule: Button_ExternalButtonRuleType.optional()
});
const Button_CreateRuleForButtonWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  ruleUuid: z.string().optional()
});
const Button_DeleteRuleForButtonWSRequest: z.ZodObject<any> = z.object({
  ruleUuid: z.string().optional(),
  sensorUuid: z.string().optional()
});
const Button_DeleteRuleForButtonWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Button_GetButtonPressEventsForSensorWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  sensorUuid: z.string().optional()
});
const Button_GetButtonPressEventsForSensorWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  events: z.array(ButtonEventType).optional()
});
const Button_GetButtonRulesForOrgWSRequest = z.record(z.unknown());
const Button_GetButtonRulesForOrgWSResponse: z.ZodObject<any> = z.object({
  buttonUuidToRulesMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Button_GetMinimalButtonStatesWSRequest = z.record(z.unknown());
const Button_MinimalButtonStateType: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  batteryPercent: z.number().int().optional(),
  buttonEmergencyOnsiteContact: EmergencyContact.optional(),
  buttonMode: ButtonModeEnum.optional(),
  closestBaseStation: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  health: Button_ButtonHealthEnum.optional(),
  healthDetails: Button_ButtonHealthDetailsEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lastSeenSec: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  sensorUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  signalStrength: z.number().int().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  testModeEnabled: z.boolean().optional()
});
const Button_GetMinimalButtonStatesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  states: z.array(Button_MinimalButtonStateType).optional()
});
const Button_GetRulesForButtonWSRequest: z.ZodObject<any> = z.object({
  sensorUuid: z.string().optional()
});
const Button_GetRulesForButtonWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rules: z.array(Button_ExternalButtonRuleType).optional()
});
const Deviceconfig_userconfig_IExternalUpdateableButtonUserConfig: z.ZodObject<any> = z.object({
  button_emergency_onsite_contact: EmergencyContact.optional(),
  button_test_mode_enabled: z.boolean().optional(),
  deviceUuid: z.string().optional(),
  lastModified: z.number().int().optional(),
  orgUuid: z.string().optional()
});
const Button_UpdateButtonConfigWSRequest: z.ZodObject<any> = z.object({
  configUpdate: Deviceconfig_userconfig_IExternalUpdateableButtonUserConfig.optional()
});
const Button_UpdateButtonDetailsWSRequest: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  buttonMode: ButtonModeEnum.optional(),
  description: z.string().optional(),
  floorNumber: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  sensorUuid: z.string().optional()
});
const Buyer: z.ZodObject<any> = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  postalCode: z.string().optional(),
  state: z.string().optional()
});
const COSensorType: z.ZodObject<any> = z.object({
  adcRaw: z.number().int().optional(),
  adcVoltage: z.number().optional(),
  coConcentration: z.number().optional(),
  timestampSec: z.number().int().optional()
});
const CameraAiDewarpConfigType: z.ZodObject<any> = z.object({
  dewarp_tile_height: z.number().int().optional(),
  dewarp_tile_width: z.number().int().optional(),
  orientation: z.number().int().optional()
});
const RegionCoordinateType: z.ZodObject<any> = z.object({
  x: z.number().optional(),
  y: z.number().optional()
});
const RegionPolygonType: z.ZodObject<any> = z.object({
  coordinates: z.array(RegionCoordinateType).optional()
});
const ScheduledAction: z.ZodObject<any> = z.object({
  action: RuleActionType.optional(),
  backoffMinutes: z.number().int().optional(),
  backoffSeconds: z.number().int().optional(),
  ruleUuid: z.string().optional(),
  scheduleUuid: z.string().optional()
});
const CameraConfiguration: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  checkConditionOverride: CheckCondition.optional(),
  promptExtension: z.string().optional(),
  promptOverride: z.string().optional(),
  region: RegionPolygonType.optional(),
  scheduledActions: z.array(ScheduledAction).optional()
});
const CameraCrossCountingSettingsType: z.ZodObject<any> = z.object({
  directions: z.array(z.string()).optional(),
  in_roi: z.array(RegionPolygonType).optional(),
  object_type: z.string().optional(),
  object_type_id: z.number().int().optional(),
  out_roi: z.array(RegionPolygonType).optional()
});
const CameraHumanLoiteringSettingsType: z.ZodObject<any> = z.object({
  roi: z.array(RegionPolygonType).optional()
});
const CameraMeteringConfigType: z.ZodObject<any> = z.object({
  rotation: z.number().int().optional(),
  table: z.string().optional()
});
const PermyriadRect: z.ZodObject<any> = z.object({
  h: z.number().int().optional(),
  size: z.number().int().optional(),
  w: z.number().int().optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional()
});
const CameraMotorConfigType: z.ZodObject<any> = z.object({
  af_enabled: z.boolean().optional(),
  af_region: PermyriadRect.optional(),
  focus: z.number().int().optional(),
  piris: z.number().int().optional(),
  zoom: z.number().int().optional()
});
const CameraPTZConfigType: z.ZodObject<any> = z.object({
  offset_x_percent: z.number().optional(),
  offset_y_percent: z.number().optional(),
  rotation: z.number().int().optional(),
  size_percent: z.number().optional()
});
const CameraTriggerType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  faceAlertLabelSet: z.array(z.string()).optional(),
  faceAlertUnidentified: z.boolean().optional(),
  faceAllowedLabelSet: z.array(z.string()).optional(),
  threshold: z.number().int().optional(),
  vehicleAlertLabelSet: z.array(z.string()).optional(),
  vehicleAlertUnidentified: z.boolean().optional(),
  vehicleAllowedLabelSet: z.array(z.string()).optional()
});
const CameraScheduledTriggerType: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(CameraTriggerType).optional()
});
const CameraPolicyV2Type: z.ZodObject<any> = z.object({
  defaultTriggers: z.array(CameraTriggerType).optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(CameraScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const CameraType: z.ZodObject<any> = z.object({
  archiveRegion: z.string().optional(),
  cameraFramerate: z.number().int().optional(),
  createdAtMillis: z.number().int().optional(),
  customData: z.string().optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  deviceFacetRadians: z.record(z.unknown()).optional(),
  directionRadians: z.number().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  floorNumber: z.number().int().optional(),
  hardwareId: z.string().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  pending: z.boolean().optional(),
  policyUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  type: DeviceTypeEnum.optional(),
  uuid: z.string().optional()
});
const CameraVisualTamperConfigType: z.ZodObject<any> = z.object({
  analyze_fps: z.number().int().optional(),
  analyze_res: z.number().int().optional(),
  canny_thresh: z.number().optional(),
  edge_cov_diff_thresh: z.number().optional(),
  enabled: z.boolean().optional(),
  long_buf_size: z.number().int().optional(),
  short_buf_size: z.number().int().optional()
});
const Camera_CameraBackwardsCompatUpdateType: z.ZodObject<any> = z.object({
  archiveRegion: z.string().optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  floorNumber: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  uuid: z.string().optional()
});
const Camera_CameraCurrentStateType: z.ZodObject<any> = z.object({
  baseVideoOperationUri: z.string().optional(),
  connectionStatus: z.string().optional(),
  connectionTimestampMs: z.number().int().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  firmwareVersion: z.string().optional(),
  healthStatus: z.string().optional(),
  healthStatusDetails: z.string().optional(),
  latestFirmwareVersion: z.string().optional(),
  mediaRegion: z.string().optional(),
  onCameraState: z.record(z.unknown()).optional(),
  onCloudState: z.record(z.unknown()).optional(),
  region: z.string().optional(),
  serialNumber: z.string().optional(),
  ssid: z.string().optional(),
  versionsBehind: z.number().int().optional(),
  wifiApMac: z.string().optional(),
  wifiBars: z.number().int().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const Camera_CameraExternalFacetedType: z.ZodObject<any> = z.object({
  archiveRegion: z.string().optional(),
  cameraFramerate: z.number().int().optional(),
  createdAtMillis: z.number().int().optional(),
  customData: z.string().optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  deviceFacetRadians: z.record(z.unknown()).optional(),
  deviceUuid: z.string().optional(),
  directionRadians: z.number().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  floorNumber: z.number().int().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  pending: z.boolean().optional(),
  policyUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  type: DeviceTypeEnum.optional(),
  uuid: z.string().optional()
});
const Camera_CameraExternalType: z.ZodObject<any> = z.object({
  archiveRegion: z.string().optional(),
  cameraFramerate: z.number().int().optional(),
  createdAtMillis: z.number().int().optional(),
  customData: z.string().optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  deviceFacetRadians: z.record(z.unknown()).optional(),
  directionRadians: z.number().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  floorNumber: z.number().int().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  pending: z.boolean().optional(),
  policyUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  type: DeviceTypeEnum.optional(),
  uuid: z.string().optional()
});
const Camera_CameraOfflineLanStreamingInfo: z.ZodObject<any> = z.object({
  accessToken: z.string().optional(),
  lanAddresses: z.array(z.string()).optional()
});
const CustomFootageSeekPointType: z.ZodObject<any> = z.object({
  color: z.string().optional(),
  description: z.string().max(100).optional(),
  displayOverlay: z.boolean().optional(),
  name: z.string().max(32),
  timestampMs: z.number().int().min(0)
});
const Camera_CreateCustomFootageSeekpointsWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  footageSeekPoints: z.array(CustomFootageSeekPointType).optional()
});
const FootageBoundingBoxType: z.ZodObject<any> = z.object({
  a: ActivityEnum,
  al: z.boolean().optional(),
  b: z.number().int(),
  c: z.number().optional(),
  cd: z.string().optional(),
  cdn: z.string().optional(),
  croppedImageLocator: z.string().optional(),
  customActivityColor: z.string().optional(),
  fn: z.string().optional(),
  kp: z.record(z.unknown()).optional(),
  l: z.number().int(),
  loudness: z.number().int().optional(),
  lp: z.string().optional(),
  m: z.boolean().optional(),
  objectId: z.number().int().optional(),
  p: z.string().optional(),
  r: z.number().int(),
  ro: z.array(z.string()).optional(),
  sensorValType: SensorValType.optional(),
  t: z.number().int(),
  toastOrderIdInfo: ToastOrderIdType.optional(),
  ts: z.number().int(),
  uf: z.string().optional(),
  vn: z.string().optional()
});
const Camera_CreateFootageBoundingBoxesWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  footageBoundingBoxes: z.array(FootageBoundingBoxType).optional()
});
const Camera_CreateFootageBoundingBoxesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_CreateFootageSeekpointsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const StreamTypeEnum = z.string();
const Camera_CreateSharedLiveVideoStreamWSRequest: z.ZodObject<any> = z.object({
  audioGatewayUuid: z.string().optional(),
  cameraUuid: z.string().optional(),
  expirationTimeSecs: z.number().int().optional(),
  includeAudio: z.boolean().optional(),
  invertSchedule: z.boolean().optional(),
  name: z.string().optional(),
  password: z.string().optional(),
  scheduleUuid: z.string().optional(),
  ssoProtected: z.boolean().optional(),
  streamType: StreamTypeEnum.optional(),
  vodEnabled: z.boolean().optional()
});
const Camera_CreateSharedLiveVideoStreamWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedLiveM3U8StreamUrl: z.string().optional(),
  sharedLiveVideoStreamUrl: z.string().optional(),
  sharedLiveVideoStreamUuid: z.string().optional()
});
const Camera_CreateSharedVideoWallWSRequest: z.ZodObject<any> = z.object({
  expirationTimeSecs: z.number().int().optional(),
  invertSchedule: z.boolean().optional(),
  password: z.string().optional(),
  scheduleUuid: z.string().optional(),
  videoWallUuid: z.string().optional(),
  vodEnabled: z.boolean().optional()
});
const Camera_CreateSharedVideoWallWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedLiveVideoStreamUrl: z.string().optional(),
  sharedLiveVideoStreamUuid: z.string().optional()
});
const VideoWallType: z.ZodObject<any> = z.object({
  deviceList: z.array(z.string()).optional(),
  displayName: z.string().optional(),
  orgUuid: z.string().optional(),
  othersCanEdit: z.boolean().optional(),
  ownerUserUuid: z.string().optional(),
  settings: z.record(z.unknown()).optional(),
  shared: z.boolean().optional(),
  uuid: z.string().optional()
});
const Camera_CreateVideoWallWSRequest: z.ZodObject<any> = z.object({
  videoWall: VideoWallType.optional()
});
const Camera_CreateVideoWallWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const Camera_DeleteCameraWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  mummify: z.boolean().optional()
});
const Camera_DeleteCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: z.string().optional()
});
const Camera_DeleteCustomFootageSeekpointsWSRequest: z.ZodObject<any> = z.object({
  cameraUuids: z.array(z.string()).optional(),
  customName: z.string().optional(),
  endTimestampMs: z.number().int().optional(),
  startTimestampMs: z.number().int().optional()
});
const Camera_DeleteCustomFootageSeekpointsWSResponse: z.ZodObject<any> = z.object({
  deleteSeekpointResponseMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_DeleteCustomFootageSeekpointsWSResponse_SeekPointDeleteResponse: z.ZodObject<any> = z.object({
  err: z.boolean().optional(),
  errMsg: z.string().optional()
});
const Camera_DeleteSharedLiveVideoStreamWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  uuid: z.string().optional()
});
const Camera_DeleteSharedVideoWallWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional(),
  videoWallUuid: z.string().optional()
});
const Camera_DeleteSharedVideoWallWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_DeleteVideoWallWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Camera_DeleteVideoWallWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_EraseCameraWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional()
});
const Camera_EraseCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_FindAllSharedLiveVideoStreamsWSRequest = z.record(z.unknown());
const Camera_SharedLiveVideoStreamWS: z.ZodObject<any> = z.object({
  audioDeviceHwVar: HardwareVariationEnum.optional(),
  audioGatewayUuid: z.string().optional(),
  audioPushToTalkEnabled: z.boolean().optional(),
  cameraUuid: z.string().optional(),
  deviceHwVar: HardwareVariationEnum.optional(),
  deviceUuid: z.string().optional(),
  expirationTime: z.number().int().optional(),
  hideOverlay: z.boolean().optional(),
  invertSchedule: z.boolean().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  passwordProtected: z.boolean().optional(),
  scheduleUuid: z.string().optional(),
  sharedLiveM3U8StreamUrl: z.string().optional(),
  sharedLiveVideoStreamUrl: z.string().optional(),
  sharedWithMonitoringService: z.boolean().optional(),
  ssoProtected: z.boolean().optional(),
  streamType: StreamTypeEnum.optional(),
  timestampMs: z.number().int().optional(),
  unscheduledMessage: z.string().optional(),
  uuid: z.string().optional(),
  vodEnabled: z.boolean().optional()
});
const Camera_FindAllSharedLiveVideoStreamsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedLiveVideoStreams: z.array(Camera_SharedLiveVideoStreamWS).optional()
});
const Camera_FindSharedLiveVideoStreamsForWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional()
});
const Camera_FindSharedLiveVideoStreamsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedLiveVideoStreams: z.array(Camera_SharedLiveVideoStreamWS).optional()
});
const Camera_FindSharedVideoWallsWSRequest: z.ZodObject<any> = z.object({
  videoWallUuid: z.string().optional()
});
const Camera_SharedVideoWallWS: z.ZodObject<any> = z.object({
  deviceScheduleMap: z.record(z.unknown()).optional(),
  expirationTime: z.number().int().optional(),
  hideOverlay: z.boolean().optional(),
  invertSchedule: z.boolean().optional(),
  orgUuid: z.string().optional(),
  passwordProtected: z.boolean().optional(),
  permissionGroupUuid: z.string().optional(),
  scheduleUuid: z.string().optional(),
  sharedVideoWallUrl: z.string().optional(),
  timestampMs: z.number().int().optional(),
  unscheduledMessage: z.string().optional(),
  uuid: z.string().optional(),
  videoWallUuid: z.string().optional(),
  vodEnabled: z.boolean().optional()
});
const Camera_FindSharedVideoWallsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedVideoWalls: z.array(Camera_SharedVideoWallWS).optional()
});
const Camera_FootageBoundingBoxSummaryType: z.ZodObject<any> = z.object({
  deviceMap: z.record(z.unknown()).optional()
});
const Camera_FootageSeekPointSummaryType: z.ZodObject<any> = z.object({
  activityCountMap: z.record(z.unknown()).optional(),
  alert: z.boolean().optional(),
  faceNames: z.array(z.string()).optional(),
  poses: z.array(z.string()).optional(),
  recognizedObjects: z.array(z.string()).optional(),
  unidentifiedFaceIds: z.array(z.string()).optional(),
  vehicleLicensePlates: z.array(z.string()).optional(),
  vehicleNames: z.array(z.string()).optional()
});
const Camera_GenerateBatchRegistrationInfoRequest: z.ZodObject<any> = z.object({
  adminUserPermissionGroups: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  policyUuid: z.string().optional(),
  readOnlyUserPermissionGroups: z.array(z.string()).optional()
});
const Camera_GenerateBatchRegistrationInfoResponse: z.ZodObject<any> = z.object({
  env: z.string().optional(),
  token: z.string().optional()
});
const Camera_GenerateWifiChangeAuthorizationTokenWSRequest: z.ZodObject<any> = z.object({
  perceivedIp: z.string().optional(),
  ssid: z.string().optional()
});
const Camera_GenerateWifiChangeAuthorizationTokenWSResponse: z.ZodObject<any> = z.object({
  authorizationToken: z.array(z.string()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  userUuid: z.string().optional()
});
const Camera_GetBatchRegistrationTokenUsageRequest: z.ZodObject<any> = z.object({
  sinceMillis: z.number().int().optional(),
  token: z.string().optional()
});
const Camera_GetBatchRegistrationTokenUsageResponse: z.ZodObject<any> = z.object({
  usageList: z.array(BatchRegistrationTokenUsageResult).optional()
});
const Camera_GetCameraAIThresholdsWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional()
});
const Camera_GetCameraAIThresholdsWSResponse: z.ZodObject<any> = z.object({
  consecutiveHumanFilter: z.number().int().optional(),
  consecutiveVehicleFilter: z.number().int().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  faceConfidenceThreshold: z.number().optional(),
  faceMatchConfidenceThreshold: z.number().min(0).max(1).optional(),
  humanConfidenceThreshold: z.number().optional(),
  lprConfidenceThreshold: z.number().optional(),
  maxEventDurationMs: z.number().int().optional(),
  vehicleConfidenceThreshold: z.number().optional()
});
const Camera_GetCameraDetailsWSRequest: z.ZodObject<any> = z.object({
  cameraUuids: z.array(z.string()).optional()
});
const Camera_GetCameraDetailsWSResponse: z.ZodObject<any> = z.object({
  cameras: z.array(Camera_CameraExternalType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetCloudArchivedMediaInfoWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional()
});
const Camera_GetCloudArchivedMediaInfoWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  oldestArchivedVideoSegmentSecs: z.number().int().optional()
});
const Camera_GetCloudArchivingConfigWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const DeviceTargetScope = z.string();
const CloudArchivingStrategy = z.string();
const ScopedCloudArchivingConfig: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional(),
  scope: DeviceTargetScope.optional(),
  targetUuid: z.string().optional(),
  uploadScheduleInverted: z.boolean().optional(),
  uploadScheduleUuid: z.string().optional(),
  uploadStrategy: CloudArchivingStrategy.optional()
});
const Camera_GetCloudArchivingConfigWSResponse: z.ZodObject<any> = z.object({
  archivingConfig: ScopedCloudArchivingConfig.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetConfigWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional()
});
const FisheyeDisplayMode = z.string();
const RegionConfigType: z.ZodObject<any> = z.object({
  inverted: z.boolean().optional(),
  polygons: z.array(RegionPolygonType).optional()
});
const RegionOfInterest: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  name: z.string().optional(),
  polygon: RegionPolygonType.optional(),
  uuid: z.string().optional()
});
const RegionOfInterestGroup: z.ZodObject<any> = z.object({
  inclusive: z.boolean().optional(),
  regionsOfInterest: z.array(RegionOfInterest).optional(),
  type: z.string().optional()
});
const Deviceconfig_settings_ExternalVideoResolution: z.ZodObject<any> = z.object({
  height: z.number().int().optional(),
  width: z.number().int().optional()
});
const Deviceconfig_userconfig_IExternalReadableAudioVideoUserConfig: z.ZodObject<any> = z.object({
  ai_dewarp_config: CameraAiDewarpConfigType.optional(),
  audio_aec_via_software: z.boolean().optional(),
  audio_analysis_enabled: z.boolean().optional(),
  audio_external_mic_boost: z.number().int().optional(),
  audio_external_mic_volume: z.number().int().optional(),
  audio_external_speaker_volume: z.number().int().optional(),
  audio_internal_mic_aec_enabled: z.boolean().optional(),
  audio_internal_mic_boost: z.number().int().optional(),
  audio_internal_mic_volume: z.number().int().optional(),
  audio_internal_speaker_volume: z.number().int().optional(),
  audio_min_echo_amplitude: z.number().int().optional(),
  audio_playback_gain_percent: z.number().int().optional(),
  audio_record: z.boolean().optional(),
  audio_supported: z.boolean().optional(),
  audio_use_external_mic: z.boolean().optional(),
  audio_use_external_speaker: z.boolean().optional(),
  audio_use_internal_speaker: z.boolean().optional(),
  bandwidth_reports_disabled: z.boolean().optional(),
  behavior_detection: z.boolean().optional(),
  blocked_debounce_time_ms: z.number().int().optional(),
  blocked_threshold: z.number().optional(),
  char_threshold: z.number().optional(),
  cloud_archive_days: z.number().int().optional(),
  cloud_archive_upload_schedule: z.array(WeeklyMinuteIntervalType).optional(),
  cloud_archive_upload_schedule_inverted: z.boolean().optional(),
  cloud_archive_upload_schedule_uuid: z.string().optional(),
  color_detection: z.boolean().optional(),
  con_human_filter: z.number().int().optional(),
  con_vehicle_filter: z.number().int().optional(),
  cross_counting: z.boolean().optional(),
  cross_counting_settings: CameraCrossCountingSettingsType.optional(),
  deviceUuid: z.string().optional(),
  device_mic_enabled: z.boolean().optional(),
  device_near_audio_silenced: z.boolean().optional(),
  device_speaker_enabled: z.boolean().optional(),
  dewarpMode: z.string().optional(),
  disabled_schedule: z.array(WeeklyMinuteIntervalType).optional(),
  disabled_schedule_inverted: z.boolean().optional(),
  disabled_schedule_uuid: z.string().optional(),
  engagement_counting: z.boolean().optional(),
  exposure_level: z.number().int().optional(),
  face_ai_threshold: z.number().optional(),
  face_counting: z.boolean().optional(),
  face_counting_nonunique: z.boolean().optional(),
  face_id_ai_threshold: z.number().optional(),
  face_match_threshold: z.number().optional(),
  face_recognition: z.boolean().optional(),
  firmware_dev_settings: z.record(z.unknown()).optional(),
  fisheye_display_mode: FisheyeDisplayMode.optional(),
  floorplan_homography: z.array(z.array(z.number())).optional(),
  frontendEqualizerHighShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerLowShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking1: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking2: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking3: FrontendEqualizerSettings.optional(),
  frontendNoiseSuppression: z.boolean().optional(),
  hdr_enabled: z.boolean().optional(),
  high_res_detection: z.boolean().optional(),
  human_detection: z.boolean().optional(),
  human_loitering: z.boolean().optional(),
  human_loitering_settings: CameraHumanLoiteringSettingsType.optional(),
  img_brightness: z.number().int().optional(),
  img_contrast: z.number().int().optional(),
  img_saturation: z.number().int().optional(),
  img_sharpness: z.number().int().optional(),
  lastModified: z.number().int().optional(),
  led_mode_blink_period_ms: z.number().int().optional(),
  led_mode_when_active: z.string().optional(),
  led_mode_when_inactive: z.string().optional(),
  led_stealth_mode: z.boolean().optional(),
  licenseplate_detection: z.boolean().optional(),
  lightweight_detection_disabled: z.boolean().optional(),
  live_license_invalid: z.boolean().optional(),
  lpr_ai_threshold: z.number().optional(),
  max_detections_per_frame: z.number().int().optional(),
  max_event_duration_ms: z.number().int().optional(),
  media_ttl_minutes: z.number().int().optional(),
  metering_config: CameraMeteringConfigType.optional(),
  motion_grid_disabled: z.boolean().optional(),
  motion_grid_window_sec: z.number().int().optional(),
  motion_lightweight_disabled: z.boolean().optional(),
  motion_threshold: z.number().optional(),
  motor_config: CameraMotorConfigType.optional(),
  mounting_direction: z.string().optional(),
  new_motion_feature_flag: z.boolean().optional(),
  night_exposure_level: z.number().int().optional(),
  night_img_brightness: z.number().int().optional(),
  night_img_contrast: z.number().int().optional(),
  night_img_saturation: z.number().int().optional(),
  night_img_sharpness: z.number().int().optional(),
  night_metering_config: CameraMeteringConfigType.optional(),
  night_sensor_gain_max: z.number().int().optional(),
  night_shutter_time_max: z.number().int().optional(),
  night_shutter_time_min: z.number().int().optional(),
  obj_ai_threshold: z.number().optional(),
  object_search: z.boolean().optional(),
  on_demand_license_invalid: z.boolean().optional(),
  orgUuid: z.string().optional(),
  people_counting: z.boolean().optional(),
  person_ai_threshold: z.number().optional(),
  pose_detection: z.boolean().optional(),
  ppe_detection: z.boolean().optional(),
  privacy_window_polygons: z.array(RegionPolygonType).optional(),
  privacy_windows: z.array(PermyriadRect).optional(),
  ptz_config: CameraPTZConfigType.optional(),
  region_for_occupancy: RegionConfigType.optional(),
  region_of_interest: RegionConfigType.optional(),
  region_of_interest_groups: z.array(RegionOfInterestGroup).optional(),
  resolution: Deviceconfig_settings_ExternalVideoResolution.optional(),
  rotation: z.number().int().optional(),
  segment_max_bytes: z.number().int().optional(),
  sensor_gain_max: z.number().int().optional(),
  shutter_time_max: z.number().int().optional(),
  shutter_time_min: z.number().int().optional(),
  snapshot_height: z.number().int().optional(),
  snapshot_interval_secs: z.number().int().optional(),
  snapshot_upload_target: z.string().optional(),
  storage_target_free_megabytes: z.number().int().optional(),
  storage_target_free_space_permyriad: z.number().int().optional(),
  target_ai_fps: z.number().int().optional(),
  thumbstrip_disabled: z.boolean().optional(),
  thumbstrip_upload_target: z.string().optional(),
  tile_views: z.array(DewarpedView).optional(),
  timelapse: z.boolean().optional(),
  upload_all_detections: z.boolean().optional(),
  use_onboard_ai: z.boolean().optional(),
  use_onboard_lpr: z.boolean().optional(),
  use_pilot_face_id: z.boolean().optional(),
  vehicle_ai_threshold: z.number().optional(),
  vehicle_counting: z.boolean().optional(),
  vehicle_detection: z.boolean().optional(),
  video_persist_disabled: z.boolean().optional(),
  visual_tamper_config: CameraVisualTamperConfigType.optional(),
  wdr_enabled: z.boolean().optional(),
  wdr_strength: z.number().int().optional(),
  zero_motion_video_bitrate_percent: z.number().int().optional(),
  zero_motion_video_quality: z.number().int().optional()
});
const Camera_GetConfigWSResponse: z.ZodObject<any> = z.object({
  config: Deviceconfig_userconfig_IExternalReadableAudioVideoUserConfig.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetCurrentStateWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  force: z.boolean().optional()
});
const Camera_GetCurrentStateWSResponse: z.ZodObject<any> = z.object({
  cameraState: Camera_CameraCurrentStateType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetCustomFootageSeekpointsV2WSRequest: z.ZodObject<any> = z.object({
  customDescription: z.string().optional(),
  customDisplayName: z.string().optional(),
  deviceUuids: z.array(z.string()).optional(),
  duration: z.number().int().optional(),
  locationUuids: z.array(z.string()).optional(),
  startTime: z.number().int().optional()
});
const SeekpointType = z.string();
const SeekpointIndexType: z.ZodObject<any> = z.object({
  compositComponentUuid: z.string().optional(),
  customDescription: z.string().optional(),
  customDisplayName: z.string().optional(),
  deviceUuid: z.string().optional(),
  locationUuid: z.string().optional(),
  objectType: ActivityEnum.optional(),
  orgUuid: z.string().optional(),
  seekPointType: SeekpointType.optional(),
  seekpointType: SeekpointType.optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  timestampMs: z.number().int().optional()
});
const Camera_GetCustomFootageSeekpointsV2WSResponse: z.ZodObject<any> = z.object({
  customFootageSeekPoints: z.array(SeekpointIndexType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetFacetedCameraDetailsWSResponse: z.ZodObject<any> = z.object({
  cameras: z.array(Camera_CameraExternalFacetedType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetFootageBoundingBoxesForMultipleWSRequest: z.ZodObject<any> = z.object({
  cameraUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Camera_GetFootageBoundingBoxesForMultipleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageBoundingBoxMap: z.record(z.unknown()).optional()
});
const Camera_GetFootageBoundingBoxesWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  duration: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const Camera_GetFootageBoundingBoxesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageBoundingBoxes: z.array(FootageBoundingBoxType).optional()
});
const Camera_GetFootageSeekpointsForMultipleWSRequest: z.ZodObject<any> = z.object({
  cameraUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  includeAnyMotion: z.boolean().optional(),
  startTimeSec: z.number().int().optional()
});
const Camera_GetFootageSeekpointsForMultipleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageSeekPointMap: z.record(z.unknown()).optional()
});
const Camera_GetFootageSeekpointsV2WSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  duration: z.number().int().optional(),
  includeAnyMotion: z.boolean().optional(),
  startTime: z.number().int().optional()
});
const Camera_GetFootageSeekpointsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageSeekPoints: z.array(FootageSeekPointV2Type).optional()
});
const Camera_GetFootageSeekpointsWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  duration: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const FootageSeekPointType: z.ZodObject<any> = z.object({
  a: ActivityEnum.optional(),
  al: z.boolean().optional(),
  b: z.number().optional(),
  fn: z.string().optional(),
  kp: z.record(z.unknown()).optional(),
  l: z.number().optional(),
  lp: z.string().optional(),
  p: z.string().optional(),
  r: z.number().optional(),
  ro: z.array(z.string()).optional(),
  t: z.number().optional(),
  ts: z.number().int().optional(),
  uf: z.string().optional(),
  vn: z.string().optional()
});
const Camera_GetFootageSeekpointsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageSeekPoints: z.array(FootageSeekPointType).optional()
});
const Camera_GetFullCameraStateWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  force: z.boolean().optional()
});
const Camera_GetFullCameraStateWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  fullCameraState: FullDeviceStateType.optional()
});
const Camera_GetLineCrossingEnabledCamerasForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Camera_GetLineCrossingEnabledCamerasForLocationWSResponse: z.ZodObject<any> = z.object({
  camerasToConfigs: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetMediaUrisWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional()
});
const Camera_GetMediaUrisWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lanCheckUrls: z.array(z.string()).optional(),
  lanLiveH264Uris: z.array(z.string()).optional(),
  lanLiveM3u8Uris: z.array(z.string()).optional(),
  lanLiveMpdUris: z.array(z.string()).optional(),
  lanVodM3u8UrisTemplates: z.array(z.string()).optional(),
  lanVodMpdUrisTemplates: z.array(z.string()).optional(),
  wanLiveH264Uri: z.string().optional(),
  wanLiveM3u8Uri: z.string().optional(),
  wanLiveMpdUri: z.string().optional(),
  wanVodH264UriTemplate: z.string().optional(),
  wanVodM3u8UriTemplate: z.string().optional(),
  wanVodMpdUriTemplate: z.string().optional()
});
const Camera_GetMinimalCameraLocationMapWSRequest = z.record(z.unknown());
const Camera_GetMinimalCameraLocationMapWSResponse: z.ZodObject<any> = z.object({
  cameraLocationMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetMinimalCameraLocationMapWSResponse_CameraLocationInfo: z.ZodObject<any> = z.object({
  cameraName: z.string().optional(),
  locationName: z.string().optional(),
  locationUuid: z.string().optional()
});
const Camera_GetMinimalCameraStateListWSRequest: z.ZodObject<any> = z.object({
  includeMummified: z.boolean().optional()
});
const Camera_GetMinimalCameraStateListWSResponse: z.ZodObject<any> = z.object({
  cameraStates: z.array(MinimalDeviceStateType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetMinimalListWSRequest: z.ZodObject<any> = z.object({
  includeMummified: z.boolean().optional()
});
const Camera_MinimalCameraType: z.ZodObject<any> = z.object({
  connectionStatus: z.string().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  floorNumber: z.number().int().optional(),
  healthStatus: z.string().optional(),
  healthStatusDetails: z.string().optional(),
  lanAddresses: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  liveStreamShared: z.boolean().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mediaRegion: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  region: z.string().optional(),
  serialNumber: z.string().optional(),
  ssid: z.string().optional(),
  uuid: z.string().optional(),
  wifiApMac: z.string().optional(),
  wifiBars: z.number().int().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const Camera_GetMinimalListWSResponse: z.ZodObject<any> = z.object({
  cameras: z.array(Camera_MinimalCameraType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetOccupancyEnabledCamerasWSRequest = z.record(z.unknown());
const Camera_GetOfflineLanStreamingInfoWSRequest = z.record(z.unknown());
const Camera_GetOfflineLanStreamingInfoWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  info: z.record(z.unknown()).optional()
});
const Camera_GetPresenceWindowsWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  durationSec: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Camera_GetPresenceWindowsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  presenceWindows: z.record(z.unknown()).optional()
});
const Camera_SharedCameraCurrentStateType: z.ZodObject<any> = z.object({
  baseVideoOperationUrl: z.string().optional(),
  connectionStatus: z.string().optional(),
  oldestArchivedMediaSeconds: z.number().int().optional(),
  onCameraState: z.record(z.unknown()).optional(),
  onCloudState: z.record(z.unknown()).optional(),
  region: z.string().optional()
});
const Camera_GetSharedCameraCurrentStateWSResponse: z.ZodObject<any> = z.object({
  cameraState: Camera_SharedCameraCurrentStateType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_GetStorageRecoveryFileWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Camera_GetStorageRecoveryFileWSResponse: z.ZodObject<any> = z.object({
  fileContents: z.array(z.string()).optional()
});
const Camera_GetUptimeWindowsWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  endTime: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const TimeWindowSeconds: z.ZodObject<any> = z.object({
  durationSeconds: z.number().int().optional(),
  startSeconds: z.number().int().optional()
});
const Camera_GetUptimeWindowsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uptimeWindows: z.array(TimeWindowSeconds).optional()
});
const Camera_GetVideoWallsWSRequest = z.record(z.unknown());
const Camera_VideoWallSummaryType: z.ZodObject<any> = z.object({
  deviceList: z.array(z.string()).optional(),
  displayName: z.string().optional(),
  numShares: z.number().int().optional(),
  orgUuid: z.string().optional(),
  othersCanEdit: z.boolean().optional(),
  ownerUserUuid: z.string().optional(),
  settings: z.record(z.unknown()).optional(),
  shared: z.boolean().optional(),
  uuid: z.string().optional()
});
const Camera_GetVideoWallsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  userNameMap: z.record(z.unknown()).optional(),
  videoWalls: z.array(Camera_VideoWallSummaryType).optional()
});
const Camera_RebootCameraWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional()
});
const Camera_RebootCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  status: z.string().optional()
});
const Camera_RevertCameraToDefaultsWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional()
});
const Camera_RevertCameraToDefaultsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_UpdateCameraAIThresholdsWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  consecutiveHumanFilter: z.number().int().optional(),
  consecutiveVehicleFilter: z.number().int().optional(),
  faceConfidenceThreshold: z.number().optional(),
  faceMatchConfidenceThreshold: z.number().optional(),
  humanConfidenceThreshold: z.number().optional(),
  lprConfidenceThreshold: z.number().optional(),
  maxEventDurationMs: z.number().int().optional(),
  vehicleConfidenceThreshold: z.number().optional()
});
const Camera_UpdateCameraAIThresholdsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_UpdateCameraFirmwareWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional()
});
const Camera_UpdateCameraFirmwareWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  status: z.string().optional()
});
const Camera_UpdateCameraHumanLoiteringConfigWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  rois: z.array(RegionPolygonType).optional()
});
const Camera_UpdateCameraHumanLoiteringWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_UpdateCameraLineCrossingThresholdsWSRequest_Coordinate: z.ZodObject<any> = z.object({
  x: z.number().optional(),
  y: z.number().optional()
});
const Camera_UpdateCameraLineCrossingThresholdsWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  directions: z.array(z.string()).optional(),
  inverted: z.boolean().optional(),
  objectType: z.string().optional(),
  pointA: Camera_UpdateCameraLineCrossingThresholdsWSRequest_Coordinate.optional(),
  pointB: Camera_UpdateCameraLineCrossingThresholdsWSRequest_Coordinate.optional()
});
const Camera_UpdateCameraLineCrossingThresholdsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_UpdateCameraV2WSRequest: z.ZodObject<any> = z.object({
  customData: z.string().optional(),
  customDataUpdated: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedUpdated: z.boolean().optional(),
  description: z.string().optional(),
  descriptionUpdated: z.boolean().optional(),
  directionRadians: z.number().optional(),
  directionRadiansUpdated: z.boolean().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  facetNameMapUpdated: z.boolean().optional(),
  floorNumber: z.number().int().optional(),
  floorNumberUpdated: z.boolean().optional(),
  latitude: z.number().optional(),
  latitudeUpdated: z.boolean().optional(),
  locationUuid: z.string().optional(),
  locationUuidUpdated: z.boolean().optional(),
  longitude: z.number().optional(),
  longitudeUpdated: z.boolean().optional(),
  mummified: z.boolean().optional(),
  mummifiedUpdated: z.boolean().optional(),
  name: z.string().optional(),
  nameUpdated: z.boolean().optional(),
  policyUuid: z.string().optional(),
  policyUuidUpdated: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  subLocationsHierarchyKeyUpdated: z.boolean().optional(),
  uuid: z.string().optional()
});
const Camera_UpdateCameraV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_UpdateCameraWSRequest: z.ZodObject<any> = z.object({
  camera: Camera_CameraBackwardsCompatUpdateType.optional()
});
const Camera_UpdateCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_UpdateCamerasBulkV2WSRequest: z.ZodObject<any> = z.object({
  cameraBulkDetails: z.array(Camera_UpdateCameraV2WSRequest).optional()
});
const Deviceconfig_userconfig_IExternalUpdateableAudioVideoUserConfig: z.ZodObject<any> = z.object({
  audio_aec_via_software: z.boolean().optional(),
  audio_external_mic_boost: z.number().int().optional(),
  audio_external_mic_volume: z.number().int().optional(),
  audio_external_speaker_volume: z.number().int().optional(),
  audio_internal_mic_aec_enabled: z.boolean().optional(),
  audio_internal_mic_boost: z.number().int().optional(),
  audio_internal_mic_volume: z.number().int().optional(),
  audio_internal_speaker_volume: z.number().int().optional(),
  audio_min_echo_amplitude: z.number().int().optional(),
  audio_playback_gain_percent: z.number().int().optional(),
  audio_record: z.boolean().optional(),
  audio_supported: z.boolean().optional(),
  audio_use_external_mic: z.boolean().optional(),
  audio_use_external_speaker: z.boolean().optional(),
  audio_use_internal_speaker: z.boolean().optional(),
  bandwidth_reports_disabled: z.boolean().optional(),
  blocked_debounce_time_ms: z.number().int().optional(),
  blocked_threshold: z.number().optional(),
  char_threshold: z.number().optional(),
  deviceUuid: z.string().optional(),
  device_mic_enabled: z.boolean().optional(),
  device_near_audio_silenced: z.boolean().optional(),
  device_speaker_enabled: z.boolean().optional(),
  dewarpMode: z.string().optional(),
  disabled_schedule: z.array(WeeklyMinuteIntervalType).optional(),
  disabled_schedule_inverted: z.boolean().optional(),
  disabled_schedule_uuid: z.string().optional(),
  exposure_level: z.number().int().optional(),
  firmware_dev_settings: z.record(z.unknown()).optional(),
  fisheye_display_mode: FisheyeDisplayMode.optional(),
  floorplan_homography: z.array(z.array(z.number())).optional(),
  frontendEqualizerHighShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerLowShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking1: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking2: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking3: FrontendEqualizerSettings.optional(),
  frontendNoiseSuppression: z.boolean().optional(),
  hdr_enabled: z.boolean().optional(),
  high_res_detection: z.boolean().optional(),
  human_detection: z.boolean().optional(),
  human_loitering: z.boolean().optional(),
  human_loitering_settings: CameraHumanLoiteringSettingsType.optional(),
  img_brightness: z.number().int().optional(),
  img_contrast: z.number().int().optional(),
  img_saturation: z.number().int().optional(),
  img_sharpness: z.number().int().optional(),
  lastModified: z.number().int().optional(),
  led_mode_blink_period_ms: z.number().int().optional(),
  led_mode_when_active: z.string().optional(),
  led_mode_when_inactive: z.string().optional(),
  led_stealth_mode: z.boolean().optional(),
  lightweight_detection_disabled: z.boolean().optional(),
  live_license_invalid: z.boolean().optional(),
  max_detections_per_frame: z.number().int().optional(),
  media_ttl_minutes: z.number().int().optional(),
  metering_config: CameraMeteringConfigType.optional(),
  motor_config: CameraMotorConfigType.optional(),
  mounting_direction: z.string().optional(),
  night_exposure_level: z.number().int().optional(),
  night_img_brightness: z.number().int().optional(),
  night_img_contrast: z.number().int().optional(),
  night_img_saturation: z.number().int().optional(),
  night_img_sharpness: z.number().int().optional(),
  night_metering_config: CameraMeteringConfigType.optional(),
  night_sensor_gain_max: z.number().int().optional(),
  night_shutter_time_max: z.number().int().optional(),
  night_shutter_time_min: z.number().int().optional(),
  object_search: z.boolean().optional(),
  on_demand_license_invalid: z.boolean().optional(),
  orgUuid: z.string().optional(),
  privacy_window_polygons: z.array(RegionPolygonType).optional(),
  privacy_windows: z.array(PermyriadRect).optional(),
  ptz_config: CameraPTZConfigType.optional(),
  region_for_occupancy: RegionConfigType.optional(),
  region_of_interest: RegionConfigType.optional(),
  region_of_interest_groups: z.array(RegionOfInterestGroup).optional(),
  resolution: Deviceconfig_settings_ExternalVideoResolution.optional(),
  rotation: z.number().int().optional(),
  segment_max_bytes: z.number().int().optional(),
  sensor_gain_max: z.number().int().optional(),
  shutter_time_max: z.number().int().optional(),
  shutter_time_min: z.number().int().optional(),
  snapshot_height: z.number().int().optional(),
  snapshot_interval_secs: z.number().int().optional(),
  snapshot_upload_target: z.string().optional(),
  storage_target_free_megabytes: z.number().int().optional(),
  storage_target_free_space_permyriad: z.number().int().optional(),
  thumbstrip_upload_target: z.string().optional(),
  tile_views: z.array(DewarpedView).optional(),
  upload_all_detections: z.boolean().optional(),
  use_onboard_lpr: z.boolean().optional(),
  vehicle_detection: z.boolean().optional(),
  video_persist_disabled: z.boolean().optional(),
  wdr_enabled: z.boolean().optional(),
  wdr_strength: z.number().int().optional(),
  zero_motion_video_bitrate_percent: z.number().int().optional()
});
const Camera_UpdateConfigWSRequest: z.ZodObject<any> = z.object({
  config: Deviceconfig_userconfig_IExternalUpdateableAudioVideoUserConfig.optional()
});
const Camera_UpdateVideoWallWSRequest: z.ZodObject<any> = z.object({
  videoWall: VideoWallType.optional()
});
const Camera_UpdateVideoWallWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Camera_UpdateWifiWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  cameraUuids: z.array(z.string()).optional(),
  password: z.string().optional(),
  ssid: z.string().optional()
});
const Camera_UpdateWifiWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  status: z.record(z.unknown()).optional()
});
const CancelLoopingAudioPlaybackActionRecordType: z.ZodObject<any> = z.object({
  statusMap: z.record(z.unknown()).optional()
});
const EarlyExpireModeEnum = z.string();
const DoorStateOverride: z.ZodObject<any> = z.object({
  expireEarlyMode: EarlyExpireModeEnum.optional(),
  expiresAtMillis: z.number().int().optional(),
  followFirstInRules: z.boolean().optional(),
  originator: BaseEventOriginator.optional(),
  requestedAtMillis: z.number().int().optional(),
  startDelaySeconds: z.number().int().optional(),
  state: AccessControlledDoorStateEnumType.optional(),
  type: ManualDoorStateChangeEnum.optional()
});
const CancelledDoorStateOverride: z.ZodObject<any> = z.object({
  originator: BaseEventOriginator.optional(),
  requestedAtMillis: z.number().int().optional(),
  type: ManualDoorStateChangeEnum.optional()
});
const ChangeType = z.string();
const ChatVisibility = z.string();
const ChatPrivacy: z.ZodObject<any> = z.object({
  permissionGroupUuid: z.string().optional(),
  permittedPrincipalUuids: z.array(z.string()).optional(),
  visibility: ChatVisibility.optional()
});
const ResponseType = z.string();
const ChatQueryFilter: z.ZodObject<any> = z.object({
  afterMs: z.number().int().optional(),
  beforeMs: z.number().int().optional(),
  orgUuid: z.string().optional(),
  responseTypes: z.array(ResponseType).optional(),
  responseTypesStr: z.array(z.string()).optional()
});
const QueryStatus = z.string();
const QueryTimelineEvent: z.ZodObject<any> = z.object({
  status: QueryStatus.optional(),
  timestampMs: z.number().int().optional()
});
const QueryTool: z.ZodObject<any> = z.object({
  content: z.string().optional(),
  contentType: z.string().optional(),
  extra: z.string().optional(),
  role: z.string().optional(),
  timestampMs: z.number().int().optional(),
  tool: z.string().optional()
});
const ChatRecord: z.ZodObject<any> = z.object({
  contextId: z.string().optional(),
  llmInfo: z.string().optional(),
  orgUuid: z.string().optional(),
  principalUuid: z.string().optional(),
  privacy: ChatPrivacy.optional(),
  queriedAtMs: z.number().int().optional(),
  query: z.string().optional(),
  respondedAtMs: z.number().int().optional(),
  response: z.string().optional(),
  responseType: ResponseType.optional(),
  timeline: z.array(QueryTimelineEvent).optional(),
  toolingTimeline: z.array(QueryTool).optional(),
  uuid: z.string().optional()
});
const ChatbotConfig: z.ZodObject<any> = z.object({
  apiKey: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  lastUpdatedByPrincipal: z.string().optional(),
  orgUuid: z.string().optional(),
  selfManaged: z.boolean().optional(),
  tokenValid: z.boolean().optional(),
  updatedAtMs: z.number().int().optional()
});
const Chatbot_BaseAutomatedPromptWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  settings: AutomatedPrompt.optional()
});
const Chatbot_BaseChatWSResponse: z.ZodObject<any> = z.object({
  chat: ChatRecord.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Chatbot_BaseChatbotConfigWSResponse: z.ZodObject<any> = z.object({
  config: ChatbotConfig.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Chatbot_CreateAutomatedPromptWSRequest: z.ZodObject<any> = z.object({
  settings: AutomatedPrompt
});
const Chatbot_CreateChatbotConfigWSRequest: z.ZodObject<any> = z.object({
  config: ChatbotConfig
});
const Chatbot_DeleteAutomatedPromptWSRequest: z.ZodObject<any> = z.object({
  promptUuid: z.string()
});
const Chatbot_DeleteChatRecordWSRequest: z.ZodObject<any> = z.object({
  recordUuid: z.string()
});
const Chatbot_DeleteChatbotConfigWSRequest = z.record(z.unknown());
const Chatbot_DeleteChatbotConversationWSRequest: z.ZodObject<any> = z.object({
  contextId: z.string()
});
const Chatbot_GetAutomatedPromptChatHistoryWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional(),
  promptUuid: z.string()
});
const Chatbot_GetAutomatedPromptWSRequest: z.ZodObject<any> = z.object({
  promptUuid: z.string()
});
const Chatbot_GetAutomatedPromptsForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lastEvaluatedKey: z.string().optional(),
  settingsList: z.array(AutomatedPrompt).optional()
});
const Chatbot_GetChatHistoryByContextIdWSRequest: z.ZodObject<any> = z.object({
  contextId: z.string(),
  pageRequest: DynamoPageRequest.optional()
});
const Chatbot_GetChatHistoryWSRequest: z.ZodObject<any> = z.object({
  filter: ChatQueryFilter.optional(),
  pageRequest: DynamoPageRequest.optional()
});
const Chatbot_GetChatHistoryWSResponse: z.ZodObject<any> = z.object({
  chatHistory: z.array(ChatRecord).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lastEvaluatedKey: z.string().optional()
});
const Chatbot_GetChatRecordWSRequest: z.ZodObject<any> = z.object({
  recordUuid: z.string()
});
const Chatbot_GetChatbotConfigWSRequest = z.record(z.unknown());
const Chatbot_GetChatbotConversationsWSRequest: z.ZodObject<any> = z.object({
  pageRequest: DynamoPageRequest.optional()
});
const ContextRecord: z.ZodObject<any> = z.object({
  automated: z.boolean().optional(),
  contextId: z.string().optional(),
  expiresAtMs: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  principalUuid: z.string().optional(),
  queriedAtMs: z.number().int().optional()
});
const Chatbot_GetChatbotConversationsWSResponse: z.ZodObject<any> = z.object({
  conversations: z.array(ContextRecord).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lastEvaluatedKey: z.string().optional()
});
const Chatbot_GetSharedChatRecordsWSRequest: z.ZodObject<any> = z.object({
  filter: ChatQueryFilter.optional()
});
const Chatbot_GetSharedChatRecordsWSResponse: z.ZodObject<any> = z.object({
  chatRecords: z.array(ChatRecord).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Chatbot_SubmitChatWSRequest: z.ZodObject<any> = z.object({
  contextId: z.string(),
  conversationName: z.string().optional(),
  query: z.string()
});
const Chatbot_SubmitChatWSResponse: z.ZodObject<any> = z.object({
  chatRecordUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Chatbot_SubmitTestPromptWSRequest: z.ZodObject<any> = z.object({
  testPrompt: z.string()
});
const Chatbot_SubmitTestPromptWSResponse: z.ZodObject<any> = z.object({
  chatUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Chatbot_UpdateAutomatedPromptWSRequest: z.ZodObject<any> = z.object({
  selectiveUpdate: AutomatedPrompt
});
const Chatbot_UpdateChatRecordWSRequest: z.ZodObject<any> = z.object({
  chat: ChatRecord
});
const Chatbot_UpdateChatbotConfigWSRequest: z.ZodObject<any> = z.object({
  config: ChatbotConfig
});
const ContextRecordSelectiveUpdate: z.ZodObject<any> = z.object({
  realTarget: ContextRecord.optional(),
  updatedFieldNameMap: z.record(z.unknown()).optional()
});
const Chatbot_UpdateChatbotConversationWSRequest: z.ZodObject<any> = z.object({
  selectiveUpdate: ContextRecordSelectiveUpdate.optional()
});
const Chatbot_UpdateChatbotConversationsWSResponse: z.ZodObject<any> = z.object({
  conversation: ContextRecord.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Chatbot_VerifyJobScheduledWSRequest: z.ZodObject<any> = z.object({
  promptUuid: z.string()
});
const Chatbot_VerifyJobScheduledWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  scheduleExpression: z.string().optional(),
  scheduleTimezone: z.string().optional()
});
const ClaimKeyEntry: z.ZodObject<any> = z.object({
  productQuantities: z.record(z.unknown()).optional()
});
const ClaimKey: z.ZodObject<any> = z.object({
  claimEndDate: z.string().datetime({ offset: true }).optional(),
  claimStartDate: z.string().datetime({ offset: true }).optional(),
  createdOn: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  expirationEmailState: z.string().optional(),
  gracePeriodEndDate: z.string().datetime({ offset: true }).optional(),
  maskedClaimCode: z.string().optional(),
  orgUuid: z.string().optional(),
  renewedByClaimKeyUuid: z.string().optional(),
  requestId: z.string().optional(),
  returnHistory: z.array(ClaimKeyReturnEvent).optional(),
  state: z.string().optional(),
  trial: z.boolean().optional(),
  type: z.string().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional()
});
const ClaimKeySearchFilter: z.ZodObject<any> = z.object({
  excludeUnclaimed: z.boolean().optional(),
  excludedStates: z.array(z.string()).optional(),
  includedStates: z.array(z.string()).optional()
});
const Client = z.string();
const ClimateActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const HeatIndexRangeWarningEnum = z.string();
const ClimateEventType: z.ZodObject<any> = z.object({
  alertActivities: z.array(ActivityEnum).optional(),
  baseStationUuid: z.string().optional(),
  batteryPercentage: z.number().int().optional(),
  bleDeviceUuid: z.string().optional(),
  bleRssi: z.number().int().optional(),
  closeBaseStations: z.array(z.string()).optional(),
  co2: z.number().optional(),
  ethanol: z.number().optional(),
  heatIndexDegF: z.number().optional(),
  heatIndexRangeWarning: HeatIndexRangeWarningEnum.optional(),
  humidity: z.number().optional(),
  iaq: z.number().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  pm25: z.number().optional(),
  probeTempC: z.number().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  tampered: z.boolean().optional(),
  temp: z.number().optional(),
  thcDetected: z.boolean().optional(),
  thcPercent: z.number().optional(),
  timestampMs: z.number().int().optional(),
  tvoc: z.number().optional(),
  vapeSmokeDetected: z.boolean().optional(),
  vapeSmokePercent: z.number().optional()
});
const ClimateTriggerType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  threshold: z.number().optional()
});
const ClimateScheduledTriggerType: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(ClimateTriggerType).optional()
});
const ClimatePolicyType: z.ZodObject<any> = z.object({
  backoffAlertSecs: z.record(z.unknown()).optional(),
  defaultTriggers: z.array(ClimateTriggerType).optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(ClimateScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Climate_DeleteEnvironmentalGatewayWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  mummify: z.boolean().optional()
});
const Climate_DeleteEnvironmentalGatewayWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: z.string().optional()
});
const Climate_GetClimateEventsForSensorWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  sensorUuid: z.string().optional()
});
const Climate_GetClimateEventsForSensorWSResponse: z.ZodObject<any> = z.object({
  climateEvents: z.array(ClimateEventType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Climate_GetClimateSensorConfigWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const IClimateUserConfig: z.ZodObject<any> = z.object({
  accelerometer_change_tamper_threshold: z.number().optional(),
  accelerometer_disabled: z.boolean().optional(),
  alert_window_minutes: z.number().int().optional(),
  deviceUuid: z.string().optional(),
  lastModified: z.number().int().optional(),
  orgUuid: z.string().optional(),
  pressure_switch_tamper_disabled: z.boolean().optional(),
  smoke_ai_threshold: z.number().optional(),
  thc_ai_threshold: z.number().optional(),
  vape_ai_threshold: z.number().optional()
});
const Climate_GetClimateSensorConfigWSResponse: z.ZodObject<any> = z.object({
  config: IClimateUserConfig.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Climate_GetEnvironmentalGatewayShadowsWSRequest = z.record(z.unknown());
const Co2SensorType: z.ZodObject<any> = z.object({
  co2Ppm: z.number().int().optional(),
  relHumid: z.number().optional(),
  tempC: z.number().optional(),
  timestampSec: z.number().int().optional()
});
const DeviceOrientationEnum = z.string();
const E50DerivedValuesType: z.ZodObject<any> = z.object({
  airQualityIndex: z.number().int().optional(),
  airQualityIndexPollutant: AirQualityIndexPollutantEnum.optional(),
  calibrating: z.boolean().optional(),
  deviceOrientation: DeviceOrientationEnum.optional(),
  falsePositiveConfidencePercent: z.number().optional(),
  heatIndexDegF: z.number().optional(),
  heatIndexRangeWarning: HeatIndexRangeWarningEnum.optional(),
  indoorAirQuality: z.number().optional(),
  malfunctioningModules: z.array(z.string()).optional(),
  smokeConfidencePercent: z.number().optional(),
  smokeThcConfidencePercent: z.number().optional(),
  smokeTobaccoConfidencePercent: z.number().optional(),
  timestampSec: z.number().int().optional(),
  tvoc: z.number().optional(),
  vapeConfidencePercent: z.number().optional(),
  vapeDetected: z.boolean().optional(),
  vapeThcConfidencePercent: z.number().optional()
});
const FormaSensorType: z.ZodObject<any> = z.object({
  ch2oPpb: z.number().optional(),
  relHumid: z.number().optional(),
  tempC: z.number().optional(),
  timestampSec: z.number().int().optional()
});
const LeakProbeType: z.ZodObject<any> = z.object({
  adcMv: z.number().optional(),
  adcRaw: z.number().int().optional(),
  leakDetected: z.boolean().optional(),
  moistDetected: z.boolean().optional(),
  present: z.boolean().optional(),
  timestampSec: z.number().int().optional()
});
const PmSensorType: z.ZodObject<any> = z.object({
  nc0p5: z.number().optional(),
  nc10p0: z.number().optional(),
  nc1p0: z.number().optional(),
  nc2p5: z.number().optional(),
  nc4p0: z.number().optional(),
  noxIdx: z.number().optional(),
  pm10p0: z.number().optional(),
  pm1p0: z.number().optional(),
  pm2p5: z.number().optional(),
  pm4p0: z.number().optional(),
  relHumid: z.number().optional(),
  tempC: z.number().optional(),
  timestampSec: z.number().int().optional(),
  typPartSize: z.number().optional(),
  vocIdx: z.number().optional()
});
const PressureSensorType: z.ZodObject<any> = z.object({
  pressure: z.number().optional(),
  tempC: z.number().optional(),
  timestampSec: z.number().int().optional()
});
const TempProbeType: z.ZodObject<any> = z.object({
  adcMv: z.number().optional(),
  adcRaw: z.number().int().optional(),
  present: z.boolean().optional(),
  tempC: z.number().optional(),
  timestampSec: z.number().int().optional()
});
const EnvironmentalGatewayShadowType: z.ZodObject<any> = z.object({
  activeAlertTriggers: z.record(z.unknown()).optional(),
  apMac: z.string().optional(),
  carbonMonoSense: COSensorType.optional(),
  co2Sense: Co2SensorType.optional(),
  connected: z.boolean().optional(),
  connectionTimestampMs: z.number().int().optional(),
  connectionUuid: z.string().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  derivedValues: E50DerivedValuesType.optional(),
  deviceUuid: z.string().optional(),
  disconnectTimestampMs: z.number().int().optional(),
  externalIPAddress: z.string().optional(),
  firmwareUpdateInProgress: z.boolean().optional(),
  firmwareUpdateTimeMs: z.number().int().optional(),
  firmwareVersion: z.string().optional(),
  formaSense: FormaSensorType.optional(),
  hardwareUuid: z.string().optional(),
  internalWanAddress: z.string().optional(),
  jumpHostUuid: z.string().optional(),
  lanAddresses: z.array(z.string()).optional(),
  leakProbe: LeakProbeType.optional(),
  orgUuid: z.string().optional(),
  pmSense: PmSensorType.optional(),
  pressSense: PressureSensorType.optional(),
  prevConnected: z.boolean().optional(),
  prevConnectedUpdateTimestampMs: z.number().int().optional(),
  region: z.string().optional(),
  secondaryLanAddresses: z.array(z.string()).optional(),
  ssid: z.string().optional(),
  state: z.record(z.unknown()).optional(),
  stateUpdatedTimestampMs: z.number().int().optional(),
  tempProbe: TempProbeType.optional(),
  timestampMs: z.number().int().optional(),
  type: DeviceTypeEnum.optional(),
  wanAddress: z.string().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const Climate_GetEnvironmentalGatewayShadowsWSResponse: z.ZodObject<any> = z.object({
  environmentalGatewayShadows: z.array(EnvironmentalGatewayShadowType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Climate_GetEventsForEnvironmentalGatewayWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  deviceUuid: z.string().optional(),
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const ClipSeekPointType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  alert: z.boolean().optional(),
  bottom: z.number().optional(),
  faceName: z.string().optional(),
  keypointsV2: z.record(z.unknown()).optional(),
  left: z.number().optional(),
  licensePlate: z.string().optional(),
  pose: z.string().optional(),
  relativeSecond: z.number().optional(),
  right: z.number().optional(),
  top: z.number().optional(),
  unidentifiedFaceId: z.string().optional(),
  vehicleName: z.string().optional()
});
const ClipSeekPointV2Type: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  alert: z.boolean().optional(),
  customActivityColor: z.string().optional(),
  customActivityDescription: z.string().optional(),
  customActivityDisplayName: z.string().optional(),
  dcao: z.boolean().optional(),
  faceName: z.string().optional(),
  id: z.number().int().optional(),
  inMotion: z.boolean().optional(),
  licensePlate: z.string().optional(),
  loudness: z.number().int().optional(),
  pose: z.string().optional(),
  relativeSecond: z.number().optional(),
  sensorValType: SensorValType.optional(),
  toastOrderIdInfo: ToastOrderIdType.optional(),
  tu: z.string().optional(),
  unidentifiedFaceId: z.string().optional(),
  vehicleName: z.string().optional()
});
const ClipBoundingBoxType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  alert: z.boolean().optional(),
  bottom: z.number().int().optional(),
  confidence: z.number().optional(),
  croppedImageLocator: z.string().optional(),
  customActivityColor: z.string().optional(),
  customActivityDescription: z.string().optional(),
  customActivityDisplayName: z.string().optional(),
  faceName: z.string().optional(),
  inMotion: z.boolean().optional(),
  keypointsV2: z.record(z.unknown()).optional(),
  left: z.number().int().optional(),
  licensePlate: z.string().optional(),
  loudness: z.number().int().optional(),
  objectId: z.number().int().optional(),
  pose: z.string().optional(),
  relativeSecond: z.number().optional(),
  right: z.number().int().optional(),
  sensorValType: SensorValType.optional(),
  toastOrderIdInfo: ToastOrderIdType.optional(),
  top: z.number().int().optional(),
  unidentifiedFaceId: z.string().optional(),
  vehicleName: z.string().optional()
});
const ClipMetaDataType: z.ZodObject<any> = z.object({
  activitySeekPoints: z.record(z.unknown()).optional(),
  activitySeekPointsV2: z.array(ClipSeekPointType).optional(),
  activitySeekPointsV3: z.array(ClipSeekPointV2Type).optional(),
  boundingBoxes: z.array(ClipBoundingBoxType).optional(),
  clipLocation: MetaDataLocationType.optional(),
  durationSec: z.number().int().optional(),
  mGrids: z.array(z.string()).optional(),
  soundSignificantLufs: z.array(z.number().int()).optional(),
  startTime: z.number().int().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  thumbnailLocationV2: z.string().optional()
});
const E50ClimateEventType: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  alertTriggerThresholds: z.array(z.number()).optional(),
  alertTriggers: z.array(ActivityEnum).optional(),
  carbonMonoSense: COSensorType.optional(),
  clipMetaData: ClipMetaDataType.optional(),
  co2Sense: Co2SensorType.optional(),
  derivedValues: E50DerivedValuesType.optional(),
  deviceType: DeviceTypeEnum.optional(),
  deviceUuid: z.string().optional(),
  firmwareVersion: z.string().optional(),
  formaSense: FormaSensorType.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  leakProbe: LeakProbeType.optional(),
  orgUuid: z.string().optional(),
  pmSense: PmSensorType.optional(),
  policyUuid: z.string().optional(),
  pressSense: PressureSensorType.optional(),
  tempProbe: TempProbeType.optional(),
  timestampMs: z.number().int().optional(),
  uuid: z.string().optional()
});
const Climate_GetEventsForEnvironmentalGatewayWSResponse: z.ZodObject<any> = z.object({
  events: z.array(E50ClimateEventType).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Climate_GetMinimalClimateStatesWSRequest = z.record(z.unknown());
const Climate_MinimalClimateStateType: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  batteryPercent: z.number().int().optional(),
  calibrating: z.boolean().optional(),
  closestBaseStation: z.string().optional(),
  co2: z.number().optional(),
  createdAtMillis: z.number().int().optional(),
  ethanol: z.number().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  health: z.string().optional(),
  healthDetails: z.string().optional(),
  heatIndexDegF: z.number().optional(),
  heatIndexRangeWarning: HeatIndexRangeWarningEnum.optional(),
  humidity: z.number().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  iaq: z.number().optional(),
  lastSeenSec: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  pm25: z.number().optional(),
  policyUuid: z.string().optional(),
  probeConnected: z.boolean().optional(),
  probeTempC: z.number().optional(),
  sensorUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  signalStrength: z.number().int().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  temperatureCelcius: z.number().optional(),
  thcPercent: z.number().optional(),
  tvoc: z.number().optional(),
  vapePercent: z.number().optional()
});
const Climate_GetMinimalClimateStatesWSResponse: z.ZodObject<any> = z.object({
  climateStates: z.array(Climate_MinimalClimateStateType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Climate_GetMinimalEnvironmentalGatewayStatesWSRequest = z.record(z.unknown());
const Climate_MinimalEnvironmentalGatewayStateType: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  airQualityIndex: z.number().int().optional(),
  airQualityIndexPollutant: AirQualityIndexPollutantEnum.optional(),
  alertTriggers: z.array(ActivityEnum).optional(),
  associatedCameras: z.array(z.string()).optional(),
  calibrating: z.boolean().optional(),
  ch2oPpb: z.number().optional(),
  co2Ppm: z.number().int().optional(),
  coConcentration: z.number().optional(),
  connected: z.boolean().optional(),
  createdAtMillis: z.number().int().optional(),
  defaultInterfaceMac: z.string().optional(),
  deviceUuid: z.string().optional(),
  externalIPAddress: z.string().optional(),
  falsePositiveConfidencePercent: z.number().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  healthDetails: DeviceHealthStatusDetailsEnum.optional(),
  healthStatus: DeviceStatusEnum.optional(),
  heatIndexDegF: z.number().optional(),
  heatIndexRangeWarning: HeatIndexRangeWarningEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  iaq: z.number().optional(),
  lanAddresses: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  leakDetected: z.boolean().optional(),
  leakProbePresent: z.boolean().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  nc0p5: z.number().optional(),
  nc10p0: z.number().optional(),
  nc1p0: z.number().optional(),
  nc2p5: z.number().optional(),
  nc4p0: z.number().optional(),
  noxIdx: z.number().optional(),
  orgUuid: z.string().optional(),
  pm10p0: z.number().optional(),
  pm1p0: z.number().optional(),
  pm2p5: z.number().optional(),
  pm4p0: z.number().optional(),
  policyUuid: z.string().optional(),
  pressure: z.number().optional(),
  probeTempC: z.number().optional(),
  relHumid: z.number().optional(),
  serialNumber: z.string().optional(),
  smokeConfidencePercent: z.number().optional(),
  smokeTobaccoConfidencePercent: z.number().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  tempC: z.number().optional(),
  tempProbePresent: z.boolean().optional(),
  timestampMs: z.number().int().optional(),
  typPartSize: z.number().optional(),
  vapeConfidencePercent: z.number().optional(),
  vapeDetected: z.boolean().optional(),
  vapeThcConfidencePercent: z.number().optional(),
  vocIdx: z.number().optional()
});
const Climate_GetMinimalEnvironmentalGatewayStatesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lastEvaluatedKey: z.string().optional(),
  minimalEnvironmentalGatewayStates: z.array(Climate_MinimalEnvironmentalGatewayStateType).optional()
});
const Climate_RebootEnvironmentalGatewayWSRequest: z.ZodObject<any> = z.object({
  environmentalGatewayUuid: z.string().optional()
});
const Climate_UpdateClimateSensorDetailsWSRequest: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  associatedCamerasUpdated: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedUpdated: z.boolean().optional(),
  description: z.string().optional(),
  descriptionUpdated: z.boolean().optional(),
  floorNumber: z.number().int().optional(),
  floorNumberUpdated: z.boolean().optional(),
  latitude: z.number().optional(),
  latitudeUpdated: z.boolean().optional(),
  locationUuid: z.string().optional(),
  locationUuidUpdated: z.boolean().optional(),
  longitude: z.number().optional(),
  longitudeUpdated: z.boolean().optional(),
  name: z.string().optional(),
  nameUpdated: z.boolean().optional(),
  policyUuid: z.string().optional(),
  policyUuidUpdated: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  subLocationsHierarchyKeyUpdated: z.boolean().optional(),
  uuid: z.string().optional()
});
const Climate_UpdateClimateSensorDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Climate_UpdateEnvironmentalGatewayDetailsWSRequest: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  associatedCamerasUpdated: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedUpdated: z.boolean().optional(),
  description: z.string().optional(),
  descriptionUpdated: z.boolean().optional(),
  floorNumber: z.number().int().optional(),
  floorNumberUpdated: z.boolean().optional(),
  latitude: z.number().optional(),
  latitudeUpdated: z.boolean().optional(),
  locationUuid: z.string().optional(),
  locationUuidUpdated: z.boolean().optional(),
  longitude: z.number().optional(),
  longitudeUpdated: z.boolean().optional(),
  name: z.string().optional(),
  nameUpdated: z.boolean().optional(),
  policyUuid: z.string().optional(),
  policyUuidUpdated: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  subLocationsHierarchyKeyUpdated: z.boolean().optional(),
  uuid: z.string().optional()
});
const Climate_UpdateEnvironmentalGatewayDetailsWSResponse = z.record(z.unknown());
const ClipVisibility = z.string();
const ClipAccessSettings: z.ZodObject<any> = z.object({
  allowedUsers: z.array(z.string()).optional(),
  visibility: ClipVisibility.optional()
});
const SharedClipV2Type: z.ZodObject<any> = z.object({
  clipLocation: MetaDataLocationType.optional(),
  deviceUuidMap: z.record(z.unknown()).optional(),
  durationSec: z.number().int().optional(),
  startTime: z.number().int().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  uuid: z.string().optional()
});
const ClipGroupType: z.ZodObject<any> = z.object({
  clips: z.array(SharedClipV2Type).optional(),
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  isShared: z.boolean().optional(),
  orgUuid: z.string().optional(),
  sharedGroups: z.array(z.string()).optional(),
  title: z.string().optional(),
  uuid: z.string().optional()
});
const SharedClipWithDetailsType: z.ZodObject<any> = z.object({
  boundingBoxes: z.array(ClipBoundingBoxType).optional(),
  clipLocation: MetaDataLocationType.optional(),
  description: z.string().optional(),
  deviceUuidMap: z.record(z.unknown()).optional(),
  durationSec: z.number().int().optional(),
  seekPoints: z.array(ClipSeekPointV2Type).optional(),
  startTime: z.number().int().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  uuid: z.string().optional()
});
const ClipGroupWithDetailsType: z.ZodObject<any> = z.object({
  clips: z.array(SharedClipWithDetailsType).optional(),
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  isShared: z.boolean().optional(),
  orgUuid: z.string().optional(),
  sharedGroups: z.array(z.string()).optional(),
  title: z.string().optional(),
  uuid: z.string().optional()
});
const Common_devices_CalibrateFloorplanProjectionWSRequest: z.ZodObject<any> = z.object({
  cameraImagePointsPermyriad: z.array(z.array(z.number().int())).optional(),
  deviceUuid: z.string().optional(),
  floorplanImagePointsPermyriad: z.array(z.array(z.number().int())).optional()
});
const Common_devices_CalibrateFloorplanProjectionWSResponse: z.ZodObject<any> = z.object({
  homography: z.array(z.array(z.number())).optional()
});
const Common_devices_GetBoundingBoxesWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  durationSecs: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Common_devices_GetBoundingBoxesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageBoundingBoxes: z.array(FootageBoundingBoxType).optional()
});
const Common_devices_GetCameraOrDoorbellCameraSeekpointsWSRequest: z.ZodObject<any> = z.object({
  activitySet: z.array(ActivityEnum).optional(),
  deviceUuid: z.string().optional(),
  durationSecs: z.number().int().optional(),
  includeAnyMotion: z.boolean().optional(),
  seekpointDurationIntervalSecs: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Common_devices_GetFullDeviceStateWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  force: z.boolean().optional()
});
const Common_devices_GetMediaUrisWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Common_devices_GetMinimalDeviceStateListWSRequest: z.ZodObject<any> = z.object({
  includeMummified: z.boolean().optional()
});
const Common_devices_GetPresenceWindowsWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  durationSec: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Common_devices_GetPresenceWindowsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  presenceWindows: z.record(z.unknown()).optional()
});
const Common_devices_GetSeekpointsWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  durationSecs: z.number().int().optional(),
  includeAnyMotion: z.boolean().optional(),
  startTimeSec: z.number().int().optional()
});
const Common_devices_GetSeekpointsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageSeekPoints: z.array(FootageSeekPointV2Type).optional()
});
const Common_devices_GetUptimeWindowsWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  endTimeMs: z.number().int().optional(),
  startTimeMs: z.number().int().optional()
});
const Common_devices_GetUptimeWindowsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uptimeWindows: z.array(TimeWindowSeconds).optional()
});
const Common_devices_RebootDeviceWSResponse: z.ZodObject<any> = z.object({
  result: z.string().optional()
});
const Common_devices_UpdateConfigWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Common_devices_UpdateDeviceDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Common_devices_rawstream_CreateRawHttpStreamWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  rawStreamName: z.string().optional(),
  streamType: StreamTypeEnum.optional()
});
const Common_devices_rawstream_CreateRawHttpStreamWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lanAudioUrl: z.string().optional(),
  lanVideoLowResUrl: z.string().optional(),
  lanVideoUrl: z.string().optional()
});
const Common_devices_rawstream_DeleteRawHttpStreamWSRequest: z.ZodObject<any> = z.object({
  customPathPart: z.string().optional(),
  deviceUuid: z.string().optional()
});
const Common_devices_rawstream_DeleteRawHttpStreamWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Common_devices_rawstream_FindAllRawHttpStreamsWSRequest = z.record(z.unknown());
const Common_devices_rawstream_LanSpecificRawStreamType: z.ZodObject<any> = z.object({
  audioPath: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  createdBy: z.string().optional(),
  customPathPart: z.string().optional(),
  deviceType: DeviceTypeEnum.optional(),
  deviceUuid: z.string().optional(),
  lanAudioUrl: z.string().optional(),
  lanVideoLowResUrl: z.string().optional(),
  lanVideoUrl: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  streamType: StreamTypeEnum.optional(),
  videoLowResPath: z.string().optional(),
  videoPath: z.string().optional()
});
const Common_devices_rawstream_FindAllRawHttpStreamsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rawHttpStreams: z.array(Common_devices_rawstream_LanSpecificRawStreamType).optional()
});
const Common_devices_rawstream_GetRawHttpStreamsWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Common_devices_rawstream_GetRawHttpStreamsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rawHttpStreams: z.array(Common_devices_rawstream_LanSpecificRawStreamType).optional()
});
const DoorbellEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const DoorReaderStateEnumType = z.string();
const DoorReaderStateChangeReasonEnumType = z.string();
const DoorReaderStateChangeEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const DoorRelayStateEnumType = z.string();
const DoorRelayStateChangeEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const DoorPositionIndicatorStateEnumType = z.string();
const DoorPositionIndicatorStateChangeEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const RequestToExitStateEnumType = z.string();
const RequestToExitStateChangeEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const CredentialSourceEnumType = z.string();
const CredentialEntryBleWave: z.ZodObject<any> = z.object({
  credSource: CredentialSourceEnumType.optional(),
  credentialId: z.string().optional(),
  firstInEligible: z.boolean().optional(),
  originator: BaseEventOriginator.optional()
});
const CredentialEntry: z.ZodObject<any> = z.object({
  credSource: CredentialSourceEnumType.optional(),
  credentialId: z.string().optional(),
  firstInEligible: z.boolean().optional(),
  originator: BaseEventOriginator.optional()
});
const CredentialReceivedEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const GenericInputStateEnumType = z.string();
const GenericInputStateChangeEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const GenericRelayStateChangeEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const DoorLocationLockdownStateEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const PanicButtonEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const WaveToUnlockIntentExpiredEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const DoorStateChangeEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const DoorAuthFirstInStateEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const DoorScheduleFirstInStateEvent: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const ComponentEventType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  correlationId: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: ComponentEventEnumType.optional(),
  uuid: z.string().optional()
});
const ComponentSeekPointType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  componentCompositeUuid: z.string().optional(),
  componentUuid: z.string().optional(),
  customActivityColor: z.string().optional(),
  customActivityDescription: z.string().optional(),
  customActivityDisplayName: z.string().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  originalEvent: z.record(z.unknown()).optional(),
  ownerDeviceUuid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  timestampMs: z.number().int().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional()
});
const DoorReaderShadowType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const DoorRelayShadowType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const DoorPositionIndicatorShadowType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const RequestToExitShadowType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const GenericInputShadowType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const GenericRelayShadowType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const GenericButtonStateEnumType = z.string();
const GenericButtonShadowType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const ComponentShadowType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  type: ComponentShadowEnumType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const Component_AddAccessControlledDoorLabelWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  label: z.string().optional()
});
const Component_AddAccessControlledDoorLabelWSResponse = z.record(z.unknown());
const Component_AggregatedCredentialReceivedEventInfo: z.ZodObject<any> = z.object({
  firstEvent: CredentialReceivedEventType.optional(),
  lastEvent: CredentialReceivedEventType.optional(),
  totalCount: z.number().int().optional()
});
const Component_ApplyAccessControlledDoorStateOverrideWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string(),
  doorAuthFirstInState: FirstInStatus.optional(),
  doorScheduleFirstInState: FirstInStatus.optional(),
  expireEarlyMode: EarlyExpireModeEnum.optional(),
  expiresAtMillis: z.number().int().optional(),
  followFirstInRules: z.boolean().optional(),
  startDelaySeconds: z.number().int().optional(),
  state: AccessControlledDoorStateEnumType
});
const Component_ApplyAccessControlledDoorStateOverrideWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoor: AccessControlledDoorType.optional()
});
const Component_CancelAccessControlledDoorStateOverrideWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string()
});
const Component_CancelAccessControlledDoorStateOverrideWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoor: AccessControlledDoorType.optional()
});
const Component_CreateAccessControlledDoorSeekpointsWSRequest: z.ZodObject<any> = z.object({
  doorUuid: z.string().optional(),
  seekPoints: z.array(CustomFootageSeekPointType).optional()
});
const Component_CreateAccessControlledDoorSeekpointsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  successMsg: z.string().optional()
});
const Component_CreateAccessControlledDoorWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoor: AccessControlledDoorType.optional(),
  accessControlledDoorLabels: z.array(z.string()).optional()
});
const Component_CreateAccessControlledDoorWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoor: AccessControlledDoorType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Component_CreateAperioDoorInfo: z.ZodObject<any> = z.object({
  aperioDoorDeviceId: z.string().optional(),
  aperioDoorId: z.string().optional()
});
const Component_CreateAperioDoorsWSRequest: z.ZodObject<any> = z.object({
  aperioGatewayComponentId: z.string(),
  doors: z.array(Component_CreateAperioDoorInfo),
  ownerDeviceUuid: z.string()
});
const Component_CreateAperioDoorsWSResponse: z.ZodObject<any> = z.object({
  doors: z.array(AccessControlledDoorType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedDoors: z.array(AccessControlledDoorType).optional()
});
const Component_CreateAperioGatewayWSRequest: z.ZodObject<any> = z.object({
  aperioGatewayId: z.string(),
  includeAperioDoors: z.boolean().optional(),
  ownerDeviceUuid: z.string()
});
const Component_CreateAperioGatewayWSResponse: z.ZodObject<any> = z.object({
  component: AperioGateway.optional(),
  doors: z.array(AccessControlledDoorType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedDoors: z.array(AccessControlledDoorType).optional()
});
const Component_CreateIntegratedDoorPositionIndicatorWSRequest: z.ZodObject<any> = z.object({
  name: z.string().optional(),
  normalState: NormalStateEnumType.optional(),
  ownerDeviceUuid: z.string().optional(),
  port: DoorPositionIndicatorPortType.optional()
});
const Component_CreateIntegratedDoorPositionIndicatorWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedDoorPositionIndicatorType.optional()
});
const Component_CreateIntegratedDoorRelayWSRequest: z.ZodObject<any> = z.object({
  name: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  port: DoorRelayPortType.optional()
});
const Component_CreateIntegratedDoorRelayWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedDoorRelayType.optional()
});
const Component_CreateIntegratedGenericButtonWSRequest: z.ZodObject<any> = z.object({
  mode: ButtonModeEnum.optional(),
  name: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  port: ButtonPortType.optional()
});
const Component_CreateIntegratedGenericButtonWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedGenericButtonType.optional()
});
const Component_CreateIntegratedGenericInputWSRequest: z.ZodObject<any> = z.object({
  name: z.string().optional(),
  normalState: NormalStateEnumType.optional(),
  ownerDeviceUuid: z.string().optional(),
  port: AuxiliaryInputPortType.optional()
});
const Component_CreateIntegratedGenericInputWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedGenericInputType.optional()
});
const Component_CreateIntegratedGenericRelayWSRequest: z.ZodObject<any> = z.object({
  name: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  port: AuxiliaryRelayPortType.optional(),
  steadyState: GenericRelayStateEnumType.optional()
});
const Component_CreateIntegratedGenericRelayWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedGenericRelayType.optional()
});
const Component_CreateIntegratedRequestToExitWSRequest: z.ZodObject<any> = z.object({
  intentOnly: z.boolean().optional(),
  intentOnlyEvents: z.boolean().optional(),
  name: z.string().optional(),
  normalState: NormalStateEnumType.optional(),
  ownerDeviceUuid: z.string().optional(),
  port: RequestToExitPortType.optional()
});
const Component_CreateIntegratedRequestToExitWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedRequestToExitType.optional()
});
const Component_CreateOsdpReaderWSRequest: z.ZodObject<any> = z.object({
  allowUnencrypted: z.boolean().optional(),
  disableCardReader: z.boolean().optional(),
  disableKeypad: z.boolean().optional(),
  name: z.string().optional(),
  otherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  ownerDeviceUuid: z.string().optional(),
  port: OsdpReaderPortType.optional(),
  remoteUnlockAudioFeedbackEnabled: z.boolean().optional()
});
const Component_CreateOsdpReaderWSResponse: z.ZodObject<any> = z.object({
  component: OsdpDoorReaderType.optional()
});
const Component_CreateRhombusOsdpReaderWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  disableCardReader: z.boolean().optional(),
  disableWaveToUnlock: z.boolean().optional(),
  name: z.string().optional(),
  otherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  ownerDeviceUuid: z.string().optional(),
  port: OsdpReaderPortType.optional(),
  remoteUnlockAudioFeedbackEnabled: z.boolean().optional()
});
const Component_CreateRhombusOsdpReaderWSResponse: z.ZodObject<any> = z.object({
  component: RhombusOsdpDoorReaderType.optional()
});
const Component_CreateWiegandReaderWSRequest: z.ZodObject<any> = z.object({
  buzzerPort: WiegandOutputPortType.optional(),
  d0Port: WiegandDataPortType.optional(),
  d1Port: WiegandDataPortType.optional(),
  disableCardReader: z.boolean().optional(),
  disableKeypad: z.boolean().optional(),
  gledPort: WiegandOutputPortType.optional(),
  name: z.string().optional(),
  otherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  ownerDeviceUuid: z.string().optional(),
  remoteUnlockAudioFeedbackEnabled: z.boolean().optional(),
  rledPort: WiegandOutputPortType.optional(),
  tamperPort: WiegandInputPortType.optional()
});
const Component_CreateWiegandReaderWSResponse: z.ZodObject<any> = z.object({
  component: WiegandDoorReaderType.optional()
});
const Component_DeleteAccessControlledDoorWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional()
});
const Component_DeleteAccessControlledDoorWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoor: AccessControlledDoorType.optional()
});
const Component_DeleteComponentWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional()
});
const Component_DeleteComponentWSResponse = z.record(z.unknown());
const Component_DeleteComponentsByOwnerDeviceWSRequest: z.ZodObject<any> = z.object({
  ownerDeviceUuid: z.string().optional()
});
const Component_DeleteComponentsByOwnerDeviceWSResponse = z.record(z.unknown());
const Component_FindAccessControlledDoorShadowsByLocationWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  locationUuid: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Component_FindAccessControlledDoorShadowsByLocationWSResponse: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  shadows: z.array(AccessControlledDoorShadow).optional()
});
const Component_FindAccessControlledDoorShadowsWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  locationUuid: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Component_FindAccessControlledDoorShadowsWSResponse: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  shadows: z.array(AccessControlledDoorShadow).optional()
});
const Component_FindAccessControlledDoorsByLocationWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  locationUuid: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Component_FindAccessControlledDoorsByLocationWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoors: z.array(AccessControlledDoorType).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Component_FindAccessControlledDoorsByOwnerDeviceWSRequest: z.ZodObject<any> = z.object({
  ownerDeviceUuid: z.string().optional()
});
const Component_FindAccessControlledDoorsByOwnerDeviceWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoors: z.array(AccessControlledDoorType).optional()
});
const Component_FindAccessControlledDoorsWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Component_FindAccessControlledDoorsWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoors: z.array(AccessControlledDoorType).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Component_FindAllComponentShadowsWSRequest: z.ZodObject<any> = z.object({
  componentUuids: z.array(z.string()).optional()
});
const Component_FindAllComponentShadowsWSResponse: z.ZodObject<any> = z.object({
  acuComponentShadowMap: z.record(z.unknown()).optional()
});
const Component_FindComponentEventsByAccessControlledDoorWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsByAccessControlledDoorWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Component_FindComponentEventsByApiTokenWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  tokenUuid: z.string().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsByApiTokenWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsByComponentWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsByComponentWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsByCorrelationWSRequest: z.ZodObject<any> = z.object({
  correlationId: z.string().optional(),
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsByCorrelationWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsByCredentialHexValueWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  credentialHexValue: z.string().optional(),
  limit: z.number().int().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsByCredentialHexValueWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsByCredentialUuidWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  credentialUuid: z.string().optional(),
  limit: z.number().int().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsByCredentialUuidWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsByCredentialValueWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  credentialValue: z.string().optional(),
  limit: z.number().int().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsByCredentialValueWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsByLocationWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  locationUuid: z.string().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsByLocationWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsByOwnerDeviceWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  ownerDeviceUuid: z.string().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsByOwnerDeviceWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsBySupportAuthorityWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  supportAuthorityUuid: z.string().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsBySupportAuthorityWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsByUserWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional(),
  userUuid: z.string().optional()
});
const Component_FindComponentEventsByUserWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsForCurrentUserWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsForOrgDashboardWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  reverseSearch: z.boolean().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Component_FindComponentEventsForOrgDashboardWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional()
});
const Component_FindComponentEventsForVideoIntercomWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  typeFilter: z.array(ComponentEventEnumType).optional(),
  videoIntercomUuid: z.string().optional()
});
const Component_FindComponentEventsForVideoIntercomWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Component_FindComponentSeekPointsByAccessControlledDoorWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  durationSec: z.number().int().optional(),
  startTimeSecEpochExclusive: z.number().int().optional()
});
const Component_FindComponentSeekPointsByAccessControlledDoorWSResponse: z.ZodObject<any> = z.object({
  seekpoints: z.array(ComponentSeekPointType).optional()
});
const Component_FindComponentSeekPointsByAccessControlledDoorsWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuidList: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  sortResponse: z.boolean().optional(),
  startTimeSecEpochExclusive: z.number().int().optional()
});
const Component_FindComponentSeekPointsByAccessControlledDoorsWSResponse: z.ZodObject<any> = z.object({
  seekpoints: z.array(ComponentSeekPointType).optional()
});
const Component_FindComponentSeekPointsByComponentWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  durationSec: z.number().int().optional(),
  startTimeSecEpochExclusive: z.number().int().optional()
});
const Component_FindComponentSeekPointsByComponentWSResponse: z.ZodObject<any> = z.object({
  seekpoints: z.array(ComponentSeekPointType).optional()
});
const Component_FindComponentSeekPointsByLocationWSRequest: z.ZodObject<any> = z.object({
  durationSec: z.number().int().optional(),
  locationUuid: z.string().optional(),
  startTimeSecEpochExclusive: z.number().int().optional()
});
const Component_FindComponentSeekPointsByLocationWSResponse: z.ZodObject<any> = z.object({
  seekpoints: z.array(ComponentSeekPointType).optional()
});
const Component_FindComponentSeekPointsByOwnerDeviceWSRequest: z.ZodObject<any> = z.object({
  durationSec: z.number().int().optional(),
  ownerDeviceUuid: z.string().optional(),
  startTimeSecEpochExclusive: z.number().int().optional()
});
const Component_FindComponentSeekPointsByOwnerDeviceWSResponse: z.ZodObject<any> = z.object({
  seekpoints: z.array(ComponentSeekPointType).optional()
});
const Component_FindComponentSeekPointsByUserWSRequest: z.ZodObject<any> = z.object({
  durationSec: z.number().int().optional(),
  startTimeSecEpochExclusive: z.number().int().optional(),
  userUuid: z.string().optional()
});
const Component_FindComponentSeekPointsByUserWSResponse: z.ZodObject<any> = z.object({
  seekpoints: z.array(ComponentSeekPointType).optional()
});
const Component_FindComponentShadowsByOwnerDeviceWSRequest: z.ZodObject<any> = z.object({
  ownerDeviceUuid: z.string().optional()
});
const Component_FindComponentShadowsByOwnerDeviceWSResponse: z.ZodObject<any> = z.object({
  componentShadows: z.array(ComponentShadowType).optional()
});
const Component_FindComponentsByOwnerDeviceWSRequest: z.ZodObject<any> = z.object({
  ownerDeviceUuid: z.string().optional()
});
const Component_FindComponentsByOwnerDeviceWSResponse: z.ZodObject<any> = z.object({
  components: z.array(BaseComponentType).optional()
});
const Component_FindDistinctOriginatorCredentialReceivedEventsByAccessControlledDoorWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  activityFilter: z.array(ActivityEnum).optional(),
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  credSourceFilter: z.array(CredentialSourceEnumType).optional(),
  originatorTypeFilter: z.array(EventOriginatorEnum).optional(),
  userFilter: z.array(z.string()).optional()
});
const Component_FindDistinctOriginatorCredentialReceivedEventsByAccessControlledDoorWSResponse: z.ZodObject<any> = z.object({
  events: z.array(Component_AggregatedCredentialReceivedEventInfo).optional()
});
const Component_FindDistinctOriginatorCredentialReceivedEventsByLocationWSRequest: z.ZodObject<any> = z.object({
  activityFilter: z.array(ActivityEnum).optional(),
  componentCompositeFilter: z.array(z.string()).optional(),
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  credSourceFilter: z.array(CredentialSourceEnumType).optional(),
  locationUuid: z.string().optional(),
  originatorTypeFilter: z.array(EventOriginatorEnum).optional(),
  userFilter: z.array(z.string()).optional()
});
const Component_FindDistinctOriginatorCredentialReceivedEventsByLocationWSResponse: z.ZodObject<any> = z.object({
  events: z.array(Component_AggregatedCredentialReceivedEventInfo).optional()
});
const Component_FindMinimalStateAccessControlledDoorsByLocationWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  locationUuid: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Component_MinimalStateAccessControlledDoor: z.ZodObject<any> = z.object({
  door: AccessControlledDoorType.optional(),
  shadow: AccessControlledDoorShadow.optional()
});
const Component_FindMinimalStateAccessControlledDoorsByLocationWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoors: z.array(Component_MinimalStateAccessControlledDoor).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Component_FindMinimalStateAccessControlledDoorsWSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Component_FindMinimalStateAccessControlledDoorsWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoors: z.array(Component_MinimalStateAccessControlledDoor).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Component_GetAccessControlledDoorLabelsForOrgWSRequest = z.record(z.unknown());
const Component_GetAccessControlledDoorLabelsForOrgWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoorLabels: z.record(z.unknown()).optional()
});
const Component_GetCurrentExpectedAccessControlledDoorStateWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string()
});
const Schedule_AccessControlledDoorStateSourceEnum = z.string();
const Schedule_AccessControlledDoorNextNearestSchedule: z.ZodObject<any> = z.object({
  currentlyActive: z.boolean().optional(),
  doorState: AccessControlledDoorStateEnumType.optional(),
  scheduleUuid: z.string().optional(),
  source: Schedule_AccessControlledDoorStateSourceEnum.optional(),
  startsAtMillisInclusive: z.number().int().optional(),
  stopsAtMillisInclusive: z.number().int().optional()
});
const Component_GetCurrentExpectedAccessControlledDoorStateWSResponse: z.ZodObject<any> = z.object({
  activeDoorState: AccessControlledDoorStateEnumType.optional(),
  activeDoorStateSource: Schedule_AccessControlledDoorStateSourceEnum.optional(),
  defaultDoorStateSource: Schedule_AccessControlledDoorStateSourceEnum.optional(),
  defaultState: AccessControlledDoorStateEnumType.optional(),
  doorStateIfFirstInRequired: AccessControlledDoorStateEnumType.optional(),
  doorStateIfFirstInSatisfied: AccessControlledDoorStateEnumType.optional(),
  doorStateSourceIfFirstInRequired: Schedule_AccessControlledDoorStateSourceEnum.optional(),
  doorStateSourceIfFirstInSatisfied: Schedule_AccessControlledDoorStateSourceEnum.optional(),
  firstInRequirementEnabled: z.boolean().optional(),
  firstInRequirementSatisfied: z.boolean().optional(),
  nextNearestSchedule: Schedule_AccessControlledDoorNextNearestSchedule.optional()
});
const Component_GetFullAccessControlledDoorShadowWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional()
});
const Component_GetFullAccessControlledDoorShadowWSResponse: z.ZodObject<any> = z.object({
  doorComponentShadowMap: z.record(z.unknown()).optional(),
  doorShadow: AccessControlledDoorShadow.optional()
});
const Component_GetOrCreateDevicePhysicalPortConfigWSRequest: z.ZodObject<any> = z.object({
  ownerDeviceUuid: z.string().optional()
});
const InvalidPhysicalPortReasonEnumType = z.string();
const InvalidPhysicalPortConfigType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  componentUuids: z.array(z.string()).optional(),
  portNum: z.number().int().optional(),
  reason: InvalidPhysicalPortReasonEnumType.optional()
});
const DevicePhysicalPortConfigType: z.ZodObject<any> = z.object({
  boardMap: z.record(z.unknown()).optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  ownerDeviceUuid: z.string().optional(),
  updatedAtMillis: z.number().int().optional()
});
const Component_GetOrCreateDevicePhysicalPortConfigWSResponse: z.ZodObject<any> = z.object({
  detectedInvalidPortConfigs: z.array(InvalidPhysicalPortConfigType).optional(),
  deviceComponents: z.array(BaseComponentType).optional(),
  devicePhysicalPortConfig: DevicePhysicalPortConfigType.optional()
});
const Component_RemoveAccessControlledDoorLabelWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  label: z.string().optional()
});
const Component_RemoveAccessControlledDoorLabelWSResponse = z.record(z.unknown());
const Component_UpdateAccessControlledDoorWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  ajarTimeSec: z.number().int().optional(),
  associatedCameras: z.array(z.string()).optional(),
  associatedFaceDetectionCameras: z.array(z.string()).optional(),
  defaultState: AccessControlledDoorStateEnumType.optional(),
  directionRadians: z.number().optional(),
  doorStateToScheduleUuidMap: z.record(z.unknown()).optional(),
  dpiComponents: z.array(ComponentReferenceType).optional(),
  floorNumber: z.number().int().optional(),
  forceAllReadersFirstInAuthRequiredLedFeedbackEnabled: z.boolean().optional(),
  forceAllReadersFirstInUnlockPendingLedFeedbackEnabled: z.boolean().optional(),
  forceAllReadersOtherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  forceAllReadersRemoteUnlockAudioFeedbackEnabled: z.boolean().optional(),
  forcedOpenEnabled: z.boolean().optional(),
  forcedOpenTimeSec: z.number().int().optional(),
  geofenceEnabled: z.boolean().optional(),
  geofenceRadius: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  proximityUnlockSettings: ProximityUnlockSettingsType.optional(),
  readerComponents: z.array(ComponentReferenceType).optional(),
  relayComponents: z.array(ComponentReferenceType).optional(),
  relockAfterOpenTimeMs: z.number().int().optional(),
  remoteUnlockEnabled: z.boolean().optional(),
  rexComponents: z.array(ComponentReferenceType).optional(),
  unlockTimeSec: z.number().int().optional(),
  unlockTimeSecRex: z.number().int().optional(),
  waveToUnlockSettings: WaveToUnlockSettingsType.optional()
});
const Component_UpdateAccessControlledDoorWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoor: AccessControlledDoorType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Component_UpdateIntegratedDoorPositionIndicatorWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  name: z.string().optional(),
  normalState: NormalStateEnumType.optional(),
  port: DoorPositionIndicatorPortType.optional()
});
const Component_UpdateIntegratedDoorPositionIndicatorWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedDoorPositionIndicatorType.optional()
});
const Component_UpdateIntegratedDoorRelayWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  name: z.string().optional(),
  port: DoorRelayPortType.optional()
});
const Component_UpdateIntegratedDoorRelayWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedDoorRelayType.optional()
});
const Component_UpdateIntegratedGenericButtonWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  mode: ButtonModeEnum.optional(),
  name: z.string().optional(),
  port: ButtonPortType.optional()
});
const Component_UpdateIntegratedGenericButtonWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedGenericButtonType.optional()
});
const Component_UpdateIntegratedGenericInputWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  name: z.string().optional(),
  normalState: NormalStateEnumType.optional(),
  port: AuxiliaryInputPortType.optional()
});
const Component_UpdateIntegratedGenericInputWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedGenericInputType.optional()
});
const Component_UpdateIntegratedGenericRelaySteadyStateWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  steadyState: GenericRelayStateEnumType.optional()
});
const Component_UpdateIntegratedGenericRelaySteadyStateWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedGenericRelayType.optional()
});
const Component_UpdateIntegratedGenericRelayTransientStateWSRequest: z.ZodObject<any> = z.object({
  activate: z.boolean().optional(),
  componentUuid: z.string().optional(),
  correlationUuid: z.string().optional(),
  deviceUuid: z.string().optional(),
  durationMs: z.number().int().optional()
});
const Component_UpdateIntegratedGenericRelayTransientStateWSResponse: z.ZodObject<any> = z.object({
  success: z.boolean().optional()
});
const Component_UpdateIntegratedGenericRelayWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  name: z.string().optional(),
  port: AuxiliaryRelayPortType.optional()
});
const Component_UpdateIntegratedGenericRelayWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedGenericRelayType.optional()
});
const Component_UpdateIntegratedRequestToExitWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  intentOnly: z.boolean().optional(),
  intentOnlyEvents: z.boolean().optional(),
  name: z.string().optional(),
  normalState: NormalStateEnumType.optional(),
  port: RequestToExitPortType.optional()
});
const Component_UpdateIntegratedRequestToExitWSResponse: z.ZodObject<any> = z.object({
  component: IntegratedRequestToExitType.optional()
});
const Component_UpdateOsdpReaderWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  disableCardReader: z.boolean().optional(),
  disableKeypad: z.boolean().optional(),
  name: z.string().optional(),
  otherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  port: OsdpReaderPortType.optional(),
  remoteUnlockAudioFeedbackEnabled: z.boolean().optional()
});
const Component_UpdateOsdpReaderWSResponse: z.ZodObject<any> = z.object({
  component: OsdpDoorReaderType.optional()
});
const Component_UpdateRhombusOsdpReaderWSRequest: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  disableCardReader: z.boolean().optional(),
  disableWaveToUnlock: z.boolean().optional(),
  name: z.string().optional(),
  otherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  port: OsdpReaderPortType.optional(),
  remoteUnlockAudioFeedbackEnabled: z.boolean().optional()
});
const Component_UpdateRhombusOsdpReaderWSResponse: z.ZodObject<any> = z.object({
  component: RhombusOsdpDoorReaderType.optional()
});
const Component_UpdateWiegandReaderWSRequest: z.ZodObject<any> = z.object({
  buzzerPort: WiegandOutputPortType.optional(),
  componentUuid: z.string().optional(),
  d0Port: WiegandDataPortType.optional(),
  d1Port: WiegandDataPortType.optional(),
  disableCardReader: z.boolean().optional(),
  disableKeypad: z.boolean().optional(),
  gledPort: WiegandOutputPortType.optional(),
  name: z.string().optional(),
  otherReaderUnlockAudioFeedbackEnabled: z.boolean().optional(),
  remoteUnlockAudioFeedbackEnabled: z.boolean().optional(),
  rledPort: WiegandOutputPortType.optional(),
  tamperPort: WiegandInputPortType.optional()
});
const Component_UpdateWiegandReaderWSResponse: z.ZodObject<any> = z.object({
  component: WiegandDoorReaderType.optional()
});
const Consignee: z.ZodObject<any> = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  postalCode: z.string().optional(),
  state: z.string().optional()
});
const CountingActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const CrossingCountsType: z.ZodObject<any> = z.object({
  egressCount: z.number().int().optional(),
  ingressCount: z.number().int().optional(),
  timestampMs: z.number().int().optional()
});
const CustomerShipmentType: z.ZodObject<any> = z.object({
  "ait-aitTrackingNumber": z.string().optional(),
  "ait-carrierTrackingNumber": z.string().optional(),
  "ait-depositorOrderNumber": z.string().optional(),
  "ait-destinationAddress": z.string().optional(),
  "ait-isIngramDistributorShipment": z.boolean().optional(),
  "ait-shipmentDate": z.string().datetime({ offset: true }).optional(),
  "ait-shippedItems": z.array(ShippedItemType).optional(),
  interchangeControlNumber: z.string().optional(),
  lastStateUpdateSec: z.number().int().optional(),
  "rhombus-additionalEmails": z.string().optional(),
  "rhombus-chosenCarrierName": z.string().optional(),
  "rhombus-claimKeyToLicenseMap": z.record(z.unknown()).optional(),
  "rhombus-claimKeyToLicenseMapV2": z.record(z.unknown()).optional(),
  "rhombus-customerEmails": z.string().optional(),
  "rhombus-customerName": z.string().optional(),
  "rhombus-orgUuid": z.string().optional(),
  "rhombus-partnerOrgUuid": z.string().optional(),
  "rhombus-purchaseOrderNumber": z.string().optional(),
  "rhombus-rmaReturnTrackingNumber": z.string().optional(),
  "rhombus-rmaUuid": z.string().optional(),
  "rhombus-rmaUuids": z.array(z.string()).optional(),
  "rhombus-salesForceOpportunityId": z.string().optional(),
  "rhombus-zendeskTicketNumber": z.string().optional(),
  shipmentCategory: z.string().optional(),
  shipmentEmailState: z.string().optional(),
  shipmentState: z.string().optional(),
  uuid: z.string().optional()
});
const Customer_AcceptUsagePolicyRequest = z.record(z.unknown());
const Customer_AcceptUsagePolicyResponse = z.record(z.unknown());
const Customer_DeleteNotificationSnoozeSettingWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Customer_DeleteNotificationSnoozeSettingWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Customer_GetCurrentPartnerUserWSRequest = z.record(z.unknown());
const NotificationIntervalV2Type: z.ZodObject<any> = z.object({
  activityTriggerMap: z.record(z.unknown()).optional(),
  deviceFilterSet: z.array(z.string()).optional(),
  diagnosticTriggerMap: z.record(z.unknown()).optional(),
  locationActivityTriggerMap: z.record(z.unknown()).optional(),
  locationDiagnosticTriggerMap: z.record(z.unknown()).optional(),
  locationFilterSet: z.array(z.string()).optional(),
  locationOnlyFilterSet: z.array(z.string()).optional(),
  minuteOfWeekStart: z.number().int().optional(),
  minuteOfWeekStop: z.number().int().optional()
});
const PartnerNotificationSettingsType: z.ZodObject<any> = z.object({
  allClientsSelected: z.boolean().optional(),
  clientNotificationIntervalsMap: z.record(z.unknown()).optional(),
  notificationIntervalsForAllClients: z.array(NotificationIntervalV2Type).optional(),
  orgUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  userUuid: z.string().optional()
});
const MinuteOfDayIntervalType: z.ZodObject<any> = z.object({
  dayOfWeek: z.number().int().optional(),
  minuteOfDayStartInclusive: z.number().int().optional(),
  minuteOfDayStopExclusive: z.number().int().optional()
});
const NotificationEnumType = z.string();
const PartnerNotificationClientSectionRow: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  days: z.array(z.string()).optional(),
  diagnostics: z.array(z.string()).optional(),
  interval: MinuteOfDayIntervalType.optional(),
  mediums: z.array(NotificationEnumType).optional()
});
const PartnerNotificationClientSection: z.ZodObject<any> = z.object({
  clientUuids: z.array(z.string()).optional(),
  rows: z.array(PartnerNotificationClientSectionRow).optional()
});
const PartnerNotificationSettingsV2: z.ZodObject<any> = z.object({
  allClientsSelected: z.boolean().optional(),
  clientNotificationIntervalsMap: z.record(z.unknown()).optional(),
  notificationIntervalsForAllClients: z.array(PartnerNotificationClientSection).optional(),
  orgUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  userUuid: z.string().optional()
});
const WrappedRhombusOrgUserType: z.ZodObject<any> = z.object({
  accessibleRhombusApps: z.array(z.string()).optional(),
  accountOwner: z.boolean().optional(),
  bypassSaml: z.boolean().optional(),
  changePasswordOnLogin: z.boolean().optional(),
  createdAtMillis: z.number().int().optional(),
  deleted: z.boolean().optional(),
  email: z.string().optional(),
  emailCaseSensitive: z.string().optional(),
  emailVerified: z.boolean().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  mfaEnabled: z.boolean().optional(),
  mfaTokenType: z.string().optional(),
  name: z.string().optional(),
  orgUserCustomizationFlags: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  passwordSet: z.boolean().optional(),
  rhombusUserUuid: z.string().optional(),
  status: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const Customer_GetCurrentPartnerUserWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  flags: z.record(z.unknown()).optional(),
  notificationSettings: PartnerNotificationSettingsType.optional(),
  notificationSettingsV2: PartnerNotificationSettingsV2.optional(),
  permissionGroupUuid: z.string().optional(),
  user: WrappedRhombusOrgUserType.optional()
});
const Customer_GetCurrentRhombusKeyUserWSRequest = z.record(z.unknown());
const User_RhombusKeyOrgDetailsType: z.ZodObject<any> = z.object({
  companyLogoUrl: z.string().optional(),
  name: z.string().optional(),
  uuid: z.string().optional()
});
const RhombusKeyAppPreferencesType: z.ZodObject<any> = z.object({
  favoriteAccessControlledDoorUuids: z.array(z.string()).optional()
});
const StaticEpochSecondsProvisioner: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const EpochSecondsProvisioner: z.ZodObject<any> = z.object({
  type: z.string()
});
const RhombusSecureMobileCredentialProvisioningRulesType: z.ZodObject<any> = z.object({
  endDateProvisioner: EpochSecondsProvisioner.optional(),
  maxMobileCredsAllowed: z.number().int().optional(),
  startDateProvisioner: EpochSecondsProvisioner.optional()
});
const RhombusKeyAppSettingsType: z.ZodObject<any> = z.object({
  bypassSaml: z.boolean().optional(),
  credentialProvisioningRules: RhombusSecureMobileCredentialProvisioningRulesType.optional(),
  remoteUnlockEnabled: z.boolean().optional(),
  rhombusKeyAccessEnabled: z.boolean().optional()
});
const RhombusKeyAppConfigType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  preferences: RhombusKeyAppPreferencesType.optional(),
  rhombusOrgUserUuid: z.string().optional(),
  settings: RhombusKeyAppSettingsType.optional(),
  updatedAtMillis: z.number().int().optional()
});
const Customer_GetCurrentRhombusKeyUserWSResponse: z.ZodObject<any> = z.object({
  orgDetails: User_RhombusKeyOrgDetailsType.optional(),
  rhombusKeyConfig: RhombusKeyAppConfigType.optional(),
  user: WrappedRhombusOrgUserType.optional()
});
const Customer_GetCurrentUserConsoleOrgsForContextSwitchWSRequest = z.record(z.unknown());
const Customer_SelectableOrgForContextSwitch: z.ZodObject<any> = z.object({
  companyThumbnailLogoUrl: z.string().optional(),
  orgName: z.string().optional(),
  orgUuid: z.string().optional(),
  rhombusKeyLogoUrl: z.string().optional(),
  userName: z.string().optional()
});
const Customer_GetCurrentUserConsoleOrgsForContextSwitchWSResponse: z.ZodObject<any> = z.object({
  orgs: z.array(Customer_SelectableOrgForContextSwitch).optional()
});
const Customer_GetCurrentUserRhombusKeyOrgsForContextSwitchWSRequest = z.record(z.unknown());
const Customer_GetCurrentUserRhombusKeyOrgsForContextSwitchWSResponse: z.ZodObject<any> = z.object({
  orgs: z.array(Customer_SelectableOrgForContextSwitch).optional()
});
const Customer_GetCurrentUserSessionsWSRequest = z.record(z.unknown());
const SessionClientInfoType: z.ZodObject<any> = z.object({
  appName: z.string().optional(),
  appOs: z.string().optional(),
  appVersion: z.string().optional(),
  userAgent: z.string().optional()
});
const GeoIpLocationType: z.ZodObject<any> = z.object({
  city_name: z.string().optional(),
  country_code: z.string().optional(),
  country_name: z.string().optional(),
  region_name: z.string().optional()
});
const SessionInfoWSType: z.ZodObject<any> = z.object({
  clientInfo: SessionClientInfoType.optional(),
  clientType: z.string().optional(),
  currentSession: z.boolean().optional(),
  lastActivityTimeMs: z.number().int().optional(),
  lastIpAccessedFrom: z.string().optional(),
  lastIpAccessedFromGeoLocation: GeoIpLocationType.optional()
});
const Customer_GetCurrentUserSessionsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sessions: z.array(SessionInfoWSType).optional()
});
const Customer_GetCurrentUserWSRequest = z.record(z.unknown());
const DashboardCustomizations: z.ZodObject<any> = z.object({
  fullCamera: z.string().optional(),
  halfCamera: z.string().optional(),
  layout: z.string().optional(),
  rememberedLocation: z.string().optional(),
  report: z.string().optional(),
  videoWall: z.string().optional()
});
const UserCustomizationsType: z.ZodObject<any> = z.object({
  dashboard: DashboardCustomizations.optional(),
  frontend: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const UserNotificationSettingsV3Type: z.ZodObject<any> = z.object({
  notificationIntervalsV2: z.array(NotificationIntervalV2Type).optional(),
  orgUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  userUuid: z.string().optional()
});
const NotificationTimeFrameRow: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  devices: z.array(z.string()).optional(),
  diagnostics: z.array(z.string()).optional(),
  locationOnly: z.array(z.string()).optional(),
  locationOnlyActivities: z.array(ActivityEnum).optional(),
  locationOnlyDiagnostics: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  promptUuids: z.array(z.string()).optional()
});
const NotificationTimeFrame: z.ZodObject<any> = z.object({
  days: z.array(z.string()).optional(),
  interval: MinuteOfDayIntervalType.optional(),
  mediums: z.array(NotificationEnumType).optional(),
  rows: z.array(NotificationTimeFrameRow).optional()
});
const UserNotificationSettingsV4Type: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  timeFrames: z.array(NotificationTimeFrame).optional(),
  userUuid: z.string().optional()
});
const Customer_GetCurrentUserWSResponse: z.ZodObject<any> = z.object({
  customizations: UserCustomizationsType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  flags: z.record(z.unknown()).optional(),
  notificationSettings: UserNotificationSettingsV3Type.optional(),
  notificationSettingsV2: UserNotificationSettingsV4Type.optional(),
  permissionGroupUuid: z.string().optional(),
  user: WrappedRhombusOrgUserType.optional()
});
const DashboardStatus: z.ZodObject<any> = z.object({
  camerasDown: z.number().int().optional(),
  camerasDownByLocation: z.record(z.unknown()).optional(),
  camerasUp: z.number().int().optional(),
  healthStatusIndicator: z.string().optional(),
  healthStatusMsg: z.string().optional(),
  locationCameraStatus: z.record(z.unknown()).optional(),
  totalCameras: z.number().int().optional(),
  totalClimateSensors: z.number().int().optional(),
  totalDoorSensors: z.number().int().optional(),
  totalLocations: z.number().int().optional(),
  totalProximitySensors: z.number().int().optional()
});
const Customer_GetDashboardStatusWSResponse: z.ZodObject<any> = z.object({
  dashboardStatus: DashboardStatus.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Customer_GetDashboardstatusWSRequest = z.record(z.unknown());
const Customer_GetRhombusKeyConfigForCurrentUserWSRequest = z.record(z.unknown());
const Customer_GetRhombusKeyConfigForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  userRhombusKeyConfig: RhombusKeyAppConfigType.optional()
});
const Customer_GetUserSnoozedNotificationSettingsWSRequest = z.record(z.unknown());
const ScheduledIntervalType: z.ZodObject<any> = z.object({
  durationSecs: z.number().int().optional(),
  timestampSec: z.number().int().optional(),
  uuid: z.string().optional()
});
const Customer_GetUserSnoozedNotificationSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  snoozedForAllNotificationsIntervals: z.array(ScheduledIntervalType).optional(),
  snoozedForComponentCompositesMap: z.record(z.unknown()).optional(),
  snoozedForDevicesMap: z.record(z.unknown()).optional(),
  snoozedForLocationsMap: z.record(z.unknown()).optional()
});
const Customer_LogoutAllOtherCurrentUserSessionsRequest = z.record(z.unknown());
const Customer_LogoutAllOtherCurrentUserSessionsResponse = z.record(z.unknown());
const Customer_SetFlagWSRequest: z.ZodObject<any> = z.object({
  flagName: z.string().optional(),
  flagValue: z.string().optional()
});
const Customer_SetFlagWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Customer_SnoozeAllNotificationsWSRequest: z.ZodObject<any> = z.object({
  durationSec: z.number().int().optional(),
  scheduledTimestampSec: z.number().int().optional()
});
const Customer_SnoozeAllNotificationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Customer_SnoozeNotificationsWSRequest: z.ZodObject<any> = z.object({
  componentCompositeUuids: z.array(z.string()).optional(),
  deviceUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  locationUuids: z.array(z.string()).optional(),
  scheduledTimestampSec: z.number().int().optional()
});
const Customer_SnoozeNotificationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Customer_UpdateCurrentPartnerWSRequest: z.ZodObject<any> = z.object({
  bypassSaml: z.boolean().optional(),
  mfaEnabled: z.boolean().optional(),
  name: z.string().optional(),
  notificationSettings: PartnerNotificationSettingsType.optional(),
  permissionGroupUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional()
});
const Customer_UpdateCurrentPartnerWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Customer_UpdateCurrentUserWSRequest: z.ZodObject<any> = z.object({
  dashboardCustomizations: DashboardCustomizations.optional(),
  mfaEnabled: z.boolean().optional(),
  name: z.string().optional(),
  notificationIntervalsV2: z.array(NotificationIntervalV2Type).optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional()
});
const Customer_UpdateCurrentUserWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Customer_UpdateDashboardCustomizationsWSRequest: z.ZodObject<any> = z.object({
  fullCamera: z.string().optional(),
  fullCameraUpdated: z.boolean().optional(),
  halfCamera: z.string().optional(),
  halfCameraUpdated: z.boolean().optional(),
  layout: z.string().optional(),
  layoutUpdated: z.boolean().optional(),
  rememberedLocation: z.string().optional(),
  rememberedLocationUpdated: z.boolean().optional(),
  report: z.string().optional(),
  reportUpdated: z.boolean().optional(),
  videoWall: z.string().optional(),
  videoWallUpdated: z.boolean().optional()
});
const Customer_UpdateDashboardCustomizationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Customer_UpdateFrontendCustomizationsWSRequest: z.ZodObject<any> = z.object({
  customizations: z.record(z.unknown()).optional()
});
const Customer_UpdateFrontendCustomizationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Customer_UpdateRhombusKeyPreferencesForCurrentUserWSRequest: z.ZodObject<any> = z.object({
  favoriteAccessControlledDoorUuids: z.array(z.string()).optional(),
  favoriteAccessControlledDoorUuidsUpdated: z.boolean().optional()
});
const Customer_UpdateRhombusKeyPreferencesForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  userRhombusKeyConfig: RhombusKeyAppConfigType.optional()
});
const DeleteSharedLiveVideoStreamForDeviceResponse = z.record(z.unknown());
const EventListenerType: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  clientCertificate: z.array(z.string()).optional(),
  clientKey: z.array(z.string()).optional(),
  deviceUuid: z.string().optional(),
  hostname: z.string().optional(),
  orgUuid: z.string().optional(),
  trustedCertificate: z.array(z.string()).optional(),
  uri: z.string().optional(),
  uuid: z.string().optional()
});
const Developer_CreateEventListenerWSRequest: z.ZodObject<any> = z.object({
  eventListner: EventListenerType.optional()
});
const Developer_CreateEventListenerWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  eventListenerUuid: z.string().optional()
});
const Developer_DeleteEventListenerWSRequest: z.ZodObject<any> = z.object({
  eventListenerUuid: z.string().optional()
});
const Developer_DeleteEventListenerWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Developer_GetAllEventListenersWSRequest = z.record(z.unknown());
const Developer_GetAllEventListenersWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  eventListeners: z.array(EventListenerType).optional()
});
const Developer_GetEventListenersForDeviceWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Developer_GetEventListenersForDeviceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  eventListeners: z.array(EventListenerType).optional()
});
const DeviceAssignableLicenseGroupStats: z.ZodObject<any> = z.object({
  assignedCount: z.number().int().optional(),
  deviceLicenseFamilyStats: z.array(DeviceLicenseFamilyStats).optional(),
  lastEndDate: z.string().datetime({ offset: true }).optional(),
  nearExpirationCount: z.number().int().optional(),
  nextEndDate: z.string().datetime({ offset: true }).optional(),
  stateStats: LicenseStateStats.optional(),
  totalCount: z.number().int().optional()
});
const DeviceCatalogItem: z.ZodObject<any> = z.object({
  durationMonths: z.number().int().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional()
});
const DeviceEventRecordType: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  componentCompositeUuid: z.string().optional(),
  componentUuid: z.string().optional(),
  deviceType: DeviceTypeEnum.optional(),
  deviceUuid: z.string().optional(),
  eventUuid: z.string().optional(),
  hardwareVariation: HardwareVariationEnum.optional(),
  locationUuid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  timestampMs: z.number().int().optional()
});
const DeviceFeatureEnum = z.string();
const DeviceIntegrationSettings: z.ZodObject<any> = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  name: z.string().optional()
});
const DeviceIntegrationType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const LicenseFeature: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  name: z.string().optional()
});
const DeviceLicenseType: z.ZodObject<any> = z.object({
  claimKeyUuid: z.string().optional(),
  createdOn: z.string().datetime({ offset: true }).optional(),
  deviceType: DeviceTypeEnum.optional(),
  deviceUuid: z.string().optional(),
  features: z.array(LicenseFeature).optional(),
  firstAssignedDate: z.string().datetime({ offset: true }).optional(),
  licenseFamily: z.string().optional(),
  licenseToUnassignEmailState: z.string().optional(),
  licenseType: License.optional(),
  maxDeleteDate: z.string().datetime({ offset: true }).optional(),
  orgUuid: z.string().optional(),
  priorClaimKeyUuid: z.string().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional(),
  state: z.string().optional(),
  trial: z.boolean().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional()
});
const DeviceSchedule: z.ZodObject<any> = z.object({
  invertSchedule: z.boolean().optional(),
  scheduleUuid: z.string().optional(),
  unscheduledMessage: z.string().optional()
});
const DeviceTypeV2: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  customData: z.string().optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  hardwareId: z.string().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  pending: z.boolean().optional(),
  policyUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  type: DeviceTypeEnum.optional(),
  uuid: z.string().optional()
});
const Deviceconfig_GetConfigWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Deviceconfig_GetFacetedUserConfigWSResponse: z.ZodObject<any> = z.object({
  config: Deviceconfig_userconfig_ExternalReadableFacetedUserConfig.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Deviceconfig_UpdateFacetedUserConfigWSRequest: z.ZodObject<any> = z.object({
  configUpdate: Deviceconfig_userconfig_ExternalUpdateableFacetedUserConfig.optional()
});
const Deviceconfig_settings_ExternalAudioSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  audio_aec_via_software: z.boolean().optional(),
  audio_external_mic_boost: z.number().int().optional(),
  audio_external_mic_volume: z.number().int().optional(),
  audio_external_speaker_volume: z.number().int().optional(),
  audio_internal_mic_aec_enabled: z.boolean().optional(),
  audio_internal_mic_boost: z.number().int().optional(),
  audio_internal_mic_volume: z.number().int().optional(),
  audio_internal_speaker_volume: z.number().int().optional(),
  audio_min_echo_amplitude: z.number().int().optional(),
  audio_playback_gain_percent: z.number().int().optional(),
  audio_record: z.boolean().optional(),
  audio_supported: z.boolean().optional(),
  audio_use_external_mic: z.boolean().optional(),
  audio_use_external_speaker: z.boolean().optional(),
  audio_use_internal_speaker: z.boolean().optional(),
  device_mic_enabled: z.boolean().optional(),
  device_near_audio_silenced: z.boolean().optional(),
  device_speaker_enabled: z.boolean().optional(),
  frontendEqualizerHighShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerLowShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking1: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking2: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking3: FrontendEqualizerSettings.optional(),
  frontendNoiseSuppression: z.boolean().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const Deviceconfig_settings_ExternalReadableAudioSettings: z.ZodObject<any> = z.object({
  audio_aec_via_software: z.boolean().optional(),
  audio_analysis_enabled: z.boolean().optional(),
  audio_external_mic_boost: z.number().int().optional(),
  audio_external_mic_volume: z.number().int().optional(),
  audio_external_speaker_volume: z.number().int().optional(),
  audio_internal_mic_aec_enabled: z.boolean().optional(),
  audio_internal_mic_boost: z.number().int().optional(),
  audio_internal_mic_volume: z.number().int().optional(),
  audio_internal_speaker_volume: z.number().int().optional(),
  audio_min_echo_amplitude: z.number().int().optional(),
  audio_playback_gain_percent: z.number().int().optional(),
  audio_record: z.boolean().optional(),
  audio_supported: z.boolean().optional(),
  audio_use_external_mic: z.boolean().optional(),
  audio_use_external_speaker: z.boolean().optional(),
  audio_use_internal_speaker: z.boolean().optional(),
  device_mic_enabled: z.boolean().optional(),
  device_near_audio_silenced: z.boolean().optional(),
  device_speaker_enabled: z.boolean().optional(),
  frontendEqualizerHighShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerLowShelf: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking1: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking2: FrontendEqualizerSettings.optional(),
  frontendEqualizerPeaking3: FrontendEqualizerSettings.optional(),
  frontendNoiseSuppression: z.boolean().optional()
});
const Deviceconfig_settings_ExternalReadableVideoSettings: z.ZodObject<any> = z.object({
  ai_dewarp_config: CameraAiDewarpConfigType.optional(),
  behavior_detection: z.boolean().optional(),
  blocked_debounce_time_ms: z.number().int().optional(),
  blocked_threshold: z.number().optional(),
  char_threshold: z.number().optional(),
  color_detection: z.boolean().optional(),
  con_human_filter: z.number().int().optional(),
  con_vehicle_filter: z.number().int().optional(),
  cross_counting: z.boolean().optional(),
  cross_counting_settings: CameraCrossCountingSettingsType.optional(),
  dewarpMode: z.string().optional(),
  disabled_schedule: z.array(WeeklyMinuteIntervalType).optional(),
  disabled_schedule_inverted: z.boolean().optional(),
  disabled_schedule_uuid: z.string().optional(),
  engagement_counting: z.boolean().optional(),
  exposure_level: z.number().int().optional(),
  face_ai_threshold: z.number().optional(),
  face_counting: z.boolean().optional(),
  face_counting_nonunique: z.boolean().optional(),
  face_id_ai_threshold: z.number().optional(),
  face_match_threshold: z.number().optional(),
  face_recognition: z.boolean().optional(),
  fisheye_display_mode: FisheyeDisplayMode.optional(),
  floorplan_homography: z.array(z.array(z.number())).optional(),
  hdr_enabled: z.boolean().optional(),
  high_res_detection: z.boolean().optional(),
  human_detection: z.boolean().optional(),
  human_loitering: z.boolean().optional(),
  human_loitering_settings: CameraHumanLoiteringSettingsType.optional(),
  img_brightness: z.number().int().optional(),
  img_contrast: z.number().int().optional(),
  img_saturation: z.number().int().optional(),
  img_sharpness: z.number().int().optional(),
  licenseplate_detection: z.boolean().optional(),
  lpr_ai_threshold: z.number().optional(),
  max_detections_per_frame: z.number().int().optional(),
  metering_config: CameraMeteringConfigType.optional(),
  motion_grid_disabled: z.boolean().optional(),
  motion_grid_window_sec: z.number().int().optional(),
  motion_lightweight_disabled: z.boolean().optional(),
  motion_threshold: z.number().optional(),
  motor_config: CameraMotorConfigType.optional(),
  mounting_direction: z.string().optional(),
  new_motion_feature_flag: z.boolean().optional(),
  night_exposure_level: z.number().int().optional(),
  night_img_brightness: z.number().int().optional(),
  night_img_contrast: z.number().int().optional(),
  night_img_saturation: z.number().int().optional(),
  night_img_sharpness: z.number().int().optional(),
  night_metering_config: CameraMeteringConfigType.optional(),
  night_sensor_gain_max: z.number().int().optional(),
  night_shutter_time_max: z.number().int().optional(),
  night_shutter_time_min: z.number().int().optional(),
  obj_ai_threshold: z.number().optional(),
  object_search: z.boolean().optional(),
  people_counting: z.boolean().optional(),
  person_ai_threshold: z.number().optional(),
  pose_detection: z.boolean().optional(),
  ppe_detection: z.boolean().optional(),
  privacy_window_polygons: z.array(RegionPolygonType).optional(),
  privacy_windows: z.array(PermyriadRect).optional(),
  ptz_config: CameraPTZConfigType.optional(),
  region_for_occupancy: RegionConfigType.optional(),
  region_of_interest: RegionConfigType.optional(),
  region_of_interest_groups: z.array(RegionOfInterestGroup).optional(),
  resolution: Deviceconfig_settings_ExternalVideoResolution.optional(),
  rotation: z.number().int().optional(),
  segment_max_bytes: z.number().int().optional(),
  sensor_gain_max: z.number().int().optional(),
  shutter_time_max: z.number().int().optional(),
  shutter_time_min: z.number().int().optional(),
  snapshot_height: z.number().int().optional(),
  snapshot_interval_secs: z.number().int().optional(),
  target_ai_fps: z.number().int().optional(),
  thumbstrip_disabled: z.boolean().optional(),
  tile_views: z.array(DewarpedView).optional(),
  timelapse: z.boolean().optional(),
  upload_all_detections: z.boolean().optional(),
  use_onboard_ai: z.boolean().optional(),
  use_onboard_lpr: z.boolean().optional(),
  use_pilot_face_id: z.boolean().optional(),
  vehicle_ai_threshold: z.number().optional(),
  vehicle_counting: z.boolean().optional(),
  vehicle_detection: z.boolean().optional(),
  video_persist_disabled: z.boolean().optional(),
  visual_tamper_config: CameraVisualTamperConfigType.optional(),
  wdr_enabled: z.boolean().optional(),
  wdr_strength: z.number().int().optional(),
  zero_motion_video_bitrate_percent: z.number().int().optional(),
  zero_motion_video_quality: z.number().int().optional()
});
const Deviceconfig_settings_ExternalVideoSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  blocked_debounce_time_ms: z.number().int().optional(),
  blocked_threshold: z.number().optional(),
  char_threshold: z.number().optional(),
  dewarpMode: z.string().optional(),
  disabled_schedule: z.array(WeeklyMinuteIntervalType).optional(),
  disabled_schedule_inverted: z.boolean().optional(),
  disabled_schedule_uuid: z.string().optional(),
  exposure_level: z.number().int().optional(),
  fisheye_display_mode: FisheyeDisplayMode.optional(),
  floorplan_homography: z.array(z.array(z.number())).optional(),
  hdr_enabled: z.boolean().optional(),
  high_res_detection: z.boolean().optional(),
  human_detection: z.boolean().optional(),
  human_loitering: z.boolean().optional(),
  human_loitering_settings: CameraHumanLoiteringSettingsType.optional(),
  img_brightness: z.number().int().optional(),
  img_contrast: z.number().int().optional(),
  img_saturation: z.number().int().optional(),
  img_sharpness: z.number().int().optional(),
  max_detections_per_frame: z.number().int().optional(),
  metering_config: CameraMeteringConfigType.optional(),
  motor_config: CameraMotorConfigType.optional(),
  mounting_direction: z.string().optional(),
  night_exposure_level: z.number().int().optional(),
  night_img_brightness: z.number().int().optional(),
  night_img_contrast: z.number().int().optional(),
  night_img_saturation: z.number().int().optional(),
  night_img_sharpness: z.number().int().optional(),
  night_metering_config: CameraMeteringConfigType.optional(),
  night_sensor_gain_max: z.number().int().optional(),
  night_shutter_time_max: z.number().int().optional(),
  night_shutter_time_min: z.number().int().optional(),
  object_search: z.boolean().optional(),
  privacy_window_polygons: z.array(RegionPolygonType).optional(),
  privacy_windows: z.array(PermyriadRect).optional(),
  ptz_config: CameraPTZConfigType.optional(),
  region_for_occupancy: RegionConfigType.optional(),
  region_of_interest: RegionConfigType.optional(),
  region_of_interest_groups: z.array(RegionOfInterestGroup).optional(),
  resolution: Deviceconfig_settings_ExternalVideoResolution.optional(),
  rotation: z.number().int().optional(),
  segment_max_bytes: z.number().int().optional(),
  sensor_gain_max: z.number().int().optional(),
  shutter_time_max: z.number().int().optional(),
  shutter_time_min: z.number().int().optional(),
  snapshot_height: z.number().int().optional(),
  snapshot_interval_secs: z.number().int().optional(),
  tile_views: z.array(DewarpedView).optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  upload_all_detections: z.boolean().optional(),
  use_onboard_lpr: z.boolean().optional(),
  vehicle_detection: z.boolean().optional(),
  video_persist_disabled: z.boolean().optional(),
  wdr_enabled: z.boolean().optional(),
  wdr_strength: z.number().int().optional(),
  zero_motion_video_bitrate_percent: z.number().int().optional()
});
const Deviceconfig_settings_IntRange: z.ZodObject<any> = z.object({
  max: z.number().int().optional(),
  min: z.number().int().optional()
});
const Deviceconfig_settings_VideoConfigurationDefault: z.ZodObject<any> = z.object({
  humanDetection: z.boolean().optional(),
  resolution: Deviceconfig_settings_ExternalVideoResolution.optional(),
  segmentMaxBytes: z.number().int().optional(),
  sensorGainMax: z.number().int().optional(),
  shutterTimeMin: z.number().int().optional(),
  vehicleDetection: z.boolean().optional()
});
const Deviceconfig_settings_VideoConfigurationOption: z.ZodObject<any> = z.object({
  maxBitrateRange: Deviceconfig_settings_IntRange.optional(),
  maxZoomPercent: z.number().int().optional(),
  resolution: Deviceconfig_settings_ExternalVideoResolution.optional(),
  wdrRange: Deviceconfig_settings_IntRange.optional()
});
const Deviceconfig_userconfig_IExternalReadableDoorControllerUserConfig: z.ZodObject<any> = z.object({
  autocomponentize_readers: z.boolean().optional(),
  autoregister_readers: z.boolean().optional(),
  bandwidth_reports_disabled: z.boolean().optional(),
  cloud_archive_days: z.number().int().optional(),
  cloud_archive_upload_schedule: z.array(WeeklyMinuteIntervalType).optional(),
  cloud_archive_upload_schedule_inverted: z.boolean().optional(),
  cloud_archive_upload_schedule_uuid: z.string().optional(),
  deviceUuid: z.string().optional(),
  firmware_dev_settings: z.record(z.unknown()).optional(),
  flip_display_orientation: z.boolean().optional(),
  lastModified: z.number().int().optional(),
  led_mode_blink_period_ms: z.number().int().optional(),
  led_mode_when_active: z.string().optional(),
  led_mode_when_inactive: z.string().optional(),
  led_stealth_mode: z.boolean().optional(),
  lightweight_detection_disabled: z.boolean().optional(),
  live_license_invalid: z.boolean().optional(),
  max_event_duration_ms: z.number().int().optional(),
  media_ttl_minutes: z.number().int().optional(),
  on_demand_license_invalid: z.boolean().optional(),
  orgUuid: z.string().optional(),
  pressure_switch_tamper_normally_open: z.boolean().optional(),
  proximity_sensor_tamper_disabled: z.boolean().optional(),
  proximity_sensor_tamper_distance_threshold: z.number().optional(),
  snapshot_upload_target: z.string().optional(),
  storage_target_free_megabytes: z.number().int().optional(),
  storage_target_free_space_permyriad: z.number().int().optional(),
  thumbstrip_upload_target: z.string().optional()
});
const Deviceconfig_userconfig_IExternalUpdateableDoorControllerUserConfig: z.ZodObject<any> = z.object({
  autocomponentize_readers: z.boolean().optional(),
  autoregister_readers: z.boolean().optional(),
  bandwidth_reports_disabled: z.boolean().optional(),
  deviceUuid: z.string().optional(),
  firmware_dev_settings: z.record(z.unknown()).optional(),
  flip_display_orientation: z.boolean().optional(),
  lastModified: z.number().int().optional(),
  led_mode_blink_period_ms: z.number().int().optional(),
  led_mode_when_active: z.string().optional(),
  led_mode_when_inactive: z.string().optional(),
  led_stealth_mode: z.boolean().optional(),
  lightweight_detection_disabled: z.boolean().optional(),
  live_license_invalid: z.boolean().optional(),
  media_ttl_minutes: z.number().int().optional(),
  on_demand_license_invalid: z.boolean().optional(),
  orgUuid: z.string().optional(),
  pressure_switch_tamper_normally_open: z.boolean().optional(),
  proximity_sensor_tamper_disabled: z.boolean().optional(),
  proximity_sensor_tamper_distance_threshold: z.number().optional(),
  snapshot_upload_target: z.string().optional(),
  storage_target_free_megabytes: z.number().int().optional(),
  storage_target_free_space_permyriad: z.number().int().optional(),
  thumbstrip_upload_target: z.string().optional()
});
const DiagnosticEventType: z.ZodObject<any> = z.object({
  activity: z.string().optional(),
  apMac: z.string().optional(),
  asi: z.string().optional(),
  componentCompositeUuid: z.string().optional(),
  componentUuid: z.string().optional(),
  connectionUuid: z.string().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  deviceName: z.string().optional(),
  deviceType: DeviceTypeEnum.optional(),
  deviceUuid: z.string().optional(),
  firmwareVersion: z.string().optional(),
  orgUuid: z.string().optional(),
  reportingDeviceUuid: z.string().optional(),
  rssi: z.number().int().optional(),
  ssid: z.string().optional(),
  timestamp: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const DiceSettings: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional()
});
const DiceType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const RtspEndpointSource = z.string();
const RtspEndpoint: z.ZodObject<any> = z.object({
  audioSupported: z.boolean().optional(),
  lastRtspUrlStatus: z.string().optional(),
  onvifProfileToken: z.string().optional(),
  rtspUrl: z.string().optional(),
  source: RtspEndpointSource.optional(),
  uuid: z.string().optional()
});
const DiscoveredThirdPartyCameraType: z.ZodObject<any> = z.object({
  codec: z.string().optional(),
  createdOn: z.string().datetime({ offset: true }).optional(),
  ipAddress: z.string().optional(),
  lastVisibleMs: z.record(z.unknown()).optional(),
  macAddress: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  name: z.string().optional(),
  onvifPassword: z.string().optional(),
  onvifProfileToken: z.string().optional(),
  onvifUsername: z.string().optional(),
  orgUuid: z.string().optional(),
  password: z.string().optional(),
  rtspEndpoints: z.array(RtspEndpoint).optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  username: z.string().optional()
});
const DoorAjarActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const DoorEventType: z.ZodObject<any> = z.object({
  baseStationUuid: z.string().optional(),
  batteryPercentage: z.number().int().optional(),
  bleDeviceUuid: z.string().optional(),
  bleRssi: z.number().int().optional(),
  closeBaseStations: z.array(z.string()).optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  state: z.string().optional(),
  stateChanged: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  timestampMs: z.number().int().optional()
});
const DoorLockdownStateEventReference: z.ZodObject<any> = z.object({
  activatedLockdownPlan: LockdownPlanReference.optional(),
  activeLockdownPlan: LockdownPlanReference.optional(),
  deactivatedLockdownPlan: LockdownPlanReference.optional(),
  doorEventUuid: z.string().optional(),
  doorUuid: z.string().optional()
});
const DoorScheduledTriggerType: z.ZodObject<any> = z.object({
  ajarThresholdSec: z.number().int().optional(),
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(ActivityEnum).optional()
});
const DoorPolicyType: z.ZodObject<any> = z.object({
  defaultAjarThresholdSec: z.number().int().optional(),
  defaultTriggers: z.array(ActivityEnum).optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(DoorScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Door_GetDoorEventsForSensorWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  sensorUuid: z.string().optional(),
  stateFilter: z.string().optional()
});
const Door_GetDoorEventsForSensorWSResponse: z.ZodObject<any> = z.object({
  doorEvents: z.array(DoorEventType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Door_GetMinimalDoorStatesWSRequest = z.record(z.unknown());
const Door_GetMinimalDoorStatesWSResponse: z.ZodObject<any> = z.object({
  doorStates: z.array(Door_MinimalDoorStateType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Door_UpdateDoorSensorDetailsWSRequest: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  associatedCamerasUpdated: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedUpdated: z.boolean().optional(),
  description: z.string().optional(),
  descriptionUpdated: z.boolean().optional(),
  floorNumber: z.number().int().optional(),
  floorNumberUpdated: z.boolean().optional(),
  latitude: z.number().optional(),
  latitudeUpdated: z.boolean().optional(),
  locationUuid: z.string().optional(),
  locationUuidUpdated: z.boolean().optional(),
  longitude: z.number().optional(),
  longitudeUpdated: z.boolean().optional(),
  name: z.string().optional(),
  nameUpdated: z.boolean().optional(),
  policyUuid: z.string().optional(),
  policyUuidUpdated: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  subLocationsHierarchyKeyUpdated: z.boolean().optional(),
  uuid: z.string().optional()
});
const Door_UpdateDoorSensorDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Doorbellcamera_ExternalDoorbellCameraComponentRuleType: z.ZodObject<any> = z.object({
  action: RuleActionType.optional(),
  doorbellCameraComponentUuid: z.string().optional(),
  doorbellCameraUuid: z.string().optional(),
  ruleFilters: RuleFilterType.optional(),
  ruleName: z.string().optional(),
  ruleUuid: z.string().optional(),
  triggerActivity: ActivityEnum.optional()
});
const Doorbellcamera_CreateRuleForDoorbellCameraWSRequest: z.ZodObject<any> = z.object({
  rule: Doorbellcamera_ExternalDoorbellCameraComponentRuleType.optional()
});
const Doorbellcamera_CreateRuleForDoorbellCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  ruleUuid: z.string().optional()
});
const Doorbellcamera_CreateSharedLiveVideoStreamWSRequest: z.ZodObject<any> = z.object({
  audioGatewayUuid: z.string().optional(),
  doorbellCameraUuid: z.string(),
  expirationTimeSecs: z.number().int().optional(),
  invertSchedule: z.boolean().optional(),
  name: z.string().optional(),
  password: z.string().optional(),
  scheduleUuid: z.string().optional(),
  streamType: StreamTypeEnum,
  vodEnabled: z.boolean()
});
const Doorbellcamera_CreateSharedLiveVideoStreamWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedLiveM3U8StreamUrl: z.string().optional(),
  sharedLiveVideoStreamUrl: z.string().optional(),
  sharedLiveVideoStreamUuid: z.string().optional()
});
const Doorbellcamera_DeleteDoorbellCameraWSRequest: z.ZodObject<any> = z.object({
  doorbellCameraUuid: z.string(),
  mummify: z.boolean()
});
const Doorbellcamera_DeleteDoorbellCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: z.string().optional()
});
const Doorbellcamera_DeleteRuleForDoorbellCameraWSRequest: z.ZodObject<any> = z.object({
  doorbellCameraUuid: z.string().optional(),
  ruleUuid: z.string().optional()
});
const Doorbellcamera_DeleteRuleForDoorbellCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Doorbellcamera_DoorbellCameraOfflineLanStreamingInfo: z.ZodObject<any> = z.object({
  accessToken: z.string().optional(),
  lanAddresses: z.array(z.string()).optional()
});
const Doorbellcamera_FindComponentEventsForDoorbellCameraWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  doorbellCameraUuid: z.string(),
  limit: z.number().int(),
  typeFilter: z.array(ComponentEventEnumType).optional()
});
const Doorbellcamera_FindComponentEventsForDoorbellCameraWSResponse: z.ZodObject<any> = z.object({
  componentEvents: z.array(ComponentEventType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Doorbellcamera_FindComponentSeekPointsForDoorbellCameraWSRequest: z.ZodObject<any> = z.object({
  doorbellCameraUuid: z.string().optional(),
  durationSec: z.number().int().optional(),
  startTimeSecEpochExclusive: z.number().int().optional()
});
const Doorbellcamera_FindComponentSeekPointsForDoorbellCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  seekpoints: z.array(ComponentSeekPointType).optional()
});
const Doorbellcamera_FindSharedLiveVideoStreamsForWSRequest: z.ZodObject<any> = z.object({
  doorbellCameraUuid: z.string().optional()
});
const Doorbellcamera_FindSharedLiveVideoStreamsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedLiveVideoStreams: z.array(Camera_SharedLiveVideoStreamWS).optional()
});
const Doorbellcamera_GetDoorbellCameraConfigWSResponse: z.ZodObject<any> = z.object({
  config: Deviceconfig_userconfig_IExternalReadableAudioVideoUserConfig.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Doorbellcamera_GetDoorbellCameraFullStateWSResponse: z.ZodObject<any> = z.object({
  fullState: FullDeviceStateType.optional()
});
const Doorbellcamera_GetDoorbellCameraMediaUrisWSResponse: z.ZodObject<any> = z.object({
  lanCheckUrls: z.array(z.string()).optional(),
  lanLiveH264Uris: z.array(z.string()).optional(),
  lanLiveMpdUris: z.array(z.string()).optional(),
  lanLiveOpusUris: z.array(z.string()).optional(),
  lanVodM3u8UrisTemplates: z.array(z.string()).optional(),
  lanVodMpdUrisTemplates: z.array(z.string()).optional(),
  wanLiveH264Uri: z.string().optional(),
  wanLiveMpdUri: z.string().optional(),
  wanLiveOpusUri: z.string().optional(),
  wanVodM3u8UriTemplate: z.string().optional(),
  wanVodMpdUriTemplate: z.string().optional()
});
const MinimalObservableDeviceStateType: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  connectionStatus: DeviceStatusEnum.optional(),
  createdAtMillis: z.number().int().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  directionRadians: z.number().optional(),
  externalIPAddress: z.string().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  firmwareUpdateInProgress: z.boolean().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  healthStatus: DeviceStatusEnum.optional(),
  healthStatusDetails: DeviceHealthStatusDetailsEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lanAddresses: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  liveStreamShared: z.boolean().optional(),
  liveStreamsSharedCount: z.number().int().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mediaRegion: z.string().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  region: z.string().optional(),
  secondaryLanAddresses: z.array(z.string()).optional(),
  serialNumber: z.string().optional(),
  ssid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  supportedFacets: z.array(DeviceFacet).optional(),
  uuid: z.string().optional(),
  wifiApMac: z.string().optional(),
  wifiBars: z.number().int().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const Doorbellcamera_GetDoorbellCameraMinimalStateListWSResponse: z.ZodObject<any> = z.object({
  minimalStates: z.array(MinimalObservableDeviceStateType).optional()
});
const Doorbellcamera_GetDoorbellCameraOfflineLanStreamingInfoWSRequest = z.record(z.unknown());
const Doorbellcamera_GetDoorbellCameraOfflineLanStreamingInfoWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  info: z.record(z.unknown()).optional()
});
const Doorbellcamera_GetDoorbellCameraRulesForOrgWSRequest = z.record(z.unknown());
const Doorbellcamera_GetDoorbellCameraRulesForOrgWSResponse: z.ZodObject<any> = z.object({
  doorbellCameraUuidToRulesMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Doorbellcamera_GetRulesForDoorbellCameraWSRequest: z.ZodObject<any> = z.object({
  doorbellCameraUuid: z.string().optional()
});
const Doorbellcamera_GetRulesForDoorbellCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rules: z.array(Doorbellcamera_ExternalDoorbellCameraComponentRuleType).optional()
});
const Doorbellcamera_RebootDoorbellCameraWSRequest: z.ZodObject<any> = z.object({
  doorbellCameraUuid: z.string()
});
const Doorbellcamera_UpdateDoorbellCameraConfigWSRequest: z.ZodObject<any> = z.object({
  configUpdate: Deviceconfig_userconfig_IExternalUpdateableAudioVideoUserConfig.optional()
});
const Doorbellcamera_UpdateDoorbellCameraDetailsWSRequest: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  description: z.string().optional(),
  deviceUuid: z.string().optional(),
  directionRadians: z.number().optional(),
  floorNumber: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional()
});
const RuleTriggerConjunctionEnum = z.string();
const RuleTypeEnum = z.string();
const RuleType: z.ZodObject<any> = z.object({
  action: RuleActionType.optional(),
  conjunction: RuleTriggerConjunctionEnum.optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  ownerUuid: z.string().optional(),
  ruleFilters: RuleFilterType.optional(),
  ruleType: RuleTypeEnum.optional(),
  triggers: z.array(BaseRuleTriggerType).optional(),
  uuid: z.string().optional()
});
const Doorcontroller_CreateDoorControllerRuleWSRequest: z.ZodObject<any> = z.object({
  doorControllerUuid: z.string().optional(),
  rule: RuleType.optional()
});
const Doorcontroller_CreateDoorControllerRuleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rule: RuleType.optional()
});
const Doorcontroller_DeleteDoorControllerRuleWSRequest: z.ZodObject<any> = z.object({
  doorControllerUuid: z.string().optional(),
  ruleUuid: z.string().optional()
});
const Doorcontroller_DeleteDoorControllerRuleWSResponse = z.record(z.unknown());
const Doorcontroller_DeleteDoorControllerWSRequest: z.ZodObject<any> = z.object({
  doorControllerUuid: z.string(),
  mummify: z.boolean()
});
const Doorcontroller_DeleteDoorControllerWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: z.string().optional()
});
const Doorcontroller_DoorControllerDiscoveredAperioDoor: z.ZodObject<any> = z.object({
  gatewayId: z.string().optional(),
  id: z.string().optional(),
  lastSeenMs: z.number().int().optional()
});
const Doorcontroller_DoorControllerDiscoveredAperioGateway: z.ZodObject<any> = z.object({
  id: z.string().optional(),
  ipAddress: z.string().optional(),
  lastSeenMs: z.number().int().optional(),
  model: z.string().optional(),
  protocolVersion: z.string().optional()
});
const Doorcontroller_DoorControllerDiscoveredReaderTypeEnum = z.string();
const Doorcontroller_DoorControllerDiscoveredRhombusReaderType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  lastSeenMs: z.number().int().optional(),
  online: z.boolean().optional(),
  portNum: z.number().int().optional(),
  type: Doorcontroller_DoorControllerDiscoveredReaderTypeEnum.optional()
});
const Doorcontroller_DoorControllerDiscoveredThirdPartyReaderType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  lastSeenMs: z.number().int().optional(),
  online: z.boolean().optional(),
  portNum: z.number().int().optional(),
  type: Doorcontroller_DoorControllerDiscoveredReaderTypeEnum.optional()
});
const Doorcontroller_DoorControllerDiscoveredReaderType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  lastSeenMs: z.number().int().optional(),
  online: z.boolean().optional(),
  portNum: z.number().int().optional(),
  type: Doorcontroller_DoorControllerDiscoveredReaderTypeEnum.optional()
});
const Doorcontroller_DoorControllerStateType: z.ZodObject<any> = z.object({
  configUpdatedAtMs: z.number().int().optional(),
  connectionStatus: DeviceStatusEnum.optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  directionRadians: z.number().optional(),
  discoveredAperioDoors: z.array(Doorcontroller_DoorControllerDiscoveredAperioDoor).optional(),
  discoveredAperioGateways: z.array(Doorcontroller_DoorControllerDiscoveredAperioGateway).optional(),
  discoveredReaders: z.array(Doorcontroller_DoorControllerDiscoveredReaderType).optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  grantsUpdatedAtMs: z.number().int().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lanAddresses: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  state: z.record(z.unknown()).optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  uuid: z.string().optional(),
  wanAddress: z.string().optional()
});
const Doorcontroller_GetDoorControllerConfigWSResponse: z.ZodObject<any> = z.object({
  config: Deviceconfig_userconfig_IExternalReadableDoorControllerUserConfig.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Doorcontroller_GetDoorControllerRuleWSRequest: z.ZodObject<any> = z.object({
  doorControllerUuid: z.string().optional(),
  ruleUuid: z.string().optional()
});
const Doorcontroller_GetDoorControllerRuleWSResponse: z.ZodObject<any> = z.object({
  rule: RuleType.optional()
});
const Doorcontroller_GetDoorControllerRulesWSRequest: z.ZodObject<any> = z.object({
  doorControllerUuid: z.string().optional()
});
const Doorcontroller_GetDoorControllerRulesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rules: z.array(RuleType).optional()
});
const Doorcontroller_GetDoorControllerStateListWSRequest = z.record(z.unknown());
const Doorcontroller_GetDoorControllerStateListWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  stateList: z.array(Doorcontroller_DoorControllerStateType).optional()
});
const Doorcontroller_RegisterDiscoveredRhombusReaderWSRequest: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  doorControllerUuid: z.string().optional(),
  portNum: z.number().int().optional(),
  serialNumber: z.string().optional()
});
const Doorcontroller_RegisterDiscoveredRhombusReaderWSResponse = z.record(z.unknown());
const Doorcontroller_UpdateDoorControllerConfigWSRequest: z.ZodObject<any> = z.object({
  configUpdate: Deviceconfig_userconfig_IExternalUpdateableDoorControllerUserConfig.optional()
});
const Doorcontroller_UpdateDoorControllerDetailsWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  directionRadians: z.number().optional(),
  floorNumber: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  uuid: z.string()
});
const Doorcontroller_UpdateDoorControllerDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Doorcontroller_UpdateDoorControllerRuleWSRequest: z.ZodObject<any> = z.object({
  doorControllerUuid: z.string().optional(),
  rule: RuleType.optional()
});
const Doorcontroller_UpdateDoorControllerRuleWSResponse: z.ZodObject<any> = z.object({
  rule: RuleType.optional()
});
const DropboxSettingsV2: z.ZodObject<any> = z.object({
  accessToken: z.string().optional(),
  accountEmail: z.string().optional(),
  accountName: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional()
});
const EmailSettings: z.ZodObject<any> = z.object({
  emailAddresses: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional()
});
const EmbeddingEncodingType = z.string();
const Embedding: z.ZodObject<any> = z.object({
  embeddingComparisonType: z.string().optional(),
  embeddingConfidence: z.number().optional(),
  embeddingEncodingType: EmbeddingEncodingType.optional(),
  encodedEmbedding: z.string().optional()
});
const EmergencyResponseContactsIntervalType: z.ZodObject<any> = z.object({
  emergencyContactList: z.array(EmergencyContact).optional(),
  minuteOfWeekStart: z.number().int().optional(),
  minuteOfWeekStop: z.number().int().optional()
});
const Entity = z.string();
const EntityTag: z.ZodObject<any> = z.object({
  value: z.string().optional(),
  weak: z.boolean().optional()
});
const EnvoyCustomField: z.ZodObject<any> = z.object({
  field: z.string().optional(),
  value: z.string().optional()
});
const EnvoyDeliveryInfo: z.ZodObject<any> = z.object({
  name: z.string().optional()
});
const EnvoyPersonInfo: z.ZodObject<any> = z.object({
  email: z.string().optional(),
  id: z.string().optional(),
  locationIds: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  name: z.string().optional(),
  type: z.string().optional()
});
const EnvoyDelivery: z.ZodObject<any> = z.object({
  carrier: EnvoyDeliveryInfo.optional(),
  carrierInfo: EnvoyDeliveryInfo.optional(),
  deliveryArea: EnvoyDeliveryInfo.optional(),
  deliveryAreaInfo: EnvoyDeliveryInfo.optional(),
  locationId: z.string().optional(),
  pickedUpAt: z.string().optional(),
  pickedUpBy: EnvoyPersonInfo.optional(),
  receivedTimestampMs: z.number().int().optional(),
  recipient: EnvoyPersonInfo.optional(),
  status: z.string().optional()
});
const EnvoyExpectedGuest: z.ZodObject<any> = z.object({
  expectedArrivalAt: z.string().optional(),
  expectedArrivalTimestampMs: z.number().int().optional(),
  host: EnvoyPersonInfo.optional(),
  invitee: EnvoyPersonInfo.optional(),
  locationId: z.string().optional()
});
const EnvoyGuest: z.ZodObject<any> = z.object({
  agreementsStatus: z.string().optional(),
  email: z.string().optional(),
  fullName: z.string().optional(),
  host: EnvoyPersonInfo.optional(),
  locationId: z.string().optional(),
  notes: z.string().optional(),
  signedInAt: z.string().optional(),
  signedInTimestampMs: z.number().int().optional(),
  signedOutAt: z.string().optional(),
  signedOutTimestampMs: z.number().int().optional()
});
const EnvoyInvite: z.ZodObject<any> = z.object({
  customFields: z.array(EnvoyCustomField).optional(),
  expectedArrivalAt: z.string().optional(),
  expectedDepartureAt: z.string().optional(),
  flowId: z.string().optional(),
  hostEmployeeId: z.string().optional(),
  inviteId: z.string().optional(),
  invitee: EnvoyPersonInfo.optional(),
  locationId: z.string().optional(),
  notes: z.string().optional(),
  sendEmailToInvitee: z.boolean().optional()
});
const EnvoyLocation: z.ZodObject<any> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional()
});
const EnvoyLocationInfoType: z.ZodObject<any> = z.object({
  assignedCameraList: z.array(z.string()).optional(),
  locationName: z.string().optional()
});
const EnvoySettings: z.ZodObject<any> = z.object({
  createSeekPoints: z.boolean().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  envoyIntegrationInstalled: z.boolean().optional(),
  indexFaces: z.boolean().optional(),
  locationInfoMap: z.record(z.unknown()).optional(),
  migrated: z.boolean().optional(),
  refreshToken: z.string().optional(),
  saveClips: z.boolean().optional()
});
const EnvoyType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const EnvoyUserSettings: z.ZodObject<any> = z.object({
  guestsEnabled: z.boolean().optional(),
  packagesEnabled: z.boolean().optional()
});
const Ethernettester_GetEthernetTesterConfigWSRequest: z.ZodObject<any> = z.object({
  version: z.string().optional()
});
const Ethernettester_GetEthernetTesterConfigWSResponse: z.ZodObject<any> = z.object({
  configJson: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const EventCount: z.ZodObject<any> = z.object({
  count: z.number().optional(),
  uuid: z.string().optional()
});
const Event_RuuidWrapper: z.ZodObject<any> = z.object({
  alertUuid: z.string().optional(),
  eventUuid: z.string().optional()
});
const Event_CreateSharedClipGroupWSRequest: z.ZodObject<any> = z.object({
  expirationTimeSecs: z.number().int().optional(),
  plaintextPassword: z.string().optional(),
  title: z.string().optional(),
  uuids: z.array(Event_RuuidWrapper).optional()
});
const Event_CreateSharedClipGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  shareUrl: z.string().optional(),
  uuid: z.string().optional()
});
const Event_DeleteAlertMonitoringThreatCaseByStatusWSRequest: z.ZodObject<any> = z.object({
  status: ThreatCaseStatus.optional()
});
const Event_DeleteAlertMonitoringThreatCaseByStatusWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_DeleteAlertMonitoringThreatCaseWSRequest: z.ZodObject<any> = z.object({
  threatCaseUuids: z.array(z.string()).optional()
});
const Event_DeleteAlertMonitoringThreatCaseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_DeleteSavedClipWSRequest: z.ZodObject<any> = z.object({
  savedClipUuid: z.string().optional()
});
const Event_DeleteSavedClipWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_DeleteSharedClipGroupWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Event_DeleteSharedClipGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_DismissAllPolicyAlertsForDeviceWSRequest: z.ZodObject<any> = z.object({
  deviceUuids: z.array(z.string()).optional()
});
const Event_DismissAllPolicyAlertsForDeviceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_DismissAllPolicyAlertsWSRequest = z.record(z.unknown());
const Event_DismissAllPolicyAlertsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_DismissPolicyAlertWSRequest: z.ZodObject<any> = z.object({
  alertUuid: z.string().optional()
});
const Event_DismissPolicyAlertWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_DismissPolicyAlertsWSRequest: z.ZodObject<any> = z.object({
  alertUuids: z.array(z.string()).optional()
});
const Event_DismissPolicyAlertsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_FrontendCell: z.ZodObject<any> = z.object({
  col: z.number().int().optional(),
  row: z.number().int().optional()
});
const Event_GetAlertMonitoringThreatCaseWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Event_GetAlertMonitoringThreatCaseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  threatCase: AlertMonitoringThreatCaseType.optional()
});
const Event_GetAlertMonitoringThreatCasesWSRequest: z.ZodObject<any> = z.object({
  afterTimestampMs: z.number().int().optional(),
  beforeTimestampMs: z.number().int().optional(),
  deviceFilter: z.array(z.string()).optional(),
  lastEvaluatedKey: z.string().optional(),
  lastTimestampMs: z.number().int().optional(),
  lastUuid: z.string().optional(),
  locationFilter: z.array(z.string()).optional(),
  maxPageSize: z.number().int().optional(),
  maxResults: z.number().int().optional(),
  mostRecent: z.boolean().optional(),
  statusFilter: z.array(ThreatCaseStatus).optional()
});
const Event_GetAlertMonitoringThreatCasesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lastEvaluatedKey: z.string().optional(),
  threatCases: z.array(AlertMonitoringThreatCaseType).optional()
});
const Event_GetClipWithProgressWSRequest: z.ZodObject<any> = z.object({
  clipUuid: z.string()
});
const Resolution: z.ZodObject<any> = z.object({
  height: z.number().int().optional(),
  width: z.number().int().optional()
});
const Event_SavedClipWithProgressType: z.ZodObject<any> = z.object({
  accessSettings: ClipAccessSettings.optional(),
  alterMap: z.record(z.unknown()).optional(),
  analyzed: z.boolean().optional(),
  byteCount: z.number().int().optional(),
  clipLocation: MetaDataLocationType.optional(),
  consoleDelete: z.boolean().optional(),
  createdAtMs: z.number().int().optional(),
  currentOperation: z.string().optional(),
  description: z.string().optional(),
  devicePresentationOrder: z.array(z.string()).optional(),
  deviceUuid: z.string().optional(),
  deviceUuidMap: z.record(z.unknown()).optional(),
  deviceUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  externalTransactionId: z.string().optional(),
  fisheyeMap: z.record(z.unknown()).optional(),
  integrationUploadList: z.array(IntegrationEnum).optional(),
  isMonitoringClip: z.boolean().optional(),
  isVendorClip: z.boolean().optional(),
  lastUpdatedSec: z.number().int().optional(),
  orgUuid: z.string().optional(),
  percentComplete: z.number().int().optional(),
  sendToSharedStorage: z.boolean().optional(),
  sha256Hex: z.string().optional(),
  sourceAlertUuid: z.string().optional(),
  status: z.string().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  timestampMs: z.number().int().optional(),
  title: z.string().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  videoResolution: Resolution.optional()
});
const Event_GetClipWithProgressWSResponse: z.ZodObject<any> = z.object({
  clip: Event_SavedClipWithProgressType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_GetClipsWithProgressWSRequest: z.ZodObject<any> = z.object({
  deviceUuidFilters: z.array(z.string()).optional(),
  excludeAlertMonitoringClips: z.boolean().optional(),
  filterByPrivate: z.boolean().optional(),
  locationUuidFilters: z.array(z.string()).optional(),
  pageSize: z.number().int().min(1).max(200),
  pageToken: z.string().optional(),
  searchFilter: z.string().optional(),
  sortField: z.string().optional(),
  sortOrder: z.string().optional(),
  timestampFilterField: z.string().optional(),
  timestampMsAfter: z.number().int().optional(),
  timestampMsBefore: z.number().int().optional()
});
const Event_GetClipsWithProgressWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  pageToken: z.string().optional(),
  savedClips: z.array(Event_SavedClipWithProgressType).optional()
});
const Event_GetExpiringPolicyAlertsWSRequest: z.ZodObject<any> = z.object({
  expiresBeforeMs: z.number().int(),
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Event_GetExpiringPolicyAlertsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lastEvaluatedKey: z.string().optional(),
  policyAlerts: z.array(BasePolicyAlertType).optional()
});
const Event_GetMotionGridCountsWSResponse: z.ZodObject<any> = z.object({
  countGrid: z.array(z.array(z.number().int())).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_GetMotionGridWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string(),
  endTimeUtcSecs: z.number().int(),
  startTimeUtcSecs: z.number().int()
});
const Event_GetMotionGridWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  motionCells: z.record(z.unknown()).optional()
});
const Event_GetPolicyAlertCountWSRequest: z.ZodObject<any> = z.object({
  maxResultsSize: z.number().int().optional()
});
const Event_GetPolicyAlertCountWSResponse: z.ZodObject<any> = z.object({
  count: z.number().int().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_GetPolicyAlertDetailsWSRequest: z.ZodObject<any> = z.object({
  policyAlertUuid: z.string().optional()
});
const PolicyAlertWithDetailsType: z.ZodObject<any> = z.object({
  alertMonitoringThreatCaseUuid: z.string().optional(),
  alertMonitoringVerified: z.boolean().optional(),
  boundingBoxes: z.array(ClipBoundingBoxType).optional(),
  boundingBoxesMap: z.record(z.unknown()).optional(),
  clientType: ApiClientTypeEnum.optional(),
  clipLocationMap: z.record(z.unknown()).optional(),
  clipLocationMapV2: z.record(z.unknown()).optional(),
  componentCompositeSeekPointsMap: z.record(z.unknown()).optional(),
  delayedProcessing: z.boolean().optional(),
  deleted: z.boolean().optional(),
  durationSec: z.number().int().optional(),
  finalized: z.boolean().optional(),
  locationUuid: z.string().optional(),
  notificationSent: z.boolean().optional(),
  orgUuid: z.string().optional(),
  policyAlertTriggers: z.array(ActivityEnum).optional(),
  policyUuid: z.string().optional(),
  recognizedEventFaces: z.array(PolicyEventFaceType).optional(),
  recognizedEventVehicles: z.array(PolicyEventVehicleType).optional(),
  saved: z.boolean().optional(),
  seekPoints: z.array(ClipSeekPointV2Type).optional(),
  seekPointsMap: z.record(z.unknown()).optional(),
  shared: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  textDescription: z.string().optional(),
  thirdPartyDeviceName: z.string().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  thumbnailLocationV2: z.string().optional(),
  timestampMs: z.number().int().optional(),
  type: z.string().optional(),
  unrecognizedEventFaces: z.array(PolicyEventFaceType).optional(),
  unrecognizedEventVehicles: z.array(PolicyEventVehicleType).optional(),
  uuid: z.string().optional()
});
const Event_GetPolicyAlertDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyAlert: PolicyAlertWithDetailsType.optional()
});
const Event_GetPolicyAlertGroupsForDeviceWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  lastTimestampMs: z.number().int().optional(),
  lastUuid: z.string().optional(),
  maxResults: z.number().int().optional()
});
const Event_PolicyAlertGroupV2: z.ZodObject<any> = z.object({
  endTime: z.number().int().optional(),
  policyAlerts: z.array(PolicyAlertV2Type).optional(),
  startTime: z.number().int().optional()
});
const Event_GetPolicyAlertGroupsForDeviceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyAlertGroups: z.array(Event_PolicyAlertGroupV2).optional()
});
const Event_GetPolicyAlertGroupsForLocationWSRequest: z.ZodObject<any> = z.object({
  lastTimestampMs: z.number().int().optional(),
  lastUuid: z.string().optional(),
  locationUuid: z.string().optional(),
  maxResults: z.number().int().optional()
});
const Event_GetPolicyAlertGroupsForLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyAlertGroups: z.array(Event_PolicyAlertGroupV2).optional()
});
const Event_GetPolicyAlertGroupsV2WSRequest: z.ZodObject<any> = z.object({
  lastTimestampMs: z.number().int().optional(),
  lastUuid: z.string().optional(),
  maxResults: z.number().int().optional()
});
const Event_GetPolicyAlertGroupsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyAlertGroups: z.array(Event_PolicyAlertGroupV2).optional()
});
const Event_GetPolicyAlertV2WSRequest: z.ZodObject<any> = z.object({
  policyAlertUuid: z.string().optional()
});
const Event_GetPolicyAlertV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyAlert: PolicyAlertV2Type.optional()
});
const Event_GetPolicyAlertWSRequest: z.ZodObject<any> = z.object({
  policyAlertUuid: z.string().optional()
});
const Event_GetPolicyAlertWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyAlert: BasePolicyAlertType.optional()
});
const Event_GetPolicyAlertsV2WSRequest: z.ZodObject<any> = z.object({
  afterTimestampMs: z.number().int().optional(),
  beforeTimestampMs: z.number().int().optional(),
  deviceFilter: z.array(z.string()).optional(),
  lastTimestampMs: z.number().int().optional(),
  lastUuid: z.string().optional(),
  locationFilter: z.array(z.string()).optional(),
  maxResults: z.number().int().optional()
});
const Event_GetPolicyAlertsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  oldestPolicyAlert: PolicyAlertV2Type.optional(),
  policyAlerts: z.array(PolicyAlertV2Type).optional()
});
const Event_GetPolicyAlertsWSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorFilter: z.array(z.string()).optional(),
  afterTimestampMs: z.number().int().optional(),
  beforeTimestampMs: z.number().int().optional(),
  deviceFilter: z.array(z.string()).optional(),
  lastTimestampMs: z.number().int().optional(),
  lastUuid: z.string().optional(),
  locationFilter: z.array(z.string()).optional(),
  maxResults: z.number().int().optional()
});
const Event_GetPolicyAlertsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyAlerts: z.array(BasePolicyAlertType).optional()
});
const Event_GetSavedClipCountWSRequest: z.ZodObject<any> = z.object({
  deviceFilter: z.array(z.string()).optional(),
  endTimeMs: z.number().int().optional(),
  locationFilter: z.array(z.string()).optional(),
  startTimeMs: z.number().int().optional()
});
const Event_GetSavedClipCountWSResponse: z.ZodObject<any> = z.object({
  count: z.number().int().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  privateCount: z.number().int().optional()
});
const Event_GetSavedClipDetailsWSRequest: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional()
});
const SavedClipWithDetailsType: z.ZodObject<any> = z.object({
  accessSettings: ClipAccessSettings.optional(),
  alterMap: z.record(z.unknown()).optional(),
  analyzed: z.boolean().optional(),
  boundingBoxes: z.array(ClipBoundingBoxType).optional(),
  byteCount: z.number().int().optional(),
  clipLocation: MetaDataLocationType.optional(),
  consoleDelete: z.boolean().optional(),
  createdAtMs: z.number().int().optional(),
  description: z.string().optional(),
  devicePresentationOrder: z.array(z.string()).optional(),
  deviceUuid: z.string().optional(),
  deviceUuidMap: z.record(z.unknown()).optional(),
  deviceUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  externalTransactionId: z.string().optional(),
  fisheyeMap: z.record(z.unknown()).optional(),
  integrationUploadList: z.array(IntegrationEnum).optional(),
  isMonitoringClip: z.boolean().optional(),
  isVendorClip: z.boolean().optional(),
  orgUuid: z.string().optional(),
  seekPoints: z.array(ClipSeekPointV2Type).optional(),
  sendToSharedStorage: z.boolean().optional(),
  sha256Hex: z.string().optional(),
  sourceAlertUuid: z.string().optional(),
  status: z.string().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  timestampMs: z.number().int().optional(),
  title: z.string().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  videoResolution: Resolution.optional()
});
const Event_GetSavedClipDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  savedClip: SavedClipWithDetailsType.optional()
});
const Event_GetSavedClipsByExternalTransactionIdWSRequest: z.ZodObject<any> = z.object({
  externalTransactionId: z.string().optional()
});
const SavedClipV2Type: z.ZodObject<any> = z.object({
  accessSettings: ClipAccessSettings.optional(),
  alterMap: z.record(z.unknown()).optional(),
  analyzed: z.boolean().optional(),
  byteCount: z.number().int().optional(),
  clipLocation: MetaDataLocationType.optional(),
  consoleDelete: z.boolean().optional(),
  createdAtMs: z.number().int().optional(),
  description: z.string().optional(),
  devicePresentationOrder: z.array(z.string()).optional(),
  deviceUuid: z.string().optional(),
  deviceUuidMap: z.record(z.unknown()).optional(),
  deviceUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  externalTransactionId: z.string().optional(),
  fisheyeMap: z.record(z.unknown()).optional(),
  integrationUploadList: z.array(IntegrationEnum).optional(),
  isMonitoringClip: z.boolean().optional(),
  isVendorClip: z.boolean().optional(),
  orgUuid: z.string().optional(),
  sendToSharedStorage: z.boolean().optional(),
  sha256Hex: z.string().optional(),
  sourceAlertUuid: z.string().optional(),
  status: z.string().optional(),
  thumbnailLocation: MetaDataLocationType.optional(),
  timestampMs: z.number().int().optional(),
  title: z.string().optional(),
  userUuid: z.string().optional(),
  uuid: z.string().optional(),
  videoResolution: Resolution.optional()
});
const Event_GetSavedClipsByExternalTransactionIdWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  savedClips: z.array(SavedClipV2Type).optional()
});
const Event_GetSavedClipsV2WSRequest: z.ZodObject<any> = z.object({
  maxPageSize: z.number().int().optional(),
  pageTimestampMs: z.number().int().optional()
});
const Event_GetSavedClipsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  savedClips: z.array(SavedClipV2Type).optional()
});
const Event_GetSavedClipsWSRequest = z.record(z.unknown());
const Event_GetSavedClipsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  savedClips: z.array(SavedClipV2Type).optional()
});
const Event_GetSharedClipGroupDetailsWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const SharedClipGroupWithDetailsType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  expirationTimeSecs: z.number().int().optional(),
  orgUuid: z.string().optional(),
  sharedClips: z.array(SharedClipWithDetailsType).optional(),
  title: z.string().optional(),
  uuid: z.string().optional()
});
const Event_GetSharedClipGroupDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedClipGroup: SharedClipGroupWithDetailsType.optional()
});
const Event_GetSharedClipGroupsV2WSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional()
});
const SharedClipGroupWrapperV2Type: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  expirationTimeSecs: z.number().int().optional(),
  isSecured: z.boolean().optional(),
  orgUuid: z.string().optional(),
  sharedClips: z.array(SharedClipV2Type).optional(),
  title: z.string().optional(),
  uuid: z.string().optional()
});
const Event_GetSharedClipGroupsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedClipGroups: z.array(SharedClipGroupWrapperV2Type).optional()
});
const Event_GetSharedClipGroupsWSRequest = z.record(z.unknown());
const SharedClipType: z.ZodObject<any> = z.object({
  clipMetaData: ClipMetaDataType.optional(),
  deviceUuid: z.string().optional(),
  deviceUuids: z.array(z.string()).optional(),
  timestampMs: z.number().int().optional(),
  uuid: z.string().optional()
});
const SharedClipGroupWrapperType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  expirationTime: z.number().int().optional(),
  isSecured: z.boolean().optional(),
  orgUuid: z.string().optional(),
  sharedClips: z.array(SharedClipType).optional(),
  title: z.string().optional(),
  uuid: z.string().optional()
});
const Event_GetSharedClipGroupsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedClipGroups: z.array(SharedClipGroupWrapperType).optional()
});
const Event_GetSplicedClipsInProgressWSRequest = z.record(z.unknown());
const SplicedClipType: z.ZodObject<any> = z.object({
  accessSettings: ClipAccessSettings.optional(),
  analyzeClip: z.boolean().optional(),
  clipTargetLocation: MetaDataLocationType.optional(),
  clipUuid: z.string().optional(),
  consoleDelete: z.boolean().optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  deviceMap: z.record(z.unknown()).optional(),
  devicePresentationOrder: z.array(z.string()).optional(),
  deviceUuid: z.string().optional(),
  deviceUuidMap: z.record(z.unknown()).optional(),
  deviceUuidToAlteredViewMap: z.record(z.unknown()).optional(),
  deviceUuidToFisheyePresentationMap: z.record(z.unknown()).optional(),
  duration: z.number().int().optional(),
  integrationUploadList: z.array(IntegrationEnum).optional(),
  isPolicyEvent: z.boolean().optional(),
  metadataBucketRegion: z.string().optional(),
  orgUuid: z.string().optional(),
  saveClip: z.boolean().optional(),
  saveFrame: z.boolean().optional(),
  segmentsUploaded: z.number().int().optional(),
  sendToSharedStorage: z.boolean().optional(),
  startTime: z.number().int().optional(),
  status: z.string().optional(),
  thumbnailRelativeSecond: z.number().optional(),
  timestampMs: z.number().int().optional(),
  title: z.string().optional(),
  totalSegments: z.number().int().optional(),
  transactionUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const Event_GetSplicedClipsInProgressWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  splicedClips: z.array(SplicedClipType).optional()
});
const Event_GetUnhealthyDeviceAlertsWSRequest = z.record(z.unknown());
const UnHealthyDeviceAlertType: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  symptom: z.string().optional(),
  timestamp: z.number().int().optional(),
  uuid: z.string().optional()
});
const Event_GetUnhealthyDeviceAlertsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  unhealthyDeviceAlerts: z.array(UnHealthyDeviceAlertType).optional()
});
const Event_MuteNotificationsForDevicetWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  durationSec: z.number().int().optional()
});
const Event_MuteNotificationsForDevicetWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_ReportBadPolicyAlertWSRequest: z.ZodObject<any> = z.object({
  policyAlert: PolicyAlertV2Type.optional()
});
const Event_ReportBadPolicyAlertWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_SavePolicyAlertWSRequest: z.ZodObject<any> = z.object({
  alertUuid: z.string().optional(),
  fisheyePresentationMap: z.record(z.unknown()).optional(),
  savedClipDescription: z.string().optional(),
  savedClipTitle: z.string().optional()
});
const Event_SavePolicyAlertWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_SearchMotionGridWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string(),
  endTimeUtcSecs: z.number().int(),
  searchCells: z.array(Event_FrontendCell),
  startTimeUtcSecs: z.number().int()
});
const Event_SearchMotionGridWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  timeUtcSecsList: z.array(z.number().int()).optional()
});
const Event_SearchMotionGridWithActivitiesWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string(),
  endTimeUtcSecs: z.number().int(),
  searchCells: z.array(Event_FrontendCell),
  startTimeUtcSecs: z.number().int()
});
const Event_SearchMotionGridWithActivitiesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  timeUtcSecsToActivityMap: z.record(z.unknown()).optional()
});
const Event_SearchMotionGridWithActivitiesWSResponse_ActivityWithId: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  objectId: z.number().int().optional()
});
const Event_SearchMotionGridWithActivitiesWSResponse_MotionGridActivity: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  activitiesWithId: z.array(Event_SearchMotionGridWithActivitiesWSResponse_ActivityWithId).optional(),
  bestTimestampMs: z.number().int().optional()
});
const Event_UnSavePolicyAlertWSRequest: z.ZodObject<any> = z.object({
  alertUuid: z.string().optional(),
  savedClipUuid: z.string().optional()
});
const Event_UnSavePolicyAlertWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_UpdatePolicyAlertTextDescriptionWSRequest: z.ZodObject<any> = z.object({
  alertUuid: z.string().optional(),
  textDescription: z.string().optional()
});
const Event_UpdatePolicyAlertTextDescriptionWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_UpdateSavedClipWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  savedClipUuid: z.string().optional(),
  title: z.string().optional()
});
const Event_UpdateSavedClipWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_UpdateSharedClipGroupWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  expirationTimeSecs: z.number().int().optional(),
  plaintextPassword: z.string().optional(),
  sharedClipUuid: z.string().optional(),
  title: z.string().optional()
});
const Event_UpdateSharedClipGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  shareUrl: z.string().optional(),
  uuid: z.string().optional()
});
const Event_groups_CreateClipGroupWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  title: z.string().optional(),
  uuids: z.array(Event_RuuidWrapper).optional()
});
const Event_groups_CreateClipGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const Event_groups_DeleteClipGroupWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Event_groups_DeleteClipGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Event_groups_GetClipGroupDetailsWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Event_groups_GetClipGroupDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  group: ClipGroupWithDetailsType.optional()
});
const Event_groups_GetClipGroupsForOrgWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional()
});
const Event_groups_GetClipGroupsForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  groups: z.array(ClipGroupType).optional()
});
const Event_groups_UpdateClipGroupWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  title: z.string().optional(),
  uuid: z.string().optional(),
  uuids: z.array(Event_RuuidWrapper).optional()
});
const Event_groups_UpdateClipGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Eventsearch_CombinedSeekPointType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  cameraUuid: z.string().optional(),
  customActivityColor: z.string().optional(),
  customActivityDescription: z.string().optional(),
  customActivityDisplayName: z.string().optional(),
  faceName: z.string().optional(),
  licensePlate: z.string().optional(),
  objectId: z.number().int().optional(),
  originalEvent: z.record(z.unknown()).optional(),
  seekpointEndTimeMs: z.number().int().optional(),
  seekpointStartTimeMs: z.number().int().optional(),
  thumbnailUrl: z.string().optional(),
  timestampMs: z.number().int().optional(),
  unidentifiedFaceId: z.string().optional()
});
const Eventsearch_GetCameraOrDoorbellCameraSeekpointsWSResponse: z.ZodObject<any> = z.object({
  combinedSeekpoints: z.array(Eventsearch_CombinedSeekPointType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Eventsearch_GetEventSeekpointsV2WSRequest: z.ZodObject<any> = z.object({
  accessControlledDoorUuids: z.array(z.string()).optional(),
  activityFilter: z.array(ActivityEnum).optional(),
  clothingColorFilter: z.array(z.string()).optional(),
  clusterIntervalSec: z.number().int().optional(),
  deviceUuids: z.array(z.string()).optional(),
  durationSec: z.number().int(),
  includeAnyMotion: z.boolean().optional(),
  includeIntegrationEvents: z.boolean().optional(),
  ownerDeviceUuid: z.string().optional(),
  searchCells: z.array(Event_FrontendCell).optional(),
  startTimeSec: z.number().int(),
  vehicleColorFilter: z.array(z.string()).optional()
});
const Eventsearch_SearchClothingAndVehicleByColorWSRequest: z.ZodObject<any> = z.object({
  clothingColorFilter: z.array(z.string()).optional(),
  deviceFilter: z.array(z.string()).optional(),
  endTimeMs: z.number().int().optional(),
  startTimeMs: z.number().int().optional(),
  vehicleColorFilter: z.array(z.string()).optional()
});
const Eventsearch_VideoFootageWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  cameraUuids: z.array(z.string()).optional(),
  duration: z.number().int().optional(),
  includeAnyMotion: z.boolean().optional(),
  startTime: z.number().int().optional(),
  useMultiCamera: z.boolean().optional()
});
const Eventsearch_GetEventSeekpointsWSRequest: z.ZodObject<any> = z.object({
  activitySet: z.array(ActivityEnum).optional(),
  componentSeekPointsByAccessControlledDoorWSRequest: Component_FindComponentSeekPointsByAccessControlledDoorWSRequest.optional(),
  componentSeekPointsByAccessControlledDoorsWSRequest: Component_FindComponentSeekPointsByAccessControlledDoorsWSRequest.optional(),
  componentSeekPointsByOwnerDeviceWSRequest: Component_FindComponentSeekPointsByOwnerDeviceWSRequest.optional(),
  durationSec: z.number().int().optional(),
  searchColorAndVehicleByColorWSRequest: Eventsearch_SearchClothingAndVehicleByColorWSRequest.optional(),
  searchMotionGridWithActivitiesWSRequest: Event_SearchMotionGridWithActivitiesWSRequest.optional(),
  seekpointsWSRequest: Common_devices_GetSeekpointsWSRequest.optional(),
  startTimeSec: z.number().int().optional(),
  videoFootageWSRequest: Eventsearch_VideoFootageWSRequest.optional()
});
const Eventsearch_GetEventSeekpointsWSResponse: z.ZodObject<any> = z.object({
  combinedSeekpoints: z.array(Eventsearch_CombinedSeekPointType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Export_ExportAuditEventsWSRequest: z.ZodObject<any> = z.object({
  endInterval: z.number().int().optional(),
  excludeActions: z.array(z.string()).optional(),
  includeActions: z.array(z.string()).optional(),
  startInterval: z.number().int().optional()
});
const Export_ExportClimateEventsWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  sensorUuid: z.string().optional()
});
const Export_ExportCountReportsWSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().optional(),
  endTimeMs: z.number().int().min(0),
  interval: z.string(),
  scope: z.string(),
  startDate: z.string().optional(),
  startTimeMs: z.number().int().min(0),
  type: z.string(),
  uuidList: z.array(z.string()).optional()
});
const Export_ExportDiagnosticEventsWSRequest: z.ZodObject<any> = z.object({
  endInterval: z.number().int().optional(),
  startInterval: z.number().int().optional()
});
const Export_ExportDoorEventsWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  sensorUuid: z.string().optional()
});
const Export_ExportEnvironmentalGatewayEventsWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  deviceUuid: z.string().optional()
});
const Export_ExportInventoryWSRequest: z.ZodObject<any> = z.object({
  cameraUuids: z.array(z.string()).optional(),
  deviceUuids: z.array(z.string()).optional()
});
const Export_ExportMotionEventsWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().min(0).optional(),
  createdBeforeMs: z.number().int().min(0).optional(),
  deviceUuid: z.string()
});
const Export_ExportPeopleCountEventsWSRequest: z.ZodObject<any> = z.object({
  endInterval: z.number().int().optional(),
  startInterval: z.number().int().optional()
});
const Export_ExportPeopleEventsWSRequest: z.ZodObject<any> = z.object({
  endInterval: z.number().int().optional(),
  startInterval: z.number().int().optional()
});
const Export_ExportProximityEventsWSRequest: z.ZodObject<any> = z.object({
  createBeforeMs: z.number().int().optional(),
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  tagUuid: z.string().optional()
});
const Export_ExportProximityLocomotionEventsWSRequest: z.ZodObject<any> = z.object({
  createBeforeMs: z.number().int().optional(),
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  tagUuid: z.string().optional()
});
const Export_ExportUptimeWSRequest: z.ZodObject<any> = z.object({
  cameraUuids: z.array(z.string()).optional(),
  deviceUuids: z.array(z.string()).optional(),
  endDateTime: z.string().optional(),
  granularity: z.string().optional(),
  startDateTime: z.string().optional()
});
const Export_ExportUsersWSRequest: z.ZodObject<any> = z.object({
  userUuids: z.array(z.string()).optional()
});
const TimeInterval: z.ZodObject<any> = z.object({
  endMs: z.number().int().optional(),
  startMs: z.number().int().optional()
});
const Export_ExportVehicleEventsWSRequest: z.ZodObject<any> = z.object({
  deviceUuids: z.array(z.string()).optional(),
  fuzzy: z.boolean().optional(),
  interval: TimeInterval.optional(),
  labels: z.array(z.string()).optional(),
  plateNumbers: z.array(z.string()).optional()
});
const FaceUploadMetadata: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  errorMsg: z.string().optional(),
  faceId: z.string().optional(),
  orgUuid: z.string().optional(),
  origS3Key: z.string().optional(),
  personUuid: z.string().optional(),
  success: z.boolean().optional(),
  transactionId: z.string().optional()
});
const Facerecognition_faceevent_DeleteFaceEventWSRequest: z.ZodObject<any> = z.object({
  eventUuid: z.string().optional()
});
const Facerecognition_faceevent_DeleteFaceEventWSResponse = z.record(z.unknown());
const TimestampFilter: z.ZodObject<any> = z.object({
  rangeEnd: z.string().datetime({ offset: true }).optional(),
  rangeStart: z.string().datetime({ offset: true }).optional()
});
const Facerecognition_faceevent_ExternalFaceEventSearchFilter: z.ZodObject<any> = z.object({
  deviceUuids: z.array(z.string()).optional(),
  faceNameContains: z.string().optional(),
  faceNames: z.array(z.string()).optional(),
  hasEmbedding: z.boolean().optional(),
  hasName: z.boolean().optional(),
  labels: z.array(z.string()).optional(),
  locationUuids: z.array(z.string()).optional(),
  personUuids: z.array(z.string()).optional(),
  timestampFilter: TimestampFilter.optional()
});
const Facerecognition_faceevent_ExportFaceEventsByOrgWSRequest: z.ZodObject<any> = z.object({
  searchFilter: Facerecognition_faceevent_ExternalFaceEventSearchFilter.optional()
});
const Facerecognition_faceevent_ExternalPersonMatch: z.ZodObject<any> = z.object({
  confidence: z.number().optional(),
  faceId: z.string().optional(),
  name: z.string().optional(),
  uuid: z.string().optional()
});
const Facerecognition_faceevent_ExternalFaceEvent: z.ZodObject<any> = z.object({
  detectionConfidence: z.number().optional(),
  deviceUuid: z.string().optional(),
  embeddingConfidence: z.number().optional(),
  eventTimestamp: z.number().int().optional(),
  faceName: z.string().optional(),
  hasEmbedding: z.boolean().optional(),
  imageS3Key: z.string().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  personUuid: z.string().optional(),
  pitch: z.number().optional(),
  roll: z.number().optional(),
  selectedPersonMatch: Facerecognition_faceevent_ExternalPersonMatch.optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  thumbnailS3Key: z.string().optional(),
  topPersonMatches: z.array(Facerecognition_faceevent_ExternalPersonMatch).optional(),
  uuid: z.string().optional(),
  yaw: z.number().optional()
});
const Facerecognition_faceevent_ExternalFaceEventSimilaritySearchFilter: z.ZodObject<any> = z.object({
  deviceUuids: z.array(z.string()).optional(),
  embeddingConfidenceThreshold: z.number().min(0).max(1).optional(),
  faceMatchDistanceThreshold: z.number().min(0).max(1).optional(),
  faceNameContains: z.string().optional(),
  faceNames: z.array(z.string()).optional(),
  hasName: z.boolean().optional(),
  labels: z.array(z.string()).optional(),
  locationUuids: z.array(z.string()).optional(),
  personUuids: z.array(z.string()).optional(),
  timestampFilter: TimestampFilter.optional()
});
const Facerecognition_faceevent_ReportTimestampFilter: z.ZodObject<any> = z.object({
  rangeStart: z.string().datetime({ offset: true }).optional(),
  reportInterval: z.string().optional()
});
const Facerecognition_faceevent_FindFaceEventsByDeviceForReportingWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  pageRequest: DynamoPageRequest.optional(),
  timestampFilter: Facerecognition_faceevent_ReportTimestampFilter.optional()
});
const Facerecognition_faceevent_FindFaceEventsByDeviceForReportingWSResponse: z.ZodObject<any> = z.object({
  faceEvents: z.array(Facerecognition_faceevent_ExternalFaceEvent).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Facerecognition_faceevent_FindFaceEventsByLocationForReportingWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  pageRequest: DynamoPageRequest.optional(),
  timestampFilter: Facerecognition_faceevent_ReportTimestampFilter.optional()
});
const Facerecognition_faceevent_FindFaceEventsByLocationForReportingWSResponse: z.ZodObject<any> = z.object({
  faceEvents: z.array(Facerecognition_faceevent_ExternalFaceEvent).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Facerecognition_faceevent_FindFaceEventsByOrgForReportingWSRequest: z.ZodObject<any> = z.object({
  pageRequest: DynamoPageRequest.optional(),
  timestampFilter: Facerecognition_faceevent_ReportTimestampFilter.optional()
});
const Facerecognition_faceevent_FindFaceEventsByOrgForReportingWSResponse: z.ZodObject<any> = z.object({
  faceEvents: z.array(Facerecognition_faceevent_ExternalFaceEvent).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Facerecognition_faceevent_FindFaceEventsByOrgWSRequest: z.ZodObject<any> = z.object({
  pageRequest: DynamoPageRequest.optional(),
  searchFilter: Facerecognition_faceevent_ExternalFaceEventSearchFilter.optional()
});
const Facerecognition_faceevent_FindFaceEventsByOrgWSResponse: z.ZodObject<any> = z.object({
  faceEvents: z.array(Facerecognition_faceevent_ExternalFaceEvent).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Facerecognition_faceevent_FindSimilarFaceEventsByEmbeddingWSRequest: z.ZodObject<any> = z.object({
  embedding: Embedding.optional(),
  pageRequest: DynamoPageRequest.optional(),
  searchFilter: Facerecognition_faceevent_ExternalFaceEventSimilaritySearchFilter.optional()
});
const Facerecognition_faceevent_FindSimilarFaceEventsByEmbeddingWSResponse: z.ZodObject<any> = z.object({
  faceEvents: z.array(Facerecognition_faceevent_ExternalFaceEvent).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Facerecognition_faceevent_FindSimilarFaceEventsByFaceMatchmakerWSRequest: z.ZodObject<any> = z.object({
  faceId: z.string().optional(),
  pageRequest: DynamoPageRequest.optional(),
  searchFilter: Facerecognition_faceevent_ExternalFaceEventSimilaritySearchFilter.optional()
});
const Facerecognition_faceevent_FindSimilarFaceEventsByFaceMatchmakerWSResponse: z.ZodObject<any> = z.object({
  faceEvents: z.array(Facerecognition_faceevent_ExternalFaceEvent).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Facerecognition_faceevent_FindSimilarFaceEventsWSRequest: z.ZodObject<any> = z.object({
  faceEventUuid: z.string().optional(),
  pageRequest: DynamoPageRequest.optional(),
  searchFilter: Facerecognition_faceevent_ExternalFaceEventSimilaritySearchFilter.optional()
});
const Facerecognition_faceevent_FindSimilarFaceEventsWSResponse: z.ZodObject<any> = z.object({
  faceEvents: z.array(Facerecognition_faceevent_ExternalFaceEvent).optional(),
  lastEvaluatedKey: z.string().optional()
});
const Facerecognition_faceevent_GetFaceEventWSRequest: z.ZodObject<any> = z.object({
  eventUuid: z.string().optional()
});
const Facerecognition_faceevent_GetFaceEventWSResponse: z.ZodObject<any> = z.object({
  faceEvent: Facerecognition_faceevent_ExternalFaceEvent.optional()
});
const Facerecognition_faceevent_ProcessFaceEventSearchImageWSResponse: z.ZodObject<any> = z.object({
  embedding: Embedding.optional(),
  imageBase64: z.string().optional()
});
const Facerecognition_faceevent_UpdateFaceEventWSRequest: z.ZodObject<any> = z.object({
  eventUuid: z.string().optional(),
  personName: z.string().optional(),
  personUuid: z.string().optional()
});
const Facerecognition_faceevent_UpdateFaceEventWSResponse: z.ZodObject<any> = z.object({
  faceEvent: Facerecognition_faceevent_ExternalFaceEvent.optional()
});
const Facerecognition_matchmaker_CreateFaceMatchmakerFromSightingWSRequest: z.ZodObject<any> = z.object({
  faceEventUuid: z.string().optional(),
  personUuid: z.string().optional()
});
const Facerecognition_matchmaker_ExternalFaceMatchmaker: z.ZodObject<any> = z.object({
  createdOn: z.string().datetime({ offset: true }).optional(),
  id: z.string().optional(),
  orgUuid: z.string().optional(),
  personUuid: z.string().optional(),
  uploaded: z.boolean().optional()
});
const Facerecognition_matchmaker_CreateFaceMatchmakerFromSightingWSResponse: z.ZodObject<any> = z.object({
  faceMatchmaker: Facerecognition_matchmaker_ExternalFaceMatchmaker.optional()
});
const Person: z.ZodObject<any> = z.object({
  createdOn: z.string().datetime({ offset: true }).optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional()
});
const Facerecognition_matchmaker_CreatePersonAndFaceMatchmakersWSResponse: z.ZodObject<any> = z.object({
  faceMatchmakers: z.array(Facerecognition_matchmaker_ExternalFaceMatchmaker).optional(),
  person: Person.optional(),
  transactionId: z.string().optional()
});
const Facerecognition_matchmaker_DeleteFaceMatchmakerWSRequest: z.ZodObject<any> = z.object({
  faceId: z.string().optional()
});
const Facerecognition_matchmaker_DeleteFaceMatchmakerWSResponse = z.record(z.unknown());
const Facerecognition_matchmaker_FileUploadResult: z.ZodObject<any> = z.object({
  fileName: z.string().optional(),
  message: z.string().optional(),
  success: z.boolean().optional()
});
const Facerecognition_matchmaker_FindFaceMatchmakersByOrgWSRequest = z.record(z.unknown());
const Facerecognition_matchmaker_FindFaceMatchmakersByOrgWSResponse: z.ZodObject<any> = z.object({
  faceMatchmakers: z.array(Facerecognition_matchmaker_ExternalFaceMatchmaker).optional()
});
const Facerecognition_matchmaker_FindFaceMatchmakersByPersonWSRequest: z.ZodObject<any> = z.object({
  personUuid: z.string().optional()
});
const Facerecognition_matchmaker_FindFaceMatchmakersByPersonWSResponse: z.ZodObject<any> = z.object({
  faceMatchmakers: z.array(Facerecognition_matchmaker_ExternalFaceMatchmaker).optional()
});
const Facerecognition_matchmaker_FindFaceUploadMetadataByTransactionWSRequest: z.ZodObject<any> = z.object({
  transactionId: z.string().optional()
});
const Facerecognition_matchmaker_FindFaceUploadMetadataByTransactionWSResponse: z.ZodObject<any> = z.object({
  faceUploadMetadata: z.array(FaceUploadMetadata).optional()
});
const Facerecognition_matchmaker_GetFaceMatchingConfigWSRequest = z.record(z.unknown());
const Facerecognition_matchmaker_GetFaceMatchingConfigWSResponse: z.ZodObject<any> = z.object({
  faceMatchConfidenceThreshold: z.number().optional()
});
const Facerecognition_matchmaker_GetFaceMatchmakerWSRequest: z.ZodObject<any> = z.object({
  faceId: z.string().optional()
});
const Facerecognition_matchmaker_GetFaceMatchmakerWSResponse: z.ZodObject<any> = z.object({
  faceMatchmaker: Facerecognition_matchmaker_ExternalFaceMatchmaker.optional()
});
const Facerecognition_matchmaker_UpdateFaceMatchingConfigWSRequest: z.ZodObject<any> = z.object({
  faceMatchConfidenceThreshold: z.number().min(0).max(1).optional()
});
const Facerecognition_matchmaker_UpdateFaceMatchingConfigWSResponse: z.ZodObject<any> = z.object({
  faceMatchConfidenceThreshold: z.number().optional()
});
const Facerecognition_matchmaker_UploadFaceMatchmakerForPersonWSResponse: z.ZodObject<any> = z.object({
  fileUploadResult: Facerecognition_matchmaker_FileUploadResult.optional(),
  transactionId: z.string().optional()
});
const Facerecognition_matchmaker_UploadFaceMatchmakersWSResponse: z.ZodObject<any> = z.object({
  fileUploadResults: z.array(Facerecognition_matchmaker_FileUploadResult).optional(),
  transactionId: z.string().optional()
});
const Facerecognition_matchmaker_ValidateFaceMatchmakerImageWSResponse: z.ZodObject<any> = z.object({
  errorMessage: z.string().optional(),
  valid: z.boolean().optional()
});
const Facerecognition_person_AddPersonLabelWSRequest: z.ZodObject<any> = z.object({
  label: z.string().optional(),
  personUuid: z.string().optional()
});
const Facerecognition_person_AddPersonLabelWSResponse = z.record(z.unknown());
const Facerecognition_person_CreatePersonWSRequest: z.ZodObject<any> = z.object({
  name: z.string().optional()
});
const Facerecognition_person_CreatePersonWSResponse: z.ZodObject<any> = z.object({
  person: Person.optional()
});
const Facerecognition_person_DeletePersonWSRequest: z.ZodObject<any> = z.object({
  personUuid: z.string().optional()
});
const Facerecognition_person_DeletePersonWSResponse = z.record(z.unknown());
const Facerecognition_person_FindPeopleByOrgWSRequest = z.record(z.unknown());
const Facerecognition_person_FindPeopleByOrgWSResponse: z.ZodObject<any> = z.object({
  people: z.array(Person).optional()
});
const Facerecognition_person_FindPersonLabelsByOrgWSRequest = z.record(z.unknown());
const Facerecognition_person_FindPersonLabelsByOrgWSResponse: z.ZodObject<any> = z.object({
  labelsByPerson: z.record(z.unknown()).optional()
});
const Facerecognition_person_GetPersonWSRequest: z.ZodObject<any> = z.object({
  personUuid: z.string().optional()
});
const Facerecognition_person_GetPersonWSResponse: z.ZodObject<any> = z.object({
  person: Person.optional()
});
const Facerecognition_person_RemovePersonLabelWSRequest: z.ZodObject<any> = z.object({
  label: z.string().optional(),
  personUuid: z.string().optional()
});
const Facerecognition_person_RemovePersonLabelWSResponse = z.record(z.unknown());
const PersonSelectiveUpdate: z.ZodObject<any> = z.object({
  createdOn: z.string().datetime({ offset: true }).optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  uuid: z.string().optional()
});
const Facerecognition_person_UpdatePersonWSRequest: z.ZodObject<any> = z.object({
  personSelectiveUpdate: PersonSelectiveUpdate.optional()
});
const Facerecognition_person_UpdatePersonWSResponse: z.ZodObject<any> = z.object({
  person: Person.optional()
});
const FeatureCompatabilityType: z.ZodObject<any> = z.object({
  betaRolloutOrgFlag: z.string().optional(),
  deviceFeatureEnablement: DeviceFeatureEnum.optional(),
  featureName: z.string().optional(),
  generatedActivities: z.array(ActivityEnum).optional(),
  hardwareDefaultMap: z.record(z.unknown()).optional(),
  requiredLicenses: z.array(License).optional(),
  supportedHardware: z.array(HardwareVariationEnum).optional()
});
const Feature_DeviceFeaturesType: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  featureMap: z.record(z.unknown()).optional()
});
const Feature_GetDeviceEventTypesWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Feature_GetDeviceEventTypesWSResponse: z.ZodObject<any> = z.object({
  eventTypes: z.array(ActivityEnum).optional()
});
const Feature_GetDeviceFeaturesListWSRequest: z.ZodObject<any> = z.object({
  deviceUuids: z.array(z.string()).optional()
});
const Feature_GetDeviceFeaturesListWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  featureList: z.array(Feature_DeviceFeaturesType).optional()
});
const Feature_GetDeviceFeaturesWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Feature_GetDeviceFeaturesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  features: Feature_DeviceFeaturesType.optional()
});
const Feature_GetFeatureCompatabilityMatrixWSRequest = z.record(z.unknown());
const Feature_GetFeatureCompatabilityMatrixWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  featureCompatabilityMatrix: z.array(FeatureCompatabilityType).optional()
});
const Feature_UpdateDeviceFeaturesWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  featureMap: z.record(z.unknown()).optional()
});
const Feature_UpdateDeviceFeaturesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const FirmwareUpdateIntervalType: z.ZodObject<any> = z.object({
  minuteOfWeekStart: z.number().int().optional(),
  minuteOfWeekStop: z.number().int().optional()
});
const FirmwareUpdateSettingsType: z.ZodObject<any> = z.object({
  intervalsV2: z.array(FirmwareUpdateIntervalType).optional(),
  mode: z.string().optional()
});
const FirmwareUpdateSettingsOverrideType: z.ZodObject<any> = z.object({
  deviceTypes: z.array(DeviceTypeEnum).optional(),
  firmwareUpdateSettings: FirmwareUpdateSettingsType.optional()
});
const FlicHub: z.ZodObject<any> = z.object({
  flicHubName: z.string().optional(),
  flicHubSerialNumber: z.string().optional(),
  flicHubUuid: z.string().optional()
});
const FlicDevice: z.ZodObject<any> = z.object({
  flicAction: z.string().optional(),
  flicBatteryLevel: z.string().optional(),
  flicHub: FlicHub.optional(),
  flicName: z.string().optional(),
  flicSerialNumber: z.string().optional(),
  flicTimestamp: z.number().int().optional(),
  flicUuid: z.string().optional(),
  lastClickedTimestamp: z.string().optional(),
  moduleUuid: z.string().optional()
});
const FlicType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const FormDataContentDisposition: z.ZodObject<any> = z.object({
  creationDate: z.string().datetime({ offset: true }).optional(),
  fileName: z.string().optional(),
  modificationDate: z.string().datetime({ offset: true }).optional(),
  name: z.string().optional(),
  parameters: z.record(z.unknown()).optional(),
  readDate: z.string().datetime({ offset: true }).optional(),
  size: z.number().int().optional(),
  type: z.string().optional()
});
const FormDataBodyPart: z.ZodObject<any> = z.object({
  content: z.record(z.unknown()).optional(),
  contentDisposition: ContentDisposition.optional(),
  entity: z.record(z.unknown()).optional(),
  fileName: z.string().optional(),
  formDataContentDisposition: FormDataContentDisposition.optional(),
  headers: z.object({
  empty: z.boolean().optional()
}).optional(),
  mediaType: MediaType.optional(),
  messageBodyWorkers: MessageBodyWorkers.optional(),
  name: z.string().optional(),
  parameterizedHeaders: z.object({
  empty: z.boolean().optional()
}).optional(),
  parent: MultiPart.optional(),
  providers: Providers.optional(),
  simple: z.boolean().optional(),
  value: z.string().optional()
});
const FormDataMultiPart: z.ZodObject<any> = z.object({
  bodyParts: z.array(BodyPart).optional(),
  contentDisposition: ContentDisposition.optional(),
  entity: z.record(z.unknown()).optional(),
  fields: z.record(z.unknown()).optional(),
  headers: z.object({
  empty: z.boolean().optional()
}).optional(),
  mediaType: MediaType.optional(),
  messageBodyWorkers: MessageBodyWorkers.optional(),
  parameterizedHeaders: z.object({
  empty: z.boolean().optional()
}).optional(),
  parent: MultiPart.optional(),
  providers: Providers.optional()
});
const Freight: z.ZodObject<any> = z.object({
  warehouse: z.string().optional()
});
const Functionality = z.string();
const GeneaSettings: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  apiToken: z.string().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  migrated: z.boolean().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  webhookSignatureSecret: z.string().optional(),
  webhookUuid: z.string().optional()
});
const GeneaType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const GenericDoorType: z.ZodObject<any> = z.object({
  id: z.string().optional(),
  name: z.string().optional()
});
const ObjectSearchModelEnum = z.string();
const GenericObjectEmbedding: z.ZodObject<any> = z.object({
  b: z.number().int().optional(),
  deviceUuid: z.string().optional(),
  embedding: z.array(z.number()).optional(),
  embeddingId: z.string().optional(),
  l: z.number().int().optional(),
  model: ObjectSearchModelEnum.optional(),
  objectId: z.number().int().optional(),
  objectType: z.string().optional(),
  orgUuid: z.string().optional(),
  r: z.number().int().optional(),
  t: z.number().int().optional(),
  thumbnailUri: z.string().optional(),
  timestamp: z.number().int().optional()
});
const GenericObjectEmbeddingMatch: z.ZodObject<any> = z.object({
  distance: z.number().optional(),
  embedding: GenericObjectEmbedding.optional(),
  matchedEmbeddingId: z.string().optional()
});
const GenericPosSettings: z.ZodObject<any> = z.object({
  assignedCameraList: z.array(z.string()).optional(),
  posName: z.string().optional()
});
const GenericPosType: z.ZodObject<any> = z.object({
  id: z.string().optional(),
  name: z.string().optional()
});
const VideoSimilarityModelEnum = z.string();
const GenericVideoEmbedding: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  embedding: z.array(z.number()).optional(),
  embeddingId: z.string().optional(),
  endTimeMs: z.number().int().optional(),
  model: VideoSimilarityModelEnum.optional(),
  orgUuid: z.string().optional(),
  startTimeMs: z.number().int().optional()
});
const GenericVideoEmbeddingMatch: z.ZodObject<any> = z.object({
  distance: z.number().optional(),
  embedding: GenericVideoEmbedding.optional(),
  matchedEmbeddingId: z.string().optional()
});
const GpsError: z.ZodObject<any> = z.object({
  majorAxis: z.number().optional(),
  minorAxis: z.number().optional(),
  rotation: z.number().optional()
});
const GeodeticCoordinates: z.ZodObject<any> = z.object({
  error: GpsError.optional(),
  floor: z.number().int().optional(),
  lat: z.number().optional(),
  lon: z.number().optional()
});
const GetTemporaryOrgTokenResponse: z.ZodObject<any> = z.object({
  tempOrgToken: z.string().optional()
});
const GoogleCaptchaSourceEnum = z.string();
const GoogleSettings: z.ZodObject<any> = z.object({
  accountUser: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  folderId: z.string().optional(),
  teamDriveId: z.string().optional()
});
const GoogleSettingsV2: z.ZodObject<any> = z.object({
  defaultAlertFolderId: z.string().optional(),
  defaultAlertFolderName: z.string().optional(),
  defaultFolderId: z.string().optional(),
  defaultFolderName: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  refreshToken: z.string().optional(),
  saveAllAlerts: z.boolean().optional(),
  saveClips: z.boolean().optional()
});
const GoogleType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const GoogleUserSettings: z.ZodObject<any> = z.object({
  defaultAlertFolderId: z.string().optional(),
  defaultAlertFolderName: z.string().optional(),
  defaultFolderId: z.string().optional(),
  defaultFolderName: z.string().optional(),
  refreshToken: z.string().optional(),
  saveAllAlerts: z.boolean().optional(),
  saveClips: z.boolean().optional(),
  tokenValid: z.boolean().optional()
});
const Group_AddUsersToOrgGroupWSRequest: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional(),
  userUuids: z.array(z.string()).optional()
});
const OrgGroupMemberType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  groupUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  type: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional()
});
const Group_AddUsersToOrgGroupWSResponse: z.ZodObject<any> = z.object({
  groupMembers: z.array(OrgGroupMemberType).optional()
});
const Group_CreateOrgGroupWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  locationUuid: z.string().optional(),
  name: z.string(),
  userUuids: z.array(z.string()).optional()
});
const OrgGroupType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  type: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const Group_CreateOrgGroupWSResponse: z.ZodObject<any> = z.object({
  group: OrgGroupType.optional(),
  groupMembers: z.array(OrgGroupMemberType).optional()
});
const Group_DeleteOrgGroupWSRequest: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional()
});
const Group_DeleteOrgGroupWSResponse = z.record(z.unknown());
const Group_FindAllUsersForOrgGroupWSRequest: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional()
});
const Group_FindAllUsersForOrgGroupWSResponse: z.ZodObject<any> = z.object({
  groupMembers: z.array(OrgGroupMemberType).optional()
});
const Group_FindOrgGroupMembershipsByUserWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const Group_FindOrgGroupMembershipsByUserWSResponse: z.ZodObject<any> = z.object({
  userGroupMemberships: z.array(OrgGroupMemberType).optional()
});
const Group_FindOrgGroupMembershipsForCurrentUserWSRequest = z.record(z.unknown());
const Group_FindOrgGroupMembershipsForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  userGroupMemberships: z.array(OrgGroupMemberType).optional()
});
const Group_FindOrgGroupsByExactNameWSRequest: z.ZodObject<any> = z.object({
  groupName: z.string().optional()
});
const Group_FindOrgGroupsByExactNameWSResponse: z.ZodObject<any> = z.object({
  group: OrgGroupType.optional()
});
const Group_FindOrgGroupsByNamePrefixWSRequest: z.ZodObject<any> = z.object({
  groupNamePrefix: z.string().optional()
});
const Group_FindOrgGroupsByNamePrefixWSResponse: z.ZodObject<any> = z.object({
  groups: z.array(OrgGroupType).optional()
});
const Group_FindOrgGroupsByOrgWSRequest = z.record(z.unknown());
const Group_FindOrgGroupsByOrgWSResponse: z.ZodObject<any> = z.object({
  groups: z.array(OrgGroupType).optional()
});
const Group_FindOrgGroupsByUserMembershipWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const Group_FindOrgGroupsByUserMembershipWSResponse: z.ZodObject<any> = z.object({
  groups: z.array(OrgGroupType).optional()
});
const Group_RemoveUsersFromOrgGroupWSRequest: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional(),
  userUuids: z.array(z.string()).optional()
});
const Group_RemoveUsersFromOrgGroupWSResponse = z.record(z.unknown());
const Group_UpdateOrgGroupWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  groupUuid: z.string().optional(),
  name: z.string().optional()
});
const Group_UpdateOrgGroupWSResponse: z.ZodObject<any> = z.object({
  group: OrgGroupType.optional()
});
const GuestActivityEnum = z.string();
const GuestTypeEnum = z.string();
const GuestStatusEnum = z.string();
const Guest: z.ZodObject<any> = z.object({
  accessEndTimeMs: z.number().int().optional(),
  accessStartTimeMs: z.number().int().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  backgroundCheckStatus: z.string().optional(),
  checkedInEnum: GuestActivityEnum.optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  countryCode: z.string().optional(),
  crime: z.string().optional(),
  email: z.string().optional(),
  emailCaseSensitive: z.string().optional(),
  faceImage: z.string().optional(),
  firstName: z.string().optional(),
  guestType: GuestTypeEnum.optional(),
  hostUserUuid: z.string().optional(),
  lastCheckedInMs: z.number().int().optional(),
  lastCheckedOutMs: z.number().int().optional(),
  lastName: z.string().optional(),
  locationUuid: z.string().optional(),
  meetingParticipants: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  phoneNumber: z.string().optional(),
  postalCode: z.string().optional(),
  profileImageUrl: z.string().optional(),
  state: z.string().optional(),
  status: GuestStatusEnum.optional()
});
const GuestActivityLog: z.ZodObject<any> = z.object({
  activity: GuestActivityEnum.optional(),
  agent: z.string().optional(),
  associatedCameras: z.array(z.string()).optional(),
  email: z.string().optional(),
  guestType: GuestTypeEnum.optional(),
  hostUserUuid: z.string().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  timestampMs: z.number().int().optional()
});
const GuestInvite: z.ZodObject<any> = z.object({
  accessEndTimeMs: z.number().int().optional(),
  accessStartTimeMs: z.number().int().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  backgroundCheckStatus: z.string().optional(),
  checkedInEnum: GuestActivityEnum.optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  countryCode: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  crime: z.string().optional(),
  email: z.string().optional(),
  emailCaseSensitive: z.string().optional(),
  faceImage: z.string().optional(),
  firstName: z.string().optional(),
  guestType: GuestTypeEnum.optional(),
  hostUserUuid: z.string().optional(),
  lastCheckedInMs: z.number().int().optional(),
  lastCheckedOutMs: z.number().int().optional(),
  lastName: z.string().optional(),
  locationUuid: z.string().optional(),
  meetingParticipants: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  phoneNumber: z.string().optional(),
  postalCode: z.string().optional(),
  profileImageUrl: z.string().optional(),
  state: z.string().optional(),
  status: GuestStatusEnum.optional(),
  uuid: z.string().optional()
});
const GuestInviteSelectiveUpdateByInvocation: z.ZodObject<any> = z.object({
  accessEndTimeMs: z.number().int().optional(),
  accessStartTimeMs: z.number().int().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  backgroundCheckStatus: z.string().optional(),
  checkedInEnum: GuestActivityEnum.optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  countryCode: z.string().optional(),
  createdAtMs: z.number().int().optional(),
  crime: z.string().optional(),
  email: z.string().optional(),
  emailCaseSensitive: z.string().optional(),
  faceImage: z.string().optional(),
  firstName: z.string().optional(),
  guestType: GuestTypeEnum.optional(),
  hostUserUuid: z.string().optional(),
  lastCheckedInMs: z.number().int().optional(),
  lastCheckedOutMs: z.number().int().optional(),
  lastName: z.string().optional(),
  locationUuid: z.string().optional(),
  meetingParticipants: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  phoneNumber: z.string().optional(),
  postalCode: z.string().optional(),
  profileImageUrl: z.string().optional(),
  state: z.string().optional(),
  status: GuestStatusEnum.optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  uuid: z.string().optional()
});
const GuestManagementOrgSettings: z.ZodObject<any> = z.object({
  hexIdentityColor: z.string().optional(),
  logoImageString: z.string().optional(),
  orgUuid: z.string().optional()
});
const GuestManagementSettingsSelectiveUpdate: z.ZodObject<any> = z.object({
  hexIdentityColor: z.string().optional(),
  logoImageString: z.string().optional(),
  orgUuid: z.string().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const GuestManagementType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const GuestSelectiveUpdateByInvocation: z.ZodObject<any> = z.object({
  accessEndTimeMs: z.number().int().optional(),
  accessStartTimeMs: z.number().int().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  backgroundCheckStatus: z.string().optional(),
  checkedInEnum: GuestActivityEnum.optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  countryCode: z.string().optional(),
  crime: z.string().optional(),
  email: z.string().optional(),
  emailCaseSensitive: z.string().optional(),
  faceImage: z.string().optional(),
  firstName: z.string().optional(),
  guestType: GuestTypeEnum.optional(),
  hostUserUuid: z.string().optional(),
  lastCheckedInMs: z.number().int().optional(),
  lastCheckedOutMs: z.number().int().optional(),
  lastName: z.string().optional(),
  locationUuid: z.string().optional(),
  meetingParticipants: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  phoneNumber: z.string().optional(),
  postalCode: z.string().optional(),
  profileImageUrl: z.string().optional(),
  state: z.string().optional(),
  status: GuestStatusEnum.optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional()
});
const Guestmanagement_ActivateKioskWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Guestmanagement_ActivateKioskWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  redirectUrl: z.string().optional()
});
const Guestmanagement_BaseGuestManagementWSRequest = z.record(z.unknown());
const Guestmanagement_CreateGuestInviteWSRequest: z.ZodObject<any> = z.object({
  guestInvite: GuestInvite
});
const Guestmanagement_CreateGuestManagementSettingsWSRequest: z.ZodObject<any> = z.object({
  settings: GuestManagementOrgSettings.optional()
});
const Guestmanagement_CreateGuestManagementSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Guestmanagement_CreateGuestWSRequest: z.ZodObject<any> = z.object({
  fileName: z.string().optional(),
  guest: Guest.optional()
});
const Guestmanagement_ExportGuestActivitiesWSRequest: z.ZodObject<any> = z.object({
  beginTimeMs: z.number().int().optional(),
  email: z.string().optional(),
  endTimeMs: z.number().int().optional(),
  includeGuestTypes: z.array(GuestTypeEnum).optional(),
  includeLocations: z.array(z.string()).optional()
});
const Guestmanagement_ExportGuestsWSRequest: z.ZodObject<any> = z.object({
  beginTimeMs: z.number().int().optional(),
  endTimeMs: z.number().int().optional(),
  includeGuestTypes: z.array(GuestTypeEnum).optional(),
  includeLocations: z.array(z.string()).optional()
});
const Guestmanagement_GetActivityLogsForGuestWSRequest: z.ZodObject<any> = z.object({
  email: z.string().optional()
});
const Guestmanagement_GetActivityLogsForLocationWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  dynamoPageRequest: DynamoPageRequest.optional(),
  locationUuid: z.string().optional()
});
const Guestmanagement_GetAllGuestInvitesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  guestInvites: z.array(GuestInvite).optional()
});
const Guestmanagement_GetAllGuestsWSResponse: z.ZodObject<any> = z.object({
  allGuests: z.array(Guest).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Guestmanagement_GetGuestActivityLogsWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  dynamoPageRequest: DynamoPageRequest.optional()
});
const Guestmanagement_GetGuestActivityLogsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  guestActivities: z.array(GuestActivityLog).optional()
});
const Guestmanagement_GetGuestInviteWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  guestInvite: GuestInvite.optional()
});
const Guestmanagement_GetGuestInvitesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  guestInvites: z.array(GuestInvite).optional()
});
const Guestmanagement_GetGuestManagementSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  settings: GuestManagementOrgSettings.optional()
});
const Guestmanagement_GetGuestWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  guest: Guest.optional()
});
const PaginateRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional()
});
const Guestmanagement_GetInvitesForOrgWSRequest: z.ZodObject<any> = z.object({
  invitedAfterMs: z.number().int().optional(),
  invitedBeforeMs: z.number().int().optional(),
  paginateRequest: PaginateRequest.optional()
});
const Kiosk: z.ZodObject<any> = z.object({
  batteryLevel: z.number().optional(),
  connectionStatus: z.string().optional(),
  deleted: z.boolean().optional(),
  lastUpdateTimeMs: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  printerIP: z.string().optional(),
  uuid: z.string().optional()
});
const Guestmanagement_GetKioskInfoWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  kiosk: Kiosk.optional()
});
const Guestmanagement_GetKiosksForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  kiosks: z.array(Kiosk).optional()
});
const Guestmanagement_GetNametagTemplateForGuestWSRequest: z.ZodObject<any> = z.object({
  email: z.string().optional()
});
const Guestmanagement_GetNametagTemplateForGuestWSResponse: z.ZodObject<any> = z.object({
  badgeTemplate: BadgeTemplate.optional(),
  companyLogoUrl: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Guestmanagement_GuestByEmailWSRequest: z.ZodObject<any> = z.object({
  email: z.string().optional()
});
const Guestmanagement_GuestCheckinWSRequest: z.ZodObject<any> = z.object({
  email: z.string(),
  locationUuid: z.string()
});
const Guestmanagement_GuestInviteWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string()
});
const Guestmanagement_GuestInvitesByEmailWSRequest: z.ZodObject<any> = z.object({
  email: z.string()
});
const Guestmanagement_GuestWSRequest: z.ZodObject<any> = z.object({
  guest: Guest.optional()
});
const Guestmanagement_UpdateGuestInviteWSRequest: z.ZodObject<any> = z.object({
  inviteUpdate: GuestInviteSelectiveUpdateByInvocation
});
const Guestmanagement_UpdateGuestManagementSettingsWSRequest: z.ZodObject<any> = z.object({
  settingsUpdate: GuestManagementSettingsSelectiveUpdate.optional()
});
const Guestmanagement_UpdateGuestManagementSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Guestmanagement_UpdateGuestWSRequest: z.ZodObject<any> = z.object({
  fileName: z.string().optional(),
  guest: Guest.optional(),
  guestUpdate: GuestSelectiveUpdateByInvocation.optional()
});
const HaloSettings: z.ZodObject<any> = z.object({
  alertAgression: z.boolean().optional(),
  alertCO: z.boolean().optional(),
  alertCO2: z.boolean().optional(),
  alertGunshot: z.boolean().optional(),
  alertHelp: z.boolean().optional(),
  alertMasking: z.boolean().optional(),
  alertTHC: z.boolean().optional(),
  alertTamper: z.boolean().optional(),
  alertTemp: z.boolean().optional(),
  alertVOC: z.boolean().optional(),
  alertVape: z.boolean().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  saveClips: z.boolean().optional(),
  savedClipDurationMs: z.number().int().optional(),
  sensorName: z.string().optional(),
  sensorToCamerasMap: z.record(z.unknown()).optional(),
  triggerNotification: z.boolean().optional(),
  url: z.string().optional()
});
const HardwareInvoiceSubItem: z.ZodObject<any> = z.object({
  count: z.number().int().optional(),
  description: z.string().optional(),
  price: z.number().optional()
});
const HardwareType: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  enforcedMinFirmwareVersion: z.string().optional(),
  firmwareUpdateTimeMs: z.number().int().optional(),
  firmwareVersion: z.string().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  mac: z.string().optional(),
  manufacturedAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  pendingRegistrationDeviceUuid: z.string().optional(),
  pendingRegistrationOrgUuid: z.string().optional(),
  pendingRegistrationToken: z.string().optional(),
  sdSize: z.number().int().optional(),
  serialNumber: z.string().optional(),
  type: DeviceTypeEnum.optional(),
  uuid: z.string().optional()
});
const Help_CreateTicketWSRequest: z.ZodObject<any> = z.object({
  body: z.string().optional(),
  collaborators: z.array(z.string()).optional(),
  consoleAccessGranted: z.boolean().optional(),
  productType: z.string().optional(),
  serialNumbers: z.array(z.string()).optional(),
  serviceType: z.string().optional(),
  subject: z.string().optional()
});
const Help_CreateTicketWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failureReason: z.string().optional(),
  success: z.boolean().optional(),
  ticketId: z.number().int().optional()
});
const Help_GetOpenTicketsV2WSRequest: z.ZodObject<any> = z.object({
  endTimeMs: z.number().int().optional(),
  startTimeMs: z.number().int().optional()
});
const Help_TicketInformation: z.ZodObject<any> = z.object({
  createdAt: z.string().datetime({ offset: true }).optional(),
  id: z.number().int().optional(),
  status: z.string().optional(),
  subject: z.string().optional()
});
const Help_GetOpenTicketsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  tickets: z.array(Help_TicketInformation).optional(),
  userTickets: z.array(Help_TicketInformation).optional()
});
const Help_GetOpenTicketsWSRequest: z.ZodObject<any> = z.object({
  pageNumber: z.number().int().optional()
});
const Help_GetOpenTicketsWSResponse: z.ZodObject<any> = z.object({
  currentPage: z.number().int().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  hasNexPage: z.boolean().optional(),
  tickets: z.array(Help_TicketInformation).optional(),
  totalTickets: z.number().int().optional()
});
const Help_ShippingAddress: z.ZodObject<any> = z.object({
  returnAddressCity: z.string().optional(),
  returnAddressCountry: z.string().optional(),
  returnAddressPostalCode: z.string().optional(),
  returnAddressState: z.string().optional(),
  returnAddressStreet: z.string().optional()
});
const Help_ProcessRMAWSRequest: z.ZodObject<any> = z.object({
  contactName: z.string().optional(),
  contactPhoneNumber: z.string().optional(),
  deviceName: z.string().optional(),
  problem: z.string().optional(),
  returnShippingAddress: Help_ShippingAddress.optional(),
  serialNumber: z.string().optional()
});
const Help_ProcessRMAWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failureReason: z.string().optional(),
  success: z.boolean().optional(),
  ticketId: z.number().int().optional()
});
const Help_SendFeedbackWSRequest: z.ZodObject<any> = z.object({
  feedback: z.string().optional()
});
const Help_SendFeedbackWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failureReason: z.string().optional(),
  success: z.boolean().optional()
});
const Help_TriageDeviceWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  startDateSec: z.number().int().optional()
});
const Help_TriageDeviceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  firmwareUpdates: z.array(DiagnosticEventType).optional(),
  hardwareFailureEvents: z.array(DiagnosticEventType).optional(),
  message: z.string().optional(),
  presenceWindows: z.array(TimeWindowSeconds).optional(),
  suggestedArticles: z.array(z.string()).optional(),
  uptimeWindows: z.array(TimeWindowSeconds).optional()
});
const HttpMethod = z.record(z.unknown());
const HttpRange = z.record(z.unknown());
const HttpHeaders: z.ZodObject<any> = z.object({
  accept: z.array(MediaType).optional(),
  acceptCharset: z.array(z.object({
  registered: z.boolean().optional()
})).optional(),
  acceptLanguage: z.array(z.object({
  range: z.string().optional(),
  weight: z.number().optional()
})).optional(),
  acceptLanguageAsLocales: z.array(z.object({
  country: z.string().optional(),
  displayCountry: z.string().optional(),
  displayLanguage: z.string().optional(),
  displayName: z.string().optional(),
  displayScript: z.string().optional(),
  displayVariant: z.string().optional(),
  extensionKeys: z.array(z.string()).optional(),
  iso3Country: z.string().optional(),
  iso3Language: z.string().optional(),
  language: z.string().optional(),
  script: z.string().optional(),
  unicodeLocaleAttributes: z.array(z.string()).optional(),
  unicodeLocaleKeys: z.array(z.string()).optional(),
  variant: z.string().optional()
})).optional(),
  acceptPatch: z.array(MediaType).optional(),
  accessControlAllowCredentials: z.boolean().optional(),
  accessControlAllowHeaders: z.array(z.string()).optional(),
  accessControlAllowMethods: z.array(HttpMethod).optional(),
  accessControlAllowOrigin: z.string().optional(),
  accessControlExposeHeaders: z.array(z.string()).optional(),
  accessControlMaxAge: z.number().int().optional(),
  accessControlRequestHeaders: z.array(z.string()).optional(),
  accessControlRequestMethod: HttpMethod.optional(),
  all: z.record(z.unknown()).optional(),
  allow: z.array(HttpMethod).optional(),
  basicAuth: z.string().optional(),
  bearerAuth: z.string().optional(),
  cacheControl: z.string().optional(),
  connection: z.array(z.string()).optional(),
  contentDisposition: ContentDisposition.optional(),
  contentLanguage: z.object({
  country: z.string().optional(),
  displayCountry: z.string().optional(),
  displayLanguage: z.string().optional(),
  displayName: z.string().optional(),
  displayScript: z.string().optional(),
  displayVariant: z.string().optional(),
  extensionKeys: z.array(z.string()).optional(),
  iso3Country: z.string().optional(),
  iso3Language: z.string().optional(),
  language: z.string().optional(),
  script: z.string().optional(),
  unicodeLocaleAttributes: z.array(z.string()).optional(),
  unicodeLocaleKeys: z.array(z.string()).optional(),
  variant: z.string().optional()
}).optional(),
  contentLength: z.number().int().optional(),
  contentType: MediaType.optional(),
  date: z.number().int().optional(),
  empty: z.boolean().optional(),
  etag: z.string().optional(),
  expires: z.number().int().optional(),
  host: z.object({
  address: z.object({
  address: z.array(z.string()).optional(),
  anyLocalAddress: z.boolean().optional(),
  canonicalHostName: z.string().optional(),
  hostAddress: z.string().optional(),
  hostName: z.string().optional(),
  linkLocalAddress: z.boolean().optional(),
  loopbackAddress: z.boolean().optional(),
  mcglobal: z.boolean().optional(),
  mclinkLocal: z.boolean().optional(),
  mcnodeLocal: z.boolean().optional(),
  mcorgLocal: z.boolean().optional(),
  mcsiteLocal: z.boolean().optional(),
  multicastAddress: z.boolean().optional(),
  siteLocalAddress: z.boolean().optional()
}).optional(),
  hostName: z.string().optional(),
  hostString: z.string().optional(),
  port: z.number().int().optional(),
  unresolved: z.boolean().optional()
}).optional(),
  ifMatch: z.array(z.string()).optional(),
  ifModifiedSince: z.number().int().optional(),
  ifNoneMatch: z.array(z.string()).optional(),
  ifUnmodifiedSince: z.number().int().optional(),
  lastModified: z.number().int().optional(),
  location: z.string().optional(),
  origin: z.string().optional(),
  pragma: z.string().optional(),
  range: z.array(HttpRange).optional(),
  upgrade: z.string().optional(),
  vary: z.array(z.string()).optional()
});
const HttpStatusCode: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  is1xxInformational: z.boolean().optional(),
  is2xxSuccessful: z.boolean().optional(),
  is3xxRedirection: z.boolean().optional(),
  is4xxClientError: z.boolean().optional(),
  is5xxServerError: z.boolean().optional()
});
const IAperioType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const IAvigilonAltaType: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  apiToken: z.string().optional(),
  badgeAuthDisablesAlarmMonitoring: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorToCameraMap: z.record(z.unknown()).optional(),
  doorsValidated: z.boolean().optional(),
  email: z.string().optional(),
  enabled: z.boolean().optional(),
  eventToWebhookIdMap: z.record(z.unknown()).optional(),
  eventToWebhookMap: z.record(z.unknown()).optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  indexFaces: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  misconfiguredDoors: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  password: z.string().optional(),
  refreshToken: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional(),
  webhookId: z.number().int().optional()
});
const InformacastType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const InnerRangeType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const KisiType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const LumeoType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const MicrosoftTeamsType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const NineOneOneCellularType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const OmnialertType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const OpenAIType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const OpentechAllianceType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const PimlocType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const PlaceOsType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const ProDataKeyType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const RaptorType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const ShellyType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const ToastType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const WebhooksType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const ZapierType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const IBaseIntegrationType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const IBrivoType: z.ZodObject<any> = z.object({
  accessToken: z.string().optional(),
  alertUnauthorizedFaces: z.boolean().optional(),
  apiKey: z.string().optional(),
  apiToken: z.string().optional(),
  badgeAuthDisablesAlarmMonitoring: z.boolean().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorsValidated: z.boolean().optional(),
  enabled: z.boolean().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  indexFaces: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  misconfiguredDoors: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  password: z.string().optional(),
  refreshToken: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional(),
  username: z.string().optional(),
  version: z.number().int().optional(),
  webhookId: z.number().int().optional()
});
const IButterflyMXType: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  apiToken: z.string().optional(),
  badgeAuthDisablesAlarmMonitoring: z.boolean().optional(),
  buildingWebhookIdMap: z.record(z.unknown()).optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorsValidated: z.boolean().optional(),
  enabled: z.boolean().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  indexFaces: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  misconfiguredDoors: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  panelInfoMap: z.record(z.unknown()).optional(),
  refreshToken: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional()
});
const IDeviceIntegrationType: z.ZodObject<any> = z.object({
  deviceSettingsMap: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const IDiceType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const IEnvoyType: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  apiToken: z.string().optional(),
  badgeAuthDisablesAlarmMonitoring: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorsValidated: z.boolean().optional(),
  enabled: z.boolean().optional(),
  envoyIntegrationInstalled: z.boolean().optional(),
  envoyUserSettingsMap: z.record(z.unknown()).optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  indexFaces: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  locationInfoMap: z.record(z.unknown()).optional(),
  misconfiguredDoors: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  refreshToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional()
});
const IFlicType: z.ZodObject<any> = z.object({
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  associatedLocations: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  moduleUploaded: z.boolean().optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional(),
  webhookId: z.string().optional(),
  webhookToken: z.string().optional()
});
const IGeneaType: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  apiToken: z.string().optional(),
  badgeAuthDisablesAlarmMonitoring: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorsValidated: z.boolean().optional(),
  enabled: z.boolean().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  indexFaces: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  misconfiguredDoors: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  refreshToken: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional(),
  webhookSignatureSecret: z.string().optional(),
  webhookUuid: z.string().optional()
});
const IGoogleType: z.ZodObject<any> = z.object({
  allowUserStorage: z.boolean().optional(),
  apiToken: z.string().optional(),
  defaultAlertFolderId: z.string().optional(),
  defaultAlertFolderName: z.string().optional(),
  defaultFolderId: z.string().optional(),
  defaultFolderName: z.string().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  refreshToken: z.string().optional(),
  saveAllAlerts: z.boolean().optional(),
  saveClips: z.boolean().optional(),
  tokenValid: z.boolean().optional(),
  userSettingsMap: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const IGuestManagementType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  locationSettingsMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const IInformacastType: z.ZodObject<any> = z.object({
  apiToken: z.string().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional()
});
const IInnerRangeType: z.ZodObject<any> = z.object({
  apiToken: z.string().optional(),
  consoleToSettingsMap: z.record(z.unknown()).optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  refreshToken: z.string().optional(),
  skyTunnelSN: z.string().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional()
});
const IKisiType: z.ZodObject<any> = z.object({
  apiSecretKey: z.string().optional(),
  defaultOptions: BadgeIntegrationDefaultOptions.optional(),
  doorsValidated: z.boolean().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  placeToSettingsMap: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const ILumeoType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const IMicrosoftTeamsType: z.ZodObject<any> = z.object({
  adminConsent: z.boolean().optional(),
  allowUserNotifications: z.boolean().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  microsoftTeamSettingsMap: z.record(z.unknown()).optional(),
  microsoftTeamsUserSettingsMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  tenantId: z.string().optional(),
  userUuid: z.string().optional()
});
const INineOneOneCellularType: z.ZodObject<any> = z.object({
  bearerToken: z.string().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  saveClips: z.boolean().optional(),
  securityZoneMap: z.record(z.unknown()).optional(),
  triggerNotification: z.boolean().optional(),
  userUuid: z.string().optional(),
  webhookToken: z.string().optional(),
  zonesValidated: z.boolean().optional()
});
const IOmnialertType: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  saveClips: z.boolean().optional(),
  triggerNotification: z.boolean().optional(),
  userUuid: z.string().optional(),
  webhookToken: z.string().optional()
});
const IOpenAIType: z.ZodObject<any> = z.object({
  apiToken: z.string().optional(),
  baseUrl: z.string().optional(),
  defaultModel: z.string().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional()
});
const IOpentechAllianceType: z.ZodObject<any> = z.object({
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  enabled: z.boolean().optional(),
  facilityToSettingsMap: z.record(z.unknown()).optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const IPimlocType: z.ZodObject<any> = z.object({
  baseAPIUrl: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  rhombusToken: z.string().optional(),
  userUuid: z.string().optional(),
  validCredentials: z.boolean().optional()
});
const IPlaceOsType: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  apiToken: z.string().optional(),
  apiUrl: z.string().optional(),
  badgeAuthDisablesAlarmMonitoring: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorsValidated: z.boolean().optional(),
  enabled: z.boolean().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  indexFaces: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  misconfiguredDoors: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  refreshToken: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  tokenValid: z.boolean().optional(),
  triggerNotification: z.boolean().optional(),
  userUuid: z.string().optional(),
  webhookSignatureSecret: z.string().optional()
});
const IProDataKeyType: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  apiToken: z.string().optional(),
  badgeAuthDisablesAlarmMonitoring: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorsValidated: z.boolean().optional(),
  enabled: z.boolean().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  indexFaces: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  misconfiguredDoors: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  organizationId: z.string().optional(),
  refreshToken: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  systemId: z.string().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional(),
  webhookId: z.string().optional(),
  webhookSignatureSecret: z.string().optional()
});
const IRaptorType: z.ZodObject<any> = z.object({
  apiToken: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  clientUid: z.string().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenValid: z.boolean().optional(),
  userUuid: z.string().optional()
});
const IShellyType: z.ZodObject<any> = z.object({
  canSendDiagnosticNotifications: z.boolean().optional(),
  diagnosticQuietPeriodSecs: z.number().int().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  shellyDeviceMap: z.record(z.unknown()).optional(),
  thirdPartyDeviceToLocationMap: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const IToastType: z.ZodObject<any> = z.object({
  currentToastRestaurantGuid: z.string().optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  restaurantSettingsMap: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const IWebhooksType: z.ZodObject<any> = z.object({
  activityWebhooks: z.record(z.unknown()).optional(),
  activityWebhooksV2: z.record(z.unknown()).optional(),
  diagnosticWebhooks: z.record(z.unknown()).optional(),
  diagnosticWebhooksV2: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
  integration: IntegrationEnum.optional(),
  integrationAuditMap: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const ImmixSettings: z.ZodObject<any> = z.object({
  deviceList: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  serverUrl: z.string().optional()
});
const InformacastScenario: z.ZodObject<any> = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  scenarioId: z.string().optional()
});
const InnerRangeConsoleSettings: z.ZodObject<any> = z.object({
  apiKey: z.string().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  skyTunnelSN: z.string().optional(),
  tokenValid: z.boolean().optional()
});
const InnerRangeDoorType: z.ZodObject<any> = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  readerIds: z.array(z.string()).optional()
});
const InnerRangeConsoleType: z.ZodObject<any> = z.object({
  doorList: z.array(InnerRangeDoorType).optional(),
  skyTunnelSN: z.string().optional()
});
const InnerRangeDoorInfoType: z.ZodObject<any> = z.object({
  assignedCameraList: z.array(z.string()).optional(),
  clipDuration: z.number().int().optional(),
  doorName: z.string().optional(),
  leadingSeconds: z.number().int().optional(),
  locationUuid: z.string().optional(),
  readerIds: z.array(z.string()).optional(),
  remoteUnlock: z.boolean().optional()
});
const IntegrationActionStatusEnum = z.string();
const IntegrationAuditEventEnum = z.string();
const IntegrationAuditEvent: z.ZodObject<any> = z.object({
  enabledTimestampMs: z.number().int().optional(),
  integrationAuditEvent: IntegrationAuditEventEnum.optional(),
  user: z.string().optional(),
  userUuid: z.string().optional()
});
const IntegrationDiagnosticEventType: z.ZodObject<any> = z.object({
  activity: z.string().optional(),
  integration: IntegrationEnum.optional(),
  orgUuid: z.string().optional(),
  thirdPartyDeviceId: z.string().optional(),
  thirdPartyDeviceName: z.string().optional(),
  timestamp: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional()
});
const Integration_BaseIntegrationWSRequest = z.record(z.unknown());
const Integration_CreateEnvoyInviteWSRequest: z.ZodObject<any> = z.object({
  invitation: EnvoyInvite.optional()
});
const Integration_GetAccessControlIntegrationsForAlmWSResponse: z.ZodObject<any> = z.object({
  badDoors: z.array(z.string()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  integrations: z.array(IntegrationEnum).optional()
});
const Integration_GetAllGuestsWSResponse: z.ZodObject<any> = z.object({
  allGuests: z.array(Guest).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetAllOrgIntegrationsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  orgIntegrationsV2: z.record(z.unknown()).optional()
});
const Integration_GetAmtReadersWSRequest: z.ZodObject<any> = z.object({
  email: z.string().optional(),
  password: z.string().optional()
});
const Integration_GetAperioIntegrationWSRequest = z.record(z.unknown());
const Integration_aperio_AperioDeviceView: z.ZodObject<any> = z.object({
  aperioId: z.array(z.string()).optional(),
  gatewayId: z.array(z.string()).optional(),
  lastSeenMs: z.number().int().optional(),
  rawType: z.string().optional()
});
const Integration_aperio_DtcInfoView: z.ZodObject<any> = z.object({
  code: z.array(z.string()).optional(),
  error: z.boolean().optional(),
  failing: z.boolean().optional(),
  hasFailed: z.boolean().optional(),
  name: z.string().optional(),
  testCompleted: z.boolean().optional(),
  time: z.number().int().optional()
});
const Integration_aperio_AperioIntegrationStatus = z.string();
const Integration_aperio_AperioDoorView: z.ZodObject<any> = z.object({
  accessControlledDoorUuid: z.string().optional(),
  aperioDoorDeviceId: z.string().optional(),
  aperioGatewayId: z.string().optional(),
  aperioId: z.string().optional(),
  connected: z.boolean().optional(),
  doorExtensionComponentId: z.string().optional(),
  dtcs: z.array(Integration_aperio_DtcInfoView).optional(),
  lastSeenMs: z.number().int().optional(),
  name: z.string().optional(),
  rawActivatorState: z.number().int().optional(),
  rawDoorMode: z.number().int().optional(),
  rawHandleState: z.number().int().optional(),
  rawKeyCylinderState: z.number().int().optional(),
  rawTamperState: z.number().int().optional(),
  removed: z.boolean().optional(),
  stateUpdateEventTimestampMs: z.number().int().optional(),
  status: Integration_aperio_AperioIntegrationStatus.optional()
});
const Integration_aperio_AperioGatewayView: z.ZodObject<any> = z.object({
  aperioGatewayId: z.string().optional(),
  baseType: ComponentBaseEnumType.optional(),
  componentUuid: z.string().optional(),
  connected: z.boolean().optional(),
  devices: z.array(Integration_aperio_AperioDeviceView).optional(),
  doors: z.array(Integration_aperio_AperioDoorView).optional(),
  dtcs: z.array(Integration_aperio_DtcInfoView).optional(),
  expectedOemCode: z.string().optional(),
  firmwareVersion: z.string().optional(),
  hardwareModel: z.string().optional(),
  hwVersion: z.array(z.string()).optional(),
  ipAddress: z.string().optional(),
  lastSeenMs: z.number().int().optional(),
  protocolVersion: z.string().optional(),
  rawTamperState: z.number().int().optional(),
  reportedOemCode: z.string().optional(),
  status: Integration_aperio_AperioIntegrationStatus.optional()
});
const Integration_aperio_AperioRhombusDoorControllerView: z.ZodObject<any> = z.object({
  aperioGateways: z.array(Integration_aperio_AperioGatewayView).optional(),
  deviceUuid: z.string().optional(),
  hwId: z.string().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  name: z.string().optional(),
  serialNumber: z.string().optional()
});
const Integration_GetAperioIntegrationWSResponse: z.ZodObject<any> = z.object({
  aperioSettings: IAperioType.optional(),
  doorControllers: z.array(Integration_aperio_AperioRhombusDoorControllerView).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetApiTokenApplicationsWSRequest = z.record(z.unknown());
const Integration_GetApiTokenApplicationsWSResponse: z.ZodObject<any> = z.object({
  applications: z.array(ApiTokenApplicationType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetApiTokensWSRequest: z.ZodObject<any> = z.object({
  optionalFilter: z.array(ApiClientTypeEnum).optional()
});
const Integration_GetApiTokensWSResponse: z.ZodObject<any> = z.object({
  apiTokens: z.array(ApiTokenType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetBadgeIntegrationDoorsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  doors: z.array(DoorType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetBadgeIntegrationGenericDoorsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  doors: z.array(GenericDoorType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const PlaceType: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  id: z.number().int().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  name: z.string().optional(),
  saveClips: z.boolean().optional()
});
const Integration_GetBadgeIntegrationPlacesWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  places: z.array(PlaceType).optional()
});
const Integration_GetBrivoDoorsWSRequest: z.ZodObject<any> = z.object({
  password: z.string().optional(),
  username: z.string().optional()
});
const Integration_GetBrivoDoorsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  doors: z.array(DoorType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetButterflymxPanelsWSRequest: z.ZodObject<any> = z.object({
  email: z.string().optional(),
  password: z.string().optional()
});
const Integration_GetButterflymxPanelsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  buildings: z.array(ButterflymxBuilding).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetCalendlyEventDetailsWSRequest: z.ZodObject<any> = z.object({
  eventUuid: z.string().optional()
});
const Integration_GetCalendlyEventDetailsWSResponse: z.ZodObject<any> = z.object({
  email: z.string().optional(),
  endTimeMs: z.number().int().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  name: z.string().optional(),
  startTimeMs: z.number().int().optional()
});
const Integration_GetEnvoyDeliveriesWSRequest: z.ZodObject<any> = z.object({
  endTimestampMs: z.number().int().optional(),
  locationIds: z.array(z.string()).optional(),
  startTimestampMs: z.number().int().optional()
});
const Integration_GetEnvoyDeliveriesWSResponse: z.ZodObject<any> = z.object({
  collectedDeliveries: z.array(EnvoyDelivery).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  pendingDeliveries: z.array(EnvoyDelivery).optional()
});
const Integration_GetEnvoyEmployeesWSRequest: z.ZodObject<any> = z.object({
  locationIds: z.array(z.string()).optional()
});
const Integration_GetEnvoyEmployeesWSResponse: z.ZodObject<any> = z.object({
  employees: z.array(EnvoyPersonInfo).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetEnvoyLocationsWSRequest = z.record(z.unknown());
const Integration_GetEnvoyLocationsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  locationList: z.array(EnvoyLocation).optional()
});
const Integration_GetEnvoyVisitorsWSRequest: z.ZodObject<any> = z.object({
  endTimestampMs: z.number().int().optional(),
  includeSignedOutVisitors: z.boolean().optional(),
  locationIds: z.array(z.string()).optional(),
  startTimestampMs: z.number().int().optional()
});
const Integration_GetEnvoyVisitorsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  invites: z.array(EnvoyExpectedGuest).optional(),
  visitors: z.array(EnvoyGuest).optional()
});
const Integration_GetFlicDevicesWSRequest: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetFlicDevicesWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  flicDevices: z.array(FlicDevice).optional(),
  flicModule: FlicDevice.optional()
});
const Integration_GetGeneaDoorsWSRequest: z.ZodObject<any> = z.object({
  apiToken: z.string().optional()
});
const PanelType: z.ZodObject<any> = z.object({
  id: z.string().optional(),
  name: z.string().optional()
});
const Integration_GetGeneaDoorsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  panelList: z.array(PanelType).optional()
});
const Integration_GetGuestWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  guest: Guest.optional()
});
const Integration_GetInformacastScenariosWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  scenarios: z.array(InformacastScenario).optional()
});
const Integration_GetInnerRangeConsolesWSRequest = z.record(z.unknown());
const Integration_GetInnerRangeConsolesWSResponse: z.ZodObject<any> = z.object({
  consoles: z.array(InnerRangeConsoleType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetInnerRangeDoorsWSRequest = z.record(z.unknown());
const Integration_GetInnerRangeDoorsWSResponse: z.ZodObject<any> = z.object({
  doors: z.array(InnerRangeDoorType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_GetIntegrationDiagnosticEventsWSRequest: z.ZodObject<any> = z.object({
  timestampMsAfter: z.number().int().optional(),
  timestampMsBefore: z.number().int().optional()
});
const Integration_GetIntegrationDiagnosticEventsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  integrationDiagnosticEvents: z.array(IntegrationDiagnosticEventType).optional()
});
const Integration_GetKisiDoorsWSRequest: z.ZodObject<any> = z.object({
  apiSecretKey: z.string().optional()
});
const Integration_GetKisiDoorsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  placeToDoorMap: z.record(z.unknown()).optional()
});
const KisiSettings: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  apiSecretKey: z.string().optional(),
  createSeekPoints: z.boolean().optional(),
  defaultOptions: BadgeIntegrationDefaultOptions.optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorToCameraMap: z.record(z.unknown()).optional(),
  doorsValidated: z.boolean().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  migrated: z.boolean().optional(),
  placeId: z.number().int().optional(),
  placeToSettingsMap: z.record(z.unknown()).optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  webhookId: z.number().int().optional()
});
const Integration_GetKisiIntegrationWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedGuids: z.array(z.string()).optional(),
  kisiSettings: KisiSettings.optional(),
  misconfiguredDoors: z.array(z.string()).optional()
});
const Integration_GetKisiPlacesWSRequest: z.ZodObject<any> = z.object({
  apiSecretKey: z.string().optional()
});
const Integration_GetMicrosoftUsersJoinedTeamsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  teamsMap: z.record(z.unknown()).optional()
});
const Integration_GetNineOneOneCSZonesWSRequest = z.record(z.unknown());
const SecurityZoneInfoType: z.ZodObject<any> = z.object({
  assignedCameraList: z.array(z.string()).optional(),
  isParentZone: z.boolean().optional(),
  securityZoneName: z.string().optional(),
  zoneAddress: z.string().optional(),
  zoneId: z.string().optional(),
  zoneParentId: z.string().optional()
});
const Integration_GetNineOneOneCSZonesWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  zone: SecurityZoneInfoType.optional(),
  zoneMap: z.record(z.unknown()).optional()
});
const Integration_GetOpenAIModelsWSRequest: z.ZodObject<any> = z.object({
  openAISettings: IOpenAIType.optional()
});
const OpenAIModel: z.ZodObject<any> = z.object({
  created: z.string().optional(),
  id: z.string().optional(),
  object: z.string().optional(),
  ownedBy: z.string().optional(),
  owned_by: z.string().optional()
});
const Integration_GetOpenAIModelsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  models: z.array(OpenAIModel).optional()
});
const Integration_GetOpenpathDoorsWSRequest: z.ZodObject<any> = z.object({
  email: z.string().optional(),
  password: z.string().optional()
});
const LockdownType: z.ZodObject<any> = z.object({
  id: z.number().int().optional(),
  isActive: z.boolean().optional(),
  name: z.string().optional()
});
const Integration_GetOpenpathLockdownsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lockdownPlans: z.array(LockdownType).optional()
});
const Integration_GetOpentechAllianceFacilitiesWSRequest = z.record(z.unknown());
const OpentechAllianceActionGroupType: z.ZodObject<any> = z.object({
  actionGroupId: z.string().optional(),
  deviceId: z.string().optional(),
  locationName: z.string().optional(),
  name: z.string().optional()
});
const OpentechAllianceFacilityType: z.ZodObject<any> = z.object({
  actionGroups: z.array(OpentechAllianceActionGroupType).optional(),
  deviceList: z.array(DoorType).optional(),
  id: z.string().optional(),
  name: z.string().optional()
});
const Integration_GetOpentechAllianceFacilitiesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  facilities: z.array(OpentechAllianceFacilityType).optional()
});
const Integration_GetOrgIntegrationsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  orgIntegrationV2: IBaseIntegrationType.optional()
});
const Integration_GetOrgIntegrationsWSRequest = z.record(z.unknown());
const IntuifaceSettings: z.ZodObject<any> = z.object({
  deviceToTriggerMap: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional()
});
const LumeoSettings: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional()
});
const MattermostSettings: z.ZodObject<any> = z.object({
  channel: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  webhookUrl: z.string().optional()
});
const MicrosoftTeamsSettings: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  webhookUrl: z.string().optional()
});
const NoonlightSettings: z.ZodObject<any> = z.object({
  acceptedTermsOfService: z.boolean().optional(),
  defaultContactsByLocationMap: z.record(z.unknown()).optional(),
  defaultDelayByLocationsMap: z.record(z.unknown()).optional(),
  defaultPromptByLocationsMap: z.record(z.unknown()).optional(),
  emergencyContactsByLocationsMap: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
  escalationSettingsByLocationsMap: z.record(z.unknown()).optional(),
  locationEntryInstructionsMap: z.record(z.unknown()).optional(),
  pinsByLocationMap: z.record(z.unknown()).optional(),
  verificationPrompt: z.string().optional()
});
const Office365Settings: z.ZodObject<any> = z.object({
  driveId: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  tenantId: z.string().optional()
});
const OpenpathSettings: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorToCameraMap: z.record(z.unknown()).optional(),
  email: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  eventToWebhookIdMap: z.record(z.unknown()).optional(),
  eventToWebhookMap: z.record(z.unknown()).optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  migrated: z.boolean().optional(),
  password: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  webhookId: z.number().int().optional()
});
const OpentechAllianceSettings: z.ZodObject<any> = z.object({
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  facilityToSettingsMap: z.record(z.unknown()).optional(),
  migrated: z.boolean().optional()
});
const PagerDutySettings: z.ZodObject<any> = z.object({
  allLocationIntegrationKeys: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  integrationKey: z.string().optional(),
  locationToIntegrationKeysMap: z.record(z.unknown()).optional()
});
const PlaceOsSettings: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  apiUrl: z.string().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  migrated: z.boolean().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  webhookSignatureSecret: z.string().optional()
});
const ProDataKeySettings: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  badgeAuthDisablesAlarmMonitoring: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  doorsValidated: z.boolean().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  misconfiguredDoors: z.array(z.string()).optional(),
  ouId: z.string().optional(),
  rhombusToken: z.string().optional(),
  saveClips: z.boolean().optional(),
  webhookId: z.string().optional(),
  webhookSignatureSecret: z.string().optional()
});
const SaltoSettings: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  enabled: z.boolean().optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  saveClips: z.boolean().optional(),
  tokenToCamerasMap: z.record(z.unknown()).optional()
});
const ServiceNowSettings: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  instanceUrl: z.string().optional(),
  password: z.string().optional(),
  username: z.string().optional()
});
const SlackSettings: z.ZodObject<any> = z.object({
  accessToken: z.string().optional(),
  channel: z.string().optional(),
  enabled: z.boolean().optional(),
  webhookUrl: z.string().optional()
});
const SlackSettingsV2: z.ZodObject<any> = z.object({
  channelId: z.string().optional(),
  channelName: z.string().optional(),
  code: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  orgAccessToken: z.string().optional(),
  sendChannelNotifications: z.boolean().optional(),
  sendUserNotifications: z.boolean().optional(),
  userMap: z.record(z.unknown()).optional(),
  webhookUrl: z.string().optional()
});
const SquareSettings: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  locationIdToDeviceUuidsMap: z.record(z.unknown()).optional()
});
const ToastSettings: z.ZodObject<any> = z.object({
  currentToastRestaurantGuid: z.string().optional(),
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  migrated: z.boolean().optional(),
  posInfoMap: z.record(z.unknown()).optional(),
  toastRestaurantInfoMap: z.record(z.unknown()).optional()
});
const TPLinkSettings: z.ZodObject<any> = z.object({
  cameraToSwitchMap: z.record(z.unknown()).optional(),
  enabled: z.boolean().optional(),
  password: z.string().optional(),
  targetState: z.number().int().optional(),
  url: z.string().optional(),
  username: z.string().optional()
});
const TwilioSettings: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  phoneNumbers: z.array(z.string()).optional()
});
const WebhookSettings: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  enabledTimestampMs: z.number().int().optional(),
  enablingUser: z.string().optional(),
  enablingUserUuid: z.string().optional(),
  webhookSecret: z.string().optional(),
  webhookUrl: z.string().optional()
});
const OrgIntegrationsType: z.ZodObject<any> = z.object({
  amtSettings: AmtSettings.optional(),
  awsSettings: AwsSettings.optional(),
  backblazeSettings: BackblazeSettings.optional(),
  boxSettings: BoxSettings.optional(),
  brivoSettings: BrivoSettings.optional(),
  butterflymxSettings: ButterflyMXSettings.optional(),
  diceSettings: DiceSettings.optional(),
  dropboxSettingsV2: DropboxSettingsV2.optional(),
  emailSettings: EmailSettings.optional(),
  envoySettings: EnvoySettings.optional(),
  geneaSettings: GeneaSettings.optional(),
  googleSettings: GoogleSettings.optional(),
  googleSettingsV2: GoogleSettingsV2.optional(),
  haloSettings: HaloSettings.optional(),
  immixSettings: ImmixSettings.optional(),
  intuifaceSettings: IntuifaceSettings.optional(),
  kisiSettings: KisiSettings.optional(),
  lumeoSettings: LumeoSettings.optional(),
  mattermostSettings: MattermostSettings.optional(),
  microsoftTeamsSettings: MicrosoftTeamsSettings.optional(),
  noonlightSettings: NoonlightSettings.optional(),
  office365Settings: Office365Settings.optional(),
  openpathSettings: OpenpathSettings.optional(),
  opentechAllianceSettings: OpentechAllianceSettings.optional(),
  orgUuid: z.string().optional(),
  pagerDutySettings: PagerDutySettings.optional(),
  placeOsSettings: PlaceOsSettings.optional(),
  proDataKeySettings: ProDataKeySettings.optional(),
  saltoSettings: SaltoSettings.optional(),
  serviceNowSettings: ServiceNowSettings.optional(),
  slackSettings: SlackSettings.optional(),
  slackSettingsV2: SlackSettingsV2.optional(),
  squareSettings: SquareSettings.optional(),
  toastSettings: ToastSettings.optional(),
  tpLinkSettings: TPLinkSettings.optional(),
  twilioSettings: TwilioSettings.optional(),
  webhookSettings: WebhookSettings.optional()
});
const Integration_GetOrgIntegrationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  orgIntegrations: OrgIntegrationsType.optional()
});
const Integration_GetPartnerApiTokensWSRequest = z.record(z.unknown());
const Integration_GetPdkDoorsWSRequest: z.ZodObject<any> = z.object({
  ouId: z.string().optional()
});
const Integration_GetPdkDoorsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  panelList: z.array(PanelType).optional()
});
const Integration_GetPdkSystemIdWSRequest: z.ZodObject<any> = z.object({
  configurationToken: z.string().optional()
});
const Integration_GetPdkSystemIdWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  systemId: z.string().optional()
});
const Integration_GetPlaceOsDoorsWSRequest: z.ZodObject<any> = z.object({
  apiUrl: z.string().optional()
});
const RaptorBuilding: z.ZodObject<any> = z.object({
  name: z.string().optional(),
  uid: z.string().optional()
});
const Integration_GetRaptorBuildingsWSResponse: z.ZodObject<any> = z.object({
  buildings: z.array(RaptorBuilding).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const RaptorTemplate: z.ZodObject<any> = z.object({
  name: z.string().optional(),
  uId: z.string().optional(),
  uid: z.string().optional()
});
const Integration_GetRaptorTemplatesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  templates: z.array(RaptorTemplate).optional()
});
const Integration_GetToastEventsTableAllLocationsWSRequest: z.ZodObject<any> = z.object({
  businessDate: z.string().optional()
});
const Integration_GetToastEventsTableWSResponse_EventTableRow: z.ZodObject<any> = z.object({
  assignedCameraList: z.array(z.string()).optional(),
  employeeName: z.string().optional(),
  orderGuid: z.string().optional(),
  paymentType: z.string().optional(),
  restaurantName: z.string().optional(),
  revenueCenterName: z.string().optional(),
  serviceAreaName: z.string().optional(),
  timestamp: z.string().optional(),
  tipAmount: z.string().optional(),
  totalAmount: z.string().optional(),
  totalDiscountAmount: z.string().optional(),
  voided: z.string().optional()
});
const Integration_GetToastEventsTableAllLocationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  eventTable: z.array(Integration_GetToastEventsTableWSResponse_EventTableRow).optional(),
  failedGuids: z.array(z.string()).optional()
});
const Integration_GetToastEventsTableWSRequest: z.ZodObject<any> = z.object({
  businessDate: z.string().optional(),
  restaurantGuid: z.string().optional()
});
const Integration_GetToastEventsTableWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  eventTable: z.array(Integration_GetToastEventsTableWSResponse_EventTableRow).optional()
});
const Integration_GetToastServiceAreasWSRequest: z.ZodObject<any> = z.object({
  restaurantGuid: z.string().optional()
});
const Integration_GetToastServiceAreasWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  serviceAreas: z.array(GenericPosType).optional()
});
const Integration_GuestWSRequest: z.ZodObject<any> = z.object({
  email: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_InitiateBrivoOAuthWSRequest: z.ZodObject<any> = z.object({
  apiKey: z.string().optional(),
  param: z.string().optional(),
  requestUrl: z.string().optional(),
  rhombusOrgUserUuid: z.string().optional()
});
const Integration_InitiateCallbackAuthRequest: z.ZodObject<any> = z.object({
  rhombusOrgUserUuid: z.string().optional()
});
const Integration_InitiateCallbackAuthResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  integratorUrl: z.string().optional()
});
const Integration_InitiateOAuthWSRequest: z.ZodObject<any> = z.object({
  param: z.string().optional(),
  requestUrl: z.string().optional(),
  rhombusOrgUserUuid: z.string().optional()
});
const Integration_InitiateOAuthWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  redirectUrl: z.string().optional()
});
const Integration_RefreshGoogleAccessTokenWSRequest: z.ZodObject<any> = z.object({
  refreshUserToken: z.boolean().optional()
});
const Integration_RefreshGoogleAccessTokenWSResponse: z.ZodObject<any> = z.object({
  accessToken: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_RevokeApiTokenWSRequest: z.ZodObject<any> = z.object({
  tokenUuid: z.string().optional()
});
const Integration_RevokeApiTokenWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_RevokeGoogleDriveAccessWSRequest: z.ZodObject<any> = z.object({
  revokeUserAccount: z.boolean().optional()
});
const Integration_SubmitApiTokenApplicationWSRequest: z.ZodObject<any> = z.object({
  authType: ApiTokenAuthTypeEnum.optional(),
  csr: z.string().optional(),
  displayName: z.string().optional(),
  permissionGroupUuid: z.string()
});
const Integration_SubmitApiTokenApplicationWSResponse: z.ZodObject<any> = z.object({
  apiKey: z.string().optional(),
  cert: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  validCSR: z.boolean().optional()
});
const ZapierEnum = z.string();
const Integration_SubscribeZapierWebhookWSRequest: z.ZodObject<any> = z.object({
  backoffSec: z.number().int().optional(),
  doorState: z.string().optional(),
  hookUrl: z.string().optional(),
  humidityLowerThreshold: z.number().optional(),
  humidityUpperThreshold: z.number().optional(),
  tempLowerThreshold: z.number().optional(),
  tempUpperThreshold: z.number().optional(),
  uuids: z.array(z.string()).optional(),
  zapEnum: ZapierEnum.optional()
});
const Integration_SubscribeZapierWebhookWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  webhookId: z.string().optional()
});
const Integration_TogglePowerWSRequest: z.ZodObject<any> = z.object({
  deviceId: z.string().optional(),
  targetState: z.number().int().optional()
});
const Integration_TogglePowerWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  newState: z.number().int().optional()
});
const Integration_UnlockDoorWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_UnlockGeneaDoorWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  doorId: z.string().optional()
});
const Integration_UnlockIntegrationGenericDoorWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  doorId: z.string().optional()
});
const Integration_UnlockKisiDoorWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  doorId: z.number().int().optional(),
  placeId: z.number().int().optional()
});
const Integration_UnlockOpenpathDoorWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  doorId: z.number().int().optional()
});
const Integration_UnsubscribeZapierWebhookWSRequest: z.ZodObject<any> = z.object({
  webhookId: z.string().optional()
});
const Integration_UpdateAmtIntegrationWSRequest: z.ZodObject<any> = z.object({
  amtSettings: AmtSettings.optional()
});
const Integration_UpdateAperioIntegrationWSRequest: z.ZodObject<any> = z.object({
  aperioSettings: IAperioType
});
const Integration_UpdateApiTokenWSRequest: z.ZodObject<any> = z.object({
  newDisplayName: z.string().optional(),
  newPermissionGroupUuid: z.string().optional(),
  tokenUuid: z.string().optional()
});
const Integration_UpdateApiTokenWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_UpdateAvigilonAltaV2WSRequest: z.ZodObject<any> = z.object({
  avigilonAltaSettings: IAvigilonAltaType.optional()
});
const Integration_UpdateAwsIntegrationWSRequest: z.ZodObject<any> = z.object({
  awsSettings: AwsSettings.optional()
});
const Integration_UpdateBoxIntegrationWSRequest: z.ZodObject<any> = z.object({
  boxSettings: BoxSettings.optional()
});
const Integration_UpdateBrivoIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  brivoSettings: IBrivoType.optional()
});
const Integration_UpdateBrivoIntegrationWSRequest: z.ZodObject<any> = z.object({
  brivoSettings: BrivoSettings.optional()
});
const Integration_UpdateButterflymxIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  butterflymxSettings: IButterflyMXType.optional()
});
const Integration_UpdateButterflymxIntegrationWSRequest: z.ZodObject<any> = z.object({
  settings: ButterflyMXSettings.optional()
});
const Integration_UpdateDeviceIntegrationWSRequest: z.ZodObject<any> = z.object({
  createNewDevice: z.boolean().optional(),
  deviceIntegrationSettings: IDeviceIntegrationType.optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  updateDevice: z.boolean().optional(),
  updateDeviceUuid: z.string().optional()
});
const Integration_UpdateDiceIntegrationWSRequest: z.ZodObject<any> = z.object({
  diceSettings: IDiceType.optional()
});
const Integration_UpdateDropboxIntegrationWSRequest: z.ZodObject<any> = z.object({
  dropboxSettings: DropboxSettingsV2.optional()
});
const Integration_UpdateEmailIntegrationWSRequest: z.ZodObject<any> = z.object({
  emailSettings: EmailSettings.optional()
});
const Integration_UpdateEnvoyIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  envoySettings: IEnvoyType.optional()
});
const Integration_UpdateEnvoyIntegrationWSRequest: z.ZodObject<any> = z.object({
  envoySettings: EnvoySettings.optional()
});
const Integration_UpdateFlicIntegrationWSRequest: z.ZodObject<any> = z.object({
  flicSettings: IFlicType.optional()
});
const Integration_UpdateGeneaIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  geneaSettings: IGeneaType.optional()
});
const Integration_UpdateGeneaIntegrationWSRequest: z.ZodObject<any> = z.object({
  geneaSettings: GeneaSettings.optional()
});
const Integration_UpdateGoogleIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  googleSettings: IGoogleType.optional()
});
const Integration_UpdateGoogleIntegrationWSRequest: z.ZodObject<any> = z.object({
  googleSettings: GoogleSettings.optional()
});
const Integration_UpdateGuestByTokenWSRequest: z.ZodObject<any> = z.object({
  fileName: z.string().optional(),
  guest: Guest.optional(),
  token: z.string().optional()
});
const Integration_UpdateGuestManagementIntegrationWSRequest: z.ZodObject<any> = z.object({
  guestManagementSettings: IGuestManagementType.optional()
});
const Integration_UpdateGuestWSRequest: z.ZodObject<any> = z.object({
  fileName: z.string().optional(),
  guest: Guest.optional(),
  sendGuestEmail: z.boolean().optional()
});
const Integration_UpdateHaloIntegrationWSRequest: z.ZodObject<any> = z.object({
  haloSettings: HaloSettings.optional()
});
const Integration_UpdateInformacastIntegrationRequest: z.ZodObject<any> = z.object({
  informacastSettings: IInformacastType.optional()
});
const Integration_UpdateInnerRangeIntegrationWSRequest: z.ZodObject<any> = z.object({
  innerRangeSettings: IInnerRangeType.optional()
});
const Integration_UpdateIntuifaceIntegrationWSRequest: z.ZodObject<any> = z.object({
  settings: IntuifaceSettings.optional()
});
const Integration_UpdateKisiIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  kisiSettings: IKisiType.optional()
});
const Integration_UpdateKisiIntegrationWSRequest: z.ZodObject<any> = z.object({
  kisiSettings: KisiSettings.optional()
});
const Integration_UpdateLumeoIntegrationWSRequest: z.ZodObject<any> = z.object({
  lumeoSettings: ILumeoType.optional()
});
const Integration_UpdateMattermostIntegrationWSRequest: z.ZodObject<any> = z.object({
  mattermostSettings: MattermostSettings.optional()
});
const Integration_UpdateMicrosoftTeamsBotForTeamWSRequest: z.ZodObject<any> = z.object({
  teamId: z.string().optional()
});
const Integration_UpdateMicrosoftTeamsIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  microsoftTeamsSettings: IMicrosoftTeamsType.optional(),
  teamsToUpdate: z.array(z.string()).optional()
});
const Integration_UpdateMicrosoftTeamsIntegrationWSRequest: z.ZodObject<any> = z.object({
  microsoftTeamsSettings: MicrosoftTeamsSettings.optional()
});
const Integration_UpdateNineOneOneCellularIntegrationWSRequest: z.ZodObject<any> = z.object({
  nineOneOneCellularSettings: INineOneOneCellularType.optional()
});
const Integration_UpdateNoonlightSettingsWSRequest: z.ZodObject<any> = z.object({
  noonlightSettings: NoonlightSettings.optional()
});
const Integration_UpdateOffice365IntegrationWSRequest: z.ZodObject<any> = z.object({
  office365Settings: Office365Settings.optional()
});
const Integration_UpdateOmnialertIntegrationWSRequest: z.ZodObject<any> = z.object({
  omnialertSettings: IOmnialertType.optional()
});
const Integration_UpdateOmnialertIntegrationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  webhookToken: z.string().optional()
});
const Integration_UpdateOpenAIIntegrationRequest: z.ZodObject<any> = z.object({
  openAISettings: IOpenAIType.optional()
});
const Integration_UpdateOpenpathIntegrationWSRequest: z.ZodObject<any> = z.object({
  openpathSettings: OpenpathSettings.optional()
});
const Integration_UpdateOpentechAllianceIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  opentechAllianceSettings: IOpentechAllianceType.optional()
});
const Integration_UpdateOpentechAllianceIntegrationWSRequest: z.ZodObject<any> = z.object({
  opentechAllianceSettings: OpentechAllianceSettings.optional()
});
const Integration_UpdateOrgIntegrationsWSResponse: z.ZodObject<any> = z.object({
  authError: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedGuids: z.array(z.string()).optional(),
  misconfiguredDoors: z.array(z.string()).optional()
});
const Integration_UpdatePagerDutyIntegrationWSRequest: z.ZodObject<any> = z.object({
  pagerDutySettings: PagerDutySettings.optional()
});
const Integration_UpdatePdkIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  pdkSettings: IProDataKeyType.optional()
});
const Integration_UpdatePdkIntegrationWSRequest: z.ZodObject<any> = z.object({
  pdkSettings: ProDataKeySettings.optional()
});
const Integration_UpdatePimlocIntegrationRequest: z.ZodObject<any> = z.object({
  pimlocSettings: IPimlocType.optional()
});
const Integration_UpdatePlaceOsSettingsV2WSRequest: z.ZodObject<any> = z.object({
  placeOsSettings: IPlaceOsType.optional()
});
const Integration_UpdatePlaceOsSettingsWSRequest: z.ZodObject<any> = z.object({
  placeOsSettings: PlaceOsSettings.optional()
});
const Integration_UpdateRaptorIntegrationRequest: z.ZodObject<any> = z.object({
  raptorSettings: IRaptorType.optional()
});
const Integration_UpdateServiceNowIntegrationWSRequest: z.ZodObject<any> = z.object({
  serviceNowSettings: ServiceNowSettings.optional()
});
const Integration_UpdateShellyIntegrationWSRequest: z.ZodObject<any> = z.object({
  shellySettings: IShellyType.optional()
});
const Integration_UpdateSlackIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  adminRequest: z.boolean().optional(),
  requestUrl: z.string(),
  revokeUserAccessToken: z.boolean().optional(),
  rhombusOrgUserUuid: z.string().optional(),
  slackSettingsV2: SlackSettingsV2.optional(),
  userAssociate: z.boolean().optional(),
  userRequest: z.boolean().optional()
});
const Integration_UpdateSlackIntegrationWSRequest: z.ZodObject<any> = z.object({
  slackSettings: SlackSettings.optional()
});
const Integration_UpdateToastIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  restaurantGuids: z.array(z.string()).optional(),
  toastSettings: IToastType.optional()
});
const Integration_UpdateToastIntegrationWSRequest: z.ZodObject<any> = z.object({
  toastSettings: ToastSettings.optional()
});
const Integration_UpdateWebhookIntegrationV2WSRequest: z.ZodObject<any> = z.object({
  disabled: z.boolean().optional(),
  isDiagnostic: z.boolean().optional(),
  updatedWebhookSettings: IWebhooksType.optional(),
  webhookUrl: z.string().optional()
});
const Integration_UpdateWebhookIntegrationV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  webhookSecret: z.string().optional()
});
const Integration_UpdateWebhookIntegrationWSRequest: z.ZodObject<any> = z.object({
  webhookSettings: WebhookSettings.optional()
});
const Integration_ValidateKisiApiKeyWSRequest: z.ZodObject<any> = z.object({
  apiKey: z.string().optional()
});
const Integration_aperio_ClearAperioDtcWSRequest: z.ZodObject<any> = z.object({
  aperioDeviceId: z.string(),
  aperioGatewayId: z.string(),
  controllerUuid: z.string(),
  registeredComponentUuid: z.string().optional()
});
const Integration_aperio_ClearAperioDtcWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Integration_aperio_DownloadCertificateWSRequest: z.ZodObject<any> = z.object({
  ownerDeviceUuid: z.string()
});
const Integration_aperio_RebootAperioGatewayWSRequest: z.ZodObject<any> = z.object({
  aperioGatewayId: z.string(),
  controllerUuid: z.string()
});
const Integration_aperio_RebootAperioGatewayWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Internal_AccessControlDoorOnlyWSRequest: z.ZodObject<any> = z.object({
  accountDataMap: z.record(z.unknown()).optional()
});
const Internal_AccessControlDoorOnlyWSRequest_AccountData: z.ZodObject<any> = z.object({
  opportunityIds: z.array(z.string()).optional(),
  orgUuid: z.string().optional()
});
const Internal_AccessControlDoorOnlyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedAccounts: z.record(z.unknown()).optional(),
  successfulAccounts: z.array(z.string()).optional()
});
const Internal_AddPartnerAsSuperAdminWSRequest: z.ZodObject<any> = z.object({
  loginAccessAllowed: z.boolean().optional(),
  orgUuid: z.string().optional(),
  partnerEmail: z.string().optional(),
  partnerName: z.string().optional(),
  partnerUuid: z.string().optional()
});
const Internal_AddPartnerAsSuperAdminWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  superAdminGroupUuid: z.string().optional()
});
const Internal_AlarmMonitoringOnlyWSRequest: z.ZodObject<any> = z.object({
  accountDataMap: z.record(z.unknown()).optional()
});
const Internal_AlarmMonitoringOnlyWSRequest_AccountData: z.ZodObject<any> = z.object({
  opportunityIds: z.array(z.string()).optional(),
  orgUuid: z.string().optional()
});
const Internal_AlarmMonitoringOnlyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedAccounts: z.record(z.unknown()).optional(),
  successfulAccounts: z.array(z.string()).optional()
});
const Internal_CreateCombinedLicensesFromV1WSRequest: z.ZodObject<any> = z.object({
  accountDataMap: z.record(z.unknown()).optional()
});
const Internal_CreateCombinedLicensesFromV1WSRequest_AccountData: z.ZodObject<any> = z.object({
  opportunityIds: z.array(z.string()).optional(),
  orgUuid: z.string().optional()
});
const Internal_CreateCombinedLicensesFromV1WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedAccounts: z.record(z.unknown()).optional(),
  successfulAccounts: z.array(z.string()).optional()
});
const Internal_CreateOrgWSRequest: z.ZodObject<any> = z.object({
  accountOwnerEmail: z.string().optional(),
  accountOwnerName: z.string().optional(),
  companyName: z.string().optional(),
  developmentPartnerOrg: z.boolean().optional(),
  licenseEntitlementEnabled: z.boolean().optional(),
  salesforceId: z.string().optional(),
  sendWelcomeEmail: z.boolean().optional()
});
const Internal_CreateOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  orgUuid: z.string().optional()
});
const Internal_CreatePartnerOrgWSRequest: z.ZodObject<any> = z.object({
  accountOwnerEmail: z.string().optional(),
  accountOwnerName: z.string().optional(),
  companyName: z.string().optional(),
  salesforceId: z.string().optional(),
  sendWelcomeEmail: z.boolean().optional()
});
const Internal_CreatePartnerOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  orgUuid: z.string().optional()
});
const Internal_CreateReturnedInventoryAuditReservationWSRequest: z.ZodObject<any> = z.object({
  clientOrgUuid: z.string().optional(),
  miscNotes: z.string().optional(),
  partnerOrgUuid: z.string().optional(),
  returnType: z.string().optional(),
  salesforceOppId: z.string().optional(),
  trackingNumber: z.string().optional()
});
const Internal_CreateReturnedInventoryAuditReservationWSResponse: z.ZodObject<any> = z.object({
  auditReservationUuid: z.string().optional(),
  auditReservationUuids: z.array(z.string()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const SupportAuthorityType: z.ZodObject<any> = z.object({
  authorityType: z.string().optional(),
  authorityUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  expirationTimestamp: z.number().int().optional(),
  grantedByUsername: z.string().optional(),
  grantedToEmail: z.string().optional(),
  grantedToInternalEntityUuid: z.string().optional(),
  grantedToName: z.string().optional(),
  loginAccessAllowed: z.boolean().optional(),
  managedByMsp: z.boolean().optional(),
  orgUuid: z.string().optional(),
  permissionGroupUuid: z.string().optional()
});
const Internal_CreateSupportAuthorityWSRequest: z.ZodObject<any> = z.object({
  supportAuthority: SupportAuthorityType.optional()
});
const Internal_CreateSupportAuthorityWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  supportAuthorityUuid: z.string().optional()
});
const Internal_DeveloperNewsletterEnrollWSRequest: z.ZodObject<any> = z.object({
  developerNewsletter: z.boolean().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  isDeveloper: z.boolean().optional(),
  lastName: z.string().optional(),
  orgName: z.string().optional()
});
const Internal_DeveloperNewsletterEnrollWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Internal_EntDevicesOnlyWSRequest: z.ZodObject<any> = z.object({
  accountDataMap: z.record(z.unknown()).optional()
});
const Internal_EntDevicesOnlyWSRequest_AccountData: z.ZodObject<any> = z.object({
  opportunityIds: z.array(z.string()).optional(),
  orgUuid: z.string().optional()
});
const Internal_EntDevicesOnlyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedAccounts: z.record(z.unknown()).optional(),
  successfulAccounts: z.array(z.string()).optional()
});
const Internal_GetSuperAdminGroupUUIDWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const Internal_GetSuperAdminGroupUUIDWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  superAdminGroupUUID: z.string().optional()
});
const Internal_GetWarrantyApprovedRMAsWSRequest = z.record(z.unknown());
const Internal_GetWarrantyApprovedRMAsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  zendeskTickets: z.array(z.number().int()).optional()
});
const RhombusShipmentInfoType: z.ZodObject<any> = z.object({
  additionalEmails: z.string().optional(),
  chosenCarrierName: z.string().optional(),
  claimKeyToLicenseMap: z.record(z.unknown()).optional(),
  claimKeyToLicenseMapV2: z.record(z.unknown()).optional(),
  customerEmails: z.string().optional(),
  customerName: z.string().optional(),
  orgUuid: z.string().optional(),
  partnerOrgUuid: z.string().optional(),
  purchaseOrderNumber: z.string().optional(),
  rmaReturnTrackingNumber: z.string().optional(),
  rmaUuid: z.string().optional(),
  rmaUuids: z.array(z.string()).optional(),
  salesForceOpportunityId: z.string().optional(),
  zendeskTicketNumber: z.string().optional()
});
const Product: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  productId: z.string().optional(),
  productIdQualifier: z.string().optional(),
  quantity: z.number().int().optional()
});
const Shipment: z.ZodObject<any> = z.object({
  methodOfPaymentCode: z.string().optional(),
  notes: z.array(z.string()).optional(),
  serviceLevel: z.string().optional(),
  shipDateMs: z.number().int().optional(),
  shippingMethod: z.string().optional()
});
const Shipper: z.ZodObject<any> = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  referenceId: z.string().optional(),
  state: z.string().optional()
});
const OutgoingShipmentInfoType: z.ZodObject<any> = z.object({
  buyer: Buyer.optional(),
  consignee: Consignee.optional(),
  depositorOrderNumber: z.string().optional(),
  freight: Freight.optional(),
  interchangeControlNumber: z.string().optional(),
  product: z.array(Product).optional(),
  purchaseOrderNumber: z.string().optional(),
  shipment: Shipment.optional(),
  shipper: Shipper.optional()
});
const Internal_InitiateShipmentWSRequest: z.ZodObject<any> = z.object({
  rhombusShipmentInfo: RhombusShipmentInfoType.optional(),
  salesforceOppId: z.string().optional(),
  shipmentCategory: z.string().optional(),
  shipmentInfo: OutgoingShipmentInfoType.optional()
});
const Internal_ListOrgsWSRequest = z.record(z.unknown());
const PlayerViewLiveTypeEnum = z.string();
const UAPSettingsType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional(),
  text: z.string().optional()
});
const OrgV2Type: z.ZodObject<any> = z.object({
  accountBillingContactEmail: z.string().optional(),
  accountOwnerEmail: z.string().optional(),
  accountTechnicalContactEmail: z.string().optional(),
  accountTechnicalContacts: z.array(z.string()).optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  audioAnalysisEnabled: z.boolean().optional(),
  audioRecordingEnabled: z.boolean().optional(),
  bandwidthReportsDisabled: z.boolean().optional(),
  companyLogoUrl: z.string().optional(),
  companyLogoUuid: z.string().optional(),
  countryCode: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  criticalStatusEnabled: z.boolean().optional(),
  defaultPlayerViewLiveType: PlayerViewLiveTypeEnum.optional(),
  deleted: z.boolean().optional(),
  deletedAtMillis: z.number().int().optional(),
  developmentPartnerOrg: z.boolean().optional(),
  firmwareUpdateSettings: FirmwareUpdateSettingsType.optional(),
  firmwareUpdateSettingsOverrides: z.array(FirmwareUpdateSettingsOverrideType).optional(),
  inactivityTimeout: z.number().int().optional(),
  itemizedInvoice: z.boolean().optional(),
  keypadLogoUrl: z.string().optional(),
  keypadLogoUuid: z.string().optional(),
  llmUsageEnabled: z.boolean().optional(),
  maxAllowedSegmentMaxBytesMap: z.record(z.unknown()).optional(),
  mfaEnabled: z.boolean().optional(),
  motionGridDisabled: z.boolean().optional(),
  motionLightweightDisabled: z.boolean().optional(),
  name: z.string().optional(),
  newCameraFramerateMap: z.record(z.unknown()).optional(),
  newCameraResolutionMap: z.record(z.unknown()).optional(),
  newCameraSegmentMaxBytesMap: z.record(z.unknown()).optional(),
  newCameraVideoTargetQualityMap: z.record(z.unknown()).optional(),
  newCameraZeroMotionVideoQualityMap: z.record(z.unknown()).optional(),
  notifyForHardwareFailureTickets: z.boolean().optional(),
  partnerAccessAllowedUntil: z.number().int().optional(),
  postalCode: z.string().optional(),
  rhombusKeyLogoUrl: z.string().optional(),
  rhombusKeyLogoUuid: z.string().optional(),
  salesforceAccountId: z.string().optional(),
  shareAiTrainingMediaWithRhombus: z.boolean().optional(),
  subscriptionEndDate: z.number().int().optional(),
  subscriptionStatus: z.string().optional(),
  subscriptionType: z.string().optional(),
  supportAccessAllowedUntil: z.number().int().optional(),
  tenantUrl: z.string().optional(),
  thumbstripDisabled: z.boolean().optional(),
  type: z.string().optional(),
  uapSettings: UAPSettingsType.optional(),
  uuid: z.string().optional(),
  v3AuthNumDaysSkip2FAForTrustedDevices: z.number().int().optional()
});
const Internal_ListOrgsWSResponse: z.ZodObject<any> = z.object({
  orgs: z.array(OrgV2Type).optional()
});
const Internal_ParentLifetimeSpendWSRequest: z.ZodObject<any> = z.object({
  endAccountIdx: z.number().int().optional(),
  startAccountIdx: z.number().int().optional()
});
const Internal_ParentLifetimeSpendWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Internal_ProDevicesOnlyWSRequest: z.ZodObject<any> = z.object({
  accountDataMap: z.record(z.unknown()).optional()
});
const Internal_ProDevicesOnlyWSRequest_AccountData: z.ZodObject<any> = z.object({
  opportunityIds: z.array(z.string()).optional(),
  orgUuid: z.string().optional()
});
const Internal_ProDevicesOnlyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failedAccounts: z.record(z.unknown()).optional(),
  successfulAccounts: z.array(z.string()).optional()
});
const Internal_RequestHardwareForDevelopmentWSRequest: z.ZodObject<any> = z.object({
  address1: z.string().optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  country: z.string().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  jobTitle: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  requestReason: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional()
});
const Internal_RequestHardwareForDevelopmentWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Internal_SendShipmentShippedEmailWSRequest: z.ZodObject<any> = z.object({
  salesforceOppId: z.string().optional()
});
const Internal_SetOpportunityForPurchaseOrderWSRequest: z.ZodObject<any> = z.object({
  cancellationReason: z.string().optional(),
  isAccepted: z.boolean().optional(),
  purchaseOrderNumber: z.string().optional(),
  purchaseOrderUuid: z.string().optional(),
  salesforceOppId: z.string().optional()
});
const Internal_SetOpportunityForPurchaseOrderWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Internal_ShipmentEmailWSResponse: z.ZodObject<any> = z.object({
  customerShipmentEmailState: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  legacyMsg: z.string().optional(),
  trackingIdentifier: z.string().optional()
});
const Internal_VerifyCanMigrateOrgFromV1WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  invalidOrgsToErrorMessages: z.record(z.unknown()).optional()
});
const LicenseInvoiceSubItem: z.ZodObject<any> = z.object({
  count: z.number().int().optional(),
  description: z.string().optional(),
  license: License.optional(),
  price: z.number().optional()
});
const InvoiceType: z.ZodObject<any> = z.object({
  addOnLicenseInvoices: z.array(AddOnLicenseInvoiceType).optional(),
  additionalEmails: z.array(z.string()).optional(),
  attachCsv: z.boolean().optional(),
  cameraPurchaseCount: z.number().int().optional(),
  cameraPurchasePrice: z.number().optional(),
  clientOrgUuid: z.string().optional(),
  companyName: z.string().optional(),
  customerAddress: z.string().optional(),
  customerEmail: z.string().optional(),
  customerName: z.string().optional(),
  date: z.number().int().optional(),
  domePurchaseCount: z.number().int().optional(),
  domePurchasePrice: z.number().optional(),
  domeSubItems: z.array(HardwareInvoiceSubItem).optional(),
  dueDate: z.number().int().optional(),
  externalId: z.string().optional(),
  installationPrice: z.number().optional(),
  license: License.optional(),
  licenseCount: z.number().int().optional(),
  licensePrice: z.number().optional(),
  licenseSubItems: z.array(LicenseInvoiceSubItem).optional(),
  notes: z.string().optional(),
  partnerOrgUuid: z.string().optional(),
  r1Camera1024: z.array(HardwareInvoiceSubItem).optional(),
  r1Camera512: z.array(HardwareInvoiceSubItem).optional(),
  r1CameraPurchaseCount: z.number().int().optional(),
  r1CameraPurchasePrice: z.number().optional(),
  r1CameraSubItems: z.array(HardwareInvoiceSubItem).optional(),
  r1LargeCameraPurchaseCount: z.number().int().optional(),
  r1LargeCameraPurchasePrice: z.number().optional(),
  r1LargeSubItems: z.array(HardwareInvoiceSubItem).optional(),
  r1MediumSubItems: z.array(HardwareInvoiceSubItem).optional(),
  salespersonName: z.string().optional(),
  shippingPrice: z.number().optional(),
  status: z.string().optional(),
  tax: z.number().optional(),
  uuid: z.string().optional()
});
const Invoice_InvoiceChargeWSRequest: z.ZodObject<any> = z.object({
  invoiceUuid: z.string().optional(),
  sourceToken: z.string().optional()
});
const Invoice_InvoiceChargeWSResponse: z.ZodObject<any> = z.object({
  chargeSucceeded: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMessage: z.string().optional(),
  errorMsg: z.string().optional(),
  previouslyInitialized: z.boolean().optional()
});
const Invoice_InvoiceV1LineItemType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  family: z.string().optional(),
  name: z.string().optional(),
  productCode: z.string().optional(),
  quantity: z.number().optional(),
  subtotal: z.number().optional(),
  unitPrice: z.number().optional()
});
const Invoice_InvoiceV1Type: z.ZodObject<any> = z.object({
  billingContactEmail: z.string().optional(),
  billingContactMailingCity: z.string().optional(),
  billingContactMailingCountry: z.string().optional(),
  billingContactMailingPostalCode: z.string().optional(),
  billingContactMailingState: z.string().optional(),
  billingContactMailingStreet: z.string().optional(),
  billingContactName: z.string().optional(),
  companyName: z.string().optional(),
  dueDate: z.string().optional(),
  grandTotal: z.number().optional(),
  invoiceDate: z.string().optional(),
  invoiceNumber: z.string().optional(),
  lineItems: z.array(Invoice_InvoiceV1LineItemType).optional(),
  notes: z.string().optional(),
  partnerBillingCity: z.string().optional(),
  partnerBillingCountry: z.string().optional(),
  partnerBillingPostalCode: z.string().optional(),
  partnerBillingState: z.string().optional(),
  partnerBillingStreet: z.string().optional(),
  partnerName: z.string().optional(),
  salespersonName: z.string().optional(),
  shipping: z.number().optional(),
  status: z.string().optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  uuid: z.string().optional()
});
const Invoice_InvoiceDetailsV1WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  invoice: Invoice_InvoiceV1Type.optional()
});
const Invoice_InvoiceDetailsV2WSRequest: z.ZodObject<any> = z.object({
  netsuiteInvoiceUuid: z.string().optional()
});
const LineItems: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  productCode: z.string().optional(),
  productcode: z.string().optional(),
  quantity: z.number().optional(),
  subtotal: z.number().optional(),
  unitPrice: z.number().optional(),
  unitprice: z.number().optional()
});
const NetsuiteInvoiceDetails: z.ZodObject<any> = z.object({
  billingContactEmail: z.string().optional(),
  billingContactName: z.string().optional(),
  billingcontactemail: z.string().optional(),
  billingcontactname: z.string().optional(),
  clientOrgName: z.string().optional(),
  clientorgname: z.string().optional(),
  dueDate: z.string().optional(),
  duedate: z.string().optional(),
  invoiceDate: z.string().optional(),
  invoiceUuid: z.string().optional(),
  invoicedate: z.string().optional(),
  invoiceuuid: z.string().optional(),
  lineItems: z.array(LineItems).optional(),
  lineitems: z.array(LineItems).optional(),
  partnerOrgName: z.string().optional(),
  partnerorgname: z.string().optional(),
  status: z.string().optional(),
  totalBalance: z.number().optional(),
  totalbalance: z.number().optional(),
  transactionId: z.string().optional(),
  transactionid: z.string().optional(),
  unpaidBalance: z.number().optional(),
  unpaidbalance: z.number().optional()
});
const Invoice_InvoiceDetailsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  invoice: NetsuiteInvoiceDetails.optional()
});
const Invoice_InvoiceDetailsWSRequest: z.ZodObject<any> = z.object({
  invoiceUuid: z.string().optional()
});
const Invoice_InvoiceDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  invoice: InvoiceType.optional()
});
const KeypadCommand = z.string();
const KeypadConfigType: z.ZodObject<any> = z.object({
  armCountdownSecs: z.number().int().optional(),
  buildingAdminPhoneNumber: z.string().optional(),
  connectionState: z.string().optional(),
  floorNumber: z.number().int().optional(),
  lastModified: z.number().int().optional(),
  latitude: z.number().optional(),
  locationName: z.string().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  qualifiedAddress: QualifiedAddressType.optional(),
  showCallBuildingAdmin: z.boolean().optional(),
  signalStrength: z.number().int().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  tz: z.string().optional(),
  uuid: z.string().optional(),
  videoWallUuid: z.string().optional()
});
const Keypad_AuthenticatePinRequest: z.ZodObject<any> = z.object({
  pin: z.string().optional()
});
const Keypad_AuthenticatePinResponse: z.ZodObject<any> = z.object({
  authenticated: z.boolean().optional()
});
const Keypad_ClaimKeypadActivationTokenRequest: z.ZodObject<any> = z.object({
  activationToken: z.string().optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional()
});
const Keypad_ClaimKeypadActivationTokenResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Keypad_GetCurrentKeypadWSRequest = z.record(z.unknown());
const Keypad_GetCurrentKeypadWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  keypad: KeypadConfigType.optional()
});
const Keypad_GetKeypadsForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Keypad_GetKeypadsForLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  keypads: z.array(KeypadConfigType).optional()
});
const Keypad_GetKeypadsForOrgWSRequest = z.record(z.unknown());
const Keypad_GetKeypadsForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  keypads: z.array(KeypadConfigType).optional()
});
const Keypad_KeypadCheckinWSRequest: z.ZodObject<any> = z.object({
  signalStrength: z.number().int().optional()
});
const Keypad_KeypadCheckinWSResponse = z.record(z.unknown());
const Keypad_PublishKeypadCommandWSRequest: z.ZodObject<any> = z.object({
  command: KeypadCommand,
  executeAtMs: z.number().int().optional()
});
const Keypad_UnregisterKeypadRequest: z.ZodObject<any> = z.object({
  keypadUuid: z.string().optional()
});
const Keypad_UnregisterKeypadResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Keypad_UpdateKeypadRequest: z.ZodObject<any> = z.object({
  armCountdownSecs: z.number().int().optional(),
  buildingAdminPhoneNumber: z.string().optional(),
  floorNumber: z.number().int().optional(),
  keypadUuid: z.string().optional(),
  latitude: z.number().optional(),
  locationName: z.string().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  qualifiedAddress: QualifiedAddressType.optional(),
  showCallBuildingAdmin: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  timeZoneId: z.string().optional(),
  videoWallUuid: z.string().optional()
});
const Keypad_UpdateKeypadResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const KioskSelectiveUpdate: z.ZodObject<any> = z.object({
  batteryLevel: z.number().optional(),
  connectionStatus: z.string().optional(),
  deleted: z.boolean().optional(),
  lastUpdateTimeMs: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  printerIP: z.string().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  uuid: z.string().optional()
});
const Kiosk_ClaimKioskActivationTokenRequest: z.ZodObject<any> = z.object({
  activationToken: z.string().optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  permissionGroupUuid: z.string().optional()
});
const Kiosk_ClaimKioskActivationTokenResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Kiosk_DeleteKioskWSRequest: z.ZodObject<any> = z.object({
  kioskUuid: z.string().optional()
});
const Kiosk_DeleteKioskWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Kiosk_GetCurrentKioskWSRequest = z.record(z.unknown());
const Kiosk_KioskWithInfo: z.ZodObject<any> = z.object({
  batteryLevel: z.number().optional(),
  connectionStatus: z.string().optional(),
  deleted: z.boolean().optional(),
  lastUpdateTimeMs: z.number().int().optional(),
  latitude: z.number().optional(),
  locationName: z.string().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  printerIP: z.string().optional(),
  uuid: z.string().optional()
});
const Kiosk_GetCurrentKioskWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  kiosk: Kiosk_KioskWithInfo.optional()
});
const Kiosk_GetKiosksForLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Kiosk_GetKiosksForLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  kiosks: z.array(Kiosk).optional()
});
const Kiosk_GetKiosksForOrgWSRequest = z.record(z.unknown());
const Kiosk_GetKiosksForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  kiosks: z.array(Kiosk).optional()
});
const Kiosk_KioskCheckinWSRequest: z.ZodObject<any> = z.object({
  batterLevel: z.number().optional(),
  signalStrength: z.number().int().optional()
});
const Kiosk_KioskCheckinWSResponse = z.record(z.unknown());
const Kiosk_UnregisterKioskRequest: z.ZodObject<any> = z.object({
  kioskUuid: z.string().optional()
});
const Kiosk_UnregisterKioskResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Kiosk_UpdateKioskResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Kiosk_UpdateKioskSelectiveRequest: z.ZodObject<any> = z.object({
  kioskUpdate: KioskSelectiveUpdate.optional()
});
const LabelIdentificationActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const LicenseGroupStats: z.ZodObject<any> = z.object({
  assignedCount: z.number().int().optional(),
  lastEndDate: z.string().datetime({ offset: true }).optional(),
  nearExpirationCount: z.number().int().optional(),
  nextEndDate: z.string().datetime({ offset: true }).optional(),
  stateStats: LicenseStateStats.optional(),
  totalCount: z.number().int().optional()
});
const LicenseUsageCatalogItem: z.ZodObject<any> = z.object({
  durationMonths: z.number().int().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional()
});
const LicenseUsageStats: z.ZodObject<any> = z.object({
  addOnLicenseStats: z.array(AddOnLicenseStats).optional(),
  assignedCount: z.number().int().optional(),
  lastEndDate: z.string().datetime({ offset: true }).optional(),
  nearExpirationCount: z.number().int().optional(),
  nextEndDate: z.string().datetime({ offset: true }).optional(),
  stateStats: LicenseStateStats.optional(),
  totalCount: z.number().int().optional()
});
const LicenseUsageType: z.ZodObject<any> = z.object({
  addOnLicenseType: AddOnLicense.optional(),
  additionalPerceptionFeatures: z.array(PerceptionType).optional(),
  claimKeyUuid: z.string().optional(),
  cloudArchiveDays: z.number().int().optional(),
  createdOn: z.string().datetime({ offset: true }).optional(),
  deviceType: DeviceTypeEnum.optional(),
  deviceUuid: z.string().optional(),
  firstAssignedDate: z.string().datetime({ offset: true }).optional(),
  license: AddOnLicense.optional(),
  licenseFamily: z.string().optional(),
  licenseToUnassignEmailState: z.string().optional(),
  maxDeleteDate: z.string().datetime({ offset: true }).optional(),
  orgUuid: z.string().optional(),
  perceptionTypes: z.array(PerceptionType).optional(),
  priorClaimKeyUuid: z.string().optional(),
  productCode: z.string().optional(),
  productType: z.string().optional(),
  state: z.string().optional(),
  trial: z.boolean().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional()
});
const License_AssignACUDoorLicenseWSRequest: z.ZodObject<any> = z.object({
  doorUuid: z.string().optional(),
  licenseUuid: z.string().optional()
});
const License_AssignACUDoorLicenseWSResponse: z.ZodObject<any> = z.object({
  acuDoorLicense: ACUDoorLicenseType.optional()
});
const License_AssignAlertMonitoringLicenseWSRequest: z.ZodObject<any> = z.object({
  licenseUuid: z.string().optional(),
  locationUuid: z.string().optional()
});
const License_AssignAlertMonitoringLicenseWSResponse: z.ZodObject<any> = z.object({
  alertMonitoringLicense: AlertMonitoringLicenseType.optional()
});
const License_AssignDeviceLicenseWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  licenseUuid: z.string().optional()
});
const License_AssignDeviceLicenseWSResponse: z.ZodObject<any> = z.object({
  deviceLicense: DeviceLicenseType.optional()
});
const License_AssignLicenseWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  licenseUuid: z.string().optional()
});
const License_AssignLicenseWSResponse: z.ZodObject<any> = z.object({
  licenseUsage: LicenseUsageType.optional()
});
const License_CalculateLicensesStatsForClientOrgWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const OrgLicenseStats: z.ZodObject<any> = z.object({
  acuDoorLicenseStats: LicenseGroupStats.optional(),
  alertMonitoringLicenseStats: LicenseGroupStats.optional(),
  assignedCount: z.number().int().optional(),
  deviceLicenseStats: DeviceAssignableLicenseGroupStats.optional(),
  lastEndDate: z.string().datetime({ offset: true }).optional(),
  licenseUsageStats: LicenseUsageStats.optional(),
  nearExpirationCount: z.number().int().optional(),
  nextEndDate: z.string().datetime({ offset: true }).optional(),
  stateStats: LicenseStateStats.optional(),
  totalCount: z.number().int().optional()
});
const License_CalculateLicensesStatsForClientOrgWSResponse: z.ZodObject<any> = z.object({
  orgLicenseStats: OrgLicenseStats.optional()
});
const License_CalculateLicensesStatsForOrgWSRequest: z.ZodObject<any> = z.object({
  excludeTrialLicensesFromExpiredCount: z.boolean().optional()
});
const License_CalculateLicensesStatsForOrgWSResponse: z.ZodObject<any> = z.object({
  orgLicenseStats: OrgLicenseStats.optional()
});
const License_CreateACUDoorLicenseWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const License_CreateACUDoorLicenseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_CreateAlertMonitoringLicenseWSRequest: z.ZodObject<any> = z.object({
  allowedDeviceCount: z.number().int().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional()
});
const License_CreateAlertMonitoringLicenseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_CreateDeviceLicenseWSRequest: z.ZodObject<any> = z.object({
  deviceType: DeviceTypeEnum.optional(),
  licenseFamily: z.string().optional(),
  licenseType: License.optional(),
  orgUuid: z.string().optional()
});
const License_CreateDeviceLicenseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  licenseUuid: z.string().optional()
});
const License_CreateLicenseWSRequest: z.ZodObject<any> = z.object({
  cloudArchiveDays: z.number().int().optional(),
  deviceType: DeviceTypeEnum.optional(),
  license: AddOnLicense.optional(),
  licenseFamily: z.string().optional(),
  orgUuid: z.string().optional()
});
const License_CreateLicenseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  licenseUuid: z.string().optional()
});
const License_DeleteAlertMonitoringLicenseWSRequest: z.ZodObject<any> = z.object({
  licenseUuid: z.string().optional(),
  orgUuid: z.string().optional()
});
const License_DeleteAlertMonitoringLicenseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_DeleteDeviceLicenseWSRequest: z.ZodObject<any> = z.object({
  licenseUuid: z.string().optional(),
  orgUuid: z.string().optional()
});
const License_DeleteDeviceLicenseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_DeleteLicenseWSRequest: z.ZodObject<any> = z.object({
  licenseUuid: z.string().optional(),
  orgUuid: z.string().optional()
});
const License_DeleteLicenseWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_FindLicensesByClaimKeyWSRequest: z.ZodObject<any> = z.object({
  claimKeyUuid: z.string().optional()
});
const License_FindLicensesByClaimKeyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  licenses: z.array(BaseLicenseType).optional()
});
const License_GetACUDoorLicensesForClientOrgWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const License_GetACUDoorLicensesForClientOrgWSResponse: z.ZodObject<any> = z.object({
  acuDoorLicenses: z.array(ACUDoorLicenseType).optional()
});
const License_GetACUDoorLicensesWSRequest = z.record(z.unknown());
const License_GetACUDoorLicensesWSResponse: z.ZodObject<any> = z.object({
  acuDoorLicenses: z.array(ACUDoorLicenseType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_GetAlertMonitoringLicensesForClientOrgWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const License_GetAlertMonitoringLicensesForClientOrgWSResponse: z.ZodObject<any> = z.object({
  alertMonitoringLicenses: z.array(AlertMonitoringLicenseType).optional()
});
const License_GetAlertMonitoringLicensesWSRequest = z.record(z.unknown());
const License_GetAlertMonitoringLicensesWSResponse: z.ZodObject<any> = z.object({
  alertMonitoringLicenses: z.array(AlertMonitoringLicenseType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_GetDeviceLicensesForClientOrgWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const License_GetDeviceLicensesForClientOrgWSResponse: z.ZodObject<any> = z.object({
  deviceLicenses: z.array(DeviceLicenseType).optional()
});
const License_GetDeviceLicensesWSRequest: z.ZodObject<any> = z.object({
  optionalDeviceTypeFilter: DeviceTypeEnum.optional()
});
const License_GetDeviceLicensesWSResponse: z.ZodObject<any> = z.object({
  deviceLicenses: z.array(DeviceLicenseType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_GetLicensesForClientOrgWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const License_GetLicensesForClientOrgWSResponse: z.ZodObject<any> = z.object({
  licenses: z.array(LicenseUsageType).optional()
});
const License_GetLicensesWSRequest: z.ZodObject<any> = z.object({
  optionalDeviceTypeFilter: DeviceTypeEnum.optional()
});
const License_GetLicensesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  licenses: z.array(LicenseUsageType).optional()
});
const License_catalog_FindCatalogItemsWSRequest: z.ZodObject<any> = z.object({
  productType: z.string().optional()
});
const License_catalog_FindCatalogItemsWSResponse: z.ZodObject<any> = z.object({
  catalogItems: z.array(BaseCatalogItem).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_catalog_GetCatalogItemByProductCodeWSRequest: z.ZodObject<any> = z.object({
  productCode: z.string().optional()
});
const License_catalog_GetCatalogItemByProductCodeWSResponse: z.ZodObject<any> = z.object({
  catalogItem: BaseCatalogItem.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_claimkey_ClaimLicensesForClientOrgWSRequest: z.ZodObject<any> = z.object({
  claimCode: z.string().optional(),
  orgUuid: z.string().optional()
});
const License_claimkey_ClaimLicensesForClientOrgWSResponse: z.ZodObject<any> = z.object({
  claimKeyUuid: z.string().optional()
});
const License_claimkey_ClaimLicensesWSRequest: z.ZodObject<any> = z.object({
  claimCode: z.string().optional()
});
const License_claimkey_ClaimLicensesWSResponse: z.ZodObject<any> = z.object({
  claimKeyUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_claimkey_CreateClaimKeyWSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().datetime({ offset: true }).optional(),
  entry: ClaimKeyEntry.optional(),
  requestId: z.string().optional(),
  startDate: z.string().datetime({ offset: true }).optional(),
  trial: z.boolean().optional()
});
const License_claimkey_CreateClaimKeyWSResponse: z.ZodObject<any> = z.object({
  claimCode: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const License_claimkey_CreateRenewalClaimKeyWSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().datetime({ offset: true }).optional(),
  entries: z.record(z.unknown()).optional(),
  requestId: z.string().optional()
});
const License_claimkey_CreateRenewalClaimKeyWSResponse: z.ZodObject<any> = z.object({
  claimCode: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const License_claimkey_FindClaimKeysByOrgWSRequest: z.ZodObject<any> = z.object({
  claimKeySearchFilter: ClaimKeySearchFilter.optional()
});
const License_claimkey_FindClaimKeysByOrgWSResponse: z.ZodObject<any> = z.object({
  claimKeys: z.array(BaseClaimKey).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_claimkey_GetClaimKeyByCodeForClientOrgWSRequest: z.ZodObject<any> = z.object({
  claimCode: z.string().optional(),
  orgUuid: z.string().optional()
});
const License_claimkey_GetClaimKeyByCodeForClientWSResponse: z.ZodObject<any> = z.object({
  claimKey: BaseClaimKey.optional()
});
const License_claimkey_GetClaimKeyByCodeWSRequest: z.ZodObject<any> = z.object({
  claimCode: z.string().optional()
});
const License_claimkey_GetClaimKeyByCodeWSResponse: z.ZodObject<any> = z.object({
  claimKey: BaseClaimKey.optional()
});
const License_claimkey_GetClaimKeyWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const License_claimkey_GetClaimKeyWSResponse: z.ZodObject<any> = z.object({
  claimKey: BaseClaimKey.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const License_claimkey_ReturnClaimKeyProductQuantitiesWSRequest: z.ZodObject<any> = z.object({
  productQuantities: z.record(z.unknown()).optional(),
  uuid: z.string().optional()
});
const License_claimkey_ReturnClaimKeyProductQuantitiesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const UriBuilder = z.record(z.unknown());
const Link: z.ZodObject<any> = z.object({
  params: z.record(z.unknown()).optional(),
  rel: z.string().optional(),
  rels: z.array(z.string()).optional(),
  title: z.string().optional(),
  type: z.string().optional(),
  uri: z.string().optional(),
  uriBuilder: UriBuilder.optional()
});
const LiveNotificationActionStatusEnum = z.string();
const LiveNotificationActionRecordType: z.ZodObject<any> = z.object({
  status: LiveNotificationActionStatusEnum.optional()
});
const LocationFunctionality = z.string();
const LocationSettings: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  printBadge: z.boolean().optional()
});
const Location_AddLocationLabelWSRequest: z.ZodObject<any> = z.object({
  label: z.string().optional(),
  locationIdentifier: z.string().optional()
});
const Location_AddLocationLabelWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Location_CreateLocationWSRequest: z.ZodObject<any> = z.object({
  location: LocationType.optional(),
  parentLocationUuid: z.string().optional()
});
const Location_CreateLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const Location_DeleteLocationWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Location_DeleteLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Location_GeoCodeWSRequest: z.ZodObject<any> = z.object({
  address: z.string().optional()
});
const Location_GeoCodeWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});
const Location_GetLocationLabelsForOrgWSRequest = z.record(z.unknown());
const Location_GetLocationLabelsForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  locationLabels: z.record(z.unknown()).optional()
});
const Location_GetLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string(),
  subLocationsRequired: z.boolean().optional()
});
const Location_GetLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  location: LocationType.optional()
});
const Location_GetLocationsByGeoRequest: z.ZodObject<any> = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional()
});
const Location_GetLocationsByGeoResponse: z.ZodObject<any> = z.object({
  locations: z.array(LocationType).optional()
});
const Location_GetLocationsBySubLocationsHierarchyKeyWSRequest: z.ZodObject<any> = z.object({
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional()
});
const Location_GetLocationsBySubLocationsHierarchyKeyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  location: LocationType.optional()
});
const Location_GetLocationsV2WSRequest: z.ZodObject<any> = z.object({
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional(),
  nameBeginsWithFilter: z.string().optional()
});
const Location_GetLocationsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lastEvaluatedKey: z.string().optional(),
  locations: z.array(LocationType).optional()
});
const Location_GetLocationsWSRequest: z.ZodObject<any> = z.object({
  subLocationsIncluded: z.boolean().optional()
});
const Location_GetLocationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  locations: z.array(LocationType).optional()
});
const Location_QualifiedAddressTypeWithValidation: z.ZodObject<any> = z.object({
  addressComplete: z.boolean().optional(),
  addressLine2: z.string().optional(),
  addressline1: z.string().optional(),
  administrativeArea: z.string().optional(),
  locality: z.string().optional(),
  postalCode: z.string().optional(),
  regionCode: z.string().optional(),
  validatedAddressline1: z.boolean().optional(),
  validatedAdminestrativeArea: z.boolean().optional(),
  validatedLocality: z.boolean().optional(),
  validatedPostalCode: z.boolean().optional(),
  validatedRegionCode: z.boolean().optional(),
  validatedSubpremise: z.boolean().optional()
});
const Location_RemoveLocationLabelWSRequest: z.ZodObject<any> = z.object({
  label: z.string().optional(),
  locationIdentifier: z.string().optional()
});
const Location_RemoveLocationLabelWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Location_SelectiveUpdateLocationWSRequest: z.ZodObject<any> = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  countryCode: z.string().optional(),
  floorPlans: z.array(FloorPlanType).optional(),
  labels: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  locationUuid: z.string(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  postalCode: z.string().optional(),
  timezoneId: z.string().optional(),
  tz: z.object({
  displayName: z.string().optional(),
  dstsavings: z.number().int().optional(),
  id: z.string().optional(),
  rawOffset: z.number().int().optional()
}).optional()
});
const Location_SelectiveUpdateLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Location_UpdateLocationWSRequest: z.ZodObject<any> = z.object({
  location: LocationType.optional()
});
const Location_UpdateLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Location_ValidateLocationWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional()
});
const Location_ValidateLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  locationUuid: z.string().optional(),
  qualifiedAddress: Location_QualifiedAddressTypeWithValidation.optional()
});
const LockdownActivatedStateEventType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  followingTestPlan: z.boolean().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  originator: BaseLocationLockdownEventOriginator.optional(),
  stateChangedAtMillis: z.number().int().optional(),
  type: LockdownStateEventEnumType.optional()
});
const LockdownDeactivatedStateEventType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  followingTestPlan: z.boolean().optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  originator: BaseLocationLockdownEventOriginator.optional(),
  stateChangedAtMillis: z.number().int().optional(),
  type: LockdownStateEventEnumType.optional()
});
const Logistics_GetRMAsWSRequest = z.record(z.unknown());
const RMARequest: z.ZodObject<any> = z.object({
  formSubmitted: z.boolean().optional(),
  requestUuid: z.string().optional(),
  rmaOpportunityId: z.string().optional(),
  salesforceAccountId: z.string().optional(),
  salesforcePartnerContactId: z.string().optional(),
  salesforcePartnerId: z.string().optional()
});
const RMAType: z.ZodObject<any> = z.object({
  address: z.string().optional(),
  advancedRMAs: AdvancedRMAType.optional(),
  briefDescription: z.string().optional(),
  city: z.string().optional(),
  costInDollars: z.number().optional(),
  country: z.string().optional(),
  customerUnresponsive: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deviceUuid: z.string().optional(),
  errorCode: z.string().optional(),
  failureDiagnostics: z.array(z.string()).optional(),
  fedExReturnLabelSent: z.boolean().optional(),
  finalNotes: z.string().optional(),
  hardwareUuid: z.string().optional(),
  initialFirmwareVersion: z.string().optional(),
  initiatedBy: z.string().optional(),
  inventoryNeeded: z.string().optional(),
  inventoryNeededMap: z.record(z.unknown()).optional(),
  isRefurbished: z.boolean().optional(),
  knownIssue: z.boolean().optional(),
  lastRecordedFirmwareVersion: z.string().optional(),
  lastUpdatedAtSec: z.number().int().optional(),
  lastUpdatedBy: z.string().optional(),
  orgUuid: z.string().optional(),
  postalCode: z.string().optional(),
  prevShippingInfoUsedBy: z.string().optional(),
  prevShippingInfoUsedByAtSec: z.number().int().optional(),
  proactiveReplacement: z.boolean().optional(),
  recipientName: z.string().optional(),
  recipientPhoneNumber: z.string().optional(),
  replacementCourier: z.string().optional(),
  replacementHardwareUuid: z.string().optional(),
  replacementTrackingNumber: z.string().optional(),
  requesterEmailAddress: z.string().optional(),
  returnLabelRequestedUpdatedAtSec: z.number().int().optional(),
  returnLabelSent: z.boolean().optional(),
  returnLabelSentUpdatedAtSec: z.number().int().optional(),
  returnTrackingNumber: z.string().optional(),
  rmaRequest: RMARequest.optional(),
  rmaRequestUuid: z.string().optional(),
  sdCardReplaced: z.boolean().optional(),
  shipmentMethod: z.string().optional(),
  shipmentRequested: z.boolean().optional(),
  shipmentRequestedBy: z.string().optional(),
  shipmentRequestedUpdatedAtSec: z.number().int().optional(),
  shipmentSent: z.boolean().optional(),
  shipmentSentUpdatedAtSec: z.number().int().optional(),
  skipAutoRegistration: z.boolean().optional(),
  state: z.string().optional(),
  status: z.string().optional(),
  storageCid: z.string().optional(),
  street: z.string().optional(),
  timestampSec: z.number().int().optional(),
  uuid: z.string().optional(),
  warehouseInventoryNeeded: z.boolean().optional(),
  zenDeskTicketAssigneeEmail: z.string().optional(),
  zenDeskTicketSubject: z.string().optional(),
  zendeskTicket: z.number().int().optional()
});
const Logistics_GetRMAsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rmaList: z.array(RMAType).optional()
});
const Logistics_GetShipmentsWSRequest: z.ZodObject<any> = z.object({
  endTimeSec: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Logistics_GetShipmentsWSResponse: z.ZodObject<any> = z.object({
  customerShipmentList: z.array(CustomerShipmentType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Maps_GenerateMapUrlWSRequest: z.ZodObject<any> = z.object({
  baseUrl: z.string().optional()
});
const Maps_GenerateMapUrlWSResponse: z.ZodObject<any> = z.object({
  signedUrl: z.string().optional()
});
const Mediadevice_GetBulkMediaDeviceDetailsWSRequest: z.ZodObject<any> = z.object({
  devices: z.array(z.string()).optional()
});
const Mediadevice_GetBulkMediaDeviceDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  mediaDeviceDetails: z.record(z.unknown()).optional()
});
const Mediadevice_MediaDeviceDetailsType: z.ZodObject<any> = z.object({
  audioGateways: z.array(z.string()).optional(),
  deviceFacetUuid: z.string().optional(),
  deviceType: DeviceTypeEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lanCheckUrls: z.array(z.string()).optional(),
  lanLiveH264Uris: z.array(z.string()).optional(),
  lanLiveM3u8Uris: z.array(z.string()).optional(),
  lanLiveMpdUris: z.array(z.string()).optional(),
  lanVodM3u8UrisTemplates: z.array(z.string()).optional(),
  lanVodMpdUrisTemplates: z.array(z.string()).optional(),
  name: z.string().optional(),
  region: z.string().optional(),
  timezone: z.object({
  displayName: z.string().optional(),
  dstsavings: z.number().int().optional(),
  id: z.string().optional(),
  rawOffset: z.number().int().optional()
}).optional(),
  uri: z.string().optional(),
  wanLiveH264Uri: z.string().optional(),
  wanLiveM3u8Uri: z.string().optional(),
  wanLiveMpdUri: z.string().optional(),
  wanVodH264UriTemplate: z.string().optional(),
  wanVodM3u8UriTemplate: z.string().optional(),
  wanVodMpdUriTemplate: z.string().optional()
});
const Metric_LogEventWSRequest: z.ZodObject<any> = z.object({
  logMap: z.record(z.unknown()).optional()
});
const Metric_LogEventWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Metric_ReportErrorWSRequest: z.ZodObject<any> = z.object({
  errorMap: z.record(z.unknown()).optional()
});
const Metric_ReportErrorWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const MicrosoftTeamsChannelSettings: z.ZodObject<any> = z.object({
  botInstallationId: z.string().optional(),
  channelId: z.string().optional(),
  installingUserUuid: z.string().optional(),
  sendChannelNotifications: z.boolean().optional()
});
const MicrosoftTeamsUserSettings: z.ZodObject<any> = z.object({
  botInstallationId: z.string().optional(),
  chatId: z.string().optional(),
  refreshToken: z.string().optional(),
  sendUserNotifications: z.boolean().optional(),
  teamIds: z.array(z.string()).optional(),
  userId: z.string().optional()
});
const MinimalNVRStateType: z.ZodObject<any> = z.object({
  connectionStatus: DeviceStatusEnum.optional(),
  createdAtMillis: z.number().int().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  directionRadians: z.number().optional(),
  externalIPAddress: z.string().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  firmwareUpdateInProgress: z.boolean().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  healthStatus: DeviceStatusEnum.optional(),
  healthStatusDetails: DeviceHealthStatusDetailsEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lanAddresses: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  liveStreamShared: z.boolean().optional(),
  liveStreamsSharedCount: z.number().int().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mediaRegion: z.string().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  numThirdPartyCamerasAssigned: z.number().int().optional(),
  numThirdPartyCamerasSupported: z.number().int().optional(),
  policyUuid: z.string().optional(),
  region: z.string().optional(),
  secondaryLanAddresses: z.array(z.string()).optional(),
  serialNumber: z.string().optional(),
  ssid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  supportedFacets: z.array(DeviceFacet).optional(),
  uuid: z.string().optional(),
  wifiApMac: z.string().optional(),
  wifiBars: z.number().int().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const MinimalThresholdEventType: z.ZodObject<any> = z.object({
  crossingObject: z.string().optional(),
  direction: z.string().optional(),
  objectId: z.number().int().optional(),
  timestampMs: z.number().int().optional()
});
const Mobile_LoginToOrg2FARequiredResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Mobile_LoginToOrgSuccessResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Mobile_LoginToOrgSsoRequiredResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Mobile_LoginToOrgBaseResponse: z.ZodObject<any> = z.object({
  type: z.string()
});
const Mobile_LoginToOrgRequest: z.ZodObject<any> = z.object({
  csr: z.array(z.string()).optional(),
  orgUuid: z.string().optional()
});
const Mobile_LoginVerifiedSupportAuthorityMobileRequest: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional(),
  clientType: z.string().optional()
});
const Mobile_LoginVerifiedSupportAuthorityMobileResponse: z.ZodObject<any> = z.object({
  supportAuthoritySessionUuid: z.string().optional(),
  valid: z.boolean().optional()
});
const Mobile_LogoutMobileUserRequest = z.record(z.unknown());
const Mobile_LogoutMobileUserResponse = z.record(z.unknown());
const Mobile_RefreshMobileSessionRequest: z.ZodObject<any> = z.object({
  csr: z.array(z.string()).optional()
});
const Mobile_RefreshMobileSessionResponse: z.ZodObject<any> = z.object({
  cert: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const Mobile_UpdateMobileNotificationTokenRequest: z.ZodObject<any> = z.object({
  token: z.string().optional()
});
const Mobile_UpdateMobileNotificationTokenResponse = z.record(z.unknown());
const Mobile_UpdateRhombusKeyMobileNotificationTokenRequest: z.ZodObject<any> = z.object({
  token: z.string().optional()
});
const Mobile_UpdateRhombusKeyMobileNotificationTokenResponse = z.record(z.unknown());
const ModelStatusEnum = z.string();
const ModularAIModelParams: z.ZodObject<any> = z.object({
  classOutputMap: z.record(z.unknown()).optional(),
  inputHeight: z.number().int().optional(),
  inputWidth: z.number().int().optional()
});
const PipelineComponentType = z.string();
const PipelineComponent: z.ZodObject<any> = z.object({
  arg_json: z.record(z.unknown()).optional(),
  name: PipelineComponentType.optional(),
  uuid: z.string().optional()
});
const ModularAIConfig: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  distributionUuid: z.string().optional(),
  modelParams: ModularAIModelParams.optional(),
  modelQuantizedBinaryContentLocator: z.string().optional(),
  modelStatus: ModelStatusEnum.optional(),
  modelUploadZipContentLocator: z.string().optional(),
  name: z.string().optional(),
  pipeline: z.array(PipelineComponent).optional(),
  restrictedOrgUuid: z.string().optional(),
  uuid: z.string().optional()
});
const ModularAIConfigSelectiveUpdate: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  distributionUuid: z.string().optional(),
  modelParams: ModularAIModelParams.optional(),
  modelQuantizedBinaryContentLocator: z.string().optional(),
  modelStatus: ModelStatusEnum.optional(),
  modelUploadZipContentLocator: z.string().optional(),
  name: z.string().optional(),
  pipeline: z.array(PipelineComponent).optional(),
  restrictedOrgUuid: z.string().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  uuid: z.string().optional()
});
const ModularAIDistribution: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  restrictedOrgUuid: z.string().optional(),
  uuid: z.string().optional()
});
const Modularai_AddModelToDeviceWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  modelUuid: z.string().optional()
});
const Modularai_AddModelToDeviceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Modularai_CreateModularAIDistributionWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional()
});
const Modularai_CreateModularAIDistributionWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const Modularai_CreateModularAIPipelineConfigWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  distributionUuid: z.string().optional(),
  name: z.string().optional(),
  pipeline: z.array(PipelineComponent).optional()
});
const Modularai_CreateModularAIPipelineConfigWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const Modularai_GetDevicesForModelWSRequest: z.ZodObject<any> = z.object({
  modelUuid: z.string().optional()
});
const Modularai_GetDevicesForModelWSResponse: z.ZodObject<any> = z.object({
  devices: z.array(z.string()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Modularai_GetModelsAddedToDeviceWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Modularai_GetModelsAddedToDeviceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  models: z.array(ModularAIConfig).optional()
});
const Modularai_GetModelsForDistributionWSRequest: z.ZodObject<any> = z.object({
  distributionUuid: z.string().optional()
});
const Modularai_GetModelsForDistributionWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  models: z.array(ModularAIConfig).optional()
});
const Modularai_GetModelsWSRequest = z.record(z.unknown());
const Modularai_GetModelsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  models: z.array(ModularAIConfig).optional()
});
const Modularai_ListModularAIDistributionsWSRequest = z.record(z.unknown());
const Modularai_ListModularAIDistributionsWSResponse: z.ZodObject<any> = z.object({
  distributions: z.array(ModularAIDistribution).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Modularai_RemoveModelFromDeviceWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  modelUuid: z.string().optional()
});
const Modularai_RemoveModelFromDeviceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Modularai_UpdateModelWSRequest: z.ZodObject<any> = z.object({
  update: ModularAIConfigSelectiveUpdate.optional()
});
const Modularai_UpdateModelWSResponse = z.record(z.unknown());
const MultivaluedMapStringObject: z.ZodObject<any> = z.object({
  empty: z.boolean().optional()
});
const MultivaluedMapStringParameterizedHeader: z.ZodObject<any> = z.object({
  empty: z.boolean().optional()
});
const MultivaluedMapStringString: z.ZodObject<any> = z.object({
  empty: z.boolean().optional()
});
const Network_GetDeviceNetworkConfigurationWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Network_NetworkConfigurationModeEnum = z.string();
const Network_IpConfiguration: z.ZodObject<any> = z.object({
  dnsServer1: z.string().optional(),
  dnsServer2: z.string().optional(),
  gateway: z.string().optional(),
  ipAddress: z.string().optional(),
  isSecondary: z.boolean().optional(),
  mode: Network_NetworkConfigurationModeEnum.optional(),
  netmask: z.string().optional()
});
const Network_GetDeviceNetworkConfigurationWSResponse: z.ZodObject<any> = z.object({
  ipConfigurations: z.array(Network_IpConfiguration).optional()
});
const Network_UpdateDeviceIpConfigurationWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  ipConfiguration: Network_IpConfiguration.optional()
});
const Network_UpdateDeviceIpConfigurationWSResponse: z.ZodObject<any> = z.object({
  ipConfiguration: Network_IpConfiguration.optional()
});
const NewCookie: z.ZodObject<any> = z.object({
  comment: z.string().optional(),
  domain: z.string().optional(),
  expiry: z.string().datetime({ offset: true }).optional(),
  httpOnly: z.boolean().optional(),
  maxAge: z.number().int().optional(),
  name: z.string().optional(),
  path: z.string().optional(),
  sameSite: z.string().optional(),
  secure: z.boolean().optional(),
  value: z.string().optional(),
  version: z.number().int().optional()
});
const NotificationSettingsType: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional(),
  slackChannel: z.string().optional(),
  slackEnabled: z.boolean().optional(),
  slackWebhookUrl: z.string().optional()
});
const NumericAggregationValue: z.ZodObject<any> = z.object({
  average: z.number().optional(),
  eventCount: z.number().int().optional(),
  localDate: z.string().optional(),
  max: z.number().optional(),
  maxValueTimestampMs: z.number().int().optional(),
  min: z.number().optional(),
  minValueTimestampMs: z.number().int().optional(),
  sum: z.number().optional(),
  timestampMs: z.number().int().optional(),
  utcDate: z.string().optional()
});
const OAuthApplication: z.ZodObject<any> = z.object({
  clientId: z.string().optional(),
  clientSecretHash: z.string().optional(),
  contactEmail: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  redirectUri: z.string().optional()
});
const Oauth_GetAllApplicationsForOrgWSRequest = z.record(z.unknown());
const Oauth_GetAllApplicationsForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  oauthApplications: z.array(OAuthApplication).optional()
});
const Oauth_GetApplicationByClientIdWSRequest: z.ZodObject<any> = z.object({
  clientId: z.string().optional()
});
const Oauth_GetApplicationByClientIdWSResponse: z.ZodObject<any> = z.object({
  application: OAuthApplication.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Oauth_OAuthApplicationWSRequest: z.ZodObject<any> = z.object({
  clientId: z.string().optional(),
  contactEmail: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  redirectUri: z.string().optional()
});
const Oauth_OAuthApplicationWSResponse: z.ZodObject<any> = z.object({
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const OccupancyEventType: z.ZodObject<any> = z.object({
  baseStationUuid: z.string().optional(),
  batteryPercentage: z.number().int().optional(),
  bleDeviceUuid: z.string().optional(),
  bleRssi: z.number().int().optional(),
  closeBaseStations: z.array(z.string()).optional(),
  locationUuid: z.string().optional(),
  lux: z.number().int().optional(),
  orgUuid: z.string().optional(),
  state: z.string().optional(),
  stateChanged: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  tampered: z.boolean().optional(),
  timestampMs: z.number().int().optional()
});
const OccupancyScheduledTriggerType: z.ZodObject<any> = z.object({
  occupancyThresholdSec: z.number().int().optional(),
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(ActivityEnum).optional(),
  vacancyThresholdSec: z.number().int().optional()
});
const OccupancyPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(OccupancyScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Occupancysensor_GetMinimalOccupancySensorStatesWSRequest = z.record(z.unknown());
const Occupancysensor_MotionSensorHealthEnum = z.string();
const Occupancysensor_MotionSensorHealthDetailsEnum = z.string();
const Occupancysensor_MinimalOccupancySensorStateType: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  batteryPercent: z.number().int().optional(),
  closestBaseStation: z.string().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  health: Occupancysensor_MotionSensorHealthEnum.optional(),
  healthDetails: Occupancysensor_MotionSensorHealthDetailsEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lastSeenSec: z.number().int().optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().optional(),
  normalizedLux: z.number().optional(),
  policyUuid: z.string().optional(),
  rawLux: z.number().int().optional(),
  sensorUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  signalStrength: z.number().int().optional(),
  status: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional()
});
const Occupancysensor_GetMinimalOccupancySensorStatesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  occupancySensorStates: z.array(Occupancysensor_MinimalOccupancySensorStateType).optional()
});
const Occupancysensor_GetOccupancyEventsForSensorWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  sensorUuid: z.string().optional()
});
const Occupancysensor_GetOccupancyEventsForSensorWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  events: z.array(OccupancyEventType).optional()
});
const Occupancysensor_UpdateOccupancySensorDetailsWSRequest: z.ZodObject<any> = z.object({
  associatedCameras: z.array(z.string()).optional(),
  associatedCamerasUpdated: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedUpdated: z.boolean().optional(),
  description: z.string().optional(),
  descriptionUpdated: z.boolean().optional(),
  floorNumber: z.number().int().optional(),
  floorNumberUpdated: z.boolean().optional(),
  latitude: z.number().optional(),
  latitudeUpdated: z.boolean().optional(),
  locationUuid: z.string().optional(),
  locationUuidUpdated: z.boolean().optional(),
  longitude: z.number().optional(),
  longitudeUpdated: z.boolean().optional(),
  name: z.string().optional(),
  nameUpdated: z.boolean().optional(),
  policyUuid: z.string().optional(),
  policyUuidUpdated: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  subLocationsHierarchyKeyUpdated: z.boolean().optional(),
  uuid: z.string().optional()
});
const Occupancysensor_UpdateOccupancySensorDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const OccupiedActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const Openapi_GetOpenApiComponentSchemasWSRequest: z.ZodObject<any> = z.object({
  changeType: ChangeType.optional(),
  entity: Entity.optional(),
  locationFunctionality: LocationFunctionality.optional()
});
const OpentechAllianceDoorInfoType: z.ZodObject<any> = z.object({
  actionGroupId: z.string().optional(),
  assignedCameraList: z.array(z.string()).optional(),
  clipDuration: z.number().int().optional(),
  doorName: z.string().optional(),
  leadingSeconds: z.number().int().optional(),
  locationUuid: z.string().optional(),
  remoteUnlock: z.boolean().optional()
});
const OpentechAllianceFacilitySettings: z.ZodObject<any> = z.object({
  alertUnauthorizedFaces: z.boolean().optional(),
  createSeekPoints: z.boolean().optional(),
  doorInfoMap: z.record(z.unknown()).optional(),
  identifyFacesFromBadge: z.boolean().optional(),
  saveClips: z.boolean().optional()
});
const OperationStatus: z.ZodObject<any> = z.object({
  message: z.string().optional(),
  status: z.string().optional()
});
const OrgLockdownPlanType: z.ZodObject<any> = z.object({
  activationPlan: LockdownActivationPlanType.optional(),
  createdAtMillis: z.number().int().optional(),
  deactivationPlan: LockdownDeactivationPlanType.optional(),
  defaultLockdownState: DoorLockdownStateEnumType.optional(),
  doorLockdownStateMap: z.record(z.unknown()).optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  physicalAccess: LockdownPhysicalAccessType.optional(),
  scopeUuid: z.string().optional(),
  testPlan: LockdownTestPlanType.optional(),
  type: LockdownPlanScopeEnumType.optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const OrgSamlSettingsType: z.ZodObject<any> = z.object({
  addUsersOnRoleMismatch: z.boolean().optional(),
  enabled: z.boolean().optional(),
  enabledForRhombusKey: z.boolean().optional(),
  idpMetaDataXml: z.string().optional(),
  justInTimeAccountProvisioningEnabled: z.boolean().optional(),
  orgUuid: z.string().optional(),
  registrationUuid: z.string().optional(),
  rhombusKeyAppSettings: RhombusKeyAppSettingsType.optional(),
  teamName: z.string().optional()
});
const RBACSettingsType: z.ZodObject<any> = z.object({
  enabled: z.boolean().optional()
});
const SAMLSettingsType: z.ZodObject<any> = z.object({
  addUsersOnRoleMismatch: z.boolean().optional(),
  enabled: z.boolean().optional(),
  idpMetaDataXml: z.string().optional(),
  justInTimeAccountProvisioningEnabled: z.boolean().optional()
});
const OrgType: z.ZodObject<any> = z.object({
  accountOwnerEmail: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  countryCode: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  firmwareUpdateSettings: FirmwareUpdateSettingsType.optional(),
  itemizedInvoice: z.boolean().optional(),
  mfaEnabled: z.boolean().optional(),
  name: z.string().optional(),
  newCameraFramerateMap: z.record(z.unknown()).optional(),
  newCameraResolutionMap: z.record(z.unknown()).optional(),
  newCameraSegmentMaxBytesMap: z.record(z.unknown()).optional(),
  newCameraVideoTargetQualityMap: z.record(z.unknown()).optional(),
  notificationSettings: NotificationSettingsType.optional(),
  partnerAccessAllowedUntil: z.number().int().optional(),
  planType: z.string().optional(),
  postalCode: z.string().optional(),
  rbacSettings: RBACSettingsType.optional(),
  samlSettings: SAMLSettingsType.optional(),
  subscriptionEndDate: z.number().int().optional(),
  subscriptionStatus: z.string().optional(),
  subscriptionType: z.string().optional(),
  supportAccessAllowedUntil: z.number().int().optional(),
  teamName: z.string().optional(),
  type: z.string().optional(),
  uapSettings: UAPSettingsType.optional(),
  uuid: z.string().optional()
});
const Org_ClaimActivationTokenWSRequest: z.ZodObject<any> = z.object({
  activationToken: z.string().optional(),
  name: z.string().optional(),
  permissionGroupUuid: z.string().optional()
});
const Org_ClaimActivationTokenWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_DeviceRegistrationClaimType: z.ZodObject<any> = z.object({
  deviceName: z.string().optional(),
  hardwareUuid: z.string().optional(),
  locationUuid: z.string().optional(),
  policyUuid: z.string().optional()
});
const Org_ClaimShipmentRegistrationTokenWSRequest: z.ZodObject<any> = z.object({
  claimList: z.array(Org_DeviceRegistrationClaimType).optional(),
  tokenUuid: z.string().optional()
});
const Org_ClaimShipmentRegistrationTokenWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_CreatePendingRegistrationRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  wifiPsk: z.array(z.string()).optional(),
  wifiSsid: z.string().optional()
});
const Org_CreatePendingRegistrationResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_DeleteCloudArchivingConfigWSRequest: z.ZodObject<any> = z.object({
  scope: DeviceTargetScope.optional(),
  targetUuid: z.string().optional()
});
const Org_DeleteCloudArchivingConfigWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_DeleteKeypadLogoWSRequest = z.record(z.unknown());
const Org_DeleteKeypadLogoWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_DeleteRhombusKeyLogoWSRequest: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_DeleteRhombusKeyLogoWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_FindAllHardwareWithPendingRegistrationRequest = z.record(z.unknown());
const Org_PendingRegistrationInfoType: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional()
});
const Org_HardwareWithPendingRegistrationInfoType: z.ZodObject<any> = z.object({
  hardware: HardwareType.optional(),
  hwUuid: z.string().optional(),
  pendingRegistrationInfo: Org_PendingRegistrationInfoType.optional()
});
const Org_FindAllHardwareWithPendingRegistrationResponse: z.ZodObject<any> = z.object({
  hardwareList: z.array(HardwareType).optional(),
  hardwareWithPendingRegistrationInfoList: z.array(Org_HardwareWithPendingRegistrationInfoType).optional()
});
const Org_FindHardwareAvailableForPendingRegistrationRequest = z.record(z.unknown());
const Org_FindHardwareAvailableForPendingRegistrationResponse: z.ZodObject<any> = z.object({
  hardwareList: z.array(HardwareType).optional()
});
const Org_FindIfTeamNameAvailableRequest: z.ZodObject<any> = z.object({
  teamName: z.string().optional()
});
const Org_FindIfTeamNameAvailableResponse: z.ZodObject<any> = z.object({
  available: z.boolean().optional()
});
const Org_FindSCIMSettingsForOrgWSRequest = z.record(z.unknown());
const SCIMSettingsType: z.ZodObject<any> = z.object({
  addUsersOnRoleMismatch: z.boolean().optional(),
  createdAtMillis: z.number().int().optional(),
  orgUuid: z.string().optional(),
  rhombusKeyAppSettings: RhombusKeyAppSettingsType.optional(),
  sendWelcomeEmailToNewRhombusKeyUsers: z.boolean().optional(),
  sendWelcomeEmailToNewUsers: z.boolean().optional(),
  updatedAtMillis: z.number().int().optional()
});
const Org_FindSCIMSettingsForOrgWSResponse: z.ZodObject<any> = z.object({
  scimSettings: SCIMSettingsType.optional()
});
const Org_GenerateFederatedSessionTokenRequest: z.ZodObject<any> = z.object({
  domain: z.string().optional(),
  durationSec: z.number().int().optional()
});
const Org_GenerateFederatedSessionTokenResponse: z.ZodObject<any> = z.object({
  federatedSessionToken: z.string().optional()
});
const Org_GetAwsIntCloudformationFileRequest = z.record(z.unknown());
const Org_GetAwsIntCloudformationFileResponse: z.ZodObject<any> = z.object({
  fileBase64: z.string().optional()
});
const Org_GetClientOrgWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const Permission = z.string();
const UserPermissionGroupType: z.ZodObject<any> = z.object({
  accessControlLocationAccessMap: z.record(z.unknown()).optional(),
  accessibleLocations: z.array(z.string()).optional(),
  assignablePermissionGroups: z.array(z.string()).optional(),
  defaultAccessControlPermissionForNewLocations: Permission.optional(),
  defaultPermissionForNewLocations: Permission.optional(),
  description: z.string().optional(),
  deviceAccessMap: z.record(z.unknown()).optional(),
  functionalityList: z.array(Functionality).optional(),
  inLine: z.boolean().optional(),
  installer: z.boolean().optional(),
  locationAccessMap: z.record(z.unknown()).optional(),
  locationGranularAccessMap: z.record(z.unknown()).optional(),
  mutable: z.boolean().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  storedInS3: z.boolean().optional(),
  superAdmin: z.boolean().optional(),
  userPermissionGroupAccessMap: z.record(z.unknown()).optional(),
  uuid: z.string().optional()
});
const Org_GetClientOrgWSResponse: z.ZodObject<any> = z.object({
  featureFlags: z.record(z.unknown()).optional(),
  org: OrgV2Type.optional(),
  partnerOrgPermissionGroup: UserPermissionGroupType.optional()
});
const Org_GetCloudArchivingConfigsWSRequest = z.record(z.unknown());
const Org_GetCloudArchivingConfigsWSResponse: z.ZodObject<any> = z.object({
  archivingConfigs: z.array(ScopedCloudArchivingConfig).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_GetDeviceFlagsWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const Org_GetDeviceFlagsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  flags: z.record(z.unknown()).optional()
});
const Org_GetFeaturesWSRequest = z.record(z.unknown());
const Org_GetFeaturesWSResponse: z.ZodObject<any> = z.object({
  behaviorDetection: z.boolean().optional(),
  cloudArchiving: z.boolean().optional(),
  engagementCounting: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  faceCounting: z.boolean().optional(),
  faceCountingNonUnique: z.boolean().optional(),
  faceRecognition: z.boolean().optional(),
  licensePlateRecognition: z.boolean().optional(),
  peopleCounting: z.boolean().optional(),
  ppeDetection: z.boolean().optional(),
  rulesEngine: z.boolean().optional(),
  vehicleCounting: z.boolean().optional()
});
const Org_GetLocationFlagsWSRequest = z.record(z.unknown());
const Org_GetLocationFlagsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  flagsMap: z.record(z.unknown()).optional()
});
const Org_GetOrgIntegrationsWSRequest = z.record(z.unknown());
const Org_GetOrgIntegrationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  orgIntegrations: OrgIntegrationsType.optional()
});
const Org_GetOrgNotificationTemplateV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  notificationSettings: UserNotificationSettingsV4Type.optional()
});
const Org_GetOrgNotificationTemplateWSRequest = z.record(z.unknown());
const Org_GetOrgNotificationTemplateWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  notificationSettings: UserNotificationSettingsV3Type.optional()
});
const Org_GetOrgV2WSRequest = z.record(z.unknown());
const Org_GetOrgV2WSResponse: z.ZodObject<any> = z.object({
  cameraConfigDefaults: z.record(z.unknown()).optional(),
  cameraConfigOptions: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  featureFlags: z.record(z.unknown()).optional(),
  org: OrgV2Type.optional()
});
const Org_GetOrgWSRequest = z.record(z.unknown());
const Org_GetOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  featureFlags: z.record(z.unknown()).optional(),
  org: OrgType.optional()
});
const Org_GetSAMLSettingsV2WSRequest = z.record(z.unknown());
const Org_GetSAMLSettingsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  samlSettings: z.array(OrgSamlSettingsType).optional()
});
const Org_GetSAMLSettingsWSRequest = z.record(z.unknown());
const Org_GetSAMLSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  samlSettings: OrgSamlSettingsType.optional()
});
const Org_GetScimDisplayInfoResponse: z.ZodObject<any> = z.object({
  azureScimEndpointUrl: z.string().optional(),
  scimEndpointUrl: z.string().optional()
});
const Org_GetTemporaryOrgTokenWSRequest = z.record(z.unknown());
const Org_PeekShipmentRegistrationTokenWSRequest: z.ZodObject<any> = z.object({
  tokenUuid: z.string().optional()
});
const Org_PeekShipmentRegistrationTokenWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  hardwareUuidList: z.array(z.string()).optional()
});
const Org_RemovePendingRegistrationRequest: z.ZodObject<any> = z.object({
  serialNumber: z.string().optional()
});
const Org_RemovePendingRegistrationResponse = z.record(z.unknown());
const Org_RevokeSCIMAccessForOrgWSRequest = z.record(z.unknown());
const Org_RevokeSCIMAccessForOrgWSResponse = z.record(z.unknown());
const Org_SetFlagWSRequest: z.ZodObject<any> = z.object({
  flagName: z.string().optional(),
  flagValue: z.string().optional()
});
const Org_SetFlagWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_SetupSCIMAccessForOrgWSRequest: z.ZodObject<any> = z.object({
  addUsersOnRoleMismatch: z.boolean().optional(),
  rhombusKeyAppSettings: RhombusKeyAppSettingsType.optional(),
  sendWelcomeEmailToNewRhombusKeyUsers: z.boolean().optional(),
  sendWelcomeEmailToNewUsers: z.boolean().optional()
});
const Org_SetupSCIMAccessForOrgWSResponse: z.ZodObject<any> = z.object({
  scimAccessAlreadySetupFailure: z.boolean().optional(),
  token: z.string().optional()
});
const Org_UpdateAiTrainingSettingsWSRequest: z.ZodObject<any> = z.object({
  shareAiTrainingMediaWithRhombus: z.boolean().optional()
});
const Org_UpdateAiTrainingSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateCloudArchivingConfigWSRequest: z.ZodObject<any> = z.object({
  archivingConfig: ScopedCloudArchivingConfig.optional()
});
const Org_UpdateCloudArchivingConfigWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateFirmwareSettingsWSRequest: z.ZodObject<any> = z.object({
  firmwareSettings: FirmwareUpdateSettingsType.optional(),
  firmwareUpdateSettings: FirmwareUpdateSettingsType.optional(),
  firmwareUpdateSettingsOverrides: z.array(FirmwareUpdateSettingsOverrideType).optional()
});
const Org_UpdateFirmwareSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateGeneralSettingsWSRequest: z.ZodObject<any> = z.object({
  accountBillingContactEmail: z.string().optional(),
  accountOwnerEmail: z.string().optional(),
  accountTechnicalContactEmail: z.string().optional(),
  accountTechnicalContacts: z.array(z.string()).optional(),
  defaultPlayerViewLiveType: PlayerViewLiveTypeEnum.optional(),
  inactivityTimeout: z.number().int().optional(),
  name: z.string().optional(),
  uapSettings: UAPSettingsType.optional()
});
const Org_UpdateGeneralSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateMFASettingsWSRequest: z.ZodObject<any> = z.object({
  mfaEnabled: z.boolean().optional(),
  v3AuthNumDaysSkip2FAForTrustedDevices: z.number().int().optional()
});
const Org_UpdateMFASettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  org: OrgV2Type.optional()
});
const Org_UpdateOrgAudioAnalysisPolicyWSRequest: z.ZodObject<any> = z.object({
  audioAnalysisEnabled: z.boolean().optional()
});
const Org_UpdateOrgAudioAnalysisPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateOrgAudioRecordingPolicyWSRequest: z.ZodObject<any> = z.object({
  audioRecordingEnabled: z.boolean().optional()
});
const Org_UpdateOrgAudioRecordingPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateOrgIntegrationsWSRequest: z.ZodObject<any> = z.object({
  orgIntegrations: OrgIntegrationsType.optional()
});
const Org_UpdateOrgIntegrationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateOrgLLMUsagePolicyWSRequest: z.ZodObject<any> = z.object({
  llmUsageEnabled: z.boolean().optional()
});
const Org_UpdateOrgLLMUsagePolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const UserNotificationSelectiveUpdateV2: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  timeFrames: z.array(NotificationTimeFrame).optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const Org_UpdateOrgNotificationTemplateV2WSRequest: z.ZodObject<any> = z.object({
  summaryEmailEnabled: z.boolean().optional(),
  templateUpdate: UserNotificationSelectiveUpdateV2.optional()
});
const Org_UpdateOrgNotificationTemplateV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateOrgNotificationTemplateWSRequest: z.ZodObject<any> = z.object({
  notificationIntervalsV2: z.array(NotificationIntervalV2Type).optional(),
  summaryEmailEnabled: z.boolean().optional()
});
const Org_UpdateOrgNotificationTemplateWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateOrgWSRequest: z.ZodObject<any> = z.object({
  org: OrgType.optional()
});
const Org_UpdateOrgWSResponse: z.ZodObject<any> = z.object({
  samlEntityIdUniquenessConstraintFailure: z.boolean().optional(),
  teamNameNotAssignedFailure: z.boolean().optional(),
  teamNameUniquenessConstraintFailure: z.boolean().optional()
});
const Org_UpdatePendingRegistrationRequest: z.ZodObject<any> = z.object({
  hardwareUuid: z.string().optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional()
});
const Org_UpdatePendingRegistrationResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateSAMLSettingsV2WSRequest: z.ZodObject<any> = z.object({
  samlSettings: z.array(OrgSamlSettingsType).optional()
});
const Org_UpdateSAMLSettingsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateSAMLSettingsWSRequest: z.ZodObject<any> = z.object({
  samlSettings: OrgSamlSettingsType.optional()
});
const Org_UpdateSAMLSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Org_UpdateSCIMSettingsForOrgWSRequest: z.ZodObject<any> = z.object({
  addUsersOnRoleMismatch: z.boolean().optional(),
  rhombusKeyAppSettings: RhombusKeyAppSettingsType.optional(),
  sendWelcomeEmailToNewRhombusKeyUsers: z.boolean().optional(),
  sendWelcomeEmailToNewUsers: z.boolean().optional()
});
const Org_UpdateSCIMSettingsForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const ParameterizedHeader: z.ZodObject<any> = z.object({
  parameters: z.record(z.unknown()).optional(),
  value: z.string().optional()
});
const PartnerFunctionality = z.string();
const PartnerPermission = z.string();
const PartnerPermissionType: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const PartnerUserPermissionGroupType: z.ZodObject<any> = z.object({
  assignablePermissionGroups: z.array(z.string()).optional(),
  clientAssignablePermissionGroupsMap: z.record(z.unknown()).optional(),
  clientFunctionalityList: z.array(Functionality).optional(),
  clientPermissionMap: z.record(z.unknown()).optional(),
  description: z.string().optional(),
  functionalityList: z.array(PartnerFunctionality).optional(),
  mutable: z.boolean().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  superAdmin: z.boolean().optional(),
  uuid: z.string().optional()
});
const Partner_ClientCustomizationsType: z.ZodObject<any> = z.object({
  forceLowBandwidthOnAllCameras: z.boolean().optional(),
  inactivityTimeout: z.number().int().optional()
});
const Partner_ClientDeviceCustomizationsType: z.ZodObject<any> = z.object({
  forceLowBandwidthOnAllCameras: z.boolean().optional(),
  inactivityTimeout: z.number().int().optional()
});
const Partner_ConnectionCountType: z.ZodObject<any> = z.object({
  connectedCount: z.number().int().optional(),
  operationalCount: z.number().int().optional(),
  totalCount: z.number().int().optional()
});
const Partner_CreatePartnerClientWSRequest: z.ZodObject<any> = z.object({
  clientContactEmail: z.string().optional(),
  clientContactName: z.string().optional(),
  clientOrgName: z.string().optional(),
  suppressWelcomeEmail: z.boolean().optional()
});
const Partner_PartnerWebResponseStatusEnum = z.string();
const Partner_CreatePartnerClientWSResponse: z.ZodObject<any> = z.object({
  clientOrgUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: Partner_PartnerWebResponseStatusEnum.optional()
});
const Partner_CustomizeClientDeviceWSRequest: z.ZodObject<any> = z.object({
  clientDeviceUuid: z.string().optional(),
  clientOrgUuid: z.string().optional(),
  configUpdate: Deviceconfig_userconfig_IExternalUpdateableAudioVideoUserConfig.optional(),
  customizations: Partner_ClientDeviceCustomizationsType.optional()
});
const Partner_CustomizeClientDeviceWSResponse: z.ZodObject<any> = z.object({
  customizations: Partner_ClientCustomizationsType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Partner_CustomizeClientWSRequest: z.ZodObject<any> = z.object({
  clientOrgUuid: z.string().optional(),
  customizations: Partner_ClientCustomizationsType.optional()
});
const Partner_CustomizeClientWSResponse: z.ZodObject<any> = z.object({
  customizations: Partner_ClientCustomizationsType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Partner_DeleteClientWebRequest: z.ZodObject<any> = z.object({
  clientOrgUuid: z.string().optional()
});
const Partner_DeleteClientWebResponse = z.record(z.unknown());
const Partner_DeviceWithPartnerDetailsType: z.ZodObject<any> = z.object({
  device: DeviceTypeV2.optional(),
  partnerControlledHardware: z.boolean().optional(),
  reassignable: z.boolean().optional()
});
const Partner_GetClientDevicesWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const Partner_GetClientDevicesWSResponse: z.ZodObject<any> = z.object({
  devices: z.array(Partner_DeviceWithPartnerDetailsType).optional()
});
const Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSFailureResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSSuccessResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSBaseResponse: z.ZodObject<any> = z.object({
  type: z.string()
});
const Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSRequest: z.ZodObject<any> = z.object({
  token: z.string().optional()
});
const Partner_GetClientSummaryInfoWSRequest: z.ZodObject<any> = z.object({
  clientOrgUuid: z.string().optional()
});
const Partner_GetClientSummaryInfoWSResponse: z.ZodObject<any> = z.object({
  accountOwner: WrappedRhombusOrgUserType.optional(),
  clientDeviceStatusMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  licenseV2Enabled: z.boolean().optional(),
  locationCount: z.number().int().optional(),
  manuallySendLicenseExpirationEmailEnabled: z.boolean().optional(),
  recentPolicyAlertCount: z.number().int().optional()
});
const Partner_GetListOfAllClientDevicesRequest = z.record(z.unknown());
const Partner_GetListOfAllClientDevicesResponse: z.ZodObject<any> = z.object({
  listOfAllClientDevices: z.array(DeviceTypeV2).optional()
});
const Partner_GetListOfControlledHardwareRequest = z.record(z.unknown());
const Partner_UnregisteredControlledHardwareType: z.ZodObject<any> = z.object({
  deviceModel: HardwareVariationEnum.optional(),
  deviceType: DeviceTypeEnum.optional(),
  macAddress: z.string().optional(),
  serialNumber: z.string().optional()
});
const Partner_GetListOfControlledHardwareResponse: z.ZodObject<any> = z.object({
  controlledHardwareList: z.array(Partner_UnregisteredControlledHardwareType).optional()
});
const Partner_GetPartnerClientMobileAccountAccessRequest: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional(),
  clientOrgUuid: z.string().optional()
});
const Partner_GetPartnerClientMobileAccountAccessResponse: z.ZodObject<any> = z.object({
  clientAccountAccessSessionId: z.string().optional()
});
const Partner_GetPartnerClientsStatusMapWSRequest = z.record(z.unknown());
const Partner_GetPartnerClientsStatusMapWSResponse: z.ZodObject<any> = z.object({
  clientDeviceStatusMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Partner_GetPartnerClientsWSRequest = z.record(z.unknown());
const Partner_PartnerClientWebType: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional(),
  clientAccessAllowed: z.boolean().optional(),
  clientAccountAccessUrl: z.string().optional(),
  clientOrgName: z.string().optional(),
  clientOrgUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  totalAudioGateways: z.number().int().optional(),
  totalBadgeReaders: z.number().int().optional(),
  totalCameras: z.number().int().optional(),
  totalClimateSensors: z.number().int().optional(),
  totalDoorSensors: z.number().int().optional(),
  totalLocations: z.number().int().optional(),
  totalOccupancySensors: z.number().int().optional(),
  totalProximitySensors: z.number().int().optional()
});
const Partner_GetPartnerClientsWSResponse: z.ZodObject<any> = z.object({
  clients: z.array(Partner_PartnerClientWebType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Partner_GetPartnerUsersInOrgWSRequest = z.record(z.unknown());
const Partner_GetPartnerUsersInOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  notificationSettings: z.array(PartnerNotificationSettingsType).optional(),
  notificationSettingsV2: z.array(PartnerNotificationSettingsV2).optional(),
  partnerPermissions: z.array(PartnerPermissionType).optional(),
  partnerUsers: z.array(WrappedRhombusOrgUserType).optional()
});
const Partner_GetShipmentsWSRequest: z.ZodObject<any> = z.object({
  clientOrgUuid: z.string().optional(),
  endTimeSec: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Partner_GetShipmentsWSResponse: z.ZodObject<any> = z.object({
  customerShipmentList: z.array(CustomerShipmentType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Partner_GrantSupportAccessToClientWSRequest: z.ZodObject<any> = z.object({
  clientOrgUuid: z.string().optional()
});
const Partner_GrantSupportAccessToClientWSResponse: z.ZodObject<any> = z.object({
  errMessage: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Partner_ReassignDeviceOrgWSRequest: z.ZodObject<any> = z.object({
  serialNumbers: z.array(z.string()).optional(),
  sourceOrgUuid: z.string(),
  targetOrgUuid: z.string()
});
const Partner_ReassignDeviceOrgWSResponse: z.ZodObject<any> = z.object({
  statuses: z.record(z.unknown()).optional()
});
const Partner_RegisterDealWSRequest: z.ZodObject<any> = z.object({
  details: z.record(z.unknown()).optional()
});
const Partner_RegisterDealWSResponse: z.ZodObject<any> = z.object({
  clients: z.array(Partner_PartnerClientWebType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Partner_RequestAccessToClientAccountRequest: z.ZodObject<any> = z.object({
  clientEmail: z.string().optional()
});
const Partner_RequestAccessToClientAccountResponse: z.ZodObject<any> = z.object({
  success: z.boolean().optional()
});
const Partner_RequestAccessToClientAccountV2Request: z.ZodObject<any> = z.object({
  clientEmail: z.string().optional()
});
const Partner_RequestAccessToClientAccountV2Response: z.ZodObject<any> = z.object({
  success: z.boolean().optional()
});
const Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSFailureResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSSuccessResponse: z.ZodObject<any> = z.object({
  type: z.string().optional()
});
const Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSBaseResponse: z.ZodObject<any> = z.object({
  type: z.string()
});
const Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSRequest: z.ZodObject<any> = z.object({
  accessGrantedByClient: z.boolean().optional(),
  orgUuid: z.string().optional(),
  token: z.string().optional()
});
const Partner_UpdateManuallySendLicenseExpirationEmailWSRequest: z.ZodObject<any> = z.object({
  manuallySendLicenseExpirationEmail: z.boolean().optional(),
  orgUuid: z.string().optional()
});
const Partner_UpdateManuallySendLicenseExpirationEmailWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Password_ForgotPasswordWSRequest: z.ZodObject<any> = z.object({
  email: z.string().optional(),
  googleCaptchaSource: GoogleCaptchaSourceEnum.optional(),
  googlesCaptchaResponse: z.string().optional()
});
const Password_ForgotPasswordWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failureReason: z.string().optional(),
  success: z.boolean().optional()
});
const Password_ResetPasswordWSRequest: z.ZodObject<any> = z.object({
  password: z.string().optional(),
  token: z.string().optional()
});
const Password_ResetPasswordWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failureReason: z.string().optional(),
  failureReasonType: z.string().optional(),
  success: z.boolean().optional()
});
const Password_UserSignupWSRequest: z.ZodObject<any> = z.object({
  eulaAccepted: z.boolean().optional(),
  password: z.string().optional(),
  token: z.string().optional()
});
const Password_UserSignupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  failureReason: z.string().optional(),
  success: z.boolean().optional()
});
const PeopleCountEventType: z.ZodObject<any> = z.object({
  boundingBoxes: z.array(BoundingBoxType).optional(),
  deviceLabels: z.array(z.string()).optional(),
  deviceUuid: z.string().optional(),
  eventTimestamp: z.number().int().optional(),
  imageS3Key: z.string().optional(),
  locationLabels: z.array(z.string()).optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  peopleCount: z.number().int().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  uuid: z.string().optional()
});
const UserPermissionType: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const Permission_AssignUserPermissionWSRequest: z.ZodObject<any> = z.object({
  userPermission: UserPermissionType.optional()
});
const Permission_AssignUserPermissionWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Permission_CreatePartnerPermissionGroupWSRequest: z.ZodObject<any> = z.object({
  partnerPermissionGroup: PartnerUserPermissionGroupType.optional()
});
const Permission_CreatePartnerPermissionGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const Permission_CreatePermissionGroupWSRequest: z.ZodObject<any> = z.object({
  userPermissionGroup: UserPermissionGroupType.optional()
});
const Permission_CreatePermissionGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  uuid: z.string().optional()
});
const Permission_DeletePartnerPermissionGroupWSRequest: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional()
});
const Permission_DeletePartnerPermissionGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Permission_DeletePermissionGroupWSRequest: z.ZodObject<any> = z.object({
  groupUuid: z.string().optional()
});
const Permission_DeletePermissionGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Permission_GetPartnerPermissionGroupWSResponse: z.ZodObject<any> = z.object({
  clientPermissionGroupMap: z.record(z.unknown()).optional(),
  clientPermissionsGroupMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  groupMembership: z.record(z.unknown()).optional(),
  permissionGroups: z.array(PartnerUserPermissionGroupType).optional()
});
const Permission_GetPartnerPermissionGroupsWSRequest = z.record(z.unknown());
const Permission_GetPermissionGroupsForOrgWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional()
});
const Permission_GetPermissionGroupsForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  permissionGroups: z.array(UserPermissionGroupType).optional()
});
const Permission_GetPermissionGroupsWSRequest = z.record(z.unknown());
const Permission_GetPermissionGroupsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  groupMembership: z.record(z.unknown()).optional(),
  partnerMembership: z.record(z.unknown()).optional(),
  permissionGroups: z.array(UserPermissionGroupType).optional()
});
const Permission_GetPermissionsForCurrentPartnerWSRequest = z.record(z.unknown());
const Permission_GetPermissionsForCurrentPartnerWSResponse: z.ZodObject<any> = z.object({
  assignablePermissionGroups: z.array(z.string()).optional(),
  clientFunctionalityList: z.array(Functionality).optional(),
  clientPermissionMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  functionalityList: z.array(PartnerFunctionality).optional(),
  permissionGroupName: z.string().optional(),
  superAdmin: z.boolean().optional()
});
const Permission_GetPermissionsForCurrentUserWSRequest = z.record(z.unknown());
const Permission_GetPermissionsForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  accessControlLocationAccessMap: z.record(z.unknown()).optional(),
  accessMap: z.record(z.unknown()).optional(),
  assignablePermissionGroups: z.array(z.string()).optional(),
  deviceAccessMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  functionalityList: z.array(Functionality).optional(),
  installer: z.boolean().optional(),
  locationAccessMap: z.record(z.unknown()).optional(),
  locationGranularAccessMap: z.record(z.unknown()).optional(),
  permissionGroupName: z.string().optional(),
  superAdmin: z.boolean().optional()
});
const Permission_UpdatePartnerPermissionGroupWSRequest: z.ZodObject<any> = z.object({
  partnerPermissionGroup: PartnerUserPermissionGroupType.optional()
});
const Permission_UpdatePartnerPermissionGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Permission_UpdatePermissionGroupWSRequest: z.ZodObject<any> = z.object({
  userPermissionGroup: UserPermissionGroupType.optional()
});
const Permission_UpdatePermissionGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const PhysicalPortEnumType = z.string();
const PhysicalPortType: z.ZodObject<any> = z.object({
  boardNum: z.number().int().optional(),
  componentPortTypeUsageMap: z.record(z.unknown()).optional(),
  label: z.string().optional(),
  portNum: z.number().int().optional(),
  supportedPortTypes: z.array(PhysicalPortEnumType).optional()
});
const PointType: z.ZodObject<any> = z.object({
  x: z.number().int().optional(),
  y: z.number().int().optional()
});
const Policy_MinimalAccessControlledDoorScheduledTriggerType: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional(),
  triggerSet: z.array(ActivityEnum).optional()
});
const Policy_MinimalAccessControlledDoorPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_MinimalAccessControlledDoorScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_CreateAccessControlledDoorPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalAccessControlledDoorPolicyType.optional()
});
const Policy_CreateAccessControlledDoorPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyUuid: z.string().optional()
});
const Policy_ExternalAudioTriggerType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  threshold: z.number().optional()
});
const Policy_MinimalAudioScheduledTriggerType: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional(),
  triggerSet: z.array(Policy_ExternalAudioTriggerType).optional()
});
const Policy_MinimalAudioPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_MinimalAudioScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_CreateAudioPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalAudioPolicyType.optional()
});
const Policy_CreateAudioPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyUuid: z.string().optional()
});
const Policy_MinimalCameraScheduledTriggerType: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional(),
  triggerSet: z.array(CameraTriggerType).optional()
});
const Policy_MinimalCameraPolicyV2Type: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_MinimalCameraScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_CreateCameraPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalCameraPolicyV2Type.optional()
});
const Policy_CreateCameraPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyUuid: z.string().optional()
});
const Policy_MinimalClimateScheduledTriggerType: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional(),
  triggerSet: z.array(ClimateTriggerType).optional()
});
const Policy_MinimalClimatePolicyType: z.ZodObject<any> = z.object({
  backoffAlertSecs: z.record(z.unknown()).optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_MinimalClimateScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_CreateClimatePolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalClimatePolicyType.optional()
});
const Policy_CreateClimatePolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyUuid: z.string().optional()
});
const Policy_MinimalDoorScheduledTriggerType: z.ZodObject<any> = z.object({
  ajarThresholdSec: z.number().int().optional(),
  scheduleUuid: z.string().optional(),
  triggerSet: z.array(ActivityEnum).optional()
});
const Policy_MinimalDoorPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_MinimalDoorScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_CreateDoorPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalDoorPolicyType.optional()
});
const Policy_CreateDoorPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyUuid: z.string().optional()
});
const Policy_MinimalOccupancyScheduledTriggerType: z.ZodObject<any> = z.object({
  occupancyThresholdSec: z.number().int().optional(),
  scheduleUuid: z.string().optional(),
  triggerSet: z.array(ActivityEnum).optional(),
  vacancyThresholdSec: z.number().int().optional()
});
const Policy_MinimalOccupancyPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_MinimalOccupancyScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_CreateOccupancyPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalOccupancyPolicyType.optional()
});
const Policy_CreateOccupancyPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyUuid: z.string().optional()
});
const Policy_CreatePolicyAddendumForLocationRequest: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  durationSec: z.number().int().optional(),
  locationUuid: z.string().optional(),
  scheduledTimestampSec: z.number().int().optional()
});
const Policy_CreatePolicyAddendumForLocationResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_CreatePolicyAddendumsForDevicesRequest: z.ZodObject<any> = z.object({
  activities: z.array(ActivityEnum).optional(),
  deviceUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  scheduledTimestampSec: z.number().int().optional()
});
const Policy_CreatePolicyAddendumsForDevicesResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const ProximityTriggerType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  locationUuids: z.array(z.string()).optional()
});
const Policy_MinimalProximityScheduledTriggerType: z.ZodObject<any> = z.object({
  departureThresholdSec: z.number().int().optional(),
  scheduleUuid: z.string().optional(),
  triggerSet: z.array(ProximityTriggerType).optional()
});
const Policy_MinimalProximityPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_MinimalProximityScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_CreateProximityPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalProximityPolicyType.optional()
});
const Policy_CreateProximityPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyUuid: z.string().optional()
});
const Policy_CreateScheduleWSRequest: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional()
});
const Policy_CreateScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  scheduleUuid: z.string().optional()
});
const Policy_ExternalVideoIntercomTriggerType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  faceAlertLabelSet: z.array(z.string()).optional(),
  faceAlertUnidentified: z.boolean().optional(),
  faceAllowedLabelSet: z.array(z.string()).optional(),
  lufsThreshold: z.number().optional(),
  peopleCountThreshold: z.number().int().optional(),
  vehicleAlertLabelSet: z.array(z.string()).optional(),
  vehicleAlertUnidentified: z.boolean().optional(),
  vehicleAllowedLabelSet: z.array(z.string()).optional()
});
const Policy_MinimalVideoIntercomScheduledTriggerType: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional(),
  triggerSet: z.array(Policy_ExternalVideoIntercomTriggerType).optional()
});
const Policy_MinimalVideoIntercomPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_MinimalVideoIntercomScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_CreateVideoIntercomPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalVideoIntercomPolicyType.optional()
});
const Policy_CreateVideoIntercomPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyUuid: z.string().optional()
});
const Policy_DeleteAccessControlledDoorPolicyWSRequest: z.ZodObject<any> = z.object({
  policyUuid: z.string().optional()
});
const Policy_DeleteAccessControlledDoorPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteAudioPolicyWSRequest: z.ZodObject<any> = z.object({
  policyUuid: z.string().optional()
});
const Policy_DeleteAudioPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteCameraPolicyWSRequest: z.ZodObject<any> = z.object({
  policyUuid: z.string().optional()
});
const Policy_DeleteCameraPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteClimatePolicyWSRequest: z.ZodObject<any> = z.object({
  policyUuid: z.string().optional()
});
const Policy_DeleteClimatePolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteDevicePolicyAddendumsWSRequest: z.ZodObject<any> = z.object({
  uuids: z.array(z.string()).optional()
});
const Policy_DeleteDevicePolicyAddendumsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteDoorPolicyWSRequest: z.ZodObject<any> = z.object({
  policyUuid: z.string().optional()
});
const Policy_DeleteDoorPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteLocationPolicyAddendumWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Policy_DeleteLocationPolicyAddendumWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteOccupancyPolicyWSRequest: z.ZodObject<any> = z.object({
  policyUuid: z.string().optional()
});
const Policy_DeleteOccupancyPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeletePolicyPauseSettingWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Policy_DeletePolicyPauseSettingWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteProximityPolicyWSRequest: z.ZodObject<any> = z.object({
  policyUuid: z.string().optional()
});
const Policy_DeleteProximityPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteScheduleWSRequest: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional()
});
const Policy_DeleteScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_DeleteVideoIntercomPolicyWSRequest: z.ZodObject<any> = z.object({
  policyUuid: z.string().optional()
});
const Policy_DeleteVideoIntercomPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policyUuid: z.string().optional()
});
const Policy_ExternalAudioScheduledTriggerType: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(Policy_ExternalAudioTriggerType).optional()
});
const Policy_ExternalAudioPolicyType: z.ZodObject<any> = z.object({
  defaultTriggers: z.array(Policy_ExternalAudioTriggerType).optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_ExternalAudioScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_ExternalVideoIntercomScheduledTriggerType: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(Policy_ExternalVideoIntercomTriggerType).optional()
});
const Policy_ExternalVideoIntercomPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(Policy_ExternalVideoIntercomScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_FindSchedulesWSRequest = z.record(z.unknown());
const Policy_FindSchedulesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  schedules: z.array(WeeklyRepeatingScheduleType).optional()
});
const Policy_GetAccessControlledDoorPoliciesWSRequest = z.record(z.unknown());
const Policy_GetAccessControlledDoorPoliciesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policies: z.array(AccessControlledDoorPolicyType).optional()
});
const Policy_GetAudioPoliciesWSRequest = z.record(z.unknown());
const Policy_GetAudioPoliciesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policies: z.array(Policy_ExternalAudioPolicyType).optional()
});
const Policy_GetCameraPoliciesWSRequest = z.record(z.unknown());
const Policy_GetCameraPoliciesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policies: z.array(CameraPolicyV2Type).optional()
});
const Policy_GetClimatePoliciesWSRequest = z.record(z.unknown());
const Policy_GetClimatePoliciesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policies: z.array(ClimatePolicyType).optional()
});
const Policy_GetDoorPoliciesWSRequest = z.record(z.unknown());
const Policy_GetDoorPoliciesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policies: z.array(DoorPolicyType).optional()
});
const Policy_GetOccupancyPoliciesWSRequest = z.record(z.unknown());
const Policy_GetOccupancyPoliciesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policies: z.array(OccupancyPolicyType).optional()
});
const Policy_GetPoliciesUsingScheduleWSRequest: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional()
});
const ProximityScheduledTriggerType: z.ZodObject<any> = z.object({
  departureThresholdSec: z.number().int().optional(),
  egressThresholdMetersMap: z.record(z.unknown()).optional(),
  ingressThresholdMetersMap: z.record(z.unknown()).optional(),
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(ProximityTriggerType).optional()
});
const ProximityPolicyType: z.ZodObject<any> = z.object({
  defaultDepartureThresholdSec: z.number().int().optional(),
  defaultTriggers: z.array(ProximityTriggerType).optional(),
  description: z.string().optional(),
  egressThresholdMetersMap: z.record(z.unknown()).optional(),
  ingressThresholdMetersMap: z.record(z.unknown()).optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(ProximityScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const VideoIntercomTriggerType: z.ZodObject<any> = z.object({
  activity: ActivityEnum.optional(),
  faceAlertLabelSet: z.array(z.string()).optional(),
  faceAlertUnidentified: z.boolean().optional(),
  faceAllowedLabelSet: z.array(z.string()).optional(),
  lufsThreshold: z.number().int().optional(),
  peopleCountThreshold: z.number().int().optional(),
  vehicleAlertLabelSet: z.array(z.string()).optional(),
  vehicleAlertUnidentified: z.boolean().optional(),
  vehicleAllowedLabelSet: z.array(z.string()).optional()
});
const VideoIntercomScheduledTriggerType: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional(),
  triggerSet: z.array(VideoIntercomTriggerType).optional()
});
const VideoIntercomPolicyType: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  scheduledTriggers: z.array(VideoIntercomScheduledTriggerType).optional(),
  uuid: z.string().optional()
});
const Policy_GetPoliciesUsingScheduleWSResponse: z.ZodObject<any> = z.object({
  accessControlledDoorPolicyList: z.array(AccessControlledDoorPolicyType).optional(),
  audioPolicyList: z.array(AudioPolicyType).optional(),
  cameraPolicyList: z.array(CameraPolicyV2Type).optional(),
  climatePolicyList: z.array(ClimatePolicyType).optional(),
  doorPolicyList: z.array(DoorPolicyType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  occupancyPolicyList: z.array(OccupancyPolicyType).optional(),
  proximityPolicyList: z.array(ProximityPolicyType).optional(),
  videoIntercomPolicyList: z.array(VideoIntercomPolicyType).optional()
});
const Policy_GetPolicyAddendumsWSRequest = z.record(z.unknown());
const Policy_GetPolicyAddendumsWSResponse: z.ZodObject<any> = z.object({
  deviceAddendumsMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  locationAddendumsMap: z.record(z.unknown()).optional()
});
const Policy_GetPolicyPauseSettingsWSRequest = z.record(z.unknown());
const Policy_GetPolicyPauseSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policiesPausedForComponentCompositesMap: z.record(z.unknown()).optional(),
  policiesPausedForDevicesMap: z.record(z.unknown()).optional(),
  policiesPausedForLocationsMap: z.record(z.unknown()).optional()
});
const Policy_GetProximityPoliciesWSRequest = z.record(z.unknown());
const Policy_GetProximityPoliciesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policies: z.array(ProximityPolicyType).optional()
});
const Policy_GetVideoIntercomPoliciesWSRequest = z.record(z.unknown());
const Policy_GetVideoIntercomPoliciesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  policies: z.array(Policy_ExternalVideoIntercomPolicyType).optional()
});
const Policy_PauseAlertPolicyWSRequest: z.ZodObject<any> = z.object({
  componentCompositeUuids: z.array(z.string()).optional(),
  deviceUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  locationUuids: z.array(z.string()).optional(),
  scheduledTimestampSec: z.number().int().optional()
});
const Policy_PauseAlertPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_UpdateAccessControlledDoorPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalAccessControlledDoorPolicyType.optional()
});
const Policy_UpdateAccessControlledDoorPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_UpdateAudioPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalAudioPolicyType.optional()
});
const Policy_UpdateAudioPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_UpdateCameraPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalCameraPolicyV2Type.optional()
});
const Policy_UpdateCameraPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_UpdateClimatePolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalClimatePolicyType.optional()
});
const Policy_UpdateClimatePolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_UpdateDoorPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalDoorPolicyType.optional()
});
const Policy_UpdateDoorPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_UpdateOccupancyPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalOccupancyPolicyType.optional()
});
const Policy_UpdateOccupancyPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_UpdateProximityPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalProximityPolicyType.optional()
});
const Policy_UpdateProximityPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_UpdateScheduleWSRequest: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional()
});
const Policy_UpdateScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Policy_UpdateVideoIntercomPolicyWSRequest: z.ZodObject<any> = z.object({
  policy: Policy_MinimalVideoIntercomPolicyType.optional()
});
const Policy_UpdateVideoIntercomPolicyWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const PosIntegrationInfoType: z.ZodObject<any> = z.object({
  assignedCameraList: z.array(z.string()).optional(),
  posName: z.string().optional()
});
const Trigger: z.ZodObject<any> = z.object({
  activity: z.string().optional(),
  value: z.string().optional()
});
const PromptConfigurationType: z.ZodObject<any> = z.object({
  active: z.boolean().optional(),
  cameraConfigurations: z.array(CameraConfiguration).optional(),
  checkCondition: CheckCondition.optional(),
  description: z.string().optional(),
  generateAlertForActionNewlyAddedCameras: z.boolean().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  prompt: z.string().optional(),
  promptType: z.string().optional(),
  reportsEnabled: z.boolean().optional(),
  scheduleUuid: z.string().optional(),
  shortName: z.string().optional(),
  trigger: Trigger.optional(),
  uuid: z.string().optional()
});
const ProximityArrivedActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const ProximityDepartedActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const ProximityEventType: z.ZodObject<any> = z.object({
  baseStationUuid: z.string().optional(),
  batteryPercentage: z.number().int().optional(),
  bleDeviceUuid: z.string().optional(),
  bleRssi: z.number().int().optional(),
  closeBaseStations: z.array(z.string()).optional(),
  endTimeMs: z.number().int().optional(),
  gpsLocation: GeodeticCoordinates.optional(),
  locationUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  startTimeMs: z.number().int().optional(),
  status: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional()
});
const ProximityTagLocomotionEventType: z.ZodObject<any> = z.object({
  baseStationUuid: z.string().optional(),
  gpsLocation: GeodeticCoordinates.optional(),
  locationUuid: z.string().optional(),
  movement: z.string().optional(),
  orgUuid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  tagUuid: z.string().optional(),
  timestampMs: z.number().int().optional()
});
const ProximityTagTimeSeriesDataPointType: z.ZodObject<any> = z.object({
  dateLocal: z.string().optional(),
  tagUuid: z.string().optional(),
  uuid: z.string().optional()
});
const Proximity_GetLocomotionEventsForTagWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  movementFilter: z.string().optional(),
  tagUuid: z.string().optional()
});
const Proximity_GetLocomotionEventsForTagWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  locomotionEvents: z.array(ProximityTagLocomotionEventType).optional()
});
const Proximity_GetMinimalProximityStatesWSRequest = z.record(z.unknown());
const Proximity_ProximityHealthEnum = z.string();
const Proximity_ProximityHealthDetailsEnum = z.string();
const Proximity_MinimalProximityStateType: z.ZodObject<any> = z.object({
  batteryPercent: z.number().int().optional(),
  createdAtMillis: z.number().int().optional(),
  firmwareVersion: z.string().optional(),
  gpsLocation: GeodeticCoordinates.optional(),
  health: Proximity_ProximityHealthEnum.optional(),
  healthDetails: Proximity_ProximityHealthDetailsEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  imageUrl: z.string().optional(),
  lastSeenSec: z.number().int().optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  signalStrength: z.number().int().optional(),
  status: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  tagUuid: z.string().optional()
});
const Proximity_GetMinimalProximityStatesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  proximityStates: z.array(Proximity_MinimalProximityStateType).optional()
});
const Proximity_GetProximityEventsForTagWSRequest: z.ZodObject<any> = z.object({
  createdAfterMs: z.number().int().optional(),
  createdBeforeMs: z.number().int().optional(),
  limit: z.number().int().optional(),
  statusFilter: z.string().optional(),
  tagUuid: z.string().optional()
});
const Proximity_GetProximityEventsForTagWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  proximityEvents: z.array(ProximityEventType).optional()
});
const Proximity_UpdateProximitySensorDetailsWSRequest: z.ZodObject<any> = z.object({
  deletedUpdated: z.boolean().optional(),
  description: z.string().optional(),
  descriptionUpdated: z.boolean().optional(),
  imageUrl: z.string().optional(),
  imageUrlUpdated: z.boolean().optional(),
  name: z.string().optional(),
  nameUpdated: z.boolean().optional(),
  policyUuid: z.string().optional(),
  policyUuidUpdated: z.boolean().optional(),
  uuid: z.string().optional()
});
const Proximity_UpdateProximitySensorDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Rapidsos_GetNearbyFeedsRequest: z.ZodObject<any> = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  width: z.number().int().optional()
});
const Rapidsos_GetNearbyFeedsResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  streamUrls: z.array(z.string()).optional()
});
const RegionCrossingActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const Relay_AssignThirdPartyCameraToNVRWSRequest: z.ZodObject<any> = z.object({
  discoveredCameraMacAddress: z.string().optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  nvruuid: z.string().optional(),
  rtspUrl: z.string().optional()
});
const Relay_AssignThirdPartyCameraToNVRWSResponse: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Relay_AssignThirdPartyCameraToRelayCameraWSRequest: z.ZodObject<any> = z.object({
  discoveredCameraMacAddress: z.string().optional(),
  locationUuid: z.string().optional(),
  name: z.string().optional(),
  rtspUrl: z.string().optional()
});
const Relay_AssignThirdPartyCameraToRelayCameraWSResponse: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Relay_AuthenticateThirdPartyCameraWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  password: z.string().optional(),
  rtspUrl: z.string().optional(),
  thirdPartyCameraMacAddress: z.string().optional(),
  trySavedCredentials: z.boolean().optional(),
  username: z.string().optional()
});
const Relay_AuthenticateThirdPartyCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  result: DiscoveredThirdPartyCameraType.optional(),
  rtspUrlStatus: z.string().optional()
});
const Relay_CreateThirdPartyCameraPasswordWSRequest: z.ZodObject<any> = z.object({
  notes: z.string().optional(),
  password: z.string().optional(),
  username: z.string().optional()
});
const Relay_CreateThirdPartyCameraPasswordWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  passwordUuid: z.string().optional()
});
const Relay_DeleteThirdPartyCameraPasswordWSRequest: z.ZodObject<any> = z.object({
  passwordUuid: z.string().optional()
});
const Relay_DeleteThirdPartyCameraPasswordWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Relay_ExternalRtspEndpoint: z.ZodObject<any> = z.object({
  lastRtspUrlStatus: z.string().optional(),
  password: z.string().optional(),
  rtspUrl: z.string().optional(),
  source: RtspEndpointSource.optional(),
  username: z.string().optional(),
  uuid: z.string().optional()
});
const Relay_DiscoveryWithUnassignedRtspEndpoints: z.ZodObject<any> = z.object({
  codec: z.string().optional(),
  ipAddress: z.string().optional(),
  macAddress: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  orgUuid: z.string().optional(),
  unassignedRtspEndpoints: z.array(Relay_ExternalRtspEndpoint).optional()
});
const Relay_ExecuteThirdPartyCameraDiscoveryWSRequest: z.ZodObject<any> = z.object({
  deviceFilter: z.array(z.string()).optional(),
  locationFilter: z.array(z.string()).optional()
});
const Relay_ExecuteThirdPartyCameraDiscoveryWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Relay_FindDefaultRtspUrlsByManufacturerWSRequest: z.ZodObject<any> = z.object({
  manufacturer: z.string().optional(),
  model: z.string().optional()
});
const Relay_FindDefaultRtspUrlsByManufacturerWSResponse: z.ZodObject<any> = z.object({
  defaultPaths: z.array(z.string()).optional(),
  defaultUrls: z.array(z.string()).optional()
});
const Relay_FindDiscoveriesWithUnassignedRtspEndpointsWSRequest = z.record(z.unknown());
const Relay_FindDiscoveriesWithUnassignedRtspEndpointsWSResponse: z.ZodObject<any> = z.object({
  discoveries: z.array(Relay_DiscoveryWithUnassignedRtspEndpoints).optional()
});
const Relay_GetAssignedThirdPartyCamerasWSRequest: z.ZodObject<any> = z.object({
  nvruuid: z.string().optional()
});
const Relay_GetAssignedThirdPartyCamerasWSResponse: z.ZodObject<any> = z.object({
  assignedCameras: z.array(CameraType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Relay_GetFullNVRStateWSRequest: z.ZodObject<any> = z.object({
  force: z.boolean().optional(),
  nvruuid: z.string().optional()
});
const Relay_GetFullNVRStateWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  fullNVRState: FullDeviceStateType.optional()
});
const Relay_GetImportThirdPartyCamerasFormatWSResponse: z.ZodObject<any> = z.object({
  example: z.string().optional(),
  explanation: z.string().optional()
});
const Relay_GetMinimalNVRStateListWSRequest = z.record(z.unknown());
const Relay_GetMinimalNVRStateListWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  nvrstates: z.array(MinimalNVRStateType).optional()
});
const Relay_GetMinimalThirdPartyCameraStateListWSRequest = z.record(z.unknown());
const Relay_MinimalThirdPartyCameraStateType: z.ZodObject<any> = z.object({
  assignedNVRUuid: z.string().optional(),
  assignedRelayCameraUuid: z.string().optional(),
  codec: z.string().optional(),
  connectionStatus: DeviceStatusEnum.optional(),
  createdAtMillis: z.number().int().optional(),
  defaultInterface: z.string().optional(),
  defaultInterfaceMac: z.string().optional(),
  directionRadians: z.number().optional(),
  discoveredByDeviceUuid: z.string().optional(),
  externalIPAddress: z.string().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  firmwareUpdateInProgress: z.boolean().optional(),
  firmwareVersion: z.string().optional(),
  floorNumber: z.number().int().optional(),
  healthStatus: DeviceStatusEnum.optional(),
  healthStatusDetails: DeviceHealthStatusDetailsEnum.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  lanAddresses: z.array(z.string()).optional(),
  lastRtspUrlStatus: z.string().optional(),
  lastVisibleLocationMs: z.record(z.unknown()).optional(),
  lastVisibleMs: z.record(z.unknown()).optional(),
  latitude: z.number().optional(),
  liveStreamShared: z.boolean().optional(),
  liveStreamsSharedCount: z.number().int().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  manufacturer: z.string().optional(),
  mediaRegion: z.string().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  model: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  policyUuid: z.string().optional(),
  region: z.string().optional(),
  rtspUrl: z.string().optional(),
  secondaryLanAddresses: z.array(z.string()).optional(),
  serialNumber: z.string().optional(),
  ssid: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  supportedFacets: z.array(DeviceFacet).optional(),
  uuid: z.string().optional(),
  wifiApMac: z.string().optional(),
  wifiBars: z.number().int().optional(),
  wifiSignalStrength: z.number().int().optional()
});
const Relay_GetMinimalThirdPartyCameraStateListWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  thirdPartyCameraStateList: z.array(Relay_MinimalThirdPartyCameraStateType).optional()
});
const Relay_GetNVRDetailsWSRequest: z.ZodObject<any> = z.object({
  nvruuids: z.array(z.string()).optional()
});
const Relay_NVRExternalType: z.ZodObject<any> = z.object({
  archiveRegion: z.string().optional(),
  cameraFramerate: z.number().int().optional(),
  createdAtMillis: z.number().int().optional(),
  customData: z.string().optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  deviceFacetRadians: z.record(z.unknown()).optional(),
  directionRadians: z.number().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  floorNumber: z.number().int().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  latitude: z.number().optional(),
  locationUuid: z.string().optional(),
  longitude: z.number().optional(),
  mediaStorageDeviceUuid: z.string().optional(),
  mummified: z.boolean().optional(),
  name: z.string().optional(),
  pending: z.boolean().optional(),
  policyUuid: z.string().optional(),
  serialNumber: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  type: DeviceTypeEnum.optional(),
  uuid: z.string().optional()
});
const Relay_GetNVRDetailsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  nvrs: z.array(Relay_NVRExternalType).optional()
});
const Relay_GetRtspEndpointsWSRequest: z.ZodObject<any> = z.object({
  discoveredCameraMacAddress: z.string().optional()
});
const Relay_GetRtspEndpointsWSResponse: z.ZodObject<any> = z.object({
  rtspEndpoints: z.array(Relay_ExternalRtspEndpoint).optional()
});
const Relay_GetThirdPartyCameraPasswordsWSRequest = z.record(z.unknown());
const ThirdPartyCameraPasswordType: z.ZodObject<any> = z.object({
  notes: z.string().optional(),
  orgUuid: z.string().optional(),
  password: z.string().optional(),
  username: z.string().optional(),
  uuid: z.string().optional()
});
const Relay_GetThirdPartyCameraPasswordsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  passwords: z.array(ThirdPartyCameraPasswordType).optional()
});
const Relay_ThirdPartyCameraImportResult: z.ZodObject<any> = z.object({
  discoveredThirdPartyCamera: DiscoveredThirdPartyCameraType.optional(),
  message: z.string().optional(),
  rtspUrl: z.string().optional(),
  urlStatus: z.string().optional()
});
const Relay_ImportThirdPartyCamerasWSResponse: z.ZodObject<any> = z.object({
  importResults: z.array(Relay_ThirdPartyCameraImportResult).optional(),
  messages: z.array(z.string()).optional()
});
const Relay_ManualDiscoverThirdPartyCameraWSRequest: z.ZodObject<any> = z.object({
  locationUuid: z.string().optional(),
  password: z.string().optional(),
  rtspUrl: z.string().optional(),
  trySavedCredentials: z.boolean().optional(),
  username: z.string().optional()
});
const Relay_ManualDiscoverThirdPartyCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  result: DiscoveredThirdPartyCameraType.optional(),
  rtspUrlStatus: z.string().optional()
});
const Relay_PTZMoveWSRequest: z.ZodObject<any> = z.object({
  thirdPartyCameraUuid: z.string().optional(),
  xmovementPermyriad: z.number().int().optional(),
  ymovementPermyriad: z.number().int().optional(),
  zmovementPermyriad: z.number().int().optional()
});
const Relay_PTZMoveWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Relay_PTZStatusWSRequest: z.ZodObject<any> = z.object({
  thirdPartyCameraUuid: z.string().optional()
});
const Relay_PTZStatusWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  xpositionPermyriad: z.number().int().optional(),
  ypositionPermyriad: z.number().int().optional(),
  zpositionPermyriad: z.number().int().optional()
});
const Relay_RebootNVRVWSRequest: z.ZodObject<any> = z.object({
  nvrUuid: z.string().optional()
});
const Relay_RebootNVRVWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  result: z.string().optional()
});
const Relay_UnassignThirdPartyCameraWSRequest: z.ZodObject<any> = z.object({
  nvruuid: z.string().optional(),
  rtspUrl: z.string().optional(),
  thirdPartyCameraMacAddress: z.string().optional()
});
const Relay_UnassignThirdPartyCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Relay_UnregisterNVRWSRequest: z.ZodObject<any> = z.object({
  nvruuid: z.string().optional()
});
const Relay_UnregisterNVRWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: z.string().optional()
});
const Relay_UpdateFirmwareWSStatus = z.string();
const Relay_UpdateNVRFirmwareWSRequest: z.ZodObject<any> = z.object({
  nvruuid: z.string().optional()
});
const Relay_UpdateNVRFirmwareWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  status: Relay_UpdateFirmwareWSStatus.optional()
});
const Relay_UpdateNVRVWSRequest: z.ZodObject<any> = z.object({
  customData: z.string().optional(),
  customDataUpdated: z.boolean().optional(),
  deleted: z.boolean().optional(),
  deletedUpdated: z.boolean().optional(),
  description: z.string().optional(),
  descriptionUpdated: z.boolean().optional(),
  directionRadians: z.number().optional(),
  directionRadiansUpdated: z.boolean().optional(),
  facetNameMap: z.record(z.unknown()).optional(),
  facetNameMapUpdated: z.boolean().optional(),
  floorNumber: z.number().int().optional(),
  floorNumberUpdated: z.boolean().optional(),
  latitude: z.number().optional(),
  latitudeUpdated: z.boolean().optional(),
  locationUuid: z.string().optional(),
  locationUuidUpdated: z.boolean().optional(),
  longitude: z.number().optional(),
  longitudeUpdated: z.boolean().optional(),
  mummified: z.boolean().optional(),
  mummifiedUpdated: z.boolean().optional(),
  name: z.string().optional(),
  nameUpdated: z.boolean().optional(),
  policyUuid: z.string().optional(),
  policyUuidUpdated: z.boolean().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  subLocationsHierarchyKeyUpdated: z.boolean().optional(),
  uuid: z.string().optional()
});
const Relay_UpdateNVRVWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const RenewalClaimKey: z.ZodObject<any> = z.object({
  claimEndDate: z.string().datetime({ offset: true }).optional(),
  claimStartDate: z.string().datetime({ offset: true }).optional(),
  createdOn: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  expirationEmailState: z.string().optional(),
  gracePeriodEndDate: z.string().datetime({ offset: true }).optional(),
  maskedClaimCode: z.string().optional(),
  orgUuid: z.string().optional(),
  renewedByClaimKeyUuid: z.string().optional(),
  requestId: z.string().optional(),
  returnHistory: z.array(ClaimKeyReturnEvent).optional(),
  state: z.string().optional(),
  trial: z.boolean().optional(),
  type: z.string().optional(),
  updatedOn: z.string().datetime({ offset: true }).optional(),
  uuid: z.string().optional()
});
const Report_AuditEventWeb: z.ZodObject<any> = z.object({
  FOOBAR: z.string().optional(),
  action: z.string().optional(),
  asi: z.string().optional(),
  clientType: Client.optional(),
  displayText: z.string().optional(),
  failure: z.boolean().optional(),
  orgUuid: z.string().optional(),
  principalName: z.string().optional(),
  principalType: z.string().optional(),
  principalUuid: z.string().optional(),
  selectiveUpdateStr: z.string().optional(),
  sourceCity: z.string().optional(),
  sourceCountry: z.string().optional(),
  sourceIp: z.string().optional(),
  sourceState: z.string().optional(),
  targetName: z.string().optional(),
  targetUuid: z.string().optional(),
  timestamp: z.string().datetime({ offset: true }).optional(),
  userAgent: z.string().optional(),
  uuid: z.string().optional()
});
const Report_GetAuditFeedForTargetWSRequest: z.ZodObject<any> = z.object({
  maxResults: z.number().int().optional(),
  targetUuid: z.string()
});
const Report_GetAuditFeedForTargetWSResponse: z.ZodObject<any> = z.object({
  auditEvents: z.array(Report_AuditEventWeb).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Report_GetAuditFeedWSRequest: z.ZodObject<any> = z.object({
  excludeActions: z.array(z.string()).optional(),
  includeActions: z.array(z.string()).optional(),
  timestampMsAfter: z.number().int().optional(),
  timestampMsBefore: z.number().int().optional()
});
const Report_GetAuditFeedWSResponse: z.ZodObject<any> = z.object({
  auditEvents: z.array(Report_AuditEventWeb).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Report_GetAverageReportWSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().optional(),
  interval: z.string().optional(),
  scope: z.string().optional(),
  startDate: z.string().optional(),
  type: z.string().optional(),
  uuid: z.string().optional()
});
const Report_GetAverageReportWSResponse: z.ZodObject<any> = z.object({
  average: z.number().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  groupAverageMap: z.record(z.unknown()).optional()
});
const Report_GetAverageReportsWSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().optional(),
  interval: z.string().optional(),
  scope: z.string().optional(),
  startDate: z.string().optional(),
  type: z.string().optional()
});
const Report_GetAverageReportsWSResponse: z.ZodObject<any> = z.object({
  averageMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  groupAverageMap: z.record(z.unknown()).optional()
});
const Report_GetCountReportV2WSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().optional(),
  endTimeMs: z.number().int().min(0).optional(),
  interval: z.string(),
  scope: z.string(),
  startDate: z.string().optional(),
  startTimeMs: z.number().int().min(0).optional(),
  types: z.array(z.string()),
  uuid: z.string().optional()
});
const Report_GetCountReportWSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().optional(),
  interval: z.string().optional(),
  scope: z.string().optional(),
  startDate: z.string().optional(),
  type: z.string().optional(),
  uuid: z.string().optional()
});
const TimeSeriesDataPointV2Type: z.ZodObject<any> = z.object({
  dateLocal: z.string().optional(),
  dateUtc: z.string().optional(),
  eventCountMap: z.record(z.unknown()).optional()
});
const Report_GetCountReportWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  timeSeriesDataPoints: z.array(TimeSeriesDataPointV2Type).optional()
});
const Report_GetCountReportsForDevicesAtLocationWSRequest: z.ZodObject<any> = z.object({
  endTimeMs: z.number().int().min(0),
  interval: z.string(),
  locationUuid: z.string(),
  startTimeMs: z.number().int().min(0),
  type: z.string()
});
const Report_GetCountReportsWSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().optional(),
  endTimeMs: z.number().int().min(0).optional(),
  interval: z.string(),
  scope: z.string(),
  startDate: z.string().optional(),
  startTimeMs: z.number().int().min(0).optional(),
  type: z.string()
});
const Report_GetCountReportsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  timeSeriesDataPointsMap: z.record(z.unknown()).optional()
});
const Report_GetCustomLLMNumericWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  reports: z.record(z.unknown()).optional()
});
const Report_GetCustomLLMReportWSRequest: z.ZodObject<any> = z.object({
  deviceFacetUuids: z.array(z.string()).optional(),
  endTimeMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  promptUuid: z.string().optional(),
  startTimeMs: z.number().int().optional()
});
const SceneQueryReportEvent: z.ZodObject<any> = z.object({
  checkCondition: z.boolean().optional(),
  timestampMs: z.number().int().optional(),
  value: z.string().optional()
});
const SceneQueryReport: z.ZodObject<any> = z.object({
  deviceFacetUuid: z.string().optional(),
  events: z.array(SceneQueryReportEvent).optional(),
  promptType: z.string().optional(),
  promptUuid: z.string().optional()
});
const Report_GetCustomLLMReportWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  timeSeriesDataPoints: z.array(SceneQueryReport).optional()
});
const Report_GetCustomLLMWBinaryWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  reports: z.record(z.unknown()).optional()
});
const Report_GetCustomLLMWSRequest: z.ZodObject<any> = z.object({
  endTimeMs: z.number().int().optional(),
  interval: z.string().optional(),
  promptUuid: z.string().optional(),
  startTimeMs: z.number().int().optional()
});
const Report_GetDiagnosticFeedWSRequest: z.ZodObject<any> = z.object({
  timestampMsAfter: z.number().int().optional(),
  timestampMsBefore: z.number().int().optional()
});
const Report_GetDiagnosticFeedWSResponse: z.ZodObject<any> = z.object({
  diagnosticEvents: z.array(DiagnosticEventType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Report_GetLicensePlatesByDeviceWSRequest: z.ZodObject<any> = z.object({
  dateLocal: z.string().optional(),
  deviceUuid: z.string(),
  interval: z.string(),
  timestampMs: z.number().int().min(0).optional()
});
const VehicleEventIndexType: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  eventTimestamp: z.number().int().optional(),
  imageS3Key: z.string().optional(),
  locationUuid: z.string().optional(),
  matchingLicensePlates: z.array(z.string()).optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  partialLicensePlates: z.array(z.string()).optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  thumbnailS3Key: z.string().optional(),
  uuid: z.string().optional(),
  vehicleLicensePlate: z.string().optional()
});
const Report_GetLicensePlatesByDeviceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  licensePlateEvents: z.array(VehicleEventIndexType).optional()
});
const Report_GetMostRecentPeopleCountWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  numMostRecent: z.number().int().optional()
});
const Report_GetMostRecentPeopleCountWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  events: z.array(PeopleCountEventType).optional()
});
const Report_GetOccupancyCountWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  endMs: z.number().int().optional(),
  startMs: z.number().int().optional()
});
const Report_GetOccupancyCountWSResponse: z.ZodObject<any> = z.object({
  approximateTimestampMs: z.number().int().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  estimatedCount: z.number().int().optional()
});
const Report_GetOccupancyCountsWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  endTimeMs: z.number().int().optional(),
  interval: z.string().optional(),
  startTimeMs: z.number().int().optional()
});
const Report_TimeSeriesDataPointV2ExtendedType: z.ZodObject<any> = z.object({
  approximateTimestampMsMap: z.record(z.unknown()).optional(),
  dateLocal: z.string().optional(),
  dateUtc: z.string().optional(),
  eventCountMap: z.record(z.unknown()).optional(),
  timestampMs: z.number().int().optional()
});
const Report_GetOccupancyCountsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  timeSeriesDataPoints: z.array(Report_TimeSeriesDataPointV2ExtendedType).optional()
});
const Report_GetProximityTagLocationsByDateWSRequest: z.ZodObject<any> = z.object({
  endDateStr: z.string().optional(),
  endTimeMs: z.number().int().min(0).optional(),
  startDateStr: z.string().optional(),
  startTimeMs: z.number().int().min(0).optional(),
  tagUuid: z.string()
});
const Report_GetProximityTagLocationsByDateWSResponse: z.ZodObject<any> = z.object({
  dataPoints: z.array(ProximityTagTimeSeriesDataPointType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Report_GetRunningAverageWSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().optional(),
  endTimeMs: z.number().int().min(0).optional(),
  interval: z.string(),
  scope: z.string(),
  startDate: z.string().optional(),
  startTimeMs: z.number().int().min(0).optional(),
  uuid: z.string().optional()
});
const WeeklyStatisticsDataPoint: z.ZodObject<any> = z.object({
  date: z.string().optional(),
  stats: z.record(z.unknown()).optional()
});
const Report_GetRunningAverageWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  statsDataPoints: z.array(WeeklyStatisticsDataPoint).optional()
});
const Report_GetSummaryCountReportWSRequest: z.ZodObject<any> = z.object({
  endDate: z.string().optional(),
  endTimeMs: z.number().int().min(0).optional(),
  interval: z.string(),
  scope: z.string(),
  startDate: z.string().optional(),
  startTimeMs: z.number().int().min(0).optional(),
  type: z.string()
});
const SummaryCountTimeSeriesDataPointType: z.ZodObject<any> = z.object({
  avgEventCountMap: z.record(z.unknown()).optional(),
  dateLocal: z.string().optional(),
  dateUtc: z.string().optional(),
  maxEventCountMap: z.record(z.unknown()).optional(),
  minEventCountMap: z.record(z.unknown()).optional()
});
const Report_GetSummaryCountReportWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  timeSeriesDataPoints: z.array(SummaryCountTimeSeriesDataPointType).optional()
});
const Report_GetThresholdCrossingCountReportWSRequest: z.ZodObject<any> = z.object({
  bucketSize: z.string().optional(),
  crossingObject: z.string().optional(),
  dedupe: z.boolean().optional(),
  deviceUuid: z.string().optional(),
  endTimeMs: z.number().int().optional(),
  startTimeMs: z.number().int().optional()
});
const Report_GetThresholdCrossingCountReportWSResponse: z.ZodObject<any> = z.object({
  crossingCounts: z.array(CrossingCountsType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Report_GetThresholdCrossingCountsWSRequest: z.ZodObject<any> = z.object({
  crossingObject: z.string().optional(),
  dailyResetTimeMinute: z.number().int().optional(),
  devices: z.array(z.string()).optional(),
  endTimeMs: z.number().int().optional(),
  startTimeMs: z.number().int().optional()
});
const Report_GetThresholdCrossingCountsWSResponse_ThresholdCrossingCountType: z.ZodObject<any> = z.object({
  count: z.number().int().optional(),
  timestampMs: z.number().int().optional()
});
const Report_GetThresholdCrossingCountsWSResponse: z.ZodObject<any> = z.object({
  counts: z.array(Report_GetThresholdCrossingCountsWSResponse_ThresholdCrossingCountType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Report_GetThresholdCrossingEventsForDeviceWSRequest: z.ZodObject<any> = z.object({
  crossingObject: z.string().optional(),
  deviceUuid: z.string().optional(),
  endTimeMs: z.number().int().optional(),
  lastEvaluatedKey: z.string().optional(),
  maxPageSize: z.number().int().optional(),
  startTimeMs: z.number().int().optional()
});
const Report_GetThresholdCrossingEventsForDeviceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  lastEvaluatedKey: z.string().optional(),
  thresholdCrossingEvents: z.array(MinimalThresholdEventType).optional()
});
const Report_GetThresholdCrossingEventsWSRequest: z.ZodObject<any> = z.object({
  crossingObject: z.string().optional(),
  devices: z.array(z.string()).optional(),
  endTimeMs: z.number().int().optional(),
  startTimeMs: z.number().int().optional()
});
const Report_GetThresholdCrossingEventsWSResponse: z.ZodObject<any> = z.object({
  deviceToThresholdCrossingEventMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Report_ResetRunningAverageWSRequest: z.ZodObject<any> = z.object({
  scope: z.string().optional(),
  uuid: z.string().optional()
});
const Report_ResetRunningAverageWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const StatusType: z.ZodObject<any> = z.object({
  family: z.string().optional(),
  reasonPhrase: z.string().optional(),
  statusCode: z.number().int().optional()
});
const Response: z.ZodObject<any> = z.object({
  allowedMethods: z.array(z.string()).optional(),
  closed: z.boolean().optional(),
  cookies: z.record(z.unknown()).optional(),
  date: z.string().datetime({ offset: true }).optional(),
  entity: z.record(z.unknown()).optional(),
  entityTag: EntityTag.optional(),
  headers: z.object({
  empty: z.boolean().optional()
}).optional(),
  language: z.object({
  country: z.string().optional(),
  displayCountry: z.string().optional(),
  displayLanguage: z.string().optional(),
  displayName: z.string().optional(),
  displayScript: z.string().optional(),
  displayVariant: z.string().optional(),
  extensionKeys: z.array(z.string()).optional(),
  iso3Country: z.string().optional(),
  iso3Language: z.string().optional(),
  language: z.string().optional(),
  script: z.string().optional(),
  unicodeLocaleAttributes: z.array(z.string()).optional(),
  unicodeLocaleKeys: z.array(z.string()).optional(),
  variant: z.string().optional()
}).optional(),
  lastModified: z.string().datetime({ offset: true }).optional(),
  length: z.number().int().optional(),
  links: z.array(Link).optional(),
  location: z.string().optional(),
  mediaType: MediaType.optional(),
  metadata: z.object({
  empty: z.boolean().optional()
}).optional(),
  status: z.number().int().optional(),
  statusInfo: StatusType.optional(),
  stringHeaders: z.object({
  empty: z.boolean().optional()
}).optional()
});
const ResponseEntity: z.ZodObject<any> = z.object({
  body: z.record(z.unknown()).optional(),
  headers: z.object({
  accept: z.array(MediaType).optional(),
  acceptCharset: z.array(z.object({
  registered: z.boolean().optional()
})).optional(),
  acceptLanguage: z.array(z.object({
  range: z.string().optional(),
  weight: z.number().optional()
})).optional(),
  acceptLanguageAsLocales: z.array(z.object({
  country: z.string().optional(),
  displayCountry: z.string().optional(),
  displayLanguage: z.string().optional(),
  displayName: z.string().optional(),
  displayScript: z.string().optional(),
  displayVariant: z.string().optional(),
  extensionKeys: z.array(z.string()).optional(),
  iso3Country: z.string().optional(),
  iso3Language: z.string().optional(),
  language: z.string().optional(),
  script: z.string().optional(),
  unicodeLocaleAttributes: z.array(z.string()).optional(),
  unicodeLocaleKeys: z.array(z.string()).optional(),
  variant: z.string().optional()
})).optional(),
  acceptPatch: z.array(MediaType).optional(),
  accessControlAllowCredentials: z.boolean().optional(),
  accessControlAllowHeaders: z.array(z.string()).optional(),
  accessControlAllowMethods: z.array(HttpMethod).optional(),
  accessControlAllowOrigin: z.string().optional(),
  accessControlExposeHeaders: z.array(z.string()).optional(),
  accessControlMaxAge: z.number().int().optional(),
  accessControlRequestHeaders: z.array(z.string()).optional(),
  accessControlRequestMethod: HttpMethod.optional(),
  all: z.record(z.unknown()).optional(),
  allow: z.array(HttpMethod).optional(),
  basicAuth: z.string().optional(),
  bearerAuth: z.string().optional(),
  cacheControl: z.string().optional(),
  connection: z.array(z.string()).optional(),
  contentDisposition: ContentDisposition.optional(),
  contentLanguage: z.object({
  country: z.string().optional(),
  displayCountry: z.string().optional(),
  displayLanguage: z.string().optional(),
  displayName: z.string().optional(),
  displayScript: z.string().optional(),
  displayVariant: z.string().optional(),
  extensionKeys: z.array(z.string()).optional(),
  iso3Country: z.string().optional(),
  iso3Language: z.string().optional(),
  language: z.string().optional(),
  script: z.string().optional(),
  unicodeLocaleAttributes: z.array(z.string()).optional(),
  unicodeLocaleKeys: z.array(z.string()).optional(),
  variant: z.string().optional()
}).optional(),
  contentLength: z.number().int().optional(),
  contentType: MediaType.optional(),
  date: z.number().int().optional(),
  empty: z.boolean().optional(),
  etag: z.string().optional(),
  expires: z.number().int().optional(),
  host: z.object({
  address: z.object({
  address: z.array(z.string()).optional(),
  anyLocalAddress: z.boolean().optional(),
  canonicalHostName: z.string().optional(),
  hostAddress: z.string().optional(),
  hostName: z.string().optional(),
  linkLocalAddress: z.boolean().optional(),
  loopbackAddress: z.boolean().optional(),
  mcglobal: z.boolean().optional(),
  mclinkLocal: z.boolean().optional(),
  mcnodeLocal: z.boolean().optional(),
  mcorgLocal: z.boolean().optional(),
  mcsiteLocal: z.boolean().optional(),
  multicastAddress: z.boolean().optional(),
  siteLocalAddress: z.boolean().optional()
}).optional(),
  hostName: z.string().optional(),
  hostString: z.string().optional(),
  port: z.number().int().optional(),
  unresolved: z.boolean().optional()
}).optional(),
  ifMatch: z.array(z.string()).optional(),
  ifModifiedSince: z.number().int().optional(),
  ifNoneMatch: z.array(z.string()).optional(),
  ifUnmodifiedSince: z.number().int().optional(),
  lastModified: z.number().int().optional(),
  location: z.string().optional(),
  origin: z.string().optional(),
  pragma: z.string().optional(),
  range: z.array(HttpRange).optional(),
  upgrade: z.string().optional(),
  vary: z.array(z.string()).optional()
}).optional(),
  statusCode: HttpStatusCode.optional(),
  statusCodeValue: z.number().int().optional()
});
const ResponseEntityString: z.ZodObject<any> = z.object({
  body: z.string().optional(),
  headers: z.object({
  accept: z.array(MediaType).optional(),
  acceptCharset: z.array(z.object({
  registered: z.boolean().optional()
})).optional(),
  acceptLanguage: z.array(z.object({
  range: z.string().optional(),
  weight: z.number().optional()
})).optional(),
  acceptLanguageAsLocales: z.array(z.object({
  country: z.string().optional(),
  displayCountry: z.string().optional(),
  displayLanguage: z.string().optional(),
  displayName: z.string().optional(),
  displayScript: z.string().optional(),
  displayVariant: z.string().optional(),
  extensionKeys: z.array(z.string()).optional(),
  iso3Country: z.string().optional(),
  iso3Language: z.string().optional(),
  language: z.string().optional(),
  script: z.string().optional(),
  unicodeLocaleAttributes: z.array(z.string()).optional(),
  unicodeLocaleKeys: z.array(z.string()).optional(),
  variant: z.string().optional()
})).optional(),
  acceptPatch: z.array(MediaType).optional(),
  accessControlAllowCredentials: z.boolean().optional(),
  accessControlAllowHeaders: z.array(z.string()).optional(),
  accessControlAllowMethods: z.array(HttpMethod).optional(),
  accessControlAllowOrigin: z.string().optional(),
  accessControlExposeHeaders: z.array(z.string()).optional(),
  accessControlMaxAge: z.number().int().optional(),
  accessControlRequestHeaders: z.array(z.string()).optional(),
  accessControlRequestMethod: HttpMethod.optional(),
  all: z.record(z.unknown()).optional(),
  allow: z.array(HttpMethod).optional(),
  basicAuth: z.string().optional(),
  bearerAuth: z.string().optional(),
  cacheControl: z.string().optional(),
  connection: z.array(z.string()).optional(),
  contentDisposition: ContentDisposition.optional(),
  contentLanguage: z.object({
  country: z.string().optional(),
  displayCountry: z.string().optional(),
  displayLanguage: z.string().optional(),
  displayName: z.string().optional(),
  displayScript: z.string().optional(),
  displayVariant: z.string().optional(),
  extensionKeys: z.array(z.string()).optional(),
  iso3Country: z.string().optional(),
  iso3Language: z.string().optional(),
  language: z.string().optional(),
  script: z.string().optional(),
  unicodeLocaleAttributes: z.array(z.string()).optional(),
  unicodeLocaleKeys: z.array(z.string()).optional(),
  variant: z.string().optional()
}).optional(),
  contentLength: z.number().int().optional(),
  contentType: MediaType.optional(),
  date: z.number().int().optional(),
  empty: z.boolean().optional(),
  etag: z.string().optional(),
  expires: z.number().int().optional(),
  host: z.object({
  address: z.object({
  address: z.array(z.string()).optional(),
  anyLocalAddress: z.boolean().optional(),
  canonicalHostName: z.string().optional(),
  hostAddress: z.string().optional(),
  hostName: z.string().optional(),
  linkLocalAddress: z.boolean().optional(),
  loopbackAddress: z.boolean().optional(),
  mcglobal: z.boolean().optional(),
  mclinkLocal: z.boolean().optional(),
  mcnodeLocal: z.boolean().optional(),
  mcorgLocal: z.boolean().optional(),
  mcsiteLocal: z.boolean().optional(),
  multicastAddress: z.boolean().optional(),
  siteLocalAddress: z.boolean().optional()
}).optional(),
  hostName: z.string().optional(),
  hostString: z.string().optional(),
  port: z.number().int().optional(),
  unresolved: z.boolean().optional()
}).optional(),
  ifMatch: z.array(z.string()).optional(),
  ifModifiedSince: z.number().int().optional(),
  ifNoneMatch: z.array(z.string()).optional(),
  ifUnmodifiedSince: z.number().int().optional(),
  lastModified: z.number().int().optional(),
  location: z.string().optional(),
  origin: z.string().optional(),
  pragma: z.string().optional(),
  range: z.array(HttpRange).optional(),
  upgrade: z.string().optional(),
  vary: z.array(z.string()).optional()
}).optional(),
  statusCode: HttpStatusCode.optional(),
  statusCodeValue: z.number().int().optional()
});
const RhombusOrgUserType: z.ZodObject<any> = z.object({
  accessibleRhombusApps: z.array(z.string()).optional(),
  accountOwner: z.boolean().optional(),
  bypassSaml: z.boolean().optional(),
  createdAtMillis: z.number().int().optional(),
  deleted: z.boolean().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  orgUserCustomizationFlags: z.record(z.unknown()).optional(),
  orgUuid: z.string().optional(),
  rhombusUserUuid: z.string().optional(),
  status: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const RuleLockdownEventOriginator: z.ZodObject<any> = z.object({
  type: LockdownEventOriginatorEnumType.optional()
});
const ScheduledEventRecordType: z.ZodObject<any> = z.object({
  timestampMs: z.number().int().optional()
});
const TriggerComponentRelayActionRecordType: z.ZodObject<any> = z.object({
  componentUuid: z.string().optional(),
  outputType: ComponentRelayOutputType.optional(),
  overrideRelayDurationMs: z.number().int().optional(),
  overrideRelayDurationSec: z.number().int().optional(),
  ownerDeviceUuid: z.string().optional(),
  state: GenericRelayStateEnumType.optional(),
  succeeded: z.boolean().optional()
});
const UnlockDoorActionRecordType: z.ZodObject<any> = z.object({
  doorId: z.string().optional(),
  placeId: z.string().optional(),
  succeeded: z.boolean().optional(),
  system: z.string().optional()
});
const VisionLLMEventRecordType: z.ZodObject<any> = z.object({
  deviceFacetUuid: z.string().optional(),
  fullResponse: z.string().optional(),
  parsedAffirmativeResponse: z.boolean().optional(),
  timestampMs: z.number().int().optional(),
  userPrompt: z.string().optional()
});
const RulesEventRecordType: z.ZodObject<any> = z.object({
  activatedLocationLockdownRecord: ActivateLocationLockdownActionRecordType.optional(),
  alertActionRecord: AlertActionRecordType.optional(),
  alertMonitoringEventRecords: z.array(AlertMonitoringEventRecordType).optional(),
  audioPlaybackActionRecords: z.array(AudioPlaybackActionRecordType).optional(),
  cancelLoopingAudioPlaybackActionRecordType: CancelLoopingAudioPlaybackActionRecordType.optional(),
  deviceEventRecords: z.array(DeviceEventRecordType).optional(),
  integrationActionStatuses: z.record(z.unknown()).optional(),
  liveNotificationActionRecord: LiveNotificationActionRecordType.optional(),
  orgUuid: z.string().optional(),
  ruleUuid: z.string().optional(),
  scheduledEventRecords: z.array(ScheduledEventRecordType).optional(),
  triggerComponentRelayRecords: z.array(TriggerComponentRelayActionRecordType).optional(),
  triggeredTimestampMs: z.number().int().optional(),
  unlockDoorActionRecords: z.array(UnlockDoorActionRecordType).optional(),
  uuid: z.string().optional(),
  visionLLMEventRecords: z.array(VisionLLMEventRecordType).optional(),
  webhookActionStatuses: z.record(z.unknown()).optional()
});
const Rules_CreateRuleWSRequest: z.ZodObject<any> = z.object({
  rule: RuleType.optional()
});
const Rules_CreateRuleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  ruleUuid: z.string().optional()
});
const Rules_DeleteRulePauseSettingWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Rules_DeleteRulePauseSettingWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Rules_DeleteRuleWSRequest: z.ZodObject<any> = z.object({
  ruleUuid: z.string().optional()
});
const Rules_DeleteRuleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Rules_GetRulePauseSettingsResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rulesPausedMap: z.record(z.unknown()).optional()
});
const Rules_GetRulePauseSettingsWSRequest = z.record(z.unknown());
const Rules_GetRulesForOrgWSRequest = z.record(z.unknown());
const Rules_GetRulesForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  rules: z.array(RuleType).optional()
});
const Rules_PauseRuleWSRequest: z.ZodObject<any> = z.object({
  durationSec: z.number().int().optional(),
  ruleUuid: z.string().optional(),
  scheduledTimestampSec: z.number().int().optional()
});
const Rules_PauseRuleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Rules_UpdateRuleWSRequest: z.ZodObject<any> = z.object({
  ruleUpdate: RuleType.optional()
});
const Rules_UpdateRuleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Rules_records_DeleteRulesEventRecordWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Rules_records_DeleteRulesEventRecordWSResponse = z.record(z.unknown());
const Rules_records_GetLatestRulesEventRecordsWSRequest: z.ZodObject<any> = z.object({
  associatedUuids: z.array(z.string()).optional(),
  n: z.number().int().optional(),
  ruleUuid: z.string().optional()
});
const Rules_records_GetLatestRulesEventRecordsWSResponse: z.ZodObject<any> = z.object({
  rulesEventRecords: z.array(RulesEventRecordType).optional()
});
const Rules_records_GetRulesEventRecordsWSRequest: z.ZodObject<any> = z.object({
  associatedUuids: z.array(z.string()).optional(),
  endTime: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const Rules_records_GetRulesEventRecordsWSResponse: z.ZodObject<any> = z.object({
  rulesEventRecords: z.array(RulesEventRecordType).optional()
});
const Rules_records_GetRulesFilteredWSRequest: z.ZodObject<any> = z.object({
  associatedUuids: z.array(z.string()).optional(),
  ruleTypeFilter: z.array(RuleTypeEnum).optional()
});
const SalesforceLicenseStartDateTimeAndEndDateTime: z.ZodObject<any> = z.object({
  contractEndDateTime: z.string().optional(),
  contractStartDateTime: z.string().optional()
});
const Scenequery_CreatePromptConfigurationWSRequest: z.ZodObject<any> = z.object({
  promptConfiguration: PromptConfigurationType.optional()
});
const Scenequery_CreatePromptConfigurationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  promptConfiguration: PromptConfigurationType.optional()
});
const Scenequery_DeletePromptConfigurationWSRequest: z.ZodObject<any> = z.object({
  promptUuid: z.string().optional()
});
const Scenequery_DeletePromptConfigurationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Scenequery_FindAllPromptConfigurationsWSRequest = z.record(z.unknown());
const Scenequery_FindAllPromptConfigurationsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  promptConfigurations: z.array(PromptConfigurationType).optional()
});
const Scenequery_GetPromptConfigurationWSRequest: z.ZodObject<any> = z.object({
  promptUuid: z.string().optional()
});
const Scenequery_GetPromptConfigurationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  promptConfiguration: PromptConfigurationType.optional()
});
const Scenequery_SelectiveUpdatePromptConfigurationWSRequest: z.ZodObject<any> = z.object({
  active: z.boolean().optional(),
  cameraConfigurations: z.array(CameraConfiguration).optional(),
  checkCondition: CheckCondition.optional(),
  description: z.string().optional(),
  minuteTriggerRate: z.number().int().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  prompt: z.string().optional(),
  promptType: z.string().optional(),
  scheduleUuid: z.string().optional(),
  shortName: z.string().optional(),
  uuid: z.string().optional()
});
const Scenequery_SelectiveUpdatePromptConfigurationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Scenequery_TriggerPromptWSRequest: z.ZodObject<any> = z.object({
  deviceFacetUuid: z.string().optional(),
  prompt: z.string().optional(),
  promptType: z.string().optional(),
  region: RegionPolygonType.optional(),
  timestampMs: z.number().int().optional()
});
const Scenequery_TriggerPromptWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  event: SceneQueryReportEvent.optional()
});
const Scenequery_UpdatePromptConfigurationWSRequest: z.ZodObject<any> = z.object({
  promptConfiguration: PromptConfigurationType.optional()
});
const Scenequery_UpdatePromptConfigurationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  promptConfiguration: PromptConfigurationType.optional()
});
const Schedule_CreateAbsoluteScheduleWSRequest: z.ZodObject<any> = z.object({
  schedule: AbsoluteSecondsScheduleType.optional()
});
const Schedule_CreateAbsoluteScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  scheduleUuid: z.string().optional()
});
const Schedule_CreateRelativeDateTimeIntervalsScheduleWSRequest: z.ZodObject<any> = z.object({
  schedule: RelativeDateTimeIntervalsScheduleType.optional()
});
const Schedule_CreateRelativeDateTimeIntervalsScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  scheduleUuid: z.string().optional()
});
const Schedule_CreateRelativeScheduleWSRequest: z.ZodObject<any> = z.object({
  schedule: RealtimeRelativeSecondsScheduleType.optional()
});
const Schedule_CreateRelativeScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  scheduleUuid: z.string().optional()
});
const Schedule_CreateWeeklyScheduleWSRequest: z.ZodObject<any> = z.object({
  schedule: WeeklyRepeatingScheduleType.optional()
});
const Schedule_CreateWeeklyScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  scheduleUuid: z.string().optional()
});
const Schedule_FindAbsoluteScheduleWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Schedule_FindAbsoluteScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  schedule: AbsoluteSecondsScheduleType.optional()
});
const Schedule_FindRelativeDateTimeIntervalsScheduleWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Schedule_FindRelativeDateTimeIntervalsScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  schedule: RelativeDateTimeIntervalsScheduleType.optional()
});
const Schedule_FindRelativeScheduleWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Schedule_FindRelativeScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  schedule: RealtimeRelativeSecondsScheduleType.optional()
});
const Schedule_FindWeeklyScheduleWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Schedule_FindWeeklyScheduleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  schedule: WeeklyRepeatingScheduleType.optional()
});
const Schedule_GetScheduleDataV2WSRequest: z.ZodObject<any> = z.object({
  scheduleUuid: z.string().optional()
});
const Schedule_WeeklyRepeatingScheduleDataType: z.ZodObject<any> = z.object({
  accessGrantUuids: z.array(z.string()).optional(),
  alarmMonitoringUuids: z.array(z.string()).optional(),
  alertPolicyUuids: z.array(z.string()).optional(),
  customEventUuids: z.array(z.string()).optional(),
  doorSettingUuids: z.array(z.string()).optional(),
  intervalList: z.array(WeeklyMinuteIntervalType).optional(),
  locationsUsedIn: z.array(z.string()).optional(),
  mutable: z.boolean().optional(),
  name: z.string().optional(),
  oneTimeUse: z.boolean().optional(),
  orgUuid: z.string().optional(),
  ruleUuids: z.array(z.string()).optional(),
  sharedStreamUuids: z.array(z.string()).optional(),
  strategy: z.string().optional(),
  uuid: z.string().optional()
});
const Schedule_GetScheduleDataV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  weeklyScheduleData: Schedule_WeeklyRepeatingScheduleDataType.optional()
});
const Schedule_GetScheduleDataWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  weeklyScheduleData: z.array(Schedule_WeeklyRepeatingScheduleDataType).optional()
});
const Schedule_GetSchedulesWSRequest = z.record(z.unknown());
const Schedule_GetSchedulesWSResponse: z.ZodObject<any> = z.object({
  absoluteSchedules: z.array(AbsoluteSecondsScheduleType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  relativeDatetimeSchedules: z.array(RelativeDateTimeIntervalsScheduleType).optional(),
  relativeSchedules: z.array(RealtimeRelativeSecondsScheduleType).optional(),
  weeklySchedules: z.array(WeeklyRepeatingScheduleType).optional()
});
const Search_DeleteVideoEmbeddingWSRequest: z.ZodObject<any> = z.object({
  embedding: GenericVideoEmbedding.optional()
});
const Search_DeleteVideoEmbeddingWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Search_IndexVideoEmbeddingWSRequest: z.ZodObject<any> = z.object({
  embedding: GenericVideoEmbedding.optional()
});
const Search_IndexVideoEmbeddingWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Search_SearchLicensePlatesWSRequest: z.ZodObject<any> = z.object({
  deviceUuids: z.array(z.string()).optional(),
  endTime: z.number().int().optional(),
  forcedFuzziness: z.number().int().optional(),
  fuzzy: z.boolean().optional(),
  licensePlate: z.string().optional(),
  startTime: z.number().int().optional()
});
const VehicleEventSearchHitType: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  eventTimestamp: z.number().int().optional(),
  imageS3Key: z.string().optional(),
  locationUuid: z.string().optional(),
  matchingLicensePlates: z.array(z.string()).optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  partialLicensePlates: z.array(z.string()).optional(),
  searchMatchedTerm: z.string().optional(),
  searchMatchedType: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  thumbnailS3Key: z.string().optional(),
  uuid: z.string().optional(),
  vehicleLicensePlate: z.string().optional()
});
const Search_SearchLicensePlatesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  vehicleEvents: z.array(VehicleEventSearchHitType).optional()
});
const Search_SearchObjectsByColorWSRequest: z.ZodObject<any> = z.object({
  colorFilter: z.array(z.string()).optional(),
  deviceFilter: z.array(z.string()).optional(),
  endTimeMs: z.number().int().optional(),
  objectTypeFilter: z.array(ActivityEnum).optional(),
  startTimeMs: z.number().int().optional()
});
const Search_SearchObjectsByColorWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  objects: z.array(FootageBoundingBoxType).optional()
});
const Search_SearchSimilarObjectEmbeddingsByTextWSRequest: z.ZodObject<any> = z.object({
  maxNumResults: z.number().int().optional(),
  model: ObjectSearchModelEnum,
  objectTypeFilter: z.array(z.string()).optional(),
  queryDeviceUuids: z.array(z.string()).optional(),
  queryEndTimeMs: z.number().int(),
  queryStartTimeMs: z.number().int(),
  regionFilter: z.array(z.array(z.number().int())).optional(),
  searchText: z.string(),
  similarityThreshold: z.number().optional()
});
const Search_SearchSimilarObjectEmbeddingsByVectorWSRequest: z.ZodObject<any> = z.object({
  maxNumResults: z.number().int().optional(),
  model: ObjectSearchModelEnum.optional(),
  objectTypeFilter: z.array(z.string()).optional(),
  queryDeviceUuids: z.array(z.string()).optional(),
  queryEndTimeMs: z.number().int().optional(),
  queryStartTimeMs: z.number().int().optional(),
  regionFilter: z.array(z.array(z.number().int())).optional(),
  searchEmbedding: z.array(z.number()).optional(),
  similarityThreshold: z.number().optional()
});
const Search_SearchSimilarObjectEmbeddingsWSRequest: z.ZodObject<any> = z.object({
  maxNumResults: z.number().int().optional(),
  model: ObjectSearchModelEnum,
  objectTypeFilter: z.array(z.string()).optional(),
  queryDeviceUuids: z.array(z.string()).optional(),
  queryEndTimeMs: z.number().int(),
  queryStartTimeMs: z.number().int(),
  regionFilter: z.array(z.array(z.number().int())).optional(),
  searchEmbeddingId: z.string(),
  similarityThreshold: z.number().optional()
});
const Search_SearchSimilarObjectEmbeddingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  moderationReason: z.string().optional(),
  queryAllowed: z.boolean().optional(),
  similarEmbeddings: z.array(GenericObjectEmbeddingMatch).optional()
});
const Search_SearchSimilarVideoEmbeddingsByTimeWindowWSRequest: z.ZodObject<any> = z.object({
  maxNumResults: z.number().int().optional(),
  model: VideoSimilarityModelEnum.optional(),
  queryDeviceUuids: z.array(z.string()).optional(),
  queryEndTimeMs: z.number().int().optional(),
  queryStartTimeMs: z.number().int().optional(),
  searchEventDeviceUuid: z.string().optional(),
  searchEventEndTimeMs: z.number().int().optional(),
  searchEventStartTimeMs: z.number().int().optional(),
  similarityThreshold: z.number().optional()
});
const Search_SearchSimilarVideoEmbeddingsByTimeWindowWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  searchEmbeddings: z.array(GenericVideoEmbedding).optional(),
  similarEmbeddings: z.array(GenericVideoEmbeddingMatch).optional()
});
const Search_SearchSimilarVideoEmbeddingsWSRequest: z.ZodObject<any> = z.object({
  maxNumResults: z.number().int().optional(),
  model: VideoSimilarityModelEnum.optional(),
  queryDeviceUuids: z.array(z.string()).optional(),
  queryEndTimeMs: z.number().int().optional(),
  queryStartTimeMs: z.number().int().optional(),
  searchEmbedding: z.array(z.number()).optional(),
  similarityThreshold: z.number().optional()
});
const Search_SearchSimilarVideoEmbeddingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  similarEmbeddings: z.array(GenericVideoEmbeddingMatch).optional()
});
const Sensor_FootageSensorSeekPointDisplayType: z.ZodObject<any> = z.object({
  a: ActivityEnum,
  al: z.boolean().optional(),
  cd: z.string().optional(),
  cdn: z.string().optional(),
  co2: z.number().optional(),
  cu: z.array(z.string()).optional(),
  ethanol: z.number().optional(),
  h: z.number().int().optional(),
  heatIndexDegF: z.number().optional(),
  hp: z.number().int().optional(),
  iaq: z.number().optional(),
  lu: z.string().optional(),
  pm25: z.number().optional(),
  probeTempC: z.number().optional(),
  sn: z.string().optional(),
  su: z.string().optional(),
  subLocationsHierarchyKey: SubLocationsHierarchyKey.optional(),
  t: z.number().int().optional(),
  tc: z.number().int().optional(),
  thcPercent: z.number().optional(),
  ts: z.number().int(),
  tvoc: z.number().optional(),
  vapeSmokePercent: z.number().optional()
});
const Sensor_GetFootageSensorSeekpointsForCameraWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  durationSec: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Sensor_GetFootageSensorSeekpointsForCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  seekPoints: z.array(Sensor_FootageSensorSeekPointDisplayType).optional()
});
const Sensor_GetFootageSensorSeekpointsForLocationWSRequest: z.ZodObject<any> = z.object({
  durationSec: z.number().int().optional(),
  locationUuid: z.string().optional(),
  startTimeSec: z.number().int().optional()
});
const Sensor_GetFootageSensorSeekpointsForLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  seekPoints: z.array(Sensor_FootageSensorSeekPointDisplayType).optional()
});
const Sensor_GetFootageSensorSeekpointsForSensorWSRequest: z.ZodObject<any> = z.object({
  durationSec: z.number().int().optional(),
  sensorUuid: z.string().optional(),
  startTimeSec: z.number().int().optional()
});
const Sensor_GetFootageSensorSeekpointsForSensorWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageSeekPoints: z.array(FootageSeekPointV2Type).optional(),
  seekPoints: z.array(Sensor_FootageSensorSeekPointDisplayType).optional()
});
const Sensor_GetSensorPresenceWindowsWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  durationSec: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Sensor_GetSensorPresenceWindowsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  presenceWindows: z.array(TimeWindowSeconds).optional()
});
const Share_GetSharedClipDataWSRequest = z.record(z.unknown());
const Share_SharedClipPublicType: z.ZodObject<any> = z.object({
  boundingBoxes: z.array(ClipBoundingBoxType).optional(),
  clipLocation: MetaDataLocationType.optional(),
  description: z.string().optional(),
  deviceBoundingBoxMap: z.record(z.unknown()).optional(),
  deviceMap: z.record(z.unknown()).optional(),
  deviceSeekPointMap: z.record(z.unknown()).optional(),
  durationSec: z.number().int().optional(),
  locationNameMap: z.record(z.unknown()).optional(),
  locationTimeZoneMap: z.record(z.unknown()).optional(),
  publicClipUuid: z.string().optional(),
  seekPoints: z.array(ClipSeekPointV2Type).optional(),
  startTime: z.number().int().optional(),
  thumbnailLocation: MetaDataLocationType.optional()
});
const Share_GetSharedClipDataWSResponse: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  orgName: z.string().optional(),
  sharedWebClips: z.array(Share_SharedClipPublicType).optional(),
  title: z.string().optional()
});
const Share_GetSharedFootageBoundingBoxesWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  duration: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const Share_GetSharedFootageBoundingBoxesWSResponse: z.ZodObject<any> = z.object({
  boundingBoxes: z.array(FootageBoundingBoxType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Share_GetSharedFootageSeekpointsV2WSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string().optional(),
  duration: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const Share_GetSharedFootageSeekpointsV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  footageSeekPoints: z.array(FootageSeekPointV2Type).optional(),
  seekPoints: z.array(FootageSeekPointV2Type).optional()
});
const Share_GetSharedFootageSeekpointsWSRequest: z.ZodObject<any> = z.object({
  duration: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const Share_GetSharedFootageSeekpointsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  seekPoints: z.array(FootageSeekPointType).optional()
});
const Share_GetSharedFootageSensorSeekpointsForCameraWSRequest: z.ZodObject<any> = z.object({
  durationSec: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Share_GetSharedFootageSensorSeekpointsForCameraWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  seekPoints: z.array(Sensor_FootageSensorSeekPointDisplayType).optional()
});
const Share_GetSharedLiveStreamInfoWSResponse: z.ZodObject<any> = z.object({
  aecEnabled: z.boolean().optional(),
  audioPushToTalkEnabled: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  fisheyeDisplayMode: FisheyeDisplayMode.optional(),
  hideOverlay: z.boolean().optional(),
  hwVariation: HardwareVariationEnum.optional(),
  locationName: z.string().optional(),
  mountingDirection: z.string().optional(),
  name: z.string().optional(),
  oldestSegmentSeconds: z.number().int().optional(),
  schedule: BaseSavedScheduleType.optional(),
  sharedWithMonitoringService: z.boolean().optional(),
  tileViews: z.array(DewarpedView).optional(),
  tz: z.object({
  displayName: z.string().optional(),
  dstsavings: z.number().int().optional(),
  id: z.string().optional(),
  rawOffset: z.number().int().optional()
}).optional(),
  vodEnabled: z.boolean().optional()
});
const Share_GetSharedMediaUrisWSRequest = z.record(z.unknown());
const Share_GetSharedMediaUrisWSResponse: z.ZodObject<any> = z.object({
  audioWanLiveMpdUri: z.string().optional(),
  audioWanLiveOpusUri: z.string().optional(),
  audioWanVodMpdUriTemplate: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  wanLiveH264Uri: z.string().optional(),
  wanLiveM3u8Uri: z.string().optional(),
  wanLiveMpdUri: z.string().optional(),
  wanVodM3u8UriTemplate: z.string().optional(),
  wanVodMpdUriTemplate: z.string().optional()
});
const Share_GetSharedPresenceWindowsWSRequest: z.ZodObject<any> = z.object({
  durationSec: z.number().int().optional(),
  startTimeSec: z.number().int().optional()
});
const Share_GetSharedPresenceWindowsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  presenceWindows: z.record(z.unknown()).optional()
});
const Share_GetSharedTimelapseDataV2WSResponse: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  orgName: z.string().optional(),
  publicTimelapseUuids: z.array(z.string()).optional(),
  title: z.string().optional()
});
const Share_GetSharedTimelapseDataWSRequest = z.record(z.unknown());
const Share_GetSharedTimelapseDataWSResponse: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  orgName: z.string().optional()
});
const Share_SharedVideoWallDeviceType: z.ZodObject<any> = z.object({
  fisheyeDisplayMode: FisheyeDisplayMode.optional(),
  hwVariation: HardwareVariationEnum.optional(),
  locationName: z.string().optional(),
  mountingDirection: z.string().optional(),
  name: z.string().optional(),
  tileViews: z.array(DewarpedView).optional(),
  tz: z.object({
  displayName: z.string().optional(),
  dstsavings: z.number().int().optional(),
  id: z.string().optional(),
  rawOffset: z.number().int().optional()
}).optional(),
  uuid: z.string().optional()
});
const Share_GetSharedVideoWallInfoWSResponse: z.ZodObject<any> = z.object({
  deviceList: z.array(Share_SharedVideoWallDeviceType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  name: z.string().optional(),
  settings: z.record(z.unknown()).optional(),
  vodEnabled: z.boolean().optional()
});
const Share_GetSharedVideoWallMediaUrisWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Share_GetSharedVideoWallMediaUrisWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  wanLiveH264Uri: z.string().optional(),
  wanLiveM3u8Uri: z.string().optional(),
  wanLiveMpdUri: z.string().optional(),
  wanVodM3u8UriTemplate: z.string().optional(),
  wanVodMpdUriTemplate: z.string().optional()
});
const Share_ShareLinkWSRequest: z.ZodObject<any> = z.object({
  emailAddresses: z.array(z.string()).optional(),
  link: z.string().optional(),
  phoneNumbers: z.array(z.string()).optional()
});
const Share_ShareLinkWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const TimelapseSource: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional()
});
const SharedTimelapseClipType: z.ZodObject<any> = z.object({
  clipDuration: z.number().int().optional(),
  clipFormat: z.string().optional(),
  sources: z.array(TimelapseSource).optional(),
  uuid: z.string().optional(),
  videoStartTime: z.number().int().optional(),
  videoStopTime: z.number().int().optional()
});
const SharedTimelapseGroupWrapperType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  expirationTimeSecs: z.number().int().optional(),
  isSecured: z.boolean().optional(),
  orgUuid: z.string().optional(),
  sharedTimelapses: z.array(SharedTimelapseClipType).optional(),
  title: z.string().optional(),
  uuid: z.string().optional()
});
const ShellyDevice: z.ZodObject<any> = z.object({
  canSendCommands: z.string().optional(),
  channels: z.array(z.string()).optional(),
  deviceType: z.string().optional(),
  hostUrl: z.string().optional(),
  isOnline: z.boolean().optional(),
  temperature: z.number().optional(),
  timestampMs: z.number().int().optional(),
  voltage: z.number().optional()
});
const SplicedClipProgress: z.ZodObject<any> = z.object({
  region: z.string().optional(),
  segmentsUploaded: z.number().int().optional(),
  totalSegments: z.number().int().optional()
});
const Stats: z.ZodObject<any> = z.object({
  avg: z.number().optional(),
  stddev: z.number().optional()
});
const StatsCredentialReference: z.ZodObject<any> = z.object({
  credentialUuid: z.string().optional(),
  orgUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const StreamingOutput = z.record(z.unknown());
const SupportAuthorityLockdownEventOriginator: z.ZodObject<any> = z.object({
  type: LockdownEventOriginatorEnumType.optional()
});
const Support_AddSupportAuthorityWSRequest: z.ZodObject<any> = z.object({
  authority: SupportAuthorityType.optional(),
  isCertifiedPartner: z.boolean().optional()
});
const Support_AddSupportAuthorityWSResponse: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Support_AlllowSupportAuthorityAccessWSRequest: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional()
});
const Support_AlllowSupportAuthorityAccessWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Support_FindSupportAuthoritySessionsWSRequest: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional()
});
const Support_FindSupportAuthoritySessionsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sessions: z.array(SessionInfoWSType).optional()
});
const Support_GetSupportAuthoritiesWSRequest = z.record(z.unknown());
const Support_SupportAuthorityWSType: z.ZodObject<any> = z.object({
  authorityType: z.string().optional(),
  authorityUuid: z.string().optional(),
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  expirationTimestamp: z.number().int().optional(),
  grantedByUsername: z.string().optional(),
  grantedToEmail: z.string().optional(),
  grantedToInternalEntityUuid: z.string().optional(),
  grantedToName: z.string().optional(),
  loginAccessAllowed: z.boolean().optional(),
  managedByMsp: z.boolean().optional(),
  mobileAccessUrl: z.string().optional(),
  orgUuid: z.string().optional(),
  permissionGroupUuid: z.string().optional(),
  webAccessUrl: z.string().optional()
});
const Support_GetSupportAuthoritiesWSResponse: z.ZodObject<any> = z.object({
  authorities: z.array(Support_SupportAuthorityWSType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Support_LogoutAllSupportAuthoritySessionsWSRequest: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional()
});
const Support_LogoutAllSupportAuthoritySessionsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Support_LookupSupportPartnerAuthoritiesWSRequest: z.ZodObject<any> = z.object({
  lookupKeyword: z.string().optional()
});
const Support_SupportPartnerAuthorityWSType: z.ZodObject<any> = z.object({
  contactEmail: z.string().optional(),
  contactName: z.string().optional(),
  name: z.string().optional(),
  uuid: z.string().optional()
});
const Support_LookupSupportPartnerAuthoritiesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  supportPartnerAuthorities: z.array(Support_SupportPartnerAuthorityWSType).optional()
});
const Support_RemoveSupportAuthorityWSRequest: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional()
});
const Support_RemoveSupportAuthorityWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Support_RevokeSupportAuthorityAccessWSRequest: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional()
});
const Support_RevokeSupportAuthorityAccessWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Support_SupportAuthoritySelectiveUpdateWSType: z.ZodObject<any> = z.object({
  authorityUuid: z.string().optional(),
  description: z.string().optional(),
  expirationTimestamp: z.number().int().optional(),
  grantedToEmail: z.string().optional(),
  grantedToName: z.string().optional(),
  loginAccessAllowed: z.boolean().optional(),
  permissionGroupUuid: z.string().optional()
});
const Support_UpdateSupportAuthorityWSRequest: z.ZodObject<any> = z.object({
  update: Support_SupportAuthoritySelectiveUpdateWSType.optional()
});
const Support_UpdateSupportAuthorityWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const TimelapseStatus: z.ZodObject<any> = z.object({
  percentComplete: z.number().int().optional(),
  state: z.string().optional()
});
const TimelapseClipType: z.ZodObject<any> = z.object({
  clipCreationTime: z.number().int().optional(),
  clipDuration: z.number().int().optional(),
  clipFormat: z.string().optional(),
  clipUuid: z.string().optional(),
  description: z.string().optional(),
  drawCameraDetails: z.boolean().optional(),
  drawTimestamp: z.boolean().optional(),
  drawWatermark: z.boolean().optional(),
  orgUuid: z.string().optional(),
  passwordDigest: z.string().optional(),
  shared: z.boolean().optional(),
  skipNights: z.boolean().optional(),
  skipNonBusinessHours: z.boolean().optional(),
  skipWeekends: z.boolean().optional(),
  sources: z.array(TimelapseSource).optional(),
  status: TimelapseStatus.optional(),
  title: z.string().optional(),
  videoStartTime: z.number().int().optional(),
  videoStopTime: z.number().int().optional()
});
const ToastRestaurantInfo: z.ZodObject<any> = z.object({
  locationName: z.string().optional(),
  restaurantName: z.string().optional()
});
const ToastRestaurantSettings: z.ZodObject<any> = z.object({
  locationName: z.string().optional(),
  restaurantName: z.string().optional(),
  serviceAreaSettingsMap: z.record(z.unknown()).optional()
});
const TriggerContent: z.ZodObject<any> = z.object({
  apiKey: z.string().optional(),
  experienceIds: z.array(z.string()).optional(),
  experienceNames: z.array(z.string()).optional(),
  message: z.string().optional(),
  parameter1: z.string().optional(),
  parameter2: z.string().optional(),
  parameter3: z.string().optional(),
  playerDeviceNames: z.array(z.string()).optional(),
  playerIds: z.array(z.string()).optional(),
  playerTags: z.array(z.string()).optional()
});
const TvOsConfigType: z.ZodObject<any> = z.object({
  limitedVideoWallUuids: z.array(z.string()).optional(),
  orgUuid: z.string().optional(),
  uuid: z.string().optional()
});
const Tvos_GetTvOsConfigWsRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Tvos_GetTvOsConfigWsResponse: z.ZodObject<any> = z.object({
  config: TvOsConfigType.optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Tvos_GetTvOsConfigsForOrgWsRequest = z.record(z.unknown());
const Tvos_GetTvOsConfigsForOrgWsResponse: z.ZodObject<any> = z.object({
  configs: z.array(TvOsConfigType).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Tvos_UpdateTvOsConfigWsRequest: z.ZodObject<any> = z.object({
  config: TvOsConfigType.optional()
});
const Tvos_UpdateTvOsConfigWsResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const UserInfo: z.ZodObject<any> = z.object({
  userAccessToken: z.string().optional(),
  userId: z.string().optional()
});
const UserLockdownEventOriginator: z.ZodObject<any> = z.object({
  type: LockdownEventOriginatorEnumType.optional()
});
const UserMetadataField: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  fieldValue: z.string().optional(),
  orgUuid: z.string().optional(),
  templateUuid: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  userUuid: z.string().optional()
});
const UserMetadataFieldTemplate: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  fieldName: z.string().optional(),
  orgUuid: z.string().optional(),
  scimFieldName: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  uuid: z.string().optional()
});
const UserMetadataFieldTemplateSelectiveUpdate: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional(),
  fieldName: z.string().optional(),
  orgUuid: z.string().optional(),
  scimFieldName: z.string().optional(),
  updatedAtMillis: z.number().int().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  uuid: z.string().optional()
});
const UserVirtualMfaDeviceType: z.ZodObject<any> = z.object({
  createdAtMillis: z.number().int().optional()
});
const User_AssignEmailToUserWSRequest: z.ZodObject<any> = z.object({
  emailToAssign: z.string().optional(),
  userUuid: z.string().optional()
});
const User_AssignEmailToUserWSResponse = z.record(z.unknown());
const User_BulkProvisionCredentialsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  messages: z.array(z.string()).optional()
});
const User_ChangeUserEmailWSRequest: z.ZodObject<any> = z.object({
  newEmail: z.string().optional(),
  userUuid: z.string().optional()
});
const User_ChangeUserEmailWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_ChangeUserPasswordWSRequest: z.ZodObject<any> = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().optional()
});
const User_ChangeUserPasswordWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: z.string().optional()
});
const User_CreateUserWSRequest: z.ZodObject<any> = z.object({
  accessibleRhombusApps: z.array(z.string()).optional(),
  email: z.string().optional(),
  name: z.string().optional(),
  permissionGroupUuid: z.string().optional(),
  rhombusKeySettings: RhombusKeyAppSettingsType.optional(),
  suppressRhombusKeyWelcomeEmail: z.boolean().optional(),
  suppressWelcomeEmail: z.boolean().optional()
});
const User_CreateUserWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  responseStatus: z.string().optional(),
  userUuid: z.string().optional()
});
const User_DeleteUserWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const User_DeleteUserWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_DeleteVirtualMfaDeviceForCurrentUserWSRequest = z.record(z.unknown());
const User_DeleteVirtualMfaDeviceForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_FindUserByEmailWSRequest: z.ZodObject<any> = z.object({
  email: z.string().optional()
});
const User_FindUserByEmailWSResponse: z.ZodObject<any> = z.object({
  user: WrappedRhombusOrgUserType.optional()
});
const User_FindUserWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const User_FindUserWSResponse: z.ZodObject<any> = z.object({
  user: WrappedRhombusOrgUserType.optional()
});
const User_GetBulkProvisionCredentialsFormatWSResponse: z.ZodObject<any> = z.object({
  accessControlEnabled: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  example: z.string().optional(),
  explanation: z.string().optional()
});
const User_GetImportUsersFormatWSResponse: z.ZodObject<any> = z.object({
  accessControlEnabled: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  example: z.string().optional(),
  explanation: z.string().optional()
});
const User_GetRhombusKeyConfigForUserWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const User_GetRhombusKeyConfigForUserWSResponse: z.ZodObject<any> = z.object({
  userRhombusKeyConfig: RhombusKeyAppConfigType.optional()
});
const User_GetUserCustomizationFlagsWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const User_GetUserCustomizationFlagsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  userCustomizations: z.record(z.unknown()).optional()
});
const User_GetUsersInOrgForReportsWSRequest = z.record(z.unknown());
const User_GetUsersInOrgForReportsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  users: z.array(RhombusOrgUserType).optional()
});
const User_GetUsersInOrgWSRequest = z.record(z.unknown());
const User_UserSnoozeNotificationSettingsType: z.ZodObject<any> = z.object({
  snoozedForAllNotificationsIntervals: z.array(ScheduledIntervalType).optional(),
  snoozedForDevicesMap: z.record(z.unknown()).optional(),
  snoozedForLocationsMap: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const User_GetUsersInOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  notificationSettings: z.array(UserNotificationSettingsV3Type).optional(),
  notificationSettingsV2: z.array(UserNotificationSettingsV4Type).optional(),
  partners: z.array(WrappedRhombusOrgUserType).optional(),
  rhombusKeyAppConfigs: z.array(RhombusKeyAppConfigType).optional(),
  snoozeSettings: z.array(User_UserSnoozeNotificationSettingsType).optional(),
  userPermissions: z.array(UserPermissionType).optional(),
  users: z.array(WrappedRhombusOrgUserType).optional()
});
const User_GetVirtualMfaDeviceForCurrentUserWSRequest = z.record(z.unknown());
const User_GetVirtualMfaDeviceForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  virtualMfaDevice: UserVirtualMfaDeviceType.optional()
});
const User_ImportUsersWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  messages: z.array(z.string()).optional()
});
const User_SendMobileDownloadSMSWSRequest: z.ZodObject<any> = z.object({
  phoneNumber: z.string().optional()
});
const User_SendMobileDownloadSMSWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_SendPartnerAccessGrantedEmailWSRequest: z.ZodObject<any> = z.object({
  loginLink: z.string().optional(),
  partnerEmailAddress: z.string().optional(),
  partnerFullName: z.string().optional(),
  phoneNumber: z.string().optional()
});
const User_SendPartnerAccessGrantedEmailWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_SendRhombusKeyUserWelcomeEmailWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const User_SendRhombusKeyUserWelcomeEmailWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_SendUserWelcomeEmailWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const User_SendUserWelcomeEmailWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_SetupVirtualMfaDeviceForCurrentUserWSRequest = z.record(z.unknown());
const User_SetupVirtualMfaDeviceForCurrentUserWSResponse: z.ZodObject<any> = z.object({
  alreadyExists: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  qrCodeSetupData: z.string().optional(),
  success: z.boolean().optional()
});
const User_UpdatePartnerUserNotificationSettingsWSRequest: z.ZodObject<any> = z.object({
  allClientsSelected: z.boolean().optional(),
  clientNotificationIntervalsMap: z.record(z.unknown()).optional(),
  notificationIntervalsForAllClients: z.array(PartnerNotificationClientSection).optional(),
  orgUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const User_UpdatePartnerUserNotificationSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_UpdatePartnerWSRequest: z.ZodObject<any> = z.object({
  bypassSaml: z.boolean().optional(),
  mfaEnabled: z.boolean().optional(),
  name: z.string().optional(),
  notificationSettings: PartnerNotificationSettingsType.optional(),
  notificationSettingsV2: PartnerNotificationSettingsV2.optional(),
  permissionGroupUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  userUuid: z.string().optional()
});
const User_UpdatePartnerWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_UpdateRhombusKeySettingsForUserWSRequest: z.ZodObject<any> = z.object({
  bypassSaml: z.boolean().optional(),
  endDateProvisioner: EpochSecondsProvisioner.optional(),
  maxMobileCredsAllowed: z.number().int().optional(),
  remoteUnlockEnabled: z.boolean().optional(),
  rhombusKeyAccessEnabled: z.boolean().optional(),
  startDateProvisioner: EpochSecondsProvisioner.optional(),
  userUuid: z.string().optional()
});
const User_UpdateRhombusKeySettingsForUserWSResponse: z.ZodObject<any> = z.object({
  userRhombusKeyConfig: RhombusKeyAppConfigType.optional()
});
const User_UpdateUserCustomizationFlagsWSRequest: z.ZodObject<any> = z.object({
  userCustomizationFlags: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const User_UpdateUserCustomizationFlagsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_UpdateUserNotificationSettingsWSRequest: z.ZodObject<any> = z.object({
  orgUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  timeFrames: z.array(NotificationTimeFrame).optional(),
  updatedSetMethodMap: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const User_UpdateUserNotificationSettingsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_UpdateUserSelectiveWSRequest: z.ZodObject<any> = z.object({
  bypassSaml: z.boolean().optional(),
  mfaEnabled: z.boolean().optional(),
  name: z.string().optional(),
  notificationIntervalsV2: z.array(NotificationIntervalV2Type).optional(),
  permissionGroupUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  userUuid: z.string().optional()
});
const User_UpdateUserSelectiveWSResponse = z.record(z.unknown());
const User_UpdateUserWSRequest: z.ZodObject<any> = z.object({
  bypassSaml: z.boolean().optional(),
  mfaEnabled: z.boolean().optional(),
  name: z.string().optional(),
  notificationIntervalsV2: z.array(NotificationIntervalV2Type).optional(),
  permissionGroupUuid: z.string().optional(),
  smsPhoneNumbers: z.array(z.string()).optional(),
  summaryEmailEnabled: z.boolean().optional(),
  userUuid: z.string().optional()
});
const User_UpdateUserWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const User_metadata_CreateUserMetadataFieldTemplateWSRequest: z.ZodObject<any> = z.object({
  template: UserMetadataFieldTemplate.optional()
});
const User_metadata_CreateUserMetadataFieldTemplateWSResponse: z.ZodObject<any> = z.object({
  template: UserMetadataFieldTemplate.optional()
});
const User_metadata_DeleteUserMetadataFieldTemplateWSRequest: z.ZodObject<any> = z.object({
  templateUuid: z.string().optional()
});
const User_metadata_DeleteUserMetadataFieldTemplateWSResponse: z.ZodObject<any> = z.object({
  template: UserMetadataFieldTemplate.optional()
});
const User_metadata_DeleteUserMetadataFieldWSRequest: z.ZodObject<any> = z.object({
  templateUuid: z.string().optional(),
  userUuid: z.string().optional()
});
const User_metadata_DeleteUserMetadataFieldWSResponse: z.ZodObject<any> = z.object({
  field: UserMetadataField.optional()
});
const User_metadata_FindUserMetadataFieldTemplatesWSRequest = z.record(z.unknown());
const User_metadata_FindUserMetadataFieldTemplatesWSResponse: z.ZodObject<any> = z.object({
  templateMap: z.record(z.unknown()).optional()
});
const User_metadata_FindUserMetadataFieldsWSRequest: z.ZodObject<any> = z.object({
  userUuid: z.string().optional()
});
const User_metadata_FindUserMetadataFieldsWSResponse: z.ZodObject<any> = z.object({
  templateMap: z.record(z.unknown()).optional(),
  userFieldValueMap: z.record(z.unknown()).optional()
});
const User_metadata_SaveUserMetadataFieldsWSRequest: z.ZodObject<any> = z.object({
  fieldValueMap: z.record(z.unknown()).optional(),
  userUuid: z.string().optional()
});
const User_metadata_SaveUserMetadataFieldsWSResponse: z.ZodObject<any> = z.object({
  templateMap: z.record(z.unknown()).optional(),
  userFieldValueMap: z.record(z.unknown()).optional()
});
const User_metadata_UpdateUserMetadataFieldTemplateWSRequest: z.ZodObject<any> = z.object({
  selectiveUpdate: UserMetadataFieldTemplateSelectiveUpdate.optional()
});
const User_metadata_UpdateUserMetadataFieldTemplateWSResponse: z.ZodObject<any> = z.object({
  template: UserMetadataFieldTemplate.optional()
});
const VacantActivityEventType: z.ZodObject<any> = z.object({
  activityEvent: ActivityEnum.optional()
});
const VehicleV2Type: z.ZodObject<any> = z.object({
  alert: z.boolean().optional(),
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  licensePlate: z.string().optional(),
  name: z.string().optional(),
  orgUuid: z.string().optional(),
  thumbnailS3Key: z.string().optional(),
  trust: z.boolean().optional()
});
const Vehicle_AddVehicleLabelWSRequest: z.ZodObject<any> = z.object({
  label: z.string().optional(),
  vehicleLicensePlate: z.string().optional()
});
const Vehicle_AddVehicleLabelWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Vehicle_AssociateEventsToVehicleWSRequest: z.ZodObject<any> = z.object({
  eventUuids: z.array(z.string()).optional(),
  vehicleLicensePlate: z.string().optional()
});
const Vehicle_AssociateEventsToVehicleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Vehicle_DeleteVehicleWSRequest: z.ZodObject<any> = z.object({
  vehicleLicensePlate: z.string().optional()
});
const Vehicle_DeleteVehicleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Vehicle_GetRecentVehicleEventsByLocationWSRequest: z.ZodObject<any> = z.object({
  endTimeMs: z.number().int().optional(),
  locationUuid: z.string().optional(),
  startTimeMs: z.number().int().optional()
});
const Vehicle_GetRecentVehicleEventsByLocationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  events: z.array(VehicleEventIndexType).optional()
});
const Vehicle_GetRecentVehicleEventsForVehicleWSRequest: z.ZodObject<any> = z.object({
  endTimeMs: z.number().int().optional(),
  licensePlate: z.string().optional(),
  startTimeMs: z.number().int().optional()
});
const Vehicle_GetRecentVehicleEventsForVehicleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  events: z.array(VehicleEventIndexType).optional()
});
const Vehicle_GetRecentVehicleEventsWSRequest: z.ZodObject<any> = z.object({
  deviceUuids: z.array(z.string()).optional(),
  endTimeMs: z.number().int().optional(),
  startTimeMs: z.number().int().optional()
});
const Vehicle_GetRecentVehicleEventsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  events: z.array(VehicleEventIndexType).optional()
});
const Vehicle_GetVehicleEventsWSRequest: z.ZodObject<any> = z.object({
  deviceUuidFilter: z.array(z.string()).optional(),
  endTimeMs: z.number().int().optional(),
  licensePlateExactQuery: z.array(z.string()).optional(),
  licensePlateFuzzyQuery: z.string().optional(),
  locationUuidFilter: z.array(z.string()).optional(),
  nameQuery: z.array(z.string()).optional(),
  startTimeMs: z.number().int().optional(),
  unnamedQuery: z.boolean().optional(),
  vehicleLabelQuery: z.array(z.string()).optional()
});
const Vehicle_GetVehicleEventsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  events: z.array(VehicleEventIndexType).optional()
});
const Vehicle_GetVehicleLabelsForOrgWSRequest = z.record(z.unknown());
const Vehicle_GetVehicleLabelsForOrgWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  vehicleLabels: z.record(z.unknown()).optional()
});
const Vehicle_GetVehiclesWSRequest = z.record(z.unknown());
const Vehicle_GetVehiclesWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  vehicles: z.array(VehicleV2Type).optional()
});
const Vehicle_RemoveVehicleLabelWSRequest: z.ZodObject<any> = z.object({
  label: z.string().optional(),
  vehicleLicensePlate: z.string().optional()
});
const Vehicle_RemoveVehicleLabelWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Vehicle_ReportVehicleEventRequest: z.ZodObject<any> = z.object({
  eventUuid: z.string().optional()
});
const Vehicle_ReportVehicleEventResponse: z.ZodObject<any> = z.object({
  collectedMediaForTraining: z.boolean().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Vehicle_SaveVehicleWSRequest: z.ZodObject<any> = z.object({
  alert: z.boolean().optional(),
  createdAtMillis: z.number().int().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  thumbnailS3Key: z.string().optional(),
  trust: z.boolean().optional(),
  vehicleLicensePlate: z.string().optional()
});
const Vehicle_SaveVehicleWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_CancelSpliceV2WSRequest: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional(),
  clipUuidList: z.array(z.string()).optional(),
  deviceUuids: z.array(z.string()).optional()
});
const Video_CancelSpliceV2WSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_CancelSpliceWSRequest: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional(),
  deviceUuid: z.string().optional()
});
const Video_CancelSpliceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_CreateSharedTimelapseGroupWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  expirationTimeSecs: z.number().int().optional(),
  plaintextPassword: z.string().optional(),
  timelapseUuids: z.array(z.string()).optional(),
  title: z.string().optional()
});
const Video_CreateSharedTimelapseGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  shareUrl: z.string().optional(),
  uuid: z.string().optional()
});
const Video_DeleteSharedTimelapseGroupWSRequest: z.ZodObject<any> = z.object({
  uuid: z.string().optional()
});
const Video_DeleteSharedTimelapseGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_DeleteTimelapseClipsWSRequest: z.ZodObject<any> = z.object({
  clipUuids: z.array(z.string()).optional()
});
const Video_DeleteTimelapseClipsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_GenerateTimelapseClipWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  deviceUuids: z.array(z.string()).optional(),
  drawCameraDetails: z.boolean().optional(),
  drawTimestamp: z.boolean().optional(),
  skipNights: z.boolean().optional(),
  skipWeekends: z.boolean().optional(),
  startTime: z.number().int().optional(),
  stopTime: z.number().int().optional(),
  title: z.string().optional(),
  videoDuration: z.number().int().optional(),
  videoFormat: z.string().optional()
});
const Video_GenerateTimelapseClipWSResponse: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_GetExactFrameUriWSRequest: z.ZodObject<any> = z.object({
  cameraUuid: z.string(),
  downscaleFactor: z.number().int().min(1).optional(),
  jpgQuality: z.number().int().min(0).max(100).optional(),
  permyriadCropHeight: z.number().int().min(0).max(10000).optional(),
  permyriadCropWidth: z.number().int().min(0).max(10000).optional(),
  permyriadCropX: z.number().int().min(0).max(10000).optional(),
  permyriadCropY: z.number().int().min(0).max(10000).optional(),
  timestampMs: z.number().int()
});
const Video_GetExactFrameUriWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  frameUri: z.string().optional(),
  responseMessage: z.string().optional()
});
const Video_GetMaxSpliceDurationWSRequest = z.record(z.unknown());
const Video_GetMaxSpliceDurationWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  maxDuration: z.number().int().optional()
});
const Video_GetSharedTimelapseGroupsWSRequest = z.record(z.unknown());
const Video_GetSharedTimelapseGroupsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  sharedTimelapses: z.array(SharedTimelapseGroupWrapperType).optional()
});
const Video_GetSplicedClipsInProgressWSRequest = z.record(z.unknown());
const Video_GetSplicedClipsInProgressWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  splicedClips: z.array(SplicedClipType).optional()
});
const Video_GetTimelapseClipsWSRequest = z.record(z.unknown());
const Video_GetTimelapseClipsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  timelapseClips: z.array(TimelapseClipType).optional()
});
const Video_GetTimelapseMetadataWSRequest: z.ZodObject<any> = z.object({
  deviceUuidList: z.array(z.string()).optional()
});
const Video_GetTimelapseMetadataWSResponse: z.ZodObject<any> = z.object({
  earliestTimestampMap: z.record(z.unknown()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_RetrySpliceWSRequest: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional(),
  deviceUuid: z.string().optional(),
  duration: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const Video_RetrySpliceWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_ShareTimelapseClipsWSRequest: z.ZodObject<any> = z.object({
  clipUuids: z.array(z.string()).optional()
});
const Video_ShareTimelapseClipsWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  shareUrlMap: z.record(z.unknown()).optional()
});
const Video_SpliceFrameWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  timestampMs: z.number().int().optional()
});
const Video_SpliceFrameWSResponse: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  region: z.string().optional()
});
const Video_SpliceV2WSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  deviceUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  fisheyePresentationMap: z.record(z.unknown()).optional(),
  startTimeMillis: z.number().int().optional(),
  title: z.string().optional()
});
const Video_SpliceV2WSResponse: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_SpliceV3WSRequest: z.ZodObject<any> = z.object({
  alteredViewMap: z.record(z.unknown()).optional(),
  audioIncluded: z.boolean().optional(),
  clipVisibility: ClipVisibility.optional(),
  description: z.string().optional(),
  deviceUuids: z.array(z.string()).optional(),
  durationSec: z.number().int().optional(),
  integrationUploadMap: z.record(z.unknown()).optional(),
  saveToConsole: z.boolean().optional(),
  sendToSharedStorage: z.boolean().optional(),
  sendToUserStorage: z.boolean().optional(),
  startTimeMillis: z.number().int().optional(),
  title: z.string().optional()
});
const Video_SpliceV3WSResponse: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional(),
  clipUuidList: z.array(z.string()).optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_SpliceWSRequest: z.ZodObject<any> = z.object({
  deviceUuid: z.string().optional(),
  duration: z.number().int().optional(),
  startTime: z.number().int().optional()
});
const Video_SpliceWSResponse: z.ZodObject<any> = z.object({
  clipUuid: z.string().optional(),
  error: z.boolean().optional(),
  errorMsg: z.string().optional()
});
const Video_UpdateSharedTimelapseGroupWSRequest: z.ZodObject<any> = z.object({
  description: z.string().optional(),
  descriptionUpdate: z.boolean().optional(),
  expirationTimeSecs: z.number().int().optional(),
  expirationTimeUpdate: z.boolean().optional(),
  passwordUpdate: z.boolean().optional(),
  plaintextPassword: z.string().optional(),
  title: z.string().optional(),
  titleUpdate: z.boolean().optional(),
  uuid: z.string().optional()
});
const Video_UpdateSharedTimelapseGroupWSResponse: z.ZodObject<any> = z.object({
  error: z.boolean().optional(),
  errorMsg: z.string().optional(),
  shareUrl: z.string().optional(),
  uuid: z.string().optional()
});
const Video_UpdateTimelapseClipMetadataWSRequest: z.ZodObject<any> = z.object({
  clipUuid: z.string(),
  description: z.string().optional(),
  title: z.string().optional()
});
const Video_UpdateTimelapseClipMetadataWSResponse: z.ZodObject<any> = z.object({
  timelapseClip: TimelapseClipType.optional()
});
const WebhookInfo: z.ZodObject<any> = z.object({
  webhookDisabled: z.boolean().optional(),
  webhookSecret: z.string().optional()
});
const WebhookMapEntry: z.ZodObject<any> = z.object({
  orgId: z.number().int().optional(),
  webhookId: z.number().int().optional()
});
const ZapierWebhookSettings: z.ZodObject<any> = z.object({
  backoffSec: z.number().int().optional(),
  doorState: z.string().optional(),
  humidityLowerThreshold: z.number().optional(),
  humidityUpperThreshold: z.number().optional(),
  tempLowerThreshold: z.number().optional(),
  tempUpperThreshold: z.number().optional(),
  url: z.string(),
  uuids: z.array(z.string()).optional(),
  zapEnum: ZapierEnum
});

// API client generation disabled due to TypeScript complexity limits
// const endpoints = makeApi([]);
// export const api = new Zodios(endpoints);

export const schemas = {
  BodyPart,
  MultiPart,
  LocationType,
  ACUDoorCatalogItem,
  ACUDoorLicenseType,
  ShippedItemType,
  AITShipmentInfoType,
  AMSirenSettingsType,
  AbsoluteSecondsIntervalType,
  AbsoluteSecondsScheduleType,
  AccessControlAuthenticationResultEnumType,
  AccessControlAuthorizationResultEnumType,
  AccessControlCredentialEnumType,
  AccessControlCredentialWorkflowStatusEnumType,
  StandardCsnType,
  SecureTokenAlgorithm,
  RhombusSecureCsnType,
  RhombusSecureMobileFeatureSettingStatus,
  RhombusSecureMobileFeatureSetting,
  RhombusSecureMobileFeatureStatus,
  RhombusSecureMobileFeature,
  MobileTokenOSEnum,
  RhombusSecureMobileType,
  PinCredential,
  WiegandFormatEnumType,
  WiegandH10301CredentialType,
  WiegandH10304Credential,
  WiegandD10202Credential,
  Wiegand64BitRawCredentialType,
  AccessControlCredentialType,
  ComponentEventEnumType,
  AccessControlUnitBatteryStateChangeEventType,
  FirstInFirmwareStatus,
  EventOriginatorEnum,
  SupportAuthorityEventOriginator,
  ApiTokenEventOriginator,
  UserEventOriginator,
  RuleEventOriginator,
  ComponentCompositeEventOriginator,
  BaseEventOriginator,
  FirstInSourceEnum,
  DoorFirstInStateChangeEventReference,
  AccessControlUnitDoorFirstInStateEvent,
  LockdownPlanScopeEnumType,
  LockdownPlanReference,
  LocationLockdownStateEnumType,
  AccessControlUnitLocationLockdownStateEventType,
  AccessControlUnitTamperSourceEnumType,
  AccessControlUnitTamperEventType,
  ActivityEnum,
  SubLocationsHierarchyKey,
  MetaDataLocationType,
  AccessControlledDoorPolicyAlertType,
  WeeklyMinuteIntervalType,
  WeeklyRepeatingScheduleType,
  AccessControlledDoorScheduledTriggerType,
  AccessControlledDoorPolicyType,
  FirstInShadow,
  DoorStateSourceEnum,
  AccessControlledDoorStateEnumType,
  DoorStateShadow,
  ComponentCompositeShadowEnum,
  AccessControlledDoorShadow,
  ComponentReferenceType,
  FirstInStatus,
  FirstInState,
  ManualDoorStateChangeEnum,
  BaseDoorStateOverride,
  ProximityUnlockSettingsType,
  ComponentCompositeEnumType,
  WaveToUnlockSettingsType,
  AccessControlledDoorType,
  ComponentReferenceType_Minimal,
  EventOriginatorEnum_Minimal,
  BaseEventOriginator_Minimal,
  FirstInStatus_Minimal,
  FirstInState_Minimal,
  ManualDoorStateChangeEnum_Minimal,
  BaseDoorStateOverride_Minimal,
  ProximityUnlockSettingsType_Minimal,
  ComponentCompositeEnumType_Minimal,
  WaveToUnlockSettingsType_Minimal,
  AccessControlledDoorType_Minimal,
  Accesscontrol_SendUserPresenceForCurrentUserSuccessWsResponse,
  Accesscontrol_SendUserPresenceForCurrentUserErrorWsResponse,
  Accesscontrol_BaseSendUserPresenceForCurrentUserWsResponse,
  Accesscontrol_DeviceUnlockableAccessControlledDoorType,
  Accesscontrol_FindUnlockableAccessControlledDoorsByDeviceWSRequest,
  Accesscontrol_FindUnlockableAccessControlledDoorsByDeviceWSResponse,
  Accesscontrol_ForceRefreshAccessControlUnitConfigWSRequest,
  Accesscontrol_ForceRefreshAccessControlUnitConfigWSResponse,
  Accesscontrol_GetMinimalAccessControlledDoorsByLocationForCurrentUserWSRequest,
  Accesscontrol_UserAccessGrant,
  Accesscontrol_UserAccessRevocation,
  RealtimeRelativeSecondsScheduleType,
  LocalDateTimeIntervalType,
  RelativeDateTimeIntervalsScheduleType,
  BaseSavedScheduleType_Minimal,
  Accesscontrol_GetMinimalAccessControlledDoorsByLocationForCurrentUserWSResponse,
  Accesscontrol_SendUserPresenceForCurrentUserWSRequest_Destination,
  Accesscontrol_SendUserPresenceForCurrentUserWSRequest,
  Accesscontrol_UnlockAccessControlledDoorErrorWSResponse,
  Accesscontrol_UnlockAccessControlledDoorForCurrentUserErrorWSResponse,
  Accesscontrol_UnlockAccessControlledDoorForCurrentUserSuccessWSResponse,
  Accesscontrol_UnlockAccessControlledDoorForCurrentUserWSRequest,
  Accesscontrol_UnlockAccessControlledDoorSuccessWSResponse,
  Accesscontrol_UnlockAccessControlledDoorWSRequest,
  LocationAccessGrantType,
  Accesscontrol_accessgrant_CreateAccessGrantWSRequest,
  Accesscontrol_accessgrant_CreateAccessGrantWSResponse,
  Accesscontrol_accessgrant_DeleteLocationAccessGrantWSRequest,
  Accesscontrol_accessgrant_DeleteLocationAccessGrantWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByAccessControlledDoorWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByAccessControlledDoorWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByDoorLabelWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByDoorLabelWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByGroupWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByGroupWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationAndUserWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationAndUserWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByLocationWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByOrgWSResponse,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByUserWSRequest,
  Accesscontrol_accessgrant_FindLocationAccessGrantsByUserWSResponse,
  Accesscontrol_accessgrant_GetLocationAccessGrantWSRequest,
  Accesscontrol_accessgrant_GetLocationAccessGrantWSResponse,
  Accesscontrol_accessgrant_GetLocationsByAccessGrantForCurrentUserWSRequest,
  LocationLockdownStateType,
  FloorPlanType,
  QualifiedAddressType,
  LockdownActivationPlanType,
  LockdownDeactivationPlanType,
  DoorLockdownStateEnumType,
  LockdownPhysicalAccessType,
  LockdownTestPlanType,
  LocationLockdownPlanType,
  BaseLockdownPlanType,
  Accesscontrol_accessgrant_GetLocationsByAccessGrantForCurrentUserWSResponse,
  Accesscontrol_accessgrant_GetRhombusKeyLocationLockdownDetailsForCurrentUserWSRequest,
  Accesscontrol_accessgrant_GetRhombusKeyLocationLockdownDetailsForCurrentUserWSResponse,
  Accesscontrol_accessgrant_UpdateAccessGrantWSRequest,
  Accesscontrol_accessgrant_UpdateAccessGrantWSResponse,
  LocationAccessRevocationType,
  Accesscontrol_accessrevocation_CreateAccessRevocationWSRequest,
  Accesscontrol_accessrevocation_CreateAccessRevocationWSResponse,
  Accesscontrol_accessrevocation_DeleteLocationAccessRevocationWSRequest,
  Accesscontrol_accessrevocation_DeleteLocationAccessRevocationWSResponse,
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
  Accesscontrol_accessrevocation_GetLocationAccessRevocationWSRequest,
  Accesscontrol_accessrevocation_GetLocationAccessRevocationWSResponse,
  Accesscontrol_accessrevocation_UpdateAccessRevocationWSRequest,
  Accesscontrol_accessrevocation_UpdateAccessRevocationWSResponse,
  BadgeTemplateElementEnum,
  CustomTextElement,
  UserMetadataEnum,
  UserMetadataTextElement,
  UserCustomMetadataTextElement,
  CustomImageElement,
  UserProfilePhotoElement,
  BaseBadgeTemplateElement,
  BadgeTemplate,
  Accesscontrol_badgetemplate_CreateBadgeTemplateWSRequest,
  Accesscontrol_badgetemplate_CreateBadgeTemplateWSResponse,
  Accesscontrol_badgetemplate_DeleteBadgeTemplateImageWSRequest,
  BadgeTemplateImage,
  Accesscontrol_badgetemplate_DeleteBadgeTemplateImageWSResponse,
  Accesscontrol_badgetemplate_DeleteBadgeTemplateWSRequest,
  Accesscontrol_badgetemplate_DeleteBadgeTemplateWSResponse,
  Accesscontrol_badgetemplate_FindBadgeTemplateImagesWSRequest,
  Accesscontrol_badgetemplate_FindBadgeTemplateImagesWSResponse,
  Accesscontrol_badgetemplate_FindBadgeTemplatesWSRequest,
  Accesscontrol_badgetemplate_FindBadgeTemplatesWSResponse,
  Accesscontrol_badgetemplate_GetBadgeTemplateImageWSRequest,
  Accesscontrol_badgetemplate_GetBadgeTemplateImageWSResponse,
  Accesscontrol_badgetemplate_GetBadgeTemplateWSRequest,
  Accesscontrol_badgetemplate_GetBadgeTemplateWSResponse,
  BadgeTemplateImageSelectiveUpdate,
  Accesscontrol_badgetemplate_UpdateBadgeTemplateImageWSRequest,
  Accesscontrol_badgetemplate_UpdateBadgeTemplateImageWSResponse,
  BadgeTemplateSelectiveUpdate,
  Accesscontrol_badgetemplate_UpdateBadgeTemplateWSRequest,
  Accesscontrol_badgetemplate_UpdateBadgeTemplateWSResponse,
  Accesscontrol_credentials_AssignAccessControlCredentialWSRequest,
  Accesscontrol_credentials_AssignAccessControlCredentialWSResponse,
  Accesscontrol_credentials_ProvisionMobileAccessControlCredentialForCurrentUserSuccessWSResponse,
  Accesscontrol_credentials_ProvisionMobileAccessControlCredentialForCurrentUserErrorWSResponse,
  Accesscontrol_credentials_BaseProvisionMobileAccessControlCredentialForCurrentUserWSResponse,
  Accesscontrol_credentials_BaseUnlockAccessControlledDoorForCurrentUserWSResponse,
  Accesscontrol_credentials_BaseUnlockAccessControlledDoorWSResponse,
  Accesscontrol_credentials_BulkProvisionPinCredentialsWSRequest,
  Accesscontrol_credentials_BulkProvisionPinCredentialsWSResponse,
  Accesscontrol_credentials_BulkRotatePinCredentialsWSRequest,
  Accesscontrol_credentials_BulkRotatePinCredentialsWSResponse,
  Accesscontrol_credentials_CreateAccessControlCredentialByHexValueAndTypeWSRequest,
  Accesscontrol_credentials_CreateAccessControlCredentialByHexValueAndTypeWSResponse,
  Accesscontrol_credentials_CreateAppleWalletPassWSRequest,
  Accesscontrol_credentials_CreateAppleWalletPassWSResponse,
  Accesscontrol_credentials_CreatePinCredentialWSRequest,
  Accesscontrol_credentials_CreatePinCredentialWSResponse,
  Accesscontrol_credentials_CreateRhombusSecureCsnCredentialWSRequest,
  Accesscontrol_credentials_CreateRhombusSecureCsnCredentialWSResponse,
  Accesscontrol_credentials_CreateStandardCsnCredentialWSRequest,
  Accesscontrol_credentials_CreateStandardCsnCredentialWSResponse,
  Accesscontrol_credentials_CreateWiegand64BitRawCredentialWSRequest,
  Accesscontrol_credentials_CreateWiegand64BitRawCredentialWSResponse,
  Accesscontrol_credentials_CreateWiegandCredentialWSRequest,
  Accesscontrol_credentials_CreateWiegandCredentialWSResponse,
  Accesscontrol_credentials_CreateWiegandD10202CredentialWSRequest,
  Accesscontrol_credentials_CreateWiegandD10202CredentialWSResponse,
  Accesscontrol_credentials_CreateWiegandH10301CredentialWSRequest,
  Accesscontrol_credentials_CreateWiegandH10301CredentialWSResponse,
  Accesscontrol_credentials_CreateWiegandH10304CredentialWSRequest,
  Accesscontrol_credentials_CreateWiegandH10304CredentialWSResponse,
  Accesscontrol_credentials_DeleteAccessControlCredentialWSRequest,
  Accesscontrol_credentials_DeleteAccessControlCredentialWSResponse,
  Accesscontrol_credentials_DeletePinCredentialWSRequest,
  Accesscontrol_credentials_DeletePinCredentialWSResponse,
  Accesscontrol_credentials_DeleteUnassignedAccessControlCredentialWSRequest,
  Accesscontrol_credentials_DeleteUnassignedAccessControlCredentialWSResponse,
  CredentialQueryFilter,
  Accesscontrol_credentials_FindAccessControlCredentialByOrgWSRequest,
  Accesscontrol_credentials_FindAccessControlCredentialByOrgWSResponse,
  Accesscontrol_credentials_FindAccessControlCredentialByUserWSRequest,
  Accesscontrol_credentials_FindAccessControlCredentialByUserWSResponse,
  Accesscontrol_credentials_FindAccessControlCredentialByUsersWSRequest,
  Accesscontrol_credentials_FindAccessControlCredentialByUsersWSResponse,
  Accesscontrol_credentials_FindCredentialHistoryByCredentialHexValueWSRequest,
  Accesscontrol_credentials_FindCredentialHistoryByCredentialHexValueWSResponse,
  Accesscontrol_credentials_FindCredentialHistoryByCredentialValueWSRequest,
  Accesscontrol_credentials_FindCredentialHistoryByCredentialValueWSResponse,
  Accesscontrol_credentials_FindCredentialHistoryByUserWSRequest,
  Accesscontrol_credentials_FindCredentialHistoryByUserWSResponse,
  Accesscontrol_credentials_FindCredentialHistoryWSRequest,
  Accesscontrol_credentials_FindCredentialHistoryWSResponse,
  Accesscontrol_credentials_FindPinCredentialsByOrgWSRequest,
  Accesscontrol_credentials_FindPinCredentialsByOrgWSResponse,
  Accesscontrol_credentials_FindRhombusSecureMobileCredentialsForCurrentUserWSRequest,
  Accesscontrol_credentials_FindRhombusSecureMobileCredentialsForCurrentUserWSResponse,
  Accesscontrol_credentials_GetAvailablePinCodeWSRequest,
  Accesscontrol_credentials_GetAvailablePinCodeWSResponse,
  Accesscontrol_credentials_GetPinCredentialDetailsWSRequest,
  Accesscontrol_credentials_GetPinCredentialDetailsWSResponse,
  Accesscontrol_credentials_GetRhombusSecureCsnCredentialDetailsWSRequest,
  Accesscontrol_credentials_GetRhombusSecureCsnCredentialDetailsWSResponse,
  Accesscontrol_credentials_GetRhombusSecureMobileAppStateStatsForOrgWSRequest,
  RhombusSecureMobileCredStatRhombusSecureMobileFeatureStatus,
  RhombusSecureMobileCredStatString,
  RhombusSecureMobileAppStateStats,
  Accesscontrol_credentials_GetRhombusSecureMobileAppStateStatsForOrgWSResponse,
  Accesscontrol_credentials_GetStandardCsnCredentialDetailsWSRequest,
  Accesscontrol_credentials_GetStandardCsnCredentialDetailsWSResponse,
  Accesscontrol_credentials_ProvisionMobileAccessControlCredentialForCurrentUserWSRequest,
  Accesscontrol_credentials_RevokeAccessControlCredentialWSRequest,
  Accesscontrol_credentials_RevokeAccessControlCredentialWSResponse,
  Accesscontrol_credentials_RevokePinCredentialWSRequest,
  Accesscontrol_credentials_RevokePinCredentialWSResponse,
  Accesscontrol_credentials_RevokeRhombusSecureMobileCredentialForCurrentUserWSRequest,
  Accesscontrol_credentials_RevokeRhombusSecureMobileCredentialForCurrentUserWSResponse,
  Accesscontrol_credentials_RotatePinCredentialWSRequest,
  Accesscontrol_credentials_RotatePinCredentialWSResponse,
  Accesscontrol_credentials_SuspendAccessControlCredentialWSRequest,
  Accesscontrol_credentials_SuspendAccessControlCredentialWSResponse,
  Accesscontrol_credentials_UnsuspendAccessControlCredentialWSRequest,
  Accesscontrol_credentials_UnsuspendAccessControlCredentialWSResponse,
  Accesscontrol_credentials_UpdateAccessControlCredentialNoteWSRequest,
  Accesscontrol_credentials_UpdateAccessControlCredentialNoteWSResponse,
  Accesscontrol_credentials_UpdatePinCredentialWSRequest,
  Accesscontrol_credentials_UpdatePinCredentialWSResponse,
  Accesscontrol_credentials_UpdateRhombusKeyMobileAppStateForCurrentUserWSRequest,
  RhombusSecureMobileAppState,
  Accesscontrol_credentials_UpdateRhombusKeyMobileAppStateForCurrentUserWSResponse,
  Accesscontrol_credentials_UpdateRhombusSecureCsnCredentialWSRequest,
  Accesscontrol_credentials_UpdateRhombusSecureCsnCredentialWSResponse,
  Accesscontrol_credentials_UpdateRhombusSecureMobileCredentialWSRequest,
  Accesscontrol_credentials_UpdateRhombusSecureMobileCredentialWSResponse,
  Accesscontrol_credentials_UpdateStandardCsnCredentialWSRequest,
  Accesscontrol_credentials_UpdateStandardCsnCredentialWSResponse,
  Accesscontrol_credentials_UpdateWiegandCredentialWSRequest,
  Accesscontrol_credentials_UpdateWiegandCredentialWSResponse,
  LocalInterval,
  DoorScheduleExceptionType,
  Accesscontrol_doorexception_CreateDoorScheduleExceptionWSRequest,
  Accesscontrol_doorexception_CreateDoorScheduleExceptionWSResponse,
  Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSRequest,
  Accesscontrol_doorexception_DeleteDoorScheduleExceptionWSResponse,
  DateRangeFilter,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSRequest,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsForDoorWSResponse,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSRequest,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsForLocationWSResponse,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsWSRequest,
  Accesscontrol_doorexception_FindDoorScheduleExceptionsWSResponse,
  Accesscontrol_doorexception_GetDoorScheduleExceptionWSRequest,
  Accesscontrol_doorexception_GetDoorScheduleExceptionWSResponse,
  Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSRequest,
  Accesscontrol_doorexception_UpdateDoorScheduleExceptionWSResponse,
  Accesscontrol_firstin_ApplyDoorAuthFirstInGroupStateWSRequest,
  FirstInResetEnum,
  DailyFirstInReset,
  BaseFirstInReset,
  LocationFirstInSettings,
  Accesscontrol_firstin_ApplyDoorAuthFirstInGroupStateWSResponse,
  Accesscontrol_firstin_ApplyDoorAuthFirstInStateWSRequest,
  Accesscontrol_firstin_ApplyDoorAuthFirstInStateWSResponse,
  Accesscontrol_firstin_ApplyDoorScheduleFirstInGroupStateWSRequest,
  Accesscontrol_firstin_ApplyDoorScheduleFirstInGroupStateWSResponse,
  Accesscontrol_firstin_ApplyDoorScheduleFirstInStateWSRequest,
  Accesscontrol_firstin_ApplyDoorScheduleFirstInStateWSResponse,
  Accesscontrol_firstin_CreateLocationFirstInSettingsWSRequest,
  Accesscontrol_firstin_CreateLocationFirstInSettingsWSResponse,
  Accesscontrol_firstin_DeleteLocationFirstInSettingsWSRequest,
  Accesscontrol_firstin_DeleteLocationFirstInSettingsWSResponse,
  Accesscontrol_firstin_FindLocationFirstInSettingsByLocationWSRequest,
  Accesscontrol_firstin_FindLocationFirstInSettingsByLocationWSResponse,
  Accesscontrol_firstin_FindLocationFirstInSettingsByOrgWSRequest,
  Accesscontrol_firstin_FindLocationFirstInSettingsByOrgWSResponse,
  Accesscontrol_firstin_GetLocationFirstInSettingsForDoorWSRequest,
  Accesscontrol_firstin_GetLocationFirstInSettingsForDoorWSResponse,
  Accesscontrol_firstin_GetLocationFirstInSettingsWSRequest,
  Accesscontrol_firstin_GetLocationFirstInSettingsWSResponse,
  Accesscontrol_firstin_RemoveDoorLocationFirstInSettingsWSRequest,
  Accesscontrol_firstin_RemoveDoorLocationFirstInSettingsWSResponse,
  Accesscontrol_firstin_UpdateLocationFirstInSettingsWSRequest,
  Accesscontrol_firstin_UpdateLocationFirstInSettingsWSResponse,
  Accesscontrol_lockdownplan_ActivateLockdownForLocationViaRhombusKeyWSRequest,
  LockdownActivationResultEnumType,
  Accesscontrol_lockdownplan_ActivateLockdownForLocationViaRhombusKeyWSResponse,
  Accesscontrol_lockdownplan_ActivateLockdownForLocationWSRequest,
  Accesscontrol_lockdownplan_ActivateLockdownForLocationWSResponse,
  Accesscontrol_lockdownplan_CreateLocationLockdownPlanWSRequest,
  Accesscontrol_lockdownplan_CreateLocationLockdownPlanWSResponse,
  ActivateLocationLockdownActionType,
  AudioPlaybackActionType,
  CancelLoopingAudioPlaybackActionType,
  ConnectAudioDeviceToPhoneNumberActionType,
  CustomLLMActionType,
  IntegrationEnum,
  IntegrationCommandActionType,
  IntegrationNotificationActionType,
  RemoteDoorUnlockSystemEnum,
  RemoteDoorUnlockActionType,
  ComponentRelayOutputType,
  GenericRelayStateEnumType,
  TriggerComponentRelayActionType,
  WebhookActionType,
  RuleActionType,
  RuleFilterType,
  Accesscontrol_lockdownplan_ExternalLockdownPlanRuleType,
  Accesscontrol_lockdownplan_CreateLockdownRuleForLocationWSRequest,
  Accesscontrol_lockdownplan_CreateLockdownRuleForLocationWSResponse,
  Accesscontrol_lockdownplan_DeactivateLockdownForLocationViaRhombusKeyWSRequest,
  LockdownDeactivationResultEnumType,
  Accesscontrol_lockdownplan_DeactivateLockdownForLocationViaRhombusKeyWSResponse,
  Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSRequest,
  Accesscontrol_lockdownplan_DeactivateLockdownForLocationWSResponse,
  Accesscontrol_lockdownplan_DeleteLocationLockdownStateWSRequest,
  Accesscontrol_lockdownplan_DeleteLocationLockdownStateWSResponse,
  Accesscontrol_lockdownplan_DeleteLockdownPlanWSRequest,
  Accesscontrol_lockdownplan_DeleteLockdownPlanWSResponse,
  Accesscontrol_lockdownplan_DeleteLockdownRuleForLocationWSRequest,
  Accesscontrol_lockdownplan_DeleteLockdownRuleForLocationWSResponse,
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
  Accesscontrol_lockdownplan_FindLockdownPlansByLocationWSRequest,
  Accesscontrol_lockdownplan_FindLockdownPlansByLocationWSResponse,
  Accesscontrol_lockdownplan_FindLockdownPlansWSRequest,
  Accesscontrol_lockdownplan_FindLockdownPlansWSResponse,
  Accesscontrol_lockdownplan_GetLockdownPlanWSRequest,
  Accesscontrol_lockdownplan_GetLockdownPlanWSResponse,
  Accesscontrol_lockdownplan_GetLockdownRulesForLocationWSRequest,
  Accesscontrol_lockdownplan_GetLockdownRulesForLocationWSResponse,
  Accesscontrol_lockdownplan_GetOrCreateLocationLockdownStateWSRequest,
  Accesscontrol_lockdownplan_GetOrCreateLocationLockdownStateWSResponse,
  Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSRequest,
  Accesscontrol_lockdownplan_UpdateLocationLockdownPlanWSResponse,
  Accesscontrol_qr_GenerateQRAccessCodeWSRequest,
  Accesscontrol_qr_GenerateQRAccessCodeWSResponse,
  Accesscontrol_qr_GetQRAccessCodesWSRequest,
  Accesscontrol_qr_QRAccessCodeType,
  Accesscontrol_qr_GetQRAccessCodesWSResponse,
  Action,
  ActivateLocationLockdownActionRecordType,
  AddOnLicense,
  PerceptionType,
  AddOnLicenseInvoiceType,
  LicenseStateStats,
  DeviceLicenseFamilyStats,
  AddOnLicenseStats,
  rctpRMAType,
  AdvancedRMAType,
  AirQualityIndexPollutantEnum,
  AlertActionStatusEnum,
  AlertActionRecordType,
  AlertMonitoringCatalogItem,
  AlertMonitoringRulesEventTypeEnum,
  AlertMonitoringEventRecordType,
  License,
  AlertMonitoringLicenseType,
  AlertMonitoringPIN,
  AlertMonitoringPinType,
  RuleTriggerTypeEnum,
  AlertMonitoringRuleTriggerType,
  NoonlightPromptTheme,
  AlertMonitoringSubmissionDelayIntervalType,
  ThreatCaseStatus,
  ThreatCaseTimelineEventTypeEnum,
  ThreatCaseTimelineEventType,
  VerificationRecord,
  VerificationHistory,
  AlertMonitoringThreatCaseType,
  Alertmonitoring_AMDeviceHistogramItem,
  Alertmonitoring_AcceptAlertMonitoringTermsOfServiceForLocationRequest,
  Alertmonitoring_AcceptAlertMonitoringTermsOfServiceRequest,
  Alertmonitoring_AcceptAlertMonitoringTermsOfServiceResponse,
  NoonlightPromptSelection,
  Alertmonitoring_AddPromptThreatQualificationsWSRequest,
  Alertmonitoring_AddPromptThreatQualificationsWSResponse,
  Alertmonitoring_AmModifiedBy,
  Alertmonitoring_CancelThreatCaseWSRequest,
  Alertmonitoring_CancelThreatCaseWSResponse,
  Alertmonitoring_CountType,
  Alertmonitoring_CreateCustomPinForNoonlightWSRequest,
  Alertmonitoring_CreateCustomPinForNoonlightWSResponse,
  EmergencyContact,
  EmergencyResponseContactsScheduleType,
  TripwireSettingsType,
  NoonlightScheduleType,
  NoonlightVersionedSettingsType,
  Alertmonitoring_CreateNoonlightSettingsForLocationRequest,
  Alertmonitoring_CreateNoonlightSettingsForLocationResponse,
  Alertmonitoring_CreatePinForNoonlightWSRequest,
  Alertmonitoring_CreatePinForNoonlightWSResponse,
  Alertmonitoring_CumulativeChartData,
  Alertmonitoring_DeleteNoonlightSettingsForLocationRequest,
  Alertmonitoring_DeleteNoonlightSettingsForLocationResponse,
  Alertmonitoring_DeletePinForNoonlightWSRequest,
  Alertmonitoring_DeletePinForNoonlightWSResponse,
  Alertmonitoring_DeletePromptThreatQualificationByTitleWSRequest,
  Alertmonitoring_DeletePromptThreatQualificationByTitleWSResponse,
  Alertmonitoring_DisableLocationRequest,
  Alertmonitoring_DisableLocationResponse,
  Alertmonitoring_DismissThreatCaseWSRequest,
  Alertmonitoring_DismissThreatCaseWSResponse,
  Alertmonitoring_EnableLocationRequest,
  Alertmonitoring_EnableLocationResponse,
  Alertmonitoring_EscalateThreatCaseToAlarmWSRequest,
  Alertmonitoring_EscalateThreatCaseToAlarmWSResponse,
  Alertmonitoring_GenerateMonthlyVerificationsForYearReportForLocationWSRequest,
  Alertmonitoring_GenerateMonthlyVerificationsForYearReportForLocationWSResponse,
  Alertmonitoring_GenerateReportDataForLocationWSRequest,
  DeviceTypeEnum,
  Alertmonitoring_ThreatCaseReportItem,
  Alertmonitoring_GenerateReportDataForLocationWSResponse,
  Alertmonitoring_GetAlertMonitoringTripwireGroupCountWSRequest,
  Alertmonitoring_GetAlertMonitoringTripwireGroupCountWSResponse,
  Alertmonitoring_GetMonitoredDoorSensorsForLocationWSRequest,
  HardwareVariationEnum,
  Door_MinimalDoorStateType,
  Alertmonitoring_GetMonitoredDoorSensorsForLocationWSResponse,
  Alertmonitoring_GetNoonlightSettingsForLocationWSRequest,
  MonitoringEnableStatus,
  Alertmonitoring_NoonlightWSSettings,
  Alertmonitoring_GetNoonlightSettingsForLocationWSResponse,
  Alertmonitoring_GetNoonlightSettingsWSRequest,
  Alertmonitoring_GetNoonlightSettingsWSResponse,
  Alertmonitoring_GetPromptThreatQualificationsWSRequest,
  Alertmonitoring_GetPromptThreatQualificationsWSResponse,
  Alertmonitoring_LocationStatusWSRequest,
  Alertmonitoring_LocationStatusWSResponse,
  Alertmonitoring_OrgStatusWSRequest,
  Alertmonitoring_OrgStatusWSResponse,
  Alertmonitoring_ResetAlertMonitoringTripwireGroupCountWSRequest,
  Alertmonitoring_ResetAlertMonitoringTripwireGroupCountWSResponse,
  Alertmonitoring_UpdateNoonlightSettingsForLocationRequest,
  Alertmonitoring_UpdateNoonlightSettingsForLocationResponse,
  Alertmonitoring_UpdatePromptThreatQualificationWSRequest,
  Alertmonitoring_UpdatePromptThreatQualificationWSResponse,
  Alertmonitoring_pin_BasePinWSResponse,
  Alertmonitoring_pin_BulkPinsWSResponse,
  Alertmonitoring_pin_BulkProvisionPinsWSRequest,
  Alertmonitoring_pin_BulkRotatePinsWSRequest,
  Alertmonitoring_pin_CreatePinWSRequest,
  Alertmonitoring_pin_DeletePinWSRequest,
  Alertmonitoring_pin_FindPinsByLocationAndUserWSRequest,
  PinStatus,
  PinQueryFilter,
  DynamoPageRequest,
  Alertmonitoring_pin_FindPinsByOrgWSRequest,
  Alertmonitoring_pin_FindPinsWSResponse,
  Alertmonitoring_pin_GetAvailableALMPinCodeWSRequest,
  Alertmonitoring_pin_GetAvailableALMPinCodeWSResponse,
  Alertmonitoring_pin_GetPinWSRequest,
  Alertmonitoring_pin_RotatePinWSRequest,
  Alertmonitoring_pin_UpdatePinWSRequest,
  CroppedPermyriadRect,
  AspectRatio,
  DewarpedView,
  AlteredView,
  AmtSettings,
  AperioActivatorStateEvent,
  ComponentBaseEnumType,
  ComponentEnumType,
  AperioDoorExtension,
  ComponentShadowEnumType,
  DtcInfo,
  AperioDoorExtensionShadow,
  AperioDoorExtensionStateEvent,
  AperioDoorHandleStateEvent,
  AperioDoorModeEvent,
  DoorPositionIndicatorEnumType,
  NormalStateEnumType,
  AperioDoorPositionIndicator,
  DoorReaderEnumType,
  AperioDoorReader,
  DoorRelayEnumType,
  AperioDoorRelay,
  RequestToExitEnumType,
  AperioDoorRequestToExit,
  AperioDtcEvent,
  AperioGateway,
  AperioGatewayConnectionStateChangeEvent,
  AperioGatewayShadow,
  AperioGatewayStateEvent,
  AperioKeyCylinderStateEvent,
  AperioTamperStateEvent,
  AperioType,
  ApiClientTypeEnum,
  ApiTokenAuthTypeEnum,
  ApiTokenApplicationType,
  ApiTokenLockdownEventOriginator,
  ApiTokenType,
  AudioExpressionDetectionConfig,
  AudioGatewayStatusEnum,
  AudioLoudActivityEventType,
  AudioParamConfig,
  AudioPlaybackActionRecordType,
  AudioTriggerType,
  AudioScheduledTriggerType,
  AudioPolicyType,
  AudioUploadMetadataType,
  Audiogateway_AudioGatewayOfflineLanStreamingInfo,
  Audiogateway_DeleteAudioGatewayWSRequest,
  Audiogateway_DeleteAudioGatewayWSResponse,
  Audiogateway_GetAudioGatewayConfigWSRequest,
  FrontendEqualizerSettings,
  IAudioUserConfig,
  Audiogateway_GetAudioGatewayConfigWSResponse,
  Audiogateway_GetAudioGatewayOfflineLanStreamingInfoWSRequest,
  Audiogateway_GetAudioGatewayOfflineLanStreamingInfoWSResponse,
  Audiogateway_GetAudioSeekpointsWSRequest,
  SensorValType,
  ToastCheckInfo,
  ToastOrderIdType,
  FootageSeekPointV2Type,
  Audiogateway_GetAudioSeekpointsWSResponse,
  Audiogateway_GetFullAudioGatewayStateWSRequest,
  DeviceStatusEnum,
  DeviceHealthStatusDetailsEnum,
  DeviceFacet,
  FullDeviceStateType,
  Audiogateway_GetFullAudioGatewayStateWSResponse,
  Audiogateway_GetMediaUrisWSRequest,
  Audiogateway_GetMediaUrisWSResponse,
  Audiogateway_GetMinimalAudioGatewayStatesWSRequest,
  MinimalAudioGatewayStateType,
  Audiogateway_GetMinimalAudioGatewayStatesWSResponse,
  Audiogateway_RebootAudioGatewayWSRequest,
  Audiogateway_UpdateAudioGatewayConfigWSRequest,
  Audiogateway_UpdateAudioGatewayConfigWSResponse,
  Audiogateway_UpdateAudioGatewayDetailsWSRequest,
  Audiogateway_UpdateAudioGatewayDetailsWSResponse,
  Audioplayback_CancelLoopingAudioPlaybackWSRequest,
  Audioplayback_CancelLoopingAudioPlaybackWSResponse,
  Audioplayback_DeleteAudioUploadMetadataWSRequest,
  Audioplayback_DeleteAudioUploadMetadataWSResponse,
  Audioplayback_GetAudioUploadMetadataForOrgWSRequest,
  Audioplayback_GetAudioUploadMetadataForOrgWSResponse,
  Audioplayback_PlayAudioUploadWSRequest,
  Audioplayback_PlayAudioUploadWSResponse,
  Audioplayback_UpdateAudioUploadMetadataWSRequest,
  Audioplayback_UpdateAudioUploadMetadataWSResponse,
  Audioplayback_UploadAudioPcmWSResponse,
  Audioplayback_UploadAudioTextWSRequest,
  Audioplayback_UploadAudioTextWSResponse,
  SimpleAuditEventType,
  AuditRuleTriggerType,
  AuthDecisionSourceEnum,
  NotificationFollowUp,
  FollowUpAction,
  FrequencyUnit,
  PromptFrequency,
  AutomatedPrompt,
  AuxiliaryEnumType,
  AuxiliaryInputPhysicalPortEnumType,
  SupervisionModeEnumType,
  PortSupervisionConfigurationType,
  AuxiliaryInputPortType,
  AuxiliaryRelayPhysicalPortEnumType,
  AuxiliaryRelayPortType,
  AvigilonAltaType,
  AwsSettings,
  BackblazeSettings,
  BadgeIntegrationDefaultOptions,
  BadgeIntegrationDoorInfoType,
  BadgeIntegrationRuleTriggerType,
  BadgeIntegrationSettings,
  Badgereader_DeleteBadgeReaderWSRequest,
  Badgereader_DeleteBadgeReaderWSResponse,
  Deviceconfig_settings_ExternalReadableButtonSettings,
  ClimateSettings,
  Deviceconfig_settings_ExternalReadableDeviceSettings,
  BurstyRateLimit,
  Deviceconfig_settings_ExternalReadableDeviceVideoSettings,
  Deviceconfig_settings_ExternalReadableDoorControllerSettings,
  DoorReaderSettings,
  DoorSensorSettings,
  EnvironmentalGatewaySettings,
  TamperSettings,
  ThirdPartyCameraSettings,
  VideoDoorbellSettings,
  Deviceconfig_userconfig_ExternalReadableFacetedUserConfig,
  Badgereader_GetBadgeReaderConfigWSResponse,
  Badgereader_GetBadgeReaderFullStateWSResponse,
  MinimalDeviceStateType,
  Badgereader_GetBadgeReaderMinimalStateListWSResponse,
  Badgereader_RebootBadgeReaderWSRequest,
  ButtonSettingsSelectiveUpdate,
  ClimateSettingsSelectiveUpdate,
  Deviceconfig_settings_ExternalDeviceSettingsSelectiveUpdate,
  DeviceVideoSettingsSelectiveUpdate,
  Deviceconfig_settings_ExternalDoorControllerSettingsSelectiveUpdate,
  DoorReaderSettingsSelectiveUpdate,
  DoorSensorSettingsSelectiveUpdate,
  EnvironmentalGatewaySettingsSelectiveUpdate,
  TamperSettingsSelectiveUpdate,
  VideoDoorbellSettingsSelectiveUpdate,
  Deviceconfig_userconfig_ExternalUpdateableFacetedUserConfig,
  Badgereader_UpdateBadgeReaderConfigWSRequest,
  Badgereader_UpdateBadgeReaderDetailsWSRequest,
  BaseApiResponse,
  BaseCatalogItem,
  ClaimKeyReturnEvent,
  BaseClaimKey,
  OsdpPhysicalPortEnumType,
  OsdpReaderPortType,
  RhombusOsdpDoorReaderType,
  OsdpDoorReaderType,
  WiegandOutputPhysicalPortEnumType,
  WiegandOutputPortType,
  WiegandDataPhysicalPortEnumType,
  WiegandDataPortType,
  WiegandInputPhysicalPortEnumType,
  WiegandInputPortType,
  WiegandDoorReaderType,
  DoorPositionIndicatorPhysicalPortEnumType,
  DoorPositionIndicatorPortType,
  IntegratedDoorPositionIndicatorType,
  RequestToExitPhysicalPortEnumType,
  RequestToExitPortType,
  IntegratedRequestToExitType,
  DoorRelayPhysicalPortEnumType,
  DoorRelayPortType,
  IntegratedDoorRelayType,
  IntegratedGenericRelayType,
  IntegratedGenericInputType,
  ButtonEnumType,
  ButtonModeEnum,
  ButtonPhysicalPortEnumType,
  ButtonPortType,
  IntegratedGenericButtonType,
  BaseComponentType,
  BaseLicenseType,
  PolicyEventFaceType,
  PolicyEventVehicleType,
  CheckCondition,
  PolicyAlertV2Type,
  BasePolicyAlertType,
  SimpleDeviceActivityEventType,
  DeviceActivityRuleTriggerType,
  SimpleDiagnosticEventType,
  DiagnosticRuleTriggerType,
  ScheduledRuleTriggerType,
  VisionLLMRuleTriggerType,
  RecurringTimeUnit,
  RecurringRuleTriggerType,
  LocationLockdownActivatedRuleTriggerType,
  LocationLockdownDeactivatedRuleTriggerType,
  CustomLLMEventRuleTriggerType,
  ButtonIntegrationRuleTriggerType,
  BaseRuleTriggerType,
  BaseSavedScheduleType,
  BatchRegistrationTokenUsageResult,
  BinaryAggregationValue,
  Ble_BleDeviceMap,
  Ble_BleRegisteredDeviceWSType,
  Ble_BleUnregisteredHardwareWSType,
  Ble_GetBaseStationsWSRequest,
  Ble_GetBaseStationsWSResponse,
  Ble_GetSecureSecretForRegisteredWSResponse,
  Ble_GetSecureSecretForUnregisteredWSResponse,
  Ble_GetSensorHardwareFirmwareUpdateDetailsRequest,
  Ble_GetSensorHardwareFirmwareUpdateDetailsResponse,
  Ble_RegisterSensorWSRequest,
  Ble_RegisterSensorWSResponse,
  Ble_UnregisterSensorWSRequest,
  Ble_UnregisterSensorWSResponse,
  BoardPhysicalPortConfigType,
  ContentDisposition,
  MediaType,
  MessageBodyWorkers,
  Providers,
  BoundingBoxType,
  BoxSettings,
  BrivoSettings,
  BrivoType,
  ButterflyMXSettings,
  ButterflyMXType,
  DoorType,
  ButterflymxBuilding,
  ButterflymxPanelInfoType,
  ButtonPressEnum,
  SupervisionStateEnumType,
  ButtonEventType,
  Button_ButtonHealthDetailsEnum,
  Button_ButtonHealthEnum,
  Button_ExternalButtonRuleType,
  Button_CreateRuleForButtonWSRequest,
  Button_CreateRuleForButtonWSResponse,
  Button_DeleteRuleForButtonWSRequest,
  Button_DeleteRuleForButtonWSResponse,
  Button_GetButtonPressEventsForSensorWSRequest,
  Button_GetButtonPressEventsForSensorWSResponse,
  Button_GetButtonRulesForOrgWSRequest,
  Button_GetButtonRulesForOrgWSResponse,
  Button_GetMinimalButtonStatesWSRequest,
  Button_MinimalButtonStateType,
  Button_GetMinimalButtonStatesWSResponse,
  Button_GetRulesForButtonWSRequest,
  Button_GetRulesForButtonWSResponse,
  Deviceconfig_userconfig_IExternalUpdateableButtonUserConfig,
  Button_UpdateButtonConfigWSRequest,
  Button_UpdateButtonDetailsWSRequest,
  Buyer,
  COSensorType,
  CameraAiDewarpConfigType,
  RegionCoordinateType,
  RegionPolygonType,
  ScheduledAction,
  CameraConfiguration,
  CameraCrossCountingSettingsType,
  CameraHumanLoiteringSettingsType,
  CameraMeteringConfigType,
  PermyriadRect,
  CameraMotorConfigType,
  CameraPTZConfigType,
  CameraTriggerType,
  CameraScheduledTriggerType,
  CameraPolicyV2Type,
  CameraType,
  CameraVisualTamperConfigType,
  Camera_CameraBackwardsCompatUpdateType,
  Camera_CameraCurrentStateType,
  Camera_CameraExternalFacetedType,
  Camera_CameraExternalType,
  Camera_CameraOfflineLanStreamingInfo,
  CustomFootageSeekPointType,
  Camera_CreateCustomFootageSeekpointsWSRequest,
  FootageBoundingBoxType,
  Camera_CreateFootageBoundingBoxesWSRequest,
  Camera_CreateFootageBoundingBoxesWSResponse,
  Camera_CreateFootageSeekpointsWSResponse,
  StreamTypeEnum,
  Camera_CreateSharedLiveVideoStreamWSRequest,
  Camera_CreateSharedLiveVideoStreamWSResponse,
  Camera_CreateSharedVideoWallWSRequest,
  Camera_CreateSharedVideoWallWSResponse,
  VideoWallType,
  Camera_CreateVideoWallWSRequest,
  Camera_CreateVideoWallWSResponse,
  Camera_DeleteCameraWSRequest,
  Camera_DeleteCameraWSResponse,
  Camera_DeleteCustomFootageSeekpointsWSRequest,
  Camera_DeleteCustomFootageSeekpointsWSResponse,
  Camera_DeleteCustomFootageSeekpointsWSResponse_SeekPointDeleteResponse,
  Camera_DeleteSharedLiveVideoStreamWSRequest,
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
  Camera_SharedVideoWallWS,
  Camera_FindSharedVideoWallsWSResponse,
  Camera_FootageBoundingBoxSummaryType,
  Camera_FootageSeekPointSummaryType,
  Camera_GenerateBatchRegistrationInfoRequest,
  Camera_GenerateBatchRegistrationInfoResponse,
  Camera_GenerateWifiChangeAuthorizationTokenWSRequest,
  Camera_GenerateWifiChangeAuthorizationTokenWSResponse,
  Camera_GetBatchRegistrationTokenUsageRequest,
  Camera_GetBatchRegistrationTokenUsageResponse,
  Camera_GetCameraAIThresholdsWSRequest,
  Camera_GetCameraAIThresholdsWSResponse,
  Camera_GetCameraDetailsWSRequest,
  Camera_GetCameraDetailsWSResponse,
  Camera_GetCloudArchivedMediaInfoWSRequest,
  Camera_GetCloudArchivedMediaInfoWSResponse,
  Camera_GetCloudArchivingConfigWSRequest,
  DeviceTargetScope,
  CloudArchivingStrategy,
  ScopedCloudArchivingConfig,
  Camera_GetCloudArchivingConfigWSResponse,
  Camera_GetConfigWSRequest,
  FisheyeDisplayMode,
  RegionConfigType,
  RegionOfInterest,
  RegionOfInterestGroup,
  Deviceconfig_settings_ExternalVideoResolution,
  Deviceconfig_userconfig_IExternalReadableAudioVideoUserConfig,
  Camera_GetConfigWSResponse,
  Camera_GetCurrentStateWSRequest,
  Camera_GetCurrentStateWSResponse,
  Camera_GetCustomFootageSeekpointsV2WSRequest,
  SeekpointType,
  SeekpointIndexType,
  Camera_GetCustomFootageSeekpointsV2WSResponse,
  Camera_GetFacetedCameraDetailsWSResponse,
  Camera_GetFootageBoundingBoxesForMultipleWSRequest,
  Camera_GetFootageBoundingBoxesForMultipleWSResponse,
  Camera_GetFootageBoundingBoxesWSRequest,
  Camera_GetFootageBoundingBoxesWSResponse,
  Camera_GetFootageSeekpointsForMultipleWSRequest,
  Camera_GetFootageSeekpointsForMultipleWSResponse,
  Camera_GetFootageSeekpointsV2WSRequest,
  Camera_GetFootageSeekpointsV2WSResponse,
  Camera_GetFootageSeekpointsWSRequest,
  FootageSeekPointType,
  Camera_GetFootageSeekpointsWSResponse,
  Camera_GetFullCameraStateWSRequest,
  Camera_GetFullCameraStateWSResponse,
  Camera_GetLineCrossingEnabledCamerasForLocationWSRequest,
  Camera_GetLineCrossingEnabledCamerasForLocationWSResponse,
  Camera_GetMediaUrisWSRequest,
  Camera_GetMediaUrisWSResponse,
  Camera_GetMinimalCameraLocationMapWSRequest,
  Camera_GetMinimalCameraLocationMapWSResponse,
  Camera_GetMinimalCameraLocationMapWSResponse_CameraLocationInfo,
  Camera_GetMinimalCameraStateListWSRequest,
  Camera_GetMinimalCameraStateListWSResponse,
  Camera_GetMinimalListWSRequest,
  Camera_MinimalCameraType,
  Camera_GetMinimalListWSResponse,
  Camera_GetOccupancyEnabledCamerasWSRequest,
  Camera_GetOfflineLanStreamingInfoWSRequest,
  Camera_GetOfflineLanStreamingInfoWSResponse,
  Camera_GetPresenceWindowsWSRequest,
  Camera_GetPresenceWindowsWSResponse,
  Camera_SharedCameraCurrentStateType,
  Camera_GetSharedCameraCurrentStateWSResponse,
  Camera_GetStorageRecoveryFileWSRequest,
  Camera_GetStorageRecoveryFileWSResponse,
  Camera_GetUptimeWindowsWSRequest,
  TimeWindowSeconds,
  Camera_GetUptimeWindowsWSResponse,
  Camera_GetVideoWallsWSRequest,
  Camera_VideoWallSummaryType,
  Camera_GetVideoWallsWSResponse,
  Camera_RebootCameraWSRequest,
  Camera_RebootCameraWSResponse,
  Camera_RevertCameraToDefaultsWSRequest,
  Camera_RevertCameraToDefaultsWSResponse,
  Camera_UpdateCameraAIThresholdsWSRequest,
  Camera_UpdateCameraAIThresholdsWSResponse,
  Camera_UpdateCameraFirmwareWSRequest,
  Camera_UpdateCameraFirmwareWSResponse,
  Camera_UpdateCameraHumanLoiteringConfigWSRequest,
  Camera_UpdateCameraHumanLoiteringWSResponse,
  Camera_UpdateCameraLineCrossingThresholdsWSRequest_Coordinate,
  Camera_UpdateCameraLineCrossingThresholdsWSRequest,
  Camera_UpdateCameraLineCrossingThresholdsWSResponse,
  Camera_UpdateCameraV2WSRequest,
  Camera_UpdateCameraV2WSResponse,
  Camera_UpdateCameraWSRequest,
  Camera_UpdateCameraWSResponse,
  Camera_UpdateCamerasBulkV2WSRequest,
  Deviceconfig_userconfig_IExternalUpdateableAudioVideoUserConfig,
  Camera_UpdateConfigWSRequest,
  Camera_UpdateVideoWallWSRequest,
  Camera_UpdateVideoWallWSResponse,
  Camera_UpdateWifiWSRequest,
  Camera_UpdateWifiWSResponse,
  CancelLoopingAudioPlaybackActionRecordType,
  EarlyExpireModeEnum,
  DoorStateOverride,
  CancelledDoorStateOverride,
  ChangeType,
  ChatVisibility,
  ChatPrivacy,
  ResponseType,
  ChatQueryFilter,
  QueryStatus,
  QueryTimelineEvent,
  QueryTool,
  ChatRecord,
  ChatbotConfig,
  Chatbot_BaseAutomatedPromptWSResponse,
  Chatbot_BaseChatWSResponse,
  Chatbot_BaseChatbotConfigWSResponse,
  Chatbot_CreateAutomatedPromptWSRequest,
  Chatbot_CreateChatbotConfigWSRequest,
  Chatbot_DeleteAutomatedPromptWSRequest,
  Chatbot_DeleteChatRecordWSRequest,
  Chatbot_DeleteChatbotConfigWSRequest,
  Chatbot_DeleteChatbotConversationWSRequest,
  Chatbot_GetAutomatedPromptChatHistoryWSRequest,
  Chatbot_GetAutomatedPromptWSRequest,
  Chatbot_GetAutomatedPromptsForOrgWSResponse,
  Chatbot_GetChatHistoryByContextIdWSRequest,
  Chatbot_GetChatHistoryWSRequest,
  Chatbot_GetChatHistoryWSResponse,
  Chatbot_GetChatRecordWSRequest,
  Chatbot_GetChatbotConfigWSRequest,
  Chatbot_GetChatbotConversationsWSRequest,
  ContextRecord,
  Chatbot_GetChatbotConversationsWSResponse,
  Chatbot_GetSharedChatRecordsWSRequest,
  Chatbot_GetSharedChatRecordsWSResponse,
  Chatbot_SubmitChatWSRequest,
  Chatbot_SubmitChatWSResponse,
  Chatbot_SubmitTestPromptWSRequest,
  Chatbot_SubmitTestPromptWSResponse,
  Chatbot_UpdateAutomatedPromptWSRequest,
  Chatbot_UpdateChatRecordWSRequest,
  Chatbot_UpdateChatbotConfigWSRequest,
  ContextRecordSelectiveUpdate,
  Chatbot_UpdateChatbotConversationWSRequest,
  Chatbot_UpdateChatbotConversationsWSResponse,
  Chatbot_VerifyJobScheduledWSRequest,
  Chatbot_VerifyJobScheduledWSResponse,
  ClaimKeyEntry,
  ClaimKey,
  ClaimKeySearchFilter,
  Client,
  ClimateActivityEventType,
  HeatIndexRangeWarningEnum,
  ClimateEventType,
  ClimateTriggerType,
  ClimateScheduledTriggerType,
  ClimatePolicyType,
  Climate_DeleteEnvironmentalGatewayWSRequest,
  Climate_DeleteEnvironmentalGatewayWSResponse,
  Climate_GetClimateEventsForSensorWSRequest,
  Climate_GetClimateEventsForSensorWSResponse,
  Climate_GetClimateSensorConfigWSRequest,
  IClimateUserConfig,
  Climate_GetClimateSensorConfigWSResponse,
  Climate_GetEnvironmentalGatewayShadowsWSRequest,
  Co2SensorType,
  DeviceOrientationEnum,
  E50DerivedValuesType,
  FormaSensorType,
  LeakProbeType,
  PmSensorType,
  PressureSensorType,
  TempProbeType,
  EnvironmentalGatewayShadowType,
  Climate_GetEnvironmentalGatewayShadowsWSResponse,
  Climate_GetEventsForEnvironmentalGatewayWSRequest,
  ClipSeekPointType,
  ClipSeekPointV2Type,
  ClipBoundingBoxType,
  ClipMetaDataType,
  E50ClimateEventType,
  Climate_GetEventsForEnvironmentalGatewayWSResponse,
  Climate_GetMinimalClimateStatesWSRequest,
  Climate_MinimalClimateStateType,
  Climate_GetMinimalClimateStatesWSResponse,
  Climate_GetMinimalEnvironmentalGatewayStatesWSRequest,
  Climate_MinimalEnvironmentalGatewayStateType,
  Climate_GetMinimalEnvironmentalGatewayStatesWSResponse,
  Climate_RebootEnvironmentalGatewayWSRequest,
  Climate_UpdateClimateSensorDetailsWSRequest,
  Climate_UpdateClimateSensorDetailsWSResponse,
  Climate_UpdateEnvironmentalGatewayDetailsWSRequest,
  Climate_UpdateEnvironmentalGatewayDetailsWSResponse,
  ClipVisibility,
  ClipAccessSettings,
  SharedClipV2Type,
  ClipGroupType,
  SharedClipWithDetailsType,
  ClipGroupWithDetailsType,
  Common_devices_CalibrateFloorplanProjectionWSRequest,
  Common_devices_CalibrateFloorplanProjectionWSResponse,
  Common_devices_GetBoundingBoxesWSRequest,
  Common_devices_GetBoundingBoxesWSResponse,
  Common_devices_GetCameraOrDoorbellCameraSeekpointsWSRequest,
  Common_devices_GetFullDeviceStateWSRequest,
  Common_devices_GetMediaUrisWSRequest,
  Common_devices_GetMinimalDeviceStateListWSRequest,
  Common_devices_GetPresenceWindowsWSRequest,
  Common_devices_GetPresenceWindowsWSResponse,
  Common_devices_GetSeekpointsWSRequest,
  Common_devices_GetSeekpointsWSResponse,
  Common_devices_GetUptimeWindowsWSRequest,
  Common_devices_GetUptimeWindowsWSResponse,
  Common_devices_RebootDeviceWSResponse,
  Common_devices_UpdateConfigWSResponse,
  Common_devices_UpdateDeviceDetailsWSResponse,
  Common_devices_rawstream_CreateRawHttpStreamWSRequest,
  Common_devices_rawstream_CreateRawHttpStreamWSResponse,
  Common_devices_rawstream_DeleteRawHttpStreamWSRequest,
  Common_devices_rawstream_DeleteRawHttpStreamWSResponse,
  Common_devices_rawstream_FindAllRawHttpStreamsWSRequest,
  Common_devices_rawstream_LanSpecificRawStreamType,
  Common_devices_rawstream_FindAllRawHttpStreamsWSResponse,
  Common_devices_rawstream_GetRawHttpStreamsWSRequest,
  Common_devices_rawstream_GetRawHttpStreamsWSResponse,
  DoorbellEventType,
  DoorReaderStateEnumType,
  DoorReaderStateChangeReasonEnumType,
  DoorReaderStateChangeEventType,
  DoorRelayStateEnumType,
  DoorRelayStateChangeEventType,
  DoorPositionIndicatorStateEnumType,
  DoorPositionIndicatorStateChangeEventType,
  RequestToExitStateEnumType,
  RequestToExitStateChangeEventType,
  CredentialSourceEnumType,
  CredentialEntryBleWave,
  CredentialEntry,
  CredentialReceivedEventType,
  GenericInputStateEnumType,
  GenericInputStateChangeEventType,
  GenericRelayStateChangeEventType,
  DoorLocationLockdownStateEventType,
  PanicButtonEventType,
  WaveToUnlockIntentExpiredEvent,
  DoorStateChangeEvent,
  DoorAuthFirstInStateEvent,
  DoorScheduleFirstInStateEvent,
  ComponentEventType,
  ComponentSeekPointType,
  DoorReaderShadowType,
  DoorRelayShadowType,
  DoorPositionIndicatorShadowType,
  RequestToExitShadowType,
  GenericInputShadowType,
  GenericRelayShadowType,
  GenericButtonStateEnumType,
  GenericButtonShadowType,
  ComponentShadowType,
  Component_AddAccessControlledDoorLabelWSRequest,
  Component_AddAccessControlledDoorLabelWSResponse,
  Component_AggregatedCredentialReceivedEventInfo,
  Component_ApplyAccessControlledDoorStateOverrideWSRequest,
  Component_ApplyAccessControlledDoorStateOverrideWSResponse,
  Component_CancelAccessControlledDoorStateOverrideWSRequest,
  Component_CancelAccessControlledDoorStateOverrideWSResponse,
  Component_CreateAccessControlledDoorSeekpointsWSRequest,
  Component_CreateAccessControlledDoorSeekpointsWSResponse,
  Component_CreateAccessControlledDoorWSRequest,
  Component_CreateAccessControlledDoorWSResponse,
  Component_CreateAperioDoorInfo,
  Component_CreateAperioDoorsWSRequest,
  Component_CreateAperioDoorsWSResponse,
  Component_CreateAperioGatewayWSRequest,
  Component_CreateAperioGatewayWSResponse,
  Component_CreateIntegratedDoorPositionIndicatorWSRequest,
  Component_CreateIntegratedDoorPositionIndicatorWSResponse,
  Component_CreateIntegratedDoorRelayWSRequest,
  Component_CreateIntegratedDoorRelayWSResponse,
  Component_CreateIntegratedGenericButtonWSRequest,
  Component_CreateIntegratedGenericButtonWSResponse,
  Component_CreateIntegratedGenericInputWSRequest,
  Component_CreateIntegratedGenericInputWSResponse,
  Component_CreateIntegratedGenericRelayWSRequest,
  Component_CreateIntegratedGenericRelayWSResponse,
  Component_CreateIntegratedRequestToExitWSRequest,
  Component_CreateIntegratedRequestToExitWSResponse,
  Component_CreateOsdpReaderWSRequest,
  Component_CreateOsdpReaderWSResponse,
  Component_CreateRhombusOsdpReaderWSRequest,
  Component_CreateRhombusOsdpReaderWSResponse,
  Component_CreateWiegandReaderWSRequest,
  Component_CreateWiegandReaderWSResponse,
  Component_DeleteAccessControlledDoorWSRequest,
  Component_DeleteAccessControlledDoorWSResponse,
  Component_DeleteComponentWSRequest,
  Component_DeleteComponentWSResponse,
  Component_DeleteComponentsByOwnerDeviceWSRequest,
  Component_DeleteComponentsByOwnerDeviceWSResponse,
  Component_FindAccessControlledDoorShadowsByLocationWSRequest,
  Component_FindAccessControlledDoorShadowsByLocationWSResponse,
  Component_FindAccessControlledDoorShadowsWSRequest,
  Component_FindAccessControlledDoorShadowsWSResponse,
  Component_FindAccessControlledDoorsByLocationWSRequest,
  Component_FindAccessControlledDoorsByLocationWSResponse,
  Component_FindAccessControlledDoorsByOwnerDeviceWSRequest,
  Component_FindAccessControlledDoorsByOwnerDeviceWSResponse,
  Component_FindAccessControlledDoorsWSRequest,
  Component_FindAccessControlledDoorsWSResponse,
  Component_FindAllComponentShadowsWSRequest,
  Component_FindAllComponentShadowsWSResponse,
  Component_FindComponentEventsByAccessControlledDoorWSRequest,
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
  Component_FindComponentEventsForOrgDashboardWSRequest,
  Component_FindComponentEventsForOrgDashboardWSResponse,
  Component_FindComponentEventsForVideoIntercomWSRequest,
  Component_FindComponentEventsForVideoIntercomWSResponse,
  Component_FindComponentSeekPointsByAccessControlledDoorWSRequest,
  Component_FindComponentSeekPointsByAccessControlledDoorWSResponse,
  Component_FindComponentSeekPointsByAccessControlledDoorsWSRequest,
  Component_FindComponentSeekPointsByAccessControlledDoorsWSResponse,
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
  Component_FindComponentsByOwnerDeviceWSResponse,
  Component_FindDistinctOriginatorCredentialReceivedEventsByAccessControlledDoorWSRequest,
  Component_FindDistinctOriginatorCredentialReceivedEventsByAccessControlledDoorWSResponse,
  Component_FindDistinctOriginatorCredentialReceivedEventsByLocationWSRequest,
  Component_FindDistinctOriginatorCredentialReceivedEventsByLocationWSResponse,
  Component_FindMinimalStateAccessControlledDoorsByLocationWSRequest,
  Component_MinimalStateAccessControlledDoor,
  Component_FindMinimalStateAccessControlledDoorsByLocationWSResponse,
  Component_FindMinimalStateAccessControlledDoorsWSRequest,
  Component_FindMinimalStateAccessControlledDoorsWSResponse,
  Component_GetAccessControlledDoorLabelsForOrgWSRequest,
  Component_GetAccessControlledDoorLabelsForOrgWSResponse,
  Component_GetCurrentExpectedAccessControlledDoorStateWSRequest,
  Schedule_AccessControlledDoorStateSourceEnum,
  Schedule_AccessControlledDoorNextNearestSchedule,
  Component_GetCurrentExpectedAccessControlledDoorStateWSResponse,
  Component_GetFullAccessControlledDoorShadowWSRequest,
  Component_GetFullAccessControlledDoorShadowWSResponse,
  Component_GetOrCreateDevicePhysicalPortConfigWSRequest,
  InvalidPhysicalPortReasonEnumType,
  InvalidPhysicalPortConfigType,
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
  Component_UpdateIntegratedGenericRelaySteadyStateWSRequest,
  Component_UpdateIntegratedGenericRelaySteadyStateWSResponse,
  Component_UpdateIntegratedGenericRelayTransientStateWSRequest,
  Component_UpdateIntegratedGenericRelayTransientStateWSResponse,
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
  Consignee,
  CountingActivityEventType,
  CrossingCountsType,
  CustomerShipmentType,
  Customer_AcceptUsagePolicyRequest,
  Customer_AcceptUsagePolicyResponse,
  Customer_DeleteNotificationSnoozeSettingWSRequest,
  Customer_DeleteNotificationSnoozeSettingWSResponse,
  Customer_GetCurrentPartnerUserWSRequest,
  NotificationIntervalV2Type,
  PartnerNotificationSettingsType,
  MinuteOfDayIntervalType,
  NotificationEnumType,
  PartnerNotificationClientSectionRow,
  PartnerNotificationClientSection,
  PartnerNotificationSettingsV2,
  WrappedRhombusOrgUserType,
  Customer_GetCurrentPartnerUserWSResponse,
  Customer_GetCurrentRhombusKeyUserWSRequest,
  User_RhombusKeyOrgDetailsType,
  RhombusKeyAppPreferencesType,
  StaticEpochSecondsProvisioner,
  EpochSecondsProvisioner,
  RhombusSecureMobileCredentialProvisioningRulesType,
  RhombusKeyAppSettingsType,
  RhombusKeyAppConfigType,
  Customer_GetCurrentRhombusKeyUserWSResponse,
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
  Customer_GetCurrentUserWSRequest,
  DashboardCustomizations,
  UserCustomizationsType,
  UserNotificationSettingsV3Type,
  NotificationTimeFrameRow,
  NotificationTimeFrame,
  UserNotificationSettingsV4Type,
  Customer_GetCurrentUserWSResponse,
  DashboardStatus,
  Customer_GetDashboardStatusWSResponse,
  Customer_GetDashboardstatusWSRequest,
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
  DeleteSharedLiveVideoStreamForDeviceResponse,
  EventListenerType,
  Developer_CreateEventListenerWSRequest,
  Developer_CreateEventListenerWSResponse,
  Developer_DeleteEventListenerWSRequest,
  Developer_DeleteEventListenerWSResponse,
  Developer_GetAllEventListenersWSRequest,
  Developer_GetAllEventListenersWSResponse,
  Developer_GetEventListenersForDeviceWSRequest,
  Developer_GetEventListenersForDeviceWSResponse,
  DeviceAssignableLicenseGroupStats,
  DeviceCatalogItem,
  DeviceEventRecordType,
  DeviceFeatureEnum,
  DeviceIntegrationSettings,
  DeviceIntegrationType,
  LicenseFeature,
  DeviceLicenseType,
  DeviceSchedule,
  DeviceTypeV2,
  Deviceconfig_GetConfigWSRequest,
  Deviceconfig_GetFacetedUserConfigWSResponse,
  Deviceconfig_UpdateFacetedUserConfigWSRequest,
  Deviceconfig_settings_ExternalAudioSettingsSelectiveUpdate,
  Deviceconfig_settings_ExternalReadableAudioSettings,
  Deviceconfig_settings_ExternalReadableVideoSettings,
  Deviceconfig_settings_ExternalVideoSettingsSelectiveUpdate,
  Deviceconfig_settings_IntRange,
  Deviceconfig_settings_VideoConfigurationDefault,
  Deviceconfig_settings_VideoConfigurationOption,
  Deviceconfig_userconfig_IExternalReadableDoorControllerUserConfig,
  Deviceconfig_userconfig_IExternalUpdateableDoorControllerUserConfig,
  DiagnosticEventType,
  DiceSettings,
  DiceType,
  RtspEndpointSource,
  RtspEndpoint,
  DiscoveredThirdPartyCameraType,
  DoorAjarActivityEventType,
  DoorEventType,
  DoorLockdownStateEventReference,
  DoorScheduledTriggerType,
  DoorPolicyType,
  Door_GetDoorEventsForSensorWSRequest,
  Door_GetDoorEventsForSensorWSResponse,
  Door_GetMinimalDoorStatesWSRequest,
  Door_GetMinimalDoorStatesWSResponse,
  Door_UpdateDoorSensorDetailsWSRequest,
  Door_UpdateDoorSensorDetailsWSResponse,
  Doorbellcamera_ExternalDoorbellCameraComponentRuleType,
  Doorbellcamera_CreateRuleForDoorbellCameraWSRequest,
  Doorbellcamera_CreateRuleForDoorbellCameraWSResponse,
  Doorbellcamera_CreateSharedLiveVideoStreamWSRequest,
  Doorbellcamera_CreateSharedLiveVideoStreamWSResponse,
  Doorbellcamera_DeleteDoorbellCameraWSRequest,
  Doorbellcamera_DeleteDoorbellCameraWSResponse,
  Doorbellcamera_DeleteRuleForDoorbellCameraWSRequest,
  Doorbellcamera_DeleteRuleForDoorbellCameraWSResponse,
  Doorbellcamera_DoorbellCameraOfflineLanStreamingInfo,
  Doorbellcamera_FindComponentEventsForDoorbellCameraWSRequest,
  Doorbellcamera_FindComponentEventsForDoorbellCameraWSResponse,
  Doorbellcamera_FindComponentSeekPointsForDoorbellCameraWSRequest,
  Doorbellcamera_FindComponentSeekPointsForDoorbellCameraWSResponse,
  Doorbellcamera_FindSharedLiveVideoStreamsForWSRequest,
  Doorbellcamera_FindSharedLiveVideoStreamsWSResponse,
  Doorbellcamera_GetDoorbellCameraConfigWSResponse,
  Doorbellcamera_GetDoorbellCameraFullStateWSResponse,
  Doorbellcamera_GetDoorbellCameraMediaUrisWSResponse,
  MinimalObservableDeviceStateType,
  Doorbellcamera_GetDoorbellCameraMinimalStateListWSResponse,
  Doorbellcamera_GetDoorbellCameraOfflineLanStreamingInfoWSRequest,
  Doorbellcamera_GetDoorbellCameraOfflineLanStreamingInfoWSResponse,
  Doorbellcamera_GetDoorbellCameraRulesForOrgWSRequest,
  Doorbellcamera_GetDoorbellCameraRulesForOrgWSResponse,
  Doorbellcamera_GetRulesForDoorbellCameraWSRequest,
  Doorbellcamera_GetRulesForDoorbellCameraWSResponse,
  Doorbellcamera_RebootDoorbellCameraWSRequest,
  Doorbellcamera_UpdateDoorbellCameraConfigWSRequest,
  Doorbellcamera_UpdateDoorbellCameraDetailsWSRequest,
  RuleTriggerConjunctionEnum,
  RuleTypeEnum,
  RuleType,
  Doorcontroller_CreateDoorControllerRuleWSRequest,
  Doorcontroller_CreateDoorControllerRuleWSResponse,
  Doorcontroller_DeleteDoorControllerRuleWSRequest,
  Doorcontroller_DeleteDoorControllerRuleWSResponse,
  Doorcontroller_DeleteDoorControllerWSRequest,
  Doorcontroller_DeleteDoorControllerWSResponse,
  Doorcontroller_DoorControllerDiscoveredAperioDoor,
  Doorcontroller_DoorControllerDiscoveredAperioGateway,
  Doorcontroller_DoorControllerDiscoveredReaderTypeEnum,
  Doorcontroller_DoorControllerDiscoveredRhombusReaderType,
  Doorcontroller_DoorControllerDiscoveredThirdPartyReaderType,
  Doorcontroller_DoorControllerDiscoveredReaderType,
  Doorcontroller_DoorControllerStateType,
  Doorcontroller_GetDoorControllerConfigWSResponse,
  Doorcontroller_GetDoorControllerRuleWSRequest,
  Doorcontroller_GetDoorControllerRuleWSResponse,
  Doorcontroller_GetDoorControllerRulesWSRequest,
  Doorcontroller_GetDoorControllerRulesWSResponse,
  Doorcontroller_GetDoorControllerStateListWSRequest,
  Doorcontroller_GetDoorControllerStateListWSResponse,
  Doorcontroller_RegisterDiscoveredRhombusReaderWSRequest,
  Doorcontroller_RegisterDiscoveredRhombusReaderWSResponse,
  Doorcontroller_UpdateDoorControllerConfigWSRequest,
  Doorcontroller_UpdateDoorControllerDetailsWSRequest,
  Doorcontroller_UpdateDoorControllerDetailsWSResponse,
  Doorcontroller_UpdateDoorControllerRuleWSRequest,
  Doorcontroller_UpdateDoorControllerRuleWSResponse,
  DropboxSettingsV2,
  EmailSettings,
  EmbeddingEncodingType,
  Embedding,
  EmergencyResponseContactsIntervalType,
  Entity,
  EntityTag,
  EnvoyCustomField,
  EnvoyDeliveryInfo,
  EnvoyPersonInfo,
  EnvoyDelivery,
  EnvoyExpectedGuest,
  EnvoyGuest,
  EnvoyInvite,
  EnvoyLocation,
  EnvoyLocationInfoType,
  EnvoySettings,
  EnvoyType,
  EnvoyUserSettings,
  Ethernettester_GetEthernetTesterConfigWSRequest,
  Ethernettester_GetEthernetTesterConfigWSResponse,
  EventCount,
  Event_RuuidWrapper,
  Event_CreateSharedClipGroupWSRequest,
  Event_CreateSharedClipGroupWSResponse,
  Event_DeleteAlertMonitoringThreatCaseByStatusWSRequest,
  Event_DeleteAlertMonitoringThreatCaseByStatusWSResponse,
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
  Event_FrontendCell,
  Event_GetAlertMonitoringThreatCaseWSRequest,
  Event_GetAlertMonitoringThreatCaseWSResponse,
  Event_GetAlertMonitoringThreatCasesWSRequest,
  Event_GetAlertMonitoringThreatCasesWSResponse,
  Event_GetClipWithProgressWSRequest,
  Resolution,
  Event_SavedClipWithProgressType,
  Event_GetClipWithProgressWSResponse,
  Event_GetClipsWithProgressWSRequest,
  Event_GetClipsWithProgressWSResponse,
  Event_GetExpiringPolicyAlertsWSRequest,
  Event_GetExpiringPolicyAlertsWSResponse,
  Event_GetMotionGridCountsWSResponse,
  Event_GetMotionGridWSRequest,
  Event_GetMotionGridWSResponse,
  Event_GetPolicyAlertCountWSRequest,
  Event_GetPolicyAlertCountWSResponse,
  Event_GetPolicyAlertDetailsWSRequest,
  PolicyAlertWithDetailsType,
  Event_GetPolicyAlertDetailsWSResponse,
  Event_GetPolicyAlertGroupsForDeviceWSRequest,
  Event_PolicyAlertGroupV2,
  Event_GetPolicyAlertGroupsForDeviceWSResponse,
  Event_GetPolicyAlertGroupsForLocationWSRequest,
  Event_GetPolicyAlertGroupsForLocationWSResponse,
  Event_GetPolicyAlertGroupsV2WSRequest,
  Event_GetPolicyAlertGroupsV2WSResponse,
  Event_GetPolicyAlertV2WSRequest,
  Event_GetPolicyAlertV2WSResponse,
  Event_GetPolicyAlertWSRequest,
  Event_GetPolicyAlertWSResponse,
  Event_GetPolicyAlertsV2WSRequest,
  Event_GetPolicyAlertsV2WSResponse,
  Event_GetPolicyAlertsWSRequest,
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
  Event_GetSavedClipsWSRequest,
  Event_GetSavedClipsWSResponse,
  Event_GetSharedClipGroupDetailsWSRequest,
  SharedClipGroupWithDetailsType,
  Event_GetSharedClipGroupDetailsWSResponse,
  Event_GetSharedClipGroupsV2WSRequest,
  SharedClipGroupWrapperV2Type,
  Event_GetSharedClipGroupsV2WSResponse,
  Event_GetSharedClipGroupsWSRequest,
  SharedClipType,
  SharedClipGroupWrapperType,
  Event_GetSharedClipGroupsWSResponse,
  Event_GetSplicedClipsInProgressWSRequest,
  SplicedClipType,
  Event_GetSplicedClipsInProgressWSResponse,
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
  Event_SearchMotionGridWithActivitiesWSResponse,
  Event_SearchMotionGridWithActivitiesWSResponse_ActivityWithId,
  Event_SearchMotionGridWithActivitiesWSResponse_MotionGridActivity,
  Event_UnSavePolicyAlertWSRequest,
  Event_UnSavePolicyAlertWSResponse,
  Event_UpdatePolicyAlertTextDescriptionWSRequest,
  Event_UpdatePolicyAlertTextDescriptionWSResponse,
  Event_UpdateSavedClipWSRequest,
  Event_UpdateSavedClipWSResponse,
  Event_UpdateSharedClipGroupWSRequest,
  Event_UpdateSharedClipGroupWSResponse,
  Event_groups_CreateClipGroupWSRequest,
  Event_groups_CreateClipGroupWSResponse,
  Event_groups_DeleteClipGroupWSRequest,
  Event_groups_DeleteClipGroupWSResponse,
  Event_groups_GetClipGroupDetailsWSRequest,
  Event_groups_GetClipGroupDetailsWSResponse,
  Event_groups_GetClipGroupsForOrgWSRequest,
  Event_groups_GetClipGroupsForOrgWSResponse,
  Event_groups_UpdateClipGroupWSRequest,
  Event_groups_UpdateClipGroupWSResponse,
  Eventsearch_CombinedSeekPointType,
  Eventsearch_GetCameraOrDoorbellCameraSeekpointsWSResponse,
  Eventsearch_GetEventSeekpointsV2WSRequest,
  Eventsearch_SearchClothingAndVehicleByColorWSRequest,
  Eventsearch_VideoFootageWSRequest,
  Eventsearch_GetEventSeekpointsWSRequest,
  Eventsearch_GetEventSeekpointsWSResponse,
  Export_ExportAuditEventsWSRequest,
  Export_ExportClimateEventsWSRequest,
  Export_ExportCountReportsWSRequest,
  Export_ExportDiagnosticEventsWSRequest,
  Export_ExportDoorEventsWSRequest,
  Export_ExportEnvironmentalGatewayEventsWSRequest,
  Export_ExportInventoryWSRequest,
  Export_ExportMotionEventsWSRequest,
  Export_ExportPeopleCountEventsWSRequest,
  Export_ExportPeopleEventsWSRequest,
  Export_ExportProximityEventsWSRequest,
  Export_ExportProximityLocomotionEventsWSRequest,
  Export_ExportUptimeWSRequest,
  Export_ExportUsersWSRequest,
  TimeInterval,
  Export_ExportVehicleEventsWSRequest,
  FaceUploadMetadata,
  Facerecognition_faceevent_DeleteFaceEventWSRequest,
  Facerecognition_faceevent_DeleteFaceEventWSResponse,
  TimestampFilter,
  Facerecognition_faceevent_ExternalFaceEventSearchFilter,
  Facerecognition_faceevent_ExportFaceEventsByOrgWSRequest,
  Facerecognition_faceevent_ExternalPersonMatch,
  Facerecognition_faceevent_ExternalFaceEvent,
  Facerecognition_faceevent_ExternalFaceEventSimilaritySearchFilter,
  Facerecognition_faceevent_ReportTimestampFilter,
  Facerecognition_faceevent_FindFaceEventsByDeviceForReportingWSRequest,
  Facerecognition_faceevent_FindFaceEventsByDeviceForReportingWSResponse,
  Facerecognition_faceevent_FindFaceEventsByLocationForReportingWSRequest,
  Facerecognition_faceevent_FindFaceEventsByLocationForReportingWSResponse,
  Facerecognition_faceevent_FindFaceEventsByOrgForReportingWSRequest,
  Facerecognition_faceevent_FindFaceEventsByOrgForReportingWSResponse,
  Facerecognition_faceevent_FindFaceEventsByOrgWSRequest,
  Facerecognition_faceevent_FindFaceEventsByOrgWSResponse,
  Facerecognition_faceevent_FindSimilarFaceEventsByEmbeddingWSRequest,
  Facerecognition_faceevent_FindSimilarFaceEventsByEmbeddingWSResponse,
  Facerecognition_faceevent_FindSimilarFaceEventsByFaceMatchmakerWSRequest,
  Facerecognition_faceevent_FindSimilarFaceEventsByFaceMatchmakerWSResponse,
  Facerecognition_faceevent_FindSimilarFaceEventsWSRequest,
  Facerecognition_faceevent_FindSimilarFaceEventsWSResponse,
  Facerecognition_faceevent_GetFaceEventWSRequest,
  Facerecognition_faceevent_GetFaceEventWSResponse,
  Facerecognition_faceevent_ProcessFaceEventSearchImageWSResponse,
  Facerecognition_faceevent_UpdateFaceEventWSRequest,
  Facerecognition_faceevent_UpdateFaceEventWSResponse,
  Facerecognition_matchmaker_CreateFaceMatchmakerFromSightingWSRequest,
  Facerecognition_matchmaker_ExternalFaceMatchmaker,
  Facerecognition_matchmaker_CreateFaceMatchmakerFromSightingWSResponse,
  Person,
  Facerecognition_matchmaker_CreatePersonAndFaceMatchmakersWSResponse,
  Facerecognition_matchmaker_DeleteFaceMatchmakerWSRequest,
  Facerecognition_matchmaker_DeleteFaceMatchmakerWSResponse,
  Facerecognition_matchmaker_FileUploadResult,
  Facerecognition_matchmaker_FindFaceMatchmakersByOrgWSRequest,
  Facerecognition_matchmaker_FindFaceMatchmakersByOrgWSResponse,
  Facerecognition_matchmaker_FindFaceMatchmakersByPersonWSRequest,
  Facerecognition_matchmaker_FindFaceMatchmakersByPersonWSResponse,
  Facerecognition_matchmaker_FindFaceUploadMetadataByTransactionWSRequest,
  Facerecognition_matchmaker_FindFaceUploadMetadataByTransactionWSResponse,
  Facerecognition_matchmaker_GetFaceMatchingConfigWSRequest,
  Facerecognition_matchmaker_GetFaceMatchingConfigWSResponse,
  Facerecognition_matchmaker_GetFaceMatchmakerWSRequest,
  Facerecognition_matchmaker_GetFaceMatchmakerWSResponse,
  Facerecognition_matchmaker_UpdateFaceMatchingConfigWSRequest,
  Facerecognition_matchmaker_UpdateFaceMatchingConfigWSResponse,
  Facerecognition_matchmaker_UploadFaceMatchmakerForPersonWSResponse,
  Facerecognition_matchmaker_UploadFaceMatchmakersWSResponse,
  Facerecognition_matchmaker_ValidateFaceMatchmakerImageWSResponse,
  Facerecognition_person_AddPersonLabelWSRequest,
  Facerecognition_person_AddPersonLabelWSResponse,
  Facerecognition_person_CreatePersonWSRequest,
  Facerecognition_person_CreatePersonWSResponse,
  Facerecognition_person_DeletePersonWSRequest,
  Facerecognition_person_DeletePersonWSResponse,
  Facerecognition_person_FindPeopleByOrgWSRequest,
  Facerecognition_person_FindPeopleByOrgWSResponse,
  Facerecognition_person_FindPersonLabelsByOrgWSRequest,
  Facerecognition_person_FindPersonLabelsByOrgWSResponse,
  Facerecognition_person_GetPersonWSRequest,
  Facerecognition_person_GetPersonWSResponse,
  Facerecognition_person_RemovePersonLabelWSRequest,
  Facerecognition_person_RemovePersonLabelWSResponse,
  PersonSelectiveUpdate,
  Facerecognition_person_UpdatePersonWSRequest,
  Facerecognition_person_UpdatePersonWSResponse,
  FeatureCompatabilityType,
  Feature_DeviceFeaturesType,
  Feature_GetDeviceEventTypesWSRequest,
  Feature_GetDeviceEventTypesWSResponse,
  Feature_GetDeviceFeaturesListWSRequest,
  Feature_GetDeviceFeaturesListWSResponse,
  Feature_GetDeviceFeaturesWSRequest,
  Feature_GetDeviceFeaturesWSResponse,
  Feature_GetFeatureCompatabilityMatrixWSRequest,
  Feature_GetFeatureCompatabilityMatrixWSResponse,
  Feature_UpdateDeviceFeaturesWSRequest,
  Feature_UpdateDeviceFeaturesWSResponse,
  FirmwareUpdateIntervalType,
  FirmwareUpdateSettingsType,
  FirmwareUpdateSettingsOverrideType,
  FlicHub,
  FlicDevice,
  FlicType,
  FormDataContentDisposition,
  FormDataBodyPart,
  FormDataMultiPart,
  Freight,
  Functionality,
  GeneaSettings,
  GeneaType,
  GenericDoorType,
  ObjectSearchModelEnum,
  GenericObjectEmbedding,
  GenericObjectEmbeddingMatch,
  GenericPosSettings,
  GenericPosType,
  VideoSimilarityModelEnum,
  GenericVideoEmbedding,
  GenericVideoEmbeddingMatch,
  GpsError,
  GeodeticCoordinates,
  GetTemporaryOrgTokenResponse,
  GoogleCaptchaSourceEnum,
  GoogleSettings,
  GoogleSettingsV2,
  GoogleType,
  GoogleUserSettings,
  Group_AddUsersToOrgGroupWSRequest,
  OrgGroupMemberType,
  Group_AddUsersToOrgGroupWSResponse,
  Group_CreateOrgGroupWSRequest,
  OrgGroupType,
  Group_CreateOrgGroupWSResponse,
  Group_DeleteOrgGroupWSRequest,
  Group_DeleteOrgGroupWSResponse,
  Group_FindAllUsersForOrgGroupWSRequest,
  Group_FindAllUsersForOrgGroupWSResponse,
  Group_FindOrgGroupMembershipsByUserWSRequest,
  Group_FindOrgGroupMembershipsByUserWSResponse,
  Group_FindOrgGroupMembershipsForCurrentUserWSRequest,
  Group_FindOrgGroupMembershipsForCurrentUserWSResponse,
  Group_FindOrgGroupsByExactNameWSRequest,
  Group_FindOrgGroupsByExactNameWSResponse,
  Group_FindOrgGroupsByNamePrefixWSRequest,
  Group_FindOrgGroupsByNamePrefixWSResponse,
  Group_FindOrgGroupsByOrgWSRequest,
  Group_FindOrgGroupsByOrgWSResponse,
  Group_FindOrgGroupsByUserMembershipWSRequest,
  Group_FindOrgGroupsByUserMembershipWSResponse,
  Group_RemoveUsersFromOrgGroupWSRequest,
  Group_RemoveUsersFromOrgGroupWSResponse,
  Group_UpdateOrgGroupWSRequest,
  Group_UpdateOrgGroupWSResponse,
  GuestActivityEnum,
  GuestTypeEnum,
  GuestStatusEnum,
  Guest,
  GuestActivityLog,
  GuestInvite,
  GuestInviteSelectiveUpdateByInvocation,
  GuestManagementOrgSettings,
  GuestManagementSettingsSelectiveUpdate,
  GuestManagementType,
  GuestSelectiveUpdateByInvocation,
  Guestmanagement_ActivateKioskWSRequest,
  Guestmanagement_ActivateKioskWSResponse,
  Guestmanagement_BaseGuestManagementWSRequest,
  Guestmanagement_CreateGuestInviteWSRequest,
  Guestmanagement_CreateGuestManagementSettingsWSRequest,
  Guestmanagement_CreateGuestManagementSettingsWSResponse,
  Guestmanagement_CreateGuestWSRequest,
  Guestmanagement_ExportGuestActivitiesWSRequest,
  Guestmanagement_ExportGuestsWSRequest,
  Guestmanagement_GetActivityLogsForGuestWSRequest,
  Guestmanagement_GetActivityLogsForLocationWSRequest,
  Guestmanagement_GetAllGuestInvitesWSResponse,
  Guestmanagement_GetAllGuestsWSResponse,
  Guestmanagement_GetGuestActivityLogsWSRequest,
  Guestmanagement_GetGuestActivityLogsWSResponse,
  Guestmanagement_GetGuestInviteWSResponse,
  Guestmanagement_GetGuestInvitesWSResponse,
  Guestmanagement_GetGuestManagementSettingsWSResponse,
  Guestmanagement_GetGuestWSResponse,
  PaginateRequest,
  Guestmanagement_GetInvitesForOrgWSRequest,
  Kiosk,
  Guestmanagement_GetKioskInfoWSResponse,
  Guestmanagement_GetKiosksForOrgWSResponse,
  Guestmanagement_GetNametagTemplateForGuestWSRequest,
  Guestmanagement_GetNametagTemplateForGuestWSResponse,
  Guestmanagement_GuestByEmailWSRequest,
  Guestmanagement_GuestCheckinWSRequest,
  Guestmanagement_GuestInviteWSRequest,
  Guestmanagement_GuestInvitesByEmailWSRequest,
  Guestmanagement_GuestWSRequest,
  Guestmanagement_UpdateGuestInviteWSRequest,
  Guestmanagement_UpdateGuestManagementSettingsWSRequest,
  Guestmanagement_UpdateGuestManagementSettingsWSResponse,
  Guestmanagement_UpdateGuestWSRequest,
  HaloSettings,
  HardwareInvoiceSubItem,
  HardwareType,
  Help_CreateTicketWSRequest,
  Help_CreateTicketWSResponse,
  Help_GetOpenTicketsV2WSRequest,
  Help_TicketInformation,
  Help_GetOpenTicketsV2WSResponse,
  Help_GetOpenTicketsWSRequest,
  Help_GetOpenTicketsWSResponse,
  Help_ShippingAddress,
  Help_ProcessRMAWSRequest,
  Help_ProcessRMAWSResponse,
  Help_SendFeedbackWSRequest,
  Help_SendFeedbackWSResponse,
  Help_TriageDeviceWSRequest,
  Help_TriageDeviceWSResponse,
  HttpMethod,
  HttpRange,
  HttpHeaders,
  HttpStatusCode,
  IAperioType,
  IAvigilonAltaType,
  InformacastType,
  InnerRangeType,
  KisiType,
  LumeoType,
  MicrosoftTeamsType,
  NineOneOneCellularType,
  OmnialertType,
  OpenAIType,
  OpentechAllianceType,
  PimlocType,
  PlaceOsType,
  ProDataKeyType,
  RaptorType,
  ShellyType,
  ToastType,
  WebhooksType,
  ZapierType,
  IBaseIntegrationType,
  IBrivoType,
  IButterflyMXType,
  IDeviceIntegrationType,
  IDiceType,
  IEnvoyType,
  IFlicType,
  IGeneaType,
  IGoogleType,
  IGuestManagementType,
  IInformacastType,
  IInnerRangeType,
  IKisiType,
  ILumeoType,
  IMicrosoftTeamsType,
  INineOneOneCellularType,
  IOmnialertType,
  IOpenAIType,
  IOpentechAllianceType,
  IPimlocType,
  IPlaceOsType,
  IProDataKeyType,
  IRaptorType,
  IShellyType,
  IToastType,
  IWebhooksType,
  ImmixSettings,
  InformacastScenario,
  InnerRangeConsoleSettings,
  InnerRangeDoorType,
  InnerRangeConsoleType,
  InnerRangeDoorInfoType,
  IntegrationActionStatusEnum,
  IntegrationAuditEventEnum,
  IntegrationAuditEvent,
  IntegrationDiagnosticEventType,
  Integration_BaseIntegrationWSRequest,
  Integration_CreateEnvoyInviteWSRequest,
  Integration_GetAccessControlIntegrationsForAlmWSResponse,
  Integration_GetAllGuestsWSResponse,
  Integration_GetAllOrgIntegrationsV2WSResponse,
  Integration_GetAmtReadersWSRequest,
  Integration_GetAperioIntegrationWSRequest,
  Integration_aperio_AperioDeviceView,
  Integration_aperio_DtcInfoView,
  Integration_aperio_AperioIntegrationStatus,
  Integration_aperio_AperioDoorView,
  Integration_aperio_AperioGatewayView,
  Integration_aperio_AperioRhombusDoorControllerView,
  Integration_GetAperioIntegrationWSResponse,
  Integration_GetApiTokenApplicationsWSRequest,
  Integration_GetApiTokenApplicationsWSResponse,
  Integration_GetApiTokensWSRequest,
  Integration_GetApiTokensWSResponse,
  Integration_GetBadgeIntegrationDoorsWSResponse,
  Integration_GetBadgeIntegrationGenericDoorsWSResponse,
  PlaceType,
  Integration_GetBadgeIntegrationPlacesWSResponse,
  Integration_GetBrivoDoorsWSRequest,
  Integration_GetBrivoDoorsWSResponse,
  Integration_GetButterflymxPanelsWSRequest,
  Integration_GetButterflymxPanelsWSResponse,
  Integration_GetCalendlyEventDetailsWSRequest,
  Integration_GetCalendlyEventDetailsWSResponse,
  Integration_GetEnvoyDeliveriesWSRequest,
  Integration_GetEnvoyDeliveriesWSResponse,
  Integration_GetEnvoyEmployeesWSRequest,
  Integration_GetEnvoyEmployeesWSResponse,
  Integration_GetEnvoyLocationsWSRequest,
  Integration_GetEnvoyLocationsWSResponse,
  Integration_GetEnvoyVisitorsWSRequest,
  Integration_GetEnvoyVisitorsWSResponse,
  Integration_GetFlicDevicesWSRequest,
  Integration_GetFlicDevicesWSResponse,
  Integration_GetGeneaDoorsWSRequest,
  PanelType,
  Integration_GetGeneaDoorsWSResponse,
  Integration_GetGuestWSResponse,
  Integration_GetInformacastScenariosWSResponse,
  Integration_GetInnerRangeConsolesWSRequest,
  Integration_GetInnerRangeConsolesWSResponse,
  Integration_GetInnerRangeDoorsWSRequest,
  Integration_GetInnerRangeDoorsWSResponse,
  Integration_GetIntegrationDiagnosticEventsWSRequest,
  Integration_GetIntegrationDiagnosticEventsWSResponse,
  Integration_GetKisiDoorsWSRequest,
  Integration_GetKisiDoorsWSResponse,
  KisiSettings,
  Integration_GetKisiIntegrationWSResponse,
  Integration_GetKisiPlacesWSRequest,
  Integration_GetMicrosoftUsersJoinedTeamsWSResponse,
  Integration_GetNineOneOneCSZonesWSRequest,
  SecurityZoneInfoType,
  Integration_GetNineOneOneCSZonesWSResponse,
  Integration_GetOpenAIModelsWSRequest,
  OpenAIModel,
  Integration_GetOpenAIModelsWSResponse,
  Integration_GetOpenpathDoorsWSRequest,
  LockdownType,
  Integration_GetOpenpathLockdownsWSResponse,
  Integration_GetOpentechAllianceFacilitiesWSRequest,
  OpentechAllianceActionGroupType,
  OpentechAllianceFacilityType,
  Integration_GetOpentechAllianceFacilitiesWSResponse,
  Integration_GetOrgIntegrationsV2WSResponse,
  Integration_GetOrgIntegrationsWSRequest,
  IntuifaceSettings,
  LumeoSettings,
  MattermostSettings,
  MicrosoftTeamsSettings,
  NoonlightSettings,
  Office365Settings,
  OpenpathSettings,
  OpentechAllianceSettings,
  PagerDutySettings,
  PlaceOsSettings,
  ProDataKeySettings,
  SaltoSettings,
  ServiceNowSettings,
  SlackSettings,
  SlackSettingsV2,
  SquareSettings,
  ToastSettings,
  TPLinkSettings,
  TwilioSettings,
  WebhookSettings,
  OrgIntegrationsType,
  Integration_GetOrgIntegrationsWSResponse,
  Integration_GetPartnerApiTokensWSRequest,
  Integration_GetPdkDoorsWSRequest,
  Integration_GetPdkDoorsWSResponse,
  Integration_GetPdkSystemIdWSRequest,
  Integration_GetPdkSystemIdWSResponse,
  Integration_GetPlaceOsDoorsWSRequest,
  RaptorBuilding,
  Integration_GetRaptorBuildingsWSResponse,
  RaptorTemplate,
  Integration_GetRaptorTemplatesWSResponse,
  Integration_GetToastEventsTableAllLocationsWSRequest,
  Integration_GetToastEventsTableWSResponse_EventTableRow,
  Integration_GetToastEventsTableAllLocationsWSResponse,
  Integration_GetToastEventsTableWSRequest,
  Integration_GetToastEventsTableWSResponse,
  Integration_GetToastServiceAreasWSRequest,
  Integration_GetToastServiceAreasWSResponse,
  Integration_GuestWSRequest,
  Integration_InitiateBrivoOAuthWSRequest,
  Integration_InitiateCallbackAuthRequest,
  Integration_InitiateCallbackAuthResponse,
  Integration_InitiateOAuthWSRequest,
  Integration_InitiateOAuthWSResponse,
  Integration_RefreshGoogleAccessTokenWSRequest,
  Integration_RefreshGoogleAccessTokenWSResponse,
  Integration_RevokeApiTokenWSRequest,
  Integration_RevokeApiTokenWSResponse,
  Integration_RevokeGoogleDriveAccessWSRequest,
  Integration_SubmitApiTokenApplicationWSRequest,
  Integration_SubmitApiTokenApplicationWSResponse,
  ZapierEnum,
  Integration_SubscribeZapierWebhookWSRequest,
  Integration_SubscribeZapierWebhookWSResponse,
  Integration_TogglePowerWSRequest,
  Integration_TogglePowerWSResponse,
  Integration_UnlockDoorWSResponse,
  Integration_UnlockGeneaDoorWSRequest,
  Integration_UnlockIntegrationGenericDoorWSRequest,
  Integration_UnlockKisiDoorWSRequest,
  Integration_UnlockOpenpathDoorWSRequest,
  Integration_UnsubscribeZapierWebhookWSRequest,
  Integration_UpdateAmtIntegrationWSRequest,
  Integration_UpdateAperioIntegrationWSRequest,
  Integration_UpdateApiTokenWSRequest,
  Integration_UpdateApiTokenWSResponse,
  Integration_UpdateAvigilonAltaV2WSRequest,
  Integration_UpdateAwsIntegrationWSRequest,
  Integration_UpdateBoxIntegrationWSRequest,
  Integration_UpdateBrivoIntegrationV2WSRequest,
  Integration_UpdateBrivoIntegrationWSRequest,
  Integration_UpdateButterflymxIntegrationV2WSRequest,
  Integration_UpdateButterflymxIntegrationWSRequest,
  Integration_UpdateDeviceIntegrationWSRequest,
  Integration_UpdateDiceIntegrationWSRequest,
  Integration_UpdateDropboxIntegrationWSRequest,
  Integration_UpdateEmailIntegrationWSRequest,
  Integration_UpdateEnvoyIntegrationV2WSRequest,
  Integration_UpdateEnvoyIntegrationWSRequest,
  Integration_UpdateFlicIntegrationWSRequest,
  Integration_UpdateGeneaIntegrationV2WSRequest,
  Integration_UpdateGeneaIntegrationWSRequest,
  Integration_UpdateGoogleIntegrationV2WSRequest,
  Integration_UpdateGoogleIntegrationWSRequest,
  Integration_UpdateGuestByTokenWSRequest,
  Integration_UpdateGuestManagementIntegrationWSRequest,
  Integration_UpdateGuestWSRequest,
  Integration_UpdateHaloIntegrationWSRequest,
  Integration_UpdateInformacastIntegrationRequest,
  Integration_UpdateInnerRangeIntegrationWSRequest,
  Integration_UpdateIntuifaceIntegrationWSRequest,
  Integration_UpdateKisiIntegrationV2WSRequest,
  Integration_UpdateKisiIntegrationWSRequest,
  Integration_UpdateLumeoIntegrationWSRequest,
  Integration_UpdateMattermostIntegrationWSRequest,
  Integration_UpdateMicrosoftTeamsBotForTeamWSRequest,
  Integration_UpdateMicrosoftTeamsIntegrationV2WSRequest,
  Integration_UpdateMicrosoftTeamsIntegrationWSRequest,
  Integration_UpdateNineOneOneCellularIntegrationWSRequest,
  Integration_UpdateNoonlightSettingsWSRequest,
  Integration_UpdateOffice365IntegrationWSRequest,
  Integration_UpdateOmnialertIntegrationWSRequest,
  Integration_UpdateOmnialertIntegrationWSResponse,
  Integration_UpdateOpenAIIntegrationRequest,
  Integration_UpdateOpenpathIntegrationWSRequest,
  Integration_UpdateOpentechAllianceIntegrationV2WSRequest,
  Integration_UpdateOpentechAllianceIntegrationWSRequest,
  Integration_UpdateOrgIntegrationsWSResponse,
  Integration_UpdatePagerDutyIntegrationWSRequest,
  Integration_UpdatePdkIntegrationV2WSRequest,
  Integration_UpdatePdkIntegrationWSRequest,
  Integration_UpdatePimlocIntegrationRequest,
  Integration_UpdatePlaceOsSettingsV2WSRequest,
  Integration_UpdatePlaceOsSettingsWSRequest,
  Integration_UpdateRaptorIntegrationRequest,
  Integration_UpdateServiceNowIntegrationWSRequest,
  Integration_UpdateShellyIntegrationWSRequest,
  Integration_UpdateSlackIntegrationV2WSRequest,
  Integration_UpdateSlackIntegrationWSRequest,
  Integration_UpdateToastIntegrationV2WSRequest,
  Integration_UpdateToastIntegrationWSRequest,
  Integration_UpdateWebhookIntegrationV2WSRequest,
  Integration_UpdateWebhookIntegrationV2WSResponse,
  Integration_UpdateWebhookIntegrationWSRequest,
  Integration_ValidateKisiApiKeyWSRequest,
  Integration_aperio_ClearAperioDtcWSRequest,
  Integration_aperio_ClearAperioDtcWSResponse,
  Integration_aperio_DownloadCertificateWSRequest,
  Integration_aperio_RebootAperioGatewayWSRequest,
  Integration_aperio_RebootAperioGatewayWSResponse,
  Internal_AccessControlDoorOnlyWSRequest,
  Internal_AccessControlDoorOnlyWSRequest_AccountData,
  Internal_AccessControlDoorOnlyWSResponse,
  Internal_AddPartnerAsSuperAdminWSRequest,
  Internal_AddPartnerAsSuperAdminWSResponse,
  Internal_AlarmMonitoringOnlyWSRequest,
  Internal_AlarmMonitoringOnlyWSRequest_AccountData,
  Internal_AlarmMonitoringOnlyWSResponse,
  Internal_CreateCombinedLicensesFromV1WSRequest,
  Internal_CreateCombinedLicensesFromV1WSRequest_AccountData,
  Internal_CreateCombinedLicensesFromV1WSResponse,
  Internal_CreateOrgWSRequest,
  Internal_CreateOrgWSResponse,
  Internal_CreatePartnerOrgWSRequest,
  Internal_CreatePartnerOrgWSResponse,
  Internal_CreateReturnedInventoryAuditReservationWSRequest,
  Internal_CreateReturnedInventoryAuditReservationWSResponse,
  SupportAuthorityType,
  Internal_CreateSupportAuthorityWSRequest,
  Internal_CreateSupportAuthorityWSResponse,
  Internal_DeveloperNewsletterEnrollWSRequest,
  Internal_DeveloperNewsletterEnrollWSResponse,
  Internal_EntDevicesOnlyWSRequest,
  Internal_EntDevicesOnlyWSRequest_AccountData,
  Internal_EntDevicesOnlyWSResponse,
  Internal_GetSuperAdminGroupUUIDWSRequest,
  Internal_GetSuperAdminGroupUUIDWSResponse,
  Internal_GetWarrantyApprovedRMAsWSRequest,
  Internal_GetWarrantyApprovedRMAsWSResponse,
  RhombusShipmentInfoType,
  Product,
  Shipment,
  Shipper,
  OutgoingShipmentInfoType,
  Internal_InitiateShipmentWSRequest,
  Internal_ListOrgsWSRequest,
  PlayerViewLiveTypeEnum,
  UAPSettingsType,
  OrgV2Type,
  Internal_ListOrgsWSResponse,
  Internal_ParentLifetimeSpendWSRequest,
  Internal_ParentLifetimeSpendWSResponse,
  Internal_ProDevicesOnlyWSRequest,
  Internal_ProDevicesOnlyWSRequest_AccountData,
  Internal_ProDevicesOnlyWSResponse,
  Internal_RequestHardwareForDevelopmentWSRequest,
  Internal_RequestHardwareForDevelopmentWSResponse,
  Internal_SendShipmentShippedEmailWSRequest,
  Internal_SetOpportunityForPurchaseOrderWSRequest,
  Internal_SetOpportunityForPurchaseOrderWSResponse,
  Internal_ShipmentEmailWSResponse,
  Internal_VerifyCanMigrateOrgFromV1WSResponse,
  LicenseInvoiceSubItem,
  InvoiceType,
  Invoice_InvoiceChargeWSRequest,
  Invoice_InvoiceChargeWSResponse,
  Invoice_InvoiceV1LineItemType,
  Invoice_InvoiceV1Type,
  Invoice_InvoiceDetailsV1WSResponse,
  Invoice_InvoiceDetailsV2WSRequest,
  LineItems,
  NetsuiteInvoiceDetails,
  Invoice_InvoiceDetailsV2WSResponse,
  Invoice_InvoiceDetailsWSRequest,
  Invoice_InvoiceDetailsWSResponse,
  KeypadCommand,
  KeypadConfigType,
  Keypad_AuthenticatePinRequest,
  Keypad_AuthenticatePinResponse,
  Keypad_ClaimKeypadActivationTokenRequest,
  Keypad_ClaimKeypadActivationTokenResponse,
  Keypad_GetCurrentKeypadWSRequest,
  Keypad_GetCurrentKeypadWSResponse,
  Keypad_GetKeypadsForLocationWSRequest,
  Keypad_GetKeypadsForLocationWSResponse,
  Keypad_GetKeypadsForOrgWSRequest,
  Keypad_GetKeypadsForOrgWSResponse,
  Keypad_KeypadCheckinWSRequest,
  Keypad_KeypadCheckinWSResponse,
  Keypad_PublishKeypadCommandWSRequest,
  Keypad_UnregisterKeypadRequest,
  Keypad_UnregisterKeypadResponse,
  Keypad_UpdateKeypadRequest,
  Keypad_UpdateKeypadResponse,
  KioskSelectiveUpdate,
  Kiosk_ClaimKioskActivationTokenRequest,
  Kiosk_ClaimKioskActivationTokenResponse,
  Kiosk_DeleteKioskWSRequest,
  Kiosk_DeleteKioskWSResponse,
  Kiosk_GetCurrentKioskWSRequest,
  Kiosk_KioskWithInfo,
  Kiosk_GetCurrentKioskWSResponse,
  Kiosk_GetKiosksForLocationWSRequest,
  Kiosk_GetKiosksForLocationWSResponse,
  Kiosk_GetKiosksForOrgWSRequest,
  Kiosk_GetKiosksForOrgWSResponse,
  Kiosk_KioskCheckinWSRequest,
  Kiosk_KioskCheckinWSResponse,
  Kiosk_UnregisterKioskRequest,
  Kiosk_UnregisterKioskResponse,
  Kiosk_UpdateKioskResponse,
  Kiosk_UpdateKioskSelectiveRequest,
  LabelIdentificationActivityEventType,
  LicenseGroupStats,
  LicenseUsageCatalogItem,
  LicenseUsageStats,
  LicenseUsageType,
  License_AssignACUDoorLicenseWSRequest,
  License_AssignACUDoorLicenseWSResponse,
  License_AssignAlertMonitoringLicenseWSRequest,
  License_AssignAlertMonitoringLicenseWSResponse,
  License_AssignDeviceLicenseWSRequest,
  License_AssignDeviceLicenseWSResponse,
  License_AssignLicenseWSRequest,
  License_AssignLicenseWSResponse,
  License_CalculateLicensesStatsForClientOrgWSRequest,
  OrgLicenseStats,
  License_CalculateLicensesStatsForClientOrgWSResponse,
  License_CalculateLicensesStatsForOrgWSRequest,
  License_CalculateLicensesStatsForOrgWSResponse,
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
  License_FindLicensesByClaimKeyWSRequest,
  License_FindLicensesByClaimKeyWSResponse,
  License_GetACUDoorLicensesForClientOrgWSRequest,
  License_GetACUDoorLicensesForClientOrgWSResponse,
  License_GetACUDoorLicensesWSRequest,
  License_GetACUDoorLicensesWSResponse,
  License_GetAlertMonitoringLicensesForClientOrgWSRequest,
  License_GetAlertMonitoringLicensesForClientOrgWSResponse,
  License_GetAlertMonitoringLicensesWSRequest,
  License_GetAlertMonitoringLicensesWSResponse,
  License_GetDeviceLicensesForClientOrgWSRequest,
  License_GetDeviceLicensesForClientOrgWSResponse,
  License_GetDeviceLicensesWSRequest,
  License_GetDeviceLicensesWSResponse,
  License_GetLicensesForClientOrgWSRequest,
  License_GetLicensesForClientOrgWSResponse,
  License_GetLicensesWSRequest,
  License_GetLicensesWSResponse,
  License_catalog_FindCatalogItemsWSRequest,
  License_catalog_FindCatalogItemsWSResponse,
  License_catalog_GetCatalogItemByProductCodeWSRequest,
  License_catalog_GetCatalogItemByProductCodeWSResponse,
  License_claimkey_ClaimLicensesForClientOrgWSRequest,
  License_claimkey_ClaimLicensesForClientOrgWSResponse,
  License_claimkey_ClaimLicensesWSRequest,
  License_claimkey_ClaimLicensesWSResponse,
  License_claimkey_CreateClaimKeyWSRequest,
  License_claimkey_CreateClaimKeyWSResponse,
  License_claimkey_CreateRenewalClaimKeyWSRequest,
  License_claimkey_CreateRenewalClaimKeyWSResponse,
  License_claimkey_FindClaimKeysByOrgWSRequest,
  License_claimkey_FindClaimKeysByOrgWSResponse,
  License_claimkey_GetClaimKeyByCodeForClientOrgWSRequest,
  License_claimkey_GetClaimKeyByCodeForClientWSResponse,
  License_claimkey_GetClaimKeyByCodeWSRequest,
  License_claimkey_GetClaimKeyByCodeWSResponse,
  License_claimkey_GetClaimKeyWSRequest,
  License_claimkey_GetClaimKeyWSResponse,
  License_claimkey_ReturnClaimKeyProductQuantitiesWSRequest,
  License_claimkey_ReturnClaimKeyProductQuantitiesWSResponse,
  UriBuilder,
  Link,
  LiveNotificationActionStatusEnum,
  LiveNotificationActionRecordType,
  LocationFunctionality,
  LocationSettings,
  Location_AddLocationLabelWSRequest,
  Location_AddLocationLabelWSResponse,
  Location_CreateLocationWSRequest,
  Location_CreateLocationWSResponse,
  Location_DeleteLocationWSRequest,
  Location_DeleteLocationWSResponse,
  Location_GeoCodeWSRequest,
  Location_GeoCodeWSResponse,
  Location_GetLocationLabelsForOrgWSRequest,
  Location_GetLocationLabelsForOrgWSResponse,
  Location_GetLocationWSRequest,
  Location_GetLocationWSResponse,
  Location_GetLocationsByGeoRequest,
  Location_GetLocationsByGeoResponse,
  Location_GetLocationsBySubLocationsHierarchyKeyWSRequest,
  Location_GetLocationsBySubLocationsHierarchyKeyWSResponse,
  Location_GetLocationsV2WSRequest,
  Location_GetLocationsV2WSResponse,
  Location_GetLocationsWSRequest,
  Location_GetLocationsWSResponse,
  Location_QualifiedAddressTypeWithValidation,
  Location_RemoveLocationLabelWSRequest,
  Location_RemoveLocationLabelWSResponse,
  Location_SelectiveUpdateLocationWSRequest,
  Location_SelectiveUpdateLocationWSResponse,
  Location_UpdateLocationWSRequest,
  Location_UpdateLocationWSResponse,
  Location_ValidateLocationWSRequest,
  Location_ValidateLocationWSResponse,
  LockdownActivatedStateEventType,
  LockdownDeactivatedStateEventType,
  Logistics_GetRMAsWSRequest,
  RMARequest,
  RMAType,
  Logistics_GetRMAsWSResponse,
  Logistics_GetShipmentsWSRequest,
  Logistics_GetShipmentsWSResponse,
  Maps_GenerateMapUrlWSRequest,
  Maps_GenerateMapUrlWSResponse,
  Mediadevice_GetBulkMediaDeviceDetailsWSRequest,
  Mediadevice_GetBulkMediaDeviceDetailsWSResponse,
  Mediadevice_MediaDeviceDetailsType,
  Metric_LogEventWSRequest,
  Metric_LogEventWSResponse,
  Metric_ReportErrorWSRequest,
  Metric_ReportErrorWSResponse,
  MicrosoftTeamsChannelSettings,
  MicrosoftTeamsUserSettings,
  MinimalNVRStateType,
  MinimalThresholdEventType,
  Mobile_LoginToOrg2FARequiredResponse,
  Mobile_LoginToOrgSuccessResponse,
  Mobile_LoginToOrgSsoRequiredResponse,
  Mobile_LoginToOrgBaseResponse,
  Mobile_LoginToOrgRequest,
  Mobile_LoginVerifiedSupportAuthorityMobileRequest,
  Mobile_LoginVerifiedSupportAuthorityMobileResponse,
  Mobile_LogoutMobileUserRequest,
  Mobile_LogoutMobileUserResponse,
  Mobile_RefreshMobileSessionRequest,
  Mobile_RefreshMobileSessionResponse,
  Mobile_UpdateMobileNotificationTokenRequest,
  Mobile_UpdateMobileNotificationTokenResponse,
  Mobile_UpdateRhombusKeyMobileNotificationTokenRequest,
  Mobile_UpdateRhombusKeyMobileNotificationTokenResponse,
  ModelStatusEnum,
  ModularAIModelParams,
  PipelineComponentType,
  PipelineComponent,
  ModularAIConfig,
  ModularAIConfigSelectiveUpdate,
  ModularAIDistribution,
  Modularai_AddModelToDeviceWSRequest,
  Modularai_AddModelToDeviceWSResponse,
  Modularai_CreateModularAIDistributionWSRequest,
  Modularai_CreateModularAIDistributionWSResponse,
  Modularai_CreateModularAIPipelineConfigWSRequest,
  Modularai_CreateModularAIPipelineConfigWSResponse,
  Modularai_GetDevicesForModelWSRequest,
  Modularai_GetDevicesForModelWSResponse,
  Modularai_GetModelsAddedToDeviceWSRequest,
  Modularai_GetModelsAddedToDeviceWSResponse,
  Modularai_GetModelsForDistributionWSRequest,
  Modularai_GetModelsForDistributionWSResponse,
  Modularai_GetModelsWSRequest,
  Modularai_GetModelsWSResponse,
  Modularai_ListModularAIDistributionsWSRequest,
  Modularai_ListModularAIDistributionsWSResponse,
  Modularai_RemoveModelFromDeviceWSRequest,
  Modularai_RemoveModelFromDeviceWSResponse,
  Modularai_UpdateModelWSRequest,
  Modularai_UpdateModelWSResponse,
  MultivaluedMapStringObject,
  MultivaluedMapStringParameterizedHeader,
  MultivaluedMapStringString,
  Network_GetDeviceNetworkConfigurationWSRequest,
  Network_NetworkConfigurationModeEnum,
  Network_IpConfiguration,
  Network_GetDeviceNetworkConfigurationWSResponse,
  Network_UpdateDeviceIpConfigurationWSRequest,
  Network_UpdateDeviceIpConfigurationWSResponse,
  NewCookie,
  NotificationSettingsType,
  NumericAggregationValue,
  OAuthApplication,
  Oauth_GetAllApplicationsForOrgWSRequest,
  Oauth_GetAllApplicationsForOrgWSResponse,
  Oauth_GetApplicationByClientIdWSRequest,
  Oauth_GetApplicationByClientIdWSResponse,
  Oauth_OAuthApplicationWSRequest,
  Oauth_OAuthApplicationWSResponse,
  OccupancyEventType,
  OccupancyScheduledTriggerType,
  OccupancyPolicyType,
  Occupancysensor_GetMinimalOccupancySensorStatesWSRequest,
  Occupancysensor_MotionSensorHealthEnum,
  Occupancysensor_MotionSensorHealthDetailsEnum,
  Occupancysensor_MinimalOccupancySensorStateType,
  Occupancysensor_GetMinimalOccupancySensorStatesWSResponse,
  Occupancysensor_GetOccupancyEventsForSensorWSRequest,
  Occupancysensor_GetOccupancyEventsForSensorWSResponse,
  Occupancysensor_UpdateOccupancySensorDetailsWSRequest,
  Occupancysensor_UpdateOccupancySensorDetailsWSResponse,
  OccupiedActivityEventType,
  Openapi_GetOpenApiComponentSchemasWSRequest,
  OpentechAllianceDoorInfoType,
  OpentechAllianceFacilitySettings,
  OperationStatus,
  OrgLockdownPlanType,
  OrgSamlSettingsType,
  RBACSettingsType,
  SAMLSettingsType,
  OrgType,
  Org_ClaimActivationTokenWSRequest,
  Org_ClaimActivationTokenWSResponse,
  Org_DeviceRegistrationClaimType,
  Org_ClaimShipmentRegistrationTokenWSRequest,
  Org_ClaimShipmentRegistrationTokenWSResponse,
  Org_CreatePendingRegistrationRequest,
  Org_CreatePendingRegistrationResponse,
  Org_DeleteCloudArchivingConfigWSRequest,
  Org_DeleteCloudArchivingConfigWSResponse,
  Org_DeleteKeypadLogoWSRequest,
  Org_DeleteKeypadLogoWSResponse,
  Org_DeleteRhombusKeyLogoWSRequest,
  Org_DeleteRhombusKeyLogoWSResponse,
  Org_FindAllHardwareWithPendingRegistrationRequest,
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
  Org_GetClientOrgWSRequest,
  Permission,
  UserPermissionGroupType,
  Org_GetClientOrgWSResponse,
  Org_GetCloudArchivingConfigsWSRequest,
  Org_GetCloudArchivingConfigsWSResponse,
  Org_GetDeviceFlagsWSRequest,
  Org_GetDeviceFlagsWSResponse,
  Org_GetFeaturesWSRequest,
  Org_GetFeaturesWSResponse,
  Org_GetLocationFlagsWSRequest,
  Org_GetLocationFlagsWSResponse,
  Org_GetOrgIntegrationsWSRequest,
  Org_GetOrgIntegrationsWSResponse,
  Org_GetOrgNotificationTemplateV2WSResponse,
  Org_GetOrgNotificationTemplateWSRequest,
  Org_GetOrgNotificationTemplateWSResponse,
  Org_GetOrgV2WSRequest,
  Org_GetOrgV2WSResponse,
  Org_GetOrgWSRequest,
  Org_GetOrgWSResponse,
  Org_GetSAMLSettingsV2WSRequest,
  Org_GetSAMLSettingsV2WSResponse,
  Org_GetSAMLSettingsWSRequest,
  Org_GetSAMLSettingsWSResponse,
  Org_GetScimDisplayInfoResponse,
  Org_GetTemporaryOrgTokenWSRequest,
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
  Org_UpdateOrgAudioAnalysisPolicyWSRequest,
  Org_UpdateOrgAudioAnalysisPolicyWSResponse,
  Org_UpdateOrgAudioRecordingPolicyWSRequest,
  Org_UpdateOrgAudioRecordingPolicyWSResponse,
  Org_UpdateOrgIntegrationsWSRequest,
  Org_UpdateOrgIntegrationsWSResponse,
  Org_UpdateOrgLLMUsagePolicyWSRequest,
  Org_UpdateOrgLLMUsagePolicyWSResponse,
  UserNotificationSelectiveUpdateV2,
  Org_UpdateOrgNotificationTemplateV2WSRequest,
  Org_UpdateOrgNotificationTemplateV2WSResponse,
  Org_UpdateOrgNotificationTemplateWSRequest,
  Org_UpdateOrgNotificationTemplateWSResponse,
  Org_UpdateOrgWSRequest,
  Org_UpdateOrgWSResponse,
  Org_UpdatePendingRegistrationRequest,
  Org_UpdatePendingRegistrationResponse,
  Org_UpdateSAMLSettingsV2WSRequest,
  Org_UpdateSAMLSettingsV2WSResponse,
  Org_UpdateSAMLSettingsWSRequest,
  Org_UpdateSAMLSettingsWSResponse,
  Org_UpdateSCIMSettingsForOrgWSRequest,
  Org_UpdateSCIMSettingsForOrgWSResponse,
  ParameterizedHeader,
  PartnerFunctionality,
  PartnerPermission,
  PartnerPermissionType,
  PartnerUserPermissionGroupType,
  Partner_ClientCustomizationsType,
  Partner_ClientDeviceCustomizationsType,
  Partner_ConnectionCountType,
  Partner_CreatePartnerClientWSRequest,
  Partner_PartnerWebResponseStatusEnum,
  Partner_CreatePartnerClientWSResponse,
  Partner_CustomizeClientDeviceWSRequest,
  Partner_CustomizeClientDeviceWSResponse,
  Partner_CustomizeClientWSRequest,
  Partner_CustomizeClientWSResponse,
  Partner_DeleteClientWebRequest,
  Partner_DeleteClientWebResponse,
  Partner_DeviceWithPartnerDetailsType,
  Partner_GetClientDevicesWSRequest,
  Partner_GetClientDevicesWSResponse,
  Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSFailureResponse,
  Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSSuccessResponse,
  Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSBaseResponse,
  Partner_GetClientRhombusOrgUsersForPartnerActivationTokenV2WSRequest,
  Partner_GetClientSummaryInfoWSRequest,
  Partner_GetClientSummaryInfoWSResponse,
  Partner_GetListOfAllClientDevicesRequest,
  Partner_GetListOfAllClientDevicesResponse,
  Partner_GetListOfControlledHardwareRequest,
  Partner_UnregisteredControlledHardwareType,
  Partner_GetListOfControlledHardwareResponse,
  Partner_GetPartnerClientMobileAccountAccessRequest,
  Partner_GetPartnerClientMobileAccountAccessResponse,
  Partner_GetPartnerClientsStatusMapWSRequest,
  Partner_GetPartnerClientsStatusMapWSResponse,
  Partner_GetPartnerClientsWSRequest,
  Partner_PartnerClientWebType,
  Partner_GetPartnerClientsWSResponse,
  Partner_GetPartnerUsersInOrgWSRequest,
  Partner_GetPartnerUsersInOrgWSResponse,
  Partner_GetShipmentsWSRequest,
  Partner_GetShipmentsWSResponse,
  Partner_GrantSupportAccessToClientWSRequest,
  Partner_GrantSupportAccessToClientWSResponse,
  Partner_ReassignDeviceOrgWSRequest,
  Partner_ReassignDeviceOrgWSResponse,
  Partner_RegisterDealWSRequest,
  Partner_RegisterDealWSResponse,
  Partner_RequestAccessToClientAccountRequest,
  Partner_RequestAccessToClientAccountResponse,
  Partner_RequestAccessToClientAccountV2Request,
  Partner_RequestAccessToClientAccountV2Response,
  Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSFailureResponse,
  Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSSuccessResponse,
  Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSBaseResponse,
  Partner_SubmitSupportAccessDecisionForPartnerActivationTokenV2WSRequest,
  Partner_UpdateManuallySendLicenseExpirationEmailWSRequest,
  Partner_UpdateManuallySendLicenseExpirationEmailWSResponse,
  Password_ForgotPasswordWSRequest,
  Password_ForgotPasswordWSResponse,
  Password_ResetPasswordWSRequest,
  Password_ResetPasswordWSResponse,
  Password_UserSignupWSRequest,
  Password_UserSignupWSResponse,
  PeopleCountEventType,
  UserPermissionType,
  Permission_AssignUserPermissionWSRequest,
  Permission_AssignUserPermissionWSResponse,
  Permission_CreatePartnerPermissionGroupWSRequest,
  Permission_CreatePartnerPermissionGroupWSResponse,
  Permission_CreatePermissionGroupWSRequest,
  Permission_CreatePermissionGroupWSResponse,
  Permission_DeletePartnerPermissionGroupWSRequest,
  Permission_DeletePartnerPermissionGroupWSResponse,
  Permission_DeletePermissionGroupWSRequest,
  Permission_DeletePermissionGroupWSResponse,
  Permission_GetPartnerPermissionGroupWSResponse,
  Permission_GetPartnerPermissionGroupsWSRequest,
  Permission_GetPermissionGroupsForOrgWSRequest,
  Permission_GetPermissionGroupsForOrgWSResponse,
  Permission_GetPermissionGroupsWSRequest,
  Permission_GetPermissionGroupsWSResponse,
  Permission_GetPermissionsForCurrentPartnerWSRequest,
  Permission_GetPermissionsForCurrentPartnerWSResponse,
  Permission_GetPermissionsForCurrentUserWSRequest,
  Permission_GetPermissionsForCurrentUserWSResponse,
  Permission_UpdatePartnerPermissionGroupWSRequest,
  Permission_UpdatePartnerPermissionGroupWSResponse,
  Permission_UpdatePermissionGroupWSRequest,
  Permission_UpdatePermissionGroupWSResponse,
  PhysicalPortEnumType,
  PhysicalPortType,
  PointType,
  Policy_MinimalAccessControlledDoorScheduledTriggerType,
  Policy_MinimalAccessControlledDoorPolicyType,
  Policy_CreateAccessControlledDoorPolicyWSRequest,
  Policy_CreateAccessControlledDoorPolicyWSResponse,
  Policy_ExternalAudioTriggerType,
  Policy_MinimalAudioScheduledTriggerType,
  Policy_MinimalAudioPolicyType,
  Policy_CreateAudioPolicyWSRequest,
  Policy_CreateAudioPolicyWSResponse,
  Policy_MinimalCameraScheduledTriggerType,
  Policy_MinimalCameraPolicyV2Type,
  Policy_CreateCameraPolicyWSRequest,
  Policy_CreateCameraPolicyWSResponse,
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
  Policy_CreateScheduleWSRequest,
  Policy_CreateScheduleWSResponse,
  Policy_ExternalVideoIntercomTriggerType,
  Policy_MinimalVideoIntercomScheduledTriggerType,
  Policy_MinimalVideoIntercomPolicyType,
  Policy_CreateVideoIntercomPolicyWSRequest,
  Policy_CreateVideoIntercomPolicyWSResponse,
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
  Policy_DeleteVideoIntercomPolicyWSRequest,
  Policy_DeleteVideoIntercomPolicyWSResponse,
  Policy_ExternalAudioScheduledTriggerType,
  Policy_ExternalAudioPolicyType,
  Policy_ExternalVideoIntercomScheduledTriggerType,
  Policy_ExternalVideoIntercomPolicyType,
  Policy_FindSchedulesWSRequest,
  Policy_FindSchedulesWSResponse,
  Policy_GetAccessControlledDoorPoliciesWSRequest,
  Policy_GetAccessControlledDoorPoliciesWSResponse,
  Policy_GetAudioPoliciesWSRequest,
  Policy_GetAudioPoliciesWSResponse,
  Policy_GetCameraPoliciesWSRequest,
  Policy_GetCameraPoliciesWSResponse,
  Policy_GetClimatePoliciesWSRequest,
  Policy_GetClimatePoliciesWSResponse,
  Policy_GetDoorPoliciesWSRequest,
  Policy_GetDoorPoliciesWSResponse,
  Policy_GetOccupancyPoliciesWSRequest,
  Policy_GetOccupancyPoliciesWSResponse,
  Policy_GetPoliciesUsingScheduleWSRequest,
  ProximityScheduledTriggerType,
  ProximityPolicyType,
  VideoIntercomTriggerType,
  VideoIntercomScheduledTriggerType,
  VideoIntercomPolicyType,
  Policy_GetPoliciesUsingScheduleWSResponse,
  Policy_GetPolicyAddendumsWSRequest,
  Policy_GetPolicyAddendumsWSResponse,
  Policy_GetPolicyPauseSettingsWSRequest,
  Policy_GetPolicyPauseSettingsWSResponse,
  Policy_GetProximityPoliciesWSRequest,
  Policy_GetProximityPoliciesWSResponse,
  Policy_GetVideoIntercomPoliciesWSRequest,
  Policy_GetVideoIntercomPoliciesWSResponse,
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
  Policy_UpdateVideoIntercomPolicyWSRequest,
  Policy_UpdateVideoIntercomPolicyWSResponse,
  PosIntegrationInfoType,
  Trigger,
  PromptConfigurationType,
  ProximityArrivedActivityEventType,
  ProximityDepartedActivityEventType,
  ProximityEventType,
  ProximityTagLocomotionEventType,
  ProximityTagTimeSeriesDataPointType,
  Proximity_GetLocomotionEventsForTagWSRequest,
  Proximity_GetLocomotionEventsForTagWSResponse,
  Proximity_GetMinimalProximityStatesWSRequest,
  Proximity_ProximityHealthEnum,
  Proximity_ProximityHealthDetailsEnum,
  Proximity_MinimalProximityStateType,
  Proximity_GetMinimalProximityStatesWSResponse,
  Proximity_GetProximityEventsForTagWSRequest,
  Proximity_GetProximityEventsForTagWSResponse,
  Proximity_UpdateProximitySensorDetailsWSRequest,
  Proximity_UpdateProximitySensorDetailsWSResponse,
  Rapidsos_GetNearbyFeedsRequest,
  Rapidsos_GetNearbyFeedsResponse,
  RegionCrossingActivityEventType,
  Relay_AssignThirdPartyCameraToNVRWSRequest,
  Relay_AssignThirdPartyCameraToNVRWSResponse,
  Relay_AssignThirdPartyCameraToRelayCameraWSRequest,
  Relay_AssignThirdPartyCameraToRelayCameraWSResponse,
  Relay_AuthenticateThirdPartyCameraWSRequest,
  Relay_AuthenticateThirdPartyCameraWSResponse,
  Relay_CreateThirdPartyCameraPasswordWSRequest,
  Relay_CreateThirdPartyCameraPasswordWSResponse,
  Relay_DeleteThirdPartyCameraPasswordWSRequest,
  Relay_DeleteThirdPartyCameraPasswordWSResponse,
  Relay_ExternalRtspEndpoint,
  Relay_DiscoveryWithUnassignedRtspEndpoints,
  Relay_ExecuteThirdPartyCameraDiscoveryWSRequest,
  Relay_ExecuteThirdPartyCameraDiscoveryWSResponse,
  Relay_FindDefaultRtspUrlsByManufacturerWSRequest,
  Relay_FindDefaultRtspUrlsByManufacturerWSResponse,
  Relay_FindDiscoveriesWithUnassignedRtspEndpointsWSRequest,
  Relay_FindDiscoveriesWithUnassignedRtspEndpointsWSResponse,
  Relay_GetAssignedThirdPartyCamerasWSRequest,
  Relay_GetAssignedThirdPartyCamerasWSResponse,
  Relay_GetFullNVRStateWSRequest,
  Relay_GetFullNVRStateWSResponse,
  Relay_GetImportThirdPartyCamerasFormatWSResponse,
  Relay_GetMinimalNVRStateListWSRequest,
  Relay_GetMinimalNVRStateListWSResponse,
  Relay_GetMinimalThirdPartyCameraStateListWSRequest,
  Relay_MinimalThirdPartyCameraStateType,
  Relay_GetMinimalThirdPartyCameraStateListWSResponse,
  Relay_GetNVRDetailsWSRequest,
  Relay_NVRExternalType,
  Relay_GetNVRDetailsWSResponse,
  Relay_GetRtspEndpointsWSRequest,
  Relay_GetRtspEndpointsWSResponse,
  Relay_GetThirdPartyCameraPasswordsWSRequest,
  ThirdPartyCameraPasswordType,
  Relay_GetThirdPartyCameraPasswordsWSResponse,
  Relay_ThirdPartyCameraImportResult,
  Relay_ImportThirdPartyCamerasWSResponse,
  Relay_ManualDiscoverThirdPartyCameraWSRequest,
  Relay_ManualDiscoverThirdPartyCameraWSResponse,
  Relay_PTZMoveWSRequest,
  Relay_PTZMoveWSResponse,
  Relay_PTZStatusWSRequest,
  Relay_PTZStatusWSResponse,
  Relay_RebootNVRVWSRequest,
  Relay_RebootNVRVWSResponse,
  Relay_UnassignThirdPartyCameraWSRequest,
  Relay_UnassignThirdPartyCameraWSResponse,
  Relay_UnregisterNVRWSRequest,
  Relay_UnregisterNVRWSResponse,
  Relay_UpdateFirmwareWSStatus,
  Relay_UpdateNVRFirmwareWSRequest,
  Relay_UpdateNVRFirmwareWSResponse,
  Relay_UpdateNVRVWSRequest,
  Relay_UpdateNVRVWSResponse,
  RenewalClaimKey,
  Report_AuditEventWeb,
  Report_GetAuditFeedForTargetWSRequest,
  Report_GetAuditFeedForTargetWSResponse,
  Report_GetAuditFeedWSRequest,
  Report_GetAuditFeedWSResponse,
  Report_GetAverageReportWSRequest,
  Report_GetAverageReportWSResponse,
  Report_GetAverageReportsWSRequest,
  Report_GetAverageReportsWSResponse,
  Report_GetCountReportV2WSRequest,
  Report_GetCountReportWSRequest,
  TimeSeriesDataPointV2Type,
  Report_GetCountReportWSResponse,
  Report_GetCountReportsForDevicesAtLocationWSRequest,
  Report_GetCountReportsWSRequest,
  Report_GetCountReportsWSResponse,
  Report_GetCustomLLMNumericWSResponse,
  Report_GetCustomLLMReportWSRequest,
  SceneQueryReportEvent,
  SceneQueryReport,
  Report_GetCustomLLMReportWSResponse,
  Report_GetCustomLLMWBinaryWSResponse,
  Report_GetCustomLLMWSRequest,
  Report_GetDiagnosticFeedWSRequest,
  Report_GetDiagnosticFeedWSResponse,
  Report_GetLicensePlatesByDeviceWSRequest,
  VehicleEventIndexType,
  Report_GetLicensePlatesByDeviceWSResponse,
  Report_GetMostRecentPeopleCountWSRequest,
  Report_GetMostRecentPeopleCountWSResponse,
  Report_GetOccupancyCountWSRequest,
  Report_GetOccupancyCountWSResponse,
  Report_GetOccupancyCountsWSRequest,
  Report_TimeSeriesDataPointV2ExtendedType,
  Report_GetOccupancyCountsWSResponse,
  Report_GetProximityTagLocationsByDateWSRequest,
  Report_GetProximityTagLocationsByDateWSResponse,
  Report_GetRunningAverageWSRequest,
  WeeklyStatisticsDataPoint,
  Report_GetRunningAverageWSResponse,
  Report_GetSummaryCountReportWSRequest,
  SummaryCountTimeSeriesDataPointType,
  Report_GetSummaryCountReportWSResponse,
  Report_GetThresholdCrossingCountReportWSRequest,
  Report_GetThresholdCrossingCountReportWSResponse,
  Report_GetThresholdCrossingCountsWSRequest,
  Report_GetThresholdCrossingCountsWSResponse_ThresholdCrossingCountType,
  Report_GetThresholdCrossingCountsWSResponse,
  Report_GetThresholdCrossingEventsForDeviceWSRequest,
  Report_GetThresholdCrossingEventsForDeviceWSResponse,
  Report_GetThresholdCrossingEventsWSRequest,
  Report_GetThresholdCrossingEventsWSResponse,
  Report_ResetRunningAverageWSRequest,
  Report_ResetRunningAverageWSResponse,
  StatusType,
  Response,
  ResponseEntity,
  ResponseEntityString,
  RhombusOrgUserType,
  RuleLockdownEventOriginator,
  ScheduledEventRecordType,
  TriggerComponentRelayActionRecordType,
  UnlockDoorActionRecordType,
  VisionLLMEventRecordType,
  RulesEventRecordType,
  Rules_CreateRuleWSRequest,
  Rules_CreateRuleWSResponse,
  Rules_DeleteRulePauseSettingWSRequest,
  Rules_DeleteRulePauseSettingWSResponse,
  Rules_DeleteRuleWSRequest,
  Rules_DeleteRuleWSResponse,
  Rules_GetRulePauseSettingsResponse,
  Rules_GetRulePauseSettingsWSRequest,
  Rules_GetRulesForOrgWSRequest,
  Rules_GetRulesForOrgWSResponse,
  Rules_PauseRuleWSRequest,
  Rules_PauseRuleWSResponse,
  Rules_UpdateRuleWSRequest,
  Rules_UpdateRuleWSResponse,
  Rules_records_DeleteRulesEventRecordWSRequest,
  Rules_records_DeleteRulesEventRecordWSResponse,
  Rules_records_GetLatestRulesEventRecordsWSRequest,
  Rules_records_GetLatestRulesEventRecordsWSResponse,
  Rules_records_GetRulesEventRecordsWSRequest,
  Rules_records_GetRulesEventRecordsWSResponse,
  Rules_records_GetRulesFilteredWSRequest,
  SalesforceLicenseStartDateTimeAndEndDateTime,
  Scenequery_CreatePromptConfigurationWSRequest,
  Scenequery_CreatePromptConfigurationWSResponse,
  Scenequery_DeletePromptConfigurationWSRequest,
  Scenequery_DeletePromptConfigurationWSResponse,
  Scenequery_FindAllPromptConfigurationsWSRequest,
  Scenequery_FindAllPromptConfigurationsWSResponse,
  Scenequery_GetPromptConfigurationWSRequest,
  Scenequery_GetPromptConfigurationWSResponse,
  Scenequery_SelectiveUpdatePromptConfigurationWSRequest,
  Scenequery_SelectiveUpdatePromptConfigurationWSResponse,
  Scenequery_TriggerPromptWSRequest,
  Scenequery_TriggerPromptWSResponse,
  Scenequery_UpdatePromptConfigurationWSRequest,
  Scenequery_UpdatePromptConfigurationWSResponse,
  Schedule_CreateAbsoluteScheduleWSRequest,
  Schedule_CreateAbsoluteScheduleWSResponse,
  Schedule_CreateRelativeDateTimeIntervalsScheduleWSRequest,
  Schedule_CreateRelativeDateTimeIntervalsScheduleWSResponse,
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
  Schedule_GetScheduleDataV2WSRequest,
  Schedule_WeeklyRepeatingScheduleDataType,
  Schedule_GetScheduleDataV2WSResponse,
  Schedule_GetScheduleDataWSResponse,
  Schedule_GetSchedulesWSRequest,
  Schedule_GetSchedulesWSResponse,
  Search_DeleteVideoEmbeddingWSRequest,
  Search_DeleteVideoEmbeddingWSResponse,
  Search_IndexVideoEmbeddingWSRequest,
  Search_IndexVideoEmbeddingWSResponse,
  Search_SearchLicensePlatesWSRequest,
  VehicleEventSearchHitType,
  Search_SearchLicensePlatesWSResponse,
  Search_SearchObjectsByColorWSRequest,
  Search_SearchObjectsByColorWSResponse,
  Search_SearchSimilarObjectEmbeddingsByTextWSRequest,
  Search_SearchSimilarObjectEmbeddingsByVectorWSRequest,
  Search_SearchSimilarObjectEmbeddingsWSRequest,
  Search_SearchSimilarObjectEmbeddingsWSResponse,
  Search_SearchSimilarVideoEmbeddingsByTimeWindowWSRequest,
  Search_SearchSimilarVideoEmbeddingsByTimeWindowWSResponse,
  Search_SearchSimilarVideoEmbeddingsWSRequest,
  Search_SearchSimilarVideoEmbeddingsWSResponse,
  Sensor_FootageSensorSeekPointDisplayType,
  Sensor_GetFootageSensorSeekpointsForCameraWSRequest,
  Sensor_GetFootageSensorSeekpointsForCameraWSResponse,
  Sensor_GetFootageSensorSeekpointsForLocationWSRequest,
  Sensor_GetFootageSensorSeekpointsForLocationWSResponse,
  Sensor_GetFootageSensorSeekpointsForSensorWSRequest,
  Sensor_GetFootageSensorSeekpointsForSensorWSResponse,
  Sensor_GetSensorPresenceWindowsWSRequest,
  Sensor_GetSensorPresenceWindowsWSResponse,
  Share_GetSharedClipDataWSRequest,
  Share_SharedClipPublicType,
  Share_GetSharedClipDataWSResponse,
  Share_GetSharedFootageBoundingBoxesWSRequest,
  Share_GetSharedFootageBoundingBoxesWSResponse,
  Share_GetSharedFootageSeekpointsV2WSRequest,
  Share_GetSharedFootageSeekpointsV2WSResponse,
  Share_GetSharedFootageSeekpointsWSRequest,
  Share_GetSharedFootageSeekpointsWSResponse,
  Share_GetSharedFootageSensorSeekpointsForCameraWSRequest,
  Share_GetSharedFootageSensorSeekpointsForCameraWSResponse,
  Share_GetSharedLiveStreamInfoWSResponse,
  Share_GetSharedMediaUrisWSRequest,
  Share_GetSharedMediaUrisWSResponse,
  Share_GetSharedPresenceWindowsWSRequest,
  Share_GetSharedPresenceWindowsWSResponse,
  Share_GetSharedTimelapseDataV2WSResponse,
  Share_GetSharedTimelapseDataWSRequest,
  Share_GetSharedTimelapseDataWSResponse,
  Share_SharedVideoWallDeviceType,
  Share_GetSharedVideoWallInfoWSResponse,
  Share_GetSharedVideoWallMediaUrisWSRequest,
  Share_GetSharedVideoWallMediaUrisWSResponse,
  Share_ShareLinkWSRequest,
  Share_ShareLinkWSResponse,
  TimelapseSource,
  SharedTimelapseClipType,
  SharedTimelapseGroupWrapperType,
  ShellyDevice,
  SplicedClipProgress,
  Stats,
  StatsCredentialReference,
  StreamingOutput,
  SupportAuthorityLockdownEventOriginator,
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
  TimelapseStatus,
  TimelapseClipType,
  ToastRestaurantInfo,
  ToastRestaurantSettings,
  TriggerContent,
  TvOsConfigType,
  Tvos_GetTvOsConfigWsRequest,
  Tvos_GetTvOsConfigWsResponse,
  Tvos_GetTvOsConfigsForOrgWsRequest,
  Tvos_GetTvOsConfigsForOrgWsResponse,
  Tvos_UpdateTvOsConfigWsRequest,
  Tvos_UpdateTvOsConfigWsResponse,
  UserInfo,
  UserLockdownEventOriginator,
  UserMetadataField,
  UserMetadataFieldTemplate,
  UserMetadataFieldTemplateSelectiveUpdate,
  UserVirtualMfaDeviceType,
  User_AssignEmailToUserWSRequest,
  User_AssignEmailToUserWSResponse,
  User_BulkProvisionCredentialsWSResponse,
  User_ChangeUserEmailWSRequest,
  User_ChangeUserEmailWSResponse,
  User_ChangeUserPasswordWSRequest,
  User_ChangeUserPasswordWSResponse,
  User_CreateUserWSRequest,
  User_CreateUserWSResponse,
  User_DeleteUserWSRequest,
  User_DeleteUserWSResponse,
  User_DeleteVirtualMfaDeviceForCurrentUserWSRequest,
  User_DeleteVirtualMfaDeviceForCurrentUserWSResponse,
  User_FindUserByEmailWSRequest,
  User_FindUserByEmailWSResponse,
  User_FindUserWSRequest,
  User_FindUserWSResponse,
  User_GetBulkProvisionCredentialsFormatWSResponse,
  User_GetImportUsersFormatWSResponse,
  User_GetRhombusKeyConfigForUserWSRequest,
  User_GetRhombusKeyConfigForUserWSResponse,
  User_GetUserCustomizationFlagsWSRequest,
  User_GetUserCustomizationFlagsWSResponse,
  User_GetUsersInOrgForReportsWSRequest,
  User_GetUsersInOrgForReportsWSResponse,
  User_GetUsersInOrgWSRequest,
  User_UserSnoozeNotificationSettingsType,
  User_GetUsersInOrgWSResponse,
  User_GetVirtualMfaDeviceForCurrentUserWSRequest,
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
  User_UpdatePartnerUserNotificationSettingsWSRequest,
  User_UpdatePartnerUserNotificationSettingsWSResponse,
  User_UpdatePartnerWSRequest,
  User_UpdatePartnerWSResponse,
  User_UpdateRhombusKeySettingsForUserWSRequest,
  User_UpdateRhombusKeySettingsForUserWSResponse,
  User_UpdateUserCustomizationFlagsWSRequest,
  User_UpdateUserCustomizationFlagsWSResponse,
  User_UpdateUserNotificationSettingsWSRequest,
  User_UpdateUserNotificationSettingsWSResponse,
  User_UpdateUserSelectiveWSRequest,
  User_UpdateUserSelectiveWSResponse,
  User_UpdateUserWSRequest,
  User_UpdateUserWSResponse,
  User_metadata_CreateUserMetadataFieldTemplateWSRequest,
  User_metadata_CreateUserMetadataFieldTemplateWSResponse,
  User_metadata_DeleteUserMetadataFieldTemplateWSRequest,
  User_metadata_DeleteUserMetadataFieldTemplateWSResponse,
  User_metadata_DeleteUserMetadataFieldWSRequest,
  User_metadata_DeleteUserMetadataFieldWSResponse,
  User_metadata_FindUserMetadataFieldTemplatesWSRequest,
  User_metadata_FindUserMetadataFieldTemplatesWSResponse,
  User_metadata_FindUserMetadataFieldsWSRequest,
  User_metadata_FindUserMetadataFieldsWSResponse,
  User_metadata_SaveUserMetadataFieldsWSRequest,
  User_metadata_SaveUserMetadataFieldsWSResponse,
  User_metadata_UpdateUserMetadataFieldTemplateWSRequest,
  User_metadata_UpdateUserMetadataFieldTemplateWSResponse,
  VacantActivityEventType,
  VehicleV2Type,
  Vehicle_AddVehicleLabelWSRequest,
  Vehicle_AddVehicleLabelWSResponse,
  Vehicle_AssociateEventsToVehicleWSRequest,
  Vehicle_AssociateEventsToVehicleWSResponse,
  Vehicle_DeleteVehicleWSRequest,
  Vehicle_DeleteVehicleWSResponse,
  Vehicle_GetRecentVehicleEventsByLocationWSRequest,
  Vehicle_GetRecentVehicleEventsByLocationWSResponse,
  Vehicle_GetRecentVehicleEventsForVehicleWSRequest,
  Vehicle_GetRecentVehicleEventsForVehicleWSResponse,
  Vehicle_GetRecentVehicleEventsWSRequest,
  Vehicle_GetRecentVehicleEventsWSResponse,
  Vehicle_GetVehicleEventsWSRequest,
  Vehicle_GetVehicleEventsWSResponse,
  Vehicle_GetVehicleLabelsForOrgWSRequest,
  Vehicle_GetVehicleLabelsForOrgWSResponse,
  Vehicle_GetVehiclesWSRequest,
  Vehicle_GetVehiclesWSResponse,
  Vehicle_RemoveVehicleLabelWSRequest,
  Vehicle_RemoveVehicleLabelWSResponse,
  Vehicle_ReportVehicleEventRequest,
  Vehicle_ReportVehicleEventResponse,
  Vehicle_SaveVehicleWSRequest,
  Vehicle_SaveVehicleWSResponse,
  Video_CancelSpliceV2WSRequest,
  Video_CancelSpliceV2WSResponse,
  Video_CancelSpliceWSRequest,
  Video_CancelSpliceWSResponse,
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
  Video_GetSharedTimelapseGroupsWSResponse,
  Video_GetSplicedClipsInProgressWSRequest,
  Video_GetSplicedClipsInProgressWSResponse,
  Video_GetTimelapseClipsWSRequest,
  Video_GetTimelapseClipsWSResponse,
  Video_GetTimelapseMetadataWSRequest,
  Video_GetTimelapseMetadataWSResponse,
  Video_RetrySpliceWSRequest,
  Video_RetrySpliceWSResponse,
  Video_ShareTimelapseClipsWSRequest,
  Video_ShareTimelapseClipsWSResponse,
  Video_SpliceFrameWSRequest,
  Video_SpliceFrameWSResponse,
  Video_SpliceV2WSRequest,
  Video_SpliceV2WSResponse,
  Video_SpliceV3WSRequest,
  Video_SpliceV3WSResponse,
  Video_SpliceWSRequest,
  Video_SpliceWSResponse,
  Video_UpdateSharedTimelapseGroupWSRequest,
  Video_UpdateSharedTimelapseGroupWSResponse,
  Video_UpdateTimelapseClipMetadataWSRequest,
  Video_UpdateTimelapseClipMetadataWSResponse,
  WebhookInfo,
  WebhookMapEntry,
  ZapierWebhookSettings
};

// export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
//   return new Zodios(baseUrl, endpoints, options);
// }