import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthContext(userId: number, role: "user" | "admin" = "user"): {
  ctx: TrpcContext;
} {
  return {
    ctx: {
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
      req: { ip: "127.0.0.1" } as any,
      res: {} as any,
    }
  };
}

describe("Input Validation (DoS prevention)", () => {
  const { ctx: userCtx } = createAuthContext(1);
  const { ctx: adminCtx } = createAuthContext(2, "admin");
  const userCaller = appRouter.createCaller(userCtx);
  const adminCaller = appRouter.createCaller(adminCtx);

  describe("chatRouter", () => {
    it("should reject a subject longer than 255 chars in startConversation", async () => {
      const longSubject = "a".repeat(256);
      try {
        await userCaller.chat.startConversation({ subject: longSubject });
        expect.fail("Should have thrown Zod error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });

    it("should reject a message longer than 5000 chars in sendMessage", async () => {
      const longMessage = "a".repeat(5001);
      try {
        await userCaller.chat.sendMessage({ conversationId: 1, message: longMessage });
        expect.fail("Should have thrown Zod error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });

  describe("productsRouter", () => {
    it("should reject more than 50 ids in getByIds", async () => {
      const manyIds = Array.from({ length: 51 }, (_, i) => i + 1);
      try {
        await userCaller.products.getByIds({ ids: manyIds });
        expect.fail("Should have thrown Zod error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });

  describe("ordersRouter", () => {
    it("should reject more than 20 items in orders.create", async () => {
      const manyItems = Array.from({ length: 21 }, (_, i) => ({
        productId: i + 1,
        quantity: 1
      }));
      try {
        await userCaller.orders.create({
          items: manyItems,
          fulfillmentType: "pickup"
        });
        expect.fail("Should have thrown Zod error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });

    it("should reject a deliveryAddress longer than 1000 chars in orders.create", async () => {
      const longAddress = "a".repeat(1001);
      try {
        await userCaller.orders.create({
          items: [{ productId: 1, quantity: 1 }],
          fulfillmentType: "delivery",
          deliveryAddress: longAddress
        });
        expect.fail("Should have thrown Zod error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });

  describe("appointmentsRouter", () => {
    it("should reject notes longer than 1000 chars in appointments.create", async () => {
      const longNotes = "a".repeat(1001);
      try {
        await userCaller.appointments.create({
          appointmentTime: new Date(),
          consultationType: "initial_consultation",
          notes: longNotes
        });
        expect.fail("Should have thrown Zod error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });

  describe("systemRouter", () => {
    it("should reject a title longer than 255 chars in notifyOwner", async () => {
      const longTitle = "a".repeat(256);
      try {
        await adminCaller.system.notifyOwner({
          title: longTitle,
          content: "Valid content"
        });
        expect.fail("Should have thrown Zod error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });

    it("should reject content longer than 5000 chars in notifyOwner", async () => {
      const longContent = "a".repeat(5001);
      try {
        await adminCaller.system.notifyOwner({
          title: "Valid title",
          content: longContent
        });
        expect.fail("Should have thrown Zod error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });
});
