import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as dbModule from "./db";
import * as chatDb from "./chat-db";

// Mock database modules
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db") as any;
  return {
    ...actual,
    getDb: vi.fn(),
    getProductsByIds: vi.fn(),
  };
});

vi.mock("./chat-db", () => ({
  getOrCreateConversation: vi.fn(),
  getConversationById: vi.fn(),
  addChatMessage: vi.fn(),
}));

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      role: "user",
      ageVerified: true,
      ageVerifiedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", ip: "127.0.0.1", headers: {} } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

describe("Input Validation Security", () => {
  const ctx = createAuthContext();
  const caller = appRouter.createCaller(ctx);

  describe("Chat Router", () => {
    it("should reject a conversation subject longer than 255 characters", async () => {
      const longSubject = "a".repeat(256);
      await expect(caller.chat.startConversation({ subject: longSubject }))
        .rejects.toThrow();
    });

    it("should reject a message longer than 5000 characters", async () => {
      const longMessage = "a".repeat(5001);
      await expect(caller.chat.sendMessage({ conversationId: 1, message: longMessage }))
        .rejects.toThrow();
    });
  });

  describe("Orders Router", () => {
    it("should reject a delivery address longer than 1000 characters", async () => {
      const longAddress = "a".repeat(1001);
      await expect(caller.orders.create({
        items: [{ productId: 1, quantity: 1 }],
        fulfillmentType: "delivery",
        deliveryAddress: longAddress
      })).rejects.toThrow();
    });
  });

  describe("Appointments Router", () => {
    it("should reject notes longer than 2000 characters", async () => {
      const longNotes = "a".repeat(2001);
      await expect(caller.appointments.create({
        appointmentTime: new Date(),
        consultationType: "initial_consultation",
        notes: longNotes
      })).rejects.toThrow();
    });
  });
});
