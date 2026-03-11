import { describe, expect, it, vi } from "vitest";
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

describe("Input Validation (DoS Prevention)", () => {
  const { ctx } = createAuthContext(1);
  const caller = appRouter.createCaller(ctx);

  it("should reject products.getByIds with more than 50 IDs", async () => {
    const ids = Array.from({ length: 51 }, (_, i) => i + 1);
    try {
      await caller.products.getByIds({ ids });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.name).toBe("TRPCError");
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("expected array to have <=50 items");
    }
  });

  it("should reject orders.create with more than 20 items", async () => {
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
      expect(error.name).toBe("TRPCError");
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("expected array to have <=20 items");
    }
  });

  it("should reject orders.create with deliveryAddress longer than 1000 characters", async () => {
    const deliveryAddress = "a".repeat(1001);
    try {
      await caller.orders.create({
        items: [{ productId: 1, quantity: 1 }],
        fulfillmentType: "delivery",
        deliveryAddress,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.name).toBe("TRPCError");
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("expected string to have <=1000 characters");
    }
  });

  it("should reject appointments.create with notes longer than 2000 characters", async () => {
    const notes = "a".repeat(2001);
    try {
      await caller.appointments.create({
        appointmentTime: new Date(),
        consultationType: "initial_consultation",
        notes,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.name).toBe("TRPCError");
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("expected string to have <=2000 characters");
    }
  });

  it("should reject chat.startConversation with subject longer than 255 characters", async () => {
    const subject = "a".repeat(256);
    try {
      await caller.chat.startConversation({ subject });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.name).toBe("TRPCError");
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("expected string to have <=255 characters");
    }
  });

  it("should reject chat.sendMessage with message longer than 5000 characters", async () => {
    const message = "a".repeat(5001);
    try {
      await caller.chat.sendMessage({ conversationId: 1, message });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.name).toBe("TRPCError");
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("expected string to have <=5000 characters");
    }
  });
});
