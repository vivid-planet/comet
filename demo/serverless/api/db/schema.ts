import { type DatabaseDialect, ScopeColumns } from "@dextinity/serverless-core/server";
import { createDamSchema } from "@dextinity/serverless-dam/server";
import { createPageTreeSchema } from "@dextinity/serverless-page-tree/server";
import { createPermissionsSchema } from "@dextinity/serverless-permissions/server";

import { ContentScope } from "../../shared/content-scope";

/** The tables of all modules, for drizzle-kit. The modules create the same tables at runtime. */
export function createSchema(dialect: DatabaseDialect) {
    const scopeColumns = new ScopeColumns(Object.keys(ContentScope.shape));
    return {
        ...createDamSchema({ dialect, scopeColumns }),
        ...createPageTreeSchema({ dialect, scopeColumns }),
        ...createPermissionsSchema(dialect),
    };
}
