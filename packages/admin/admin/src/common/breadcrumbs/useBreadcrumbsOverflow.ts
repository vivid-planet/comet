import { type RefObject, useEffect, useMemo, useState } from "react";

import { useObservedWidth } from "../../utils/useObservedWidth";
import type { Breadcrumb } from "./Breadcrumbs";

const getElementOuterWidth = (element: Element): number =>
    element.clientWidth + parseFloat(getComputedStyle(element).marginLeft) + parseFloat(getComputedStyle(element).marginRight);

// Determines how many items (starting after the first one) need to be collapsed into the overflow ellipsis so that
// the first item, the ellipsis and as many trailing items as possible fit into the available width. The first item
// (root) and the last item (current page) are always kept, matching the responsive behavior of `StackBreadcrumbs`.
const getNumberOfHiddenItems = ({
    itemWidths,
    ellipsisWidth,
    containerWidth,
}: {
    itemWidths: number[];
    ellipsisWidth: number;
    containerWidth: number;
}): number => {
    if (itemWidths.length <= 2) {
        return 0;
    }

    const totalWidth = itemWidths.reduce((sum, width) => sum + width, 0);
    if (totalWidth <= containerWidth) {
        return 0;
    }

    const lastIndex = itemWidths.length - 1;
    const availableWidthForTrailingItems = containerWidth - itemWidths[0] - ellipsisWidth;

    let usedWidth = itemWidths[lastIndex]; // The last item (current page) is always shown.
    let firstVisibleTrailingIndex = lastIndex;

    for (let index = lastIndex - 1; index >= 1; index--) {
        if (usedWidth + itemWidths[index] > availableWidthForTrailingItems) {
            break;
        }
        usedWidth += itemWidths[index];
        firstVisibleTrailingIndex = index;
    }

    return firstVisibleTrailingIndex - 1;
};

/**
 * Measures the rendered breadcrumb items and the overflow ellipsis to determine how many items don't fit into the
 * available width. While `isMeasuring` is `true`, all items must be rendered so that their widths can be measured.
 */
export const useBreadcrumbsOverflow = ({
    items,
    itemsRef,
    ellipsisRef,
}: {
    items: Breadcrumb[];
    itemsRef: RefObject<HTMLElement | null>;
    ellipsisRef: RefObject<HTMLElement | null>;
}): { isMeasuring: boolean; numberOfHiddenItems: number } => {
    const containerWidth = useObservedWidth(itemsRef);
    const [itemWidths, setItemWidths] = useState<number[] | undefined>();
    const [ellipsisWidth, setEllipsisWidth] = useState<number | undefined>();
    const itemsKey = items.map((item) => item.url).join("|");

    useEffect(() => {
        setItemWidths(undefined);
    }, [itemsKey]);

    useEffect(() => {
        if (items.length && !itemWidths?.length) {
            const children = itemsRef.current?.children;
            setItemWidths(children ? Array.from(children).map(getElementOuterWidth) : []);
        }
        if (ellipsisRef.current && ellipsisWidth === undefined) {
            setEllipsisWidth(getElementOuterWidth(ellipsisRef.current));
        }
    }, [items.length, itemsKey, itemWidths, ellipsisWidth, itemsRef, ellipsisRef]);

    const isMeasuring = !itemWidths?.length || ellipsisWidth === undefined;
    const numberOfHiddenItems = useMemo(
        () => (isMeasuring ? 0 : getNumberOfHiddenItems({ itemWidths, ellipsisWidth, containerWidth })),
        [isMeasuring, itemWidths, ellipsisWidth, containerWidth],
    );

    return { isMeasuring, numberOfHiddenItems };
};
