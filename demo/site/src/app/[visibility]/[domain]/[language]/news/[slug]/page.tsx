<<<<<<< HEAD:demo/site/src/app/[domain]/[language]/news/[slug]/page.tsx
import { gql, previewParams } from "@comet/cms-site";
import { type GQLNewsContentScopeInput } from "@src/graphql.generated";
=======
export const dynamic = "error";

import { gql } from "@comet/cms-site";
import { GQLNewsContentScopeInput } from "@src/graphql.generated";
import { VisibilityParam } from "@src/middleware/domainRewrite";
>>>>>>> main:demo/site/src/app/[visibility]/[domain]/[language]/news/[slug]/page.tsx
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { setVisibilityParam } from "@src/util/ServerContext";
import { notFound } from "next/navigation";

import { Content } from "./content";
import { fragment } from "./fragment";
import { type GQLNewsDetailPageQuery, type GQLNewsDetailPageQueryVariables } from "./page.generated";

export default async function NewsDetailPage({
    params: { domain, language, slug, visibility },
}: {
    params: { domain: string; language: string; slug: string; visibility: VisibilityParam };
}) {
    setVisibilityParam(visibility);
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
        { slug, scope: { domain: domain, language: language } as GQLNewsContentScopeInput },
    );

    if (data.newsBySlug === null) {
        notFound();
    }

    return <Content news={data.newsBySlug} />;
}
