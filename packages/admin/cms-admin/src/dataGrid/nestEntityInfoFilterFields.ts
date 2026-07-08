import type { GqlFilter } from "@comet/admin";

// `name` and `secondaryInformation` grid columns live on the related entity, exposed through the
// `entityInfo` relation. Nest their filter conditions under `entityInfo` so they match the API's
// `EntityInfoFilter` (used by the warnings and dependencies grids).
const entityInfoFilterFields = new Set(["name", "secondaryInformation"]);

export function nestEntityInfoFilterFields(filter: GqlFilter): GqlFilter {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(filter)) {
        if ((key === "and" || key === "or") && Array.isArray(value)) {
            result[key] = value.map((item) => nestEntityInfoFilterFields(item));
        } else if (entityInfoFilterFields.has(key)) {
            result.entityInfo = { ...(result.entityInfo as Record<string, unknown> | undefined), [key]: value };
        } else {
            result[key] = value;
        }
    }
    return result as GqlFilter;
}
