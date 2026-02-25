import { SpaceBlock } from "@src/blocks/SpaceBlock";
import { getDb } from "@src/db/orm";
import { t } from "@src/trpc/base";
import { TRPCError } from "@trpc/server";
import { asc, count, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

import { type Product, products } from "./Product.entity";

const productColumns = getTableColumns(products);
const productFields = Object.keys(productColumns) as [keyof Product & string, ...(keyof Product & string)[]];

export const productInput = z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    price: z.number().nullable().optional(),
    type: z.enum(["cap", "shirt", "tie"]),
    additionalTypes: z.array(z.enum(["cap", "shirt", "tie"])).default([]),
    inStock: z.boolean().default(false),
    status: z.enum(["Published", "Unpublished"]).default("Unpublished"),
    space: SpaceBlock.schema,
});

export type ProductInput = z.infer<typeof productInput>;

const productOutputSchema = z.custom<Product>().transform(async (p) => ({
    ...p,
    space: await SpaceBlock.toOutput(p.space),
}));

const listOutputSchema = z.object({
    nodes: z.array(productOutputSchema),
    totalCount: z.number(),
});

export const trpcRouter = t.router({
    list: t.procedure
        .output(listOutputSchema)
        .input(
            z.object({
                offset: z.number(),
                limit: z.number(),
                sort: z.object({
                    field: z.enum(productFields),
                    direction: z.enum(["ASC", "DESC"]),
                }),
            }),
        )
        .query(async ({ input }) => {
            const db = getDb();
            const col = productColumns[input.sort.field];
            const orderExpr = input.sort.direction === "ASC" ? asc(col) : desc(col);
            const [nodes, [{ totalCount }]] = await Promise.all([
                db.select().from(products).orderBy(orderExpr).offset(input.offset).limit(input.limit),
                db.select({ totalCount: count() }).from(products),
            ]);
            return { nodes, totalCount };
        }),

    getById: t.procedure
        .output(productOutputSchema)
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const db = getDb();
            const [product] = await db.select().from(products).where(eq(products.id, input.id));
            if (!product) throw new TRPCError({ code: "NOT_FOUND" });
            return product;
        }),

    create: t.procedure
        .output(productOutputSchema)
        .input(productInput)
        .mutation(async ({ input }) => {
            const db = getDb();
            const now = new Date();
            const [created] = await db
                .insert(products)
                .values({
                    id: crypto.randomUUID(),
                    title: input.title,
                    slug: input.slug,
                    description: input.description ?? null,
                    price: input.price ?? null,
                    type: input.type,
                    additionalTypes: input.additionalTypes,
                    inStock: input.inStock,
                    status: input.status,
                    space: input.space,
                    createdAt: now,
                    updatedAt: now,
                })
                .returning();
            return created;
        }),

    update: t.procedure
        .output(productOutputSchema)
        .input(z.object({ id: z.string(), input: productInput }))
        .mutation(async ({ input }) => {
            const db = getDb();
            const [updated] = await db
                .update(products)
                .set({
                    title: input.input.title,
                    slug: input.input.slug,
                    description: input.input.description ?? null,
                    price: input.input.price ?? null,
                    type: input.input.type,
                    additionalTypes: input.input.additionalTypes,
                    inStock: input.input.inStock,
                    status: input.input.status,
                    space: input.input.space,
                    updatedAt: new Date(),
                })
                .where(eq(products.id, input.id))
                .returning();
            if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
            return updated;
        }),

    delete: t.procedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
        const db = getDb();
        await db.delete(products).where(eq(products.id, input.id));
        return true;
    }),
});
