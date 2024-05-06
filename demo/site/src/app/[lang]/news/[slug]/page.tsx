import { gql, previewParams } from "@comet/cms-site";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { domain } from "@src/config";
import { GQLNewsContentScopeInput } from "@src/graphql.generated";
import { NewsContentBlock } from "@src/news/blocks/NewsContentBlock";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { notFound } from "next/navigation";
import { FormattedDate } from "react-intl";

import { GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables } from "./page.generated";

export default async function NewsDetailPage({ params }: { params: { slug: string; lang: string } }) {
    const { scope, previewData } = previewParams() || { scope: { domain, language: params.lang }, previewData: undefined };
    const graphqlFetch = createGraphQLFetch(previewData);

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
        { slug: params.slug, scope: scope as GQLNewsContentScopeInput },
    );

    if (data.newsBySlug === null) {
        notFound();
    }

    const { newsBySlug: news } = data;

    return (
        <div>
            <DamImageBlock data={news.image} layout="responsive" sizes="100vw" aspectRatio="16x9" />
            <h1>{news.title}</h1>
            <p>
                <FormattedDate value={news.createdAt} />
            </p>
            <hr />
            <NewsContentBlock data={news.content} />
        </div>
    );
}
