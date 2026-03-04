import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the db module
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db") as any;
  return {
    ...actual,
    recordAgeVerification: vi.fn().mockResolvedValue(undefined),
    updateUserAgeVerification: vi.fn().mockResolvedValue(undefined),
    getDb: vi.fn().mockResolvedValue({}),
  };
});

function createMockContext(ip: string): TrpcContext {
  return {
    user: null,
    req: {
      ip,
      headers: {},
      protocol: "https",
    } as any,
    res: {
      setHeader: vi.fn(),
    } as any,
  };
}

describe("Security Fixes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Age Verification IP Spoofing Prevention", () => {
    it("should use real IP from request and ignore attempt to spoof via input", async () => {
      const realIp = "1.2.3.4";
      const ctx = createMockContext(realIp);
      const caller = appRouter.createCaller(ctx);

      // Attempt to spoof IP via input (which should now be ignored as schema was removed)
      await (caller.ageVerification.verify as any)({
        ipAddress: "9.9.9.9",
      });

      // Verify that the real IP was used instead of the spoofed one
      expect(db.recordAgeVerification).toHaveBeenCalledWith(null, realIp);
      expect(db.recordAgeVerification).not.toHaveBeenCalledWith(null, "9.9.9.9");
    });
  });
});
