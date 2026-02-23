import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  products,
  orders,
  orderItems,
  appointments,
  blogPosts,
  notifications,
  ageVerifications,
  userPreferences,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserAgeVerification(userId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(users)
    .set({ ageVerified: true, ageVerifiedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function recordAgeVerification(
  userId: number | null,
  ipAddress: string,
  method: "self_attestation" | "id_verification" = "self_attestation"
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(ageVerifications).values({
    userId,
    ipAddress,
    method,
  });
}

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Citrus Gummies",
    description: "Full spectrum citrus flavored gummies for daily wellness.",
    price: "45.00",
    category: "edibles",
    image: "/images/products/01_Gummies_FullSpectrum_Citrus.png",
    featured: true,
  },
  {
    id: 2,
    name: "Full Spectrum Softgels",
    description: "Easy-to-take 30mg softgels for consistent dosing.",
    price: "50.00",
    category: "edibles",
    image: "/images/products/10_Softgels_FullSpectrum_30mg.png",
    featured: true,
  },
  {
    id: 3,
    name: "CBD Tincture",
    description: "High-quality 30mg full spectrum tincture.",
    price: "25.00",
    category: "tinctures",
    image: "/images/products/13_Tincture_FullSpectrum_30mg.png",
    featured: false,
  },
  {
    id: 4,
    name: "Soothing Salve",
    description: "900mg full spectrum salve for topical application.",
    price: "35.00",
    category: "topicals",
    image: "/images/products/17_Salve_FullSpectrum_900mg.png",
    featured: false,
  },
];

export async function getProducts(category?: string) {
  const db = await getDb();
  if (!db) {
    if (category) {
      return MOCK_PRODUCTS.filter((p) => p.category === category);
    }
    return MOCK_PRODUCTS;
  }

  if (category) {
    return await db
      .select()
      .from(products)
      .where(eq(products.category, category as any));
  }
  return await db.select().from(products);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}

export async function getUserAppointments(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, userId));
}

export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId));
}

export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}
