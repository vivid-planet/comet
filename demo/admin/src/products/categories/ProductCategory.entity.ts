import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const productCategories = pgTable("ProductCategory", {
    id: uuid("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    position: integer("position").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

export type ProductCategory = typeof productCategories.$inferSelect;
