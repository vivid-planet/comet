import { gql } from "@apollo/client";
import escapeRegExp from "lodash.escaperegexp";
import * as React from "react";

import { TextMatch } from "../../common/MarkedMatches";
import { PageTreePage } from "../pageTree/usePageTree";
import { GQLPageSearchFragment } from "./usePageSearch.generated";

export type PageSearchMatch = TextMatch & { page: { id: string; ancestorIds: string[] }; where: "name" | "path" };

export const pageSearchFragment = gql`
    fragment PageSearch on PageTreeNode {
        id
        name
        path
    }
`;

export interface PageSearchApi {
    pagesToRenderWithMatches: PageTreePage[];
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    currentMatch?: number;
    totalMatches?: number;
    jumpToNextMatch?: () => void;
    jumpToPreviousMatch?: () => void;
}

interface UsePageSearchOptions {
    tree: Map<string, GQLPageSearchFragment[]>;
    pagesToRender: PageTreePage[];
    domain: string;
    setExpandedIds: React.Dispatch<React.SetStateAction<string[]>>;
    onUpdateCurrentMatch: (pageId: string, pages: PageTreePage[]) => void;
}

const usePageSearch = ({ tree, domain, setExpandedIds, onUpdateCurrentMatch, pagesToRender }: UsePageSearchOptions): PageSearchApi => {
    const [matches, setMatches] = React.useState<PageSearchMatch[] | null>(null);
    const [currentMatchIndex, setCurrentMatchIndex] = React.useState<number | null>(null);
    const [query, setQuery] = React.useState("");

    const inorderPages = React.useMemo(() => {
        const buildPagesForParent = (parentId = "root", ancestorIds: string[] = []) => {
            const returnValue: Array<{ id: string; parentId: string | null; name: string; ancestorIds: string[]; path: string }> = [];

            const pagesForParent = tree.get(parentId) || [];

            pagesForParent.forEach((page) => {
                returnValue.push({
                    id: page.id,
                    name: page.name,
                    parentId,
                    ancestorIds,
                    path: page.path,
                });

                const hasChildren = tree.has(page.id);

                if (hasChildren) {
                    returnValue.push(...buildPagesForParent(page.id, [...ancestorIds, page.id]));
                }
            });

            return returnValue;
        };

        return buildPagesForParent();
    }, [tree]);

    const expandTreeForMatches = React.useCallback(
        (matches: PageSearchMatch[]) => {
            setExpandedIds((previousExpandedIds) => {
                const expandedIds = [...previousExpandedIds];

                matches.forEach((match) => {
                    expandedIds.push(...match.page.ancestorIds.filter((ancestorId) => !expandedIds.includes(ancestorId)));
                });

                return expandedIds;
            });
        },
        [setExpandedIds],
    );

    React.useEffect(() => {
        if (!query) {
            setMatches(null);
            setCurrentMatchIndex(null);
            return;
        }

        const matches: PageSearchMatch[] = [];

        try {
            const url = new URL(query);

            if (!url.host.includes(domain)) {
                return;
            }

            const pageExactMatch = inorderPages.find((page) => page.path === url.pathname);

            if (pageExactMatch) {
                const { id, name, ancestorIds } = pageExactMatch;
                matches.push({ page: { id, ancestorIds }, start: 0, end: name.length - 1, focused: true, where: "name" });
            }
        } catch {
            const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");

            inorderPages.forEach((page) => {
                let match;

                while ((match = regex.exec(page.path)) !== null) {
                    const { id, ancestorIds } = page;
                    const where = "path";
                    matches.push({
                        page: { id, ancestorIds },
                        start: match.index,
                        end: match.index + query.length - 1,
                        focused: matches.length === 0,
                        where,
                    });
                }
                regex.lastIndex = 0;

                while ((match = regex.exec(page.name)) !== null) {
                    const { id, ancestorIds } = page;
                    const where = "name";
                    matches.push({
                        page: { id, ancestorIds },
                        start: match.index,
                        end: match.index + query.length - 1,
                        focused: matches.length === 0,
                        where,
                    });
                }
            });
        }

        setMatches(matches);
        setCurrentMatchIndex(0);

        expandTreeForMatches(matches);
    }, [query, inorderPages, domain, expandTreeForMatches]);

    const pagesToRenderWithMatches = React.useMemo(
        () => pagesToRender.map((c) => ({ ...c, matches: matches?.filter((match) => match.page.id === c.id) ?? [] })),
        [matches, pagesToRender],
    );

    const pageSearchPartialApi = React.useMemo(() => {
        if (matches === null || currentMatchIndex === null) {
            return {};
        }

        if (matches.length === 0) {
            return { currentMatch: 0, totalMatches: 0 };
        }

        const jumpToNextMatch = () => {
            updateCurrentMatch(currentMatchIndex === matches.length - 1 ? 0 : currentMatchIndex + 1);
        };

        const jumpToPreviousMatch = () => {
            updateCurrentMatch(currentMatchIndex === 0 ? matches.length - 1 : currentMatchIndex - 1);
        };

        const updateCurrentMatch = (nextCurrentMatchIndex: number) => {
            setMatches(matches.map((match, index) => ({ ...match, focused: index === nextCurrentMatchIndex })));
            setCurrentMatchIndex(nextCurrentMatchIndex);
            const pageIdOfCurrentMatch = matches[nextCurrentMatchIndex].page.id;
            onUpdateCurrentMatch(pageIdOfCurrentMatch, pagesToRenderWithMatches);
        };

        return {
            currentMatch: currentMatchIndex,
            totalMatches: matches.length,
            jumpToNextMatch,
            jumpToPreviousMatch,
        };
    }, [matches, currentMatchIndex, onUpdateCurrentMatch, pagesToRenderWithMatches]);

    return { query, setQuery, pagesToRenderWithMatches, ...pageSearchPartialApi };
};

export { usePageSearch };
