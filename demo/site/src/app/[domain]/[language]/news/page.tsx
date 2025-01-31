import { gql, previewParams } from "@comet/cms-site";
import { type GQLNewsContentScopeInput } from "@src/graphql.generated";
import { NewsList } from "@src/news/NewsList";
import { newsListFragment } from "@src/news/NewsList.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";

import { type GQLNewsIndexPageQuery, type GQLNewsIndexPageQueryVariables } from "./page.generated";

export default async function NewsIndexPage({ params }: { params: { domain: string; language: string } }) {
    // TODO support multiple domains, get domain by Host header
    const { scope, previewData } = (await previewParams()) || { scope: { domain: params.domain, language: params.language }, previewData: undefined };
    const graphqlFetch = createGraphQLFetch(previewData);

    const { newsList } = await graphqlFetch<GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables>(
        gql`
            query NewsIndexPage($scope: NewsContentScopeInput!, $sort: [NewsSort!]!) {
                newsList(scope: $scope, sort: $sort) {
                    ...NewsList
                }
            }

            ${newsListFragment}
        `,
        { scope: scope as GQLNewsContentScopeInput, sort: [{ field: "createdAt", direction: "DESC" }] },
    );

    return <NewsList newsList={newsList} />;
}
