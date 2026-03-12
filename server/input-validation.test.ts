import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthContext(userId: number, role: "user" | "admin" = "user"): {
  ctx: TrpcContext;
} {
  const ctx: TrpcContext = {
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
      ip: "192.168.1.1",
      headers: {},
    } as any,
    res: {} as any,
  };

  return { ctx };
}

describe("Input Validation Limits", () => {
  const { ctx: userCtx } = createAuthContext(1, "user");
  const { ctx: adminCtx } = createAuthContext(2, "admin");
  const userCaller = appRouter.createCaller(userCtx);
  const adminCaller = appRouter.createCaller(adminCtx);

  describe("chat.startConversation", () => {
    it("should fail when subject exceeds 255 characters", async () => {
      const longSubject = "a".repeat(256);
      try {
        await userCaller.chat.startConversation({ subject: longSubject });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("chat.sendMessage", () => {
    it("should fail when message exceeds 5000 characters", async () => {
      const longMessage = "a".repeat(5001);
      try {
        await userCaller.chat.sendMessage({ conversationId: 1, message: longMessage });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("products.getByIds", () => {
    it("should fail when ids array exceeds 50 items", async () => {
      const manyIds = Array.from({ length: 51 }, (_, i) => i + 1);
      try {
        await userCaller.products.getByIds({ ids: manyIds });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("orders.create", () => {
    it("should fail when items array exceeds 20 items", async () => {
      const manyItems = Array.from({ length: 21 }, (_, i) => ({
        productId: i + 1,
        quantity: 1,
      }));
      try {
        await userCaller.orders.create({
          items: manyItems,
          fulfillmentType: "pickup",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });

    it("should fail when deliveryAddress exceeds 1000 characters", async () => {
      const longAddress = "a".repeat(1001);
      try {
        await userCaller.orders.create({
          items: [{ productId: 1, quantity: 1 }],
          fulfillmentType: "delivery",
          deliveryAddress: longAddress,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("appointments.create", () => {
    it("should fail when notes exceed 1000 characters", async () => {
      const longNotes = "a".repeat(1001);
      try {
        await userCaller.appointments.create({
          appointmentTime: new Date(),
          consultationType: "initial_consultation",
          notes: longNotes,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("system.notifyOwner", () => {
    it("should fail when title exceeds 255 characters", async () => {
      const longTitle = "a".repeat(256);
      try {
        await adminCaller.system.notifyOwner({
          title: longTitle,
          content: "Valid content",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });

    it("should fail when content exceeds 5000 characters", async () => {
      const longContent = "a".repeat(5001);
      try {
        await adminCaller.system.notifyOwner({
          title: "Valid title",
          content: longContent,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });
});
