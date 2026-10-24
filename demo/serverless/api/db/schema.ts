import type { DatabaseDialect } from "@dextinity/serverless-core/server";
import { createDamSchema } from "@dextinity/serverless-dam/server";
import { createPermissionsSchema } from "@dextinity/serverless-permissions/server";

import { DamScope } from "../dam/dam-scope";

/** The tables of all modules, for drizzle-kit. The modules create the same tables at runtime. */
export function createSchema(dialect: DatabaseDialect) {
    return { ...createDamSchema({ dialect, scopeKeys: Object.keys(DamScope.shape) }), ...createPermissionsSchema(dialect) };
}
