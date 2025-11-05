import { gql } from "@comet/site-react";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import type { Context } from "hono";
import { SitemapStream, streamToPromise } from "sitemap";

import type { GQLPrebuildPageDataListSitemapQuery, GQLPrebuildPageDataListSitemapQueryVariables } from "./sitemap.xml.generated";

export async function sitemapXmlRoute(c: Context) {
    const siteConfig = c.get("siteConfig");
    const graphqlFetch = createGraphQLFetch();

    try {
        const smStream = new SitemapStream({ hostname: siteConfig.url });

        for (const language of siteConfig.scope.languages) {
            const domain = siteConfig.scope.domain;
            const scope = { domain, language };

            let totalCount = 0;
            let currentCount = 0;

            do {
                const { paginatedPageTreeNodes } = await graphqlFetch<
                    GQLPrebuildPageDataListSitemapQuery,
                    GQLPrebuildPageDataListSitemapQueryVariables
                >(pageDataListQuery, {
                    scope,
                    offset: currentCount,
                    limit: 50,
                });
                totalCount = paginatedPageTreeNodes.totalCount;
                currentCount += paginatedPageTreeNodes.nodes.length;

                for (const pageTreeNode of paginatedPageTreeNodes.nodes) {
                    if (pageTreeNode) {
                        const path: string = pageTreeNode.path;

                        if (path && pageTreeNode.document?.__typename === "Page") {
                            const seoBlock = pageTreeNode.document.seo;
                            if (!seoBlock.noIndex) {
                                smStream.write({
                                    url: `${siteConfig.url}/${scope.language}${pageTreeNode.path}`,
                                    priority: Number(seoBlock.priority.replace("_", ".")),
                                    changefreq: seoBlock.changeFrequency,
                                    lastmod: pageTreeNode.document.updatedAt,
                                });
                            }
                        }
                    }
                }
            } while (totalCount > currentCount);
        }
        smStream.end();
        const sitemap = (await streamToPromise(smStream)).toString(); //TODO response could be streamed for better performance

        return new Response(sitemap, { headers: { "Content-Type": "application/xml" } });
    } catch (e) {
        console.error(e);
        return c.text("Internal Server Error", 500);
    }
}

const pageDataListQuery = gql`
    query PrebuildPageDataListSitemap($scope: PageTreeNodeScopeInput!, $offset: Int, $limit: Int) {
        paginatedPageTreeNodes(scope: $scope, offset: $offset, limit: $limit) {
            nodes {
                id
                path
                document {
                    __typename
                    ... on Page {
                        updatedAt
                        seo
                    }
                }
            }
            totalCount
        }
    }
`;
