import { Field, FinalFormInput } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, SelectPreviewComponent } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { AnchorBlockData, AnchorBlockInput } from "../blocks.generated";

const AnchorBlock: BlockInterface<AnchorBlockData, AnchorBlockData, AnchorBlockInput> = {
    ...createBlockSkeleton(),

    defaultValues: () => ({ name: undefined }),

    name: "Anchor",

    displayName: <FormattedMessage id="comet.blocks.anchor.displayName" defaultMessage="Anchor" />,

    category: BlockCategory.Navigation,

    AdminComponent: ({ state: { name }, updateState }) => {
        return (
            <SelectPreviewComponent>
                <BlocksFinalForm<AnchorBlockData> onSubmit={updateState} initialValues={{ name }}>
                    <Field
                        name="name"
                        label={<FormattedMessage id="comet.blocks.anchor.label" defaultMessage="Anchor" />}
                        component={FinalFormInput}
                        fullWidth
                    />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },

    getAnchors: (state) => {
        return state.name !== undefined ? [state.name] : [];
    },

    previewContent: (state) => {
        return state.name !== undefined ? [{ type: "text", content: `#${state.name}` }] : [];
    },
};

export { AnchorBlock };
