import { CheckboxField, Field, FinalFormInput } from "@comet/admin";
import { FormattedMessage } from "react-intl";

import { type ExternalLinkBlockData, type ExternalLinkBlockInput } from "../blocks.generated";
import { isLinkTarget } from "../validation/isLinkTarget";
import { validateLinkTarget } from "../validation/validateLinkTarget";
import { BlocksFinalForm } from "./form/BlocksFinalForm";
import { createBlockSkeleton } from "./helpers/createBlockSkeleton";
import { SelectPreviewComponent } from "./iframebridge/SelectPreviewComponent";
import { BlockCategory, type BlockInterface, type LinkBlockInterface } from "./types";

type State = ExternalLinkBlockData;

export const ExternalLinkBlock: BlockInterface<ExternalLinkBlockData, State, ExternalLinkBlockInput> & LinkBlockInterface<State> = {
    ...createBlockSkeleton(),

    name: "ExternalLink",

    displayName: <FormattedMessage id="comet.blocks.externalLink" defaultMessage="External Link" />,

    defaultValues: () => ({ targetUrl: undefined, openInNewWindow: false }),

    category: BlockCategory.Navigation,

    input2State: (state) => {
        return state;
    },

    state2Output: (state) => {
        return {
            targetUrl: state.targetUrl,
            openInNewWindow: state.openInNewWindow,
        };
    },

    output2State: async (output) => {
        return {
            targetUrl: output.targetUrl,
            openInNewWindow: output.openInNewWindow,
        };
    },

    isValid: (state) => {
        return state.targetUrl ? isLinkTarget(state.targetUrl) : true;
    },

    url2State: (url) => {
        if (isLinkTarget(url)) {
            return {
                targetUrl: url,
                openInNewWindow: false,
            };
        }

        return false;
    },

    AdminComponent: ({ state, updateState }) => {
        return (
            <SelectPreviewComponent>
                <BlocksFinalForm
                    onSubmit={(newState) => {
                        updateState(newState);
                    }}
                    initialValues={state}
                >
                    <Field
                        label={<FormattedMessage id="comet.blocks.link.external.targetUrl" defaultMessage="URL" />}
                        name="targetUrl"
                        component={FinalFormInput}
                        fullWidth
                        validate={(url) => validateLinkTarget(url)}
                        disableContentTranslation
                    />
                    <CheckboxField
                        label={<FormattedMessage id="comet.blocks.link.external.openInNewWindow" defaultMessage="Open in new window" />}
                        name="openInNewWindow"
                    />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },
    previewContent: (state) => {
        return state.targetUrl ? [{ type: "text", content: state.targetUrl }] : [];
    },

    extractTextContents: (state) => (state.targetUrl ? [state.targetUrl] : []),
};
