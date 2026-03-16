import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number, role: "user" | "admin" = "user"): {
  ctx: TrpcContext;
} {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test-${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role,
    ageVerified: true,
    ageVerifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      ip: "192.168.1.1",
      headers: {
        "x-forwarded-for": "192.168.1.1",
      },
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };

  return { ctx };
}

describe("Input Validation Security", () => {
  it("should reject oversized subject in startConversation", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);
    const longSubject = "a".repeat(256);

    try {
      await caller.chat.startConversation({ subject: longSubject });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject oversized message in sendMessage", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);
    const longMessage = "a".repeat(5001);

    try {
      await caller.chat.sendMessage({ conversationId: 1, message: longMessage });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject too many items in orders.create", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);
    const tooManyItems = Array(21).fill({ productId: 1, quantity: 1 });

    try {
      await caller.orders.create({
        items: tooManyItems,
        fulfillmentType: "pickup"
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject oversized delivery address in orders.create", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);
    const longAddress = "a".repeat(1001);

    try {
      await caller.orders.create({
        items: [{ productId: 1, quantity: 1 }],
        fulfillmentType: "delivery",
        deliveryAddress: longAddress
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject oversized notes in appointments.create", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);
    const longNotes = "a".repeat(1001);

    try {
      await caller.appointments.create({
        appointmentTime: new Date(),
        consultationType: "initial_consultation",
        notes: longNotes
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject oversized title in notifyOwner", async () => {
    const { ctx } = createAuthContext(1, "admin");
    const caller = appRouter.createCaller(ctx);
    const longTitle = "a".repeat(256);

    try {
      await caller.system.notifyOwner({
        title: longTitle,
        content: "Valid content"
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject too many IDs in products.getByIds", async () => {
    const { ctx } = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);
    const tooManyIds = Array(51).fill(1);

    try {
      await caller.products.getByIds({ ids: tooManyIds });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("too_big");
    }
  });
});
