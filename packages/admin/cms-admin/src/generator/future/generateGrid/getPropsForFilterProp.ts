import { IntrospectionInputObjectType } from "graphql";

import { Prop } from "../generateGrid";
import { GridConfig } from "../generatorConfigs/gridConfig";
import { Imports } from "../utils/generateImportsCode";

export function getPropsForFilterProp({
    config,
    filterType,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    filterType: IntrospectionInputObjectType;
}): {
    hasFilterProp: boolean;
    imports: Imports;
    props: Prop[];
} {
    if (!config.filterProp) return { hasFilterProp: false, imports: [], props: [] };

    const filterTypeName = `GQL${filterType.name}`;

    return {
        hasFilterProp: true,
        imports: [{ name: filterTypeName, importPath: "@src/graphql.generated" }],
        props: [{ name: "filter", optional: true, type: filterTypeName }],
    };
}
