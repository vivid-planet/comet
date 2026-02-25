import { type BlockData } from "@src/blocks/block";
import type { SpaceBlock } from "@src/blocks/SpaceBlock";
import { boolean, doublePrecision, json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const products = pgTable("Product", {
    id: uuid("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    price: doublePrecision("price"),
    type: text("type").notNull().$type<"cap" | "shirt" | "tie">(),
    additionalTypes: text("additionalTypes").array().notNull().default([]).$type<("cap" | "shirt" | "tie")[]>(),
    //image: json("image").$type<BlockData<typeof SpaceBlock>>(),
    space: json("space").$type<BlockData<typeof SpaceBlock>>().notNull(),
    inStock: boolean("inStock").notNull().default(false),
    status: text("status").notNull().default("Unpublished").$type<"Published" | "Unpublished">(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

export type Product = typeof products.$inferSelect;
