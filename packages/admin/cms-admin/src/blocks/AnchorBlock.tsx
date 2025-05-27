import { Field, FinalFormInput } from "@comet/admin";
import { FormattedMessage, useIntl } from "react-intl";

import { type AnchorBlockData, type AnchorBlockInput } from "../blocks.generated";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";
import { BlockCategory, type BlockInterface } from "./types";

const AnchorBlock: BlockInterface<AnchorBlockData, AnchorBlockData, AnchorBlockInput> = {
    ...createBlockSkeleton(),

    defaultValues: () => ({ name: undefined }),

    name: "Anchor",

    displayName: <FormattedMessage id="comet.blocks.anchor.displayName" defaultMessage="Anchor" />,

    category: BlockCategory.Navigation,

    AdminComponent: ({ state: { name }, updateState }) => {
        const intl = useIntl();

        return (
            <SelectPreviewComponent>
                <BlocksFinalForm<AnchorBlockData> onSubmit={updateState} initialValues={{ name }}>
                    <Field
                        name="name"
                        label={<FormattedMessage id="comet.blocks.anchor.label" defaultMessage="Anchor" />}
                        placeholder={intl.formatMessage({ id: "comet.blocks.anchor.placeholder", defaultMessage: "Name" })}
                        component={FinalFormInput}
                        fullWidth
                    />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },

    anchors: (state) => {
        return state.name !== undefined ? [state.name] : [];
    },

    previewContent: (state) => {
        return state.name !== undefined ? [{ type: "text", content: `#${state.name}` }] : [];
    },

    extractTextContents: (state) => {
        return state.name !== undefined ? [state.name] : [];
    },
};

export { AnchorBlock };
