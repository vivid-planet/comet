// `type`, `name` and `secondaryInformation` are not plain columns on the Warning entity:
// `type` is stored inside the `sourceInfo` JSONB column, while `name` and `secondaryInformation`
// originate from the joined EntityInfo view. These helpers translate the MikroORM query produced from
// a WarningFilter / WarningSort so those fields resolve to the correct column / join alias.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function remapWarningQueryFields(query: any): any {
    if (Array.isArray(query)) {
        return query.map(remapWarningQueryFields);
    }
    if (query !== null && typeof query === "object") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: Record<string, any> = {};
        for (const [key, value] of Object.entries(query)) {
            // Recurse into every value so the fields are remapped no matter how deeply they are nested
            // (e.g. inside `$and` / `$or` / `$not` produced by the various filter operators).
            const remappedValue = remapWarningQueryFields(value);
            if (key === "type") {
                result.sourceInfo = { rootEntityName: remappedValue };
            } else if (key === "name") {
                result["entityInfo.name"] = remappedValue;
            } else if (key === "secondaryInformation") {
                result["entityInfo.secondaryInformation"] = remappedValue;
            } else {
                result[key] = remappedValue;
            }
        }
        return result;
    }
    return query;
}

// Whether a query (where clause or order-by) references the joined EntityInfo view. Used to only add
// the (potentially expensive) join when filtering, searching or sorting by name / secondary information
// actually requires it. Filtering / sorting by type reads from `sourceInfo` and needs no join.
export function referencesEntityInfo(value: unknown): boolean {
    if (Array.isArray(value)) {
        return value.some(referencesEntityInfo);
    }
    if (value !== null && typeof value === "object") {
        return Object.entries(value).some(([key, nestedValue]) => key.startsWith("entityInfo.") || referencesEntityInfo(nestedValue));
    }
    return false;
}
