import escapeRegExp from "lodash.escaperegexp";
import React from "react";

import { traversePreOrder } from "../../pages/pageTree/treemap/TreeMapUtils";
import { FolderSearchMatch } from "./MoveDamItemDialog";
import { FolderTreeMap, FolderWithRenderInformation } from "./useFolderTree";

const findMatchesAndExpandedIdsBasedOnSearchQuery = (
    searchQuery: string,
    { folderTree, expandedIds }: { folderTree: FolderTreeMap; expandedIds: Set<string> },
) => {
    const internalExpandedIds = new Set(expandedIds);
    const newMatches: FolderSearchMatch[] = [];
    const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, "gi");

    traversePreOrder(folderTree, (element) => {
        let hasMatch = false;

        let match: RegExpExecArray | null;
        while ((match = regex.exec(element.name)) !== null) {
            hasMatch = true;

            newMatches.push({
                start: match.index,
                end: match.index + searchQuery.length - 1,
                focused: newMatches.length === 0,
                folder: {
                    id: element.id,
                },
            });
        }

        if (hasMatch) {
            internalExpandedIds.add(element.id);
            for (const ancestorId of element.mpath) {
                internalExpandedIds.add(ancestorId);
            }
        }
    });

    return { matches: newMatches, expandedIds: internalExpandedIds };
};

export interface FolderWithMatches extends FolderWithRenderInformation {
    matches: FolderSearchMatch[] | null;
}

interface UseFolderTreeSearchProps {
    folderTree: FolderTreeMap;
    foldersToRender: Array<FolderWithRenderInformation>;
    setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}
interface UseFolderTreeSearchApi {
    foldersToRenderWithMatches: FolderWithMatches[];
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    currentMatchIndex?: number;
    focusedFolderId?: string;
    totalMatches?: number;
    updateCurrentMatchIndex: (index: number | undefined) => void;
    jumpToNextMatch?: () => void;
    jumpToPreviousMatch?: () => void;
}

export const useFolderTreeSearch = ({ folderTree, foldersToRender, setExpandedIds }: UseFolderTreeSearchProps): UseFolderTreeSearchApi => {
    const [query, setQuery] = React.useState("");
    const [matches, setMatches] = React.useState<FolderSearchMatch[] | null>(null);
    const [currentMatchIndex, setCurrentMatchIndex] = React.useState<number | undefined>(undefined);

    const updateCurrentMatchIndex = React.useCallback(
        (nextCurrentMatchIndex: number | undefined) => {
            if (matches === null) {
                return;
            }

            setMatches(matches.map((match, index) => ({ ...match, focused: index === nextCurrentMatchIndex })));
            setCurrentMatchIndex(nextCurrentMatchIndex);
        },
        [matches],
    );

    const jumpToNextMatch = React.useCallback(() => {
        if (matches === null || currentMatchIndex === undefined) {
            return;
        }

        updateCurrentMatchIndex(currentMatchIndex === matches.length - 1 ? 0 : currentMatchIndex + 1);
    }, [currentMatchIndex, matches, updateCurrentMatchIndex]);

    const jumpToPreviousMatch = React.useCallback(() => {
        if (matches === null || currentMatchIndex === undefined) {
            return;
        }

        updateCurrentMatchIndex(currentMatchIndex === 0 ? matches.length - 1 : currentMatchIndex - 1);
    }, [currentMatchIndex, matches, updateCurrentMatchIndex]);

    React.useEffect(() => {
        if (query === undefined || query.length === 0) {
            setMatches([]);
            return;
        }

        setExpandedIds((prevExpandedIds) => {
            const { matches: newMatches, expandedIds: newExpandedIds } = findMatchesAndExpandedIdsBasedOnSearchQuery(query, {
                folderTree,
                expandedIds: prevExpandedIds,
            });

            setMatches(newMatches);

            return newExpandedIds;
        });

        // This should only be executed if the searchQuery changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const foldersToRenderWithMatches = React.useMemo(
        () => foldersToRender.map((folder) => ({ ...folder, matches: matches?.filter((match) => match.folder.id === folder.id) ?? [] })),
        [matches, foldersToRender],
    );

    return {
        foldersToRenderWithMatches,
        query,
        setQuery,
        currentMatchIndex,
        focusedFolderId: currentMatchIndex === undefined ? undefined : matches?.[currentMatchIndex]?.folder?.id,
        totalMatches: matches?.length,
        updateCurrentMatchIndex,
        jumpToNextMatch,
        jumpToPreviousMatch,
    };
};
