export const dynamic = "error";

import { gql, JsonLd } from "@comet/site-nextjs";
import type { GQLNewsContentScopeInput } from "@src/graphql.generated";
import type { VisibilityParam } from "@src/middleware/domainRewrite";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { setVisibilityParam } from "@src/util/ServerContext";
import { buildArticle } from "@src/util/structuredData/buildArticle";
import { buildOrganizationNode } from "@src/util/structuredData/buildOrganization";
import { siteSettingsFragment } from "@src/util/structuredData/SiteSettings.fragment";
import { notFound } from "next/navigation";
import type { Article } from "schema-dts";

import { Content } from "./content";
import { fragment } from "./fragment";
import type { GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables } from "./page.generated";

export default async function NewsDetailPage({ params }: PageProps<"/[visibility]/[domain]/[language]/news/[slug]">) {
    const { domain, language, slug, visibility } = await params;
    setVisibilityParam(visibility as VisibilityParam);
    const scope = { domain, language };
    const graphqlFetch = createGraphQLFetch();

    const data = await graphqlFetch<GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables>(
        gql`
            query NewsDetailPage($slug: String!, $scope: NewsContentScopeInput!, $siteSettingsScope: SiteSettingsScopeInput!) {
                newsBySlug(slug: $slug, scope: $scope) {
                    id
                    ...NewsDetailPage
                }
                siteSettings(scope: $siteSettingsScope) {
                    ...SiteSettings
                }
            }
            ${fragment}
            ${siteSettingsFragment}
        `,
        { slug, scope: scope as GQLNewsContentScopeInput, siteSettingsScope: scope },
    );

    if (data.newsBySlug === null) {
        notFound();
    }

    let organization = null;

    if (data.siteSettings) {
        const content = await recursivelyLoadBlockData({
            blockData: data.siteSettings.content,
            blockType: "SiteSettingsContent",
            graphQLFetch: graphqlFetch,
            fetch,
            scope,
        });
        organization = buildOrganizationNode(content, scope);
    }

    const article = buildArticle({ news: data.newsBySlug, scope, organization });

    return (
        <>
            <JsonLd<Article> data={article} />
            <Content news={data.newsBySlug} />
        </>
    );
}
