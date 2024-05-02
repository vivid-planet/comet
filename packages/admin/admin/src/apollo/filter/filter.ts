// Copied and adapted from https://github.com/apollographql/apollo-client/blob/release-2.x/packages/graphql-anywhere/src/utilities.ts

import { DocumentNode } from "graphql";

import { ExecContext, ExecInfo, graphql, VariableMap } from "./graphql";

export function filter<FD = any, D extends FD = any>(doc: DocumentNode, data: D, variableValues: VariableMap = {}): FD {
    if (data === null) return data;

    // TODO
    // eslint-disable-next-line @typescript-eslint/ban-types
    const resolver = (fieldName: string, root: any, args: Object, context: ExecContext, info: ExecInfo) => {
        return root[info.resultKey];
    };

    return Array.isArray(data)
        ? data.map((dataObj) => graphql(resolver, doc, dataObj, null, variableValues))
        : graphql(resolver, doc, data, null, variableValues);
}
