import { Alert, RowActionsItem, RowActionsMenu, useSnackbarApi, writeClipboardText } from "@comet/admin";
import { Add, Copy, Delete, DensityStandard, DragIndicator, Duplicate, Paste, PinLeft, PinRight, Remove } from "@comet/admin-icons";
import { ButtonBase, Divider, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type GridColumnHeaderParams } from "@mui/x-data-grid";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { v4 as uuid } from "uuid";

import { useBlockContext } from "../context/useBlockContext";
import { type RichTextBlock } from "../createRichTextBlock";
import { type TableBlockState } from "../createTableBlock";
import {
    columnInsertSchema,
    type ColumnSize,
    getDuplicatedColumnInsertData,
    getInsertDataFromColumnById,
    insertColumnDataAtIndex,
    removeColumnFromState,
    setColumnSize,
    toggleColumnHighlight,
} from "./utils/column";
import { getClipboardValueForSchema } from "./utils/getClipboardValueForSchema";

type Props = GridColumnHeaderParams & {
    columnSize: ColumnSize;
    highlighted: boolean;
    state: TableBlockState;
    updateState: Dispatch<SetStateAction<TableBlockState>>;
    columnIndex: number;
    addToRecentlyPastedIds: (id: string) => void;
    RichTextBlock: RichTextBlock;
};

const columnSizes: Record<ColumnSize, ReactNode> = {
    extraSmall: <FormattedMessage id="comet.tableBlock.columnSize.extraSmall" defaultMessage="Extra small" />,
    small: <FormattedMessage id="comet.tableBlock.columnSize.small" defaultMessage="Small" />,
    standard: <FormattedMessage id="comet.tableBlock.columnSize.standard" defaultMessage="Standard" />,
    large: <FormattedMessage id="comet.tableBlock.columnSize.large" defaultMessage="Large" />,
    extraLarge: <FormattedMessage id="comet.tableBlock.columnSize.extraLarge" defaultMessage="Extra large" />,
};

export const ColumnHeader = ({
    columnSize,
    highlighted,
    state,
    updateState,
    columnIndex,
    field: columnId,
    addToRecentlyPastedIds,
    RichTextBlock,
}: Props) => {
    const snackbarApi = useSnackbarApi();
    const blockContext = useBlockContext();
    const intl = useIntl();

    const handleInsertColumnAtIndex = (newColumnIndex: number) => {
        updateState((state) => {
            const newColumnInsertData = {
                size: "standard" as const,
                highlighted: false,
                cellValues: state.rows.map(() => RichTextBlock.defaultValues()),
            };
            return insertColumnDataAtIndex(state, newColumnInsertData, newColumnIndex, RichTextBlock);
        });
    };

    const handleDeleteColumn = () => {
        updateState((state) => {
            return removeColumnFromState(state, columnId);
        });
    };

    const handleToggleColumnHighlight = () => {
        updateState((state) => {
            return toggleColumnHighlight(state, columnId);
        });
    };

    const handleSetColumnSize = (size: ColumnSize) => {
        updateState((state) => {
            return setColumnSize(state, columnId, size);
        });
    };

    const handleDuplicateColumn = () => {
        updateState((state) => {
            const duplicatedColumnInsertData = getDuplicatedColumnInsertData(state, columnIndex, RichTextBlock);
            if (!duplicatedColumnInsertData) {
                snackbarApi.showSnackbar(
                    <Snackbar autoHideDuration={5000}>
                        <Alert severity="error">
                            <FormattedMessage id="comet.tableBlock.failedToDuplicateColumn" defaultMessage="Failed to duplicate column" />
                        </Alert>
                    </Snackbar>,
                );
                return state;
            }

            const newColumnId = uuid();
            addToRecentlyPastedIds(newColumnId);
            return insertColumnDataAtIndex(state, duplicatedColumnInsertData, columnIndex + 1, RichTextBlock, newColumnId);
        });
    };

    const handleCopyColumnToClipboard = () => {
        const columnInsertData = getInsertDataFromColumnById(state, columnId, RichTextBlock);
        if (!columnInsertData) {
            snackbarApi.showSnackbar(
                <Snackbar autoHideDuration={5000}>
                    <Alert severity="error">
                        <FormattedMessage id="comet.tableBlock.failedToCopyColumn" defaultMessage="Failed to copy column" />
                    </Alert>
                </Snackbar>,
            );
            return;
        }

        const serializableData = {
            ...columnInsertData,
            cellValues: columnInsertData.cellValues.map((cellValue) => RichTextBlock.state2Output(cellValue)),
        };
        writeClipboardText(JSON.stringify(serializableData));
    };

    const pasteColumnFromClipboard = async () => {
        const clipboardData = await getClipboardValueForSchema(columnInsertSchema);
        if (!clipboardData) {
            snackbarApi.showSnackbar(
                <Snackbar autoHideDuration={5000}>
                    <Alert severity="error">
                        <FormattedMessage id="comet.tableBlock.couldNotPasteClipboardData" defaultMessage="Could not paste the clipboard data" />
                    </Alert>
                </Snackbar>,
            );
            return;
        }

        const deserializedCellValues = await Promise.all(
            clipboardData.cellValues.map((cellValue) => RichTextBlock.output2State(cellValue, blockContext)),
        );

        updateState((state) => {
            const newColumnId = uuid();
            addToRecentlyPastedIds(newColumnId);
            return insertColumnDataAtIndex(
                state,
                { ...clipboardData, cellValues: deserializedCellValues },
                columnIndex + 1,
                RichTextBlock,
                newColumnId,
            );
        });
    };

    return (
        <>
            <DraggableColumnReorderingButton component="div" disableRipple>
                <DragIndicator />
            </DraggableColumnReorderingButton>
            <RowActionsMenu>
                <RowActionsMenu
                    componentsProps={{
                        rowActionsIconItem: {
                            componentsProps: {
                                iconButton: {
                                    "aria-label": intl.formatMessage({
                                        id: "comet.tableBlock.openColumnOptions",
                                        defaultMessage: "Open column options",
                                    }),
                                },
                            },
                        },
                    }}
                >
                    <RowActionsMenu
                        text={<FormattedMessage id="comet.tableBlock.columnWidth" defaultMessage="Column width" />}
                        icon={<DensityStandard />}
                    >
                        {Object.entries(columnSizes).map(([size, label]) => (
                            <RowActionsItem
                                key={size}
                                onClick={() => {
                                    handleSetColumnSize(size as ColumnSize);
                                }}
                                componentsProps={{ menuItem: { selected: columnSize === size } }}
                            >
                                {label}
                            </RowActionsItem>
                        ))}
                    </RowActionsMenu>
                    <RowActionsItem icon={highlighted ? <Remove /> : <Add />} onClick={handleToggleColumnHighlight}>
                        {highlighted ? (
                            <FormattedMessage id="comet.tableBlock.removeHighlighting" defaultMessage="Remove highlighting" />
                        ) : (
                            <FormattedMessage id="comet.tableBlock.highlightColumn" defaultMessage="Highlight column" />
                        )}
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem
                        icon={<PinLeft />}
                        onClick={() => {
                            handleInsertColumnAtIndex(columnIndex);
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.insertColumnLeft" defaultMessage="Insert column left" />
                    </RowActionsItem>
                    <RowActionsItem
                        icon={<PinRight />}
                        onClick={() => {
                            handleInsertColumnAtIndex(columnIndex + 1);
                        }}
                    >
                        <FormattedMessage id="comet.tableBlock.insertColumnRight" defaultMessage="Insert column right" />
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem icon={<Copy />} onClick={handleCopyColumnToClipboard}>
                        <FormattedMessage id="comet.tableBlock.copyColumn" defaultMessage="Copy" />
                    </RowActionsItem>
                    <RowActionsItem icon={<Paste />} onClick={pasteColumnFromClipboard}>
                        <FormattedMessage id="comet.tableBlock.pasteColumn" defaultMessage="Paste" />
                    </RowActionsItem>
                    <RowActionsItem icon={<Duplicate />} onClick={handleDuplicateColumn}>
                        <FormattedMessage id="comet.tableBlock.duplicateColumn" defaultMessage="Duplicate" />
                    </RowActionsItem>
                    <Divider />
                    <RowActionsItem icon={<Delete />} onClick={handleDeleteColumn}>
                        <FormattedMessage id="comet.tableBlock.deleteColumn" defaultMessage="Delete" />
                    </RowActionsItem>
                </RowActionsMenu>
            </RowActionsMenu>
        </>
    );
};

// The first element of type "button" inside the ColumnHeader will automatically be used for column reordering
const DraggableColumnReorderingButton = styled(ButtonBase)(({ theme }) => ({
    position: "absolute",
    inset: 0,
    cursor: "move",
    justifyContent: "flex-start",
    paddingLeft: theme.spacing(2),
})) as typeof ButtonBase;
