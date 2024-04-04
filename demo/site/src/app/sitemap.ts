import { defaultLanguage, domain } from "@src/config";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { MetadataRoute } from "next";

import { GQLPrebuildPageDataListSitemapQuery, GQLPrebuildPageDataListSitemapQueryVariables } from "./sitemap.generated";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemap: MetadataRoute.Sitemap = [];
    const client = createGraphQLClient();

    const scope = { domain, language: defaultLanguage }; // TODO support multiple languages (earch it's own sitemap?)

    let totalCount = 0;
    let currentCount = 0;

    do {
        const { paginatedPageTreeNodes } = await client.request<GQLPrebuildPageDataListSitemapQuery, GQLPrebuildPageDataListSitemapQueryVariables>(
            pageDataListQuery,
            {
                scope,
                offset: currentCount,
                limit: 50,
            },
        );
        totalCount = paginatedPageTreeNodes.totalCount;
        currentCount += paginatedPageTreeNodes.nodes.length;

        for (const pageTreeNode of paginatedPageTreeNodes.nodes) {
            if (pageTreeNode) {
                const path: string = pageTreeNode.path;

                if (path && pageTreeNode.document?.__typename === "Page") {
                    const seoBlock = pageTreeNode.document.seo;
                    if (!seoBlock.noIndex) {
                        sitemap.push({
                            url: process.env.SITE_URL + pageTreeNode.path, // TODO support multiple site domains
                            priority: Number(seoBlock.priority.replace("_", ".")),
                            changeFrequency: seoBlock.changeFrequency,
                            lastModified: pageTreeNode.document.updatedAt,
                        });
                    }
                }
            }
        }
    } while (totalCount > currentCount);

    return sitemap;
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
