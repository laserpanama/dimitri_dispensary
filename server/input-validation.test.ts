import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as dbModule from "./db";
import * as chatDbModule from "./chat-db";

// Mock the db modules
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db") as any;
  return {
    ...actual,
    getDb: vi.fn(),
    getProductsByIds: vi.fn(),
  };
});

vi.mock("./chat-db", async () => {
  const actual = await vi.importActual("./chat-db") as any;
  return {
    ...actual,
    getOrCreateConversation: vi.fn(),
    getConversationById: vi.fn(),
  };
});

function createAuthContext(role: "user" | "admin" = "user"): {
  ctx: TrpcContext;
} {
  const user = {
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
      ip: "192.168.1.1",
      headers: {
        "x-forwarded-for": "192.168.1.1",
      },
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };

  return { ctx };
}

describe("Input Validation Limits", () => {
  const { ctx } = createAuthContext();
  const caller = appRouter.createCaller(ctx);

  describe("Products.getByIds", () => {
    it("should reject more than 50 product IDs", async () => {
      const ids = Array.from({ length: 51 }, (_, i) => i + 1);
      try {
        await caller.products.getByIds({ ids });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("expected array to have <=50 items");
      }
    });
  });

  describe("Orders.create", () => {
    it("should reject more than 20 items in an order", async () => {
      const items = Array.from({ length: 21 }, (_, i) => ({
        productId: i + 1,
        quantity: 1,
      }));
      try {
        await caller.orders.create({ items, fulfillmentType: "pickup" });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("expected array to have <=20 items");
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
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("expected string to have <=1000 characters");
      }
    });
  });

  describe("Appointments.create", () => {
    it("should reject notes longer than 2000 characters", async () => {
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
        expect(error.message).toContain("expected string to have <=2000 characters");
      }
    });
  });

  describe("Chat.startConversation", () => {
    it("should reject subject longer than 255 characters", async () => {
      const subject = "a".repeat(256);
      try {
        await caller.chat.startConversation({ subject });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("expected string to have <=255 characters");
      }
    });
  });

  describe("Chat.sendMessage", () => {
    it("should reject message longer than 5000 characters", async () => {
      const message = "a".repeat(5001);
      try {
        await caller.chat.sendMessage({ conversationId: 1, message });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("expected string to have <=5000 characters");
      }
    });
  });
});
