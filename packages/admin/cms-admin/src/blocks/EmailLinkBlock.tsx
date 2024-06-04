import { Field, FinalFormInput } from "@comet/admin";
import { BlockCategory, BlockInterface, BlocksFinalForm, createBlockSkeleton, SelectPreviewComponent } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface EmailLinkBlockData {
    email?: string;
}

interface EmailLinkBlockInput {
    email?: string;
}

export const EmailLinkBlock: BlockInterface<EmailLinkBlockData, EmailLinkBlockData, EmailLinkBlockInput> = {
    ...createBlockSkeleton(),

    name: "Email",

    displayName: <FormattedMessage id="comet.blocks.link.email" defaultMessage="Email" />,

    defaultValues: () => ({ email: undefined }),

    category: BlockCategory.Navigation,

    input2State: (state) => {
        return state;
    },

    state2Output: (state) => {
        return {
            email: state.email,
        };
    },

    output2State: async (output) => {
        return {
            email: output.email,
        };
    },

    isValid: (state) => {
        return state.email ? isEmail(state.email) : true;
    },

    AdminComponent: ({ state, updateState }) => {
        return (
            <SelectPreviewComponent>
                <BlocksFinalForm
                    onSubmit={(newState: EmailLinkBlockData) => {
                        updateState((prevState) => ({ ...prevState, ...newState }));
                    }}
                    initialValues={state}
                >
                    <Field
                        label={<FormattedMessage id="comet.blocks.link.email" defaultMessage="Email" />}
                        name="email"
                        component={FinalFormInput}
                        fullWidth
                        validate={(email: string) => {
                            if (email && !isEmail(email)) {
                                return <FormattedMessage id="comet.blocks.link.email.invalid" defaultMessage="Invalid e-mail address" />;
                            }
                        }}
                    />
                </BlocksFinalForm>
            </SelectPreviewComponent>
        );
    },
    previewContent: (state) => {
        return state.email ? [{ type: "text", content: state.email }] : [];
    },
};

const isEmail = (text: string) => {
    return !!String(text)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
};
