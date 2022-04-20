import { Field, FinalFormCheckbox, FinalFormInput } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, SelectPreviewComponent } from "@comet/admin-blocks";
import { FormControlLabel } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ExternalLinkBlockData, ExternalLinkBlockInput } from "../blocks.generated";
import { isHref } from "./externalLinkBlock/isHref";

type State = ExternalLinkBlockData;

export const ExternalLinkBlock: BlockInterface<ExternalLinkBlockData, State, ExternalLinkBlockInput> = {
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
        return state.targetUrl ? isHref(state.targetUrl) : true;
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
                        validate={(url) => {
                            if (url && !isHref(url)) {
                                return <FormattedMessage id="comet.blocks.link.external.targetUrl.invalid" defaultMessage="Invalid URL" />;
                            }
                        }}
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
