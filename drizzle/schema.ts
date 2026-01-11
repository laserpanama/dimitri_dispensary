import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with cannabis dispensary specific fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  ageVerified: boolean("ageVerified").default(false).notNull(),
  ageVerifiedAt: timestamp("ageVerifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table for cannabis dispensary inventory
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "flower",
    "edibles",
    "concentrates",
    "tinctures",
    "topicals",
    "accessories",
  ]).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull().default(0),
  thcLevel: decimal("thcLevel", { precision: 5, scale: 2 }), // percentage
  cbdLevel: decimal("cbdLevel", { precision: 5, scale: 2 }), // percentage
  strain: varchar("strain", { length: 255 }),
  effects: text("effects"), // JSON array of effects
  image: varchar("image", { length: 500 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table for tracking customer preorders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "completed",
    "cancelled",
  ]).default("pending").notNull(),
  fulfillmentType: mysqlEnum("fulfillmentType", ["pickup", "delivery"]).notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  estimatedReadyTime: timestamp("estimatedReadyTime"),
  actualReadyTime: timestamp("actualReadyTime"),
  deliveryAddress: text("deliveryAddress"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table for individual products in orders
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  priceAtPurchase: decimal("priceAtPurchase", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Appointments table for doctor consultations
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  appointmentNumber: varchar("appointmentNumber", { length: 50 }).notNull().unique(),
  doctorName: varchar("doctorName", { length: 255 }).notNull(),
  appointmentTime: timestamp("appointmentTime").notNull(),
  duration: int("duration").notNull(), // in minutes
  status: mysqlEnum("status", [
    "scheduled",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
  ]).default("scheduled").notNull(),
  notes: text("notes"),
  consultationType: mysqlEnum("consultationType", [
    "initial_consultation",
    "follow_up",
    "product_recommendation",
  ]).default("initial_consultation").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Blog posts table for auto-generated content
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: mysqlEnum("category", [
    "education",
    "strain_review",
    "industry_news",
    "wellness",
  ]).default("education").notNull(),
  author: varchar("author", { length: 255 }).default("Dimitri's Team").notNull(),
  featuredImage: varchar("featuredImage", { length: 500 }),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  generatedByAI: boolean("generatedByAI").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Notifications table for order and appointment updates
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "order_ready",
    "order_shipped",
    "appointment_reminder",
    "appointment_confirmed",
    "new_blog_post",
    "promotion",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  relatedOrderId: int("relatedOrderId"),
  relatedAppointmentId: int("relatedAppointmentId"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Age verification records for compliance
 */
export const ageVerifications = mysqlTable("ageVerifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  verifiedAt: timestamp("verifiedAt").defaultNow().notNull(),
  method: mysqlEnum("method", ["self_attestation", "id_verification"]).default("self_attestation").notNull(),
});

export type AgeVerification = typeof ageVerifications.$inferSelect;
export type InsertAgeVerification = typeof ageVerifications.$inferInsert;

/**
 * Saved preferences for customers
 */
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  favoriteProducts: text("favoriteProducts"), // JSON array of product IDs
  preferredFulfillmentType: mysqlEnum("preferredFulfillmentType", ["pickup", "delivery"]).default("pickup"),
  notificationPreferences: text("notificationPreferences"), // JSON object
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;
