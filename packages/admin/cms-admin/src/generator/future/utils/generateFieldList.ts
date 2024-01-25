import { IntrospectionField, IntrospectionQuery, IntrospectionType } from "graphql";
import objectPath from "object-path";

export function generateFieldListGqlString(fields: string[]) {
    const fieldsObject = fields.reduce<object>((acc, fieldName) => {
        objectPath.set(acc, fieldName, true);
        return acc;
    }, {});
    return JSON.stringify(fieldsObject, null, 4)
        .replace(/: true,/g, "")
        .replace(/: true/g, "")
        .replace(/"/g, "")
        .replace(/:/g, "");
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
        if (field.type.kind === "OBJECT") {
            const subFields = fieldListFromIntrospectionTypeRecursive(types, field.type.name, path);
            acc.push(...subFields);
        } else {
            acc.push({
                path: path,
                field: field,
            });
        }
        return acc;
    }, []);
}
export function generateFieldListFromIntrospection(
    gqlIntrospection: IntrospectionQuery,
    type: string,
): { path: string; field: IntrospectionField }[] {
    return fieldListFromIntrospectionTypeRecursive(gqlIntrospection.__schema.types, type);
}
