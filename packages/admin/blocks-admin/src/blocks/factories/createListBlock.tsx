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
import { deduplicateBlockDependencies } from "../helpers/deduplicateBlockDependencies";
import { BlockDependency, BlockInterface, BlockState, PreviewContent } from "../types";
import { createUseAdminComponent } from "./listBlock/createUseAdminComponent";

// Using {} instead of Record<string, never> because never and unknown are incompatible.
// eslint-disable-next-line @typescript-eslint/ban-types
type DefaultAdditionalItemFields = {};

export type ListBlockItem<T extends BlockInterface, AdditionalItemFields extends Record<string, unknown> = DefaultAdditionalItemFields> = {
    [key: string]: unknown;
    key: string;
    visible: boolean;
    props: BlockState<T>;
    selected: boolean;
    slideIn: boolean;
} & AdditionalItemFields;

export interface ListBlockState<T extends BlockInterface, AdditionalItemFields extends Record<string, unknown> = DefaultAdditionalItemFields> {
    blocks: ListBlockItem<T, AdditionalItemFields>[];
}

export interface ListBlockFragment<AdditionalItemFields extends Record<string, unknown> = DefaultAdditionalItemFields> {
    blocks: Array<
        {
            [key: string]: unknown;
            key: string;
            visible: boolean;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props: any;
        } & AdditionalItemFields
    >;
}

export interface ListBlockOutput<AdditionalItemFields extends Record<string, unknown> = DefaultAdditionalItemFields> {
    blocks: Array<
        {
            [key: string]: unknown;
            key: string;
            visible: boolean;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props: any;
        } & AdditionalItemFields
    >;
}

export interface ListBlockAdditionalItemField<Value = unknown> {
    defaultValue: Value;
}

interface CreateListBlockOptions<T extends BlockInterface, AdditionalItemFields extends Record<string, unknown>> {
    name: string;
    displayName?: React.ReactNode;
    itemName?: React.ReactNode;
    itemsName?: React.ReactNode;
    block: T;
    maxVisibleBlocks?: number;
    createDefaultListEntry?: boolean;
    additionalItemFields?: {
        [Key in keyof AdditionalItemFields]: ListBlockAdditionalItemField<AdditionalItemFields[Key]>;
    };
    AdditionalItemContextMenuItems?: React.FunctionComponent<{
        item: ListBlockItem<T, AdditionalItemFields>;
        onChange: (item: ListBlockItem<T, AdditionalItemFields>) => void;
        onMenuClose: () => void;
    }>;
    AdditionalItemContent?: React.FunctionComponent<{ item: ListBlockItem<T, AdditionalItemFields> }>;
}

export function createListBlock<T extends BlockInterface, AdditionalItemFields extends Record<string, unknown> = DefaultAdditionalItemFields>({
    name,
    block,
    displayName = <FormattedMessage id="comet.blocks.listBlock.name" defaultMessage="List" />,
    itemName = <FormattedMessage id="comet.blocks.listBlock.itemName" defaultMessage="block" />,
    itemsName = <FormattedMessage id="comet.blocks.listBlock.itemsName" defaultMessage="blocks" />,
    maxVisibleBlocks,
    createDefaultListEntry,
    additionalItemFields,
    AdditionalItemContextMenuItems,
    AdditionalItemContent,
}: CreateListBlockOptions<T, AdditionalItemFields>): BlockInterface<
    ListBlockFragment<AdditionalItemFields>,
    ListBlockState<T, AdditionalItemFields>,
    ListBlockOutput<AdditionalItemFields>
> {
    const useAdminComponent = createUseAdminComponent({ block, maxVisibleBlocks, additionalItemFields });
    const BlockListBlock: BlockInterface<
        ListBlockFragment<AdditionalItemFields>,
        ListBlockState<T, AdditionalItemFields>,
        ListBlockOutput<AdditionalItemFields>
    > = {
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
                          // Type cast to suppress "'AdditionalItemFields' could be instantiated with a different subtype of constraint 'Record<string, unknown>'" error
                          ...(Object.entries(additionalItemFields ?? {}).reduce(
                              (fields, [field, { defaultValue }]) => ({ ...fields, [field]: defaultValue }),
                              {},
                          ) as AdditionalItemFields),
                      },
                  ]
                : [],
        }),

        category: block.category,

        input2State: (input) => {
            return {
                ...input,
                blocks: input.blocks.map((child) => {
                    return {
                        ...child,
                        key: child.key,
                        visible: child.visible,
                        props: block.input2State(child.props),
                        ...Object.keys(additionalItemFields ?? {}).reduce((fields, field) => ({ ...fields, [field]: child[field] }), {}),
                        selected: false,
                        slideIn: false,
                    };
                }),
            };
        },

        state2Output: (state) => {
            return {
                blocks: state.blocks.map((child) => {
                    return {
                        key: child.key,
                        visible: child.visible,
                        props: block.state2Output(child.props),
                        // Type cast to suppress "'AdditionalItemFields' could be instantiated with a different subtype of constraint 'Record<string, unknown>'" error
                        ...(Object.keys(additionalItemFields ?? {}).reduce(
                            (fields, field) => ({ ...fields, [field]: child[field] }),
                            {},
                        ) as AdditionalItemFields),
                    };
                }),
            };
        },

        output2State: async (output, context) => {
            const state: ListBlockState<T, AdditionalItemFields> = {
                blocks: [],
            };

            for (const child of output.blocks) {
                state.blocks.push({
                    slideIn: false,
                    ...child,
                    props: await block.output2State(child.props, context),
                    selected: false,
                });
            }

            return state;
        },

        createPreviewState: (state, previewCtx) => {
            return {
                adminRoute: previewCtx.parentUrl,
                blocks: state.blocks
                    .filter((child) => (previewCtx.showVisibleOnly ? child.visible : true)) // depending on context show all blocks or only visible blocks
                    .map((child) => {
                        const blockAdminRoute = `${previewCtx.parentUrlSubRoute ?? previewCtx.parentUrl}/${child.key}/edit`;

                        return {
                            key: child.key,
                            visible: child.visible,
                            props: block.createPreviewState(child.props, { ...previewCtx, parentUrl: blockAdminRoute }),
                            // Type cast to suppress "'AdditionalItemFields' could be instantiated with a different subtype of constraint 'Record<string, unknown>'" error
                            ...(Object.keys(additionalItemFields ?? {}).reduce(
                                (fields, field) => ({ ...fields, [field]: child[field] }),
                                {},
                            ) as AdditionalItemFields),
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

        dependencies: (state) => {
            const mergedDependencies = state.blocks.reduce<BlockDependency[]>((dependencies, child) => {
                return [...dependencies, ...(block.dependencies?.(child.props) ?? [])];
            }, []);

            return deduplicateBlockDependencies(mergedDependencies);
        },

        replaceDependenciesInOutput: (output, replacements) => {
            const newOutput: ListBlockOutput<AdditionalItemFields> = { ...output, blocks: [] };

            for (const child of output.blocks) {
                newOutput.blocks.push({
                    ...child,
                    props: block.replaceDependenciesInOutput(child.props, replacements),
                });
            }

            return newOutput;
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
                                                                        moveBlock={(from, to) => {
                                                                            updateState((prevState) => {
                                                                                const blocks = [...prevState.blocks];
                                                                                const blockToMove = blocks.splice(from, 1)[0];
                                                                                blocks.splice(to, 0, blockToMove);
                                                                                return { ...prevState, blocks };
                                                                            });
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
                                                                                    additionalFields: Object.keys(additionalItemFields ?? {}).reduce(
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
