import type { AccessVariables, BlobStorage, Database, ImageTransformer } from "@dextinity/core/server";
import { assertCan, type PermissionsVariables, scopeFilter } from "@dextinity/permissions/server";
import type { SQL } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";
import type { Context } from "hono";
import { z } from "zod";

import type { ResolvedDamConfig } from "./dam.config.js";
import type { DamServices } from "./dam.services.js";
import type { DamFile } from "./dam.types.js";
import type { DamScope } from "./db/dam.schema.js";

export type DamScopeSchema = z.ZodObject<Record<string, z.ZodString>>;

/** The dependencies the DAM module requires from the application (the counterpart of a NestJS module's imports), plus what it provides. */
export type DamVariables = AccessVariables &
    PermissionsVariables & {
        database: Database;
        blobStorage: BlobStorage;
        imageTransformer: ImageTransformer;
        dam: DamServices;
    };

export type DamEnv = { Variables: DamVariables };

/** Builds a condition from the column of each scope dimension, e.g. `{ domain: table.scope_domain }` */
export type DamScopeFilter = (columns: Record<string, SQLiteColumn>) => SQL;

export interface DamRouteContext<TScopeSchema extends DamScopeSchema> {
    config: ResolvedDamConfig;
    scopeSchema: TScopeSchema;
    hasScope: boolean;
}

export function createDamRouteHelpers<TScopeSchema extends DamScopeSchema>({ scopeSchema, hasScope }: DamRouteContext<TScopeSchema>) {
    type Scope = z.infer<TScopeSchema>;
    const scopeKeys = Object.keys(scopeSchema.shape);

    return {
        /**
         * Scope dimensions are passed as top-level query parameters (`?domain=main&folderId=…`), so typed clients know which dimensions
         * are required.
         */
        scopedQuery<TArgsSchema extends z.ZodObject>(argsSchema: TArgsSchema) {
            for (const key of Object.keys(argsSchema.shape)) {
                if (scopeKeys.includes(key)) {
                    throw new Error(`DAM: The scope dimension "${key}" collides with a query parameter of the DAM routes.`);
                }
            }
            return z.object({ ...scopeSchema.shape, ...argsSchema.shape } as TScopeSchema["shape"] & TArgsSchema["shape"]);
        },

        /** Separates the scope dimensions from the other query parameters. The scope is `undefined` when the DAM has no scope. */
        splitScopedQuery<TArgsSchema extends z.ZodObject>(
            argsSchema: TArgsSchema,
            query: object,
        ): { scope: Scope | undefined; args: z.output<TArgsSchema> } {
            const values = query as Record<string, unknown>;
            const scope = Object.fromEntries(scopeKeys.map((key) => [key, values[key]])) as Scope;
            const args = Object.fromEntries(
                Object.keys(argsSchema.shape)
                    .map((key) => [key, values[key]])
                    .filter(([, value]) => value !== undefined),
            );
            return { scope: hasScope ? scope : undefined, args: args as z.output<TArgsSchema> };
        },

        nonEmptyScopeOrNothing(scope: DamScope | undefined): Scope | undefined {
            return hasScope ? (scope as Scope) : undefined;
        },

        /** The counterpart of `@AffectedEntity` and the scope check of `@RequiredPermission`. */
        assertScopeAllowed(c: Context<DamEnv>, scope: DamScope | undefined): void {
            assertCan(c, "dam", hasScope ? scope : undefined);
        },

        /** Limits lists to the scopes with DAM permission, in addition to the scope check of the route (fails closed). */
        scopeFilter(c: Context<DamEnv>): DamScopeFilter | undefined {
            return hasScope ? (columns) => scopeFilter(c, { permission: "dam", columns }) : undefined;
        },

        serializeFile(c: Context<DamEnv>, file: DamFile) {
            const previewDamUrls = Boolean(c.req.header("x-preview-dam-urls"));
            return {
                ...file,
                scope: file.scope as Scope,
                fileUrl: c.var.dam.files.createFileUrl(file, { previewDamUrls }),
                downloadUrl: c.var.dam.files.createFileDownloadUrl(file, { previewDamUrls }),
                image: file.image && { ...file.image, urlTemplate: c.var.dam.images.createUrlTemplate(file, { previewDamUrls }) },
            };
        },
    };
}

export type DamRouteHelpers<TScopeSchema extends DamScopeSchema> = ReturnType<typeof createDamRouteHelpers<TScopeSchema>>;
