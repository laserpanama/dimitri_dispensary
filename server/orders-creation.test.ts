import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as dbModule from "./db";

// Mock the entire db module
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db") as any;
  return {
    ...actual,
    getDb: vi.fn(),
    getProductsByIds: vi.fn(),
    getProductById: vi.fn(),
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

describe("Order Creation Optimization", () => {
  it("should create an order with multiple items correctly", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const mockProducts = [
      { id: 1, name: "Product 1", price: "10.00", quantity: 100 },
      { id: 2, name: "Product 2", price: "20.00", quantity: 50 },
    ];

    const mockDb = {
      transaction: vi.fn().mockImplementation(async (callback) => {
        return await callback(mockDb);
      }),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockImplementation((val) => {
        if (val.orderNumber) {
           return { insertId: 123 };
        }
        return { insertId: 456 };
      }),
    };

    vi.mocked(dbModule.getDb).mockResolvedValue(mockDb as any);
    vi.mocked(dbModule.getProductsByIds).mockResolvedValue(mockProducts as any);

    const result = await caller.orders.create({
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
      fulfillmentType: "pickup",
    });

    expect(result).toHaveProperty("orderId", 123);
    expect(result).toHaveProperty("orderNumber");
    expect(dbModule.getProductsByIds).toHaveBeenCalledWith([1, 2]);
    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalledTimes(2); // One for orders, one for orderItems (bulk)
  });

  it("should throw error if product is not found", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(dbModule.getDb).mockResolvedValue({} as any);
    vi.mocked(dbModule.getProductsByIds).mockResolvedValue([{ id: 1, name: "Product 1", price: "10.00", quantity: 100 }] as any);

    await expect(caller.orders.create({
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }, // Product 2 not in mock
      ],
      fulfillmentType: "pickup",
    })).rejects.toThrow("Product 2 not found");
  });

  it("should throw error if stock is insufficient", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(dbModule.getDb).mockResolvedValue({} as any);
    vi.mocked(dbModule.getProductsByIds).mockResolvedValue([{ id: 1, name: "Product 1", price: "10.00", quantity: 1 }] as any);

    await expect(caller.orders.create({
      items: [
        { productId: 1, quantity: 2 },
      ],
      fulfillmentType: "pickup",
    })).rejects.toThrow("Insufficient stock for Product 1");
  });
});
