import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as chatDb from "./chat-db";
import * as db from "./db";

// Mock the chat-db module
vi.mock("./chat-db", () => ({
  getOrCreateConversation: vi.fn(),
  getConversationById: vi.fn(),
  addChatMessage: vi.fn(),
}));

// Mock the db module
vi.mock("./db", () => ({
  getProductsByIds: vi.fn(),
  getDb: vi.fn(),
}));

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
    req: {} as any,
    res: {} as any,
  };
}

describe("Input Validation (DoS Protection)", () => {
  const ctx = createAuthContext(1);
  const caller = appRouter.createCaller(ctx);

  describe("Products", () => {
    it("should reject getByIds with more than 50 IDs", async () => {
      const ids = Array.from({ length: 51 }, (_, i) => i + 1);
      try {
        await caller.products.getByIds({ ids });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("Orders", () => {
    it("should reject order with more than 20 items", async () => {
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
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });

    it("should reject order with delivery address longer than 1000 characters", async () => {
      const deliveryAddress = "a".repeat(1001);
      try {
        await caller.orders.create({
          items: [{ productId: 1, quantity: 1 }],
          fulfillmentType: "delivery",
          deliveryAddress,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("Appointments", () => {
    it("should reject appointment with notes longer than 2000 characters", async () => {
      const notes = "a".repeat(2001);
      try {
        await caller.appointments.create({
          appointmentTime: new Date(),
          consultationType: "initial_consultation",
          notes,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("Chat", () => {
    it("should reject startConversation with subject longer than 255 characters", async () => {
      const subject = "a".repeat(256);
      try {
        await caller.chat.startConversation({ subject });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });

    it("should reject sendMessage with message longer than 5000 characters", async () => {
      const message = "a".repeat(5001);
      const conversationId = 123;

      vi.spyOn(chatDb, 'getConversationById').mockResolvedValue({
        id: conversationId,
        userId: 1,
        agentId: null,
        status: "waiting",
        subject: "Test",
        startedAt: new Date(),
        closedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        await caller.chat.sendMessage({ conversationId, message });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });
});
