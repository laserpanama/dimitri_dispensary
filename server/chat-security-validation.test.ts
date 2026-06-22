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

describe("Chat Security Validation (Fixed)", () => {
  it("should reject messages exceeding 5000 characters", async () => {
    const { ctx } = createAuthContext(1);
    const conversationId = 123;
    const longMessage = "a".repeat(5001);

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.sendMessage({ conversationId, message: longMessage });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      if (error.name === 'AssertionError') throw error;
      expect(error.message).toContain("5000 character");
    }
  });

  it("should reject subjects exceeding 255 characters", async () => {
    const { ctx } = createAuthContext(1);
    const longSubject = "s".repeat(256);

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.startConversation({ subject: longSubject });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      if (error.name === 'AssertionError') throw error;
      expect(error.message).toContain("255 character");
    }
  });

  it("should reject negative or zero IDs in assignToAgent", async () => {
    const { ctx } = createAuthContext(1, "admin");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.assignToAgent({ conversationId: -1, agentId: 0 });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      if (error.name === 'AssertionError') throw error;
      expect(error.message).toContain(">0");
    }
  });
});
