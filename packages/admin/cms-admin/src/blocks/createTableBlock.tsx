import { Dialog, OkayButton, useStackApi } from "@comet/admin";
import { DialogActions } from "@mui/material";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type RichTextBlockData, type RichTextBlockInput, type TableBlockData, type TableBlockInput } from "../blocks.generated";
import { type BlockContext } from "./context/BlockContext";
import {
    createRichTextBlock,
    type RichTextBlock as RichTextBlockType,
    type RichTextBlockFactoryOptions,
    type RichTextBlockState,
} from "./createRichTextBlock";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";
import { TableBlockGrid } from "./table/TableBlockGrid";
import { BlockCategory, type BlockInterface, type BlockPreviewContext } from "./types";

export type ColumnSize = "extraSmall" | "small" | "standard" | "large" | "extraLarge";

export interface TableBlockColumn {
    id: string;
    size: ColumnSize;
    highlighted: boolean;
}

export interface TableBlockCellValueData {
    columnId: string;
    value: RichTextBlockData;
}

export interface TableBlockRowData {
    id: string;
    highlighted: boolean;
    cellValues: TableBlockCellValueData[];
}

export interface TableBlockData {
    columns: TableBlockColumn[];
    rows: TableBlockRowData[];
}

export interface TableBlockCellValueInput {
    columnId: string;
    value: RichTextBlockInput;
}

export interface TableBlockRowInput {
    id: string;
    highlighted: boolean;
    cellValues: TableBlockCellValueInput[];
}

export interface TableBlockInput {
    columns: TableBlockColumn[];
    rows: TableBlockRowInput[];
}

export interface TableBlockCellValueState {
    columnId: string;
    value: RichTextBlockState;
}

export interface TableBlockRowState {
    id: string;
    highlighted: boolean;
    cellValues: TableBlockCellValueState[];
}

export interface TableBlockState {
    columns: TableBlockColumn[];
    rows: TableBlockRowState[];
}

export type RichTextBlock = RichTextBlockType;

type TableBlock = BlockInterface<TableBlockData, TableBlockState, TableBlockInput>;

export type TableBlockFactoryOptions = {
    rte: RichTextBlockFactoryOptions;
};

export const createTableBlock = (options: TableBlockFactoryOptions, override?: (block: TableBlock) => TableBlock): TableBlock => {
    const RichTextBlock = createRichTextBlock(options.rte);

    const getInitialTableState = (): TableBlockState => {
        const columnIdOne = crypto.randomUUID();
        const columnIdTwo = crypto.randomUUID();

        return {
            columns: [
                { id: columnIdOne, size: "standard", highlighted: false },
                { id: columnIdTwo, size: "standard", highlighted: false },
            ],
            rows: [
                {
                    id: crypto.randomUUID(),
                    highlighted: false,
                    cellValues: [
                        { columnId: columnIdOne, value: RichTextBlock.defaultValues() },
                        { columnId: columnIdTwo, value: RichTextBlock.defaultValues() },
                    ],
                },
                {
                    id: crypto.randomUUID(),
                    highlighted: false,
                    cellValues: [
                        { columnId: columnIdOne, value: RichTextBlock.defaultValues() },
                        { columnId: columnIdTwo, value: RichTextBlock.defaultValues() },
                    ],
                },
            ],
        };
    };

    const TableBlock: TableBlock = {
        ...createBlockSkeleton(),

        name: "Table",
        displayName: <FormattedMessage id="comet.blocks.table.displayName" defaultMessage="Table" />,
        category: BlockCategory.TextAndContent,

        defaultValues: getInitialTableState,

        input2State: (input: TableBlockData): TableBlockState => ({
            columns: input.columns,
            rows: input.rows.map((row: TableBlockRowData) => ({
                ...row,
                cellValues: row.cellValues.map((cell: TableBlockCellValueData) => ({
                    columnId: cell.columnId,
                    value: RichTextBlock.input2State(cell.value),
                })),
            })),
        }),

        state2Output: (state: TableBlockState): TableBlockInput => ({
            columns: state.columns,
            rows: state.rows.map((row: TableBlockRowState) => ({
                ...row,
                cellValues: row.cellValues.map((cell: TableBlockCellValueState) => ({
                    columnId: cell.columnId,
                    value: RichTextBlock.state2Output(cell.value),
                })),
            })),
        }),

        output2State: async (output: TableBlockInput, context: BlockContext): Promise<TableBlockState> => ({
            columns: output.columns,
            rows: await Promise.all(
                output.rows.map(async (row: TableBlockRowInput) => ({
                    ...row,
                    cellValues: await Promise.all(
                        row.cellValues.map(async (cell: TableBlockCellValueInput) => ({
                            columnId: cell.columnId,
                            value: await RichTextBlock.output2State(cell.value, context),
                        })),
                    ),
                })),
            ),
        }),

        createPreviewState: (state: TableBlockState, previewCtx: BlockPreviewContext & BlockContext) => ({
            columns: state.columns,
            rows: state.rows.map((row: TableBlockRowState) => ({
                ...row,
                cellValues: row.cellValues.map((cell: TableBlockCellValueState) => ({
                    columnId: cell.columnId,
                    value: RichTextBlock.createPreviewState(cell.value, previewCtx),
                })),
            })),
            adminMeta: { route: previewCtx.parentUrl },
        }),

        AdminComponent: ({ state, updateState }) => {
            const stackApi = useStackApi();
            const intl = useIntl();
            const [showDialog, setShowDialog] = useState(true);

            const closeTableBlock = () => {
                setShowDialog(false);
                stackApi?.goBack();
            };

            return (
                <SelectPreviewComponent>
                    <BlocksFinalForm<TableBlockState> onSubmit={updateState} initialValues={state}>
                        <Dialog
                            open={showDialog}
                            maxWidth="xl"
                            onClose={closeTableBlock}
                            title={intl.formatMessage({ id: "comet.blocks.table.displayName", defaultMessage: "Table" })}
                            PaperProps={{ sx: { height: "100%", maxHeight: 880 } }}
                        >
                            <TableBlockGrid state={state} updateState={updateState} RichTextBlock={RichTextBlock} />
                            <DialogActions>
                                <OkayButton onClick={closeTableBlock} />
                            </DialogActions>
                        </Dialog>
                    </BlocksFinalForm>
                </SelectPreviewComponent>
            );
        },
    };

    if (override) {
        return override(TableBlock);
    }

    return TableBlock;
};
