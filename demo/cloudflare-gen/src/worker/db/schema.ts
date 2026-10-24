import type { DatabaseDialect } from "@dextinity/core/server";
import { createDamSchema } from "@dextinity/dam/server";
import { createPermissionsSchema } from "@dextinity/permissions/server";

import { DamScope } from "../dam/dam-scope";

/** The tables of all modules, for drizzle-kit. The modules create the same tables at runtime. */
export function createSchema(dialect: DatabaseDialect) {
    return { ...createDamSchema({ dialect, scopeKeys: Object.keys(DamScope.shape) }), ...createPermissionsSchema(dialect) };
}
