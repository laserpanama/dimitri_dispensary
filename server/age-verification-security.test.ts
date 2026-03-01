import { describe, expect, it, vi, beforeEach } from "vitest";
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

describe("Age Verification Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should use the IP address from the request context and ignore any input", async () => {
    const mockIp = "123.123.123.123";
    const ctx: TrpcContext = {
      user: null,
      req: {
        ip: mockIp,
        headers: {},
      } as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(ctx);

    // The mutation now takes no input
    await caller.ageVerification.verify();

    expect(db.recordAgeVerification).toHaveBeenCalledWith(null, mockIp);
  });

  it("should update user age verification if authenticated", async () => {
    const mockIp = "1.1.1.1";
    const userId = 42;
    const ctx: TrpcContext = {
      user: { id: userId } as any,
      req: {
        ip: mockIp,
        headers: {},
      } as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(ctx);
    await caller.ageVerification.verify();

    expect(db.updateUserAgeVerification).toHaveBeenCalledWith(userId);
    expect(db.recordAgeVerification).toHaveBeenCalledWith(userId, mockIp);
  });
});
