import { AsyncLocalStorage } from "node:async_hooks";

export type AuthPayload =
  | { apiKey: string }
  | { sessionId: string; latestRecordUuid: string }
  | { cookie: string; sessionAlias?: string }
  | { oauthToken: string };

export const requestAuthContext = new AsyncLocalStorage<AuthPayload>();
