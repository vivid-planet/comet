import { Field, FinalFormInput } from "@comet/admin";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SpaceBlockData, SpaceBlockInput } from "../blocks.generated";
import { BlocksFinalForm } from "../form/BlocksFinalForm";
import { SelectPreviewComponent } from "../iframebridge/SelectPreviewComponent";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { BlockCategory, BlockInterface } from "./types";

type State = SpaceBlockData;

const isHeightValid = (h: number) => h <= 1000;

const DEFAULT_HEIGHT = 100;

export const SpaceBlock: BlockInterface<SpaceBlockData, State, SpaceBlockInput> = {
    ...createBlockSkeleton(),

    name: "Space",

    displayName: <FormattedMessage id="comet.blocks.space" defaultMessage="Space" />,

    defaultValues: () => ({ height: DEFAULT_HEIGHT }),

    category: BlockCategory.Layout,

    createPreviewState: (state, previewContext) => ({
        ...(SpaceBlock.isValid(state) ? state : SpaceBlock.defaultValues()),
        adminMeta: { route: previewContext.parentUrl },
    }),
    isValid: (state) => isHeightValid(state.height),

    AdminComponent: ({ state, updateState }) => {
        const intl = useIntl();

        return (
            <SelectPreviewComponent>
                <BlocksFinalForm onSubmit={updateState} initialValues={state}>
                    <Field
                        validate={(v) => {
                            if (!isHeightValid(v)) {
                                return intl.formatMessage(
                                    {
                                        id: "comet.blocks.space.validationError",
                                        defaultMessage: "The maximum height is {limit, number}px",
                                    },
                                    { limit: 1000 },
                                );
                            }
                        }}
                        label={<FormattedMessage id="comet.blocks.space.height" defaultMessage="Height" />}
                        name="height"
                        type="number"
                        required
                        component={FinalFormInput}
                        parse={(v: string) => (v ? Number(v) : 0)}
                        fullWidth
                    />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },

    previewContent: ({ height }) => {
        return [{ type: "text", content: `${height}px` }];
    },
};
