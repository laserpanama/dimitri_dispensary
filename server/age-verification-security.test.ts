import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the db module
vi.mock("./db", () => ({
  updateUserAgeVerification: vi.fn(),
  recordAgeVerification: vi.fn(),
  getDb: vi.fn(),
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  getProductsByIds: vi.fn(),
  getUserOrders: vi.fn(),
  getOrderById: vi.fn(),
  getOrderItems: vi.fn(),
  getUserAppointments: vi.fn(),
  getPublishedBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  getUserNotifications: vi.fn(),
  getUserPreferences: vi.fn(),
}));

describe("Age Verification Security", () => {
  it("should record the IP address from context.req.ip, not from input", async () => {
    const mockIp = "1.2.3.4";
    const ctx: TrpcContext = {
      user: null,
      req: {
        ip: mockIp,
        headers: {},
      } as any,
      res: {} as any,
    };

    const recordAgeVerificationSpy = vi.spyOn(db, "recordAgeVerification");
    const caller = appRouter.createCaller(ctx);

    // Call without any input (as input schema was removed)
    await (caller.ageVerification.verify as any)();

    expect(recordAgeVerificationSpy).toHaveBeenCalledWith(null, mockIp);
  });

  it("should default to 'unknown' if req.ip is missing", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        headers: {},
      } as any,
      res: {} as any,
    };

    const recordAgeVerificationSpy = vi.spyOn(db, "recordAgeVerification");
    const caller = appRouter.createCaller(ctx);

    await (caller.ageVerification.verify as any)();

    expect(recordAgeVerificationSpy).toHaveBeenCalledWith(null, "unknown");
  });
});
