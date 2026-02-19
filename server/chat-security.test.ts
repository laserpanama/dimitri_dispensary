import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as chatDb from "./chat-db";

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

describe("Chat Security (IDOR)", () => {
  it("should prevent a user from reading another user's conversation messages", async () => {
    const user2Ctx = createAuthContext(2).ctx;

    const conversationId = 123;

    // Mock that conversation 123 belongs to user 1
    vi.spyOn(chatDb, 'getConversationById').mockResolvedValue({
      id: conversationId,
      userId: 1,
      agentId: null,
      status: "waiting",
      subject: "Secret",
      startedAt: new Date(),
      closedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.spyOn(chatDb, 'getConversationMessages').mockResolvedValue([
      { id: 1, conversationId, senderId: 1, senderType: "customer", message: "Secret message", createdAt: new Date(), isRead: false }
    ]);

    const caller2 = appRouter.createCaller(user2Ctx);

    try {
      await caller2.chat.getMessages({ conversationId });
      // If it reaches here, it's vulnerable (because it didn't throw)
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      if (error.name === 'AssertionError') throw error;
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should prevent a user from sending a message to another user's conversation", async () => {
    const user2Ctx = createAuthContext(2).ctx;
    const conversationId = 123;

    vi.spyOn(chatDb, 'getConversationById').mockResolvedValue({
      id: conversationId,
      userId: 1,
      agentId: null,
      status: "waiting",
      subject: "Secret",
      startedAt: new Date(),
      closedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const caller2 = appRouter.createCaller(user2Ctx);

    try {
      await caller2.chat.sendMessage({ conversationId, message: "Evil message" });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      if (error.name === 'AssertionError') throw error;
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
