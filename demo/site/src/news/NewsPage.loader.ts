import { graphql } from "@src/gql";
import { type GQLNewsContentScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";

type NewsListParams = {
    scope: GQLNewsContentScopeInput;
    offset?: number;
    limit: number;
};

const query = graphql(/* GraphQL */ `
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
`);

export async function fetchNewsList(params: NewsListParams) {
    const graphqlFetch = createGraphQLFetch();

    const { newsList } = await graphqlFetch(query, {
        scope: params.scope,
        sort: [{ field: "date", direction: "DESC" }],
        offset: params.offset || 0,
        limit: params.limit,
    });
    return newsList;
}
