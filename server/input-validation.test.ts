import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as chatDb from "./chat-db";
import * as db from "./db";

// Mock the chat-db and db modules
vi.mock("./chat-db", () => ({
  getOrCreateConversation: vi.fn(),
  getConversationById: vi.fn(),
  addChatMessage: vi.fn(),
}));

vi.mock("./db", () => ({
  getDb: vi.fn(),
  getProductsByIds: vi.fn(),
  getUserOrders: vi.fn(),
  getOrderById: vi.fn(),
  getUserAppointments: vi.fn(),
  getUserPreferences: vi.fn(),
  getUserNotifications: vi.fn(),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

type AuthenticatedUser = {
  id: number;
  openId: string;
  email: string;
  name: string;
  loginMethod: string;
  role: "user" | "admin";
  ageVerified: boolean;
  ageVerifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
};

function createAuthContext(userId: number, role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test-${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manual",
    role,
    ageVerified: true,
    ageVerifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: user as any,
    req: {
      protocol: "https",
      ip: "192.168.1.1",
      headers: {
        "x-forwarded-for": "192.168.1.1",
      },
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

describe("Input Validation Security", () => {
  const userCtx = createAuthContext(1, "user");
  const adminCtx = createAuthContext(2, "admin");
  const caller = appRouter.createCaller(userCtx);
  const adminCaller = appRouter.createCaller(adminCtx);

  describe("Chat Router Limits", () => {
    it("should reject a conversation subject longer than 255 characters", async () => {
      const longSubject = "a".repeat(256);
      try {
        await caller.chat.startConversation({ subject: longSubject });
        expect.fail("Should have rejected long subject");
      } catch (error: any) {
        expect(error.message).toContain("too_big");
      }
    });

    it("should reject a message longer than 5000 characters", async () => {
      const longMessage = "a".repeat(5001);
      try {
        await caller.chat.sendMessage({ conversationId: 1, message: longMessage });
        expect.fail("Should have rejected long message");
      } catch (error: any) {
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("Orders Router Limits", () => {
    it("should reject more than 20 items in an order", async () => {
      const items = Array.from({ length: 21 }, (_, i) => ({ productId: i, quantity: 1 }));
      try {
        await caller.orders.create({ items, fulfillmentType: "pickup" });
        expect.fail("Should have rejected too many items");
      } catch (error: any) {
        expect(error.message).toContain("too_big");
      }
    });

    it("should reject a delivery address longer than 1000 characters", async () => {
      const longAddress = "a".repeat(1001);
      try {
        await caller.orders.create({
          items: [{ productId: 1, quantity: 1 }],
          fulfillmentType: "delivery",
          deliveryAddress: longAddress
        });
        expect.fail("Should have rejected long address");
      } catch (error: any) {
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("Products Router Limits", () => {
    it("should reject more than 50 product IDs in getByIds", async () => {
      const ids = Array.from({ length: 51 }, (_, i) => i);
      try {
        await caller.products.getByIds({ ids });
        expect.fail("Should have rejected too many IDs");
      } catch (error: any) {
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("Appointments Router Limits", () => {
    it("should reject appointment notes longer than 1000 characters", async () => {
      const longNotes = "a".repeat(1001);
      try {
        await caller.appointments.create({
          appointmentTime: new Date(),
          consultationType: "initial_consultation",
          notes: longNotes
        });
        expect.fail("Should have rejected long notes");
      } catch (error: any) {
        expect(error.message).toContain("too_big");
      }
    });
  });

  describe("System Router Limits", () => {
    it("should reject a notification title longer than 255 characters", async () => {
      const longTitle = "a".repeat(256);
      try {
        await adminCaller.system.notifyOwner({ title: longTitle, content: "Test" });
        expect.fail("Should have rejected long title");
      } catch (error: any) {
        expect(error.message).toContain("too_big");
      }
    });

    it("should reject a notification content longer than 5000 characters", async () => {
      const longContent = "a".repeat(5001);
      try {
        await adminCaller.system.notifyOwner({ title: "Test", content: longContent });
        expect.fail("Should have rejected long content");
      } catch (error: any) {
        expect(error.message).toContain("too_big");
      }
    });
  });
});
