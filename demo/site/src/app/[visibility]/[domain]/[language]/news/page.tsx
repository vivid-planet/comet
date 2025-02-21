export const dynamic = "error";

import { gql } from "@comet/cms-site";
import { type GQLNewsContentScopeInput } from "@src/graphql.generated";
import { type VisibilityParam } from "@src/middleware/domainRewrite";
import { NewsList } from "@src/news/NewsList";
import { newsListFragment } from "@src/news/NewsList.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { setVisibilityParam } from "@src/util/ServerContext";

import { type GQLNewsIndexPageQuery, type GQLNewsIndexPageQueryVariables } from "./page.generated";

export default async function NewsIndexPage({
    params: { domain, language, visibility },
}: {
    params: { domain: string; language: string; visibility: VisibilityParam };
}) {
    setVisibilityParam(visibility);
    const graphqlFetch = createGraphQLFetch();

    const { newsList } = await graphqlFetch<GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables>(
        gql`
            query NewsIndexPage($scope: NewsContentScopeInput!, $sort: [NewsSort!]!) {
                newsList(scope: $scope, sort: $sort) {
                    ...NewsList
                }
            }

            ${newsListFragment}
        `,
        { scope: { domain, language } as GQLNewsContentScopeInput, sort: [{ field: "createdAt", direction: "DESC" }] },
    );

    return <NewsList newsList={newsList} />;
}
