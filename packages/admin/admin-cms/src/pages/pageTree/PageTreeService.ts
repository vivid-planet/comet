import { DropTarget, DropTargetBeforeAfter, PageTreeDragObject } from "./PageTreeRow";
import { PageTreePage } from "./usePageTree";

export interface IPageTreeUpdateInfo {
    parentId: string | null;
    position: number;
    neighbourPage: PageTreePage;
}

export interface DropInfo {
    dropTarget: DropTarget;
    targetLevel: number;
}

interface NeighbouringLevel {
    level1?: number;
    level2?: number;
}

type SearchDirection = "UPWARDS" | "DOWNWARDS";

// interface that describes a position of a node within the tree
export interface PageTreeNodePosition {
    pos?: number;
    parent: string | null;
    level: number;
}
class PageTreeService {
    public readonly levelOffsetPx: number;
    private readonly pages: PageTreePage[];

    constructor(levelOffsetPx: number, pages: PageTreePage[]) {
        this.levelOffsetPx = levelOffsetPx;
        this.pages = pages;
    }

    // Calculates the targetLevel from the mouse position in relation to the x coordinate of the target item
    // Maximum and minimum level are defined by { level1, level2 } (order does not matter)
    calculateTargetLevel(mouseX: number, itemX: number, { level1, level2 }: NeighbouringLevel): number {
        // levels are only undefined when the current divider is before the first or after the last item
        // in the PageTree. Then you should always be able to add to level 0
        const neighbouringLevels = [level1 ?? 0, level2 ?? 0];

        const minLevel = Math.min(...neighbouringLevels);
        const maxLevel = Math.max(...neighbouringLevels);

        const offsetBetweenDropTargetAndMouse = mouseX - itemX;
        const hypotheticalLevel = Math.floor(offsetBetweenDropTargetAndMouse / this.levelOffsetPx);

        if (hypotheticalLevel < minLevel) {
            return minLevel;
        } else if (hypotheticalLevel > maxLevel) {
            return maxLevel;
        } else {
            return hypotheticalLevel;
        }
    }

    calculateDropTarget(mouseY: number, dropTargetElementRect: DOMRect): DropTarget {
        // min is inclusive
        // max is exclusive
        // Item is split into three parts:
        const dropTargetBoundaries: { [key in DropTarget]: { min: number; max: number } } = {
            // Drop on first quarter (0/4 - 1/4) of item height => add before current item
            ADD_BEFORE: {
                // - 5 => a bit of margin for the divider
                min: dropTargetElementRect.y - 5,
                max: dropTargetElementRect.y + dropTargetElementRect.height / 4,
            },
            // Drop between first quarter and last quarter (1/4 - 3/4) of item height => add as child of current item
            ADD_AS_CHILD: {
                min: dropTargetElementRect.y + dropTargetElementRect.height / 4,
                max: dropTargetElementRect.y + (dropTargetElementRect.height / 4) * 3,
            },
            // Drop on last quarter (3/4 - 4/4)  of item height => add after current item
            ADD_AFTER: {
                min: dropTargetElementRect.y + (dropTargetElementRect.height / 4) * 3,
                // + 5 => a bit of margin for the divider
                max: dropTargetElementRect.bottom + 5,
            },
        };

        if (mouseY >= dropTargetBoundaries["ADD_BEFORE"].min && mouseY < dropTargetBoundaries["ADD_BEFORE"].max) {
            return "ADD_BEFORE";
        } else if (mouseY >= dropTargetBoundaries["ADD_AFTER"].min && mouseY < dropTargetBoundaries["ADD_AFTER"].max) {
            return "ADD_AFTER";
        } else {
            return "ADD_AS_CHILD";
        }
    }

    // Returns an IPageTreeUpdateInfo object if drop is possible.
    // Otherwise returns false
    dropAllowed(
        dragObject: PageTreeDragObject,
        dropTargetPage: PageTreePage,
        dropTarget: DropTarget,
        targetLevel: number,
    ): IPageTreeUpdateInfo | false {
        if (dragObject.slug === "home" && dropTarget === "ADD_AS_CHILD") {
            return false;
        }

        const updateInfo = this.getPageTreeNodeUpdateInfo(targetLevel, dropTargetPage, dropTarget);

        if (
            !updateInfo || // No fitting parent exists
            updateInfo.parentId === dragObject.id || // Item cannot be its own parent
            updateInfo.neighbourPage.ancestorIds.includes(dragObject.id) // Item cannot be its own subitem
        ) {
            return false;
        }

        return updateInfo;
    }

    // Searches a new neighbour for an item based on the dropTargetPage, targetLevel and dropTarget.
    // Generates an IPageTreeUpdateInfo object based on information from this neighbour.
    // Returns an IPageTreeUpdateInfo object containing all information needed for an update if a suiting
    // neighbour is found.
    // Returns null if no suiting neighbour is found.
    getPageTreeNodeUpdateInfo(targetLevel: number, dropTargetPage: PageTreePage, dropTarget: DropTarget): IPageTreeUpdateInfo | null {
        if (dropTarget === "ADD_AS_CHILD") {
            return this.getAddAsChildUpdateInfo(dropTargetPage);
        }

        return this.getAddBeforeOrAfterUpdateInfo(dropTargetPage, targetLevel, dropTarget);
    }
    // given a node and it's next node
    // this function calculates the position of the node that will be inserted in between
    // in some cases 2 positions are possible, than we apply "choose highest level"-strategy
    calcInsertInBetweenPosition(node?: PageTreePage, nextNode?: PageTreePage): PageTreeNodePosition {
        // edge case: there is no previous node
        // in this case the insert in between position is the very first one
        if (node == null) {
            return { parent: null, pos: 0, level: 0 };
        }
        // edge case: nextNode is the first position of the next deeper level
        // in this case the inBetweenNode is added at pos 0 and the same level as nextNode
        //
        //
        //
        //   before:
        //   - node
        //   - - nextNode
        //
        //  after:
        //  - node
        //  - - inBetweenNode
        //  - - nextNOde

        if (nextNode && node.level < nextNode.level) {
            return {
                pos: 0,
                parent: node.id,
                level: nextNode.level,
            };
        }

        // edge case: nextNode is the first position of the next higher level
        // in this case the inBetweenNode is
        // added at pos of node + 1 and the same level as node (A)
        // or
        // added at pos of nextNode -1 and the same level as nextNode (B)
        //
        // we implement version A (choose-highest-level)
        //
        //   A:
        //
        //   before:
        //   - - node
        //   - nextNode
        //
        //  after:
        //  - - node
        //  - - inBetweenNode
        //  - nextNode
        //
        if (nextNode && node.level > nextNode.level) {
            return {
                pos: node.pos + 1,
                parent: node.parentId,
                level: node.level,
            };
        }
        // edge case: node is last node at all, and it's level is not 0
        if (!nextNode && node.level > 0) {
            return {
                pos: node.pos + 1,
                parent: node.parentId,
                level: node.level,
            };
        }
        //  standard case: node and NextNode are on the same level
        //  or no nextNode at all
        //
        //   before:
        //   - node
        //   - nextNode
        //
        //  after:
        //  - node
        //  - inBetweenNode
        //  - nextNOde

        return {
            pos: node.pos + 1,
            parent: node.parentId,
            level: node.level,
        };
    }

    private getAddAsChildUpdateInfo(dropTargetPage: PageTreePage): IPageTreeUpdateInfo {
        // Get position of last child of target item => add new item after that (at the end of the sublist)
        const position = this.pages.reduce<number>((maxPosition, page) => {
            if (page.parentId === dropTargetPage.id) {
                maxPosition = Math.max(maxPosition, page.pos);
            }
            return maxPosition;
        }, 0);
        return { parentId: dropTargetPage.id, position: position + 1, neighbourPage: dropTargetPage };
    }

    private getAddBeforeOrAfterUpdateInfo(
        dropTargetPage: PageTreePage,
        targetLevel: number,
        dropTarget: DropTargetBeforeAfter,
    ): IPageTreeUpdateInfo | null {
        // Check if drop target page is a suitable neighbour
        if (targetLevel === dropTargetPage.level) {
            return {
                parentId: dropTargetPage.parentId,
                position: dropTarget === "ADD_BEFORE" ? dropTargetPage.pos : dropTargetPage.pos + 1, // else must be ADD_AFTER
                neighbourPage: dropTargetPage,
            };
        }

        const startPageIdx = this.pages.findIndex((page) => page.id === dropTargetPage.id);

        const startIdxUpwardSearch: number | null = startPageIdx - 1 >= 0 ? startPageIdx - 1 : null;
        const startIdxDownwardSearch: number | null = startPageIdx + 1 < this.pages.length ? startPageIdx + 1 : null;

        let neighbourPage;
        let searchDirection: SearchDirection;

        if (dropTarget === "ADD_BEFORE") {
            // When adding before an item, first search for a neighbour before this item (upwards in the list)
            searchDirection = "UPWARDS";
            neighbourPage = this.findNeighbourUpwards(startIdxUpwardSearch, targetLevel);

            // If none is found, search for neighbour after this item (downwards in the list)
            if (!neighbourPage) {
                searchDirection = "DOWNWARDS";
                neighbourPage = this.findNeighbourDownwards(startIdxDownwardSearch, targetLevel);
            }
        } else {
            // When adding after an item, first search for a neighbour after this item (downwards in the list)
            searchDirection = "DOWNWARDS";
            neighbourPage = this.findNeighbourDownwards(startIdxDownwardSearch, targetLevel);

            // If none is found, search for neighbour before this item (upwards in the list)
            if (!neighbourPage) {
                searchDirection = "UPWARDS";
                neighbourPage = this.findNeighbourUpwards(startIdxUpwardSearch, targetLevel);
            }
        }

        if (!neighbourPage) {
            return null;
        }

        return this.getUpdateInfoFromNeighbourPage(neighbourPage, searchDirection);
    }

    private findNeighbourUpwards(idx: number | null, targetLevel: number): PageTreePage | null {
        return this.findNeighbour(idx, targetLevel, (prevIdx) => (prevIdx - 1 >= 0 ? prevIdx - 1 : null));
    }

    private findNeighbourDownwards(idx: number | null, targetLevel: number): PageTreePage | null {
        return this.findNeighbour(idx, targetLevel, (prevIdx) => (prevIdx + 1 < this.pages.length ? prevIdx + 1 : null));
    }

    private findNeighbour(idx: number | null, targetLevel: number, calculateNewIdx: (prevIdx: number) => number | null): PageTreePage | null {
        while (idx !== null) {
            if (this.pages[idx].level === targetLevel) {
                return this.pages[idx];
            } else if (this.pages[idx].level < targetLevel) {
                // Prevent sliding into a different list on the same level
                idx = null;
            } else {
                idx = calculateNewIdx(idx);
            }
        }

        return null;
    }

    private getUpdateInfoFromNeighbourPage(neighbourPage: PageTreePage, searchDirection: SearchDirection) {
        let position;
        if (searchDirection === "UPWARDS") {
            position = neighbourPage.pos + 1;
        } else {
            position = neighbourPage.pos;
        }

        return {
            parentId: neighbourPage.parentId,
            position: position,
            neighbourPage: neighbourPage,
        };
    }
}

export default PageTreeService;
