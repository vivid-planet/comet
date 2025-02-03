export const dynamic = "error";

import { gql } from "@comet/cms-site";
import { GQLNewsContentScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { mapPreviewParamToPreviewData } from "@src/util/siteConfig";
import { notFound } from "next/navigation";

import { Content } from "./content";
import { fragment } from "./fragment";
import { GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables } from "./page.generated";

export default async function NewsDetailPage({
    params: { domain, language, preview, slug },
}: {
    params: { domain: string; language: string; preview: string; slug: string };
}) {
    const graphqlFetch = createGraphQLFetch(mapPreviewParamToPreviewData(preview));

    const data = await graphqlFetch<GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables>(
        gql`
            query NewsDetailPage($slug: String!, $scope: NewsContentScopeInput!) {
                newsBySlug(slug: $slug, scope: $scope) {
                    id
                    ...NewsDetailPage
                }
            }
            ${fragment}
        `,
        { slug, scope: { domain: domain, language: language } as GQLNewsContentScopeInput },
    );

    if (data.newsBySlug === null) {
        notFound();
    }

    return <Content news={data.newsBySlug} />;
}
