import { randomUUID } from "node:crypto";

import { and, eq, type SQL } from "drizzle-orm";
import {
    type AnyPgColumn,
    bigint,
    boolean,
    char,
    doublePrecision,
    index,
    integer,
    json,
    type PgColumn,
    type PgTable,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { focalPoints } from "../common/focal-point.js";

export const licenseTypes = ["ROYALTY_FREE", "RIGHTS_MANAGED"] as const;
export const aiContentTypes = ["Generated", "Modified"] as const;

export type DamScope = Record<string, string>;

const scopeColumnName = (key: string) => `scope_${key}`;

const timestamps = () => ({
    createdAt: timestamp({ withTimezone: true })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: timestamp({ withTimezone: true })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),
});

/**
 * The counterpart of `createFileEntity` and `createFolderEntity`: creates the DAM tables with the columns of the application's scope.
 * Maps to the tables created by the MikroORM migrations of `@dextinity/cms-api`, so both APIs can work on the same database.
 *
 * The scope columns aren't part of the table types because they depend on the application. Use `DamScopeColumns` to read and write them.
 */
export function createDamSchema({ scopeKeys }: { scopeKeys: readonly string[] }) {
    // Typed as empty: the columns exist at runtime, but their keys are only known to the application.
    const scopeColumns = () =>
        Object.fromEntries(scopeKeys.map((key) => [scopeColumnName(key), text(scopeColumnName(key)).notNull()])) as Record<never, never>;

    const damFileImages = pgTable("DamFileImage", {
        id: uuid().primaryKey().$defaultFn(randomUUID),
        width: integer().notNull(),
        height: integer().notNull(),
        exif: json().$type<Record<string, unknown>>(),
        dominantColor: text(),
        cropAreaFocalPoint: text("cropArea_focalPoint", { enum: focalPoints }).notNull(),
        cropAreaWidth: doublePrecision("cropArea_width"),
        cropAreaHeight: doublePrecision("cropArea_height"),
        cropAreaX: doublePrecision("cropArea_x"),
        cropAreaY: doublePrecision("cropArea_y"),
    });

    const damFolders = pgTable(
        "DamFolder",
        {
            id: uuid().primaryKey().$defaultFn(randomUUID),
            name: text().notNull(),
            parentId: uuid().references((): AnyPgColumn => damFolders.id, { onDelete: "cascade", onUpdate: "cascade" }),
            mpath: uuid().array().notNull(),
            archived: boolean().notNull().default(false),
            isInboxFromOtherScope: boolean().notNull().default(false),
            ...timestamps(),
            ...scopeColumns(),
        },
        (table) => [index("DamFolder_mpath_index").on(table.mpath)],
    );

    const damFiles = pgTable(
        "DamFile",
        {
            id: uuid().primaryKey().$defaultFn(randomUUID),
            folderId: uuid().references(() => damFolders.id, { onDelete: "set null", onUpdate: "cascade" }),
            name: text().notNull(),
            size: bigint({ mode: "number" }).notNull(),
            mimetype: text().notNull(),
            contentHash: char({ length: 32 }).notNull(),
            title: text(),
            altText: text(),
            archived: boolean().notNull().default(false),
            imageId: uuid()
                .unique("DamFile_imageId_unique")
                .references(() => damFileImages.id, { onDelete: "cascade", onUpdate: "cascade" }),
            licenseType: text("license_type", { enum: licenseTypes }),
            licenseDetails: text("license_details"),
            licenseAuthor: text("license_author"),
            licenseDurationFrom: timestamp("license_durationFrom", { withTimezone: true }),
            licenseDurationTo: timestamp("license_durationTo", { withTimezone: true }),
            importSourceId: text(),
            importSourceType: text(),
            copyOfId: uuid().references((): AnyPgColumn => damFiles.id, { onDelete: "set null", onUpdate: "cascade" }),
            aiContentType: text({ enum: aiContentTypes }),
            ...timestamps(),
            ...scopeColumns(),
        },
        (table) => [index("DamFile_contentHash_index").on(table.contentHash)],
    );

    return { damFiles, damFolders, damFileImages };
}

export type DamSchema = ReturnType<typeof createDamSchema>;

export class DamScopeColumns {
    constructor(private readonly scopeKeys: readonly string[]) {}

    /**
     * Use as `.where(scopeColumns.equals(table, scope))`. Without a scope, matches all rows.
     */
    equals(table: PgTable, scope: DamScope | undefined): SQL | undefined {
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

    select(table: PgTable): Record<string, PgColumn> {
        return Object.fromEntries(this.scopeKeys.map((key) => [scopeColumnName(key), this.column(table, key)]));
    }

    private column(table: PgTable, key: string): PgColumn {
        return (table as unknown as Record<string, PgColumn>)[scopeColumnName(key)];
    }
}
