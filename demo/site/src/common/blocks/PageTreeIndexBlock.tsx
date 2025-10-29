import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type PageTreeIndexBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { createSitePath } from "@src/util/createSitePath";
import NextLink from "next/link";

import { type LoadedData, type PageTreeNode } from "./PageTreeIndexBlock.loader";
import styles from "./PageTreeIndexBlock.module.scss";

type PageTreeNodeWithChildren = PageTreeNode & { children: PageTreeNodeWithChildren[] };

class TreeMap<T extends PageTreeNode> extends Map<string, Array<T>> {}

const arrayToTreeMap = <T extends PageTreeNode>(nodes: T[]): TreeMap<T> => {
    const nodeMap = new TreeMap<T>();
    nodes.forEach((node) => {
        const parentId = node.parentId || "root";
        const children = nodeMap.get(parentId) || [];
        nodeMap.set(parentId, [...children, node]);
    });
    return nodeMap;
};

function buildTree<T extends PageTreeNode>(treeMap: TreeMap<T>, parentId = "root"): PageTreeNodeWithChildren[] {
    const nodes = treeMap.get(parentId) || [];
    return nodes.map((node) => ({
        ...node,
        children: buildTree(treeMap, node.id),
    }));
}

function renderTree(nodes: PageTreeNodeWithChildren[]): JSX.Element {
    return (
        <ul className={styles.listItem}>
            {nodes.map((node) => (
                <li key={node.id} className={styles.list}>
                    <NextLink href={createSitePath({ path: node.path, scope: node.scope })} className={styles.link}>
                        {node.name}
                    </NextLink>
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

        const treeMap = arrayToTreeMap(allNodes);
        const tree = buildTree(treeMap);
        return (
            <PageLayout grid>
                <div className={styles.root}>{renderTree(tree)}</div>
            </PageLayout>
        );
    },
    { label: "Page Tree Index" },
);
