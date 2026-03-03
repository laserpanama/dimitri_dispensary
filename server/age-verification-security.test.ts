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

function createContext(ip: string): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "http",
      ip: ip,
      headers: {
        "x-forwarded-for": ip,
      },
    } as any,
    res: {} as any,
  };
}

describe("Age Verification Security", () => {
  it("should NOT be vulnerable to IP spoofing via input (FIXED BEHAVIOR)", async () => {
    const realIp = "1.2.3.4";
    const spoofedIp = "8.8.8.8";
    const ctx = createContext(realIp);
    const caller = appRouter.createCaller(ctx);

    const recordSpy = vi.spyOn(db, 'recordAgeVerification').mockResolvedValue(undefined);

    // Call verify - input no longer accepts ipAddress.
    // We pass it anyway to ensure it's ignored or doesn't cause issues.
    // @ts-ignore
    await caller.ageVerification.verify({ ipAddress: spoofedIp });

    // Verify it used the real IP from context, not any spoofed input
    expect(recordSpy).toHaveBeenCalledWith(null, realIp);
  });
});
