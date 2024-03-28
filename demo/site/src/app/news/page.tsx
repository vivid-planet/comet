import { gql } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";
import { defaultLanguage, domain } from "@src/config";
import { NewsList } from "@src/news/NewsList";
import { newsListFragment } from "@src/news/NewsList.fragment";
import { createGraphQLFetchWithPreviewHeaders } from "@src/util/graphQLClient";
import { draftMode } from "next/headers";

import { GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables } from "./page.generated";

export default async function NewsIndexPage() {
    let previewData: SitePreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const graphqlFetch = createGraphQLFetchWithPreviewHeaders(previewData);
    const locale = /*context.locale ??*/ defaultLanguage;
    const scope = { domain, language: locale };

    const { newsList } = await graphqlFetch<GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables>(
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
