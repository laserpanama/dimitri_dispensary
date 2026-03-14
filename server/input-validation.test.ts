import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthContext(role: "user" | "admin" = "user"): {
  ctx: TrpcContext;
} {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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
      clearCookie: vi.fn(),
    } as any,
  };

  return { ctx };
}

describe("Input Validation Security", () => {
  it("should reject excessively long chat messages", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const longMessage = "a".repeat(5001);

    try {
      await caller.chat.sendMessage({ conversationId: 1, message: longMessage });
      expect.fail("Should have thrown Zod error");
    } catch (error: any) {
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject excessively long conversation subjects", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const longSubject = "a".repeat(256);

    try {
      await caller.chat.startConversation({ subject: longSubject });
      expect.fail("Should have thrown Zod error");
    } catch (error: any) {
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject too many items in an order", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const manyItems = Array(21).fill({ productId: 1, quantity: 1 });

    try {
      await caller.orders.create({ items: manyItems, fulfillmentType: "pickup" });
      expect.fail("Should have thrown Zod error");
    } catch (error: any) {
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject excessively long delivery address", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const longAddress = "a".repeat(1001);

    try {
      await caller.orders.create({
        items: [{ productId: 1, quantity: 1 }],
        fulfillmentType: "delivery",
        deliveryAddress: longAddress
      });
      expect.fail("Should have thrown Zod error");
    } catch (error: any) {
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject excessively long appointment notes", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const longNotes = "a".repeat(1001);

    try {
      await caller.appointments.create({
        appointmentTime: new Date(),
        consultationType: "initial_consultation",
        notes: longNotes
      });
      expect.fail("Should have thrown Zod error");
    } catch (error: any) {
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject too many product IDs in getByIds", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const manyIds = Array(51).fill(1);

    try {
      await caller.products.getByIds({ ids: manyIds });
      expect.fail("Should have thrown Zod error");
    } catch (error: any) {
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject excessively long system notification title", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);
    const longTitle = "a".repeat(256);

    try {
      await caller.system.notifyOwner({ title: longTitle, content: "test" });
      expect.fail("Should have thrown Zod error");
    } catch (error: any) {
      expect(error.message).toContain("too_big");
    }
  });

  it("should reject excessively long system notification content", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);
    const longContent = "a".repeat(5001);

    try {
      await caller.system.notifyOwner({ title: "test", content: longContent });
      expect.fail("Should have thrown Zod error");
    } catch (error: any) {
      expect(error.message).toContain("too_big");
    }
  });
});
