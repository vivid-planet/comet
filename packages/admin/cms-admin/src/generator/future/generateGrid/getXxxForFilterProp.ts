import { IntrospectionField, IntrospectionQuery } from "graphql";

import { Prop } from "../generateGrid";
import { GridConfig } from "../generator";
import { Imports } from "../utils/generateImportsCode";
import { findInputObjectType } from "./findInputObjectType";

export function getXxxForFilterProp({
    config,
    gridQueryType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQueryType: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}): {
    hasFilterProp: boolean;
    imports: Imports;
    props: Prop[];
} {
    if (!config.filterProp) return { hasFilterProp: false, imports: [], props: [] };

    const filterType = getFilterGQLTypeString({ gridQueryType, gqlIntrospection });
    if (!filterType) return { hasFilterProp: false, imports: [], props: [] };

    return {
        hasFilterProp: true,
        imports: [{ name: filterType, importPath: "@src/graphql.generated" }],
        props: [{ name: "filter", optional: true, type: filterType }],
    };
}

function getFilterGQLTypeString({
    gridQueryType,
    gqlIntrospection,
}: {
    gridQueryType: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}): string | undefined {
    const filterArg = gridQueryType.args.find((arg) => arg.name === "filter");
    if (!filterArg) return;

    const filterType = findInputObjectType(filterArg, gqlIntrospection);
    if (!filterType) return;

    return `GQL${filterType.name}`;
}
