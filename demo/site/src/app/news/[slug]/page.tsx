import { gql } from "@comet/cms-site";
import { SitePreviewData } from "@src/app/api/site-preview/route";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { defaultLanguage, domain } from "@src/config";
import { NewsContentBlock } from "@src/news/blocks/NewsContentBlock";
import { createGraphQLFetchWithPreviewHeaders } from "@src/util/graphQLClient";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables } from "./page.generated";

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
    let previewData: SitePreviewData | undefined = undefined;
    if (draftMode().isEnabled) {
        previewData = { includeInvisible: false };
    }
    const graphqlFetch = createGraphQLFetchWithPreviewHeaders(previewData);
    const locale = /*context.locale ??*/ defaultLanguage;
    const scope = { domain, language: locale };

    const data = await graphqlFetch<GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables>(
        gql`
            query NewsDetailPage($slug: String!, $scope: NewsContentScopeInput!) {
                newsBySlug(slug: $slug, scope: $scope) {
                    id
                    title
                    image
                    createdAt
                    content
                }
            }
        `,
        { slug: params.slug, scope },
        { next: { revalidate: 3 } },
    );

    if (data.newsBySlug === null) {
        notFound();
    }

    const { newsBySlug: news } = data;

    return (
        <div>
            <DamImageBlock data={news.image} layout="responsive" sizes="100vw" aspectRatio="16x9" />
            <h1>{news.title}</h1>
            {/*<p><FormattedDate value={news.createdAt} /></p>*/}
            <hr />
            <NewsContentBlock data={news.content} />
        </div>
    );
}
