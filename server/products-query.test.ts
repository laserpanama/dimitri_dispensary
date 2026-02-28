import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as dbModule from "./db";

// Mock the db module
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db") as any;
  return {
    ...actual,
    getProductsByIds: vi.fn(),
  };
});

function createContext(): { ctx: TrpcContext } {
  return {
    ctx: {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as any,
      res: {} as any,
    },
  };
}

describe("Products Router - getByIds", () => {
  it("should fetch multiple products by their IDs", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);

    const mockProducts = [
      { id: 1, name: "Product 1", price: "10.00" },
      { id: 3, name: "Product 3", price: "30.00" },
    ];

    vi.mocked(dbModule.getProductsByIds).mockResolvedValue(mockProducts as any);

    const result = await caller.products.getByIds({ ids: [1, 3] });

    expect(result).toEqual(mockProducts);
    expect(dbModule.getProductsByIds).toHaveBeenCalledWith([1, 3]);
  });

  it("should return an empty array if no IDs are provided", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(dbModule.getProductsByIds).mockResolvedValue([]);

    const result = await caller.products.getByIds({ ids: [] });

    expect(result).toEqual([]);
    expect(dbModule.getProductsByIds).toHaveBeenCalledWith([]);
  });
});
