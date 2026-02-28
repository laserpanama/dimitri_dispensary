import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

vi.mock("./db", async () => {
  const actual = await vi.importActual("./db");
  return {
    ...actual as any,
    recordAgeVerification: vi.fn(),
    updateUserAgeVerification: vi.fn(),
    getDb: vi.fn(),
  };
});

function createMockContext(ip: string): TrpcContext {
  return {
    user: null,
    req: {
      ip,
      headers: {},
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

describe("Age Verification Security", () => {
  it("should use ctx.req.ip for age verification", async () => {
    const ip = "1.2.3.4";
    const ctx = createMockContext(ip);
    const caller = appRouter.createCaller(ctx);

    // This will initially work because the current implementation
    // falls back to x-forwarded-for or "unknown" if ipAddress is missing.
    // But we want to ensure it uses ctx.req.ip after our fix.
    await caller.ageVerification.verify({});

    expect(db.recordAgeVerification).toHaveBeenCalledWith(null, ip);
  });

  it("should not allow IP spoofing via input parameter", async () => {
    const realIp = "1.2.3.4";
    const spoofedIp = "8.8.8.8";
    const ctx = createMockContext(realIp);
    const caller = appRouter.createCaller(ctx);

    // Current implementation allows this.
    // After our fix, this should either fail validation or ignore the input.
    // We'll remove it from the schema, so it should fail validation.
    try {
      await (caller.ageVerification.verify as any)({ ipAddress: spoofedIp });
    } catch (e) {
      // Expect validation error after fix
      return;
    }

    // If it didn't throw, check if it ignored the spoofed IP
    expect(db.recordAgeVerification).not.toHaveBeenCalledWith(null, spoofedIp);
    expect(db.recordAgeVerification).toHaveBeenCalledWith(null, realIp);
  });
});
