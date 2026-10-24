import { type DatabaseDialect, portableColumns, type ScopeColumns } from "@dextinity/serverless-core/server";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

export const pageTreeNodeVisibilities = ["Published", "Unpublished", "Archived"] as const;

export type PageTreeNodeVisibility = (typeof pageTreeNodeVisibilities)[number];

/**
 * The counterpart of `PageTreeNodeBase`: one table for the nodes of all categories, with the columns of the application's scope.
 * Nodes reference their parent only, paths are calculated from the slugs.
 */
export function createPageTreeSchema({ dialect, scopeColumns }: { dialect: DatabaseDialect; scopeColumns: ScopeColumns }) {
    const column = portableColumns(dialect);

    const pageTreeNodes = column.table(
        "PageTreeNode",
        {
            id: column
                .uuid()
                .primaryKey()
                .$defaultFn(() => crypto.randomUUID()),
            parentId: column.uuid().references((): AnySQLiteColumn => pageTreeNodes.id, { onDelete: "cascade" }),
            pos: column.integer().notNull(),
            name: column.text().notNull(),
            slug: column.text().notNull(),
            visibility: column.textEnum(pageTreeNodeVisibilities).notNull().default("Unpublished"),
            documentType: column.text().notNull(),
            category: column.text().notNull(),
            hideInMenu: column.boolean().notNull().default(false),
            createdAt: column
                .timestamp()
                .notNull()
                .$defaultFn(() => new Date()),
            updatedAt: column
                .timestamp()
                .notNull()
                .$defaultFn(() => new Date())
                .$onUpdateFn(() => new Date()),
            ...scopeColumns.definitions(column),
        },
        (table) => [column.index("PageTreeNode_parentId_index").on(table.parentId)],
    );

    return { pageTreeNodes };
}

export type PageTreeSchema = ReturnType<typeof createPageTreeSchema>;
