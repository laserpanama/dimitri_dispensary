import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the db module
vi.mock("./db", () => ({
  recordAgeVerification: vi.fn(),
  updateUserAgeVerification: vi.fn(),
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
  getDb: vi.fn(),
}));

describe("Security Verification - Age Verification IP Resolution", () => {
  it("should use the request IP and ignore spoofed input", async () => {
    const clientIp = "203.0.113.1";

    const ctx: TrpcContext = {
      user: null,
      req: {
        ip: clientIp,
        headers: {
          "x-forwarded-for": "10.0.0.1", // Spoofed/Proxy header
        },
      } as any,
      res: {} as any,
    };

    const recordSpy = vi.spyOn(db, "recordAgeVerification");
    const caller = appRouter.createCaller(ctx);

    // Call with a spoofed ipAddress in input (should be ignored as it's removed from schema but let's be sure)
    // Actually, with the new schema, passing ipAddress will fail zod validation if I kept it but I removed it.
    // Let's verify it uses ctx.req.ip
    await caller.ageVerification.verify({});

    expect(recordSpy).toHaveBeenCalledWith(null, clientIp);
  });

  it("should work correctly for authenticated users", async () => {
    const clientIp = "1.2.3.4";
    const userId = 123;

    const ctx: TrpcContext = {
      user: { id: userId } as any,
      req: {
        ip: clientIp,
      } as any,
      res: {} as any,
    };

    const recordSpy = vi.spyOn(db, "recordAgeVerification");
    const updateSpy = vi.spyOn(db, "updateUserAgeVerification");
    const caller = appRouter.createCaller(ctx);

    await caller.ageVerification.verify({});

    expect(updateSpy).toHaveBeenCalledWith(userId);
    expect(recordSpy).toHaveBeenCalledWith(userId, clientIp);
  });
});
