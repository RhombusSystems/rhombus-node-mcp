import { postApi } from "../network.js";
import type schema from "../types/schema.js";
import type { RequestModifiers } from "../util.js";

interface AuditEvent {
  uuid?: string;
  action?: string;
  displayText?: string;
  principalName?: string;
  principalUuid?: string;
  targetName?: string;
  targetUuid?: string;
  timestamp?: string;
  failure?: boolean;
  sourceIp?: string;
  sourceCity?: string;
  sourceCountry?: string;
}

function mapAuditEvents(events: schema["Report_AuditEventWeb"][]): AuditEvent[] {
  return events.map(evt => ({
    uuid: evt.uuid ?? undefined,
    action: (evt.action as string) ?? undefined,
    displayText: evt.displayText ?? undefined,
    principalName: evt.principalName ?? undefined,
    principalUuid: evt.principalUuid ?? undefined,
    targetName: evt.targetName ?? undefined,
    targetUuid: evt.targetUuid ?? undefined,
    timestamp: evt.timestamp ?? undefined,
    failure: evt.failure ?? undefined,
    sourceIp: evt.sourceIp ?? undefined,
    sourceCity: evt.sourceCity ?? undefined,
    sourceCountry: evt.sourceCountry ?? undefined,
  }));
}

export async function getAuditFeedForPrincipal(
  principalUuid: string,
  maxResults?: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<AuditEvent[]> {
  const res = await postApi<schema["Report_GetAuditFeedForPrincipalWSResponse"]>({
    route: "/report/getAuditFeedForPrincipal",
    body: {
      principalUuid,
      maxResults: maxResults ?? 50,
    } satisfies schema["Report_GetAuditFeedForPrincipalWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.errorMsg ?? "Failed to get audit feed for principal");
  }

  return mapAuditEvents(res.auditEvents ?? []);
}

export async function getAuditFeedForTarget(
  targetUuid: string,
  maxResults?: number,
  requestModifiers?: RequestModifiers,
  sessionId?: string
): Promise<AuditEvent[]> {
  const res = await postApi<schema["Report_GetAuditFeedForTargetWSResponse"]>({
    route: "/report/getAuditFeedForTarget",
    body: {
      targetUuid,
      maxResults: maxResults ?? 50,
    } satisfies schema["Report_GetAuditFeedForTargetWSRequest"],
    modifiers: requestModifiers,
    sessionId,
  });

  if (res.error) {
    throw new Error(res.errorMsg ?? "Failed to get audit feed for target");
  }

  return mapAuditEvents(res.auditEvents ?? []);
}
