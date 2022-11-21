import React from "react";
import { useDragLayer, XYCoord } from "react-dnd";

import PageLabel from "./PageLabel";
import * as sc from "./PageTreeDragLayer.sc";
import { PageTreePage } from "./usePageTree";

function getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null) {
    if (!initialOffset || !currentOffset) {
        return {
            display: "none",
        };
    }

    const { x, y } = currentOffset;
    return {
        transform: `translate(${x}px, ${y}px)`,
    };
}

const PageTreeDragLayer = (): React.ReactElement | null => {
    const { item, isAcceptedItemType, initialOffset, currentOffset, isDragging } = useDragLayer((monitor) => ({
        item: monitor.getItem() as PageTreePage,
        isAcceptedItemType: monitor.getItemType() === "row",
        initialOffset: monitor.getInitialClientOffset(),
        currentOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    if (!isDragging || !isAcceptedItemType) {
        return null;
    }
    return (
        <sc.PageTreeDragLayerWrapper>
            <sc.PageTreeDragLayerInner style={getItemStyles(initialOffset, currentOffset)}>
                <PageLabel page={item} />
            </sc.PageTreeDragLayerInner>
        </sc.PageTreeDragLayerWrapper>
    );
};

export default PageTreeDragLayer;
