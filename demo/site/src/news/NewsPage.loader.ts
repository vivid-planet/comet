import { gql } from "@comet/site-nextjs";
import { GQLNewsContentScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";

import { GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables } from "./NewsPage.loader.generated";

export type NewsListParams = {
    scope: GQLNewsContentScopeInput;
    offset?: number;
    limit: number;
};

export async function fetchNewsList(params: NewsListParams) {
    const graphqlFetch = createGraphQLFetch();

    const { newsList } = await graphqlFetch<GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables>(
        gql`
            query NewsIndexPage($scope: NewsContentScopeInput!, $sort: [NewsSort!]!, $offset: Int!, $limit: Int!) {
                newsList(scope: $scope, sort: $sort, offset: $offset, limit: $limit) {
                    nodes {
                        id
                        title
                        slug
                        image
                        createdAt
                        scope {
                            language
                        }
                    }
                    totalCount
                }
            }
        `,
        {
            scope: params.scope,
            sort: [{ field: "date", direction: "DESC" }],
            offset: params.offset || 0,
            limit: params.limit,
        },
    );
    return newsList;
}
