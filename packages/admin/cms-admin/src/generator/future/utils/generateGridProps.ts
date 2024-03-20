import { IntrospectionQuery } from "graphql";

import { getFilterGQLTypeString } from "./introspectionHelpers";

export function hasGridPropBaseFilter({ gridQuery, gqlIntrospection }: { gridQuery: string; gqlIntrospection: IntrospectionQuery }) {
    return !!getFilterGQLTypeString({ gridQuery, gqlIntrospection });
}

export function generateGridPropsType({ gridQuery, gqlIntrospection }: { gridQuery: string; gqlIntrospection: IntrospectionQuery }) {
    const baseFilterType = getFilterGQLTypeString({ gridQuery, gqlIntrospection });
    if (!baseFilterType) return;
    return `type Props = {
        ${baseFilterType ? `baseFilter?: ${baseFilterType};` : ``}
    };`;
}

export function generateGridProps({ gridQuery, gqlIntrospection }: { gridQuery: string; gqlIntrospection: IntrospectionQuery }) {
    const props: string[] = [];
    if (getFilterGQLTypeString({ gridQuery, gqlIntrospection })) {
        props.push("baseFilter");
    }
    return props.length ? `{${props.join(", ")}}: Props` : undefined;
}
