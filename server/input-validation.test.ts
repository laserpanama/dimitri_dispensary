import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number, role: "user" | "admin" = "user"): TrpcContext {
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

  return {
    user,
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

describe("Input Validation Security", () => {
  const userCtx = createAuthContext(1);
  const adminCtx = createAuthContext(2, "admin");
  const caller = appRouter.createCaller(userCtx);
  const adminCaller = appRouter.createCaller(adminCtx);

  describe("products.getByIds", () => {
    it("should reject more than 50 product IDs", async () => {
      const ids = Array.from({ length: 51 }, (_, i) => i + 1);
      try {
        await caller.products.getByIds({ ids });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });

    it("should accept up to 50 product IDs", async () => {
      // We don't need to mock the DB because the validation happens at the tRPC level
      // but let's just check if it fails with validation error or something else
      const ids = Array.from({ length: 50 }, (_, i) => i + 1);
      try {
        await caller.products.getByIds({ ids });
      } catch (error: any) {
        // It's okay if it fails due to DB not being available, as long as it's not a validation error
        expect(error.message).not.toContain("Too big");
      }
    });
  });

  describe("orders.create", () => {
    it("should reject more than 20 items", async () => {
      const items = Array.from({ length: 21 }, (_, i) => ({
        productId: i + 1,
        quantity: 1,
      }));
      try {
        await caller.orders.create({
          items,
          fulfillmentType: "pickup",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });

    it("should reject delivery address longer than 1000 characters", async () => {
      const deliveryAddress = "a".repeat(1001);
      try {
        await caller.orders.create({
          items: [{ productId: 1, quantity: 1 }],
          fulfillmentType: "delivery",
          deliveryAddress,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });

  describe("chat.startConversation", () => {
    it("should reject subject longer than 255 characters", async () => {
      const subject = "a".repeat(256);
      try {
        await caller.chat.startConversation({ subject });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });

  describe("chat.sendMessage", () => {
    it("should reject message longer than 5000 characters", async () => {
      const message = "a".repeat(5001);
      try {
        await caller.chat.sendMessage({ conversationId: 1, message });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });

  describe("system.notifyOwner", () => {
    it("should reject title longer than 255 characters", async () => {
      const title = "a".repeat(256);
      try {
        await adminCaller.system.notifyOwner({ title, content: "test" });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });

    it("should reject content longer than 5000 characters", async () => {
      const content = "a".repeat(5001);
      try {
        await adminCaller.system.notifyOwner({ title: "test", content });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Too big");
      }
    });
  });
});
