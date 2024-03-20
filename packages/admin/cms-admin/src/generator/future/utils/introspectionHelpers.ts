import { IntrospectionInputObjectType, IntrospectionInputValue, IntrospectionObjectType, IntrospectionQuery } from "graphql";

export function findQueryType(queryName: string, schema: IntrospectionQuery) {
    const queryType = schema.__schema.types.find((type) => type.name === schema.__schema.queryType.name) as IntrospectionObjectType | undefined;
    if (!queryType) throw new Error("Can't find Query type in gql schema");
    const ret = queryType.fields.find((field) => field.name === queryName);
    if (!ret) throw new Error(`Can't find query ${queryName} in gql schema`);
    return ret;
}

export function findQueryTypeOrThrow(queryName: string, schema: IntrospectionQuery) {
    const ret = findQueryType(queryName, schema);
    if (!ret) throw new Error(`Can't find query ${queryName} in gql schema`);
    return ret;
}

export function findInputObjectType(input: IntrospectionInputValue, schema: IntrospectionQuery) {
    let type = input.type;
    if (type.kind == "NON_NULL") {
        type = type.ofType;
    }
    if (type.kind !== "INPUT_OBJECT") {
        throw new Error("must be INPUT_OBJECT");
    }
    const typeName = type.name;
    return schema.__schema.types.find((type) => type.kind === "INPUT_OBJECT" && type.name === typeName) as IntrospectionInputObjectType | undefined;
}

export function getFilterGQLTypeString({
    gridQuery,
    gqlIntrospection,
}: {
    gridQuery: string;
    gqlIntrospection: IntrospectionQuery;
}): string | undefined {
    const gridQueryType = findQueryTypeOrThrow(gridQuery, gqlIntrospection);
    const filterArg = gridQueryType.args.find((arg) => arg.name === "filter");
    if (!filterArg) return;

    const filterType = findInputObjectType(filterArg, gqlIntrospection);
    if (!filterType) return;

    return `GQL${filterType.name}`;
}
