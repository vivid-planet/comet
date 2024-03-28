import { previewParams } from "@comet/cms-site";
import { defaultLanguage, domain } from "@src/config";
import { GQLNewsContentScopeInput } from "@src/graphql.generated";
import { NewsList } from "@src/news/NewsList";
import { newsListFragment } from "@src/news/NewsList.fragment";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";

import { GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables } from "./page.generated";

export default async function NewsIndexPage() {
    // TODO support multiple domains, get domain by Host header
    const { scope, previewData } = previewParams() || { scope: { domain, language: defaultLanguage }, previewData: undefined };
    const client = createGraphQLClient(previewData);

    const { newsList } = await client.request<GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables>(
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
