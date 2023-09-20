import { StackPage, StackSwitch, StackSwitchApiContext } from "@comet/admin";
import { Add, Copy, Delete, Invisible, Paste, Visible } from "@comet/admin-icons";
import { Checkbox, FormControlLabel, IconButton, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

import { HoverPreviewComponent } from "../../iframebridge/HoverPreviewComponent";
import { SelectPreviewComponent } from "../../iframebridge/SelectPreviewComponent";
import { parallelAsyncEvery } from "../../utils/parallelAsyncEvery";
import { AdminComponentButton } from "../common/AdminComponentButton";
import { AdminComponentPaper } from "../common/AdminComponentPaper";
import { AdminComponentStickyFooter } from "../common/AdminComponentStickyFooter";
import { AdminComponentStickyHeader } from "../common/AdminComponentStickyHeader";
import { BlockPreviewContent } from "../common/blockRow/BlockPreviewContent";
import { BlockRow } from "../common/blockRow/BlockRow";
import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockInterface, BlockState, PreviewContent } from "../types";
import { createUseAdminComponent } from "./listBlock/createUseAdminComponent";

export interface ListBlockItem<T extends BlockInterface> {
    [key: string]: unknown;
    key: string;
    visible: boolean;
    props: BlockState<T>;
    selected: boolean;
    slideIn: boolean;
}

export interface ListBlockState<T extends BlockInterface> {
    blocks: ListBlockItem<T>[];
}

export interface ListBlockFragment {
    blocks: Array<{
        [key: string]: unknown;
        key: string;
        visible: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props: any;
    }>;
}

export interface AdditionalItemField<Value = unknown> {
    defaultValue: Value;
}

interface CreateListBlockOptions<T extends BlockInterface> {
    name: string;
    displayName?: React.ReactNode;
    itemName?: React.ReactNode;
    itemsName?: React.ReactNode;
    block: T;
    maxVisibleBlocks?: number;
    createDefaultListEntry?: boolean;
    additionalItemFields?: Record<string, AdditionalItemField>;
    AdditionalItemContextMenuItems?: React.FunctionComponent<{
        item: ListBlockItem<T>;
        onChange: (item: ListBlockItem<T>) => void;
        onMenuClose: () => void;
    }>;
    AdditionalItemContent?: React.FunctionComponent<{ item: ListBlockItem<T> }>;
}

export function createListBlock<T extends BlockInterface>({
    name,
    block,
    displayName = <FormattedMessage id="comet.blocks.listBlock.name" defaultMessage="List" />,
    itemName = <FormattedMessage id="comet.blocks.listBlock.itemName" defaultMessage="block" />,
    itemsName = <FormattedMessage id="comet.blocks.listBlock.itemsName" defaultMessage="blocks" />,
    maxVisibleBlocks,
    createDefaultListEntry,
    additionalItemFields = {},
    AdditionalItemContextMenuItems,
    AdditionalItemContent,
}: CreateListBlockOptions<T>): BlockInterface<ListBlockFragment, ListBlockState<T>> {
    const useAdminComponent = createUseAdminComponent({ block, maxVisibleBlocks, additionalItemFields });
    const BlockListBlock: BlockInterface<ListBlockFragment, ListBlockState<T>> = {
        ...createBlockSkeleton(),

        name,

        displayName,

        defaultValues: () => ({
            blocks: createDefaultListEntry
                ? [
                      {
                          key: uuid(),
                          visible: true,
                          props: block.defaultValues(),
                          selected: false,
                          slideIn: false,
                          ...Object.entries(additionalItemFields).reduce(
                              (fields, [field, { defaultValue }]) => ({ ...fields, [field]: defaultValue }),
                              {},
                          ),
                      },
                  ]
                : [],
        }),

        category: block.category,

        input2State: (s) => {
            return {
                ...s,
                blocks: s.blocks.map((c) => {
                    return {
                        ...c,
                        key: c.key,
                        visible: c.visible,
                        props: block.input2State(c.props),
                        ...Object.keys(additionalItemFields).reduce((fields, field) => ({ ...fields, [field]: c[field] }), {}),
                        selected: false,
                        slideIn: false,
                    };
                }),
            };
        },

        state2Output: (s) => {
            return {
                blocks: s.blocks.map((c) => {
                    return {
                        key: c.key,
                        visible: c.visible,
                        props: block.state2Output(c.props),
                        ...Object.keys(additionalItemFields).reduce((fields, field) => ({ ...fields, [field]: c[field] }), {}),
                    };
                }),
            };
        },

        output2State: async (output, context) => {
            const state: ListBlockState<T> = {
                blocks: [],
            };

            for (const item of output.blocks) {
                state.blocks.push({
                    ...item,
                    props: await block.output2State(item.props, context),
                    selected: false,
                });
            }

            return state;
        },

        createPreviewState: (state, previewCtx) => {
            return {
                adminRoute: previewCtx.parentUrl,
                blocks: state.blocks
                    .filter((c) => (previewCtx.showVisibleOnly ? c.visible : true)) // depending on context show all blocks or only visible blocks
                    .map((c) => {
                        const blockAdminRoute = `${previewCtx.parentUrl}/${c.key}/edit`;

                        return {
                            key: c.key,
                            visible: c.visible,
                            props: block.createPreviewState(c.props, { ...previewCtx, parentUrl: blockAdminRoute }),
                            ...Object.keys(additionalItemFields).reduce((fields, field) => ({ ...fields, [field]: c[field] }), {}),
                            adminRoute: blockAdminRoute,
                            adminMeta: { route: blockAdminRoute },
                        };
                    }),
                adminMeta: { route: previewCtx.parentUrl },
            };
        },
        isValid: async (state) => parallelAsyncEvery(state.blocks, async (c) => block.isValid(c.props)),

        childBlockCount: (state) => state.blocks.length,

        anchors: (state) => {
            return state.blocks.reduce<string[]>((anchors, child) => {
                return [...anchors, ...(block.anchors?.(child.props) ?? [])];
            }, []);
        },

        definesOwnPadding: true,

        AdminComponent: ({ state, updateState }) => {
            const {
                cannotPasteBlockErrorDialog,
                createUpdateSubBlocksFn,
                totalVisibleBlocks,
                updateClipboardContent,
                addNewBlock,
                copySelectedBlocks,
                deleteAllSelectedBlocks,
                selectBlock,
                handleToggleSelectAll,
                pasteBlock,
                selectedCount,
                toggleVisible,
                deleteBlocks,
            } = useAdminComponent({ state, updateState });

            return (
                <SelectPreviewComponent>
                    <StackSwitch>
                        <StackPage name="table">
                            <StackSwitchApiContext.Consumer>
                                {(stackApi) => {
                                    return (
                                        <>
                                            <SelectPreviewComponent>
                                                <AdminComponentPaper disablePadding>
                                                    <AdminComponentStickyHeader>
                                                        <BlockListHeader>
                                                            {state.blocks.length ? (
                                                                <SelectAllFromControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={selectedCount === state.blocks.length && selectedCount > 0}
                                                                            indeterminate={selectedCount > 0 && selectedCount !== state.blocks.length}
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
                                                    </AdminComponentStickyHeader>
                                                    <div>
                                                        {state.blocks.map((data, blockIndex) => {
                                                            const canChangeVisibility =
                                                                maxVisibleBlocks && totalVisibleBlocks >= maxVisibleBlocks ? data.visible : true;
                                                            return (
                                                                <HoverPreviewComponent key={data.key} componentSlug={`${data.key}/edit`}>
                                                                    <BlockRow
                                                                        id={data.key}
                                                                        renderPreviewContent={() => (
                                                                            <BlockPreviewContent block={block} state={data.props} />
                                                                        )}
                                                                        index={blockIndex}
                                                                        onContentClick={() => {
                                                                            stackApi.activatePage("edit", data.key);
                                                                        }}
                                                                        onDeleteClick={() => {
                                                                            deleteBlocks([data.key]);
                                                                        }}
                                                                        moveBlock={(dragIndex: number, hoverIndex: number) => {
                                                                            const blocks = [...state.blocks];
                                                                            const dragItem = state.blocks[dragIndex];
                                                                            blocks[dragIndex] = state.blocks[hoverIndex];
                                                                            blocks[hoverIndex] = dragItem;
                                                                            updateState((prevState) => ({ ...prevState, blocks }));
                                                                        }}
                                                                        visibilityButton={
                                                                            canChangeVisibility ? (
                                                                                <IconButton onClick={() => toggleVisible(data.key)} size="small">
                                                                                    {data.visible ? (
                                                                                        <Visible color="secondary" />
                                                                                    ) : (
                                                                                        <Invisible color="action" />
                                                                                    )}
                                                                                </IconButton>
                                                                            ) : (
                                                                                <Tooltip
                                                                                    title={
                                                                                        <FormattedMessage
                                                                                            id="comet.blocks.list.maxVisibleBlocks"
                                                                                            defaultMessage="Max visible blocks: {maxVisibleBlocks}"
                                                                                            values={{ maxVisibleBlocks }}
                                                                                        />
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        <IconButton disabled size="small">
                                                                                            {data.visible ? (
                                                                                                <Visible color="secondary" />
                                                                                            ) : (
                                                                                                <Invisible color="action" />
                                                                                            )}
                                                                                        </IconButton>
                                                                                    </span>
                                                                                </Tooltip>
                                                                            )
                                                                        }
                                                                        onAddNewBlock={(beforeIndex) => {
                                                                            const key = addNewBlock(beforeIndex);
                                                                            stackApi.activatePage("edit", key);
                                                                        }}
                                                                        onCopyClick={() => {
                                                                            updateClipboardContent([
                                                                                {
                                                                                    name: block.name,
                                                                                    visible: data.visible,
                                                                                    state: data.props,
                                                                                    additionalFields: Object.keys(additionalItemFields).reduce(
                                                                                        (fields, field) => ({ ...fields, [field]: data[field] }),
                                                                                        {},
                                                                                    ),
                                                                                },
                                                                            ]);
                                                                        }}
                                                                        onPasteClick={() => {
                                                                            pasteBlock(blockIndex + 1);
                                                                        }}
                                                                        selected={data.selected}
                                                                        onSelectedClick={(selected) => {
                                                                            selectBlock(data, selected);
                                                                        }}
                                                                        isValidFn={() => block.isValid(data.props)}
                                                                        slideIn={data.slideIn}
                                                                        hideBottomInsertBetweenButton={blockIndex >= state.blocks.length - 1}
                                                                        additionalMenuItems={(onMenuClose) =>
                                                                            AdditionalItemContextMenuItems ? (
                                                                                <AdditionalItemContextMenuItems
                                                                                    item={data}
                                                                                    onChange={(updatedItem) => {
                                                                                        updateState((previousState) => ({
                                                                                            blocks: previousState.blocks.map((block) =>
                                                                                                block.key === data.key ? updatedItem : block,
                                                                                            ),
                                                                                        }));
                                                                                    }}
                                                                                    onMenuClose={onMenuClose}
                                                                                />
                                                                            ) : undefined
                                                                        }
                                                                        additionalContent={
                                                                            AdditionalItemContent ? <AdditionalItemContent item={data} /> : undefined
                                                                        }
                                                                    />
                                                                </HoverPreviewComponent>
                                                            );
                                                        })}
                                                    </div>
                                                    {state.blocks.length === 0 ? (
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
                                                                        id="comet.blocks.list.add"
                                                                        defaultMessage="Add {itemName}"
                                                                        values={{ itemName }}
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
                                                                    id="comet.blocks.list.add"
                                                                    defaultMessage="Add {itemName}"
                                                                    values={{ itemName }}
                                                                />
                                                            </AdminComponentButton>
                                                        </AdminComponentStickyFooter>
                                                    )}
                                                </AdminComponentPaper>
                                            </SelectPreviewComponent>
                                        </>
                                    );
                                }}
                            </StackSwitchApiContext.Consumer>
                        </StackPage>
                        <StackPage name="edit" title={block.displayName}>
                            {(itemId) => (
                                <StackSwitchApiContext.Consumer>
                                    {(stackApi) => {
                                        const match = state.blocks.find((c) => c.key === itemId);
                                        if (!match) {
                                            stackApi.activatePage("main", "");
                                            return;
                                        }

                                        return <block.AdminComponent state={match.props} updateState={createUpdateSubBlocksFn(itemId)} />;
                                    }}
                                </StackSwitchApiContext.Consumer>
                            )}
                        </StackPage>
                    </StackSwitch>
                    {cannotPasteBlockErrorDialog}
                </SelectPreviewComponent>
            );
        },
        previewContent: (state, ctx) => {
            if (state.blocks.length === 0) {
                return [
                    {
                        type: "text",
                        content: <FormattedMessage id="comet.blocks.list.noBlocks" defaultMessage="No {itemsName}" values={{ itemsName }} />,
                    },
                ];
            }

            return state.blocks.reduce<PreviewContent[]>((prev, next) => {
                const nextPreviewContent = block.previewContent(next.props, ctx);
                return [...prev, ...nextPreviewContent];
            }, []);
        },
    };
    return BlockListBlock;
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
