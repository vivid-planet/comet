import { IntrospectionField, IntrospectionQuery, IntrospectionType } from "graphql";
import objectPath from "object-path";

type FieldsObjectType = { [key: string]: FieldsObjectType | boolean | string };
const recursiveStringify = (obj: FieldsObjectType): string => {
    let ret = "";
    let prefixField = "";
    for (const key in obj) {
        const valueForKey = obj[key];
        if (typeof valueForKey === "boolean") {
            ret += `${prefixField}${key}`;
        } else if (typeof valueForKey === "string") {
            ret += `${prefixField}${key}${valueForKey}`;
        } else {
            ret += `${prefixField}${key} { ${recursiveStringify(valueForKey)} }`;
        }
        prefixField = " ";
    }
    return ret;
};

export function getRootProps(fields: string[]): string[] {
    const fieldsObject: FieldsObjectType = fields.reduce((acc, field) => {
        objectPath.set(acc, field, true);
        return acc;
    }, {});
    return Object.keys(fieldsObject);
}

export function generateFieldListGqlString(fields: string[]) {
    const fieldsObject: FieldsObjectType = fields.reduce((acc, fieldName) => {
        objectPath.set(acc, fieldName, true);
        return acc;
    }, {});
    return recursiveStringify(fieldsObject);
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
        let outputType = field.type;
        if (outputType.kind === "NON_NULL") {
            outputType = outputType.ofType;
        }
        if (outputType.kind === "OBJECT") {
            const subFields = fieldListFromIntrospectionTypeRecursive(types, outputType.name, path);
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
