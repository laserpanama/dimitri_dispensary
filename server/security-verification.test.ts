import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the db module
vi.mock("./db", () => ({
  recordAgeVerification: vi.fn(),
  updateUserAgeVerification: vi.fn(),
  getDb: vi.fn(),
}));

function createPublicContext(ip: string): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      ip,
      protocol: "https",
      headers: {},
    } as any,
    res: {} as any,
  };

  return { ctx };
}

describe("Security: Age Verification", () => {
  it("should use the IP address from the request object and not from input", async () => {
    const serverDeterminedIp = "203.0.113.1";
    const { ctx } = createPublicContext(serverDeterminedIp);
    const caller = appRouter.createCaller(ctx);

    const recordAgeVerificationSpy = vi.spyOn(db, "recordAgeVerification");

    // @ts-expect-error - testing that passing ipAddress in input no longer works/is ignored
    const result = await caller.ageVerification.verify({
      ipAddress: "1.2.3.4", // Attempted spoof
    });

    expect(result).toEqual({ success: true });

    // Verify that the server-determined IP was used, not the one from the input
    expect(recordAgeVerificationSpy).toHaveBeenCalledWith(null, serverDeterminedIp);
  });

  it("should handle missing IP address gracefully by using 'unknown'", async () => {
    const ctx: TrpcContext = {
        user: null,
        req: {
          protocol: "https",
          headers: {},
        } as any,
        res: {} as any,
      };
    const caller = appRouter.createCaller(ctx);

    const recordAgeVerificationSpy = vi.spyOn(db, "recordAgeVerification");

    await caller.ageVerification.verify();

    expect(recordAgeVerificationSpy).toHaveBeenCalledWith(null, "unknown");
  });
});
