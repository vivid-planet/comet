import type { ObjectQuery } from "@mikro-orm/postgresql";

import type { WarningSort } from "./dto/warning.sort";
import type { Warning } from "./entities/warning.entity";

// The grid's `type` filter/sort field isn't a Warning column: it maps to the generated `rootEntityName`
// column. (`name` / `secondaryInformation` are nested under the `entityInfo` relation filter and don't
// need remapping.) These helpers translate `type` to the corresponding MikroORM query path.

// Rewrite the query produced by `gqlArgsToMikroOrmQuery`. Recurses so a `type` nested inside `$and` /
// `$or` / `$not` is mapped too.
export function mapWarningQueryFields(query: unknown): ObjectQuery<Warning> {
    if (Array.isArray(query)) {
        return query.map(mapWarningQueryFields) as ObjectQuery<Warning>;
    }
    if (query !== null && typeof query === "object") {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(query)) {
            result[key === "type" ? "rootEntityName" : key] = mapWarningQueryFields(value);
        }
        return result as ObjectQuery<Warning>;
    }
    return query as ObjectQuery<Warning>;
}

// Translate WarningSort into a MikroORM order-by: `type` → generated `rootEntityName` column, `name` →
// `entityInfo` relation, everything else → plain Warning column.
export function mapWarningOrderBy(sort?: WarningSort[]) {
    return sort?.map((sortItem) => {
        if (sortItem.field === "type") {
            return { rootEntityName: sortItem.direction };
        }
        if (sortItem.field === "name") {
            return { entityInfo: { name: sortItem.direction } };
        }
        return { [sortItem.field]: sortItem.direction };
    });
}
