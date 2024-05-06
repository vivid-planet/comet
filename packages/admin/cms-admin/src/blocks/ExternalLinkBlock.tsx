import { Field, FinalFormCheckbox, FinalFormInput } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, LinkBlockInterface, SelectPreviewComponent } from "@comet/blocks-admin";
import { FormControlLabel } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ExternalLinkBlockData, ExternalLinkBlockInput } from "../blocks.generated";
import { isLinkTarget } from "../validation/isLinkTarget";
import { validateUrl } from "../validation/validateUrl";

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
                        updateState((prevState) => ({ ...prevState, ...newState }));
                    }}
                    initialValues={state}
                >
                    <Field
                        label={<FormattedMessage id="comet.blocks.link.external.targetUrl" defaultMessage="URL" />}
                        name="targetUrl"
                        component={FinalFormInput}
                        fullWidth
                        validate={(url) => validateUrl(url)}
                        disableContentTranslation
                    />
                    <Field name="openInNewWindow" type="checkbox">
                        {(props) => (
                            <FormControlLabel
                                label={<FormattedMessage id="comet.blocks.link.external.openInNewWindow" defaultMessage="Open in new window" />}
                                control={<FinalFormCheckbox {...props} />}
                            />
                        )}
                    </Field>
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },
    previewContent: (state) => {
        return state.targetUrl ? [{ type: "text", content: state.targetUrl }] : [];
    },
};
