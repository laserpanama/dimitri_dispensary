import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): {
  ctx: TrpcContext;
} {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {
        "x-forwarded-for": "192.168.1.1",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Chat Feature", () => {
  it("should require authentication to start conversation", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.startConversation({ subject: "Help" });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should start conversation when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const conversation = await caller.chat.startConversation({
      subject: "Product Help",
    });

    expect(conversation).toBeDefined();
    expect(conversation.userId).toBe(ctx.user.id);
    expect(conversation.status).toBe("waiting");
    expect(conversation.subject).toBe("Product Help");
    expect(conversation.id).toBeDefined();
  });

  it("should get user conversations", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const conversations = await caller.chat.getConversations();

    expect(Array.isArray(conversations)).toBe(true);
  });

  it("should require authentication to send message", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.sendMessage({
        conversationId: 1,
        message: "Hello",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should send message when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a conversation
    const conversation = await caller.chat.startConversation({
      subject: "Test",
    });

    expect(conversation.id).toBeDefined();

    // Then send a message
    const result = await caller.chat.sendMessage({
      conversationId: conversation.id,
      message: "Hello, I need help",
    });

    expect(result.messageId).toBeDefined();
  });

  it("should get messages from conversation", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create conversation
    const conversation = await caller.chat.startConversation({
      subject: "Test",
    });

    expect(conversation.id).toBeDefined();

    // Send message
    await caller.chat.sendMessage({
      conversationId: conversation.id,
      message: "Test message",
    });

    // Get messages
    const messages = await caller.chat.getMessages({
      conversationId: conversation.id,
    });

    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
  });

  it("should get online agents", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const agents = await caller.chat.getOnlineAgents();

    expect(Array.isArray(agents)).toBe(true);
  });

  it("should require admin to get active conversations", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.getActiveConversations();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("should allow admin to get active conversations", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const conversations = await caller.chat.getActiveConversations();

    expect(Array.isArray(conversations)).toBe(true);
  });

  it("should require authentication to close conversation", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.closeConversation({ conversationId: 1 });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should close conversation when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create conversation
    const conversation = await caller.chat.startConversation({
      subject: "Test",
    });

    expect(conversation.id).toBeDefined();

    // Close it
    const result = await caller.chat.closeConversation({
      conversationId: conversation.id,
    });

    expect(result.success).toBe(true);
  });

  it("should mark messages as read", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create conversation
    const conversation = await caller.chat.startConversation({
      subject: "Test",
    });

    expect(conversation.id).toBeDefined();

    // Send message
    await caller.chat.sendMessage({
      conversationId: conversation.id,
      message: "Test",
    });

    // Mark as read
    const result = await caller.chat.markAsRead({
      conversationId: conversation.id,
    });

    expect(result.success).toBe(true);
  });

  it("should update agent status", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.updateAgentStatus({
      status: "online",
    });

    expect(result.success).toBe(true);
  });
});
