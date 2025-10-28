import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type PageTreeIndexBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

import { type LoadedData, type PageTreeNode } from "./PageTreeIndexBlock.loader";
import styles from "./PageTreeIndexBlock.module.scss";

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
        <ul className={styles.pageTreeIndexBlock__list}>
            {nodes.map((node) => (
                <li key={node.id} className={styles.pageTreeIndexBlock__listItem}>
                    <a href={node.path} className={styles.pageTreeIndexBlock__link}>
                        {node.name}
                    </a>
                    {node.children.length > 0 && renderTree(node.children)}
                </li>
            ))}
        </ul>
    );
}

export const PageTreeIndexBlock = withPreview(
    ({ data: { loaded: allNodes } }: PropsWithData<PageTreeIndexBlockData & { loaded: LoadedData }>) => {
        if (allNodes.length === 0) {
            return null;
        }

        const tree = buildTree(allNodes);
        return (
            <PageLayout grid>
                <div className={styles.pageTreeIndexBlock__layoutContent}>{renderTree(tree)}</div>
            </PageLayout>
        );
    },
    { label: "Page Tree Index" },
);
