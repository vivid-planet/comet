import { gql, previewParams } from "@comet/cms-site";
import { GQLNewsCategory, GQLNewsContentScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";

import { GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables } from "./NewsList.loader.generated";

export type NewsListParams = {
    scope: GQLNewsContentScopeInput;
    category?: GQLNewsCategory;
};

export async function fetchNewsList(params: NewsListParams) {
    const graphqlFetch = createGraphQLFetch((await previewParams())?.previewData);

    const { newsList } = await graphqlFetch<GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables>(
        gql`
            query NewsIndexPage($scope: NewsContentScopeInput!, $sort: [NewsSort!]!, $filter: NewsFilter!) {
                newsList(scope: $scope, sort: $sort, filter: $filter) {
                    nodes {
                        id
                        title
                        slug
                        image
                        createdAt
                        scope {
                            language
                        }
                        category
                    }
                }
            }
        `,
        {
            scope: params.scope,
            sort: [{ field: "createdAt", direction: "DESC" }],
            filter: { category: { equal: params.category } },
        },
    );
    return newsList.nodes;
}
