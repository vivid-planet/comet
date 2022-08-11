import { Field, FieldContainer, FinalFormRadio, FinalFormSelect } from "@comet/admin";
import { Box, Divider, FormControlLabel, MenuItem, ToggleButton as MuiToggleButton, ToggleButtonGroup as MuiToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { BlocksFinalForm } from "../../form/BlocksFinalForm";
import { HoverPreviewComponent } from "../../iframebridge/HoverPreviewComponent";
import { SelectPreviewComponent } from "../../iframebridge/SelectPreviewComponent";
import { parallelAsyncEvery } from "../../utils/parallelAsyncEvery";
import { useAdminComponentPaper } from "../common/AdminComponentPaper";
import { HiddenInSubroute } from "../common/HiddenInSubroute";
import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockCategory, BlockInterface, BlockState, DispatchSetStateAction, PreviewStateInterface } from "../types";
import { resolveNewState } from "../utils";

interface OneOfBlockItem<T extends BlockInterface = BlockInterface> {
    type: string;
    props: BlockState<T>;
}

export interface OneOfBlockState {
    attachedBlocks: OneOfBlockItem[];
    activeType: string | null;
}

export interface OneOfBlockFragment {
    attachedBlocks: {
        type: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props: any;
    }[];
    activeType: string | null;
}

export interface OneOfBlockPreviewState extends PreviewStateInterface {
    block?: {
        type: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props: any;
    };
}

type BlockType = string;
export interface CreateOneOfBlockOptions {
    name: string;
    displayName?: React.ReactNode;
    supportedBlocks: Record<BlockType, BlockInterface>;
    category?: BlockCategory;
    variant?: "select" | "radio" | "toggle";
    allowEmpty?: boolean;
}

export const createOneOfBlock = ({
    supportedBlocks,
    name,
    displayName = "Switch",
    category = BlockCategory.Other,
    variant = "select",
    allowEmpty = true,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
CreateOneOfBlockOptions): BlockInterface<OneOfBlockFragment, OneOfBlockState, any, OneOfBlockPreviewState> => {
    function blockForType(type: string): BlockInterface | null {
        return supportedBlocks[type] ?? null;
    }
    // helper to get common values of the selected block by State
    function getActiveBlock(s: OneOfBlockState) {
        if (!s.activeType) {
            return {
                state: undefined,
                block: undefined,
                type: undefined,
            };
        }
        const activeBlockState = s.attachedBlocks.find((c) => c.type === s.activeType);
        if (!activeBlockState) {
            throw new Error(`Reference to active block of type ${s.activeType} not found`);
        }
        const block = activeBlockState ? blockForType(activeBlockState.type) : undefined;

        return {
            state: activeBlockState,
            block,
            type: activeBlockState.type,
        };
    }

    const options: Array<{ value: string; label: React.ReactNode }> = allowEmpty
        ? [{ value: "none", label: <FormattedMessage id="comet.blocks.oneOfBlock.empty" defaultMessage="None" /> }]
        : [];

    Object.entries(supportedBlocks).forEach(([blockType, block]) => {
        options.push({
            value: blockType,
            label: block.displayName,
        });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const OneOfBlock: BlockInterface<OneOfBlockFragment, OneOfBlockState, any, OneOfBlockPreviewState> = {
        ...createBlockSkeleton(),

        name,

        displayName,

        category,

        defaultValues: () => {
            if (allowEmpty) {
                return {
                    attachedBlocks: [],
                    activeType: null,
                };
            } else {
                const [blockType, block] = Object.entries(supportedBlocks)[0];

                return {
                    attachedBlocks: [{ type: blockType, props: block.defaultValues() }],
                    activeType: blockType,
                };
            }
        },

        input2State: (input) => {
            const activeType = input.activeType && supportedBlocks[input.activeType] ? input.activeType : null;

            const attachedBlocks: OneOfBlockItem[] = [];

            for (const item of input.attachedBlocks) {
                const block = blockForType(item.type);

                if (!block) {
                    // eslint-disable-next-line no-console
                    console.warn(`Unknown block type "${item.type}"`);
                    continue;
                }

                attachedBlocks.push({ ...item, props: block.input2State(item.props) });
            }

            return {
                activeType,
                attachedBlocks,
            };
        },
        state2Output: (s) => {
            return {
                attachedBlocks: s.attachedBlocks.map((c) => {
                    const block = blockForType(c.type);
                    if (!block) {
                        throw new Error(`No Block found for type ${c.type}`); // for TS
                    }
                    return {
                        type: c.type,
                        props: block.state2Output(c.props),
                    };
                }),
                activeType: s.activeType,
            };
        },

        output2State: async (output, context) => {
            const state: OneOfBlockState = {
                attachedBlocks: [],
                activeType: output.activeType,
            };

            for (const item of output.attachedBlocks) {
                const block = blockForType(item.type);

                if (!block) {
                    throw new Error(`No Block found for type ${item.type}`);
                }

                state.attachedBlocks.push({
                    ...item,
                    props: await block.output2State(item.props, context),
                });
            }

            return state;
        },

        createPreviewState: (state, previewCtx) => {
            const { state: blockState, block } = getActiveBlock(state);

            return {
                block: blockState
                    ? {
                          type: blockState.type,
                          props: {
                              ...block?.createPreviewState(blockState.props, previewCtx),
                              adminMeta: { route: `${previewCtx.parentUrl}#${blockState.type}` },
                          },
                      }
                    : undefined,
            };
        },

        isValid: async (state) =>
            await parallelAsyncEvery(state.attachedBlocks, async (c) => {
                const block = blockForType(c.type);
                if (!block) {
                    throw new Error(`No Block found for type ${c.type}`); // for TS
                }
                return await block.isValid(c.props);
            }),

        definesOwnPadding: true,

        AdminComponent: ({ state, updateState }) => {
            const isInPaper = useAdminComponentPaper();

            const handleBlockSelect = React.useCallback(
                (blockType: string) => {
                    updateState((prevState) => {
                        let newState: OneOfBlockState = prevState;
                        if (blockType === "none") {
                            // unselect, no block selected
                            newState = { ...prevState, activeType: null };
                        } else {
                            // check if we have a block of the same type already
                            const match = prevState.attachedBlocks.find((c) => c.type === blockType);
                            if (match) {
                                // we have an existing block with same type, so select it
                                newState = {
                                    ...prevState,
                                    activeType: blockType,
                                };
                            } else {
                                // we have no existing block, we need to create and select a new block
                                const block = blockForType(blockType);
                                if (!block) {
                                    throw new Error(`No Block found for type ${blockType}`);
                                }

                                const newItem: OneOfBlockItem = {
                                    type: blockType,
                                    props: block.defaultValues(),
                                };

                                newState = {
                                    ...prevState,
                                    attachedBlocks: [...prevState.attachedBlocks, newItem],
                                    activeType: blockType,
                                };
                            }
                        }
                        // clean up the previous selected block
                        // when previous block has no values (values are equal to default values)
                        // then we remove the block
                        // this prevents from saving possibly invalid blocks for irrelevant (not selected) blocks
                        const previousSelectedBlock = getActiveBlock(prevState);
                        const newSelectedBlock = getActiveBlock(newState);

                        if (previousSelectedBlock.block && previousSelectedBlock.state && newSelectedBlock.type !== previousSelectedBlock.type) {
                            if (isEqual(previousSelectedBlock.block.defaultValues(), previousSelectedBlock.state.props)) {
                                newState = {
                                    ...newState,
                                    attachedBlocks: newState.attachedBlocks.filter((c) => c.type !== previousSelectedBlock.state.type),
                                };
                            }
                        }

                        return newState;
                    });
                },
                [updateState],
            );

            const createUpdateSubBlocksFn = React.useCallback(
                (blockType: string) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const updateSubBlocksFn: DispatchSetStateAction<any> = (setStateAction) => {
                        updateState((prevState) => ({
                            ...prevState,
                            attachedBlocks: prevState.attachedBlocks.map((c) =>
                                c.type === blockType ? { ...c, props: resolveNewState({ prevState: c.props, setStateAction }) } : c,
                            ),
                        }));
                    };
                    return updateSubBlocksFn;
                },
                [updateState],
            );

            const activeBlock = getActiveBlock(state);
            const selectedBlockType = activeBlock.block ? activeBlock.state.type : "none";

            return (
                <SelectPreviewComponent>
                    <HiddenInSubroute>
                        <Box paddingBottom={isInPaper ? 0 : 3}>
                            <BlocksFinalForm<{ blockType: string }>
                                onSubmit={({ blockType }) => {
                                    handleBlockSelect(blockType);
                                }}
                                initialValues={{
                                    blockType: selectedBlockType,
                                }}
                            >
                                {variant === "select" && (
                                    <>
                                        <Box padding={isInPaper ? 3 : 0}>
                                            <Field
                                                name="blockType"
                                                fullWidth
                                                label={<FormattedMessage id="comet.blocks.oneOf.blockType" defaultMessage="Type" />}
                                            >
                                                {(props) => (
                                                    <FinalFormSelect {...props} fullWidth>
                                                        {options.map((option) => (
                                                            <MenuItem value={option.value} key={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </FinalFormSelect>
                                                )}
                                            </Field>
                                        </Box>
                                        {isInPaper && activeBlock.block && <Divider />}
                                    </>
                                )}
                                {variant === "radio" && (
                                    <>
                                        <Box display="flex" flexDirection="column" padding={3}>
                                            <FieldContainer label={<FormattedMessage id="comet.blocks.oneOf.blockType" defaultMessage="Type" />}>
                                                {options.map((option) => (
                                                    <Field key={option.value} name="blockType" type="radio" value={option.value} fullWidth>
                                                        {(props) => <FormControlLabel label={option.label} control={<FinalFormRadio {...props} />} />}
                                                    </Field>
                                                ))}
                                            </FieldContainer>
                                        </Box>
                                        {activeBlock.block && <Divider />}
                                    </>
                                )}
                                {variant === "toggle" && (
                                    <>
                                        <Box padding={isInPaper ? 3 : 0}>
                                            <Field
                                                name="blockType"
                                                fullWidth
                                                label={<FormattedMessage id="comet.blocks.oneOf.blockType" defaultMessage="Type" />}
                                            >
                                                {({ input: { value, onChange } }) => (
                                                    <ToggleButtonGroup
                                                        value={value}
                                                        onChange={(event, blockType: string | null) => {
                                                            if (blockType) {
                                                                onChange(blockType);
                                                            }
                                                        }}
                                                        exclusive
                                                    >
                                                        {options.map((option) => (
                                                            <ToggleButton value={option.value} key={option.value}>
                                                                {option.label}
                                                            </ToggleButton>
                                                        ))}
                                                    </ToggleButtonGroup>
                                                )}
                                            </Field>
                                        </Box>
                                        {isInPaper && activeBlock.block && <Divider />}
                                    </>
                                )}
                            </BlocksFinalForm>
                        </Box>
                    </HiddenInSubroute>
                    {activeBlock.block && activeBlock.state ? (
                        <Box padding={isInPaper && !activeBlock.block.definesOwnPadding ? 3 : 0}>
                            <HoverPreviewComponent key={activeBlock.type} componentSlug={`#${activeBlock.type}`}>
                                <activeBlock.block.AdminComponent
                                    state={activeBlock.state.props}
                                    updateState={createUpdateSubBlocksFn(activeBlock.state.type)}
                                />
                            </HoverPreviewComponent>
                        </Box>
                    ) : null}
                </SelectPreviewComponent>
            );
        },
        previewContent: (state, ctx) => {
            const { block, state: activeBlockState } = getActiveBlock(state);

            if (block && activeBlockState) {
                return block.previewContent(activeBlockState.props, ctx);
            } else {
                return [];
            }
        },

        dynamicDisplayName: (state) => {
            const { block } = getActiveBlock(state);

            if (block != null) {
                return block.displayName;
            } else {
                return displayName;
            }
        },
    };
    return OneOfBlock;
};

const ToggleButtonGroup = styled(MuiToggleButtonGroup)`
    display: flex;
`;

const ToggleButton = styled(MuiToggleButton)`
    flex: 1;
    color: ${({ theme }) => theme.palette.text.primary};
`;
