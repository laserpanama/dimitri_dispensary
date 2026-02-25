import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { chatRouter } from "./chat-router";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  recordAgeVerification,
  updateUserAgeVerification,
  getProducts,
  getProductById,
  getProductsByIds,
  getUserOrders,
  getOrderById,
  getOrderItems,
  getUserAppointments,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getUserNotifications,
  getUserPreferences,
  getDb,
} from "./db";
import { orders, orderItems, appointments, blogPosts, notifications } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  chat: chatRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Age Verification
  ageVerification: router({
    verify: publicProcedure
      .mutation(async ({ ctx }) => {
        // 🛡️ Sentinel: Secure IP resolution to prevent spoofing.
        // Relies on Express 'trust proxy' setting configured in index.ts
        const ipAddress = ctx.req.ip || "unknown";

        if (ctx.user) {
          await updateUserAgeVerification(ctx.user.id);
        }

        await recordAgeVerification(ctx.user?.id || null, ipAddress);

        return { success: true };
      }),
  }),

  // Products
  products: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await getProducts(input?.category);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        }
        return product;
      }),
  }),

  // Orders
  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserOrders(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await getOrderById(input.id);
        if (!order || order.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        }
        return order;
      }),

    getItems: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await getOrderById(input.orderId);
        if (!order || order.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return await getOrderItems(input.orderId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number().min(1),
            })
          ),
          fulfillmentType: z.enum(["pickup", "delivery"]),
          deliveryAddress: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        // Optimization: Fetch all products in a single query
        const productIds = input.items.map((i) => i.productId);
        const allProducts = await getProductsByIds(productIds);
        const productMap = new Map(allProducts.map((p) => [p.id, p]));

        let totalPrice = 0;
        const itemsToInsert: any[] = [];

        // Validate all products and calculate total price
        for (const item of input.items) {
          const product = productMap.get(item.productId);
          if (!product) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Product ${item.productId} not found`,
            });
          }
          if (product.quantity < item.quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Insufficient stock for ${product.name}`,
            });
          }

          const itemTotal = parseFloat(product.price) * item.quantity;
          totalPrice += itemTotal;
          itemsToInsert.push({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: product.price,
          });
        }

        const orderNumber = `ORD-${Date.now()}`;
        const estimatedReadyTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

        // Use a transaction for atomicity and better performance
        return await db.transaction(async (tx) => {
          const result = await tx.insert(orders).values({
            userId: ctx.user.id,
            orderNumber,
            status: "pending",
            fulfillmentType: input.fulfillmentType,
            totalPrice: totalPrice.toString(),
            estimatedReadyTime,
            deliveryAddress: input.deliveryAddress,
          });

          const orderId = (result as any).insertId;

          // Optimization: Bulk insert all order items in a single query
          if (itemsToInsert.length > 0) {
            await tx.insert(orderItems).values(
              itemsToInsert.map((item) => ({
                ...item,
                orderId: orderId as number,
              }))
            );
          }

          return { orderId, orderNumber, estimatedReadyTime };
        });
      }),
  }),

  // Appointments
  appointments: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserAppointments(ctx.user.id);
    }),

    getAvailableSlots: publicProcedure
      .input(z.object({ date: z.date() }))
      .query(async () => {
        // Return sample available time slots
        const slots = [];
        const baseDate = new Date();
        baseDate.setHours(10, 0, 0, 0);

        for (let i = 0; i < 8; i++) {
          slots.push(new Date(baseDate.getTime() + i * 60 * 60 * 1000));
        }

        return slots;
      }),

    create: protectedProcedure
      .input(
        z.object({
          appointmentTime: z.date(),
          consultationType: z.enum(["initial_consultation", "follow_up", "product_recommendation"]),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const appointmentNumber = `APT-${Date.now()}`;

        const result = await db.insert(appointments).values({
          userId: ctx.user.id,
          appointmentNumber,
          doctorName: "Dr. Cannabis Specialist",
          appointmentTime: input.appointmentTime,
          duration: 30,
          status: "scheduled",
          consultationType: input.consultationType,
          notes: input.notes,
        });

        return {
          appointmentId: (result as any).insertId,
          appointmentNumber,
          appointmentTime: input.appointmentTime,
        };
      }),
  }),

  // Blog
  blog: router({
    list: publicProcedure.query(async () => {
      return await getPublishedBlogPosts();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getBlogPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Blog post not found" });
        }
        return post;
      }),
  }),

  // Notifications
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserNotifications(ctx.user.id);
    }),
  }),

  // User Preferences
  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await getUserPreferences(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
