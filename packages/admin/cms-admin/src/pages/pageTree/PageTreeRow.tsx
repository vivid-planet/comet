import { IEditDialogApi } from "@comet/admin";
import { Checkbox } from "@mui/material";
import React from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { DebouncedState } from "use-debounce/lib/useDebouncedCallback";

import { PageTreeTableRow } from "./common/PageTreeTableRow";
import InsertInBetweenAction from "./InsertInBetweenAction/InsertInBetweenAction";
import { useButtonHoverStates } from "./InsertInBetweenAction/useButtonHoverStates";
import PageActions from "./PageActions";
import PageInfo from "./PageInfo";
import PageLabel from "./PageLabel";
import * as sc from "./PageTreeRow.sc";
import { PageTreeRowDivider } from "./PageTreeRowDivider";
import PageTreeService, { DropInfo } from "./PageTreeService";
import PageVisibility from "./PageVisibility";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

export type DropTarget = "ADD_BEFORE" | "ADD_AFTER" | "ADD_AS_CHILD";
export type DropTargetBeforeAfter = Extract<DropTarget, "ADD_BEFORE" | "ADD_AFTER">;

interface PageTreeRowProps {
    page: PageTreePage;
    prevPage?: PageTreePage;
    nextPage?: PageTreePage;
    editDialogApi: IEditDialogApi;
    toggleExpand: (pageId: string) => void;
    onDrop: (dragObject: PageTreeDragObject, dropTargetPage: PageTreePage, dropTarget: DropTarget, targetLevel: number) => Promise<void>;
    onSelectChanged: (pageId: string, value: boolean) => void;
    pageTreeService: PageTreeService;
    debouncedSetHoverState: DebouncedState<
        (setHoverState: React.Dispatch<React.SetStateAction<DropInfo | undefined>>, newHoverState: DropInfo | undefined) => void
    >;
    siteUrl: string;
    virtualizedStyle?: React.CSSProperties;
    slideIn?: boolean;
    selectedPages: PageTreePage[];
}

export interface PageTreeTableRowElement extends HTMLTableRowElement {
    previousElementSibling: HTMLTableRowElement | null;
    nextElementSibling: HTMLTableRowElement | null;
}

export type PageTreeDragObject = PageTreePage;

const PageTreeRow = ({
    page,
    prevPage,
    nextPage,
    editDialogApi,
    toggleExpand,
    onDrop,
    onSelectChanged,
    pageTreeService,
    debouncedSetHoverState,
    siteUrl,
    virtualizedStyle,
    slideIn,
    selectedPages,
}: PageTreeRowProps): React.ReactElement => {
    const rowRef = React.useRef<PageTreeTableRowElement | null>(null);
    const [hover, setHover] = React.useState(false);

    const [hoverState, setHoverState] = React.useState<DropInfo | undefined>();
    const { documentTypes } = usePageTreeContext();
    const isEditable = !!(page.visibility !== "Archived" && documentTypes[page.documentType].editComponent);

    const { top: topInBetweenButtonHovered, bottom: bottomInBetweenButtonHovered, defaultHandler: inBetweenButtonHandle } = useButtonHoverStates();

    const resetHoverState = React.useCallback(() => {
        // timeout is required to ensure that reset is called last
        setTimeout(() => {
            setHoverState(undefined);
        }, 0);
    }, []);

    const updateHoverState = React.useCallback(
        (newHoverState?: DropInfo) => {
            debouncedSetHoverState(setHoverState, newHoverState);
        },
        [debouncedSetHoverState],
    );

    const calculateTargetLevel = React.useCallback(
        (mouseX: number, itemX: number, dropTarget: DropTarget) => {
            let neighbouringLevel;
            if (dropTarget === "ADD_BEFORE") {
                neighbouringLevel = prevPage?.level ?? 0;
            } else if (dropTarget === "ADD_AFTER") {
                // nextPage is only undefined if the current page is the last page of the whole PageTree
                // Then you should be able to add between the current page level and 0 => neighbouringLevel = 0
                neighbouringLevel = nextPage?.level ?? 0;
            } else {
                return page.level + 1;
            }

            return pageTreeService.calculateTargetLevel(mouseX, itemX, { level1: page.level, level2: neighbouringLevel });
        },
        [pageTreeService, nextPage?.level, page.level, prevPage?.level],
    );

    const getDropInfo = React.useCallback(
        (monitor: DropTargetMonitor): DropInfo | undefined => {
            const mouseXY = monitor.getClientOffset();
            if (!rowRef.current || !mouseXY) {
                return;
            }
            const dropTargetElementRect = rowRef.current.getBoundingClientRect();

            const dropTarget = pageTreeService.calculateDropTarget(mouseXY.y, dropTargetElementRect);
            const targetLevel = calculateTargetLevel(mouseXY.x, dropTargetElementRect.x, dropTarget);

            return { dropTarget, targetLevel };
        },
        [calculateTargetLevel, pageTreeService],
    );

    const [, dragSource, preview] = useDrag({
        type: "row",
        item: page,
    });

    // Is necessary for the CustomDragLayer to work
    React.useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
        // as seen in react-dnd-Doku:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [, dropTarget] = useDrop({
        accept: "row",
        drop: async (dragObject: PageTreeDragObject, monitor) => {
            const dropTargetPage = page;
            const dropInfo = getDropInfo(monitor);

            if (dropInfo) {
                await onDrop(dragObject, dropTargetPage, dropInfo.dropTarget, dropInfo.targetLevel);
                resetHoverState();
            }
        },
        hover: (dragObject: PageTreeDragObject, monitor) => {
            const dropInfo = getDropInfo(monitor);

            if (dropInfo && monitor.canDrop()) {
                updateHoverState(dropInfo);
            } else {
                resetHoverState();
            }
        },
        canDrop: (dragObject: PageTreeDragObject, monitor) => {
            const dropTargetPage = page;
            const dropInfo = getDropInfo(monitor);

            if (!dropInfo) {
                return false;
            }

            const selectedPageIds = selectedPages.map((page) => page.id);
            let pagesToMove: PageTreePage[] = [];
            if (selectedPageIds.includes(dragObject.id)) {
                pagesToMove = selectedPages;
            } else {
                pagesToMove = [dragObject];
            }

            return !!pageTreeService.dropAllowed(pagesToMove, dropTargetPage, dropInfo.dropTarget, dropInfo.targetLevel);
        },
    });

    React.useEffect(() => {
        if (page.visibility !== "Archived") {
            // Archived pages cannot be moved
            dragSource(rowRef);
        }
        dropTarget(rowRef);
    }, [dragSource, dropTarget, page.visibility]);

    const insertInBetweenTopPosition = pageTreeService.calcInsertInBetweenPosition(prevPage, page);
    const insertInBetweenBottomPosition = pageTreeService.calcInsertInBetweenPosition(page, nextPage);
    const topDividerHighlighted = hoverState?.dropTarget === "ADD_BEFORE" || topInBetweenButtonHovered;
    const bottomDividerHighlighted = hoverState?.dropTarget === "ADD_AFTER" || bottomInBetweenButtonHovered;

    const _onSelectChanged = React.useCallback(() => {
        onSelectChanged(page.id, !page.selected);
    }, [page, onSelectChanged]);

    return (
        <PageTreeTableRow
            isDragHovered={hoverState?.dropTarget === "ADD_AS_CHILD"}
            isMouseHovered={hover}
            isArchived={page.visibility === "Archived"}
            isSelected={page.selected}
            slideIn={slideIn}
            clickable={page.visibility !== "Archived" && isEditable}
            style={virtualizedStyle}
            onDragLeave={() => {
                resetHoverState();
            }}
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
            onMouseMove={() => {
                if (!hover) {
                    setHover(true);
                }
            }}
            key={page.id}
            rowRef={rowRef}
        >
            <PageTreeRowDivider
                align="top"
                leftSpacing={(hoverState?.targetLevel || 0) * pageTreeService.levelOffsetPx}
                highlight={topDividerHighlighted}
            />
            <sc.SelectPageCell component="div">
                <Checkbox checked={page.selected} onChange={_onSelectChanged} />
            </sc.SelectPageCell>
            <sc.PageInfoCell component="div" title={page.name}>
                <PageInfo page={page} toggleExpand={toggleExpand}>
                    <PageLabel page={page} isEditable={isEditable} />
                </PageInfo>
            </sc.PageInfoCell>
            <sc.PageVisibilityCell component="div">
                <PageVisibility page={page} />
            </sc.PageVisibilityCell>
            <sc.PageActionsCell component="div">
                <PageActions page={page} editDialog={editDialogApi} siteUrl={siteUrl} />
            </sc.PageActionsCell>
            {isEditable && <sc.RowClickStackLink pageName="edit" payload={page.id} tabIndex={-1} />}

            {hover && (
                <sc.AddContainer>
                    <InsertInBetweenAction
                        top={
                            <InsertInBetweenAction.Button
                                editDialogApi={editDialogApi}
                                position={insertInBetweenTopPosition}
                                onMouseOverButton={inBetweenButtonHandle.mouseOverTop}
                                onMouseOutButton={inBetweenButtonHandle.mouseOutTop}
                            />
                        }
                        bottom={
                            <InsertInBetweenAction.Button
                                editDialogApi={editDialogApi}
                                position={insertInBetweenBottomPosition}
                                onMouseOverButton={inBetweenButtonHandle.mouseOverBottom}
                                onMouseOutButton={inBetweenButtonHandle.mouseOutBottom}
                            />
                        }
                    />
                </sc.AddContainer>
            )}
            <PageTreeRowDivider
                align="bottom"
                leftSpacing={(hoverState?.targetLevel || 0) * pageTreeService.levelOffsetPx}
                highlight={bottomDividerHighlighted}
            />
        </PageTreeTableRow>
    );
};

export default PageTreeRow;
