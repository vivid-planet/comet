import { Box, Divider } from "@mui/material";
import isEqual from "lodash.isequal";
import * as React from "react";
import { Route, useRouteMatch } from "react-router";

import { Collapsible } from "../../common/Collapsible";
import { CollapsibleSwitchButtonHeader } from "../../common/CollapsibleSwitchButtonHeader";
import { AdminComponentPaper } from "../common/AdminComponentPaper";
import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { BlockInputApi, BlockInterface, BlockState, DispatchSetStateAction } from "../types";
import { resolveNewState } from "../utils";

// @TODO: move to general types
// type BlockDecorator = <T extends BlockInterface>(block: T) => BlockInterface;

export interface OptionalBlockState<DecoratedBlock extends BlockInterface> {
    block?: BlockState<DecoratedBlock>;
    visible: boolean;
}

export interface OptionalBlockDecoratorFragment<DecoratedBlock extends BlockInterface> {
    block?: BlockInputApi<DecoratedBlock>;
    visible: boolean;
}

export function createOptionalBlock<T extends BlockInterface>(
    decoratedBlock: T,
    options?: { title?: React.ReactNode; name?: string },
): BlockInterface<OptionalBlockDecoratorFragment<T>, OptionalBlockState<T>> {
    const OptionalBlock: BlockInterface<OptionalBlockDecoratorFragment<T>, OptionalBlockState<T>> = {
        ...createBlockSkeleton(),

        name: options?.name ?? `Optional${decoratedBlock.name}`,

        displayName: decoratedBlock.displayName,

        defaultValues: () => ({ block: undefined, visible: false }),

        input2State: (input) => {
            return {
                ...input,
                block: input.block ? decoratedBlock.input2State(input.block) : undefined,
            };
        },
        state2Output: (s) => {
            return {
                ...s,
                block: s.block ? decoratedBlock.state2Output(s.block) : undefined,
            };
        },

        output2State: async (output, context) => ({
            ...output,
            block: output.block ? await decoratedBlock.output2State(output.block, context) : undefined,
        }),

        createPreviewState: (state, previewCtx) => {
            return {
                ...state,
                block: state.block ? decoratedBlock.createPreviewState(state.block, previewCtx) : undefined,
                adminMeta: { route: previewCtx.parentUrl },
            };
        },
        isValid: async (state) => !state.block || (await decoratedBlock.isValid(state.block)),

        definesOwnTitle: true,

        AdminComponent: ({ state, updateState }) => {
            const match = useRouteMatch();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateSubBlocksFn: DispatchSetStateAction<any> = (setStateAction) => {
                updateState((prevState) => ({
                    ...prevState,
                    block: resolveNewState({ prevState: prevState.block ? prevState.block : decoratedBlock.defaultValues(), setStateAction }),
                }));
            };

            return (
                <Route path={match.url}>
                    {({ match }) =>
                        match?.isExact ? (
                            <AdminComponentPaper disablePadding>
                                <Collapsible
                                    open={state.visible}
                                    header={<CollapsibleSwitchButtonHeader checked={state.visible} title={options?.title} />}
                                    onChange={(open) => {
                                        updateState((prevState) => {
                                            if (open) {
                                                // we need the default state of the decorated block now
                                                if (!prevState.block) {
                                                    return {
                                                        ...prevState,
                                                        block: decoratedBlock.defaultValues(),
                                                        visible: open,
                                                    };
                                                } else {
                                                    return {
                                                        ...prevState,
                                                        visible: open,
                                                    };
                                                }
                                            } else {
                                                // decorated block is turned off, clean up the state of decorated block
                                                // we do not save the default state
                                                if (isEqual(decoratedBlock.defaultValues(), prevState.block)) {
                                                    return {
                                                        ...prevState,
                                                        block: undefined,
                                                        visible: open,
                                                    };
                                                } else {
                                                    return {
                                                        ...prevState,
                                                        visible: open,
                                                    };
                                                }
                                            }
                                        });
                                    }}
                                >
                                    <Divider />
                                    <Box padding={decoratedBlock.definesOwnPadding ? 0 : 3}>
                                        <decoratedBlock.AdminComponent
                                            updateState={updateSubBlocksFn}
                                            state={state.block ? state.block : decoratedBlock.defaultValues()}
                                        />
                                    </Box>
                                </Collapsible>
                            </AdminComponentPaper>
                        ) : (
                            <decoratedBlock.AdminComponent
                                updateState={updateSubBlocksFn}
                                state={state.block ? state.block : decoratedBlock.defaultValues()}
                            />
                        )
                    }
                </Route>
            );
        },
        previewContent: ({ block, visible }, ctx) => {
            return block && visible ? decoratedBlock.previewContent(block, ctx) : [];
        },
    };
    return OptionalBlock;
}
