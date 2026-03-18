import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthContext(userId: number, role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
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
    },
    req: {
      protocol: "https",
      ip: "127.0.0.1",
      headers: {},
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };
}

describe("Input Validation (DoS prevention)", () => {
  const userCtx = createAuthContext(1);
  const adminCtx = createAuthContext(99, "admin");
  const caller = appRouter.createCaller(userCtx);
  const adminCaller = appRouter.createCaller(adminCtx);

  it("should enforce length limit on chat subject", async () => {
    const longSubject = "a".repeat(256);
    try {
      await caller.chat.startConversation({ subject: longSubject });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Too big");
    }
  });

  it("should enforce length limit on chat message", async () => {
    const longMessage = "a".repeat(5001);
    try {
      await caller.chat.sendMessage({ conversationId: 1, message: longMessage });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Too big");
    }
  });

  it("should enforce count limit on products.getByIds", async () => {
    const manyIds = Array.from({ length: 51 }, (_, i) => i + 1);
    try {
      await caller.products.getByIds({ ids: manyIds });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Too big");
    }
  });

  it("should enforce count limit on order items", async () => {
    const manyItems = Array.from({ length: 21 }, (_, i) => ({
      productId: i + 1,
      quantity: 1,
    }));
    try {
      await caller.orders.create({
        items: manyItems,
        fulfillmentType: "pickup",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Too big");
    }
  });

  it("should enforce length limit on delivery address", async () => {
    const longAddress = "a".repeat(1001);
    try {
      await caller.orders.create({
        items: [{ productId: 1, quantity: 1 }],
        fulfillmentType: "delivery",
        deliveryAddress: longAddress,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Too big");
    }
  });

  it("should enforce length limit on appointment notes", async () => {
    const longNotes = "a".repeat(1001);
    try {
      await caller.appointments.create({
        appointmentTime: new Date(),
        consultationType: "initial_consultation",
        notes: longNotes,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Too big");
    }
  });

  it("should enforce limits on system notifyOwner (admin only)", async () => {
    const longTitle = "a".repeat(256);
    const longContent = "a".repeat(5001);

    try {
      await adminCaller.system.notifyOwner({ title: longTitle, content: "Short" });
      expect.fail("Should have thrown validation error for title");
    } catch (error: any) {
      expect(error.message).toContain("Too big");
    }

    try {
      await adminCaller.system.notifyOwner({ title: "Short", content: longContent });
      expect.fail("Should have thrown validation error for content");
    } catch (error: any) {
      expect(error.message).toContain("Too big");
    }
  });
});
