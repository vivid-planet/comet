import { Dialog, OkayButton, useStackApi } from "@comet/admin";
import { DialogActions } from "@mui/material";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { v4 as uuid } from "uuid";

import { type TableBlockData, type TableBlockInput } from "../blocks.generated";
import { type BlockContext } from "./context/BlockContext";
import { type RichTextBlock, type RichTextBlockState } from "./createRichTextBlock";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";
import { TableBlockContextProvider } from "./table/TableBlockContext";
import { TableBlockGrid } from "./table/TableBlockGrid";
import { BlockCategory, type BlockInterface, type BlockPreviewContext } from "./types";

export type TableBlockFactoryOptions = {
    richText: RichTextBlock;
};

interface TableBlockCellValueState {
    columnId: string;
    value: RichTextBlockState;
}

export interface TableBlockRowState {
    id: string;
    highlighted: boolean;
    cellValues: TableBlockCellValueState[];
}

export interface TableBlockState {
    columns: TableBlockData["columns"];
    rows: TableBlockRowState[];
}

type TableBlock = BlockInterface<TableBlockData, TableBlockState, TableBlockInput>;

export const createTableBlock = ({ richText: RichTextBlock }: TableBlockFactoryOptions, override?: (block: TableBlock) => TableBlock): TableBlock => {
    const getInitialTableState = (): TableBlockState => {
        const columnIdOne = uuid();
        const columnIdTwo = uuid();

        return {
            columns: [
                { id: columnIdOne, size: "standard", highlighted: false },
                { id: columnIdTwo, size: "standard", highlighted: false },
            ],
            rows: [
                {
                    id: uuid(),
                    highlighted: false,
                    cellValues: [
                        { columnId: columnIdOne, value: RichTextBlock.defaultValues() },
                        { columnId: columnIdTwo, value: RichTextBlock.defaultValues() },
                    ],
                },
                {
                    id: uuid(),
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
            rows: input.rows.map((row) => ({
                ...row,
                cellValues: row.cellValues.map((cell) => ({
                    ...cell,
                    value: RichTextBlock.input2State(cell.value),
                })),
            })),
        }),

        state2Output: (state: TableBlockState): TableBlockInput => ({
            columns: state.columns,
            rows: state.rows.map((row) => ({
                ...row,
                cellValues: row.cellValues.map((cell) => ({
                    ...cell,
                    value: RichTextBlock.state2Output(cell.value),
                })),
            })),
        }),

        output2State: async (output: TableBlockInput, context: BlockContext): Promise<TableBlockState> => ({
            columns: output.columns,
            rows: await Promise.all(
                output.rows.map(async (row) => ({
                    ...row,
                    cellValues: await Promise.all(
                        row.cellValues.map(async (cell) => ({
                            ...cell,
                            value: await RichTextBlock.output2State(cell.value, context),
                        })),
                    ),
                })),
            ),
        }),

        createPreviewState: (state: TableBlockState, previewCtx: BlockPreviewContext & BlockContext) => ({
            columns: state.columns,
            rows: state.rows.map((row) => ({
                ...row,
                cellValues: row.cellValues.map((cell) => ({
                    ...cell,
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
                <TableBlockContextProvider RichTextBlock={RichTextBlock}>
                    <SelectPreviewComponent>
                        <BlocksFinalForm<TableBlockState> onSubmit={updateState} initialValues={state}>
                            <Dialog
                                open={showDialog}
                                maxWidth="xl"
                                onClose={closeTableBlock}
                                title={intl.formatMessage({ id: "comet.blocks.table.displayName", defaultMessage: "Table" })}
                                PaperProps={{ sx: { height: "100%", maxHeight: 880 } }}
                                sx={(theme) => ({ zIndex: theme.zIndex.modal - 2 })}
                            >
                                <TableBlockGrid state={state} updateState={updateState} />
                                <DialogActions>
                                    <OkayButton onClick={closeTableBlock} />
                                </DialogActions>
                            </Dialog>
                        </BlocksFinalForm>
                    </SelectPreviewComponent>
                </TableBlockContextProvider>
            );
        },
    };

    if (override) {
        return override(TableBlock);
    }

    return TableBlock;
};
