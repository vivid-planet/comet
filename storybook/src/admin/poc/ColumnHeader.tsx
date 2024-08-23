import { RowActionsItem, RowActionsMenu } from "@comet/admin";
import { Add, Copy, Delete, DensityStandard, DragIndicator, Duplicate, Paste, PinLeft, PinRight, Remove } from "@comet/admin-icons";
import { ButtonBase, Divider } from "@mui/material";
import { GridColumnHeaderParams } from "@mui/x-data-grid";
import React from "react";

import { getColumnUtils } from "./getColumnUtils";
import { ColumnDataItem, ColumnSize, RowData } from "./TableBlockAdminWithDataGrid";

// TODO: Refactor this to use `setColumnData` instead of 100 functions as props
type Props = GridColumnHeaderParams & {
    columnId: string;
    columnPosition: number;
    columnSize: ColumnSize;
    highlighted: boolean;

    columnData: ColumnDataItem[];
    setColumnData: React.Dispatch<React.SetStateAction<ColumnDataItem[]>>;
    rowData: RowData[];
    setRowData: React.Dispatch<React.SetStateAction<RowData[]>>;
};

const columnSizes: Array<{
    size: ColumnSize;
    label: string;
}> = [
    { size: "extraSmall", label: "Extra small" },
    { size: "small", label: "Small" },
    { size: "standard", label: "Standard" },
    { size: "large", label: "Large" },
    { size: "extraLarge", label: "Extra large" },
];

export const ColumnHeader = ({ columnId, columnPosition, columnSize, highlighted, columnData, setColumnData, rowData, setRowData }: Props) => {
    const { addColumn, toggleColumnHighlighted, setColumnSize, deleteColumn, copyColumnToClipboard, pasteColumnFromClipboard, duplicateColumn } =
        getColumnUtils({
            columnData,
            setColumnData,
            rowData,
            setRowData,
        });

    return (
        <>
            {/* Workaround: When a button is rendered inside the ColumnHeader (e.g. RowActionsItem), only buttons can be used for column reordering */}
            <ButtonBase
                component="div"
                sx={{
                    position: "absolute",
                    outlineOffset: -2,
                    cursor: "move",
                    inset: 0,
                    justifyContent: "flex-start",
                    paddingLeft: 2,
                }}
                disableRipple
            >
                <DragIndicator />
            </ButtonBase>
            <RowActionsMenu>
                <RowActionsMenu>
                    <RowActionsMenu text="Column width" icon={<DensityStandard />}>
                        {columnSizes.map(({ size, label }) => (
                            <RowActionsItem
                                key={size}
                                onClick={() => setColumnSize(columnId, size)}
                                componentsProps={{ menuItem: { selected: columnSize === size } }}
                            >
                                {label}
                            </RowActionsItem>
                        ))}
                    </RowActionsMenu>
                    <RowActionsItem icon={highlighted ? <Remove /> : <Add />} onClick={() => toggleColumnHighlighted(columnId)}>
                        {highlighted ? "Remove highlighting" : "Highlight column"}
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<PinLeft />}
                        onClick={() => {
                            addColumn(columnPosition - 1);
                        }}
                    >
                        Insert column left
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<PinRight />}
                        onClick={() => {
                            addColumn(columnPosition);
                        }}
                    >
                        Insert column right
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem onClick={() => copyColumnToClipboard(columnId)} icon={<Copy />}>
                        Copy
                    </RowActionsItem>
                    <RowActionsItem onClick={() => pasteColumnFromClipboard(columnPosition)} icon={<Paste />}>
                        Paste
                    </RowActionsItem>
                    <RowActionsItem onClick={() => duplicateColumn(columnId)} icon={<Duplicate />}>
                        Duplicate
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<Delete />}
                        onClick={() => {
                            deleteColumn(columnId, columnPosition);
                        }}
                    >
                        Delete
                    </RowActionsItem>
                </RowActionsMenu>
            </RowActionsMenu>
        </>
    );
};
