import { gql } from "@comet/site-react";
import type { PublicSiteConfig } from "@src/site-configs";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { NotFoundError } from "@src/util/rscErrors";

import { Content } from "./content";
import { fragment } from "./fragment";
import { type GQLNewsDetailPageQuery, type GQLNewsDetailPageQueryVariables } from "./page.generated";

interface Props {
    params: {
        slug: string;
    };
    scope: {
        domain: string;
        language: string;
    };
    siteConfig: PublicSiteConfig;
}
export async function NewsDetailPage({ scope, params }: Props) {
    const graphqlFetch = createGraphQLFetch();

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
        { slug: params.slug, scope },
    );

    if (data.newsBySlug === null) {
        throw new NotFoundError();
    }

    return <Content news={data.newsBySlug} />;
}
