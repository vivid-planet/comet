import { styled } from "@mui/material/styles";
import React from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { FormattedMessage } from "react-intl";

import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../graphql.generated";
import DamLabel from "./DamLabel";
import { useDamMultiselectApi } from "./multiselect/DamMultiselect";

const MultipleItemsDragLabel = styled("div")`
    display: flex;
    align-items: center;
    padding-left: 20px;
`;

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

const FolderTableDragLayerWrapper = styled("div")`
    position: fixed;
    pointer-events: none;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
`;

const FolderTableDragLayer = (): React.ReactElement | null => {
    const { selectedItems, isSelected } = useDamMultiselectApi();

    const { item, isAcceptedItemType, initialOffset, currentOffset, isDragging } = useDragLayer((monitor) => ({
        item: monitor.getItem() as { item: GQLDamFileTableFragment | GQLDamFolderTableFragment },
        isAcceptedItemType: monitor.getItemType() === "folder" || monitor.getItemType() === "asset",
        initialOffset: monitor.getInitialClientOffset(),
        currentOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    if (!isDragging || !isAcceptedItemType) {
        return null;
    }
    return (
        <FolderTableDragLayerWrapper>
            <div style={getItemStyles(initialOffset, currentOffset)}>
                {selectedItems.length > 1 && isSelected(item.item.id) ? (
                    <MultipleItemsDragLabel>
                        <FormattedMessage
                            id="comet.dam.dnd.dragMultipleItemsLabel"
                            defaultMessage="{numItems} Items"
                            values={{ numItems: selectedItems.length }}
                        />
                    </MultipleItemsDragLabel>
                ) : (
                    <DamLabel asset={item.item} />
                )}
            </div>
        </FolderTableDragLayerWrapper>
    );
};

export default FolderTableDragLayer;
