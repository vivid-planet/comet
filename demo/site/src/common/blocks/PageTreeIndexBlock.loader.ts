import { type BlockLoader, gql } from "@comet/site-nextjs";
import { type PageTreeIndexBlockData } from "@src/blocks.generated";

import { type GQLPrebuildPageDataListSitemapQuery, type GQLPrebuildPageDataListSitemapQueryVariables } from "./PageTreeIndexBlock.loader.generated";

export type PageTreeNode = {
    id: string;
    path: string;
    name: string;
    parentId: string | null;
};

export type LoadedData = PageTreeNode[];

export const loader: BlockLoader<PageTreeIndexBlockData> = async ({ graphQLFetch, scope }): Promise<LoadedData> => {
    let totalCount = 0;
    let currentCount = 0;
    const pageSize = 100;
    const allNodes: PageTreeNode[] = [];

    do {
        const { paginatedPageTreeNodes } = await graphQLFetch<GQLPrebuildPageDataListSitemapQuery, GQLPrebuildPageDataListSitemapQueryVariables>(
            gql`
                query PrebuildPageDataListSitemap($scope: PageTreeNodeScopeInput!, $offset: Int, $limit: Int) {
                    paginatedPageTreeNodes(scope: $scope, offset: $offset, limit: $limit) {
                        nodes {
                            id
                            name
                            path
                            parentId
                        }
                        totalCount
                    }
                }
            `,
            {
                scope,
                offset: currentCount,
                limit: pageSize,
            },
        );

        totalCount = paginatedPageTreeNodes.totalCount;
        currentCount += paginatedPageTreeNodes.nodes.length;
        allNodes.push(...paginatedPageTreeNodes.nodes);
    } while (totalCount > currentCount);

    return allNodes;
};
