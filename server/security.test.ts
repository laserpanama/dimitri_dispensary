import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as chatDb from "./chat-db";
import * as db from "./db";

// Mock the chat-db module
vi.mock("./chat-db", () => ({
  getOrCreateConversation: vi.fn(),
  getConversationMessages: vi.fn(),
  addChatMessage: vi.fn(),
  getUserConversations: vi.fn(),
  getActiveConversations: vi.fn(),
  assignConversationToAgent: vi.fn(),
  closeConversation: vi.fn(),
  getOnlineAgents: vi.fn(),
  updateAgentStatus: vi.fn(),
  markMessagesAsRead: vi.fn(),
  getConversationById: vi.fn(),
}));

// Mock the db module
vi.mock("./db", () => ({
  getDb: vi.fn(),
  getProductsByIds: vi.fn(),
}));

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
      setHeader: vi.fn(),
    } as any,
  };

  return { ctx };
}

describe("Security - Input Length Validation", () => {
  const { ctx } = createAuthContext(1);
  const caller = appRouter.createCaller(ctx);

  describe("Chat Router", () => {
    it("should reject a subject longer than 255 characters", async () => {
      const longSubject = "a".repeat(256);
      try {
        await caller.chat.startConversation({ subject: longSubject });
        expect.fail("Should have thrown error for long subject");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });

    it("should reject a message longer than 5000 characters", async () => {
      const longMessage = "a".repeat(5001);
      try {
        await caller.chat.sendMessage({ conversationId: 1, message: longMessage });
        expect.fail("Should have thrown error for long message");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("Orders Router", () => {
    it("should reject a delivery address longer than 1000 characters", async () => {
      const longAddress = "a".repeat(1001);
      try {
        await caller.orders.create({
          items: [{ productId: 1, quantity: 1 }],
          fulfillmentType: "delivery",
          deliveryAddress: longAddress,
        });
        expect.fail("Should have thrown error for long delivery address");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("Appointments Router", () => {
    it("should reject notes longer than 2000 characters", async () => {
      const longNotes = "a".repeat(2001);
      try {
        await caller.appointments.create({
          appointmentTime: new Date(),
          consultationType: "initial_consultation",
          notes: longNotes,
        });
        expect.fail("Should have thrown error for long notes");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("too_big");
      }
    });
  });
});
