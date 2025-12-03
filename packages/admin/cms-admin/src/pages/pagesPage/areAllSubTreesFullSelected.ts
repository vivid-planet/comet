import { subTreeFromId, traverse, type TreeMap, type TreeMapNode } from "../pageTree/treemap/TreeMapUtils";

export const areAllSubTreesFullSelected = (selectedNodeIds: string[], tree: TreeMap<TreeMapNode>): boolean => {
    let fullSelected = true;

    selectedNodeIds.forEach((selectedNodeId) => {
        const subTree = subTreeFromId(selectedNodeId, tree);
        traverse(subTree, (subTreeElement) => {
            const selected = selectedNodeIds.some((id) => {
                return id === subTreeElement.id;
            });
            if (!selected) {
                fullSelected = false;
            }
        });
    });

    return fullSelected;
};
