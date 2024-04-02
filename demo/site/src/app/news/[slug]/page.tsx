import { PreviewData } from "@src/app/api/site-preview/route";
import { defaultLanguage, domain } from "@src/config";
import { NewsDetail } from "@src/news/NewsDetail";
import { newsDetailFragment } from "@src/news/NewsDetail.fragment";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables } from "./page.generated";

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
    let previewData: PreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const client = createGraphQLClient(previewData);
    const locale = /*context.locale ??*/ defaultLanguage;
    const scope = { domain, language: locale };

    const data = await client.request<GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables>(
        gql`
            query NewsDetailPage($slug: String!, $scope: NewsContentScopeInput!) {
                newsBySlug(slug: $slug, scope: $scope) {
                    ...NewsDetail
                }
            }

            ${newsDetailFragment}
        `,
        { slug: params.slug, scope },
    );

    if (data.newsBySlug === null) {
        notFound();
    }

    const { newsBySlug: news } = data;

    return <NewsDetail news={news} />;
}
