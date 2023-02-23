import React from "react";

import { GQLAllFoldersWithoutFiltersQuery } from "../../graphql.generated";
import { traversePreOrder, TreeMap } from "../../pages/pageTree/treemap/TreeMapUtils";

export interface FolderTreeFolder {
    id: string;
    name: string;
    mpath: string[];
    parentId: string | null;
}

export type FolderTreeMap = TreeMap<FolderTreeFolder>;

interface UseFolderTreeProps {
    damFoldersFlat?: GQLAllFoldersWithoutFiltersQuery["damFoldersFlat"];
}
interface UseFolderTreeApi {
    tree: FolderTreeMap;
    foldersToRender: Array<{ element: FolderTreeFolder; level: number }>;
    expandedIds: Set<string>;
    setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    toggleExpand: (id: string) => void;
}

export const useFolderTree = ({ damFoldersFlat }: UseFolderTreeProps): UseFolderTreeApi => {
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());
    const [foldersToRender, setFoldersToRender] = React.useState<Array<{ element: FolderTreeFolder; level: number }>>([]);

    const toggleExpand = React.useCallback((id: string) => {
        setExpandedIds((expandedIds) => {
            const newExpandedIds = new Set(expandedIds);

            if (expandedIds.has(id)) {
                newExpandedIds.delete(id);
            } else {
                newExpandedIds.add(id);
            }

            return newExpandedIds;
        });
    }, []);

    const tree = React.useMemo(() => {
        const folderTreeMap: FolderTreeMap = new TreeMap();
        if (damFoldersFlat === undefined) {
            return folderTreeMap;
        }

        for (const folder of damFoldersFlat) {
            const parentId = folder.parent?.id ?? "root";

            let existingSiblingFolders: FolderTreeFolder[] = [];
            if (folderTreeMap.has(parentId)) {
                existingSiblingFolders = folderTreeMap.get(parentId) as FolderTreeFolder[];
            }

            folderTreeMap.set(parentId, [
                ...existingSiblingFolders,
                {
                    id: folder.id,
                    name: folder.name,
                    mpath: folder.mpath,
                    parentId: folder.parent?.id ?? null,
                },
            ]);
        }

        return folderTreeMap;
    }, [damFoldersFlat]);

    React.useEffect(() => {
        const newFoldersToRender: Array<{ element: FolderTreeFolder; level: number }> = [];

        traversePreOrder(tree, (element, level) => {
            const isParentVisible = element.parentId !== null ? newFoldersToRender.find((node) => node.element.id === element.parentId) : true;
            const isParentExpanded = element.parentId !== null ? expandedIds.has(element.parentId) : true;

            if (isParentVisible && isParentExpanded) {
                newFoldersToRender.push({ element, level });
            }
        });

        setFoldersToRender(newFoldersToRender);

        // This should only be executed if the searchQuery changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expandedIds, tree]);

    return { tree, foldersToRender, expandedIds, setExpandedIds, toggleExpand };
};
