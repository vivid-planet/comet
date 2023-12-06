import { ObservableQuery, useApolloClient } from "@apollo/client";
import { IEditDialogApi, UndoSnackbar, useSnackbarApi } from "@comet/admin";
import { styled } from "@mui/material/styles";
import gql from "graphql-tag";
import isEqual from "lodash.isequal";
import React, { useImperativeHandle, useRef } from "react";
import { FormattedMessage } from "react-intl";
import AutoSizer from "react-virtualized-auto-sizer";
import { Align, FixedSizeList as List } from "react-window";
import { useDebouncedCallback } from "use-debounce";

import { useContentScope } from "../../contentScope/Provider";
import { GQLPagesQuery, GQLPagesQueryVariables } from "../pagesPage/createPagesQuery";
import {
    GQLMovePageTreeNodesByPosMutation,
    GQLPagesCacheQuery,
    GQLPagesCacheQueryVariables,
    GQLPageSlugPathFragment,
    GQLResetSlugMutation,
    GQLResetSlugMutationVariables,
} from "./PageTree.generated";
import PageTreeDragLayer from "./PageTreeDragLayer";
import PageTreeRow, { DropTarget, PageTreeDragObject } from "./PageTreeRow";
import PageTreeService, { DropInfo } from "./PageTreeService";
import { useDndWindowScroll } from "./useDndWindowScroll/useDndWindowScroll";
import { PageTreePage } from "./usePageTree";

interface PageTreeProps {
    pages: PageTreePage[];
    editDialogApi: IEditDialogApi;
    toggleExpand: (pageId: string) => void;
    onSelectChanged: (pageId: string, value: boolean) => void;
    category: string;
    siteUrl: string;
}

type PageTreeRefApi = { scrollToItem: List["scrollToItem"] };

const MOVE_PAGE_TREE_NODES_BY_POS = gql`
    mutation MovePageTreeNodesByPos($ids: [ID!]!, $input: MovePageTreeNodesByPosInput!) {
        movePageTreeNodesByPos(ids: $ids, input: $input) {
            id
            parentId
            pos
            slug
            path
        }
    }
`;

const MOVE_PAGE_TREE_NODES_BY_NEIGHBOURS = gql`
    mutation MovePageTreeNodesByNeighbour($ids: [ID!]!, $input: MovePageTreeNodesByNeighbourInput!) {
        movePageTreeNodesByNeighbour(ids: $ids, input: $input) {
            id
            parentId
            pos
            slug
            path
        }
    }
`;

const RESET_SLUG = gql`
    mutation ResetSlug($id: ID!, $slug: String!) {
        updatePageTreeNodeSlug(id: $id, slug: $slug) {
            id
            slug
        }
    }
`;

const PAGES_CACHE_QUERY = gql`
    query PagesCache($contentScope: PageTreeNodeScopeInput!, $category: String!) {
        pages: pageTreeNodeList(scope: $contentScope, category: $category) {
            id
            parentId
            pos
        }
    }
`;

// @TODO: Calculate dynamically
const levelOffsetPx = 50;

const PageTree: React.ForwardRefRenderFunction<PageTreeRefApi, PageTreeProps> = (
    { pages, editDialogApi, toggleExpand, onSelectChanged, category, siteUrl },
    ref,
) => {
    const client = useApolloClient();
    const newPageIds = React.useRef<string[]>([]);

    const queries = client.getObservableQueries();
    const pagesQuery = Array.from(queries.values()).find((query) => query.queryName === "Pages") as
        | ObservableQuery<GQLPagesQuery, GQLPagesQueryVariables>
        | undefined;

    React.useEffect(() => {
        if (pagesQuery) {
            client.cache.watch<GQLPagesQuery, GQLPagesQueryVariables>({
                query: pagesQuery.query,
                variables: pagesQuery.variables,
                callback: (newPagesQuery, previousPagesQuery) => {
                    if (newPagesQuery && previousPagesQuery) {
                        const existingPageIds = previousPagesQuery.result?.pages?.map((page) => page.id) ?? [];
                        newPageIds.current = newPagesQuery.result?.pages?.map((page) => page.id).filter((id) => !existingPageIds.includes(id)) ?? [];

                        setTimeout(() => {
                            // reset newPageIds to prevent slideIn on every rerender
                            newPageIds.current = [];
                        }, 0);
                    }
                },
                optimistic: true,
            });
        }
    }, [client.cache, pagesQuery]);

    React.useEffect(() => {
        if (newPageIds.current.length > 0) {
            const index = pages.findIndex((page) => newPageIds.current.includes(page.id));
            refList.current?.scrollToItem(index, "smart");
        }
    }, [pages]);

    const pageTreeService = React.useMemo(() => new PageTreeService(levelOffsetPx, pages), [pages]);
    const { scope } = useContentScope();
    const snackbarApi = useSnackbarApi();

    const debouncedSetHoverState = useDebouncedCallback(
        (setHoverState: React.Dispatch<React.SetStateAction<DropInfo | undefined>>, newHoverState: DropInfo | undefined) => {
            setHoverState((prevState) => {
                if (isEqual(newHoverState, prevState)) {
                    return prevState;
                } else {
                    return newHoverState;
                }
            });
        },
        5,
    );

    const selectedPages = React.useMemo(() => {
        return pages.filter((page) => page.selected);
    }, [pages]);

    const moveByPosRequest = React.useCallback(
        // @TODO: handle path collisions when moving pages
        async ({ ids, parentId, position }: { ids: string[]; parentId: string | null; position: number }) => {
            await client.mutate({
                mutation: MOVE_PAGE_TREE_NODES_BY_POS,
                variables: {
                    ids: ids,
                    input: {
                        parentId: parentId,
                        pos: position,
                    },
                },
                optimisticResponse: (variables) => {
                    const pageTreeNodes: GQLMovePageTreeNodesByPosMutation["movePageTreeNodesByPos"] = (variables.ids as string[]).map(
                        (id, index) => {
                            const slugPathPage = client.cache.readFragment<GQLPageSlugPathFragment>({
                                id: id,
                                fragment: gql`
                                    fragment PageSlugPath on PageTreeNode {
                                        id
                                        slug
                                        path
                                    }
                                `,
                            });

                            return {
                                __typename: "PageTreeNode",
                                id: id,
                                parentId: parentId,
                                pos: position + index,
                                slug: slugPathPage?.slug ?? "",
                                path: slugPathPage?.path ?? "",
                            };
                        },
                    );

                    return {
                        movePageTreeNodesByPos: pageTreeNodes,
                    };
                },
                update: (proxy, { data }) => {
                    // The page positions of all other pagetree nodes are updated in the cache
                    // => realtime update
                    const movedPageTreeNodes = data?.movePageTreeNodesByPos;
                    const firstMovedPageTreeNode = movedPageTreeNodes?.[0];
                    if (!movedPageTreeNodes || !firstMovedPageTreeNode) {
                        return;
                    }

                    const pagesQueryData = proxy.readQuery<GQLPagesCacheQuery, GQLPagesCacheQueryVariables>({
                        query: PAGES_CACHE_QUERY,
                        variables: {
                            contentScope: scope,
                            category,
                        },
                    });
                    const pagesData = pagesQueryData?.pages ?? [];
                    const updatedPages = pagesData.map((pageData) => {
                        const updatedPageData = { ...pageData };
                        if (
                            !ids.includes(pageData.id) &&
                            pageData.parentId === firstMovedPageTreeNode.parentId &&
                            pageData.pos >= firstMovedPageTreeNode.pos
                        ) {
                            updatedPageData.pos = updatedPageData.pos + movedPageTreeNodes.length;
                        }

                        return updatedPageData;
                    });
                    proxy.writeQuery({ query: PAGES_CACHE_QUERY, data: { pages: updatedPages } });
                },
            });
        },
        [client, scope, category],
    );

    const moveByNeighbourRequest = React.useCallback(
        async ({ ids, parentId, afterId, beforeId }: { ids: string[]; parentId: string | null; afterId: string | null; beforeId: string | null }) => {
            await client.mutate({
                mutation: MOVE_PAGE_TREE_NODES_BY_NEIGHBOURS,
                variables: {
                    ids: ids,
                    input: {
                        parentId: parentId,
                        afterId: afterId,
                        beforeId: beforeId,
                    },
                },
            });
        },
        [client],
    );

    const onDrop = React.useCallback(
        async (dragObject: PageTreeDragObject, dropTargetPage: PageTreePage, dropTarget: DropTarget, targetLevel: number) => {
            const selectedPageIds = selectedPages.map((page) => page.id);
            let pagesToMove: PageTreePage[];
            let idsToMove: string[];

            if (selectedPageIds.includes(dragObject.id)) {
                // filter out subpages if their parent is selected => only the parent has to be moved
                const filteredSelectedPages = selectedPages.filter((page) => {
                    return page.parentId === null || !selectedPageIds.includes(page.parentId);
                });
                idsToMove = filteredSelectedPages.map((page) => page.id);

                pagesToMove = filteredSelectedPages;
            } else {
                idsToMove = [dragObject.id];
                pagesToMove = [dragObject];
            }

            const updateInfo = pageTreeService.dropAllowed(pagesToMove, dropTargetPage, dropTarget, targetLevel);
            if (!updateInfo) {
                return;
            }

            await moveByPosRequest({ ids: idsToMove, parentId: updateInfo.parentId, position: updateInfo.position });

            snackbarApi.showSnackbar(
                <UndoSnackbar
                    message={<FormattedMessage id="comet.pagetree.pageMoved" defaultMessage="Page Moved" />}
                    payload={{ previousPages: pages, pagesToUndo: pagesToMove }}
                    onUndoClick={async (payload) => {
                        if (payload) {
                            const { previousPages, pagesToUndo } = payload;

                            let disallowedReferences = [...pagesToUndo];

                            for (const pageToUndo of pagesToUndo) {
                                const updateInfo = pageTreeService.getUndoUpdateInfo(previousPages, pageToUndo, disallowedReferences);

                                await moveByNeighbourRequest({
                                    ids: [pageToUndo.id],
                                    parentId: pageToUndo.parentId,
                                    afterId: updateInfo.afterId,
                                    beforeId: updateInfo.beforeId,
                                });

                                await client.mutate<GQLResetSlugMutation, GQLResetSlugMutationVariables>({
                                    mutation: RESET_SLUG,
                                    variables: {
                                        id: pageToUndo.id,
                                        slug: pageToUndo.slug,
                                    },
                                });

                                disallowedReferences = disallowedReferences.filter((page) => page.id !== pageToUndo.id);
                            }

                            client.refetchQueries({ include: ["Pages"] });
                        }
                    }}
                />,
            );
        },
        [selectedPages, pageTreeService, pages, moveByPosRequest, snackbarApi, client, moveByNeighbourRequest],
    );

    const refList = useRef<List>(null);
    // expose this method to the public
    useImperativeHandle(ref, () => ({
        scrollToItem: (index: number, align?: Align) => {
            refList.current?.scrollToItem(index, align);
        },
    }));

    const propsForVirtualList = useDndWindowScroll();

    return (
        <>
            <PageTreeDragLayer numberSelectedPages={selectedPages.length} />
            <Root>
                <Table>
                    <AutoSizer>
                        {({ height, width }) => {
                            return (
                                // @TODO: adjust itemSize for smaller screens
                                <List
                                    ref={refList}
                                    height={height}
                                    itemCount={pages.length}
                                    width={width}
                                    itemSize={51}
                                    overscanCount={1} // do not increase this for performance reasons
                                    style={{ scrollBehavior: "smooth" }}
                                    innerElementType={VirtualListPadder}
                                    {...propsForVirtualList}
                                >
                                    {({ index, style }) => {
                                        const [prevPage, page, nextPage] = getLinkedPages(pages, index);
                                        return (
                                            <PageTreeRow
                                                key={page.id}
                                                virtualizedStyle={{
                                                    ...style,
                                                    top: `${parseFloat(String(style?.top)) + VIRTUAL_LIST_PADDING_SIZE}px`,
                                                }}
                                                slideIn={newPageIds.current.includes(page.id)}
                                                page={page}
                                                prevPage={prevPage}
                                                nextPage={nextPage}
                                                editDialogApi={editDialogApi}
                                                toggleExpand={toggleExpand}
                                                onDrop={onDrop}
                                                onSelectChanged={onSelectChanged}
                                                pageTreeService={pageTreeService}
                                                debouncedSetHoverState={debouncedSetHoverState}
                                                siteUrl={siteUrl}
                                                selectedPages={selectedPages}
                                            />
                                        );
                                    }}
                                </List>
                            );
                        }}
                    </AutoSizer>
                </Table>
            </Root>
        </>
    );
};

const VIRTUAL_LIST_PADDING_SIZE = 24;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VirtualListPadder = React.forwardRef<any, any>(({ style, ...rest }, ref) => (
    <div
        ref={ref}
        style={{
            ...style,
            height: `${parseFloat(String(style?.height)) + VIRTUAL_LIST_PADDING_SIZE * 2}px`,
        }}
        {...rest}
    />
));

function getLinkedPages(pages: PageTreePage[], index: number): [PageTreePage | undefined, PageTreePage, PageTreePage | undefined] {
    const prevPage = index > 0 ? pages[index - 1] : undefined;
    const nextPage = index + 1 < pages.length ? pages[index + 1] : undefined;
    return [prevPage, pages[index], nextPage];
}

const PageTreeWithRef = React.forwardRef(PageTree);

export { PageTreeWithRef as PageTree, PageTreeRefApi };

const Root = styled("div")`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const Table = styled("div")`
    flex: 1;
`;
