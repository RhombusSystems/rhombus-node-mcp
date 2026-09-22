import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Per-request auth payload, populated by the transport layer and consumed by
 * the network layer when forwarding API calls to api2.rhombussystems.com.
 *
 * The OAuth Bearer variant carries the raw opaque Rhombus access token issued
 * by the Rhombus authorization server. api2 validates it directly via
 * x-auth-access-token.
 */
export type AuthPayload =
  | { apiKey: string }
  | { sessionId: string; latestRecordUuid: string }
  | { cookie: string; sessionAlias?: string }
  | { oauthBearer: string };

export const requestAuthContext = new AsyncLocalStorage<AuthPayload>();
