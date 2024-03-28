import { defaultLanguage, domain } from "@src/config";
import { NewsList } from "@src/news/NewsList";
import { newsListFragment } from "@src/news/NewsList.fragment";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { draftMode } from "next/headers";

import { PreviewData } from "../api/site-preview/route";
import { GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables } from "./page.generated";

export default async function NewsIndexPage() {
    let previewData: PreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const client = createGraphQLClient(previewData);
    const locale = /*context.locale ??*/ defaultLanguage;
    const scope = { domain, language: locale };

    const { newsList } = await client.request<GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables>(
        gql`
            query NewsIndexPage($scope: NewsContentScopeInput!, $sort: [NewsSort!]!) {
                newsList(scope: $scope, sort: $sort) {
                    ...NewsList
                }
            }

            ${newsListFragment}
        `,
        { scope, sort: [{ field: "createdAt", direction: "DESC" }] },
    );

    return <NewsList newsList={newsList} />;
}
