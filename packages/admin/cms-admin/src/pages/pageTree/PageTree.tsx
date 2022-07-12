import { ObservableQuery, useApolloClient, useMutation } from "@apollo/client";
import { IEditDialogApi, UndoSnackbar, useSnackbarApi } from "@comet/admin";
import { Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import gql from "graphql-tag";
import isEqual from "lodash.isequal";
import React, { useImperativeHandle, useRef } from "react";
import { FormattedMessage } from "react-intl";
import AutoSizer from "react-virtualized-auto-sizer";
import { Align, FixedSizeList as List } from "react-window";
import { useDebouncedCallback } from "use-debounce";

import { useContentScope } from "../../contentScope/Provider";
import {
    GQLPagesCacheQuery,
    GQLPagesCacheQueryVariables,
    GQLPagesQuery,
    GQLPagesQueryVariables,
    GQLUpdatePageTreeNodePositionMutation,
    GQLUpdatePageTreeNodePositionMutationVariables,
    namedOperations,
} from "../../graphql.generated";
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

const UPDATE_PAGE_TREE_NODE_POSITION = gql`
    mutation UpdatePageTreeNodePosition($id: ID!, $input: PageTreeNodeUpdatePositionInput!) {
        updatePageTreeNodePosition(id: $id, input: $input) {
            id
            parentId
            pos
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

    React.useEffect(() => {
        const pagesQuery = Array.from(queries.values()).find((query) => query.queryName === namedOperations.Query.Pages) as
            | ObservableQuery<GQLPagesQuery, GQLPagesQueryVariables>
            | undefined;

        if (pagesQuery) {
            client.cache.watch<GQLPagesQuery, GQLPagesQueryVariables>({
                query: pagesQuery.query,
                variables: pagesQuery.variables,
                callback: (newPagesQuery, previousPagesQuery) => {
                    if (newPagesQuery && previousPagesQuery) {
                        const existingPageIds = previousPagesQuery.result?.pages.map((page) => page.id) ?? [];
                        newPageIds.current = newPagesQuery.result?.pages.map((page) => page.id).filter((id) => !existingPageIds.includes(id)) ?? [];

                        setTimeout(() => {
                            // reset newPageIds to prevent slideIn on every rerender
                            newPageIds.current = [];
                        }, 0);
                    }
                },
                optimistic: true,
            });
        }
    }, [client.cache, queries]);

    const pageTreeService = React.useMemo(() => new PageTreeService(levelOffsetPx, pages), [pages]);
    const { scope } = useContentScope();
    const snackbarApi = useSnackbarApi();
    const [updatePageTreeNodePosition] = useMutation<GQLUpdatePageTreeNodePositionMutation, GQLUpdatePageTreeNodePositionMutationVariables>(
        UPDATE_PAGE_TREE_NODE_POSITION,
    );
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

    const updateRequest = React.useCallback(
        // @TODO: handle path collisions when moving pages
        async ({ id, parentId, position }: { id: string; parentId: string | null; position: number }) => {
            await updatePageTreeNodePosition({
                variables: {
                    id: id,
                    input: {
                        parentId: parentId,
                        pos: position,
                    },
                },
                optimisticResponse: {
                    updatePageTreeNodePosition: {
                        __typename: "PageTreeNode",
                        id: id,
                        parentId: parentId,
                        pos: position,
                    },
                },
                update: (proxy, { data }) => {
                    // The page positions of all other pagetree nodes are updated in the cache
                    // => realtime update
                    const updatePageTreeNodePosition = data?.updatePageTreeNodePosition;
                    if (!updatePageTreeNodePosition) {
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
                            pageData.id !== id &&
                            pageData.parentId === updatePageTreeNodePosition.parentId &&
                            pageData.pos >= updatePageTreeNodePosition.pos
                        ) {
                            updatedPageData.pos++;
                        }

                        return updatedPageData;
                    });
                    proxy.writeQuery({ query: PAGES_CACHE_QUERY, data: { pages: updatedPages } });
                },
            });
        },
        [scope, updatePageTreeNodePosition, category],
    );

    const onDrop = React.useCallback(
        async (dragObject: PageTreeDragObject, dropTargetPage: PageTreePage, dropTarget: DropTarget, targetLevel: number) => {
            const updateInfo = pageTreeService.dropAllowed(dragObject, dropTargetPage, dropTarget, targetLevel);
            if (
                !updateInfo ||
                // Update is redundant because parent and list order stay the same
                (updateInfo.parentId === dragObject.parentId &&
                    (updateInfo.position === dragObject.pos || updateInfo.position === dragObject.pos + 1))
            ) {
                return;
            }

            await updateRequest({ id: dragObject.id, parentId: updateInfo.parentId, position: updateInfo.position });

            snackbarApi.showSnackbar(
                <UndoSnackbar
                    message={<FormattedMessage id="comet.pagetree.pageMoved" defaultMessage="Page Moved" />}
                    payload={dragObject}
                    onUndoClick={(movedPage) => {
                        if (movedPage) {
                            const { id, parentId, pos: position } = movedPage;
                            // Previous position may be occupied => Add at previous position + 1 => order stays correct
                            updateRequest({ id, parentId, position: position + 1 });
                        }
                    }}
                />,
            );
        },
        [pageTreeService, snackbarApi, updateRequest],
    );

    const refList = useRef<List>(null);
    // expose this method to the public
    useImperativeHandle(ref, () => ({
        scrollToItem: (index: number, align?: Align) => {
            refList.current?.scrollToItem(index, align);
        },
    }));

    const propsForVirtualList = useDndWindowScroll();

    React.useEffect(() => {
        if (newPageIds.current.length > 0) {
            const index = pages.findIndex((page) => newPageIds.current.includes(page.id));
            refList.current?.scrollToItem(index, "smart");
        }
        // this is only necessary if new pages have been added
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newPageIds.current]);

    return (
        <>
            <PageTreeDragLayer />
            <Root>
                <Divider />
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
