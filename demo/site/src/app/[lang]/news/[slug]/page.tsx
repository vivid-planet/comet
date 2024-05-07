import { gql, previewParams } from "@comet/cms-site";
import { domain } from "@src/config";
import { GQLNewsContentScopeInput } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { notFound } from "next/navigation";

import { Content, fragment } from "./content";
import { GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables } from "./page.generated";

export default async function NewsDetailPage({ params }: { params: { slug: string; lang: string } }) {
    const { scope, previewData } = previewParams() || { scope: { domain, language: params.lang }, previewData: undefined };
    const graphqlFetch = createGraphQLFetch(previewData);

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
        { slug: params.slug, scope: scope as GQLNewsContentScopeInput },
    );

    if (data.newsBySlug === null) {
        notFound();
    }

    return <Content news={data.newsBySlug} />;
}
