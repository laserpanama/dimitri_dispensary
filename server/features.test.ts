import { describe, expect, it, beforeEach } from "vitest";
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

describe("Age Verification", () => {
  it("should record age verification", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ageVerification.verify();

    expect(result).toEqual({ success: true });
  });

  it("should verify age for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ageVerification.verify({});

    expect(result).toEqual({ success: true });
  });
});

describe("Products", () => {
  it("should list all products", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list({});

    expect(Array.isArray(products)).toBe(true);
  });

  it("should filter products by category", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list({ category: "flower" });

    expect(Array.isArray(products)).toBe(true);
  });

  it("should throw error for non-existent product", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.products.getById({ id: 99999 });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
    }
  });
});

describe("Orders", () => {
  it("should require authentication to list orders", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.orders.list();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should list user orders when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const orders = await caller.orders.list();

    expect(Array.isArray(orders)).toBe(true);
  });

  it("should require authentication to create order", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.orders.create({
        items: [],
        fulfillmentType: "pickup",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("Appointments", () => {
  it("should require authentication to list appointments", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.appointments.list();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should list user appointments when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const appointments = await caller.appointments.list();

    expect(Array.isArray(appointments)).toBe(true);
  });

  it("should get available appointment slots", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const slots = await caller.appointments.getAvailableSlots({
      date: new Date(),
    });

    expect(Array.isArray(slots)).toBe(true);
    expect(slots.length).toBeGreaterThan(0);
  });

  it("should require authentication to create appointment", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.appointments.create({
        appointmentTime: new Date(),
        consultationType: "initial_consultation",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("Blog", () => {
  it("should list published blog posts", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const posts = await caller.blog.list();

    expect(Array.isArray(posts)).toBe(true);
  });

  it("should throw error for non-existent blog post", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.blog.getBySlug({ slug: "non-existent-post" });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
    }
  });
});

describe("Notifications", () => {
  it("should require authentication to list notifications", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.notifications.list();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should list user notifications when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const notifications = await caller.notifications.list();

    expect(Array.isArray(notifications)).toBe(true);
  });
});

describe("User Preferences", () => {
  it("should require authentication to get preferences", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.preferences.get();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should get user preferences when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const preferences = await caller.preferences.get();

    // Preferences may be undefined if not created yet
    expect(preferences === undefined || typeof preferences === "object").toBe(true);
  });
});

describe("Authentication", () => {
  it("should get current user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toEqual(ctx.user);
    expect(user?.email).toBe("test@example.com");
  });

  it("should return null for unauthenticated user", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeNull();
  });

  it("should logout user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
  });
});
