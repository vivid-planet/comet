import { getDb } from "@src/db/orm";
import { t } from "@src/trpc/base";
import { TRPCError } from "@trpc/server";
import { asc, count, desc, eq, getTableColumns, max } from "drizzle-orm";
import { z } from "zod";

import { productCategories, type ProductCategory } from "./ProductCategory.entity";

const productCategoryColumns = getTableColumns(productCategories);
const productCategoryFields = Object.keys(productCategoryColumns) as [keyof ProductCategory & string, ...(keyof ProductCategory & string)[]];

const productCategoryInput = z.object({
    title: z.string(),
    slug: z.string(),
});

export const trpcRouter = t.router({
    list: t.procedure
        .input(
            z.object({
                offset: z.number(),
                limit: z.number(),
                sort: z.object({
                    field: z.enum(productCategoryFields),
                    direction: z.enum(["ASC", "DESC"]),
                }),
            }),
        )
        .query(async ({ input }) => {
            const db = getDb();
            const col = productCategoryColumns[input.sort.field];
            const orderExpr = input.sort.direction === "ASC" ? asc(col) : desc(col);
            const [nodes, [{ totalCount }]] = await Promise.all([
                db.select().from(productCategories).orderBy(orderExpr).offset(input.offset).limit(input.limit),
                db.select({ totalCount: count() }).from(productCategories),
            ]);
            return { nodes, totalCount };
        }),

    getById: t.procedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const db = getDb();
        const [category] = await db.select().from(productCategories).where(eq(productCategories.id, input.id));
        if (!category) throw new TRPCError({ code: "NOT_FOUND" });
        return category;
    }),

    create: t.procedure.input(productCategoryInput).mutation(async ({ input }) => {
        const db = getDb();
        const [{ maxPosition }] = await db.select({ maxPosition: max(productCategories.position) }).from(productCategories);
        const now = new Date();
        const [created] = await db
            .insert(productCategories)
            .values({
                id: crypto.randomUUID(),
                title: input.title,
                slug: input.slug,
                position: (maxPosition ?? 0) + 1,
                createdAt: now,
                updatedAt: now,
            })
            .returning();
        return created;
    }),

    update: t.procedure.input(z.object({ id: z.string(), input: productCategoryInput })).mutation(async ({ input }) => {
        const db = getDb();
        const [updated] = await db
            .update(productCategories)
            .set({ title: input.input.title, slug: input.input.slug, updatedAt: new Date() })
            .where(eq(productCategories.id, input.id))
            .returning();
        if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
        return updated;
    }),

    updatePosition: t.procedure.input(z.object({ id: z.string(), position: z.number() })).mutation(async ({ input }) => {
        const db = getDb();
        const [updated] = await db
            .update(productCategories)
            .set({ position: input.position, updatedAt: new Date() })
            .where(eq(productCategories.id, input.id))
            .returning();
        if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
        return updated;
    }),

    delete: t.procedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
        const db = getDb();
        await db.delete(productCategories).where(eq(productCategories.id, input.id));
        return true;
    }),
});
