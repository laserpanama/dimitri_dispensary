import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

vi.mock("./db", async () => {
  const actual = await vi.importActual("./db") as any;
  return {
    ...actual,
    recordAgeVerification: vi.fn().mockResolvedValue(undefined),
    updateUserAgeVerification: vi.fn().mockResolvedValue(undefined),
    getDb: vi.fn().mockResolvedValue({}),
  };
});

describe("Age Verification Security", () => {
  it("should not allow spoofing IP address via input", async () => {
    const ctx: TrpcContext = {
      req: {
        ip: "1.2.3.4",
        headers: {},
      } as any,
      res: {} as any,
      user: null,
    };

    const caller = appRouter.createCaller(ctx);
    const spoofedIp = "9.9.9.9";

    // @ts-ignore - testing that it SHOULDN'T accept this or at least shouldn't use it
    await caller.ageVerification.verify({ ipAddress: spoofedIp });

    expect(db.recordAgeVerification).toHaveBeenCalledWith(null, expect.not.stringContaining(spoofedIp));
  });
});
