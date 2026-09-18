import { describe, it, expect, vi, beforeEach } from "vitest";
import * as network from "../../src/network/network.js";
import {
  clearAccessibleAppsCache,
  resolveAccessibleApps,
  resolveSessionIdentity,
  SUPPORT_SESSION_MARKER,
} from "../../src/api/get-accessible-apps.js";
import { RhombusAppEnum } from "../../src/types/schema.js";

vi.mock("../../src/network/network.js");

const CONSOLE_USER = {
  user: {
    uuid: "user-1",
    orgUuid: "org-1",
    email: "admin@customer.example",
    accessibleRhombusApps: [RhombusAppEnum.CONSOLE, null],
  },
};

let counter = 0;
/** Fresh session id per test so the module-level cache never leaks between cases. */
function newSession(): string {
  counter += 1;
  return `session-${counter}`;
}

describe("resolveAccessibleApps / resolveSessionIdentity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("regular user: apps come from accessibleRhombusApps and identity from user (unchanged)", async () => {
    vi.mocked(network.postApi).mockResolvedValue(CONSOLE_USER as never);
    const sessionId = newSession();

    expect(await resolveAccessibleApps(sessionId)).toEqual([RhombusAppEnum.CONSOLE]);
    expect(await resolveSessionIdentity(sessionId)).toEqual({
      userId: "user-1",
      orgUuid: "org-1",
      email: "admin@customer.example",
      sessionType: "USER",
    });

    // one getCurrentUser call serves both resolvers
    expect(vi.mocked(network.postApi)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(network.postApi).mock.calls[0][0].route).toBe("/customer/getCurrentUser");
    clearAccessibleAppsCache(sessionId);
  });

  it("regular partner user keeps PARTNER (no support handling kicks in)", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      user: { uuid: "p-1", orgUuid: "org-p", accessibleRhombusApps: [RhombusAppEnum.PARTNER] },
    } as never);
    const sessionId = newSession();

    expect(await resolveAccessibleApps(sessionId)).toEqual([RhombusAppEnum.PARTNER]);
    expect((await resolveSessionIdentity(sessionId))?.sessionType).toBe("USER");
    clearAccessibleAppsCache(sessionId);
  });

  it("success with user=null (support session, pre-sessionType webservice): CONSOLE set + marker identity", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      error: false,
      user: null,
      permissionGroupUuid: "pg-1",
      flags: {},
    } as never);
    const sessionId = newSession();

    expect(await resolveAccessibleApps(sessionId)).toEqual([RhombusAppEnum.CONSOLE]);
    expect(await resolveSessionIdentity(sessionId)).toEqual({
      userId: SUPPORT_SESSION_MARKER,
      orgUuid: undefined,
      email: undefined,
      name: undefined,
      sessionType: "SUPPORT",
    });
    expect(vi.mocked(network.postApi)).toHaveBeenCalledTimes(1);
    clearAccessibleAppsCache(sessionId);
  });

  it("success with user missing entirely is treated the same as user=null", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ permissionGroupUuid: "pg-1" } as never);
    const sessionId = newSession();

    expect(await resolveAccessibleApps(sessionId)).toEqual([RhombusAppEnum.CONSOLE]);
    expect((await resolveSessionIdentity(sessionId))?.sessionType).toBe("SUPPORT");
    clearAccessibleAppsCache(sessionId);
  });

  it("sessionType=SUPPORT with supportSession: identity populated from supportSession", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      user: null,
      sessionType: "SUPPORT",
      supportSession: {
        authorityUuid: "BL7Peak9QByiPrFCCZdqyQ",
        authorityType: "PARTNER_SUPPORT",
        name: "Brandon Salzberg",
        email: "brandon@rhombus.com",
        permissionGroupUuid: "pg-1",
        expirationTimestamp: 1_800_000_000_000,
      },
    } as never);
    const sessionId = newSession();

    expect(await resolveAccessibleApps(sessionId)).toEqual([RhombusAppEnum.CONSOLE]);
    expect(await resolveSessionIdentity(sessionId)).toEqual({
      userId: "BL7Peak9QByiPrFCCZdqyQ",
      orgUuid: undefined,
      email: "brandon@rhombus.com",
      name: "Brandon Salzberg",
      sessionType: "SUPPORT",
    });
    clearAccessibleAppsCache(sessionId);
  });

  it("sessionType=SUPPORT wins even if a user object is present", async () => {
    vi.mocked(network.postApi).mockResolvedValue({
      ...CONSOLE_USER,
      user: { ...CONSOLE_USER.user, accessibleRhombusApps: [RhombusAppEnum.PARTNER] },
      sessionType: "SUPPORT",
      supportSession: { authorityUuid: "auth-1" },
    } as never);
    const sessionId = newSession();

    expect(await resolveAccessibleApps(sessionId)).toEqual([RhombusAppEnum.CONSOLE]);
    expect((await resolveSessionIdentity(sessionId))?.userId).toBe("auth-1");
    clearAccessibleAppsCache(sessionId);
  });

  it("error envelope: both resolvers return null and nothing is cached (unchanged)", async () => {
    vi.mocked(network.postApi).mockResolvedValue({ error: true, errorMsg: "nope" } as never);
    const sessionId = newSession();

    expect(await resolveAccessibleApps(sessionId)).toBeNull();
    expect(await resolveSessionIdentity(sessionId)).toBeNull();
    // failures are not cached: each call re-fetches
    expect(vi.mocked(network.postApi)).toHaveBeenCalledTimes(2);
  });

  it("thrown error: both resolvers return null (unchanged)", async () => {
    vi.mocked(network.postApi).mockRejectedValue(new Error("network down"));
    const sessionId = newSession();

    expect(await resolveAccessibleApps(sessionId)).toBeNull();
    expect(await resolveSessionIdentity(sessionId)).toBeNull();
  });

  it("no session id: null without any API call (unchanged)", async () => {
    expect(await resolveAccessibleApps(undefined)).toBeNull();
    expect(await resolveSessionIdentity(undefined)).toBeNull();
    expect(vi.mocked(network.postApi)).not.toHaveBeenCalled();
  });
});
