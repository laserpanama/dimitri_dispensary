import { z } from "zod";
import { adminProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { products } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const productRouter = router({
  getAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return await db.select().from(products);
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.enum(["flower", "edibles", "concentrates", "tinctures", "topicals", "accessories"]),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/),
        quantity: z.number().int().min(0),
        thcLevel: z.string().optional(),
        cbdLevel: z.string().optional(),
        strain: z.string().optional(),
        effects: z.string().optional(),
        image: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db.insert(products).values({
        name: input.name,
        description: input.description ?? null,
        category: input.category,
        price: input.price,
        quantity: input.quantity,
        thcLevel: input.thcLevel ?? null,
        cbdLevel: input.cbdLevel ?? null,
        strain: input.strain ?? null,
        effects: input.effects ?? null,
        image: input.image ?? null,
        active: input.active ?? true,
      });

      return { id: (result as any).insertId };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        category: z.enum(["flower", "edibles", "concentrates", "tinctures", "topicals", "accessories"]).optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
        quantity: z.number().int().min(0).optional(),
        thcLevel: z.string().optional(),
        cbdLevel: z.string().optional(),
        strain: z.string().optional(),
        effects: z.string().optional(),
        image: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      const updateData: Record<string, unknown> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.price !== undefined) updateData.price = input.price;
      if (input.quantity !== undefined) updateData.quantity = input.quantity;
      if (input.thcLevel !== undefined) updateData.thcLevel = input.thcLevel;
      if (input.cbdLevel !== undefined) updateData.cbdLevel = input.cbdLevel;
      if (input.strain !== undefined) updateData.strain = input.strain;
      if (input.effects !== undefined) updateData.effects = input.effects;
      if (input.image !== undefined) updateData.image = input.image;
      if (input.active !== undefined) updateData.active = input.active;

      await db.update(products).set(updateData).where(eq(products.id, input.id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      if (existing.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
