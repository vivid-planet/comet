import { type DatabaseDialect, portableColumns } from "@dextinity/serverless-core/server";
import { and, eq, type SQL } from "drizzle-orm";
import type { AnySQLiteColumn, SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";

import { focalPoints } from "../common/focal-point.js";

export const licenseTypes = ["ROYALTY_FREE", "RIGHTS_MANAGED"] as const;
export const aiContentTypes = ["Generated", "Modified"] as const;

export type DamScope = Record<string, string>;

const scopeColumnName = (key: string) => `scope_${key}`;

/**
 * The counterpart of `createFileEntity` and `createFolderEntity`: creates the DAM tables for the dialect, with the columns of the
 * application's scope. Folders reference their parent only, ancestors are queried recursively (no PostgreSQL arrays, which D1 lacks).
 *
 * The scope columns aren't part of the table types because they depend on the application. Use `DamScopeColumns` to read and write them.
 */
export function createDamSchema({ dialect, scopeKeys }: { dialect: DatabaseDialect; scopeKeys: readonly string[] }) {
    const column = portableColumns(dialect);

    const id = () =>
        column
            .uuid()
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID());
    const timestamps = () => ({
        createdAt: column
            .timestamp()
            .notNull()
            .$defaultFn(() => new Date()),
        updatedAt: column
            .timestamp()
            .notNull()
            .$defaultFn(() => new Date())
            .$onUpdateFn(() => new Date()),
    });
    // Typed as empty: the columns exist at runtime, but their keys are only known to the application.
    const scopeColumns = () => Object.fromEntries(scopeKeys.map((key) => [scopeColumnName(key), column.text().notNull()])) as Record<never, never>;

    const damFileImages = column.table("DamFileImage", {
        id: id(),
        width: column.integer().notNull(),
        height: column.integer().notNull(),
        exif: column.json<Record<string, unknown>>(),
        dominantColor: column.text(),
        cropAreaFocalPoint: column.textEnum(focalPoints).notNull(),
        cropAreaWidth: column.double(),
        cropAreaHeight: column.double(),
        cropAreaX: column.double(),
        cropAreaY: column.double(),
    });

    const damFolders = column.table(
        "DamFolder",
        {
            id: id(),
            name: column.text().notNull(),
            parentId: column.uuid().references((): AnySQLiteColumn => damFolders.id, { onDelete: "cascade", onUpdate: "cascade" }),
            archived: column.boolean().notNull().default(false),
            isInboxFromOtherScope: column.boolean().notNull().default(false),
            ...timestamps(),
            ...scopeColumns(),
        },
        (table) => [column.index("DamFolder_parentId_index").on(table.parentId)],
    );

    const damFiles = column.table(
        "DamFile",
        {
            id: id(),
            folderId: column.uuid().references(() => damFolders.id, { onDelete: "set null", onUpdate: "cascade" }),
            name: column.text().notNull(),
            size: column.bigInteger().notNull(),
            mimetype: column.text().notNull(),
            contentHash: column.text().notNull(),
            title: column.text(),
            altText: column.text(),
            archived: column.boolean().notNull().default(false),
            imageId: column
                .uuid()
                .unique("DamFile_imageId_unique")
                .references(() => damFileImages.id, { onDelete: "cascade", onUpdate: "cascade" }),
            licenseType: column.textEnum(licenseTypes),
            licenseDetails: column.text(),
            licenseAuthor: column.text(),
            licenseDurationFrom: column.timestamp(),
            licenseDurationTo: column.timestamp(),
            importSourceId: column.text(),
            importSourceType: column.text(),
            copyOfId: column.uuid().references((): AnySQLiteColumn => damFiles.id, { onDelete: "set null", onUpdate: "cascade" }),
            aiContentType: column.textEnum(aiContentTypes),
            ...timestamps(),
            ...scopeColumns(),
        },
        (table) => [column.index("DamFile_contentHash_index").on(table.contentHash), column.index("DamFile_folderId_index").on(table.folderId)],
    );

    return { damFiles, damFolders, damFileImages };
}

export type DamSchema = ReturnType<typeof createDamSchema>;

export class DamScopeColumns {
    constructor(private readonly scopeKeys: readonly string[]) {}

    /**
     * Use as `.where(scopeColumns.equals(table, scope))`. Without a scope, matches all rows.
     */
    equals(table: SQLiteTable, scope: DamScope | undefined): SQL | undefined {
        if (scope === undefined) {
            return undefined;
        }
        return and(...this.scopeKeys.map((key) => eq(this.column(table, key), scope[key])));
    }

    toValues(scope: DamScope | undefined): Record<string, string> {
        return Object.fromEntries(this.scopeKeys.map((key) => [scopeColumnName(key), scope?.[key] as string]));
    }

    fromRow(row: object): DamScope {
        return Object.fromEntries(this.scopeKeys.map((key) => [key, (row as Record<string, string>)[scopeColumnName(key)]]));
    }

    select(table: SQLiteTable): Record<string, SQLiteColumn> {
        return Object.fromEntries(this.scopeKeys.map((key) => [scopeColumnName(key), this.column(table, key)]));
    }

    /** The scope dimensions with their columns, for `scopeFilter()` of the permissions module */
    byDimension(table: SQLiteTable): Record<string, SQLiteColumn> {
        return Object.fromEntries(this.scopeKeys.map((key) => [key, this.column(table, key)]));
    }

    private column(table: SQLiteTable, key: string): SQLiteColumn {
        return (table as unknown as Record<string, SQLiteColumn>)[scopeColumnName(key)];
    }
}
