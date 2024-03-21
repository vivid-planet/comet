import { IntrospectionQuery } from "graphql";

import { GridConfig } from "../generator";
import { getFilterGQLTypeString } from "./introspectionHelpers";

export function hasGridPropBaseFilter({
    config,
    gridQuery,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQuery: string;
    gqlIntrospection: IntrospectionQuery;
}) {
    return config.exposeFilters && !!getFilterGQLTypeString({ gridQuery, gqlIntrospection });
}

export function generateGridPropsType({
    config,
    gridQuery,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQuery: string;
    gqlIntrospection: IntrospectionQuery;
}) {
    const props: string[] = [];
    if (hasGridPropBaseFilter({ config, gridQuery, gqlIntrospection })) {
        const baseFilterType = getFilterGQLTypeString({ gridQuery, gqlIntrospection });
        props.push(`baseFilter?: ${baseFilterType};`);
    }
    return props.length
        ? `type Props = {
        ${props.join("\n")}
    };`
        : undefined;
}

export function generateGridProps({
    config,
    gridQuery,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQuery: string;
    gqlIntrospection: IntrospectionQuery;
}) {
    const props: string[] = [];
    if (hasGridPropBaseFilter({ config, gridQuery, gqlIntrospection })) {
        props.push("baseFilter");
    }
    return props.length ? `{${props.join(", ")}}: Props` : undefined;
}
