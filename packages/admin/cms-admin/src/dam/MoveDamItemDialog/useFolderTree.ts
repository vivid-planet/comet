import React from "react";

import { traversePreOrder, TreeMap } from "../../pages/pageTree/treemap/TreeMapUtils";
import { GQLAllFoldersWithoutFiltersQuery } from "./ChooseFolder";

interface FolderTreeFolder {
    id: string;
    name: string;
    mpath: string[];
    parentId: string | null;
}
export interface FolderWithRenderInformation extends FolderTreeFolder {
    level: number;
    expanded: boolean;
}

export type FolderTreeMap = TreeMap<FolderTreeFolder>;

interface UseFolderTreeProps {
    damFoldersFlat?: GQLAllFoldersWithoutFiltersQuery["damFoldersFlat"];
}
interface UseFolderTreeApi {
    tree: FolderTreeMap;
    foldersToRender: Array<FolderWithRenderInformation>;
    expandedIds: Set<string>;
    setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    toggleExpand: (id: string) => void;
    selectedId: string | null | undefined;
    setSelectedId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

export const useFolderTree = ({ damFoldersFlat }: UseFolderTreeProps): UseFolderTreeApi => {
    const [selectedId, setSelectedId] = React.useState<string | null>();
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());
    const [foldersToRender, setFoldersToRender] = React.useState<Array<FolderWithRenderInformation>>([]);

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
        const newFoldersToRender: Array<FolderWithRenderInformation> = [];

        traversePreOrder(tree, (element, level) => {
            const isParentVisible = element.parentId !== null ? newFoldersToRender.find((node) => node.id === element.parentId) : true;
            const isParentExpanded = element.parentId !== null ? expandedIds.has(element.parentId) : true;

            if (isParentVisible && isParentExpanded) {
                newFoldersToRender.push({ ...element, level, expanded: expandedIds.has(element.id) });
            }
        });

        setFoldersToRender(newFoldersToRender);

        // This should only be executed if the searchQuery changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expandedIds, tree]);

    return { tree, foldersToRender, expandedIds, setExpandedIds, toggleExpand, selectedId, setSelectedId };
};
