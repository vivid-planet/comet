import type { ObjectQuery } from "@mikro-orm/postgresql";

import type { WarningSort } from "./dto/warning.sort";
import type { Warning } from "./entities/warning.entity";

// `type`, `name` and `secondaryInformation` are the grid's filter/sort fields, not Warning columns:
// `type` maps to the generated `rootEntityName` column, `name` / `secondaryInformation` to the joined
// `entityInfo` relation. These helpers translate them to the corresponding MikroORM query paths.

const entityInfoFields = new Set(["name", "secondaryInformation"]);

// Rewrite the query produced by `gqlArgsToMikroOrmQuery`. Recurses so fields nested inside `$and` /
// `$or` / `$not` are mapped too. `name` / `secondaryInformation` are nested under `entityInfo` (and
// merged when both appear in the same object) so MikroORM joins the relation.
export function mapWarningQueryFields(query: unknown): ObjectQuery<Warning> {
    if (Array.isArray(query)) {
        return query.map(mapWarningQueryFields) as ObjectQuery<Warning>;
    }
    if (query !== null && typeof query === "object") {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(query)) {
            const mappedValue = mapWarningQueryFields(value);
            if (key === "type") {
                result.rootEntityName = mappedValue;
            } else if (entityInfoFields.has(key)) {
                result.entityInfo = { ...(result.entityInfo as object | undefined), [key]: mappedValue };
            } else {
                result[key] = mappedValue;
            }
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
