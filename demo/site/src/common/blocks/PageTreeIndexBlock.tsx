import { gql } from "@comet/site-nextjs";
import { PageLayout } from "@src/layout/PageLayout";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { useEffect, useState } from "react";

import styles from "./PageTreeIndexBlock.module.scss";

const pageTreeQuery = gql`
    query PrebuildPageDataListSitemap($scope: PageTreeNodeScopeInput!, $offset: Int, $limit: Int) {
        paginatedPageTreeNodes(scope: $scope, offset: $offset, limit: $limit) {
            nodes {
                id
                name
                path
                parentId
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

type PageTreeNode = {
    id: string;
    path: string;
    name: string;
    parentId: string | null;
};

type PageTreeNodeWithChildren = PageTreeNode & { children: PageTreeNodeWithChildren[] };

function buildTree(nodes: PageTreeNode[]): PageTreeNodeWithChildren[] {
    const nodeMap: Record<string, PageTreeNodeWithChildren> = {};
    const roots: PageTreeNodeWithChildren[] = [];
    nodes.forEach((node) => {
        nodeMap[node.id] = { ...node, children: [] };
    });
    nodes.forEach((node) => {
        if (node.parentId && nodeMap[node.parentId]) {
            nodeMap[node.parentId].children.push(nodeMap[node.id]);
        } else {
            roots.push(nodeMap[node.id]);
        }
    });
    return roots;
}

function renderTree(nodes: PageTreeNodeWithChildren[]): JSX.Element {
    return (
        <ul className={styles.list}>
            {nodes.map((node) => (
                <li key={node.id} className={styles.listElement}>
                    <a href={node.path} className={styles.link}>
                        {node.name || node.path}
                    </a>
                    {node.children.length > 0 && renderTree(node.children)}
                </li>
            ))}
        </ul>
    );
}

export function PageTreeIndexBlock(): JSX.Element {
    const [pageTreeNodes, setPageTreeNodes] = useState<PageTreeNode[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const graphQLFetch = createGraphQLFetch();

        async function fetchPageTreeNodes() {
            try {
                const scope = { domain: "main", language: "en" };
                let totalCount = 0;
                let currentCount = 0;
                let allNodes: PageTreeNode[] = [];
                do {
                    const result = (await graphQLFetch(pageTreeQuery, {
                        scope,
                        offset: currentCount,
                        limit: 50,
                    })) as {
                        paginatedPageTreeNodes: {
                            nodes: PageTreeNode[];
                            totalCount: number;
                        };
                    };
                    const paginatedPageTreeNodes = result.paginatedPageTreeNodes;
                    totalCount = paginatedPageTreeNodes.totalCount;
                    currentCount += paginatedPageTreeNodes.nodes.length;
                    allNodes = allNodes.concat(
                        paginatedPageTreeNodes.nodes.map((node) => ({
                            id: node.id,
                            path: node.path,
                            name: node.name,
                            parentId: node.parentId ?? null,
                        })),
                    );
                } while (totalCount > currentCount);
                setPageTreeNodes(allNodes);
            } catch (err) {
                setError(String(err));
            }
        }
        fetchPageTreeNodes();
    }, []);

    if (error) return <pre>Error: {error}</pre>;
    if (!pageTreeNodes.length) return <p>Loading...</p>;

    const tree = buildTree(pageTreeNodes);

    return (
        <PageLayout grid>
            <div className={styles.pageLayoutContent}>{renderTree(tree)}</div>
        </PageLayout>
    );
}
