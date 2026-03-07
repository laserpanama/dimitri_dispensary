import { describe, expect, it, vi } from "vitest";
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
  getUserOrders: vi.fn(),
  getOrderById: vi.fn(),
  getOrderItems: vi.fn(),
  getUserAppointments: vi.fn(),
  getPublishedBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  getUserNotifications: vi.fn(),
  getUserPreferences: vi.fn(),
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
    } as any,
  };

  return { ctx };
}

describe("Input Validation Security", () => {
  const { ctx } = createAuthContext(1);
  const caller = appRouter.createCaller(ctx);

  describe("Chat Router", () => {
    it("should reject startConversation with subject > 255 chars", async () => {
      const longSubject = "a".repeat(256);
      try {
        await caller.chat.startConversation({ subject: longSubject });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.name).toBe("TRPCError");
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should reject sendMessage with message > 5000 chars", async () => {
      const longMessage = "a".repeat(5001);
      try {
        await caller.chat.sendMessage({ conversationId: 1, message: longMessage });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.name).toBe("TRPCError");
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("Orders Router", () => {
    it("should reject order creation with deliveryAddress > 1000 chars", async () => {
      const longAddress = "a".repeat(1001);
      try {
        await caller.orders.create({
          items: [{ productId: 1, quantity: 1 }],
          fulfillmentType: "delivery",
          deliveryAddress: longAddress,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.name).toBe("TRPCError");
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("Appointments Router", () => {
    it("should reject appointment creation with notes > 2000 chars", async () => {
      const longNotes = "a".repeat(2001);
      try {
        await caller.appointments.create({
          appointmentTime: new Date(),
          consultationType: "initial_consultation",
          notes: longNotes,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.name).toBe("TRPCError");
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });
});
