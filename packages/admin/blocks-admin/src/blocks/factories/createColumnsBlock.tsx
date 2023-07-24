import { Field, StackPage, StackPageTitle, StackSwitch, StackSwitchApiContext } from "@comet/admin";
import { Add, Copy, Delete, Invisible, Paste, Visible } from "@comet/admin-icons";
import { Checkbox, Divider, FormControlLabel, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { v4 as uuid } from "uuid";

import { AdminComponentButton, BlockPreviewContent } from "../..";
import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { HoverPreviewComponent } from "../../iframebridge/HoverPreviewComponent";
import { SelectPreviewComponent } from "../../iframebridge/SelectPreviewComponent";
import { parallelAsyncEvery } from "../../utils/parallelAsyncEvery";
import { AdminComponentPaper } from "../common/AdminComponentPaper";
import { AdminComponentSection } from "../common/AdminComponentSection";
import { AdminComponentStickyFooter } from "../common/AdminComponentStickyFooter";
import { BlockRow } from "../common/blockRow/BlockRow";
import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockCategory, BlockInputApi, BlockInterface, DispatchSetStateAction, PreviewContent } from "../types";
import { resolveNewState } from "../utils";
import { FinalFormColumnsSelect } from "./columnsBlock/FinalFormColumnsSelect";
import { FinalFormLayoutSelect } from "./columnsBlock/FinalFormLayoutSelect";
import { ListBlockItem, ListBlockState } from "./createListBlock";
import { createUseAdminComponent as createUseListBlockAdminComponent } from "./listBlock/createUseAdminComponent";

export interface ColumnsBlockLayout {
    name: string;
    columns: number;
    label: React.ReactNode;
    preview: React.ReactNode;
    section?:
        | string
        | {
              name: string;
              label?: React.ReactNode;
          };
}

interface ColumnsBlockFragment<T extends BlockInterface> {
    layout: string;
    columns: Array<{
        key: string;
        visible: boolean;
        props: BlockInputApi<T>;
    }>;
}

interface ColumnsBlockState<T extends BlockInterface> {
    layout: ColumnsBlockLayout;
    columns: ListBlockItem<T>[];
}

interface CreateColumnsBlockOptions<T extends BlockInterface> {
    name: string;
    displayName: React.ReactNode;
    category?: BlockCategory;
    contentBlock: T;
    layouts: ColumnsBlockLayout[];
}

export function createColumnsBlock<T extends BlockInterface>({
    name,
    displayName,
    category = BlockCategory.Layout,
    contentBlock,
    layouts,
}: CreateColumnsBlockOptions<T>): BlockInterface<ColumnsBlockFragment<T>, ColumnsBlockState<T>, ColumnsBlockFragment<T>> {
    if (layouts.length === 0) {
        throw new Error(`Number of layouts must be greater than 0!`);
    }

    const useListBlockAdminComponent = createUseListBlockAdminComponent({ block: contentBlock });

    function createEmptyColumns(number: number): ListBlockItem<T>[] {
        return new Array(number).fill(undefined).map(() => ({
            key: uuid(),
            props: contentBlock.defaultValues(),
            selected: false,
            slideIn: false,
            visible: true,
        }));
    }
    const ColumnsBlock: BlockInterface<ColumnsBlockFragment<T>, ColumnsBlockState<T>, ColumnsBlockFragment<T>> = {
        ...createBlockSkeleton(),

        name,

        displayName,

        category,

        defaultValues: () => {
            const defaultLayout = layouts[0];

            const state: ColumnsBlockState<T> = {
                layout: defaultLayout,
                // Add empty columns so the list is not empty initially
                columns: createEmptyColumns(defaultLayout.columns),
            };

            return state;
        },

        input2State: (input) => {
            const layout = layouts.find((layout) => layout.name === input.layout);

            if (!layout) {
                throw new Error(`Unknown layout "${input.layout}"!`);
            }

            return {
                layout,
                columns: input.columns.map((column) => ({
                    key: column.key,
                    props: contentBlock.input2State(column.props),
                    selected: false,
                    slideIn: false,
                    visible: column.visible,
                })),
            };
        },

        state2Output: (output) => ({
            layout: output.layout.name,
            columns: output.columns.map((column) => ({
                key: column.key,
                visible: column.visible,
                props: contentBlock.state2Output(column.props),
            })),
        }),

        output2State: async (output, context) => {
            const layout = layouts.find((layout) => layout.name === output.layout);

            if (!layout) {
                throw new Error(`Unknown layout "${output.layout}"!`);
            }

            const state: ColumnsBlockState<T> = {
                layout,
                columns: [],
            };

            for (const columns of output.columns) {
                state.columns.push({
                    ...columns,
                    props: await contentBlock.output2State(columns.props, context),
                    selected: false,
                    slideIn: false,
                });
            }

            return state;
        },

        createPreviewState: (state, previewContext) => ({
            adminMeta: { route: previewContext.parentUrl },
            layout: state.layout.name,
            columns: state.columns
                .filter((c) => (previewContext.showVisibleOnly ? c.visible : true)) // depending on context show all blocks or only visible blocks
                .map((column) => {
                    const blockAdminRoute = `${previewContext.parentUrl}/${column.key}/edit`;

                    return {
                        key: column.key,
                        visible: column.visible,
                        props: contentBlock.createPreviewState(column.props, { ...previewContext, parentUrl: blockAdminRoute }),
                        adminRoute: blockAdminRoute,
                        adminMeta: { route: blockAdminRoute },
                    };
                }),
        }),

        isValid: (state) => parallelAsyncEvery(state.columns, (column) => contentBlock.isValid(column.props)),

        anchors: (state) => {
            return state.columns.reduce<string[]>((anchors, column) => {
                return [...anchors, ...(contentBlock.anchors?.(column.props) ?? [])];
            }, []);
        },

        AdminComponent: ({ state, updateState }) => {
            const intl = useIntl();
            const groupLayoutsByColumnsApi = createGroupLayoutsByColumnsApi(layouts);
            const handleListBlockAdminChange: DispatchSetStateAction<ListBlockState<T>> = (listBlockSetStateAction) => {
                updateState((prevState) => {
                    const listBlockState = resolveNewState({
                        prevState: { blocks: prevState.columns },
                        setStateAction: listBlockSetStateAction,
                    });
                    return {
                        ...prevState,
                        columns: listBlockState.blocks,
                    };
                });
            };
            const {
                cannotPasteBlockErrorDialog,
                createUpdateSubBlocksFn,
                updateClipboardContent,
                addNewBlock,
                copySelectedBlocks,
                deleteAllSelectedBlocks,
                selectBlock,
                handleToggleSelectAll,
                pasteBlock,
                selectedCount,
                deleteBlocks,
                toggleVisible,
            } = useListBlockAdminComponent({ state: { blocks: state.columns }, updateState: handleListBlockAdminChange });

            return (
                <>
                    <StackSwitch initialPage="list">
                        <StackPage name="list">
                            <BlocksFinalForm<{ layout: ColumnsBlockLayout; columns: number }>
                                onSubmit={({ layout, columns }) => {
                                    updateState((prevState) => {
                                        const defaultLayoutForSelectedColumns = groupLayoutsByColumnsApi.getDefaultLayout(columns);
                                        const newLayout =
                                            layout.columns !== columns && defaultLayoutForSelectedColumns ? defaultLayoutForSelectedColumns : layout;
                                        const missingEmptyColumns =
                                            columns > prevState.columns.length ? createEmptyColumns(columns - prevState.columns.length) : [];
                                        return {
                                            ...prevState,
                                            layout: newLayout,
                                            columns: [...prevState.columns, ...missingEmptyColumns],
                                        };
                                    });
                                }}
                                initialValues={{ layout: state.layout, columns: state.layout.columns }}
                            >
                                <Field
                                    name="columns"
                                    label={<FormattedMessage id="comet.blocks.columns.columns" defaultMessage="Columns" />}
                                    component={FinalFormColumnsSelect}
                                    columns={groupLayoutsByColumnsApi.columns}
                                    fullWidth
                                />
                                <Field
                                    name="layout"
                                    label={<FormattedMessage id="comet.blocks.columns.layout" defaultMessage="Layout" />}
                                    component={FinalFormLayoutSelect}
                                    layouts={groupLayoutsByColumnsApi.getLayouts(state.layout.columns)}
                                    fullWidth
                                />
                            </BlocksFinalForm>
                            <AdminComponentSection title={<FormattedMessage id="comet.blocks.columns.columns" defaultMessage="Columns" />}>
                                <AdminComponentPaper disablePadding>
                                    <StackSwitchApiContext.Consumer>
                                        {(stackApi) => {
                                            return (
                                                <>
                                                    <SelectPreviewComponent>
                                                        <BlockListHeader>
                                                            {state.columns.length ? (
                                                                <SelectAllFromControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={selectedCount === state.columns.length && selectedCount > 0}
                                                                            indeterminate={
                                                                                selectedCount > 0 && selectedCount !== state.columns.length
                                                                            }
                                                                            onChange={handleToggleSelectAll}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <FormattedMessage
                                                                            id="comet.blocks.list.selectAll"
                                                                            defaultMessage="Select all"
                                                                        />
                                                                    }
                                                                />
                                                            ) : (
                                                                <div />
                                                            )}
                                                            <BlockListHeaderActionContainer>
                                                                {selectedCount > 0 && (
                                                                    <>
                                                                        <IconButton onClick={deleteAllSelectedBlocks} size="large">
                                                                            <Delete />
                                                                        </IconButton>
                                                                        <IconButton onClick={copySelectedBlocks} size="large">
                                                                            <Copy />
                                                                        </IconButton>
                                                                    </>
                                                                )}
                                                                <IconButton onClick={() => pasteBlock(0)} size="large">
                                                                    <Paste />
                                                                </IconButton>
                                                            </BlockListHeaderActionContainer>
                                                        </BlockListHeader>

                                                        <Divider />
                                                        <div>
                                                            {state.columns.map((column, columnIndex) => {
                                                                return (
                                                                    <HoverPreviewComponent key={column.key} componentSlug={`${column.key}/content`}>
                                                                        <BlockRow
                                                                            id={column.key}
                                                                            renderPreviewContent={() => (
                                                                                <BlockPreviewContent block={contentBlock} state={column.props} />
                                                                            )}
                                                                            index={columnIndex}
                                                                            onContentClick={() => {
                                                                                stackApi.activatePage("edit", column.key);
                                                                            }}
                                                                            onDeleteClick={() => {
                                                                                deleteBlocks([column.key]);
                                                                            }}
                                                                            moveBlock={(dragIndex: number, hoverIndex: number) => {
                                                                                const columns = [...state.columns];
                                                                                const dragItem = state.columns[dragIndex];
                                                                                columns[dragIndex] = state.columns[hoverIndex];
                                                                                columns[hoverIndex] = dragItem;
                                                                                updateState((prevState) => ({ ...prevState, columns }));
                                                                            }}
                                                                            visibilityButton={
                                                                                <IconButton onClick={() => toggleVisible(column.key)} size="small">
                                                                                    {column.visible ? (
                                                                                        <Visible color="secondary" />
                                                                                    ) : (
                                                                                        <Invisible color="action" />
                                                                                    )}
                                                                                </IconButton>
                                                                            }
                                                                            onAddNewBlock={(beforeIndex) => {
                                                                                const key = addNewBlock(beforeIndex);
                                                                                stackApi.activatePage("edit", key);
                                                                            }}
                                                                            onCopyClick={() => {
                                                                                updateClipboardContent([
                                                                                    {
                                                                                        name: contentBlock.name,
                                                                                        visible: column.visible,
                                                                                        state: column.props,
                                                                                    },
                                                                                ]);
                                                                            }}
                                                                            onPasteClick={() => {
                                                                                pasteBlock(columnIndex + 1);
                                                                            }}
                                                                            selected={column.selected}
                                                                            onSelectedClick={(selected) => {
                                                                                selectBlock(column, selected);
                                                                            }}
                                                                            isValidFn={() => contentBlock.isValid(column.props)}
                                                                            slideIn={column.slideIn}
                                                                            hideBottomInsertBetweenButton={columnIndex >= state.columns.length - 1}
                                                                        />
                                                                    </HoverPreviewComponent>
                                                                );
                                                            })}
                                                        </div>
                                                        {state.columns.length === 0 ? (
                                                            <AdminComponentButton
                                                                variant="primary"
                                                                onClick={() => {
                                                                    const key = addNewBlock();
                                                                    stackApi.activatePage("edit", key);
                                                                }}
                                                                size="large"
                                                            >
                                                                <LargeAddButtonContent>
                                                                    <LargeAddButtonIcon />
                                                                    <Typography>
                                                                        <FormattedMessage
                                                                            id="comet.blocks.columns.addColumn"
                                                                            defaultMessage="Add column"
                                                                        />
                                                                    </Typography>
                                                                </LargeAddButtonContent>
                                                            </AdminComponentButton>
                                                        ) : (
                                                            <AdminComponentStickyFooter>
                                                                <AdminComponentButton
                                                                    variant="primary"
                                                                    onClick={() => {
                                                                        const key = addNewBlock();
                                                                        stackApi.activatePage("edit", key);
                                                                    }}
                                                                    size="large"
                                                                    startIcon={<Add />}
                                                                >
                                                                    <FormattedMessage
                                                                        id="comet.blocks.columns.addColumn"
                                                                        defaultMessage="Add column"
                                                                    />
                                                                </AdminComponentButton>
                                                            </AdminComponentStickyFooter>
                                                        )}
                                                    </SelectPreviewComponent>
                                                </>
                                            );
                                        }}
                                    </StackSwitchApiContext.Consumer>
                                </AdminComponentPaper>
                            </AdminComponentSection>
                        </StackPage>
                        <StackPage name="edit" title={intl.formatMessage({ id: "comet.blocks.columns.editColumn", defaultMessage: "Edit column" })}>
                            {(key) => {
                                const matchIndex = state.columns.findIndex((column) => column.key === key);

                                if (matchIndex === -1) {
                                    return <FormattedMessage id="comet.blocks.columns.unknownColumn" defaultMessage="Can't find column" />;
                                }

                                const match = state.columns[matchIndex];

                                return (
                                    <StackPageTitle title={columnCountLabel(intl, matchIndex + 1)}>
                                        <contentBlock.AdminComponent state={match.props} updateState={createUpdateSubBlocksFn(key)} />
                                    </StackPageTitle>
                                );
                            }}
                        </StackPage>
                    </StackSwitch>
                    {cannotPasteBlockErrorDialog}
                </>
            );
        },

        previewContent: (state, context) => {
            if (state.columns.length === 0) {
                return [
                    {
                        type: "text",
                        content: <FormattedMessage id="comet.blocks.columns.noColumns" defaultMessage="No columns" />,
                    },
                ];
            }

            return state.columns.reduce<PreviewContent[]>(
                (previewContent, currentColumn) => [...previewContent, ...contentBlock.previewContent(currentColumn.props, context)],
                [],
            );
        },
    };

    return ColumnsBlock;
}

const BlockListHeader = styled("div")`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const BlockListHeaderActionContainer = styled("div")`
    padding: 12px 0;
`;

const SelectAllFromControlLabel = styled(FormControlLabel)`
    padding: 15px 10px 15px 7px;
`;

const LargeAddButtonContent = styled("span")`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 0;
`;

const LargeAddButtonIcon = styled(Add)`
    font-size: 24px;
    margin-bottom: 8px;
`;

type GroupedLayoutsByColumnsApi = {
    columns: number[];
    getLayouts: (columns: number) => ColumnsBlockLayout[];
    getDefaultLayout: (columns: number) => ColumnsBlockLayout | undefined;
};

function columnCountLabel(intl: IntlShape, count: number): string {
    return intl.formatMessage(
        {
            id: "comet.blocks.columns.columnTitle",
            defaultMessage: "Column {number}",
        },
        { number: count },
    );
}

function createGroupLayoutsByColumnsApi(layouts: ColumnsBlockLayout[]): GroupedLayoutsByColumnsApi {
    const groupedLayouts = layouts.reduce((acc, c) => {
        acc.set(c.columns, [...(acc.get(c.columns) || []), c]);
        return acc;
    }, new Map<number, ColumnsBlockLayout[]>());

    return {
        columns: Array.from(groupedLayouts.keys()),
        getLayouts: (columns: number) => {
            return groupedLayouts.get(columns) || [];
        },
        getDefaultLayout: (columns: number) => {
            const layouts = groupedLayouts.get(columns) || [];
            return layouts.length ? layouts[0] : undefined;
        },
    };
}
