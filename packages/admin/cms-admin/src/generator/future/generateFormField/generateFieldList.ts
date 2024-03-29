import { IntrospectionField, IntrospectionQuery, IntrospectionType } from "graphql";

export function generateFieldListFromIntrospection(
    gqlIntrospection: IntrospectionQuery,
    type: string,
): { path: string; field: IntrospectionField }[] {
    return fieldListFromIntrospectionTypeRecursive(gqlIntrospection.__schema.types, type);
}

function fieldListFromIntrospectionTypeRecursive(
    types: readonly IntrospectionType[],
    type: string,
    parentPath?: string,
): { path: string; field: IntrospectionField }[] {
    const typeDef = types.find((typeDef) => typeDef.name === type);
    if (!typeDef || typeDef.kind !== "OBJECT") return [];

    return typeDef.fields.reduce<{ path: string; field: IntrospectionField }[]>((acc, field) => {
        const path = `${parentPath ? `${parentPath}.` : ""}${field.name}`;
        let type = field.type;
        if (type.kind === "NON_NULL") type = type.ofType;

        if (type.kind === "OBJECT") {
            acc.push({ path: path, field: field });
            acc.push(...fieldListFromIntrospectionTypeRecursive(types, type.name, path));
        } else {
            acc.push({ path: path, field: field });
        }
        return acc;
    }, []);
}
